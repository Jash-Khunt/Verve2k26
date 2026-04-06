import * as THREE from "three";

export function createBuildings() {
  const group = new THREE.Group();
  const interactableMeshes = [];

  const createBuilding = (baseColor, trimColor, title, desc, action, x, z, scale, type) => {
    const bGroup = new THREE.Group();
    
    // Base Structure material
    const material = new THREE.MeshStandardMaterial({
      color: baseColor,
      roughness: 0.3,
      metalness: 0.6,
      emissive: baseColor,
      emissiveIntensity: 0.2
    });

    let mesh;
    // Distinct shapes based on type
    if (type === "arena") {
        mesh = new THREE.Mesh(new THREE.CylinderGeometry(scale, scale+2, scale*1.5, 16), material);
        mesh.position.y = scale*0.75;
    } else if (type === "hub") {
        mesh = new THREE.Mesh(new THREE.BoxGeometry(scale*1.5, scale*1.2, scale*1.5), material);
        mesh.position.y = scale*0.6;
    } else if (type === "workshop") {
        mesh = new THREE.Mesh(new THREE.OctahedronGeometry(scale, 1), material);
        mesh.position.y = scale;
    } else { // stage
        mesh = new THREE.Mesh(new THREE.TorusKnotGeometry(scale*0.6, scale*0.2, 64, 16), material);
        mesh.position.y = scale*1.2;
    }
    bGroup.add(mesh);

    // Neon Details
    const trimMat = new THREE.MeshStandardMaterial({
      color: trimColor,
      emissive: trimColor,
      emissiveIntensity: 3,
    });
    const trim = new THREE.Mesh(new THREE.BoxGeometry(scale*0.5, 0.5, scale*0.5), trimMat);
    trim.position.y = scale * 1.8;
    bGroup.add(trim);
    
    // Floating Hologram / Sign
    const holoGeo = new THREE.TorusGeometry(scale * 0.4, 0.15, 8, 24);
    const holoMat = new THREE.MeshStandardMaterial({
      color: trimColor,
      emissive: 0xffffff,
      emissiveIntensity: 4,
      wireframe: true
    });
    const holo = new THREE.Mesh(holoGeo, holoMat);
    holo.position.y = scale * 2.2;
    bGroup.add(holo);

    // Collision Box for Interactivity
    const collisionGeo = new THREE.BoxGeometry(scale * 3, scale * 3, scale * 3);
    const collisionMat = new THREE.MeshBasicMaterial({ visible: false });
    const collisionMesh = new THREE.Mesh(collisionGeo, collisionMat);
    collisionMesh.position.y = scale;
    collisionMesh.userData = { isBuilding: true, title, desc, action, color: trimColor };
    bGroup.add(collisionMesh);
    interactableMeshes.push(collisionMesh);

    // Point Light for building
    const light = new THREE.PointLight(trimColor, 3, 50);
    light.position.set(0, scale*1.5, 0);
    bGroup.add(light);

    bGroup.position.set(x, 0, z);

    // Animation Loop per building
    bGroup.userData.update = (t) => {
      holo.rotation.y += 0.02;
      holo.rotation.x += 0.01;
      holo.position.y = scale * 2.2 + Math.sin(t * 3) * 0.5;
      
      if(type === "stage" || type === "workshop") {
        mesh.rotation.y += 0.005;
      }
    };

    return bGroup;
  };

  // Spread buildings inside the 108x108 map [-50 to 50 boundaries roughly]
  const b1 = createBuilding(
    0xff0044, 0xffaacc, 
    "Events Arena", "Join the biggest tech talks and keynote sessions right here.", "Explore Events", 
    -35, 45, 10, "arena"
  );
  
  const b2 = createBuilding(
    0x0055ff, 0xaaccff, 
    "Workshops & Learning", "Hands-on coding, design, and hardware workshops.", "Register Now", 
    35, 20, 9, "workshop"
  );

  const b3 = createBuilding(
    0x00aa44, 0xccffcc, 
    "Competitions Hub", "Compete with the best minds in hackathons and coding battles.", "Start Hacking", 
    -40, -20, 11, "hub"
  );

  const b4 = createBuilding(
    0xaa00cc, 0xeebbee, 
    "Concert Stage", "Pro shows, DJ nights, and cultural performances.", "Get Tickets", 
    40, -45, 12, "stage"
  );

  group.add(b1, b2, b3, b4);
  const buildingsList = [b1, b2, b3, b4];

  group.userData.update = (t) => {
    buildingsList.forEach(b => b.userData.update(t));
  };
  
  group.userData.interactables = interactableMeshes;

  return group;
}
