import * as THREE from "three";

export class FirecrackerSystem {
  constructor(scene) {
    this.scene = scene;
    this.spawnables = []; // Firecrackers on ground
    this.activeExplosions = []; // Particles
    this.activeRockets = []; // Rockets rocketing up
    this.timer = 0;
    this.maxSpawnables = 50; // Map can hold up to 50 rockets at a time
  }

  // Create a firecracker item to pick up anywhere on the map
  spawnFirecracker() {
    const group = new THREE.Group();
    
    // Make them bigger and brighter to be seen
    const stick = new THREE.Mesh(
      new THREE.CylinderGeometry(0.2, 0.2, 2, 8),
      new THREE.MeshStandardMaterial({ color: 0xff1155, roughness: 0.2, metalness: 0.5 })
    );
    group.add(stick);

    const spark = new THREE.Mesh(
      new THREE.SphereGeometry(0.4, 8, 8),
      new THREE.MeshStandardMaterial({ color: 0xffff00, emissive: 0xffaa00, emissiveIntensity: 3 })
    );
    spark.position.y = 1.2;
    group.add(spark);

    // Random X and Z strictly within the neon platform (108x108)
    const x = (Math.random() - 0.5) * 90; // within -45 to 45
    const z = (Math.random() - 0.5) * 90; // within -45 to 45
    group.position.set(x, 1.5, z);
    
    // Slight tilt
    group.rotation.z = Math.PI / 4;

    this.scene.add(group);
    this.spawnables.push({ mesh: group, age: 0 });
  }

  launch(startPos, camDir) {
    const rocket = new THREE.Mesh(
      new THREE.CylinderGeometry(0.2, 0.2, 2, 8),
      new THREE.MeshStandardMaterial({ color: 0xff3333, emissive: 0xff0000 })
    );
    
    // Start slightly in front of the character at chest/head height
    const offset = camDir.clone().multiplyScalar(2);
    rocket.position.copy(startPos).add(offset);
    rocket.position.y = 2.5; 
    
    // Shoot straight forward horizontally (like a fireball)
    const forwardArc = camDir.clone().multiplyScalar(45); // Fast horizontal speed
    const velocity = new THREE.Vector3(forwardArc.x, 0, forwardArc.z); // Zero Y velocity

    rocket.userData = {
      velocity: velocity,
      life: 1.0, // Time until explosion
    };

    this.scene.add(rocket);
    this.activeRockets.push(rocket);
  }

  createExplosion(pos) {
    const particleCount = 300;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const velocities = [];

    const baseColor = new THREE.Color().setHSL(Math.random(), 1, 0.5);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = pos.x;
      positions[i * 3 + 1] = pos.y;
      positions[i * 3 + 2] = pos.z;

      colors[i * 3] = baseColor.r + (Math.random() * 0.2 - 0.1);
      colors[i * 3 + 1] = baseColor.g + (Math.random() * 0.2 - 0.1);
      colors[i * 3 + 2] = baseColor.b + (Math.random() * 0.2 - 0.1);

      velocities.push(new THREE.Vector3(
        (Math.random() - 0.5) * 40,
        (Math.random() - 0.5) * 40,
        (Math.random() - 0.5) * 40
      ));
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
    const material = new THREE.PointsMaterial({
      size: 0.8,
      vertexColors: true,
      transparent: true,
      opacity: 1,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    const particles = new THREE.Points(geometry, material);
    particles.userData = { velocities, life: 1.5 };
    
    this.scene.add(particles);
    this.activeExplosions.push(particles);

    const flash = new THREE.PointLight(baseColor, 5, 100);
    flash.position.copy(pos);
    this.scene.add(flash);
    setTimeout(() => {
      this.scene.remove(flash);
    }, 400);
  }

  update(delta, charPos, onCollect) {
    // 1. Spawning logic - continuous time-based spawn
    this.timer += delta;
    if (this.timer > 0.5 && this.spawnables.length < this.maxSpawnables) {
      this.spawnFirecracker();
      this.timer = 0;
    }

    // 2. Collection & Hover Animation
    for (let i = this.spawnables.length - 1; i >= 0; i--) {
      const fcObj = this.spawnables[i];
      const fc = fcObj.mesh;
      fcObj.age += delta;
      
      fc.rotation.y += delta * 2;
      fc.position.y = 1.5 + Math.sin(Date.now() * 0.003 + fc.position.z) * 0.4;

      // Distance check for collection
      if (fc.position.distanceTo(charPos) < 3.0) {
        this.scene.remove(fc);
        this.spawnables.splice(i, 1);
        onCollect();
      }
      // Despawn if it's very old we recycle them so it feels dynamic
      else if (fcObj.age > 40) {
        this.scene.remove(fc);
        this.spawnables.splice(i, 1);
      }
    }

    // 3. Rocket Physics
    for (let i = this.activeRockets.length - 1; i >= 0; i--) {
      const rocket = this.activeRockets[i];
      rocket.position.addScaledVector(rocket.userData.velocity, delta);
      // No gravity for linear horizontal flight
      
      // Look forward
      if(rocket.userData.velocity.lengthSq() > 0.1) {
          rocket.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0), rocket.userData.velocity.clone().normalize());
      }

      rocket.userData.life -= delta;
      if (rocket.userData.life <= 0) {
        this.createExplosion(rocket.position);
        this.scene.remove(rocket);
        this.activeRockets.splice(i, 1);
      }
    }

    // 4. Explosion Particles Physics
    for (let i = this.activeExplosions.length - 1; i >= 0; i--) {
      const exp = this.activeExplosions[i];
      const positions = exp.geometry.attributes.position.array;
      const vels = exp.userData.velocities;
      
      for(let j=0; j<vels.length; j++) {
        positions[j*3] += vels[j].x * delta;
        positions[j*3+1] += vels[j].y * delta;
        positions[j*3+2] += vels[j].z * delta;
        
        vels[j].y -= 10 * delta; // Drag/gravity
      }
      exp.geometry.attributes.position.needsUpdate = true;
      
      exp.userData.life -= delta;
      exp.material.opacity = exp.userData.life / 1.5;

      if (exp.userData.life <= 0) {
        this.scene.remove(exp);
        exp.geometry.dispose();
        exp.material.dispose();
        this.activeExplosions.splice(i, 1);
      }
    }
  }
}
