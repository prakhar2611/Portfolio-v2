import * as THREE from 'three'
import Experience from '../Experience.js'
import particleVertex from '../shaders/particles/vertex.glsl'
import particleFragment from '../shaders/particles/fragment.glsl'

export default class Atmosphere {
  constructor() {
    const xp = Experience.getInstance()
    this.scene = xp.scene
    this.time = xp.time
    this._dustMaterial = null
    this._smokeMaterial = null
    this._createDust()
    this._createSmoke()
  }

  _createDust() {
    const isMobile = window.innerWidth < 768
    const count = isMobile ? 400 : 800

    const positions = new Float32Array(count * 3)
    const scales = new Float32Array(count)
    const randomness = new Float32Array(count * 3)

    for (let i = 0; i < count; i++) {
      const i3 = i * 3
      // Spread across the entire room
      positions[i3 + 0] = (Math.random() - 0.5) * 11
      positions[i3 + 1] = Math.random() * 4.5
      positions[i3 + 2] = (Math.random() - 0.5) * 8

      scales[i] = 0.4 + Math.random() * 1.2
      randomness[i3 + 0] = (Math.random() - 0.5) * 2
      randomness[i3 + 1] = (Math.random() - 0.5) * 1
      randomness[i3 + 2] = (Math.random() - 0.5) * 2
    }

    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geo.setAttribute('aScale', new THREE.BufferAttribute(scales, 1))
    geo.setAttribute('aRandomness', new THREE.BufferAttribute(randomness, 3))

    this._dustMaterial = new THREE.ShaderMaterial({
      vertexShader: particleVertex,
      fragmentShader: particleFragment,
      uniforms: {
        uTime: { value: 0 },
        uSize: { value: 4.5 },
      },
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    })

    const dust = new THREE.Points(geo, this._dustMaterial)
    this.scene.add(dust)
  }

  _createSmoke() {
    // Localized smoke wisps above gaming corner
    const count = 60
    const positions = new Float32Array(count * 3)
    const scales = new Float32Array(count)
    const randomness = new Float32Array(count * 3)

    for (let i = 0; i < count; i++) {
      const i3 = i * 3
      positions[i3 + 0] = -3.5 + (Math.random() - 0.5) * 0.5
      positions[i3 + 1] = 0.6 + Math.random() * 1.2
      positions[i3 + 2] = -0.3 + (Math.random() - 0.5) * 0.3

      scales[i] = 0.6 + Math.random() * 1.5
      randomness[i3 + 0] = (Math.random() - 0.5) * 0.3
      randomness[i3 + 1] = 0.4 + Math.random() * 0.6
      randomness[i3 + 2] = (Math.random() - 0.5) * 0.3
    }

    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geo.setAttribute('aScale', new THREE.BufferAttribute(scales, 1))
    geo.setAttribute('aRandomness', new THREE.BufferAttribute(randomness, 3))

    this._smokeMaterial = new THREE.ShaderMaterial({
      vertexShader: particleVertex,
      fragmentShader: `
        varying float vAlpha;
        void main() {
          vec2 uv = gl_PointCoord - vec2(0.5);
          float dist = length(uv);
          if (dist > 0.5) discard;
          float alpha = smoothstep(0.5, 0.15, dist) * vAlpha * 0.18;
          gl_FragColor = vec4(0.9, 0.9, 0.95, alpha);
        }
      `,
      uniforms: {
        uTime: { value: 0 },
        uSize: { value: 6.0 },
      },
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    })

    const smoke = new THREE.Points(geo, this._smokeMaterial)
    this.scene.add(smoke)
  }

  update() {
    const elapsed = this.time.elapsed
    if (this._dustMaterial) this._dustMaterial.uniforms.uTime.value = elapsed
    if (this._smokeMaterial) this._smokeMaterial.uniforms.uTime.value = elapsed
  }
}
