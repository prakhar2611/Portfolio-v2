import * as THREE from 'three'
import Experience from '../Experience.js'

export default class Room {
  constructor() {
    const xp = Experience.getInstance()
    this.scene = xp.scene
    this._build()
  }

  _build() {
    const wallMat = new THREE.MeshStandardMaterial({ color: '#1a1730', roughness: 0.9, metalness: 0 })
    const floorMat = new THREE.MeshStandardMaterial({ color: '#0f0e1a', roughness: 1.0, metalness: 0 })
    const trimMat = new THREE.MeshStandardMaterial({ color: '#2a2545', roughness: 0.7 })

    // Floor
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(12, 10), floorMat)
    floor.rotation.x = -Math.PI / 2
    floor.position.set(0, 0, 0)
    this.scene.add(floor)

    // Floor rug (center accent)
    const rugMat = new THREE.MeshStandardMaterial({ color: '#2d1f0f', roughness: 1.0 })
    const rug = new THREE.Mesh(new THREE.PlaneGeometry(7, 4), rugMat)
    rug.rotation.x = -Math.PI / 2
    rug.position.set(-0.5, 0.001, 0.5)
    this.scene.add(rug)

    // Back wall
    const backWall = new THREE.Mesh(new THREE.PlaneGeometry(12, 5), wallMat)
    backWall.position.set(0, 2.5, -3)
    this.scene.add(backWall)

    // Left wall
    const leftWall = new THREE.Mesh(new THREE.PlaneGeometry(10, 5), wallMat)
    leftWall.rotation.y = Math.PI / 2
    leftWall.position.set(-6, 2.5, 0)
    this.scene.add(leftWall)

    // Right wall
    const rightWall = new THREE.Mesh(new THREE.PlaneGeometry(10, 5), wallMat)
    rightWall.rotation.y = -Math.PI / 2
    rightWall.position.set(6, 2.5, 0)
    this.scene.add(rightWall)

    // Ceiling (subtle)
    const ceilMat = new THREE.MeshStandardMaterial({ color: '#12101e', roughness: 1.0 })
    const ceiling = new THREE.Mesh(new THREE.PlaneGeometry(12, 10), ceilMat)
    ceiling.rotation.x = Math.PI / 2
    ceiling.position.set(0, 5, 0)
    this.scene.add(ceiling)

    // Baseboard trim along back wall
    const baseboard = new THREE.Mesh(new THREE.BoxGeometry(12, 0.12, 0.06), trimMat)
    baseboard.position.set(0, 0.06, -2.97)
    this.scene.add(baseboard)
  }
}
