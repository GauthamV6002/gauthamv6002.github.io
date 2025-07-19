import * as THREE from "three";

import { AsciiEffect } from "three/addons/effects/AsciiEffect.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

let camera, controls, scene, renderer, effect;
let asciiModel, mixer;

let asciiModelRotation = -0.2;
let isMobileDevice = false;

// Mouse Tracker
const mapRange = (value, fromMin, fromMax, toMin, toMax) =>
  ((value - fromMin) * (toMax - toMin)) / (fromMax - fromMin) + toMin;
setTimeout(() => {
  document.addEventListener("mousemove", (e) => {
    const windowWidthHalf = window.innerWidth / 2;
    const x = e.clientX - windowWidthHalf;

    const maxThetaX = 60 * (Math.PI / 180);
    asciiModelRotation =
      mapRange(x, -windowWidthHalf, windowWidthHalf, -maxThetaX, maxThetaX) -
      Math.PI / 4;
  });
}, 1500);

function init() {
  camera = new THREE.PerspectiveCamera(
    70,
    window.innerWidth / window.innerHeight,
    1,
    1000
  );
  camera.position.y = 2;
  camera.position.z = 13;

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
    ? "./hand_wave_02.glb"
    : "./public/hand_wave_02.glb";
  loader.load(
    modelPath,
    function (gltf) {
      asciiModel = gltf.scene;
      scene.add(asciiModel);

      const aspectRatio = window.innerWidth / window.innerHeight;

      // Mobile Screens need different model positioning
      if (window.innerWidth <= 1024) {
        isMobileDevice = true;
        asciiModel.position.set(0, 15, 0);
        camera.position.z = 30;
      } else {
        asciiModel.position.set(7, 0, 0);
      }

      asciiModel.rotation.x = 0.2;

      if (isMobileDevice) {
        // Proportional Camera Position hack
        const k = 12;
        camera.position.z = 13 + k / aspectRatio - 6;
      }

      // Start Animation
      mixer = new THREE.AnimationMixer(asciiModel);
      const waveClip = THREE.AnimationClip.findByName(gltf.animations, "wave");
      const waveAnim = mixer.clipAction(waveClip);
      waveAnim.play();

      // const torusClip = THREE.AnimationClip.findByName(gltf.animations, "TorusAction");
      // const torusAnim = mixer.clipAction(torusClip);
      // torusAnim.play();
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
  document.getElementById("effectContainer").appendChild(effect.domElement);
  window.addEventListener("resize", onWindowResize);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
  effect.setSize(window.innerWidth, window.innerHeight);
}

const clock = new THREE.Clock();

function animate() {
  if (mixer) mixer.update(clock.getDelta() * 0.8);
  if (asciiModel) asciiModel.rotation.y = asciiModelRotation;

  effect.render(scene, camera);
}

init();
