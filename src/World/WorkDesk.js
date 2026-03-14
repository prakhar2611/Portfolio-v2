import * as THREE from 'three'
import Experience from '../Experience.js'

function makeCodeTexture() {
  const canvas = document.createElement('canvas')
  canvas.width = 512; canvas.height = 320
  const ctx = canvas.getContext('2d')

  ctx.fillStyle = '#0d1117'
  ctx.fillRect(0, 0, 512, 320)

  const lines = [
    { t: 'import { useState, useEffect } from "react"', c: '#c792ea', x: 18 },
    { t: 'import * as THREE from "three"', c: '#c792ea', x: 18 },
    { t: '', c: '#fff', x: 18 },
    { t: 'const Experience = () => {', c: '#82aaff', x: 18 },
    { t: '  const [zone, setZone] = useState("overview")', c: '#fff', x: 18 },
    { t: '', c: '#fff', x: 18 },
    { t: '  useEffect(() => {', c: '#c3e88d', x: 18 },
    { t: '    const camera = new THREE.PerspectiveCamera()', c: '#fff', x: 18 },
    { t: '    camera.position.set(0, 9, 9)', c: '#f78c6c', x: 18 },
    { t: '  }, [])', c: '#c3e88d', x: 18 },
    { t: '', c: '#fff', x: 18 },
    { t: '  return <Canvas zone={zone} />', c: '#82aaff', x: 18 },
    { t: '}', c: '#82aaff', x: 18 },
    { t: '', c: '#fff', x: 18 },
    { t: 'export default Experience', c: '#c792ea', x: 18 },
  ]

  ctx.font = '13px monospace'
  lines.forEach((line, i) => {
    ctx.fillStyle = line.c
    ctx.fillText(line.t, line.x, 22 + i * 19)
  })

  // Cursor blink line
  ctx.fillStyle = '#ffffffcc'
  ctx.fillRect(18, 310, 8, 14)

  return new THREE.CanvasTexture(canvas)
}

export default class WorkDesk {
  constructor() {
    const xp = Experience.getInstance()
    this.scene = xp.scene
    this.interactives = []
    this._build()
  }

  _build() {
    // Zone centered around x=0, z=-1 to -2.5

    const deskMat = new THREE.MeshStandardMaterial({ color: '#1c1628', roughness: 0.6, metalness: 0.1 })
    const darkMat = new THREE.MeshStandardMaterial({ color: '#0d0b14', roughness: 0.4 })
    const metalMat = new THREE.MeshStandardMaterial({ color: '#555', roughness: 0.25, metalness: 0.8 })

    // ── Desk surface ──────────────────────────────
    const surface = new THREE.Mesh(new THREE.BoxGeometry(2.8, 0.08, 0.9), deskMat)
    surface.position.set(0, 0.88, -2.0)
    this.scene.add(surface)

    // Desk legs
    const legPos = [[-1.3, -2.45], [1.3, -2.45], [-1.3, -1.55], [1.3, -1.55]]
    legPos.forEach(([x, z]) => {
      const leg = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.88, 0.06), darkMat)
      leg.position.set(x, 0.44, z)
      this.scene.add(leg)
    })

    // Desk cable tray (back edge)
    const tray = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.06, 0.08), darkMat)
    tray.position.set(0, 0.88, -2.43)
    this.scene.add(tray)

    // ── Left Monitor ──────────────────────────────
    const codeTex = makeCodeTexture()

    // Build a monitor: stand, neck, body, screen
    const buildMonitor = (x, z, rotY, code) => {
      // Stand base
      const standBase = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.04, 0.2), darkMat)
      standBase.position.set(x, 0.96, z)
      this.scene.add(standBase)

      // Neck
      const neck = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.28, 0.04), metalMat)
      neck.position.set(x, 1.1, z + 0.04)
      this.scene.add(neck)

      // Monitor body
      const body = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.62, 0.06), darkMat)
      body.position.set(x, 1.48, z - 0.02)
      body.rotation.y = rotY
      this.scene.add(body)

      // Screen
      const screenMat = new THREE.MeshStandardMaterial({
        map: code,
        emissive: '#1a1a2e',
        emissiveIntensity: 0.4,
        roughness: 0.0,
        metalness: 0.1
      })
      const screenMesh = new THREE.Mesh(new THREE.PlaneGeometry(0.92, 0.54), screenMat)
      screenMesh.position.set(x, 1.48, z - 0.05)
      screenMesh.rotation.y = rotY
      this.scene.add(screenMesh)

      // Screen glow
      const glowMat = new THREE.MeshStandardMaterial({
        color: '#4455ff',
        emissive: '#2233cc',
        emissiveIntensity: 0.3,
        transparent: true,
        opacity: 0.08,
        side: THREE.FrontSide
      })
      const glow = new THREE.Mesh(new THREE.PlaneGeometry(0.96, 0.58), glowMat)
      glow.position.set(x, 1.48, z - 0.04)
      glow.rotation.y = rotY
      this.scene.add(glow)
    }

    buildMonitor(-0.62, -2.07, 0.18, codeTex)
    buildMonitor(0.62, -2.07, -0.18, makeCodeTexture())

    // ── Keyboard ──────────────────────────────────
    const kbMat = new THREE.MeshStandardMaterial({ color: '#1a1520', roughness: 0.5 })
    const keyboard = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.025, 0.25), kbMat)
    keyboard.position.set(0, 0.93, -1.72)
    this.scene.add(keyboard)

    // Key rows (simplified)
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 12; col++) {
        const key = new THREE.Mesh(
          new THREE.BoxGeometry(0.042, 0.018, 0.042),
          new THREE.MeshStandardMaterial({ color: col % 3 === 0 && row === 3 ? '#333' : '#222', roughness: 0.3 })
        )
        key.position.set(-0.24 + col * 0.046, 0.947, -1.65 - row * 0.05)
        this.scene.add(key)
      }
    }

    // ── Mouse ─────────────────────────────────────
    const mouseMat = new THREE.MeshStandardMaterial({ color: '#1a1520', roughness: 0.3 })
    const mouse = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.04, 0.14), mouseMat)
    mouse.position.set(0.52, 0.95, -1.68)
    this.scene.add(mouse)

    // ── Coffee mug ────────────────────────────────
    const mugMat = new THREE.MeshStandardMaterial({ color: '#2a2040', roughness: 0.5 })
    const mug = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.038, 0.1, 10), mugMat)
    mug.position.set(-1.1, 0.97, -1.78)
    this.scene.add(mug)

    const steam = new THREE.Mesh(
      new THREE.CylinderGeometry(0.02, 0.03, 0.08, 6),
      new THREE.MeshStandardMaterial({ color: '#ffffff', transparent: true, opacity: 0.05 })
    )
    steam.position.set(-1.1, 1.05, -1.78)
    this.scene.add(steam)

    // ── Book shelf strip on wall ──────────────────
    const shelfMat = new THREE.MeshStandardMaterial({ color: '#1c1628', roughness: 0.7 })
    const shelf = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.06, 0.2), shelfMat)
    shelf.position.set(1.0, 2.2, -2.9)
    this.scene.add(shelf)

    // Books
    const bookColors = ['#c0392b', '#2980b9', '#f39c12', '#27ae60', '#8e44ad', '#e74c3c']
    bookColors.forEach((color, i) => {
      const thick = 0.06 + Math.random() * 0.06
      const tall = 0.22 + Math.random() * 0.12
      const book = new THREE.Mesh(
        new THREE.BoxGeometry(thick, tall, 0.16),
        new THREE.MeshStandardMaterial({ color, roughness: 0.8 })
      )
      book.position.set(0.35 + i * 0.14, 2.2 + tall / 2 + 0.04, -2.84)
      book.rotation.z = (Math.random() - 0.5) * 0.08
      this.scene.add(book)
    })

    // ── Interactive trigger ───────────────────────
    const trigger = new THREE.Mesh(
      new THREE.BoxGeometry(3.5, 3, 3),
      new THREE.MeshBasicMaterial({ visible: false })
    )
    trigger.position.set(0, 1.5, -1.5)
    trigger.userData = { zone: 'desk' }
    this.scene.add(trigger)
    this.interactives.push(trigger)
  }
}
