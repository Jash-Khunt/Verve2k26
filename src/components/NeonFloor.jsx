import * as THREE from "three";

const neonFloorVertex = `
varying vec2 vUv;
varying vec3 vWorldPosition;

void main() {
  vUv = uv;
  vec4 worldPosition = modelMatrix * vec4(position, 1.0);
  vWorldPosition = worldPosition.xyz;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const festivalFloorFragment = `
uniform float uTime;
uniform vec2 uSplashCenter;
uniform float uSplashRadius;
uniform vec3 uBaseColor;
uniform vec3 uGlowAccent;
uniform vec3 uZoneColorLeft;
uniform vec3 uZoneColorRight;
uniform vec3 uWaveColorA;
uniform vec3 uWaveColorB;
uniform vec3 uWaveColorC;
uniform vec3 uWaveColorD;
varying vec2 vUv;
varying vec3 vWorldPosition;

float mod2(float x) {
  float m = mod(x, 2.0);
  return m < 0.0 ? m + 2.0 : m;
}

float hexDistance(vec2 p) {
  p *= vec2(1.15470053838, 1.0);
  p.y += mod2(floor(p.x)) * 0.5;
  vec2 f = abs(fract(p) - 0.5);
  return max(f.x * 0.8660254 + f.y * 0.5, f.y);
}

vec3 partyPalette(float t) {
  float segment = fract(t) * 4.0;
  if (segment < 1.0) {
    return mix(uWaveColorA, uWaveColorB, segment);
  }
  if (segment < 2.0) {
    return mix(uWaveColorB, uWaveColorC, segment - 1.0);
  }
  if (segment < 3.0) {
    return mix(uWaveColorC, uWaveColorD, segment - 2.0);
  }
  return mix(uWaveColorD, uWaveColorA, segment - 3.0);
}

void main() {
  vec2 uv = vUv * 33.0;
  float h = hexDistance(uv);
  float grid = smoothstep(0.28, 0.26, h);

  float flow = sin(vWorldPosition.x * 0.22 - uTime * 1.18) * 0.5 + 0.5;
  flow += sin(vWorldPosition.z * 0.16 - uTime * 1.56) * 0.35;
  flow += sin((vWorldPosition.x + vWorldPosition.z) * 0.13 - uTime * 0.92) * 0.25;
  flow = clamp(flow, 0.0, 1.0);

  vec3 waveColor = partyPalette(flow);
  float waveGlow = smoothstep(0.26, 0.72, flow);
  waveGlow *= 0.5 + 0.4 * sin(uTime * 2.1 + vWorldPosition.x * 0.1);

  float leftZone = smoothstep(-40.0, -10.0, -vWorldPosition.x);
  float rightZone = smoothstep(-40.0, -10.0, vWorldPosition.x);
  vec3 zoneGlow = uZoneColorLeft * leftZone * (0.22 + 0.14 * sin(uTime * 1.7 + vWorldPosition.z * 0.12));
  zoneGlow += uZoneColorRight * rightZone * (0.22 + 0.14 * sin(uTime * 1.9 + vWorldPosition.z * 0.16));

  float splashDistance = distance(vWorldPosition.xz, uSplashCenter);
  float splashMask = 1.0 - smoothstep(0.0, uSplashRadius, splashDistance);
  float splashPulse = 0.4 + 0.6 * sin(uTime * 8.0);
  float splashIntensity = splashMask * splashPulse * 1.2;

  vec3 base = uBaseColor;
  vec3 glow = uGlowAccent * 0.24 * grid;
  glow += waveGlow * waveColor * 0.9;
  glow += zoneGlow;
  glow += splashIntensity * vec3(1.0, 0.55, 0.08);

  float distanceFog = smoothstep(0.0, 1.0, length(vWorldPosition.xz) / 64.0);
  vec3 color = mix(base * 0.14, base, 0.86);
  color += glow;
  color = mix(color, vec3(0.02, 0.02, 0.05), distanceFog * 0.92);

  gl_FragColor = vec4(color, 1.0);
}
`;

const redCarpetFragment = `
uniform float uTime;
varying vec2 vUv;
varying vec3 vWorldPosition;

void main() {
  vec2 uv = vUv;

  float centerGlow = smoothstep(0.01, 0.45, 0.5 - abs(uv.x - 0.5));
  vec3 base = mix(vec3(0.25, 0.01, 0.02), vec3(0.95, 0.05, 0.08), centerGlow);

  vec3 redShade = vec3(0.7, 0.02, 0.04) * (1.0 - centerGlow) * 0.7;

  vec3 deepVein = vec3(0.85, 0.02, 0.05) * smoothstep(0.08, 0.0, abs(uv.x - 0.5));

  float goldLine = smoothstep(0.018, 0.0, abs(fract(uv.y * 14.0 - uTime * 1.8) - 0.5));
  vec3 gold = vec3(1.0, 0.75, 0.25) * goldLine * 0.6 * smoothstep(0.22, 0.0, abs(uv.x - 0.5));

  float edgeMask = smoothstep(0.48, 0.42, abs(uv.x - 0.5));
  vec3 edgeGlow = mix(vec3(1.0, 0.3, 0.2), vec3(0.9, 0.2, 0.4), edgeMask) * 0.7;

  float streak = smoothstep(0.018, 0.0, abs(fract(uv.y * 28.0 - uTime * 2.4) - 0.5));
  vec3 streakColor = vec3(1.0, 0.35, 0.2) * streak * 0.5 * smoothstep(0.32, 0.0, abs(uv.x - 0.5));

  float glowBoost = smoothstep(0.3, 0.0, abs(uv.x - 0.5));
  vec3 redGlow = vec3(0.6, 0.05, 0.08) * glowBoost * 0.4;

  float textureNoise = 0.04 * (sin(uv.y * 42.0 + uTime * 0.5) * sin(uv.x * 12.5));

  vec3 color = base + redShade + deepVein + gold + edgeGlow + streakColor + redGlow + textureNoise * base;

  float vignette = smoothstep(0.8, 0.2, abs(uv.x - 0.5));
  color *= mix(0.8, 1.2, vignette);

  gl_FragColor = vec4(color, 1.0);
}
`;

const particleVertex = `
attribute float aSpeed;
attribute float aPhase;
varying vec3 vColor;
varying float vAlpha;
uniform float uTime;
void main() {
  vColor = color;
  vec3 transformed = position;
  transformed.y += 0.8 * sin(uTime * aSpeed + aPhase);
  transformed.x += 0.25 * sin(uTime * aSpeed * 0.7 + aPhase * 1.3);
  transformed.z += 0.25 * cos(uTime * aSpeed * 0.6 + aPhase * 0.9);
  vec4 mvPosition = modelViewMatrix * vec4(transformed, 1.0);
  gl_PointSize = 1.2 + 1.8 * sin(uTime * 1.7 + aPhase);
  gl_Position = projectionMatrix * mvPosition;
}
`;

const particleFragment = `
varying vec3 vColor;
varying float vAlpha;
void main() {
  float d = length(gl_PointCoord - vec2(0.5));
  float alpha = smoothstep(0.5, 0.0, d) * 0.7;
  gl_FragColor = vec4(vColor, alpha);
}
`;

function createFestivalParticles() {
  const count = 220;
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const speeds = new Float32Array(count);
  const phases = new Float32Array(count);
  const colorPalette = [
    new THREE.Color(0xff3ddb),
    new THREE.Color(0x1be7ff),
    new THREE.Color(0xccff2b),
    new THREE.Color(0xffc156),
  ];

  for (let i = 0; i < count; i += 1) {
    const radius = 16 + Math.random() * 24;
    const angle = Math.random() * Math.PI * 2;
    positions[i * 3 + 0] = Math.cos(angle) * radius + (Math.random() - 0.5) * 8;
    positions[i * 3 + 1] = Math.random() * 8 + 1.5;
    positions[i * 3 + 2] = Math.sin(angle) * radius + (Math.random() - 0.5) * 6;

    const color = colorPalette[Math.floor(Math.random() * colorPalette.length)];
    colors[i * 3 + 0] = color.r;
    colors[i * 3 + 1] = color.g;
    colors[i * 3 + 2] = color.b;

    speeds[i] = 0.8 + Math.random() * 1.1;
    phases[i] = Math.random() * Math.PI * 2;
  }

  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  geometry.setAttribute("aSpeed", new THREE.BufferAttribute(speeds, 1));
  geometry.setAttribute("aPhase", new THREE.BufferAttribute(phases, 1));

  const material = new THREE.ShaderMaterial({
    vertexShader: particleVertex,
    fragmentShader: particleFragment,
    uniforms: {
      uTime: { value: 0 },
    },
    vertexColors: true,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });

  return { mesh: new THREE.Points(geometry, material), material };
}

function createEventZone(x, color, accent) {
  const zone = new THREE.Group();
  const base = new THREE.Mesh(
    new THREE.PlaneGeometry(14, 22),
    new THREE.MeshBasicMaterial({
      color,
      transparent: true,
      opacity: 0.14,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
      depthWrite: false,
    }),
  );
  base.rotation.x = -Math.PI / 2;
  base.position.set(x, 0.02, -6);
  zone.add(base);

  const pulsePlane = new THREE.Mesh(
    new THREE.PlaneGeometry(10, 12),
    new THREE.MeshBasicMaterial({
      color: accent,
      transparent: true,
      opacity: 0.16,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
      depthWrite: false,
    }),
  );
  pulsePlane.rotation.x = -Math.PI / 2;
  pulsePlane.position.set(x, 0.04, -6);
  zone.add(pulsePlane);

  for (let i = 0; i < 3; i += 1) {
    const pillar = new THREE.Mesh(
      new THREE.BoxGeometry(0.6, 7.2, 0.6),
      new THREE.MeshBasicMaterial({
        color: accent,
        transparent: true,
        opacity: 0.35,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    );
    pillar.position.set(x + (i - 1) * 2.8, 3.7, -12 + i * 6);
    pillar.rotation.y = Math.PI / 8;
    zone.add(pillar);
  }

  const panel = new THREE.Mesh(
    new THREE.PlaneGeometry(3.5, 5.2),
    new THREE.MeshBasicMaterial({
      color: accent,
      transparent: true,
      opacity: 0.12,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
      depthWrite: false,
    }),
  );
  panel.position.set(x, 4.2, 8);
  panel.rotation.y = x > 0 ? -0.42 : 0.42;
  panel.rotation.x = -0.08;
  zone.add(panel);

  return zone;
}

function createFestivalLights(floorGroup) {
  const leftSpot = new THREE.SpotLight(0xff72ff, 1.1, 72, Math.PI * 0.22, 0.18, 1.8);
  leftSpot.position.set(-24, 18, 20);
  leftSpot.target.position.set(-2, 0, 4);
  leftSpot.penumbra = 0.4;
  leftSpot.decay = 2;

  const rightSpot = new THREE.SpotLight(0x5bf4ff, 1.0, 72, Math.PI * 0.22, 0.18, 1.8);
  rightSpot.position.set(24, 18, 20);
  rightSpot.target.position.set(2, 0, 4);
  rightSpot.penumbra = 0.4;
  rightSpot.decay = 2;

  const sideGlowLeft = new THREE.PointLight(0xff9ec8, 0.6, 24, 2);
  sideGlowLeft.position.set(-28, 8, 4);

  const sideGlowRight = new THREE.PointLight(0x6cfcff, 0.6, 24, 2);
  sideGlowRight.position.set(28, 8, 4);

  const flash = new THREE.PointLight(0xffffff, 0.0, 36, 2);
  flash.position.set(0, 24, 12);

  floorGroup.add(leftSpot);
  floorGroup.add(leftSpot.target);
  floorGroup.add(rightSpot);
  floorGroup.add(rightSpot.target);
  floorGroup.add(sideGlowLeft);
  floorGroup.add(sideGlowRight);
  floorGroup.add(flash);

  return { leftSpot, rightSpot, flash };
}

export function createNeonFloor() {
  const floorGeometry = new THREE.PlaneGeometry(108, 108, 256, 256);
  const floorMaterial = new THREE.ShaderMaterial({
    vertexShader: neonFloorVertex,
    fragmentShader: festivalFloorFragment,
    uniforms: {
      uTime: { value: 0 },
      uSplashCenter: { value: new THREE.Vector2(0, 0) },
      uSplashRadius: { value: 4.0 },
      uBaseColor: { value: new THREE.Color(0x09111d) },
      uGlowAccent: { value: new THREE.Color(0x4d7cff) },
      uZoneColorLeft: { value: new THREE.Color(0x4ef4ff) },
      uZoneColorRight: { value: new THREE.Color(0xff56b4) },
      uWaveColorA: { value: new THREE.Color(0x5ce4ff) },
      uWaveColorB: { value: new THREE.Color(0x8b4cff) },
      uWaveColorC: { value: new THREE.Color(0x38d1ff) },
      uWaveColorD: { value: new THREE.Color(0xff45f1) },
    },
    side: THREE.DoubleSide,
  });

  const floorMesh = new THREE.Mesh(floorGeometry, floorMaterial);
  floorMesh.rotation.x = -Math.PI / 2;
  floorMesh.receiveShadow = true;

  const carpetGeometry = new THREE.PlaneGeometry(16, 103, 128, 128);
  const carpetMaterial = new THREE.ShaderMaterial({
    vertexShader: neonFloorVertex,
    fragmentShader: redCarpetFragment,
    uniforms: {
      uTime: { value: 0 },
    },
    side: THREE.DoubleSide,
  });

  const carpet = new THREE.Mesh(carpetGeometry, carpetMaterial);
  carpet.rotation.x = -Math.PI / 2;
  carpet.position.set(0, 0.1, 2.6);
  carpet.receiveShadow = false;
  carpet.castShadow = false;

  const edgeStripMaterial = new THREE.MeshBasicMaterial({
    color: 0xff9e7f,
    transparent: true,
    opacity: 0.38,
    blending: THREE.AdditiveBlending,
    side: THREE.DoubleSide,
    depthWrite: false,
  });

  const leftStrip = new THREE.Mesh(new THREE.PlaneGeometry(0.36, 103), edgeStripMaterial);
  leftStrip.rotation.x = -Math.PI / 2;
  leftStrip.position.set(-8.65, 0.044, 2.5);
  const rightStrip = leftStrip.clone();
  rightStrip.position.x = 8.65;

  const glossPlane = new THREE.Mesh(
    new THREE.PlaneGeometry(90, 90),
    new THREE.MeshBasicMaterial({
      color: 0x5d76ff,
      transparent: true,
      opacity: 0.05,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
      depthWrite: false,
    }),
  );
  glossPlane.rotation.x = -Math.PI / 2;
  glossPlane.position.y = 0.046;

  const leftZone = createEventZone(-28, 0x72f2ff, 0xff42b4);
  const rightZone = createEventZone(28, 0xff78d9, 0x83f7ff);

  const particles = createFestivalParticles();
  particles.mesh.position.set(0, 0, 0);

  const floorGroup = new THREE.Group();
  floorGroup.add(floorMesh);
  floorGroup.add(glossPlane);
  floorGroup.add(carpet);
  floorGroup.add(leftStrip);
  floorGroup.add(rightStrip);
  floorGroup.add(leftZone);
  floorGroup.add(rightZone);
  floorGroup.add(particles.mesh);

  const lights = createFestivalLights(floorGroup);

  floorGroup.userData.update = (time, position) => {
    floorMaterial.uniforms.uTime.value = time;
    floorMaterial.uniforms.uSplashCenter.value.set(position.x, position.z);
    carpetMaterial.uniforms.uTime.value = time;
    particles.material.uniforms.uTime.value = time;

    lights.leftSpot.target.position.x = Math.sin(time * 0.8) * 4.0 - 3.0;
    lights.leftSpot.target.position.z = 3.0 + Math.cos(time * 0.6) * 2.2;
    lights.rightSpot.target.position.x = Math.sin(time * 0.7) * 4.0 + 3.0;
    lights.rightSpot.target.position.z = 3.0 - Math.cos(time * 0.65) * 2.4;

    lights.leftSpot.intensity = 0.8 + 0.4 * Math.sin(time * 2.1);
    lights.rightSpot.intensity = 0.75 + 0.35 * Math.sin(time * 2.3 + 1.2);
    lights.flash.intensity = 0.2 + Math.max(0, Math.sin(time * 4.4) * Math.sin(time * 1.3) * 1.8);
  };

  return floorGroup;
}
