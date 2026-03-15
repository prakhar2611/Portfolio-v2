import * as THREE from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js'
import EventEmitter from './EventEmitter.js'

export default class Resources extends EventEmitter {
  constructor(sources) {
    super()

    this.sources = sources
    this.items = {}
    this.toLoad = sources.length
    this.loaded = 0

    this._setLoaders()
    this._startLoading()
  }

  _setLoaders() {
    const dracoLoader = new DRACOLoader()
    dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/')

    this.loaders = {
      gltf: new GLTFLoader(),
      texture: new THREE.TextureLoader(),
    }
    this.loaders.gltf.setDRACOLoader(dracoLoader)
  }

  _startLoading() {
    for (const source of this.sources) {
      if (source.type === 'gltfModel') {
        this.loaders.gltf.load(source.path, file => this._onLoaded(source, file))
      } else if (source.type === 'texture') {
        this.loaders.texture.load(source.path, file => this._onLoaded(source, file))
      }
    }
  }

  _onLoaded(source, file) {
    this.items[source.name] = file
    this.loaded++
    this.trigger('itemLoaded', [{ loaded: this.loaded, total: this.toLoad }])

    if (this.loaded === this.toLoad) {
      this.trigger('ready')
    }
  }
}
