import * as THREE from 'three'
import { RectAreaLightHelper } from 'three/addons/helpers/RectAreaLightHelper.js'
import { RectAreaLightUniformsLib } from 'three/addons/lights/RectAreaLightUniformsLib.js'
import Experience from '../Experience.js'

RectAreaLightUniformsLib.init()

export default class Lights {
  constructor() {
    const xp = Experience.getInstance()
    this.scene = xp.scene
    this._add()
  }

  _add() {
    // Main ambient — much brighter base so room is visible
    const ambient = new THREE.AmbientLight('#ffffff', 1.2)
    this.scene.add(ambient)

    // Hemisphere — warm ceiling / cool floor fill
    const hemi = new THREE.HemisphereLight('#ffeedd', '#223366', 1.0)
    this.scene.add(hemi)

    // Central ceiling fill — lights the whole room evenly
    const ceilFill = new THREE.PointLight('#fff8f0', 3.0, 18)
    ceilFill.position.set(0, 4.5, 0)
    this.scene.add(ceilFill)

    // Second ceiling fill towards back
    const ceilFill2 = new THREE.PointLight('#ffe0c0', 2.0, 14)
    ceilFill2.position.set(0, 4.5, -2)
    this.scene.add(ceilFill2)

    // ── Gaming Corner ────────────────────────────
    // TV screen glow (cool blue/purple)
    this.tvLight = new THREE.RectAreaLight('#7788ff', 6, 2.2, 1.4)
    this.tvLight.position.set(-3.5, 1.2, -2.3)
    this.tvLight.lookAt(-3.5, 1.2, 0)
    this.scene.add(this.tvLight)

    // Warm floor lamp next to couch
    const couchLamp = new THREE.PointLight('#ff8c42', 5, 6)
    couchLamp.position.set(-4.8, 1.8, -0.5)
    this.scene.add(couchLamp)

    // ── Art Wall ─────────────────────────────────
    // Warm gallery light above paintings
    const artLamp = new THREE.SpotLight('#ffe4b5', 8, 8, Math.PI / 4, 0.4)
    artLamp.position.set(3, 4.0, 0.5)
    artLamp.target.position.set(3.5, 0.5, -2.5)
    this.scene.add(artLamp)
    this.scene.add(artLamp.target)

    // Extra fill for art wall
    const artFill = new THREE.PointLight('#fff0d0', 3, 7)
    artFill.position.set(3.5, 3, -1)
    this.scene.add(artFill)

    // ── Work Desk ─────────────────────────────────
    // Dual monitor glow (purple/blue)
    this.monitorLight = new THREE.RectAreaLight('#6677ff', 5, 2.6, 1.2)
    this.monitorLight.position.set(0, 1.6, -2.0)
    this.monitorLight.lookAt(0, 1.6, 0)
    this.scene.add(this.monitorLight)

    // Desk lamp
    const deskLamp = new THREE.PointLight('#fff5e0', 4, 5)
    deskLamp.position.set(-0.8, 2.2, -1.0)
    this.scene.add(deskLamp)

    // ── Sports Shelf ──────────────────────────────
    const trophySpot = new THREE.SpotLight('#ffffff', 6, 8, Math.PI / 5, 0.4)
    trophySpot.position.set(3.2, 4, 1)
    trophySpot.target.position.set(3, 1.5, -2)
    this.scene.add(trophySpot)
    this.scene.add(trophySpot.target)
  }
}
