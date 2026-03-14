import * as THREE from 'three'
import Experience from '../Experience.js'

export default class SportsTrophy {
  constructor() {
    const xp = Experience.getInstance()
    this.scene = xp.scene
    this.interactives = []
    this._build()
  }

  _build() {
    // Zone centered around x=3.5, z=0.5 (right side, front area)

    const woodMat = new THREE.MeshStandardMaterial({ color: '#3d2b1f', roughness: 0.85 })
    const goldMat = new THREE.MeshStandardMaterial({ color: '#d4af37', roughness: 0.2, metalness: 0.8 })
    const silverMat = new THREE.MeshStandardMaterial({ color: '#aaa', roughness: 0.3, metalness: 0.7 })

    // ── Wall mounted trophy shelf ─────────────────
    const mainShelf = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.08, 0.35), woodMat)
    mainShelf.position.set(3.5, 2.6, -2.85)
    this.scene.add(mainShelf)

    // Shelf bracket
    for (let s = -1; s <= 1; s += 2) {
      const bracket = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.2, 0.35), woodMat)
      bracket.position.set(3.5 + s * 1.0, 2.5, -2.85)
      this.scene.add(bracket)
    }

    // ── Trophies on shelf ─────────────────────────
    const buildTrophy = (x, mat) => {
      // Cup
      const cup = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.04, 0.14, 10), mat)
      cup.position.set(x, 2.78, -2.8)
      this.scene.add(cup)

      // Base
      const base = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.04, 0.1), new THREE.MeshStandardMaterial({ color: '#2a1f10', roughness: 0.8 }))
      base.position.set(x, 2.66, -2.8)
      this.scene.add(base)

      // Handles (simplified ears)
      for (let s = -1; s <= 1; s += 2) {
        const handle = new THREE.Mesh(new THREE.TorusGeometry(0.03, 0.008, 6, 10, Math.PI), mat)
        handle.position.set(x + s * 0.065, 2.80, -2.8)
        handle.rotation.z = s * Math.PI / 2
        this.scene.add(handle)
      }
    }

    buildTrophy(3.0, goldMat)
    buildTrophy(3.5, goldMat)
    buildTrophy(4.0, silverMat)

    // ── Medal on wall ─────────────────────────────
    const medalMat = new THREE.MeshStandardMaterial({ color: '#d4af37', roughness: 0.15, metalness: 0.9 })
    const medal = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.012, 16), medalMat)
    medal.rotation.x = Math.PI / 2
    medal.position.set(4.3, 2.55, -2.92)
    this.scene.add(medal)

    // Ribbon
    const ribbonMat = new THREE.MeshStandardMaterial({ color: '#c0392b', roughness: 0.9 })
    const ribbon = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.18, 0.008), ribbonMat)
    ribbon.position.set(4.3, 2.72, -2.92)
    this.scene.add(ribbon)

    // ── Badminton Racket ──────────────────────────
    const racketMat = new THREE.MeshStandardMaterial({ color: '#1a7a2a', roughness: 0.5, metalness: 0.3 })
    const racketHandle = new THREE.Mesh(new THREE.CylinderGeometry(0.016, 0.012, 0.38, 8), racketMat)
    racketHandle.position.set(2.8, 1.8, -2.88)
    racketHandle.rotation.z = 0.25
    this.scene.add(racketHandle)

    const racketHead = new THREE.Mesh(new THREE.TorusGeometry(0.14, 0.016, 8, 18), racketMat)
    racketHead.position.set(2.88, 2.22, -2.88)
    racketHead.rotation.z = 0.25
    this.scene.add(racketHead)

    // Racket strings (simplified grid)
    const stringMat = new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: 0.5 })
    for (let i = -3; i <= 3; i++) {
      const vStr = new THREE.Mesh(new THREE.CylinderGeometry(0.003, 0.003, 0.26, 4), stringMat)
      vStr.position.set(2.88 + i * 0.036, 2.22, -2.87)
      vStr.rotation.z = 0.25
      this.scene.add(vStr)
    }
    for (let i = -3; i <= 3; i++) {
      const hStr = new THREE.Mesh(new THREE.CylinderGeometry(0.003, 0.003, 0.26, 4), stringMat)
      hStr.position.set(2.88, 2.22 + i * 0.036, -2.87)
      hStr.rotation.x = Math.PI / 2
      hStr.rotation.z = 0.25
      this.scene.add(hStr)
    }

    // ── Table Tennis Paddle ───────────────────────
    const paddleRed = new THREE.MeshStandardMaterial({ color: '#c0392b', roughness: 0.8 })
    const paddleBlack = new THREE.MeshStandardMaterial({ color: '#111', roughness: 0.7 })

    // Paddle face
    const paddleFace = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.02, 12), paddleRed)
    paddleFace.rotation.z = Math.PI / 2
    paddleFace.position.set(4.1, 1.85, -2.88)
    this.scene.add(paddleFace)

    // Paddle handle
    const paddleHandle = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.22, 0.018), paddleBlack)
    paddleHandle.position.set(4.1, 1.63, -2.88)
    this.scene.add(paddleHandle)

    // ── Ping pong ball ────────────────────────────
    const ballMat = new THREE.MeshStandardMaterial({ color: '#fff5e0', roughness: 0.6 })
    const ball = new THREE.Mesh(new THREE.SphereGeometry(0.02, 8, 6), ballMat)
    ball.position.set(3.6, 2.63, -2.7)
    this.scene.add(ball)

    // ── Shuttlecock ───────────────────────────────
    const shCork = new THREE.Mesh(new THREE.SphereGeometry(0.025, 8, 6), new THREE.MeshStandardMaterial({ color: '#f0c880', roughness: 0.7 }))
    shCork.position.set(3.2, 2.63, -2.7)
    this.scene.add(shCork)

    // Shuttlecock feathers
    const featherMat = new THREE.MeshStandardMaterial({ color: '#fff', roughness: 0.9, side: THREE.DoubleSide })
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2
      const feather = new THREE.Mesh(new THREE.PlaneGeometry(0.025, 0.07), featherMat)
      feather.position.set(
        3.2 + Math.cos(angle) * 0.022,
        2.66,
        -2.7 + Math.sin(angle) * 0.022
      )
      feather.rotation.y = angle
      feather.rotation.x = -0.5
      this.scene.add(feather)
    }

    // ── Floor display case (second shelf) ─────────
    const caseShelf = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.06, 0.35), woodMat)
    caseShelf.position.set(3.5, 1.5, -2.85)
    this.scene.add(caseShelf)

    // ── Interactive trigger ───────────────────────
    const trigger = new THREE.Mesh(
      new THREE.BoxGeometry(3, 3, 3),
      new THREE.MeshBasicMaterial({ visible: false })
    )
    trigger.position.set(3.5, 1.5, -1.5)
    trigger.userData = { zone: 'sports' }
    this.scene.add(trigger)
    this.interactives.push(trigger)
  }
}
