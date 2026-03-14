import * as THREE from 'three'
import Sizes from './utils/Sizes.js'
import Time from './utils/Time.js'
import Camera from './Camera.js'
import Renderer from './Renderer.js'
import World from './World/World.js'
import Navigation from './Navigation.js'
import Interaction from './Interaction.js'

let instance = null

export default class Experience {
  constructor(canvas) {
    if (instance) return instance
    instance = this

    this.canvas = canvas
    this.scene = new THREE.Scene()
    this.scene.fog = new THREE.Fog('#0d0d1a', 12, 22)

    this.sizes = new Sizes()
    this.time = new Time()
    this.camera = new Camera()
    this.renderer = new Renderer()
    this.world = new World()
    this.navigation = new Navigation()
    this.interaction = new Interaction()

    this.time.on('tick', () => this._update())
    this.sizes.on('resize', () => this._resize())
  }

  static getInstance() {
    return instance
  }

  _update() {
    this.world.update()
    this.interaction.update()
    this.renderer.render()
  }

  _resize() {
    this.camera._onResize()
    this.renderer.instance.setSize(this.sizes.width, this.sizes.height)
    this.renderer.instance.setPixelRatio(this.sizes.pixelRatio)
  }

  destroy() {
    instance = null
  }
}
