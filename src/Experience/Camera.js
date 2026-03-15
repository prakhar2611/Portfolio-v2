import * as THREE from 'three'
import { gsap } from 'gsap'
import Experience from './Experience.js'

export const ZONES = {
  overview: {
    pos: [6, 5, 8],
    target: [0, 1, 0],
    label: 'Welcome',
  },
}

export default class Camera {
  constructor() {
    const xp = Experience.getInstance()
    this.sizes = xp.sizes
    this.scene = xp.scene
    this._isTransitioning = false

    this._createInstance()
  }

  _createInstance() {
    this.instance = new THREE.PerspectiveCamera(
      45,
      this.sizes.width / this.sizes.height,
      0.1,
      100
    )
    const { pos, target } = ZONES.overview
    this.instance.position.set(...pos)
    this.instance.lookAt(...target)
    this.scene.add(this.instance)
  }

  transitionTo(zoneId, duration = 1.4) {
    if (this._isTransitioning) return
    const zone = ZONES[zoneId]
    if (!zone) return
    this._isTransitioning = true

    const cam = this.instance
    const currentTarget = new THREE.Vector3()
    cam.getWorldDirection(currentTarget)
    currentTarget.multiplyScalar(5).add(cam.position)

    const targetObj = { x: currentTarget.x, y: currentTarget.y, z: currentTarget.z }
    const targetDest = { x: zone.target[0], y: zone.target[1], z: zone.target[2] }

    const tl = gsap.timeline({ onComplete: () => { this._isTransitioning = false } })

    tl.to(cam.position, {
      x: zone.pos[0], y: zone.pos[1], z: zone.pos[2],
      duration,
      ease: 'power3.inOut',
      onUpdate: () => cam.lookAt(targetObj.x, targetObj.y, targetObj.z),
    }, 0)

    tl.to(targetObj, {
      ...targetDest,
      duration,
      ease: 'power3.inOut',
      onUpdate: () => cam.lookAt(targetObj.x, targetObj.y, targetObj.z),
    }, 0)
  }

  _onResize() {
    this.instance.aspect = this.sizes.width / this.sizes.height
    this.instance.updateProjectionMatrix()
  }
}
