varying float vAlpha;

void main() {
  // Soft radial circle
  vec2 uv = gl_PointCoord - vec2(0.5);
  float dist = length(uv);
  if (dist > 0.5) discard;

  float alpha = smoothstep(0.5, 0.1, dist) * vAlpha * 0.35;
  // Warm cream dust color
  vec3 color = vec3(1.0, 0.96, 0.88);
  gl_FragColor = vec4(color, alpha);
}
