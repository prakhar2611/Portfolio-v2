import * as THREE from 'three'
import Experience from '../Experience.js'

// Canvas texture: deep purple wall with scattered stars
function createStarWallTexture(w = 1024, h = 512) {
  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext('2d')

  // Deep indigo/purple base
  ctx.fillStyle = '#1c1240'
  ctx.fillRect(0, 0, w, h)

  // Subtle radial darkening toward edges
  const grad = ctx.createRadialGradient(w / 2, h / 2, 80, w / 2, h / 2, w * 0.7)
  grad.addColorStop(0, 'rgba(30,18,70,0.0)')
  grad.addColorStop(1, 'rgba(5,3,18,0.55)')
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, w, h)

  // Scatter ~400 tiny stars
  for (let i = 0; i < 400; i++) {
    const x = Math.random() * w
    const y = Math.random() * h
    const r = Math.random() * 1.4 + 0.3
    const alpha = Math.random() * 0.75 + 0.25
    ctx.beginPath()
    ctx.arc(x, y, r, 0, Math.PI * 2)
    ctx.fillStyle = `rgba(255,250,230,${alpha.toFixed(2)})`
    ctx.fill()
  }

  // A few slightly larger "bright" stars
  for (let i = 0; i < 20; i++) {
    const x = Math.random() * w
    const y = Math.random() * h
    ctx.beginPath()
    ctx.arc(x, y, 2.2, 0, Math.PI * 2)
    ctx.fillStyle = 'rgba(255,255,220,0.9)'
    ctx.fill()
    // tiny soft halo
    const halo = ctx.createRadialGradient(x, y, 0, x, y, 5)
    halo.addColorStop(0, 'rgba(255,255,200,0.25)')
    halo.addColorStop(1, 'rgba(255,255,200,0)')
    ctx.beginPath()
    ctx.arc(x, y, 5, 0, Math.PI * 2)
    ctx.fillStyle = halo
    ctx.fill()
  }

  const tex = new THREE.CanvasTexture(canvas)
  tex.colorSpace = THREE.SRGBColorSpace
  return tex
}

// Canvas texture: warm dark wood planks
function createWoodFloorTexture() {
  const canvas = document.createElement('canvas')
  canvas.width = 512
  canvas.height = 512
  const ctx = canvas.getContext('2d')

  // Base dark brown
  ctx.fillStyle = '#2a1a0a'
  ctx.fillRect(0, 0, 512, 512)

  // Draw horizontal planks
  const plankH = 36
  const plankColors = ['#3a2010', '#2e1808', '#351e0e', '#2a180a', '#3d2212']
  for (let row = 0; row < Math.ceil(512 / plankH); row++) {
    const y = row * plankH
    ctx.fillStyle = plankColors[row % plankColors.length]
    ctx.fillRect(0, y, 512, plankH - 1)

    // Grain lines
    const grainCount = 6
    for (let g = 0; g < grainCount; g++) {
      const gx = Math.random() * 512
      ctx.beginPath()
      ctx.moveTo(gx, y)
      ctx.lineTo(gx + (Math.random() - 0.5) * 20, y + plankH)
      ctx.strokeStyle = 'rgba(0,0,0,0.18)'
      ctx.lineWidth = 0.5 + Math.random()
      ctx.stroke()
    }
  }

  // Slight warm overlay
  const warm = ctx.createLinearGradient(0, 0, 512, 0)
  warm.addColorStop(0, 'rgba(80,30,0,0.12)')
  warm.addColorStop(1, 'rgba(40,15,0,0.08)')
  ctx.fillStyle = warm
  ctx.fillRect(0, 0, 512, 512)

  const tex = new THREE.CanvasTexture(canvas)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.wrapS = THREE.RepeatWrapping
  tex.wrapT = THREE.RepeatWrapping
  tex.repeat.set(3, 2.5)
  return tex
}

export default class Room {
  constructor() {
    const xp = Experience.getInstance()
    this.scene = xp.scene
    this._build()
  }

  _build() {
    const starTex = createStarWallTexture()
    const wallMat = new THREE.MeshStandardMaterial({
      map: starTex,
      roughness: 0.95,
      metalness: 0,
    })

    const woodTex = createWoodFloorTexture()
    const floorMat = new THREE.MeshStandardMaterial({
      map: woodTex,
      roughness: 0.9,
      metalness: 0.05,
    })

    const ceilMat = new THREE.MeshStandardMaterial({
      color: '#100c22',
      roughness: 1.0,
    })

    const trimMat = new THREE.MeshStandardMaterial({ color: '#251a45', roughness: 0.7 })

    // Floor (wood planks)
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(14, 12), floorMat)
    floor.rotation.x = -Math.PI / 2
    floor.position.set(0, 0, 0)
    this.scene.add(floor)

    // Large warm amber rug — center of room
    const rugTex = this._createRugTexture()
    const rugMat = new THREE.MeshStandardMaterial({
      map: rugTex,
      roughness: 1.0,
    })
    const rug = new THREE.Mesh(new THREE.PlaneGeometry(7.5, 5.5), rugMat)
    rug.rotation.x = -Math.PI / 2
    rug.position.set(-0.2, 0.003, 0.8)
    this.scene.add(rug)

    // Back wall (stars)
    const backWall = new THREE.Mesh(new THREE.PlaneGeometry(14, 6), wallMat)
    backWall.position.set(0, 3, -3.2)
    this.scene.add(backWall)

    // Left wall (stars — share same texture, just clone material)
    const leftWall = new THREE.Mesh(new THREE.PlaneGeometry(12, 6), wallMat.clone())
    leftWall.rotation.y = Math.PI / 2
    leftWall.position.set(-7, 3, 0)
    this.scene.add(leftWall)

    // Right wall (stars)
    const rightWall = new THREE.Mesh(new THREE.PlaneGeometry(12, 6), wallMat.clone())
    rightWall.rotation.y = -Math.PI / 2
    rightWall.position.set(7, 3, 0)
    this.scene.add(rightWall)

    // Ceiling
    const ceiling = new THREE.Mesh(new THREE.PlaneGeometry(14, 12), ceilMat)
    ceiling.rotation.x = Math.PI / 2
    ceiling.position.set(0, 6, 0)
    this.scene.add(ceiling)

    // Baseboard trim
    const baseboard = new THREE.Mesh(new THREE.BoxGeometry(14, 0.14, 0.07), trimMat)
    baseboard.position.set(0, 0.07, -3.18)
    this.scene.add(baseboard)

    // Left baseboard
    const lBase = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.14, 12), trimMat)
    lBase.position.set(-6.97, 0.07, 0)
    this.scene.add(lBase)
  }

  _createRugTexture() {
    const canvas = document.createElement('canvas')
    canvas.width = 256
    canvas.height = 256
    const ctx = canvas.getContext('2d')

    // Warm amber/orange base
    ctx.fillStyle = '#c45a0a'
    ctx.fillRect(0, 0, 256, 256)

    // Add texture noise / pile effect
    for (let i = 0; i < 3000; i++) {
      const x = Math.random() * 256
      const y = Math.random() * 256
      const alpha = Math.random() * 0.2
      ctx.fillStyle = `rgba(${Math.random() > 0.5 ? '200,80,0' : '255,140,30'},${alpha.toFixed(2)})`
      ctx.fillRect(x, y, 2, 2)
    }

    // Subtle dark border/edge
    const border = ctx.createLinearGradient(0, 0, 0, 256)
    border.addColorStop(0, 'rgba(0,0,0,0.3)')
    border.addColorStop(0.1, 'rgba(0,0,0,0)')
    border.addColorStop(0.9, 'rgba(0,0,0,0)')
    border.addColorStop(1, 'rgba(0,0,0,0.3)')
    ctx.fillStyle = border
    ctx.fillRect(0, 0, 256, 256)

    const tex = new THREE.CanvasTexture(canvas)
    tex.colorSpace = THREE.SRGBColorSpace
    return tex
  }
}
