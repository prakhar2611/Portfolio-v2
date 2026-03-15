import * as THREE from 'three'
import Sizes from './Utils/Sizes.js'
import Time from './Utils/Time.js'
import Camera from './Camera.js'
import Renderer from './Renderer.js'
import Resources from './Utils/Resources.js'
import World from './World/World.js'
import sources from './sources.js'

let instance = null

export default class Experience {
  constructor(canvas) {
    if (instance) return instance
    instance = this

    this.canvas = canvas
    this.scene = new THREE.Scene()

    this.sizes = new Sizes()
    this.time = new Time()
    this.resources = new Resources(sources)
    this.camera = new Camera()
    this.renderer = new Renderer()
    this.world = new World()

    this.time.on('tick', () => this._update())
    this.sizes.on('resize', () => this._resize())
  }

  static getInstance() {
    return instance
  }

  _update() {
    this.world.update()
    this.renderer.render()
  }

  _resize() {
    this.camera._onResize()
    this.renderer.instance.setSize(this.sizes.width, this.sizes.height)
    this.renderer.instance.setPixelRatio(this.sizes.pixelRatio)
  }
}
