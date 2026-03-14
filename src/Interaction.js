import * as THREE from 'three'
import Experience from './Experience.js'

export default class Interaction {
  constructor() {
    const xp = Experience.getInstance()
    this.camera = xp.camera
    this.scene = xp.scene
    this.sizes = xp.sizes

    this._raycaster = new THREE.Raycaster()
    this._mouse = new THREE.Vector2(-10, -10)
    this._hoveredZone = null

    document.addEventListener('mousemove', e => this._onMouseMove(e))
    document.addEventListener('click', e => this._onClick(e))
    document.addEventListener('touchend', e => {
      if (e.changedTouches.length) {
        const t = e.changedTouches[0]
        this._setMouse(t.clientX, t.clientY)
      }
    }, { passive: true })
  }

  _setMouse(clientX, clientY) {
    this._mouse.x = (clientX / this.sizes.width) * 2 - 1
    this._mouse.y = -(clientY / this.sizes.height) * 2 + 1
  }

  _onMouseMove(e) {
    this._setMouse(e.clientX, e.clientY)

    // Update cursor
    const hit = this._castRay()
    document.body.style.cursor = hit ? 'pointer' : 'default'
    this._hoveredZone = hit ? hit.object.userData.zone : null
  }

  _onClick(e) {
    // Don't handle clicks on UI elements
    if (e.target.closest('#info-panel, #zone-nav, #audio-btn')) return

    this._setMouse(e.clientX, e.clientY)
    const hit = this._castRay()
    if (hit) {
      const xp = Experience.getInstance()
      xp.navigation.onZoneClick(hit.object.userData.zone)
    }
  }

  _castRay() {
    this._raycaster.setFromCamera(this._mouse, this.camera.instance)
    const xp = Experience.getInstance()
    const interactives = xp.world.getInteractives()
    const hits = this._raycaster.intersectObjects(interactives)
    return hits.length > 0 ? hits[0] : null
  }

  update() {
    // Re-cast each frame for hover cursor (already handled in mousemove, but update here if needed)
  }
}
