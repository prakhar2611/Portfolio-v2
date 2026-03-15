# Blender Lighting Bake Process — room_world.glb
> **For:** Claude agent executing this on a GPU-equipped system
> **Project:** Prakhar Gupta — Portfolio V2 ("The Den")
> **Goal:** Bake all Blender lighting into a single texture atlas (`room_baked`), re-export the GLB, then update the Three.js side to use `MeshBasicMaterial` so the scene matches the Blender viewport exactly.

---

## Context

- The scene is a low-poly isometric room + city balcony with stylised lighting
- Source file: `room_world.glb` (currently exported without baked textures)
- The scene has **many materials** — use the provided Python script to automate node setup
- Blender version used: assumed 3.x or 4.x
- Render engine for baking: **Cycles** (required — EEVEE cannot bake Combined)

---

## Files

| File | Location | Notes |
|------|----------|-------|
| `room_world.glb` | `public/blender_model/room_world.glb` | Current export — replace after bake |
| `blender_bake_setup.py` | project root | Script to add bake nodes to all materials |
| `room_baked.png` | `public/blender_model/room_baked.png` | Output — create this after baking |

---

## Step 1 — Open the Blender file and switch to Cycles

1. Open the `.blend` source file for `room_world.glb`
2. Go to **Properties → Render Properties** (camera icon)
3. Set **Render Engine → Cycles**
4. Set **Device → GPU Compute**
5. Scroll down to **Sampling → Bake** and set samples to `128` (enough for clean result, not too slow)

---

## Step 2 — UV Unwrap all objects (Lightmap Pack)

> `U` only works in **Edit Mode** — not Object Mode.

1. In the 3D Viewport, press `A` to select all objects (Object Mode)
2. Press `Tab` to enter **Edit Mode** — all selected objects enter together
3. Press `A` to select all faces across all objects
4. Press `U` → choose **Lightmap Pack**
5. In the popup:
   - **Pack Quality:** `64`
   - **Margin:** `0.003`
   - ✓ **New UV Map** (creates a second UV channel, keeps originals intact)
6. Click **OK**
7. Press `Tab` to return to Object Mode

---

## Step 3 — Create the bake target image

1. Open the **UV Editor** or **Shader Editor**
2. Go to **Image → New**
3. Settings:
   - **Name:** `room_baked`
   - **Width / Height:** `4096 x 4096`
   - **Color:** Black
   - **Alpha:** Off
   - **Generated Type:** Blank
   - **32-bit Float:** ✓
4. Click **OK**

> Do NOT save yet — save after baking is complete.

---

## Step 4 — Run the Python script to assign bake nodes to all materials

1. Open the **Scripting** workspace (tab at the top of Blender)
2. Click **New** to create a new script
3. Open the file `blender_bake_setup.py` from the project root and paste its full contents
4. Click **▶ Run Script**
5. Check the console output at the bottom — expected:
   ```
   Done — added bake node to X materials, skipped 0 (already had it).
   ```

**What the script does:**
- Iterates over every material in the scene
- Adds an `Image Texture` node pointing to `room_baked`
- Marks it as selected (required for Blender to know where to write the bake)
- Does not connect it to anything (intentional — connected nodes would affect the render)

---

## Step 5 — Bake

1. Go to **Properties → Render Properties → Bake** section (scroll down)
2. Settings:

   | Setting | Value |
   |---------|-------|
   | Bake Type | Combined |
   | Lighting → Direct | ✓ |
   | Lighting → Indirect | ✓ |
   | Lighting → Diffuse | ✓ |
   | Influence → Color | ✓ |
   | Selected to Active | ✗ (off) |
   | Margin | `16 px` |
   | Margin Type | Extend |

3. In the 3D Viewport, press `A` to select all objects
4. Click **Bake**

> **Expected duration:** 5–20 minutes depending on GPU. The `room_baked` image will fill with the lit scene progressively.

### Troubleshooting

| Problem | Fix |
|---------|-----|
| Result is all black | The Image Texture node in at least one material is not selected — re-run the script |
| Result is too dark | Cycles light intensities differ from EEVEE — increase all light strengths by 5–10x and re-bake |
| Some objects missing from bake | They weren't selected before baking — press `A` to select all, then bake |
| `room_baked` not found by script | Image was not created yet — complete Step 3 first |

---

## Step 6 — Save the baked image

1. In the **UV Editor** or **Image Editor**, make sure `room_baked` is the active image
2. Go to **Image → Save As**
3. Save as:
   - **Path:** `public/blender_model/room_baked.png`
   - **Format:** PNG
   - **Color Depth:** 8-bit (convert down from 32-bit float here)
4. Confirm save

---

## Step 7 — Re-export the GLB

1. **File → Export → glTF 2.0 (.glb)**
2. Settings:

   | Setting | Value |
   |---------|-------|
   | Format | glTF Binary (.glb) |
   | Include → Custom Properties | ✓ |
   | Data → Mesh → UVs | ✓ |
   | Data → Mesh → Normals | ✓ |
   | Materials → Export | ✓ |
   | Images → Image Format | PNG |

3. Save to `public/blender_model/room_world.glb` (overwrite existing)

---

## Step 8 — Update Three.js (for the agent on the dev machine)

Once the new GLB is exported, update `src/Experience/World/RoomWorld.js` to:

1. Switch all mesh materials to `MeshBasicMaterial` using the baked texture
2. Remove dynamic lights from `Environment.js` (they'd double-expose the baked lighting)

### RoomWorld.js changes needed

```js
import * as THREE from 'three'
import Experience from '../Experience.js'

export default class RoomWorld {
  constructor() {
    const xp = Experience.getInstance()
    this.scene = xp.scene
    this.resources = xp.resources

    this._loadModel()
  }

  _loadModel() {
    const gltf = this.resources.items.roomWorldModel
    this.model = gltf.scene

    // Replace all materials with MeshBasicMaterial using baked texture
    const bakedTexture = this.resources.items.bakedTexture
    bakedTexture.flipY = false
    bakedTexture.colorSpace = THREE.SRGBColorSpace

    const bakedMaterial = new THREE.MeshBasicMaterial({ map: bakedTexture })

    this.model.traverse(child => {
      if (child.isMesh) {
        child.material = bakedMaterial
      }
    })

    this.scene.add(this.model)
  }
}
```

### sources.js changes needed

Add the baked texture to the sources array:

```js
export default [
  {
    name: 'roomWorldModel',
    type: 'gltfModel',
    path: '/blender_model/room_world.glb',
  },
  {
    name: 'bakedTexture',
    type: 'texture',
    path: '/blender_model/room_baked.png',
  },
]
```

### Environment.js changes needed

Remove dynamic lights entirely — replace contents with:

```js
import Experience from '../Experience.js'

export default class Environment {
  constructor() {
    // No dynamic lighting needed — lighting is baked into room_baked.png
  }
}
```

---

## Checklist

- [ ] Switched render engine to Cycles
- [ ] UV unwrapped all objects with Lightmap Pack (New UV Map ✓)
- [ ] Created `room_baked` image (4096x4096, Blank, 32-bit float)
- [ ] Ran `blender_bake_setup.py` — all materials have bake node
- [ ] Baked (Combined, all objects selected)
- [ ] Saved `room_baked.png` to `public/blender_model/`
- [ ] Re-exported `room_world.glb` to `public/blender_model/`
- [ ] Updated `sources.js` to include `bakedTexture`
- [ ] Updated `RoomWorld.js` to use `MeshBasicMaterial` with baked texture
- [ ] Updated `Environment.js` to remove dynamic lights
- [ ] Tested in browser — scene matches Blender viewport
