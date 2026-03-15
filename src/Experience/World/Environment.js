import * as THREE from 'three'
import Experience from '../Experience.js'

export default class Environment {
  constructor() {
    const xp = Experience.getInstance()
    this.scene = xp.scene

    this._addLights()
  }

  _addLights() {
    // Soft ambient base
    const ambient = new THREE.AmbientLight('#ffffff', 0.8)
    this.scene.add(ambient)

    // Main directional light (sun/key light)
    const sun = new THREE.DirectionalLight('#fff5e0', 3)
    sun.position.set(4, 6, 3)
    sun.castShadow = true
    sun.shadow.mapSize.set(2048, 2048)
    sun.shadow.camera.near = 0.1
    sun.shadow.camera.far = 20
    sun.shadow.camera.top = 8
    sun.shadow.camera.right = 8
    sun.shadow.camera.bottom = -8
    sun.shadow.camera.left = -8
    this.scene.add(sun)

    // Warm fill from the opposite side
    const fill = new THREE.DirectionalLight('#ffd0a0', 1.2)
    fill.position.set(-4, 3, -2)
    this.scene.add(fill)
  }
}
