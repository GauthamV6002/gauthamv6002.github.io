import * as THREE from "three";

import { AsciiEffect } from "three/addons/effects/AsciiEffect.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { ConvexHull } from "three/addons/math/ConvexHull.js";

let camera: THREE.PerspectiveCamera;
let scene: THREE.Scene;
let renderer: THREE.WebGLRenderer;
let effect: AsciiEffect;
let asciiModel: THREE.Object3D;
let mixer: THREE.AnimationMixer;

// Points outlining the hand through every frame of the wave, in the model's own
// space. Measured once after loading; see outlineOf().
let handOutline: THREE.Vector3[] = [];

const HAND_TILT_X = 0.2;
const HAND_REST_ROTATION_Y = -0.2;
let asciiModelRotation = HAND_REST_ROTATION_Y;

// Mouse Tracker
const mapRange = (
  value: number,
  fromMin: number,
  fromMax: number,
  toMin: number,
  toMax: number
): number =>
  ((value - fromMin) * (toMax - toMin)) / (fromMax - fromMin) + toMin;

setTimeout(() => {
  document.addEventListener("mousemove", (e: MouseEvent) => {
    const windowWidthHalf = window.innerWidth / 2;
    const x = e.clientX - windowWidthHalf;

    const maxThetaX = 60 * (Math.PI / 180);
    asciiModelRotation =
      mapRange(x, -windowWidthHalf, windowWidthHalf, -maxThetaX, maxThetaX) -
      Math.PI / 4;
  });
}, 1500);

// Hand placement -------------------------------------------------------------
//
// The hand is sized and positioned to fill a region of the viewport rather than
// with fixed world coordinates, so it lands in the same spot relative to the hero
// copy at any resolution or aspect ratio.

/** A box on screen, as fractions of the viewport (0 = left/top, 1 = right/bottom). */
interface ScreenRegion {
  left: number;
  right: number;
  top: number;
  bottom: number;
}

// Wide screens put the hand beside the copy; everything else stacks it above.
// Must match the "HERO LAYOUT" media queries in style.css.
const isSideBySideLayout = (): boolean =>
  window.innerWidth >= 1024 ||
  (window.innerWidth > window.innerHeight && window.innerWidth >= 640);

function handRegion(): ScreenRegion {
  const w = window.innerWidth;
  const h = window.innerHeight;

  if (isSideBySideLayout()) {
    // Start just past the paragraph's column so the hand never sits behind text.
    const copy = document.querySelector("#hero p");
    const copyRight = copy ? copy.getBoundingClientRect().right / w : 0.55;
    const left = THREE.MathUtils.clamp(copyRight + 0.015, 0.5, 0.72);
    return { left, right: 0.98, top: 0.1, bottom: 0.9 };
  }

  // Stacked: the band between the social links and the copy, which starts at
  // the hero's top padding.
  const nav = document.querySelector(".social-nav");
  const hero = document.getElementById("hero");
  const top = (nav ? nav.getBoundingClientRect().bottom : 56) + 8;
  const copyTop = hero ? parseFloat(getComputedStyle(hero).paddingTop) : 0.4 * h;
  const bottom = Math.max(copyTop - 8, top + 40);
  return { left: 0.08, right: 0.92, top: top / h, bottom: bottom / h };
}

/**
 * The convex hull of the hand mesh swept through every keyframe of the wave, in
 * the model's own space. Fitting these points instead of a bounding box keeps
 * the fit tight and guarantees the whole wave stays inside the region.
 */
function outlineOf(model: THREE.Object3D, wave: THREE.AnimationClip | null): THREE.Vector3[] {
  const meshes: THREE.Mesh[] = [];
  model.traverse((object) => {
    if ((object as THREE.Mesh).isMesh) meshes.push(object as THREE.Mesh);
  });

  // The orientations the wave moves the hand through (every other keyframe is
  // plenty for a hull), or just the rest pose if there is no wave.
  const track = wave?.tracks.find((t) => t.name.endsWith(".quaternion"));
  const node = track
    ? model.getObjectByName(THREE.PropertyBinding.parseTrackName(track.name).nodeName)
    : undefined;
  const poses: (THREE.Quaternion | undefined)[] = [];
  if (track && node) {
    for (let i = 0; i < track.times.length; i += 2) {
      poses.push(new THREE.Quaternion().fromArray(track.values, i * 4));
    }
  } else {
    poses.push(undefined);
  }

  const points: THREE.Vector3[] = [];
  const restPose = node?.quaternion.clone();
  for (const pose of poses) {
    if (node && pose) node.quaternion.copy(pose);
    model.updateMatrixWorld(true);
    for (const mesh of meshes) {
      const position = mesh.geometry.attributes.position as THREE.BufferAttribute;
      for (let i = 0; i < position.count; i++) {
        points.push(
          new THREE.Vector3().fromBufferAttribute(position, i).applyMatrix4(mesh.matrixWorld)
        );
      }
    }
  }
  if (node && restPose) {
    node.quaternion.copy(restPose);
    model.updateMatrixWorld(true);
  }

  const outline = new Set<THREE.Vector3>();
  for (const face of new ConvexHull().setFromPoints(points).faces) {
    let edge = face.edge;
    do {
      outline.add(edge.head().point);
      edge = edge.next;
    } while (edge !== face.edge);
  }
  return Array.from(outline);
}

const projectedPoint = new THREE.Vector3();
const projectedPoint2d = new THREE.Vector2();
const projected = new THREE.Box2();

/** Screen-space (NDC) bounds of the hand across the given y-rotations, and its mean depth. */
function projectHand(rotationsY: number[]): { bounds: THREE.Box2; depth: number } {
  projected.makeEmpty();
  let depth = 0;

  // project() reads the camera's cached inverse matrix, which only the renderer
  // refreshes; update it here so each measurement sees the camera's current spot.
  camera.updateMatrixWorld(true);

  for (const rotationY of rotationsY) {
    asciiModel.rotation.y = rotationY;
    asciiModel.updateMatrixWorld(true);

    for (const point of handOutline) {
      projectedPoint.copy(point).applyMatrix4(asciiModel.matrixWorld);
      depth += projectedPoint.z;
      projectedPoint.project(camera);
      projected.expandByPoint(projectedPoint2d.set(projectedPoint.x, projectedPoint.y));
    }
  }

  return { bounds: projected, depth: depth / (rotationsY.length * handOutline.length) };
}

/**
 * Sizes and places the hand so it fills its on-screen region. The hand stays on
 * the camera axis, so it is drawn the same way at every aspect ratio, and is
 * moved across the screen by shifting the camera's frustum instead.
 */
function fitHandToScreen(): void {
  if (!asciiModel || handOutline.length === 0) return;

  const w = window.innerWidth;
  const h = window.innerHeight;
  const region = handRegion();

  // Size for the whole range the mouse can turn the hand through (see the mouse
  // tracker above) so it never swings out of its region.
  const rotations = [
    HAND_REST_ROTATION_Y,
    -Math.PI / 4 - Math.PI / 3,
    -Math.PI / 4,
    -Math.PI / 4 + Math.PI / 3,
  ];
  const size = new THREE.Vector2();
  const center = new THREE.Vector2();

  camera.clearViewOffset();

  // Distance: projected size is close to inversely proportional to distance, so
  // a few rounds of measure-and-correct converge.
  const targetWidth = 2 * (region.right - region.left); // NDC spans 2 units
  const targetHeight = 2 * (region.bottom - region.top);
  for (let i = 0; i < 5; i++) {
    const { bounds, depth } = projectHand(rotations);
    bounds.getSize(size);
    if (size.x <= 0 || size.y <= 0) break;
    const scale = Math.min(targetWidth / size.x, targetHeight / size.y);
    camera.position.z = depth + (camera.position.z - depth) / scale;
  }

  // Placement: shift the frustum so the hand's centre lands on the region's centre.
  projectHand(rotations).bounds.getCenter(center);
  const handX = ((center.x + 1) / 2) * w;
  const handY = ((1 - center.y) / 2) * h;
  const targetX = ((region.left + region.right) / 2) * w;
  const targetY = ((region.top + region.bottom) / 2) * h;
  camera.setViewOffset(w, h, handX - targetX, handY - targetY, w, h);

  asciiModel.rotation.y = asciiModelRotation;
}

// Scene ------------------------------------------------------------------------

function init(): void {
  camera = new THREE.PerspectiveCamera(
    70,
    window.innerWidth / window.innerHeight,
    1,
    1000
  );
  camera.position.z = 13; // refined by fitHandToScreen() once the model has loaded

  scene = new THREE.Scene();
  scene.background = new THREE.Color(0, 0, 0);

  // Add Lighting
  const pointLight1 = new THREE.PointLight(0xffffff, 1, 0, 0);
  pointLight1.position.set(500, 0, 500);
  scene.add(pointLight1);

  const pointLight2 = new THREE.PointLight(0xffffff, 1, 0, 0);
  pointLight2.position.set(-500, -500, -500);
  scene.add(pointLight2);

  // Load Animation
  const loader = new GLTFLoader();
  const modelPath = import.meta.env.PROD
    ? "./portfolio_anim_01.glb"
    : "./public/portfolio_anim_01.glb";

  loader.load(
    modelPath,
    function (gltf) {
      const appearClip = THREE.AnimationClip.findByName(gltf.animations, "appear");
      const waveClip = THREE.AnimationClip.findByName(gltf.animations, "wave");

      asciiModel = gltf.scene;
      handOutline = outlineOf(asciiModel, waveClip);
      asciiModel.rotation.x = HAND_TILT_X;
      scene.add(asciiModel);

      mixer = new THREE.AnimationMixer(asciiModel);

      // "appear" scales the hand up from nothing. Play it once and hold the last
      // frame so the hand keeps its size instead of shrinking and re-growing.
      if (appearClip) {
        const appear = mixer.clipAction(appearClip);
        appear.setLoop(THREE.LoopOnce, 1);
        appear.clampWhenFinished = true;
        appear.play();
      }

      // "wave" only rotates the hand and starts and ends on the same pose, so
      // it can loop forever without a visible seam.
      if (waveClip) {
        mixer.clipAction(waveClip).play();
      }

      fitHandToScreen();
    },
    undefined,
    (error) => console.error(error)
  );

  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setAnimationLoop(animate);

  effect = new AsciiEffect(renderer, " .:-+*=%@#", { invert: true });
  effect.setSize(window.innerWidth, window.innerHeight);
  effect.domElement.id = "asciiEffect";

  // Special case: append effect.domElement, instead of renderer.domElement.
  // AsciiEffect creates a custom domElement (a div container) where the ASCII elements are placed.
  const effectContainer = document.getElementById("effectContainer");
  if (effectContainer) {
    effectContainer.appendChild(effect.domElement);
  }
  window.addEventListener("resize", onWindowResize);
}

function onWindowResize(): void {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
  effect.setSize(window.innerWidth, window.innerHeight);

  fitHandToScreen();
}

const clock = new THREE.Clock();

function animate(): void {
  if (mixer) mixer.update(clock.getDelta() * 0.8);
  if (asciiModel) asciiModel.rotation.y = asciiModelRotation;

  effect.render(scene, camera);
}

init();
