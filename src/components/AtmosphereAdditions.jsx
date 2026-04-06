import * as THREE from "three";

export function createBalloons() {
  const group = new THREE.Group();
  const balloons = [];
  const colors = [0xff006e, 0x3a86ff, 0x00ffa5, 0xffc156];

  for (let i = 0; i < 4; i++) {
    const balloonGroup = new THREE.Group();

    // Balloon Envelope (Top)
    const envelope = new THREE.Mesh(
      new THREE.SphereGeometry(3, 32, 16),
      new THREE.MeshStandardMaterial({
        color: colors[i % colors.length],
        roughness: 0.4,
        metalness: 0.1,
      })
    );
    envelope.scale.y = 1.2;
    balloonGroup.add(envelope);

    // Basket
    const basket = new THREE.Mesh(
      new THREE.BoxGeometry(1.2, 1, 1.2),
      new THREE.MeshStandardMaterial({ color: 0x5a3a22 })
    );
    basket.position.y = -4.5;
    balloonGroup.add(basket);

    // Ropes
    const ropeGeo = new THREE.CylinderGeometry(0.04, 0.04, 2);
    const ropeMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const positions = [
      [-0.5, -3.5, 0.5],
      [0.5, -3.5, 0.5],
      [-0.5, -3.5, -0.5],
      [0.5, -3.5, -0.5]
    ];
    positions.forEach((pos) => {
      const rope = new THREE.Mesh(ropeGeo, ropeMat);
      rope.position.set(pos[0], pos[1], pos[2]);
      // Angle them slightly towards the center of basket
      rope.lookAt(0, -4.5, 0);
      rope.rotateX(Math.PI / 2);
      balloonGroup.add(rope);
    });

    // Specific placements exactly filling the gaps between the buildings
    const placements = [
      { x: -25, z: -5, y: 14 },  // Between Left 1 (Headlines) and Left 2 (Theme)
      { x: 25, z: 5, y: 18 },    // Between Right 1 (About Us) and Right 2 (History)
      { x: -15, z: 30, y: 15 },  // Front left empty space (near spawn)
      { x: 18, z: -32, y: 20 },  // Back right empty space (near board)
    ];
    
    // Fallback just in case we add more than 4 balloons later
    const pos = placements[i] || { x: (Math.random() - 0.5) * 40, y: 15, z: (Math.random() - 0.5) * 40 };
    balloonGroup.position.set(pos.x, pos.y, pos.z);

    balloonGroup.userData = {
      baseY: balloonGroup.position.y,
      speed: 0.5 + Math.random() * 0.5,
      offset: Math.random() * Math.PI * 2,
    };

    group.add(balloonGroup);
    balloons.push(balloonGroup);
  }

  group.userData.update = (time) => {
    balloons.forEach((b) => {
      b.position.y = b.userData.baseY + Math.sin(time * b.userData.speed + b.userData.offset) * 2.5;
    });
  };

  return group;
}

export function createPlanets() {
  const group = new THREE.Group();

  // 1. Sun (Huge, Glowing, very far away)
  const sun = new THREE.Mesh(
    new THREE.SphereGeometry(18, 64, 64),
    new THREE.MeshBasicMaterial({ color: 0xffaa00 })
  );
  sun.position.set(-80, 45, -120);
  
  // Sun Glow
  const sunGlow = new THREE.Mesh(
    new THREE.SphereGeometry(22, 64, 64),
    new THREE.MeshBasicMaterial({ color: 0xff4400, transparent: true, opacity: 0.4, blending: THREE.AdditiveBlending })
  );
  sun.add(sunGlow);
  group.add(sun);

  // 2. Earth (Blue-green sphere)
  const earthGroup = new THREE.Group();
  const earth = new THREE.Mesh(
    new THREE.SphereGeometry(8, 32, 32),
    new THREE.MeshStandardMaterial({ color: 0x3a86ff, roughness: 0.6 })
  );
  // Add some green continents (rough stylized boxes/spheres on it)
  for (let i = 0; i < 5; i++) {
    const continent = new THREE.Mesh(
      new THREE.SphereGeometry(4, 16, 16),
      new THREE.MeshStandardMaterial({ color: 0x00ffa5 })
    );
    continent.position.set(
      (Math.random() - 0.5) * 10,
      (Math.random() - 0.5) * 10,
      (Math.random() - 0.5) * 10
    );
    earth.add(continent);
  }
  earthGroup.position.set(90, 35, 60);
  earthGroup.add(earth);

  // 3. Moon (Orbiting Earth)
  const moon = new THREE.Mesh(
    new THREE.SphereGeometry(2, 16, 16),
    new THREE.MeshStandardMaterial({ color: 0x888888, roughness: 0.8 })
  );
  moon.position.set(14, 0, 0);
  earthGroup.add(moon);
  group.add(earthGroup);

  // 4. Saturn (Sphere + Ring)
  const saturn = new THREE.Mesh(
    new THREE.SphereGeometry(10, 32, 32),
    new THREE.MeshStandardMaterial({ color: 0xffc156 })
  );
  saturn.position.set(50, 60, -90);

  const saturnRing = new THREE.Mesh(
    new THREE.TorusGeometry(18, 2, 8, 64),
    new THREE.MeshStandardMaterial({ color: 0xffcca0, transparent: true, opacity: 0.8 })
  );
  saturnRing.rotation.x = Math.PI / 2.5;
  saturnRing.rotation.y = 0.2;
  saturn.add(saturnRing);
  group.add(saturn);

  group.userData.update = (time) => {
    // Slowly rotate planets
    sun.rotation.y = time * 0.05;
    earth.rotation.y = time * 0.1;
    earthGroup.rotation.y = time * 0.02; // Moon path
    saturn.rotation.y = time * 0.05;
  };

  return group;
}
