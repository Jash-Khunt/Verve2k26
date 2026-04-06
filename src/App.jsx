import { useEffect, useRef } from "react";
import * as THREE from "three";
import Character from "./components/Character.jsx";
import { createNeonFloor } from "./components/NeonFloor.jsx";
import { createOuterSky } from "./components/OuterSky.jsx";
import { createBillboard } from "./components/Billboard.jsx";

export default function App() {
  const mountRef = useRef(null);

  useEffect(() => {
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x05070f, 0.02);

    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      200
    );

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setClearColor(0x04050b);
    mountRef.current.appendChild(renderer.domElement);

    // 🌟 LIGHTS
    scene.add(new THREE.AmbientLight(0x8892ff, 0.4));

    const light = new THREE.DirectionalLight(0xffffff, 0.8);
    light.position.set(10, 20, 10);
    scene.add(light);

    // 🌌 WORLD
    const sky = createOuterSky();
    scene.add(sky);

    const floor = createNeonFloor();
    scene.add(floor);

    const char = Character();
    scene.add(char);

    // � LED BILLBOARD
    const billboardGroup = createBillboard();
    scene.add(billboardGroup);

    // Get billboard mesh for animation control
    const billboard = billboardGroup.children[0];

    // �🎮 MOVEMENT
    const movement = { left: false, right: false, up: false, down: false };
    const speed = 12;

    const clock = new THREE.Clock();

    // 🎥 CAMERA (CLOSE + BEHIND)
    const cameraOffset = {
      radius: 12,                 // 🔥 closer
      azimuth: Math.PI*2,           // 🔥 directly behind character
      polar: Math.PI / 8,       // 🔥 good height angle
    };

    let targetAzimuth = cameraOffset.azimuth;
    let targetPolar = cameraOffset.polar;

    // 🖱️ DRAG
    let isDragging = false;
    let lastX = 0;
    let lastY = 0;

    const onPointerDown = (e) => {
      isDragging = true;
      lastX = e.clientX;
      lastY = e.clientY;
    };

    const onPointerMove = (e) => {
      if (!isDragging) return;

      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;

      targetAzimuth -= dx * 0.005;
      targetPolar += dy * 0.005;

      targetPolar = THREE.MathUtils.clamp(
        targetPolar,
        0.05,
        Math.PI / 2 - 0.2
      );

      lastX = e.clientX;
      lastY = e.clientY;
    };

    const onPointerUp = () => {
      isDragging = false;
    };

    // ⌨️ KEYS
    const onKeyDown = (e) => {
      if (e.key === "a" || e.key === "ArrowLeft") movement.left = true;
      if (e.key === "d" || e.key === "ArrowRight") movement.right = true;
      if (e.key === "w" || e.key === "ArrowUp") movement.up = true;
      if (e.key === "s" || e.key === "ArrowDown") movement.down = true;
    };

    const onKeyUp = (e) => {
      if (e.key === "a" || e.key === "ArrowLeft") movement.left = false;
      if (e.key === "d" || e.key === "ArrowRight") movement.right = false;
      if (e.key === "w" || e.key === "ArrowUp") movement.up = false;
      if (e.key === "s" || e.key === "ArrowDown") movement.down = false;
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    renderer.domElement.addEventListener("pointerdown", onPointerDown);
    renderer.domElement.addEventListener("pointermove", onPointerMove);
    renderer.domElement.addEventListener("pointerup", onPointerUp);

    // 🎬 LOOP
    function animate() {
      requestAnimationFrame(animate);

      const delta = Math.min(clock.getDelta(), 0.05);

      let moveX = 0;
      let moveZ = 0;

      if (movement.left) moveX -= 1;
      if (movement.right) moveX += 1;
      if (movement.up) moveZ += 1;
      if (movement.down) moveZ -= 1;

      const isMoving = moveX !== 0 || moveZ !== 0;

      // 🎥 SMOOTH CAMERA ROTATION
      cameraOffset.azimuth += (targetAzimuth - cameraOffset.azimuth) * 0.1;
      cameraOffset.polar += (targetPolar - cameraOffset.polar) * 0.1;

      // 🎮 MOVEMENT (camera-based)
      let worldMove = new THREE.Vector3();

      if (isMoving) {
        const inputDir = new THREE.Vector3(moveX, 0, moveZ).normalize();

        const camDir = new THREE.Vector3();
        camera.getWorldDirection(camDir);
        camDir.y = 0;
        camDir.normalize();

        const camRight = new THREE.Vector3();
        camRight.crossVectors(camDir, new THREE.Vector3(0, 1, 0)).normalize();

        worldMove.copy(camDir).multiplyScalar(inputDir.z);
        worldMove.addScaledVector(camRight, inputDir.x);
        worldMove.normalize();

        char.position.addScaledVector(worldMove, speed * delta);

        // rotate character
        const targetRot = Math.atan2(worldMove.x, -worldMove.z);
        char.rotation.y += (targetRot - char.rotation.y) * 0.15;
      }

      // 🎥 POSITION CAMERA (tight follow)
      const y =
        char.position.y +
        Math.sin(cameraOffset.polar) * cameraOffset.radius;

      const flat =
        Math.cos(cameraOffset.polar) * cameraOffset.radius;

      const x =
        char.position.x +
        Math.sin(cameraOffset.azimuth) * flat;

      const z =
        char.position.z +
        Math.cos(cameraOffset.azimuth) * flat;

      camera.position.lerp(new THREE.Vector3(x, y, z),1);

      // 🎯 LOOK AT CHARACTER
      camera.lookAt(
        char.position.x,
        char.position.y + 1.5,
        char.position.z
      );

      // 🌌 UPDATE WORLD
      const t = clock.getElapsedTime();
      sky.userData.update?.(t, delta, char.position);
      floor.userData.update?.(t, char.position);

      renderer.render(scene, camera);
    }

    animate();

    // 🎬 TRIGGER BILLBOARD ENTRY ANIMATION (gradual text appearance when user enters world)
      billboard.playEntryAnimation();

    return () => {
      billboard.stopFlicker?.();
      billboard.animationTimeline?.kill?.();
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      renderer.domElement.removeEventListener("pointerdown", onPointerDown);
      renderer.domElement.removeEventListener("pointermove", onPointerMove);
      renderer.domElement.removeEventListener("pointerup", onPointerUp);
      mountRef.current.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} style={{ width: "100vw", height: "100vh" }} />;
}