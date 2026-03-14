import * as THREE from 'three'
import Experience from '../Experience.js'

export default class GamingCorner {
  constructor() {
    const xp = Experience.getInstance()
    this.scene = xp.scene
    this.interactives = []
    this._build()
  }

  _build() {
    // Zone centered around x=-3.5, z=-0.5 to -2.5

    // ── TV Stand ─────────────────────────────────
    const standMat = new THREE.MeshStandardMaterial({ color: '#1a1520', roughness: 0.6 })
    const stand = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.15, 0.55), standMat)
    stand.position.set(-3.5, 0.35, -2.2)
    this.scene.add(stand)

    // Stand legs
    for (let i = -1; i <= 1; i += 2) {
      const leg = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.35, 0.08), standMat)
      leg.position.set(-3.5 + i * 1.0, 0.175, -2.2)
      this.scene.add(leg)
    }

    // ── TV Screen ─────────────────────────────────
    const tvBodyMat = new THREE.MeshStandardMaterial({ color: '#111118', roughness: 0.3 })
    const tvBody = new THREE.Mesh(new THREE.BoxGeometry(2.2, 1.3, 0.08), tvBodyMat)
    tvBody.position.set(-3.5, 1.15, -2.35)
    this.scene.add(tvBody)

    // TV screen (glowing)
    const screenMat = new THREE.MeshStandardMaterial({
      color: '#4455ff',
      emissive: '#2233cc',
      emissiveIntensity: 1.2,
      roughness: 0.0,
      metalness: 0.1
    })
    const screen = new THREE.Mesh(new THREE.PlaneGeometry(2.0, 1.1), screenMat)
    screen.position.set(-3.5, 1.15, -2.30)
    this.scene.add(screen)

    // ── PS5 Console ───────────────────────────────
    const ps5Mat = new THREE.MeshStandardMaterial({ color: '#dde0f0', roughness: 0.25, metalness: 0.1 })
    const ps5Black = new THREE.MeshStandardMaterial({ color: '#0a0a12', roughness: 0.3 })

    // Main body
    const ps5Body = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.42, 0.28), ps5Mat)
    ps5Body.position.set(-3.0, 0.64, -2.12)
    this.scene.add(ps5Body)

    // Black middle panel
    const ps5Mid = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.38, 0.24), ps5Black)
    ps5Mid.position.set(-3.0, 0.64, -2.12)
    this.scene.add(ps5Mid)

    // Power LED
    const ledMat = new THREE.MeshStandardMaterial({ color: '#00aaff', emissive: '#0088ff', emissiveIntensity: 3 })
    const led = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.01, 0.01), ledMat)
    led.position.set(-3.0, 0.58, -1.98)
    this.scene.add(led)

    // ── DualSense Controller ──────────────────────
    const ctrlMat = new THREE.MeshStandardMaterial({ color: '#c8ccde', roughness: 0.4 })
    const controller = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.07, 0.14), ctrlMat)
    controller.position.set(-3.8, 0.44, -1.9)
    controller.rotation.y = 0.4
    this.scene.add(controller)

    // Grips
    for (let s = -1; s <= 1; s += 2) {
      const grip = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.12, 0.1), ctrlMat)
      grip.position.set(-3.8 + s * 0.07, 0.37, -1.85)
      grip.rotation.y = 0.4
      this.scene.add(grip)
    }

    // ── Sofa/Couch ────────────────────────────────
    const sofaMat = new THREE.MeshStandardMaterial({ color: '#3d2b1f', roughness: 0.95 })
    const sofaDark = new THREE.MeshStandardMaterial({ color: '#2a1a10', roughness: 0.9 })

    // Seat
    const seat = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.22, 0.9), sofaMat)
    seat.position.set(-3.5, 0.36, -0.6)
    this.scene.add(seat)

    // Back
    const back = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.7, 0.2), sofaMat)
    back.position.set(-3.5, 0.76, -1.02)
    this.scene.add(back)

    // Arms
    for (let s = -1; s <= 1; s += 2) {
      const arm = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.32, 0.9), sofaDark)
      arm.position.set(-3.5 + s * 1.3, 0.5, -0.6)
      this.scene.add(arm)
    }

    // ── Coffee Table ──────────────────────────────
    const tableMat = new THREE.MeshStandardMaterial({ color: '#2c1f14', roughness: 0.7 })
    const tableTop = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.06, 0.55), tableMat)
    tableTop.position.set(-3.5, 0.38, 0.35)
    this.scene.add(tableTop)

    for (let x = -1; x <= 1; x += 2) {
      for (let z = -1; z <= 1; z += 2) {
        const tleg = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.38, 6), tableMat)
        tleg.position.set(-3.5 + x * 0.4, 0.19, 0.35 + z * 0.2)
        this.scene.add(tleg)
      }
    }

    // ── Garmin Watch on coffee table ──────────────
    const garminMat = new THREE.MeshStandardMaterial({ color: '#333', roughness: 0.3, metalness: 0.6 })
    const garminScreen = new THREE.MeshStandardMaterial({
      color: '#001133',
      emissive: '#0066ff',
      emissiveIntensity: 0.6,
      roughness: 0.0
    })

    const watchBody = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.065, 0.018, 8), garminMat)
    watchBody.position.set(-3.3, 0.42, 0.3)
    this.scene.add(watchBody)

    const watchFace = new THREE.Mesh(new THREE.CircleGeometry(0.052, 8), garminScreen)
    watchFace.rotation.x = -Math.PI / 2
    watchFace.position.set(-3.3, 0.43, 0.3)
    this.scene.add(watchFace)

    // Watch band
    const bandMat = new THREE.MeshStandardMaterial({ color: '#111', roughness: 0.9 })
    const band1 = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.008, 0.09), bandMat)
    band1.position.set(-3.3, 0.422, 0.23)
    this.scene.add(band1)
    const band2 = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.008, 0.09), bandMat)
    band2.position.set(-3.3, 0.422, 0.37)
    this.scene.add(band2)

    // ── Floor lamp ────────────────────────────────
    const lampMat = new THREE.MeshStandardMaterial({ color: '#888', roughness: 0.3, metalness: 0.8 })
    const lampPole = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 1.7, 8), lampMat)
    lampPole.position.set(-4.7, 0.85, -0.5)
    this.scene.add(lampPole)

    const lampShade = new THREE.Mesh(new THREE.ConeGeometry(0.22, 0.25, 8, 1, true), new THREE.MeshStandardMaterial({ color: '#d4a06a', roughness: 0.8, side: THREE.BackSide }))
    lampShade.position.set(-4.7, 1.82, -0.5)
    lampShade.rotation.x = Math.PI
    this.scene.add(lampShade)

    // Register interactive zone trigger
    const trigger = new THREE.Mesh(
      new THREE.BoxGeometry(4, 3, 3),
      new THREE.MeshBasicMaterial({ visible: false })
    )
    trigger.position.set(-3.5, 1.5, -1.0)
    trigger.userData = { zone: 'gaming' }
    this.scene.add(trigger)
    this.interactives.push(trigger)
  }
}
