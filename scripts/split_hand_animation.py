"""Rebuild public/portfolio_anim_01.glb so the hand only scales up once.

Usage: python3 scripts/split_hand_animation.py <blender-export.glb> public/portfolio_anim_01.glb

The Blender export has one looping "wave" clip: scale up, wave, hold, scale down.
This splits it into:
  - "appear": scale-only, frames 0..10 (0 -> 0.4167 s), meant to play once and clamp
  - "wave":   rotation-only, frames 1..60 rebased to t=0, closed so it loops seamlessly
The translation channel (all zeros) and the trailing scale-down are dropped.
Unused buffer data is removed and the buffer is repacked."""
import struct, json, sys

src, dst = sys.argv[1], sys.argv[2]
d = open(src, 'rb').read()
magic, ver, total = struct.unpack('<III', d[:12])
assert magic == 0x46546C67 and ver == 2
cl, ct = struct.unpack('<II', d[12:20]); assert ct == 0x4E4F534A
j = json.loads(d[20:20 + cl])
off = 20 + cl
bl, bt = struct.unpack('<II', d[off:off + 8]); assert bt == 0x004E4942
bin_ = d[off + 8:off + 8 + bl]

CT = {'SCALAR': 1, 'VEC2': 2, 'VEC3': 3, 'VEC4': 4}
FMT = {5126: 'f', 5123: 'H', 5125: 'I', 5121: 'B', 5122: 'h', 5120: 'b'}

def read(idx):
    a = j['accessors'][idx]; bv = j['bufferViews'][a['bufferView']]
    n, fmt = CT[a['type']], FMT[a['componentType']]
    sz = struct.calcsize(fmt); start = bv.get('byteOffset', 0) + a.get('byteOffset', 0)
    stride = bv.get('byteStride', n * sz)
    return [struct.unpack('<' + fmt * n, bin_[start + k * stride:start + k * stride + n * sz]) for k in range(a['count'])]

def bv_bytes(i):
    bv = j['bufferViews'][i]; s = bv.get('byteOffset', 0)
    return bin_[s:s + bv['byteLength']]

wave = next(a for a in j['animations'] if a['name'] == 'wave')
torus = next(a for a in j['animations'] if a['name'] == 'TorusAction')
hand_node = next(i for i, n in enumerate(j['nodes']) if n['name'] == 'hand')
ch = {c['target']['path']: wave['samplers'][c['sampler']] for c in wave['channels']}
times = [t[0] for t in read(ch['scale']['input'])]
scale = read(ch['scale']['output'])
rot = read(ch['rotation']['output'])

# --- derive the two new clips -------------------------------------------------
# scale-up ends at the first frame after which scale stays constant for a while
APPEAR_END = 10
assert all(abs(scale[k][i] - scale[APPEAR_END][i]) < 1e-6 for k in range(APPEAR_END, 60) for i in range(3))
appear_t = times[:APPEAR_END + 1]
appear_s = scale[:APPEAR_END + 1]
settled_scale = list(scale[APPEAR_END])

LOOP_START, LOOP_END = 1, 60   # frame 0 is the "hidden" pose, 61+ is the scale-down
wave_t = [t - times[LOOP_START] for t in times[LOOP_START:LOOP_END + 1]]
wave_r = [list(r) for r in rot[LOOP_START:LOOP_END + 1]]
wave_r[-1] = list(rot[LOOP_START])  # close the loop exactly
rest_rotation = list(rot[LOOP_START])

# --- repack buffer -------------------------------------------------------------
new_bvs, new_acc, blob = [], [], bytearray()
def add_bv(data, target=None):
    while len(blob) % 4: blob.append(0)
    new_bvs.append({'buffer': 0, 'byteLength': len(data), 'byteOffset': len(blob), **({'target': target} if target else {})})
    blob.extend(data); return len(new_bvs) - 1

acc_map = {}
keep_acc = sorted({p['indices'] for m in j['meshes'] for p in m['primitives']} |
                  {v for m in j['meshes'] for p in m['primitives'] for v in p['attributes'].values()} |
                  {s['input'] for s in torus['samplers']} | {s['output'] for s in torus['samplers']})
bv_map = {}
for ai in keep_acc:
    a = dict(j['accessors'][ai]); obv = a['bufferView']
    if obv not in bv_map:
        bv_map[obv] = add_bv(bv_bytes(obv), j['bufferViews'][obv].get('target'))
    a['bufferView'] = bv_map[obv]; acc_map[ai] = len(new_acc); new_acc.append(a)

def add_float_acc(rows, typ, with_minmax):
    n = CT[typ]; data = b''.join(struct.pack('<' + 'f' * n, *r) for r in rows)
    a = {'bufferView': add_bv(data), 'componentType': 5126, 'count': len(rows), 'type': typ}
    if with_minmax:
        a['min'] = [min(r[i] for r in rows) for i in range(n)]
        a['max'] = [max(r[i] for r in rows) for i in range(n)]
    new_acc.append(a); return len(new_acc) - 1

a_t = add_float_acc([(t,) for t in appear_t], 'SCALAR', True)
a_s = add_float_acc(appear_s, 'VEC3', False)
w_t = add_float_acc([(t,) for t in wave_t], 'SCALAR', True)
w_r = add_float_acc(wave_r, 'VEC4', False)

for s in torus['samplers']:
    s['input'] = acc_map[s['input']]; s['output'] = acc_map[s['output']]
for m in j['meshes']:
    for p in m['primitives']:
        p['indices'] = acc_map[p['indices']]
        p['attributes'] = {k: acc_map[v] for k, v in p['attributes'].items()}

j['animations'] = [
    {'name': 'appear',
     'samplers': [{'input': a_t, 'interpolation': 'LINEAR', 'output': a_s}],
     'channels': [{'sampler': 0, 'target': {'node': hand_node, 'path': 'scale'}}]},
    {'name': 'wave',
     'samplers': [{'input': w_t, 'interpolation': 'LINEAR', 'output': w_r}],
     'channels': [{'sampler': 0, 'target': {'node': hand_node, 'path': 'rotation'}}]},
    torus,
]
# sane rest pose: visible at its settled size, facing the way the wave starts
j['nodes'][hand_node]['scale'] = settled_scale
j['nodes'][hand_node]['rotation'] = rest_rotation
j['accessors'] = new_acc
j['bufferViews'] = new_bvs
j['buffers'] = [{'byteLength': len(blob)}]

js = json.dumps(j, separators=(',', ':')).encode()
while len(js) % 4: js += b' '
while len(blob) % 4: blob.append(0)
out = struct.pack('<III', 0x46546C67, 2, 12 + 8 + len(js) + 8 + len(blob))
out += struct.pack('<II', len(js), 0x4E4F534A) + js + struct.pack('<II', len(blob), 0x004E4942) + bytes(blob)
open(dst, 'wb').write(out)
print(f"wrote {dst}: {len(out)} bytes (was {len(d)})")
print("appear:", f"{appear_t[0]:.4f}..{appear_t[-1]:.4f}s, {len(appear_t)} keys, settles at", [round(x, 4) for x in settled_scale])
print("wave:  ", f"{wave_t[0]:.4f}..{wave_t[-1]:.4f}s, {len(wave_t)} keys, first==last:", wave_r[0] == wave_r[-1])
