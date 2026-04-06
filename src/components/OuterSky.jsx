import * as THREE from "three";

const partyColors = [
  new THREE.Color(0xff3ddb),
  new THREE.Color(0x1be7ff),
  new THREE.Color(0xccff2b),
  new THREE.Color(0xffc156),
];

const starVertex = `
attribute float aPhase;
varying vec3 vColor;
varying float vAlpha;
uniform float uTime;
void main() {
  vColor = color;
  float twinkle = 0.4 + 0.4 * sin(uTime * 3.2 + aPhase);
  vAlpha = twinkle;
  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
  gl_PointSize = 1.6 + 1.8 * sin(uTime * 2.3 + aPhase);
  gl_Position = projectionMatrix * mvPosition;
}
`;

const starFragment = `
varying vec3 vColor;
varying float vAlpha;
void main() {
  float d = length(gl_PointCoord - vec2(0.5));
  float alpha = smoothstep(0.5, 0.0, d) * vAlpha;
  gl_FragColor = vec4(vColor, alpha);
}
`;

const streamVertex = `
varying vec3 vColor;
uniform float uTime;
void main() {
  vColor = color;
  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
  gl_PointSize = 2.0;
  gl_Position = projectionMatrix * mvPosition;
}
`;

const streamFragment = `
varying vec3 vColor;
void main() {
  float d = length(gl_PointCoord - vec2(0.5));
  float alpha = smoothstep(0.5, 0.0, d) * 0.7;
  gl_FragColor = vec4(vColor, alpha);
}
`;

const skyVertex = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

function randomInRange(min, max) {
  return min + Math.random() * (max - min);
}

function createPartyStars() {
  const count = 1400;
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const phases = new Float32Array(count);

  for (let i = 0; i < count; i += 1) {
    const radius = randomInRange(52, 88);
    const theta = Math.random() * Math.PI * 2;
    const y = randomInRange(0, 34);
    positions[i * 3] = Math.cos(theta) * radius;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = Math.sin(theta) * radius;

    const color = partyColors[Math.floor(Math.random() * partyColors.length)];
    colors[i * 3] = color.r;
    colors[i * 3 + 1] = color.g;
    colors[i * 3 + 2] = color.b;
    phases[i] = Math.random() * Math.PI * 2;
  }

  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  geometry.setAttribute("aPhase", new THREE.BufferAttribute(phases, 1));

  const material = new THREE.ShaderMaterial({
    vertexShader: starVertex,
    fragmentShader: starFragment,
    uniforms: {
      uTime: { value: 0 },
    },
    vertexColors: true,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });

  return new THREE.Points(geometry, material);
}

function createSkyStream() {
  const count = 220;
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const speeds = new Float32Array(count);

  for (let i = 0; i < count; i += 1) {
    positions[i * 3] = randomInRange(-72, 72);
    positions[i * 3 + 1] = randomInRange(6, 22);
    positions[i * 3 + 2] = randomInRange(-78, 78);

    const palette = partyColors[Math.floor(Math.random() * partyColors.length)];
    colors[i * 3] = palette.r;
    colors[i * 3 + 1] = palette.g;
    colors[i * 3 + 2] = palette.b;
    speeds[i] = randomInRange(0.45, 1.25);
  }

  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  geometry.setAttribute("aSpeed", new THREE.BufferAttribute(speeds, 1));

  const material = new THREE.ShaderMaterial({
    vertexShader: streamVertex,
    fragmentShader: streamFragment,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    vertexColors: true,
  });

  return { mesh: new THREE.Points(geometry, material), geometry, speeds };
}

const nebulaFragment = `
uniform float uTime;
uniform vec3 uColorA;
uniform vec3 uColorB;
varying vec2 vUv;

void main() {
  vec2 uv = vUv;
  float noise = 0.18 * sin(uv.x * 12.0 + uTime * 0.14) * sin(uv.y * 8.0 + uTime * 0.18);
  float cloud = smoothstep(0.26, 0.0, length(uv - vec2(0.52 + 0.09 * sin(uTime * 0.12), 0.48)) + noise);
  cloud += smoothstep(0.22, 0.0, length(uv - vec2(0.35, 0.62)) + 0.08 * sin(uTime * 0.11 + uv.x * 3.0));
  cloud *= smoothstep(0.0, 1.0, uv.y);
  float glow = pow(cloud, 1.3);
  vec3 color = mix(uColorA, uColorB, uv.y * 0.8) * glow;
  color += vec3(0.9, 0.7, 1.0) * pow(max(0.0, 1.0 - length(uv - vec2(0.48, 0.55)) * 1.4), 2.0) * 0.22;
  gl_FragColor = vec4(color, glow * 0.24);
}
`;

const auroraFragment = `
uniform float uTime;
uniform vec3 uColorA;
uniform vec3 uColorB;
varying vec2 vUv;

void main() {
  vec2 uv = vUv;
  float wave = smoothstep(0.22, 0.0, abs(uv.y - 0.55 + 0.04 * sin(uTime * 0.48 + uv.x * 4.4)));
  float pulse = 0.28 + 0.15 * sin(uTime * 0.65 + uv.x * 3.0);
  float alpha = wave * pulse * smoothstep(0.0, 1.0, uv.x) * 0.4;
  vec3 color = mix(uColorA, uColorB, uv.x) * wave * 1.2;
  gl_FragColor = vec4(color, alpha);
}
`;

function createNebulaLayer(
  colorA,
  colorB,
  width,
  height,
  y,
  z,
  rotation,
  speed,
) {
  const material = new THREE.ShaderMaterial({
    vertexShader: skyVertex,
    fragmentShader: nebulaFragment,
    uniforms: {
      uTime: { value: 0 },
      uColorA: { value: new THREE.Color(colorA) },
      uColorB: { value: new THREE.Color(colorB) },
    },
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    side: THREE.DoubleSide,
  });

  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(width, height), material);
  mesh.rotation.x = -Math.PI / 2.2;
  mesh.position.set(0, y, z);
  mesh.rotation.y = rotation;
  mesh.userData = { speed };

  return mesh;
}

function createAuroraRibbons() {
  const group = new THREE.Group();
  const colors = [
    { a: 0xa52bff, b: 0x1be7ff },
    { a: 0xff3ddb, b: 0x5cffce },
  ];

  colors.forEach((palette, index) => {
    const material = new THREE.ShaderMaterial({
      vertexShader: skyVertex,
      fragmentShader: auroraFragment,
      uniforms: {
        uTime: { value: 0 },
        uColorA: { value: new THREE.Color(palette.a) },
        uColorB: { value: new THREE.Color(palette.b) },
      },
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
    });

    const mesh = new THREE.Mesh(
      new THREE.PlaneGeometry(96, 18, 1, 1),
      material,
    );
    mesh.rotation.x = -Math.PI / 2.35;
    mesh.rotation.z = index === 0 ? 0.08 : -0.07;
    mesh.position.set(0, 24 + index * 2.4, -12 + index * 4.0);
    mesh.userData = { speed: 0.08 + index * 0.03 };
    group.add(mesh);
  });

  return group;
}

function createSkyShapes() {
  const group = new THREE.Group();
  const shapes = [];

  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(3.8, 0.18, 10, 64),
    new THREE.MeshBasicMaterial({
      color: 0xff62c4,
      transparent: true,
      opacity: 0.22,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
      depthWrite: false,
    }),
  );
  ring.position.set(-18, 19, -36);
  ring.rotation.x = -0.16;
  ring.userData = { speed: 0.06 };
  group.add(ring);
  shapes.push(ring);

  const cube = new THREE.Mesh(
    new THREE.BoxGeometry(3.2, 3.2, 3.2),
    new THREE.MeshBasicMaterial({
      color: 0x8d74ff,
      transparent: true,
      opacity: 0.18,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    }),
  );
  cube.position.set(26, 16, -48);
  cube.userData = { speed: 0.04 };
  group.add(cube);
  shapes.push(cube);

  const panel = new THREE.Mesh(
    new THREE.PlaneGeometry(4.4, 10.6),
    new THREE.MeshBasicMaterial({
      color: 0x2bbaff,
      transparent: true,
      opacity: 0.16,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
      depthWrite: false,
    }),
  );
  panel.position.set(12, 22, -56);
  panel.rotation.y = 0.42;
  panel.userData = { speed: 0.05 };
  group.add(panel);
  shapes.push(panel);

  const shard = new THREE.Mesh(
    new THREE.OctahedronGeometry(2.2, 0),
    new THREE.MeshBasicMaterial({
      color: 0x7dffec,
      transparent: true,
      opacity: 0.14,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    }),
  );
  shard.position.set(-8, 20, -56);
  shard.userData = { speed: 0.08 };
  group.add(shard);
  shapes.push(shard);

  return { group, shapes };
}

function createShootingStars() {
  const count = 18;
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(count * 3);
  const velocities = new Float32Array(count);
  const delays = new Float32Array(count);

  for (let i = 0; i < count; i += 1) {
    positions[i * 3] = randomInRange(-82, 82);
    positions[i * 3 + 1] = randomInRange(18, 30);
    positions[i * 3 + 2] = randomInRange(-82, 82);
    velocities[i] = randomInRange(28, 44);
    delays[i] = randomInRange(0, Math.PI * 2);
  }

  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("aVelocity", new THREE.BufferAttribute(velocities, 1));
  geometry.setAttribute("aDelay", new THREE.BufferAttribute(delays, 1));

  const material = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 1.8,
    transparent: true,
    opacity: 0.85,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });

  return {
    mesh: new THREE.Points(geometry, material),
    geometry,
    velocities,
    delays,
  };
}

function createHorizonGlow() {
  const material = new THREE.MeshBasicMaterial({
    color: 0x1f2342,
    transparent: true,
    opacity: 0.18,
    blending: THREE.AdditiveBlending,
    side: THREE.DoubleSide,
    depthWrite: false,
  });

  const glow = new THREE.Mesh(new THREE.PlaneGeometry(220, 120), material);
  glow.rotation.x = -Math.PI / 2;
  glow.position.set(0, 0.5, 0);

  return glow;
}

function createNeonSkyLights() {
  const group = new THREE.Group();
  const ringColors = [0xff3ddb, 0x1be7ff, 0xccff2b, 0xffc156];

  for (let i = 0; i < 7; i += 1) {
    const radius = 26 + i * 5;
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(radius, 0.25, 8, 100), // thicker
      new THREE.MeshBasicMaterial({
        color: new THREE.Color(
          ringColors[i % ringColors.length],
        ).multiplyScalar(1.5),
        transparent: true,
        opacity: 0.35, // increased base
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide,
        depthWrite: false,
      }),
    );
    ring.rotation.x = Math.PI * 0.45 + i * 0.04;
    ring.position.set(0, 12 + i * 3.5, -6 + i * 1.2);
    group.add(ring);
  }

  const glowPlane = new THREE.Mesh(
    new THREE.PlaneGeometry(84, 10),
    new THREE.MeshBasicMaterial({
      color: 0x1be7ff,
      transparent: true,
      opacity: 0.06,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
      depthWrite: false,
    }),
  );
  glowPlane.rotation.x = -Math.PI / 2.65;
  glowPlane.position.set(0, 20, -22);
  group.add(glowPlane);

  const glowPlane2 = new THREE.Mesh(
    new THREE.PlaneGeometry(64, 6),
    new THREE.MeshBasicMaterial({
      color: 0xff3ddb,
      transparent: true,
      opacity: 0.05,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
      depthWrite: false,
    }),
  );
  glowPlane2.rotation.x = -Math.PI / 2.75;
  glowPlane2.position.set(-10, 24, 18);
  group.add(glowPlane2);

  group.userData = {
    update(time) {
      group.children.forEach((child, index) => {
        if (child.geometry.type === "TorusGeometry") {
          child.rotation.z = time * 0.08 * (index % 2 === 0 ? 1 : -1);
          child.material.opacity = 0.25 + 0.03 * Math.sin(time * 1.7 + index);
        }
      });
    },
  };

  return group;
}

export function createOuterSky() {
  const group = new THREE.Group();
  group.name = "OuterSky";

  const stars = createPartyStars();
  group.add(stars);

  const nebula1 = createNebulaLayer(
    0x8f32ff,
    0x2fe6ff,
    160,
    66,
    -24,
    0.12,
    0.02,
  );
  const nebula2 = createNebulaLayer(
    0xff59d1,
    0x62c5ff,
    128,
    48,
    -17,
    -0.09,
    0.03,
  );
  const nebula3 = createNebulaLayer(
    0x3a5cff,
    0x5cf4cc,
    142,
    52,
    -30,
    0.06,
    0.015,
  );
  group.add(nebula1, nebula2, nebula3);

  const auroras = createAuroraRibbons();
  group.add(auroras);

  const skyShapes = createSkyShapes();
  group.add(skyShapes.group);

  const shootingStars = createShootingStars();
  group.add(shootingStars.mesh);

  const horizonGlow = createHorizonGlow();
  group.add(horizonGlow);

  const stream = createSkyStream();
  stream.mesh.position.set(0, 0, 0);
  group.add(stream.mesh);

  const neonLights = createNeonSkyLights();
  group.add(neonLights);

  group.userData = {
    update(time, delta, playerPosition) {
      stars.material.uniforms.uTime.value = time;

      const positions = stream.geometry.attributes.position.array;
      for (let i = 0; i < positions.length; i += 3) {
        positions[i + 0] -= stream.speeds[i / 3] * delta * 7.0;
        positions[i + 2] += stream.speeds[i / 3] * delta * 2.4;
        if (positions[i + 0] < -78) positions[i + 0] = 78;
        if (positions[i + 0] > 78) positions[i + 0] = -78;
        if (positions[i + 2] < -78) positions[i + 2] = 78;
        if (positions[i + 2] > 78) positions[i + 2] = -78;
      }
      stream.geometry.attributes.position.needsUpdate = true;

      [nebula1, nebula2, nebula3].forEach((nebula, index) => {
        nebula.material.uniforms.uTime.value = time;
        nebula.position.x =
          2.5 * Math.sin(time * nebula.userData.speed + index * 1.4);
      });

      auroras.children.forEach((ribbon, index) => {
        ribbon.material.uniforms.uTime.value = time;
        ribbon.position.y =
          22 + index * 2.5 + 0.7 * Math.sin(time * ribbon.userData.speed);
      });

      skyShapes.shapes.forEach((shape) => {
        shape.rotation.y += 0.01 * shape.userData.speed;
        shape.rotation.x += 0.005 * shape.userData.speed;
      });

      const shootPositions = shootingStars.geometry.attributes.position.array;
      for (let i = 0; i < shootPositions.length; i += 3) {
        shootPositions[i + 0] += shootingStars.velocities[i / 3] * delta * 1.4;
        shootPositions[i + 2] += shootingStars.velocities[i / 3] * delta * 0.46;
        if (shootPositions[i + 0] > 86 || shootPositions[i + 2] > 86) {
          shootPositions[i + 0] = randomInRange(-86, -48);
          shootPositions[i + 1] = randomInRange(18, 28);
          shootPositions[i + 2] = randomInRange(-86, -48);
        }
      }
      shootingStars.geometry.attributes.position.needsUpdate = true;

      neonLights.userData.update(time);

      if (playerPosition) {
        const zoneInfluence = Math.max(
          0.0,
          1.0 - Math.abs(Math.abs(playerPosition.x) - 28.0) / 16.0,
        );
        const pulse = 0.2 + 0.25 * zoneInfluence;
        neonLights.children.forEach((child) => {
          if (child.material) child.material.opacity = 0.08 + pulse * 0.08;
        });
      }
    },
  };

  return group;
}
