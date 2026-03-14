varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vViewDirection;

void main() {
  vUv = uv;
  vNormal = normalize(normalMatrix * normal);
  vec4 worldPos = modelViewMatrix * vec4(position, 1.0);
  vViewDirection = normalize(-worldPos.xyz);
  gl_Position = projectionMatrix * worldPos;
}
