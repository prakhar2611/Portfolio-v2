 ---                                                                                                                
  Step 1 — Switch to Cycles                                                                                          
                           
  Baking requires Cycles (EEVEE can't bake Combined lighting).                                                       
                                                                                                                     
  1. Open Properties panel → Render Properties (camera icon)                                                         
  2. Set Render Engine → Cycles                                                                                      
  3. Set Device → GPU Compute (if you have a GPU, much faster)                                                       
  4. You don't need to change your sample count — baking uses its own setting                                        
                                                                                                                     
  ---                                                                                                                
  Step 2 — UV Unwrap everything                                                                                      
                                                                                                                   
  Every mesh needs a UV map for the bake to land on.
                                                                                                                     
  1. In the 3D Viewport, press A to select all objects                                                               
  2. Press U → choose Lightmap Pack                                                                                  
  3. In the popup that appears:                                                                                      
    - Pack Quality: 64                                                                                             
    - Margin: 0.003 (prevents bleeding between objects)                                                              
    - ✓ New UV Map — this creates a second UV channel called UVMap or LightMap, keeping your originals intact        
  4. Click OK                                                                                                        
                                                                                                                     
  If some objects already have a UV map called UVMap, Blender will add a second one. That's fine — baking uses       
  whichever UV map is active (highlighted blue) in the mesh's UV Maps list.                                          
                                                                                                                     
  ---                                                                                                              
  Step 3 — Create the bake target image
                                       
  1. Open the Shader Editor (or UV Editor — either works)                                                            
  2. Go to Image → New                                                                                               
  3. Settings:                                                                                                       
    - Name: room_baked                                                                                               
    - Width / Height: 4096 x 4096 (you can do 2048 if baking is slow)                                                
    - Color: Black, Alpha off                                                                                        
    - 32-bit Float: ✓ (better quality, you can convert down after)                                                   
  4. Click OK — this creates the image but it's not saved yet                                                        
                                                                                                                     
  ---                                                                                                                
  Step 4 — Assign the bake target to every material                                                                  
                                                                                                                     
  This is the most tedious step. Every material needs an Image Texture node pointing to room_baked, and it must be
  selected (highlighted) but not connected to anything.                                                              
                                                                                                                   
  For each material in your scene:                                                                                   
  1. Open Shader Editor                                                                                            
  2. Add a node: Shift+A → Texture → Image Texture                                                                   
  3. In the node, set the image to room_baked                                                                      
  4. Click the node to select it (it should be highlighted with a white border) — do not connect it to anything      
                                                                                                                     
  Shortcut if you have many objects:                                                                                 
  - Select all objects in the viewport → go to Shader Editor                                                         
  - Use a script (I can write one) to add this node to all materials automatically                                   
                                                                                                                     
  Want me to write a quick Blender Python script that does this to all materials at once? It saves a lot of clicking.
   Just say the word.                                                                                                
                                                                                                                     
  ---                                                                                                                
  Step 5 — Bake                                                                                                    
               
  1. Go to Properties → Render Properties → Bake section (scroll down)
  2. Settings:                                                                                                       
  | Setting             | Value                                         |
  |---------------------|-----------------------------------------------|                                            
  | Bake Type           | Combined                                      |                                          
  | Lighting → Direct   | ✓                                             |
  | Lighting → Indirect | ✓                                             |                                            
  | Lighting → Diffuse  | ✓                                             |
  | Influence → Color   | ✓ (uncheck if you want light-only, no albedo) |                                            
  | Selected to Active  | ✗ (off)                                       |                                            
  | Margin              | 16px                                          |                                            
  | Margin Type         | Extend                                        |                                            
                                                                                                                     
  3. Select all objects in the viewport (A)                                                                          
  4. Click Bake                                                                                                      
                                                                                                                   
  This will take a few minutes. You'll see the room_baked image fill up with the lit scene.                          
  
  If baking looks dark: Your lights may need to be stronger for Cycles (EEVEE and Cycles handle light intensity      
  differently). Try multiplying light strength by 10x.                                                             
                                                                                                                     
  ---                                                                                                              
  Step 6 — Save the baked image
                               
  The baked image exists only in Blender's memory until you save it.                                                 
                                                                                                                     
  1. In Image Editor / UV Editor, make sure room_baked is selected                                                   
  2. Image → Save As                                                                                                 
  3. Save as room_baked.png (or .exr if you used 32-bit float) into public/blender_model/                            
                                                                                                                     
  ---
  Step 7 — Re-export the GLB                                                                                         
                                                                                                                   
  Now export with the baked texture embedded:
                                                                                                                     
  1. File → Export → glTF 2.0 (.glb)
  2. Settings:                                                                                                       
  | Setting                     | Value              |                                                             
  |-----------------------------|--------------------|                                                               
  | Format                      | glTF Binary (.glb) |                                                               
  | Include → Custom Properties | ✓                  |                                                               
  | Data → Mesh → UVs           | ✓                  |                                                               
  | Data → Mesh → Normals       | ✓                  |                                                               
  | Materials → Export          | ✓                  |                                                               
  | Images → Image format       | JPEG or PNG        |                                                               
                                                                                                                     
  3. Save over the existing room_world.glb                                                                         
                                                                                                                     
  ---                                                                                                              
  Step 8 — I'll update the Three.js side
                                                                                                                     
  Once you've exported the new GLB, come back and I'll:
  1. Update RoomWorld.js to traverse the model and switch all materials to MeshBasicMaterial (so the baked texture   
  displays without any lighting influence)                                                                           
  2. Remove the dynamic lights from Environment.js (they'd double-expose the baked light)                            
  3. The result should match your Blender viewport closely                                                           
                                                                                                                     
  ---                                                                                                                
  Fastest path if you want to skip steps 2–4: Just do Step 1 (switch to Cycles), skip straight to Step 5 with Bake   
  Type = AO instead of Combined — it's much faster to bake, gives you ambient occlusion shadows as a starting point, 
  and you can iterate from there.                                                                                  
                                    