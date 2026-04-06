import * as THREE from "three";
import gsap from "gsap";

export function createBillboard() {
  const billboardGroup = new THREE.Group();

  // ========================================
  // 1. CANVAS TEXTURE (MULTICOLOR GRADIENT BACKGROUND)
  // ========================================
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 256;
  const ctx = canvas.getContext("2d");

  // Create multicolor gradient background
  const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  gradient.addColorStop(0, "#ff006e");      // Hot pink
  gradient.addColorStop(0.25, "#8338ec");   // Purple
  gradient.addColorStop(0.5, "#3a86ff");    // Blue
  gradient.addColorStop(0.75, "#06ffa5");   // Cyan
  gradient.addColorStop(1, "#ff006e");      // Back to hot pink

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Add subtle animated pattern overlay
  ctx.fillStyle = "rgba(255, 255, 255, 0.08)";
  for (let i = 0; i < 20; i++) {
    ctx.fillRect(Math.random() * canvas.width, Math.random() * canvas.height, 50, 50);
  }

  // 🔥 BIGGER TEXT (IMPORTANT FIX)
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 10rem Arial";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  // Text glow shadow
  ctx.shadowColor = "rgba(37, 36, 36, 0.8)";
  ctx.shadowBlur = 30;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;
  
  ctx.fillText("VERVE2K26", canvas.width / 2, canvas.height / 2);

  // glow stroke
  ctx.shadowColor = "rgba(255, 255, 255, 0.9)";
  ctx.shadowBlur = 20;
  ctx.lineWidth = 4;
  ctx.strokeStyle = "rgba(255, 255, 255, 0.5)";
  ctx.strokeText("VERVE2K26", canvas.width / 2, canvas.height / 2);

  const texture = new THREE.CanvasTexture(canvas);

  // ========================================
  // 2. GEOMETRY (BIGGER HEIGHT)
  // ========================================
  const billboardWidth = 50;     // Smaller for center placement
  const billboardHeight = 12;     // Appropriate height for center
  const billboardDepth = 0.4;

  const geometry = new THREE.BoxGeometry(
    billboardWidth,
    billboardHeight,
    billboardDepth
  );

  // ========================================
  // 3. MATERIALS (STRONGER VISIBILITY)
  // ========================================
  const displayMaterial = new THREE.MeshStandardMaterial({
    map: texture,
    emissiveMap: texture,
    emissive: 0xffffff,
    emissiveIntensity: 100, // start from 0 (animation)
    roughness: 0.2,
    metalness: 0.1,
  });

  const sideMaterial = new THREE.MeshStandardMaterial({
    color: 0x1a1a1a,
    roughness: 0.8,
    metalness: 0.3,
  });

  const materials = [
    sideMaterial,
    sideMaterial,
    sideMaterial,
    sideMaterial,
    displayMaterial, // front
    displayMaterial, // 🔥 also back (visible from both sides)
  ];

  const billboard = new THREE.Mesh(geometry, materials);

  // ========================================
  // 4. POSITION (CLOSER TO USER)
  // ========================================
  billboard.position.set(0, 15, -25); // Center of floor, above runway, near structures

  billboard.castShadow = true;
  billboard.receiveShadow = true;

  billboard.displayMaterial = displayMaterial;

  billboardGroup.add(billboard);

  // ========================================
  // 5. LIGHTING (SLIGHT BOOST)
  // ========================================
  const light = new THREE.PointLight(0xffffff, 1.5, 80);
  light.position.set(0, 10, -15);  // Adjusted for center position
  billboardGroup.add(light);

  // ========================================
  // 6. GSAP ANIMATION (STRONGER EMISSIVE + ROTATION)
  // ========================================
  const tl = gsap.timeline({ paused: true });

  tl.to(displayMaterial, {
    emissiveIntensity: 3, // Adjusted for center position visibility
    duration: 2.5,
    ease: "power2.out",
  });

  billboard.playEntryAnimation = () => {
    tl.play();
  };

  // ========================================
  // 7. CONSTANT MAXIMUM BRIGHTNESS
  // ========================================
  // Text is always bright and visible from any distance
  displayMaterial.emissiveIntensity = 30.0;

  return billboardGroup;
}