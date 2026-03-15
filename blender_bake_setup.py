import bpy

# ── Config ────────────────────────────────────────────────
BAKE_IMAGE_NAME = "room_baked"
# ─────────────────────────────────────────────────────────

# Get the bake target image (must already exist — create it via Image → New first)
bake_image = bpy.data.images.get(BAKE_IMAGE_NAME)

if bake_image is None:
    print(f"ERROR: Image '{BAKE_IMAGE_NAME}' not found. Create it via Image → New first.")
else:
    count = 0
    skipped = 0

    for mat in bpy.data.materials:
        if not mat.use_nodes:
            mat.use_nodes = True

        nodes = mat.node_tree.nodes

        # Skip if this material already has a bake node pointing to room_baked
        already_has = any(
            n.type == 'TEX_IMAGE' and n.image == bake_image
            for n in nodes
        )
        if already_has:
            skipped += 1
            continue

        # Add Image Texture node
        node = nodes.new(type='ShaderNodeTexImage')
        node.image = bake_image
        node.label = "BAKE TARGET"

        # Position it out of the way (below existing nodes)
        node.location = (-300, -400)

        # Select ONLY this node (bake writes to the selected image node)
        for n in nodes:
            n.select = False
        node.select = True

        count += 1

    print(f"Done — added bake node to {count} materials, skipped {skipped} (already had it).")
    print("Now select all objects, go to Render Properties → Bake, and click Bake.")
