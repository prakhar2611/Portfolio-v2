uniform vec3 uColor;
uniform float uIntensity;

varying vec3 vNormal;
varying vec3 vViewDirection;

void main() {
  float fresnel = pow(1.0 - dot(vNormal, vViewDirection), 2.5);
  vec3 glow = uColor * fresnel * uIntensity;
  gl_FragColor = vec4(glow, fresnel * 0.7);
}
