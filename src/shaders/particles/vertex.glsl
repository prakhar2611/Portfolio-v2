uniform float uTime;
uniform float uSize;

attribute float aScale;
attribute vec3 aRandomness;

varying float vAlpha;

void main() {
  vec3 pos = position;

  // Slow drift motion
  float t = uTime * 0.0003;
  pos.x += sin(t * 1.1 + position.z * 2.0) * 0.08 + aRandomness.x * 0.05;
  pos.y += cos(t * 0.9 + position.x * 1.5) * 0.06 + aRandomness.y * 0.03;
  pos.z += sin(t * 0.7 + position.y * 2.0) * 0.05 + aRandomness.z * 0.04;

  vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
  gl_Position = projectionMatrix * mvPosition;

  // Size attenuation
  gl_PointSize = uSize * aScale * (300.0 / -mvPosition.z);
  gl_PointSize = clamp(gl_PointSize, 1.0, 8.0);

  // Fade based on depth
  vAlpha = clamp(1.0 - (-mvPosition.z / 15.0), 0.0, 1.0);
}
