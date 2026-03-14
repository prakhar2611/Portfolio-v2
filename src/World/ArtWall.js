import * as THREE from 'three'
import Experience from '../Experience.js'

// Procedural painting colors — abstract panels
const PAINTING_PALETTES = [
  ['#c0392b', '#e74c3c', '#f39c12', '#f1c40f'],
  ['#2980b9', '#3498db', '#1abc9c', '#16a085'],
  ['#8e44ad', '#9b59b6', '#e91e63', '#ad1457'],
  ['#27ae60', '#2ecc71', '#f39c12', '#e67e22'],
]

function makeAbstractPainting(palette) {
  const canvas = document.createElement('canvas')
  canvas.width = 256; canvas.height = 320
  const ctx = canvas.getContext('2d')

  ctx.fillStyle = '#1a1220'
  ctx.fillRect(0, 0, 256, 320)

  // Random abstract strokes
  for (let i = 0; i < 18; i++) {
    ctx.beginPath()
    ctx.arc(
      Math.random() * 256, Math.random() * 320,
      20 + Math.random() * 80,
      0, Math.PI * 2
    )
    ctx.fillStyle = palette[Math.floor(Math.random() * palette.length)] + 'cc'
    ctx.fill()
  }

  // Sweeping strokes
  for (let i = 0; i < 6; i++) {
    ctx.beginPath()
    ctx.moveTo(Math.random() * 256, Math.random() * 320)
    ctx.bezierCurveTo(
      Math.random() * 256, Math.random() * 320,
      Math.random() * 256, Math.random() * 320,
      Math.random() * 256, Math.random() * 320
    )
    ctx.lineWidth = 8 + Math.random() * 24
    ctx.strokeStyle = palette[Math.floor(Math.random() * palette.length)] + 'aa'
    ctx.stroke()
  }

  return new THREE.CanvasTexture(canvas)
}

export default class ArtWall {
  constructor() {
    const xp = Experience.getInstance()
    this.scene = xp.scene
    this.interactives = []
    this._build()
  }

  _build() {
    // Zone centered around x=3.5, z=-1 to -2.8

    const frameMat = new THREE.MeshStandardMaterial({ color: '#2a1f10', roughness: 0.7 })
    const frameGold = new THREE.MeshStandardMaterial({ color: '#8b6914', roughness: 0.4, metalness: 0.6 })

    // ── Paintings on back wall ─────────────────────
    const paintingData = [
      { x: 2.5, y: 2.2, z: -2.92, w: 0.65, h: 0.82, palette: PAINTING_PALETTES[0] },
      { x: 3.4, y: 2.5, z: -2.92, w: 0.9, h: 1.15, palette: PAINTING_PALETTES[1] },
      { x: 4.4, y: 2.1, z: -2.92, w: 0.7, h: 0.9, palette: PAINTING_PALETTES[2] },
    ]

    paintingData.forEach(p => {
      // Canvas
      const tex = makeAbstractPainting(p.palette)
      const canvasMesh = new THREE.Mesh(
        new THREE.PlaneGeometry(p.w, p.h),
        new THREE.MeshStandardMaterial({ map: tex, roughness: 0.85 })
      )
      canvasMesh.position.set(p.x, p.y, p.z + 0.01)
      this.scene.add(canvasMesh)

      // Frame (4 strips)
      const th = 0.04, td = 0.03
      const strips = [
        { s: [p.w + th * 2, th, td], o: [0, p.h / 2 + th / 2, 0] },
        { s: [p.w + th * 2, th, td], o: [0, -(p.h / 2 + th / 2), 0] },
        { s: [th, p.h, td], o: [p.w / 2 + th / 2, 0, 0] },
        { s: [th, p.h, td], o: [-(p.w / 2 + th / 2), 0, 0] },
      ]
      strips.forEach(strip => {
        const fr = new THREE.Mesh(new THREE.BoxGeometry(...strip.s), frameGold)
        fr.position.set(p.x + strip.o[0], p.y + strip.o[1], p.z)
        this.scene.add(fr)
      })
    })

    // ── Easel ─────────────────────────────────────
    const woodMat = new THREE.MeshStandardMaterial({ color: '#5c3d1e', roughness: 0.85 })

    // Easel legs (A-frame)
    const legAngle = 0.3
    for (let s = -1; s <= 1; s += 2) {
      const leg = new THREE.Mesh(new THREE.BoxGeometry(0.06, 1.4, 0.06), woodMat)
      leg.position.set(3.5 + s * 0.3, 0.7, -1.4)
      leg.rotation.z = s * legAngle * 0.5
      leg.rotation.x = -0.15
      this.scene.add(leg)
    }
    const backLeg = new THREE.Mesh(new THREE.BoxGeometry(0.06, 1.3, 0.06), woodMat)
    backLeg.position.set(3.5, 0.65, -1.1)
    backLeg.rotation.x = 0.3
    this.scene.add(backLeg)

    // Cross bar
    const crossBar = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.06, 0.06), woodMat)
    crossBar.position.set(3.5, 1.0, -1.3)
    this.scene.add(crossBar)

    // Canvas on easel
    const easelTex = makeAbstractPainting(PAINTING_PALETTES[3])
    const easelCanvas = new THREE.Mesh(
      new THREE.PlaneGeometry(0.55, 0.68),
      new THREE.MeshStandardMaterial({ map: easelTex, roughness: 0.85 })
    )
    easelCanvas.position.set(3.5, 1.42, -1.35)
    easelCanvas.rotation.x = -0.1
    this.scene.add(easelCanvas)

    // Easel canvas white border
    const whiteFrame = new THREE.Mesh(new THREE.PlaneGeometry(0.58, 0.71), new THREE.MeshStandardMaterial({ color: '#f5f0e8' }))
    whiteFrame.position.set(3.5, 1.42, -1.352)
    whiteFrame.rotation.x = -0.1
    this.scene.add(whiteFrame)

    // ── Paint Palette ─────────────────────────────
    const paletteMat = new THREE.MeshStandardMaterial({ color: '#8b6914', roughness: 0.7 })
    const palette = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 0.015, 10), paletteMat)
    palette.position.set(3.1, 0.88, -0.85)
    palette.rotation.z = 0.2
    this.scene.add(palette)

    // Paint blobs on palette
    const blobColors = ['#e74c3c', '#3498db', '#f1c40f', '#27ae60', '#8e44ad']
    blobColors.forEach((color, i) => {
      const angle = (i / blobColors.length) * Math.PI * 1.4 - 0.3
      const r = 0.1
      const blob = new THREE.Mesh(
        new THREE.SphereGeometry(0.018, 6, 4),
        new THREE.MeshStandardMaterial({ color, roughness: 0.6 })
      )
      blob.position.set(3.1 + Math.cos(angle) * r, 0.896, -0.85 + Math.sin(angle) * r)
      this.scene.add(blob)
    })

    // ── Brushes in cup ────────────────────────────
    const cupMat = new THREE.MeshStandardMaterial({ color: '#7a9ab5', roughness: 0.5 })
    const cup = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.04, 0.12, 8), cupMat)
    cup.position.set(3.0, 0.94, -0.65)
    this.scene.add(cup)

    const brushColors = ['#8b4513', '#5c3d1e', '#3d2b1f']
    brushColors.forEach((color, i) => {
      const angle = (i / 3) * Math.PI * 0.8
      const bMat = new THREE.MeshStandardMaterial({ color })
      const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, 0.28, 6), bMat)
      handle.position.set(
        3.0 + Math.cos(angle) * 0.02,
        1.07,
        -0.65 + Math.sin(angle) * 0.02
      )
      handle.rotation.z = (Math.random() - 0.5) * 0.3
      this.scene.add(handle)

      const bristle = new THREE.Mesh(
        new THREE.ConeGeometry(0.012, 0.05, 6),
        new THREE.MeshStandardMaterial({ color: '#f0d080' })
      )
      bristle.position.set(
        handle.position.x,
        handle.position.y + 0.16,
        handle.position.z
      )
      this.scene.add(bristle)
    })

    // ── Small side table ──────────────────────────
    const tMat = new THREE.MeshStandardMaterial({ color: '#2c1f14', roughness: 0.8 })
    const sideTable = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.06, 0.4), tMat)
    sideTable.position.set(3.1, 0.86, -0.75)
    this.scene.add(sideTable)

    // ── Interactive trigger ───────────────────────
    const trigger = new THREE.Mesh(
      new THREE.BoxGeometry(3.5, 3, 3),
      new THREE.MeshBasicMaterial({ visible: false })
    )
    trigger.position.set(3.5, 1.5, -1.5)
    trigger.userData = { zone: 'art' }
    this.scene.add(trigger)
    this.interactives.push(trigger)
  }
}
