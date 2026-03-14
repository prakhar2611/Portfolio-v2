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
    // Deep dark ambient — base mood
    const ambient = new THREE.AmbientLight('#1a1a2e', 0.4)
    this.scene.add(ambient)

    // Hemisphere — very subtle sky/ground gradient
    const hemi = new THREE.HemisphereLight('#0d1a2e', '#0a0a10', 0.3)
    this.scene.add(hemi)

    // ── Gaming Corner ────────────────────────────
    // TV screen glow (cool blue/purple)
    this.tvLight = new THREE.RectAreaLight('#5566ff', 3, 2.2, 1.4)
    this.tvLight.position.set(-3.5, 1.2, -2.3)
    this.tvLight.lookAt(-3.5, 1.2, 0)
    this.scene.add(this.tvLight)

    // Warm floor lamp next to couch
    const couchLamp = new THREE.PointLight('#ff8c42', 2.5, 4)
    couchLamp.position.set(-4.8, 1.8, -0.5)
    this.scene.add(couchLamp)

    // ── Art Wall ─────────────────────────────────
    // Warm gallery light above paintings
    const artLamp = new THREE.SpotLight('#ffe4b5', 3, 6, Math.PI / 5, 0.4)
    artLamp.position.set(3, 3.8, 0)
    artLamp.target.position.set(3.5, 0.5, -2.5)
    this.scene.add(artLamp)
    this.scene.add(artLamp.target)

    // ── Work Desk ─────────────────────────────────
    // Dual monitor glow (purple/blue)
    this.monitorLight = new THREE.RectAreaLight('#4455ee', 2, 2.6, 1.2)
    this.monitorLight.position.set(0, 1.6, -2.0)
    this.monitorLight.lookAt(0, 1.6, 0)
    this.scene.add(this.monitorLight)

    // Desk lamp
    const deskLamp = new THREE.PointLight('#fff5e0', 1.5, 3)
    deskLamp.position.set(-0.8, 2.2, -1.0)
    this.scene.add(deskLamp)

    // ── Sports Shelf ──────────────────────────────
    const trophySpot = new THREE.SpotLight('#ffffff', 2, 5, Math.PI / 6, 0.6)
    trophySpot.position.set(3.2, 4, 1)
    trophySpot.target.position.set(3, 1.5, -2)
    this.scene.add(trophySpot)
    this.scene.add(trophySpot.target)
  }
}
