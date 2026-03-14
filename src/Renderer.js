import * as THREE from 'three'
import Experience from './Experience.js'

export default class Renderer {
  constructor() {
    const xp = Experience.getInstance()
    this.canvas = xp.canvas
    this.sizes = xp.sizes
    this.scene = xp.scene
    this.camera = xp.camera

    this._setup()
  }

  _setup() {
    this.instance = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: false,
    })
    this.instance.setSize(this.sizes.width, this.sizes.height)
    this.instance.setPixelRatio(this.sizes.pixelRatio)
    this.instance.setClearColor('#0a0818')
    this.instance.outputColorSpace = THREE.SRGBColorSpace
    this.instance.toneMapping = THREE.ReinhardToneMapping
    this.instance.toneMappingExposure = 1.8
    this.instance.shadowMap.enabled = false // using baked lighting

    Experience.getInstance().sizes.on('resize', () => {
      this.instance.setSize(this.sizes.width, this.sizes.height)
      this.instance.setPixelRatio(this.sizes.pixelRatio)
    })
  }

  render() {
    this.instance.render(this.scene, this.camera.instance)
  }
}
