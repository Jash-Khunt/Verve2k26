import * as THREE from "three";

const Character = () => {
  const group = new THREE.Group();

  // ─── Color Palette ──────────────────────────────────────────
  const skinColor = 0xf5c6a0;
  const skinEmissive = 0xd9a57a;
  const hairColor = 0x1a1a2e;
  const jacketColor = 0x1e3a5f;
  const jacketEmissive = 0x0d2137;
  const shirtColor = 0xe8e8e8;
  const pantsColor = 0x2c2c3a;
  const shoeColor = 0xf0f0f0;
  const shoeSoleColor = 0x222222;
  const accentColor = 0x00d4ff;

  // ─── Materials ──────────────────────────────────────────────
  const skinMat = new THREE.MeshStandardMaterial({
    color: skinColor,
    emissive: skinEmissive,
    emissiveIntensity: 0.15,
    roughness: 0.6,
    metalness: 0.05,
  });

  const hairMat = new THREE.MeshStandardMaterial({
    color: hairColor,
    roughness: 0.8,
    metalness: 0.1,
  });

  const jacketMat = new THREE.MeshStandardMaterial({
    color: jacketColor,
    emissive: jacketEmissive,
    emissiveIntensity: 0.2,
    roughness: 0.5,
    metalness: 0.15,
  });

  const shirtMat = new THREE.MeshStandardMaterial({
    color: shirtColor,
    roughness: 0.7,
    metalness: 0.0,
  });

  const pantsMat = new THREE.MeshStandardMaterial({
    color: pantsColor,
    roughness: 0.6,
    metalness: 0.1,
  });

  const shoeMat = new THREE.MeshStandardMaterial({
    color: shoeColor,
    roughness: 0.4,
    metalness: 0.2,
  });

  const soleMat = new THREE.MeshStandardMaterial({
    color: shoeSoleColor,
    roughness: 0.9,
    metalness: 0.0,
  });

  const accentMat = new THREE.MeshStandardMaterial({
    color: accentColor,
    emissive: accentColor,
    emissiveIntensity: 0.8,
    roughness: 0.2,
    metalness: 0.5,
  });

  const eyeWhiteMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    roughness: 0.3,
  });

  const eyePupilMat = new THREE.MeshStandardMaterial({
    color: 0x1a1a2e,
    roughness: 0.2,
  });

  // ─── Body Container (for animation) ─────────────────────────
  const body = new THREE.Group();
  group.add(body);

  // ─── TORSO ──────────────────────────────────────────────────
  // Upper torso (jacket)
  const torsoGeo = new THREE.BoxGeometry(0.9, 0.7, 0.5, 2, 2, 2);
  // Slightly taper the torso
  const torsoPositions = torsoGeo.attributes.position;
  for (let i = 0; i < torsoPositions.count; i++) {
    const y = torsoPositions.getY(i);
    const factor = y > 0 ? 0.92 : 1.05;
    torsoPositions.setX(i, torsoPositions.getX(i) * factor);
  }
  torsoGeo.computeVertexNormals();
  const torso = new THREE.Mesh(torsoGeo, jacketMat);
  torso.position.y = 1.45;
  body.add(torso);

  // Jacket collar / shirt peeking out
  const collar = new THREE.Mesh(
    new THREE.BoxGeometry(0.5, 0.12, 0.35),
    shirtMat
  );
  collar.position.y = 1.83;
  collar.position.z = 0.02;
  body.add(collar);

  // Jacket accent stripe (neon detail on the chest)
  const stripeGeo = new THREE.BoxGeometry(0.06, 0.55, 0.52);
  const stripeL = new THREE.Mesh(stripeGeo, accentMat);
  stripeL.position.set(-0.25, 1.45, 0);
  body.add(stripeL);

  const stripeR = new THREE.Mesh(stripeGeo, accentMat);
  stripeR.position.set(0.25, 1.45, 0);
  body.add(stripeR);

  // ─── HIPS / WAIST ──────────────────────────────────────────
  const hips = new THREE.Mesh(
    new THREE.BoxGeometry(0.8, 0.25, 0.45),
    pantsMat
  );
  hips.position.y = 1.0;
  body.add(hips);

  // Belt
  const belt = new THREE.Mesh(
    new THREE.BoxGeometry(0.82, 0.08, 0.47),
    new THREE.MeshStandardMaterial({
      color: 0x444455,
      roughness: 0.3,
      metalness: 0.6,
    })
  );
  belt.position.y = 1.12;
  body.add(belt);

  // Belt buckle (neon accent)
  const buckle = new THREE.Mesh(
    new THREE.BoxGeometry(0.1, 0.08, 0.49),
    accentMat
  );
  buckle.position.y = 1.12;
  body.add(buckle);

  // ─── HEAD ──────────────────────────────────────────────────
  const headGroup = new THREE.Group();
  headGroup.position.y = 2.15;
  body.add(headGroup);

  // Head shape - slightly elongated box with rounded appearance
  const headGeo = new THREE.BoxGeometry(0.48, 0.52, 0.45, 3, 3, 3);
  // Round the head vertices slightly
  const headPos = headGeo.attributes.position;
  for (let i = 0; i < headPos.count; i++) {
    const x = headPos.getX(i);
    const y = headPos.getY(i);
    const z = headPos.getZ(i);
    const len = Math.sqrt(x * x + y * y + z * z);
    const targetLen = 0.3;
    if (len > targetLen) {
      const scale = targetLen / len;
      const blend = 0.35;
      headPos.setX(i, x * (1 - blend) + x * scale * blend);
      headPos.setY(i, y * (1 - blend) + y * scale * blend);
      headPos.setZ(i, z * (1 - blend) + z * scale * blend);
    }
  }
  headGeo.computeVertexNormals();
  const head = new THREE.Mesh(headGeo, skinMat);
  headGroup.add(head);

  // ─── HAIR ──────────────────────────────────────────────────
  // Top hair
  const hairTop = new THREE.Mesh(
    new THREE.BoxGeometry(0.52, 0.18, 0.48),
    hairMat
  );
  hairTop.position.y = 0.28;
  hairTop.position.z = 0.02;
  headGroup.add(hairTop);

  // Side hair (left)
  const hairSide = new THREE.Mesh(
    new THREE.BoxGeometry(0.08, 0.35, 0.42),
    hairMat
  );
  hairSide.position.set(-0.26, 0.12, 0.04);
  headGroup.add(hairSide);

  // Side hair (right)
  const hairSideR = hairSide.clone();
  hairSideR.position.set(0.26, 0.12, 0.04);
  headGroup.add(hairSideR);

  // Back hair
  const hairBack = new THREE.Mesh(
    new THREE.BoxGeometry(0.5, 0.4, 0.1),
    hairMat
  );
  hairBack.position.set(0, 0.1, 0.24);
  headGroup.add(hairBack);

  // Fringe / front hair swoosh
  const fringe = new THREE.Mesh(
    new THREE.BoxGeometry(0.35, 0.1, 0.12),
    hairMat
  );
  fringe.position.set(0.08, 0.26, -0.2);
  fringe.rotation.z = -0.15;
  headGroup.add(fringe);

  // ─── FACE ──────────────────────────────────────────────────
  // Eyes
  const eyeGeo = new THREE.SphereGeometry(0.045, 8, 8);
  const pupilGeo = new THREE.SphereGeometry(0.025, 8, 8);

  const eyeL = new THREE.Mesh(eyeGeo, eyeWhiteMat);
  eyeL.position.set(-0.12, 0.04, -0.22);
  headGroup.add(eyeL);

  const pupilL = new THREE.Mesh(pupilGeo, eyePupilMat);
  pupilL.position.set(-0.12, 0.04, -0.25);
  headGroup.add(pupilL);

  const eyeR = new THREE.Mesh(eyeGeo, eyeWhiteMat);
  eyeR.position.set(0.12, 0.04, -0.22);
  headGroup.add(eyeR);

  const pupilR = new THREE.Mesh(pupilGeo, eyePupilMat);
  pupilR.position.set(0.12, 0.04, -0.25);
  headGroup.add(pupilR);

  // Eyebrows
  const browGeo = new THREE.BoxGeometry(0.1, 0.02, 0.04);
  const browMat = hairMat;

  const browL = new THREE.Mesh(browGeo, browMat);
  browL.position.set(-0.12, 0.1, -0.22);
  browL.rotation.z = 0.1;
  headGroup.add(browL);

  const browR = new THREE.Mesh(browGeo, browMat);
  browR.position.set(0.12, 0.1, -0.22);
  browR.rotation.z = -0.1;
  headGroup.add(browR);

  // Nose
  const nose = new THREE.Mesh(
    new THREE.BoxGeometry(0.06, 0.06, 0.06),
    skinMat
  );
  nose.position.set(0, -0.02, -0.25);
  headGroup.add(nose);

  // Mouth
  const mouth = new THREE.Mesh(
    new THREE.BoxGeometry(0.12, 0.02, 0.03),
    new THREE.MeshStandardMaterial({
      color: 0xcc7777,
      roughness: 0.5,
    })
  );
  mouth.position.set(0, -0.12, -0.23);
  headGroup.add(mouth);

  // Ears
  const earGeo = new THREE.BoxGeometry(0.06, 0.1, 0.06);
  const earL = new THREE.Mesh(earGeo, skinMat);
  earL.position.set(-0.26, 0.02, 0);
  headGroup.add(earL);

  const earR = new THREE.Mesh(earGeo, skinMat);
  earR.position.set(0.26, 0.02, 0);
  headGroup.add(earR);

  // Neck
  const neck = new THREE.Mesh(
    new THREE.CylinderGeometry(0.1, 0.12, 0.15, 8),
    skinMat
  );
  neck.position.y = 1.92;
  body.add(neck);

  // ─── ARMS ──────────────────────────────────────────────────
  // Left arm group (pivot at shoulder)
  const leftArmGroup = new THREE.Group();
  leftArmGroup.position.set(-0.55, 1.72, 0);
  body.add(leftArmGroup);

  // Upper arm (jacket sleeve)
  const upperArmL = new THREE.Mesh(
    new THREE.BoxGeometry(0.2, 0.4, 0.2),
    jacketMat
  );
  upperArmL.position.y = -0.2;
  leftArmGroup.add(upperArmL);

  // Lower arm (skin)
  const lowerArmL = new THREE.Mesh(
    new THREE.BoxGeometry(0.16, 0.35, 0.16),
    skinMat
  );
  lowerArmL.position.y = -0.55;
  leftArmGroup.add(lowerArmL);

  // Hand
  const handL = new THREE.Mesh(
    new THREE.BoxGeometry(0.14, 0.12, 0.1),
    skinMat
  );
  handL.position.y = -0.78;
  leftArmGroup.add(handL);

  // Sleeve accent stripe
  const sleeveAccentL = new THREE.Mesh(
    new THREE.BoxGeometry(0.22, 0.04, 0.22),
    accentMat
  );
  sleeveAccentL.position.y = -0.38;
  leftArmGroup.add(sleeveAccentL);

  // Right arm group (pivot at shoulder)
  const rightArmGroup = new THREE.Group();
  rightArmGroup.position.set(0.55, 1.72, 0);
  body.add(rightArmGroup);

  // Upper arm (jacket sleeve)
  const upperArmR = new THREE.Mesh(
    new THREE.BoxGeometry(0.2, 0.4, 0.2),
    jacketMat
  );
  upperArmR.position.y = -0.2;
  rightArmGroup.add(upperArmR);

  // Lower arm (skin)
  const lowerArmR = new THREE.Mesh(
    new THREE.BoxGeometry(0.16, 0.35, 0.16),
    skinMat
  );
  lowerArmR.position.y = -0.55;
  rightArmGroup.add(lowerArmR);

  // Hand
  const handR = new THREE.Mesh(
    new THREE.BoxGeometry(0.14, 0.12, 0.1),
    skinMat
  );
  handR.position.y = -0.78;
  rightArmGroup.add(handR);

  // Sleeve accent stripe
  const sleeveAccentR = new THREE.Mesh(
    new THREE.BoxGeometry(0.22, 0.04, 0.22),
    accentMat
  );
  sleeveAccentR.position.y = -0.38;
  rightArmGroup.add(sleeveAccentR);

  // ─── LEGS ──────────────────────────────────────────────────
  // Left leg group (pivot at hip)
  const leftLegGroup = new THREE.Group();
  leftLegGroup.position.set(-0.2, 0.88, 0);
  body.add(leftLegGroup);

  // Upper leg (pants)
  const upperLegL = new THREE.Mesh(
    new THREE.BoxGeometry(0.22, 0.45, 0.22),
    pantsMat
  );
  upperLegL.position.y = -0.25;
  leftLegGroup.add(upperLegL);

  // Lower leg (pants)
  const lowerLegL = new THREE.Mesh(
    new THREE.BoxGeometry(0.2, 0.4, 0.2),
    pantsMat
  );
  lowerLegL.position.y = -0.65;
  leftLegGroup.add(lowerLegL);

  // Shoe
  const shoeL = new THREE.Mesh(
    new THREE.BoxGeometry(0.22, 0.14, 0.34),
    shoeMat
  );
  shoeL.position.set(0, -0.9, -0.05);
  leftLegGroup.add(shoeL);

  // Shoe sole
  const soleL = new THREE.Mesh(
    new THREE.BoxGeometry(0.24, 0.04, 0.36),
    soleMat
  );
  soleL.position.set(0, -0.97, -0.05);
  leftLegGroup.add(soleL);

  // Shoe accent stripe
  const shoeAccentL = new THREE.Mesh(
    new THREE.BoxGeometry(0.23, 0.03, 0.18),
    accentMat
  );
  shoeAccentL.position.set(0, -0.87, -0.12);
  leftLegGroup.add(shoeAccentL);

  // Right leg group (pivot at hip)
  const rightLegGroup = new THREE.Group();
  rightLegGroup.position.set(0.2, 0.88, 0);
  body.add(rightLegGroup);

  // Upper leg (pants)
  const upperLegR = new THREE.Mesh(
    new THREE.BoxGeometry(0.22, 0.45, 0.22),
    pantsMat
  );
  upperLegR.position.y = -0.25;
  rightLegGroup.add(upperLegR);

  // Lower leg (pants)
  const lowerLegR = new THREE.Mesh(
    new THREE.BoxGeometry(0.2, 0.4, 0.2),
    pantsMat
  );
  lowerLegR.position.y = -0.65;
  rightLegGroup.add(lowerLegR);

  // Shoe
  const shoeR = new THREE.Mesh(
    new THREE.BoxGeometry(0.22, 0.14, 0.34),
    shoeMat
  );
  shoeR.position.set(0, -0.9, -0.05);
  rightLegGroup.add(shoeR);

  // Shoe sole
  const soleR = new THREE.Mesh(
    new THREE.BoxGeometry(0.24, 0.04, 0.36),
    soleMat
  );
  soleR.position.set(0, -0.97, -0.05);
  rightLegGroup.add(soleR);

  // Shoe accent stripe
  const shoeAccentR = new THREE.Mesh(
    new THREE.BoxGeometry(0.23, 0.03, 0.18),
    accentMat
  );
  shoeAccentR.position.set(0, -0.87, -0.12);
  rightLegGroup.add(shoeAccentR);

  // ─── GLOW RING (character indicator on ground) ──────────────
  const glow = new THREE.Mesh(
    new THREE.TorusGeometry(0.55, 0.04, 8, 64),
    new THREE.MeshStandardMaterial({
      color: accentColor,
      emissive: accentColor,
      emissiveIntensity: 1.2,
      roughness: 0.15,
      metalness: 0.6,
      transparent: true,
      opacity: 0.7,
    })
  );
  glow.rotation.x = Math.PI / 2;
  glow.position.y = 0.02;
  group.add(glow);

  // Second outer glow ring
  const glowOuter = new THREE.Mesh(
    new THREE.TorusGeometry(0.7, 0.02, 8, 64),
    new THREE.MeshStandardMaterial({
      color: accentColor,
      emissive: accentColor,
      emissiveIntensity: 0.6,
      roughness: 0.15,
      metalness: 0.6,
      transparent: true,
      opacity: 0.3,
    })
  );
  glowOuter.rotation.x = Math.PI / 2;
  glowOuter.position.y = 0.01;
  group.add(glowOuter);

  // ─── CHARACTER POINT LIGHT ──────────────────────────────────
  const charLight = new THREE.PointLight(accentColor, 0.6, 5);
  charLight.position.y = 1.5;
  group.add(charLight);

  // ─── ANIMATION STATE ───────────────────────────────────────
  let prevPosition = new THREE.Vector3(0, 0, 45);
  let walkPhase = 0;
  let idlePhase = 0;

  group.userData.update = (delta) => {
    // Detect movement
    const dx = group.position.x - prevPosition.x;
    const dz = group.position.z - prevPosition.z;
    const isMoving = Math.abs(dx) > 0.001 || Math.abs(dz) > 0.001;
    prevPosition.copy(group.position);

    if (isMoving) {
      // ─── WALK ANIMATION ────────────────────────────
      walkPhase += delta * 10;
      const swing = Math.sin(walkPhase) * 0.5;

      // Arms swing opposite to legs
      leftArmGroup.rotation.x = swing;
      rightArmGroup.rotation.x = -swing;

      // Legs swing
      leftLegGroup.rotation.x = -swing;
      rightLegGroup.rotation.x = swing;

      // Subtle body sway
      body.rotation.z = Math.sin(walkPhase) * 0.03;
      body.position.y = Math.abs(Math.sin(walkPhase * 2)) * 0.04;

      // Head bob
      headGroup.rotation.x = Math.sin(walkPhase * 2) * 0.02;

      idlePhase = 0;
    } else {
      // ─── IDLE ANIMATION ─────────────────────────────
      idlePhase += delta * 2;

      // Gentle breathing
      const breathe = Math.sin(idlePhase) * 0.01;
      body.position.y = breathe;
      body.scale.set(1, 1 + breathe * 0.5, 1);

      // Subtle arm relax
      leftArmGroup.rotation.x *= 0.9;
      rightArmGroup.rotation.x *= 0.9;
      leftLegGroup.rotation.x *= 0.9;
      rightLegGroup.rotation.x *= 0.9;

      body.rotation.z *= 0.9;

      // Subtle head movement
      headGroup.rotation.y = Math.sin(idlePhase * 0.5) * 0.05;
    }

    // Glow ring animation
    glow.rotation.z += delta * 0.5;
    glowOuter.rotation.z -= delta * 0.3;
    const glowPulse = 0.5 + Math.sin(idlePhase * 3 + walkPhase) * 0.3;
    glow.material.opacity = 0.5 + glowPulse * 0.3;
    glowOuter.material.opacity = 0.2 + glowPulse * 0.15;

    // Light pulse
    charLight.intensity = 0.4 + glowPulse * 0.3;
  };

  group.scale.set(1.5, 1.5, 1.5);
  group.position.set(0, 0, 45);
  return group;
};

export default Character;
