import * as THREE from 'three'
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
    // Very dark base ambient — room should be moody/dim
    const ambient = new THREE.AmbientLight('#1a0f2e', 0.5)
    this.scene.add(ambient)

    // Subtle cool purple hemisphere — mimics night sky through windows
    const hemi = new THREE.HemisphereLight('#2a1f5e', '#0a0510', 0.4)
    this.scene.add(hemi)

    // ── MAIN FLOOR LAMP (left side of room) ──────────────────────────
    // This is the dominant warm orange light like in the reference
    this.floorLamp = new THREE.PointLight('#ff9a3c', 8, 9, 1.5)
    this.floorLamp.position.set(-3.5, 2.5, 0.5)
    this.scene.add(this.floorLamp)

    // Second warm fill — spreads the lamp glow across the rug/floor
    const lampGlow = new THREE.PointLight('#ff7020', 4, 7, 2.0)
    lampGlow.position.set(-3, 0.8, 1.0)
    this.scene.add(lampGlow)

    // ── TV SCREEN GLOW (center-left) ─────────────────────────────────
    // Blue/cyan screen light facing outward
    this.tvLight = new THREE.RectAreaLight('#4488ff', 5, 2.4, 1.5)
    this.tvLight.position.set(-1.5, 1.4, -2.1)
    this.tvLight.lookAt(-1.5, 1.4, 2)
    this.scene.add(this.tvLight)

    // Small point light in front of TV to bounce off rug/floor
    const tvBounce = new THREE.PointLight('#3366cc', 2, 3.5, 2.0)
    tvBounce.position.set(-1.5, 0.5, -1.0)
    this.scene.add(tvBounce)

    // ── DUAL MONITOR GLOW (center-right desk) ────────────────────────
    this.monitorLight = new THREE.RectAreaLight('#5577ff', 4, 2.8, 1.2)
    this.monitorLight.position.set(1.2, 1.6, -2.0)
    this.monitorLight.lookAt(1.2, 1.6, 2)
    this.scene.add(this.monitorLight)

    const deskFill = new THREE.PointLight('#334488', 2.5, 4, 2.0)
    deskFill.position.set(1.2, 1.0, -0.8)
    this.scene.add(deskFill)

    // ── ART WALL LAMP ────────────────────────────────────────────────
    // Warm spotlight illuminating the paintings
    const artSpot = new THREE.SpotLight('#ffddaa', 5, 7, Math.PI / 4, 0.5)
    artSpot.position.set(4.5, 4.2, 0.5)
    artSpot.target.position.set(4.5, 1.5, -2.5)
    this.scene.add(artSpot)
    this.scene.add(artSpot.target)

    // ── SUBTLE BACK-WALL FILL ─────────────────────────────────────────
    // Very dim warm fill so back wall isn't totally black
    const backFill = new THREE.PointLight('#3a1a0a', 1.5, 12, 2.0)
    backFill.position.set(0, 3.5, -1)
    this.scene.add(backFill)
  }
}
