import * as THREE from 'three'
import { gsap } from 'gsap'
import Experience from './Experience.js'

export const ZONES = {
  overview: {
    pos: [0, 9, 9],
    target: [0, 0, 0],
    label: 'Welcome'
  },
  gaming: {
    pos: [-3.5, 3.5, 5],
    target: [-3, 0.5, -0.5],
    label: 'The Gaming Corner'
  },
  art: {
    pos: [3.5, 3.5, 4.5],
    target: [3, 1, -0.5],
    label: 'The Art Wall'
  },
  desk: {
    pos: [0, 3, 4.5],
    target: [0, 1, -1],
    label: 'The Work Desk'
  },
  sports: {
    pos: [3, 3.5, 4.5],
    target: [3, 1.5, -1],
    label: 'The Trophy Shelf'
  },
}

export default class Camera {
  constructor() {
    const xp = Experience.getInstance()
    this.sizes = xp.sizes
    this.scene = xp.scene
    this._isTransitioning = false

    this._createInstance()
    this.sizes.on('resize', () => this._onResize())
  }

  _createInstance() {
    this.instance = new THREE.PerspectiveCamera(
      45,
      this.sizes.width / this.sizes.height,
      0.1,
      50
    )
    const { pos } = ZONES.overview
    this.instance.position.set(...pos)
    this.instance.lookAt(0, 0, 0)
    this.scene.add(this.instance)
  }

  transitionTo(zoneId, duration = 1.4) {
    if (this._isTransitioning) return
    const zone = ZONES[zoneId]
    if (!zone) return
    this._isTransitioning = true

    const cam = this.instance
    const tl = gsap.timeline({
      onComplete: () => { this._isTransitioning = false }
    })

    // Store current lookAt target as a dummy object to tween
    const currentTarget = new THREE.Vector3()
    cam.getWorldDirection(currentTarget)
    currentTarget.multiplyScalar(5).add(cam.position)

    const targetObj = { x: currentTarget.x, y: currentTarget.y, z: currentTarget.z }
    const targetDest = { x: zone.target[0], y: zone.target[1], z: zone.target[2] }

    tl.to(cam.position, {
      x: zone.pos[0], y: zone.pos[1], z: zone.pos[2],
      duration,
      ease: 'power3.inOut',
      onUpdate: () => {
        cam.lookAt(targetObj.x, targetObj.y, targetObj.z)
      }
    }, 0)

    tl.to(targetObj, {
      ...targetDest,
      duration,
      ease: 'power3.inOut',
      onUpdate: () => {
        cam.lookAt(targetObj.x, targetObj.y, targetObj.z)
      }
    }, 0)
  }

  _onResize() {
    this.instance.aspect = this.sizes.width / this.sizes.height
    this.instance.updateProjectionMatrix()
  }
}
