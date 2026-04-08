import * as THREE from "three";

export function createSponsorScreen(imagePath ) {
  const wrapperGroup = new THREE.Group();

  const textureLoader = new THREE.TextureLoader();
  textureLoader.load(imagePath, (texture) => {
    // Enhance texture quality for highly realistic screens
    texture.anisotropy = 16;
    texture.colorSpace = THREE.SRGBColorSpace;

    // Dynamically calculate aspect ratio and width
    const imgWidth = texture.image.width;
    const imgHeight = texture.image.height;
    const aspect = imgWidth / imgHeight;

    const screenHeight = 5
    const screenWidth = screenHeight * aspect;
    const screenDepth = 0.2; // Robust real-world frame thickness

    // ========================================
    // 1. FRAME CASING
    // ========================================
    const frameThickness = 0.15;
    const frameGeo = new THREE.BoxGeometry(
      screenWidth + frameThickness * 2,
      screenHeight + frameThickness * 2,
      screenDepth
    );

    const frameMat = new THREE.MeshStandardMaterial({
      color: 0x181818, // Dark sleek metallic tone
      roughness: 0.3,
      metalness: 0.8,
    });
    const frameMesh = new THREE.Mesh(frameGeo, frameMat);
    frameMesh.castShadow = true;
    wrapperGroup.add(frameMesh);

    // ========================================
    // 2. GLOWING LED SCREEN
    // ========================================
    const screenGeo = new THREE.BoxGeometry(screenWidth, screenHeight, screenDepth + 0.02);

    const displayMaterial = new THREE.MeshStandardMaterial({
      map: texture,
      emissiveMap: texture,
      emissive: 0xffffff,
      emissiveIntensity: 1.2, // Realistic LED brightness
      roughness: 0.1,
      metalness: 0.1,
    });

    const blackSideMat = new THREE.MeshStandardMaterial({ color: 0x000000 });
    
    // Apply display out both front and back sides
    const screenMaterials = [
      blackSideMat, blackSideMat, blackSideMat, blackSideMat,
      displayMaterial, displayMaterial
    ];

    const screenMesh = new THREE.Mesh(screenGeo, screenMaterials);
    wrapperGroup.add(screenMesh);

    // ========================================
    // 3. STAND / POLES SYSTEM
    // ========================================
      const poleHeight = screenHeight + 1.2; 
      const baseMat = new THREE.MeshStandardMaterial({ color: 0x111111, metalness: 0.9, roughness: 0.5 });
      
      // Cylindrical poles
    const poleGeo = new THREE.CylinderGeometry(0.08, 0.08, poleHeight, 16);
    const poleLeft = new THREE.Mesh(poleGeo, baseMat);
    const poleRight = new THREE.Mesh(poleGeo, baseMat);

    // Heavy foot bases imitating counterweights
    const baseGeo = new THREE.BoxGeometry(1.0, 0.2, 0.8);
    const baseLeft = new THREE.Mesh(baseGeo, baseMat);
    const baseRight = new THREE.Mesh(baseGeo, baseMat);

    const poleDist = Math.max((screenWidth / 2) - 0.4, 0.4);

    poleLeft.position.set(-poleDist, poleHeight / 2, 0);
    poleRight.position.set(poleDist, poleHeight / 2, 0);

    baseLeft.position.set(-poleDist, 0.1, 0);
    baseRight.position.set(poleDist, 0.1, 0);

    wrapperGroup.add(poleLeft);
    wrapperGroup.add(poleRight);
    wrapperGroup.add(baseLeft);
    wrapperGroup.add(baseRight);

    // Align screen to top of poles
    const groupCenterY = poleHeight - (screenHeight / 2) - 0.1;
    frameMesh.position.y = groupCenterY;
    screenMesh.position.y = groupCenterY;

    // Ambient light spill
    const light = new THREE.PointLight(0xffffff, 0.4, 15);
    light.position.set(0, groupCenterY - screenHeight / 2, 0);
    wrapperGroup.add(light);
  });

  // Empty play function just in case legacy refs call it
  wrapperGroup.userData.play = () => {};

  return wrapperGroup;
}
