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

    // Enable shadows on all meshes
    this.model.traverse(child => {
      if (child.isMesh) {
        child.castShadow = true
        child.receiveShadow = true
      }
    })

    this.scene.add(this.model)

    // Log the scene graph so we can inspect named objects later
    console.log('[RoomWorld] Scene graph:', this._listNodes(this.model))
  }

  // Returns a flat list of named objects for inspection
  _listNodes(root) {
    const names = []
    root.traverse(child => {
      if (child.name) names.push({ name: child.name, type: child.type })
    })
    return names
  }
}
