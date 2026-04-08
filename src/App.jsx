import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import gsap from "gsap";
import Character from "./components/Character.jsx";
import { createNeonFloor } from "./components/NeonFloor.jsx";
import { createOuterSky } from "./components/OuterSky.jsx";
import { createBillboard } from "./components/Billboard.jsx";
import { createBuildings } from "./components/Buildings.jsx";
import { FirecrackerSystem } from "./components/FirecrackerSystem.jsx";
import HUD from "./components/HUD.jsx";
import MobileControls from "./components/MobileControls.jsx";
import { createBalloons, createPlanets } from "./components/AtmosphereAdditions.jsx";
import { createSponsorScreen } from "./components/SponsorScreen.jsx";

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
    renderer.domElement.style.touchAction = "none";
    mountRef.current.appendChild(renderer.domElement);

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", handleResize);

    // 🌟 LIGHTS
    scene.add(new THREE.AmbientLight(0x8892ff, 0.4));

    const light = new THREE.DirectionalLight(0xffffff, 0.8);
    light.position.set(10, 20, 10);
    scene.add(light);

    // 🌌 WORLD
    const sky = createOuterSky();
    scene.add(sky);

    const balloons = createBalloons();
    scene.add(balloons);

    const planets = createPlanets();
    scene.add(planets);

    const floor = createNeonFloor();
    scene.add(floor);

    const char = Character();
    scene.add(char);

    // 📌 LED BILLBOARD
    const billboardGroup = createBillboard();
    scene.add(billboardGroup);
    const billboard = billboardGroup.children[0];

    // 📺 REAL SPONSOR SCREENS
    const sponsorImages = ['/photo/first.png', '/photo/second.png', '/photo/third.jpeg', '/photo/fourth.png', '/photo/fifth.png'];
    
    sponsorImages.forEach((img, i) => {
      const screen = createSponsorScreen(img);
      
      // Position alternate left and right along the Z axis, starting from character position (z=45)
      const isLeft = i % 2 !== 0;
      const xOffset = isLeft ? -14 : 14;
      const zOffset = 39 - (i * 12); // Spaced out starting slightly ahead of the character
      
      screen.position.set(xOffset, 2.8, zOffset);
      screen.rotation.y = isLeft ? Math.PI / 4 : -Math.PI / 4;
      
      scene.add(screen);
    });

    // 🏙️ BUILDINGS
    const buildingsGroup = createBuildings();
    scene.add(buildingsGroup);

    // 🧨 FIRECRACKERS
    const firecrackers = new FirecrackerSystem(scene);
    let firecrackerCount = 0;

    // 🎮 MOVEMENT
    const movement = { left: false, right: false, up: false, down: false };
    const speed = 15; 
    const clock = new THREE.Clock();

    // 🏃 JUMP MECHANICS
    let velocityY = 0;
    const gravity = -30;
    let isGrounded = true;

    // 🎥 CAMERA
    const cameraOffset = {
      radius: 12,
      azimuth: Math.PI*2,
      polar: Math.PI / 8,
    };
    let targetAzimuth = cameraOffset.azimuth;
    let targetPolar = cameraOffset.polar;

    let isDragging = false;
    let lastX = 0;
    let lastY = 0;

    const onContextMenu = (e) => {
        e.preventDefault(); // Prevent right click menu
    }

    const onPointerDown = (e) => {
      if (e.target.tagName !== "CANVAS") return;
      if (e.button !== 2 && e.button !== 0 && e.pointerType !== "touch") return; // Allow left or right click to drag
      isDragging = true;
      renderer.domElement.setPointerCapture(e.pointerId);
      lastX = e.clientX;
      lastY = e.clientY;
    };

    const onPointerMove = (e) => {
      if (!isDragging) return;
      
      const isTouch = e.pointerType === "touch" || window.innerWidth < 768;
      const sensitivity = isTouch ? 0.015 : 0.005; // highly responsive on phone

      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;
      targetAzimuth -= dx * sensitivity;
      targetPolar += dy * sensitivity;
      targetPolar = THREE.MathUtils.clamp(targetPolar, 0.05, Math.PI / 2 - 0.2);
      lastX = e.clientX;
      lastY = e.clientY;
    };

    const onPointerUp = (e) => {
      isDragging = false;
      renderer.domElement.releasePointerCapture(e.pointerId);
    };

    const triggerJump = () => {
      if (isGrounded) {
        velocityY = 15;
        isGrounded = false;
      }
    };

    window.currentPromptObj = null;

    const interactWithBuilding = () => {
      if (window.currentPromptObj) {
        const bPos = new THREE.Vector3();
        window.currentPromptObj.getWorldPosition(bPos);
        
        const dx = char.position.x - bPos.x;
        const dz = char.position.z - bPos.z;
        const targetAzimuthAngle = Math.atan2(dx, dz);

        gsap.to(cameraOffset, {
           azimuth: targetAzimuthAngle,
           polar: Math.PI / 10,
           duration: 1.5,
           ease: "power2.out",
           onUpdate: () => {
             targetAzimuth = cameraOffset.azimuth;
             targetPolar = cameraOffset.polar;
           }
        });

        window.dispatchEvent(new CustomEvent("updateBuilding", { detail: window.currentPromptObj.userData }));
      }
    };

    let isAutoWalking = false;
    let autoWalkTarget = null;
    let autoWalkBuildingMesh = null;

    const handleNav = (e) => {
      const typeStr = e.detail.toLowerCase();
      const bObj = buildingsGroup.userData.interactables.find(b => b.userData.title.toLowerCase() === typeStr);
      if (bObj) {
         autoWalkBuildingMesh = bObj;
         autoWalkTarget = new THREE.Vector3();
         bObj.getWorldPosition(autoWalkTarget);
         isAutoWalking = true;
         
         const dx = char.position.x - autoWalkTarget.x;
         const dz = char.position.z - autoWalkTarget.z;
         targetAzimuth = Math.atan2(dx, dz);
         cameraOffset.azimuth = targetAzimuth;
      }
    };

    const handleLaunch = () => {
      if (firecrackerCount > 0) {
        firecrackerCount--;
        window.dispatchEvent(new CustomEvent("updateFirecracker", { detail: firecrackerCount }));
        
        let camDir = new THREE.Vector3();
        camera.getWorldDirection(camDir);
        camDir.normalize();

        firecrackers.launch(char.position.clone(), camDir);
      }
    };

    // ⌨️ KEYS
    const onKeyDown = (e) => {
      isAutoWalking = false;
      if (e.key === "a" || e.key === "ArrowLeft") movement.left = true;
      if (e.key === "d" || e.key === "ArrowRight") movement.right = true;
      if (e.key === "w" || e.key === "ArrowUp") movement.up = true;
      if (e.key === "s" || e.key === "ArrowDown") movement.down = true;
      if (e.key === " ") triggerJump();
      if (e.key.toLowerCase() === "e") interactWithBuilding();
      if (e.key.toLowerCase() === "f") handleLaunch();
    };

    const onKeyUp = (e) => {
      if (e.key === "a" || e.key === "ArrowLeft") movement.left = false;
      if (e.key === "d" || e.key === "ArrowRight") movement.right = false;
      if (e.key === "w" || e.key === "ArrowUp") movement.up = false;
      if (e.key === "s" || e.key === "ArrowDown") movement.down = false;
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("contextmenu", onContextMenu);
    renderer.domElement.addEventListener("pointerdown", onPointerDown);
    renderer.domElement.addEventListener("pointermove", onPointerMove);
    renderer.domElement.addEventListener("pointerup", onPointerUp);

    const handleJoystick = (e) => {
      isAutoWalking = false;
      const { x, y } = e.detail;
      movement.left = x < -0.2;
      movement.right = x > 0.2;
      movement.up = y < -0.2;
      movement.down = y > 0.2;
    };
    const handleJumpEvent = () => triggerJump();
    const handleMobileInteract = () => interactWithBuilding();

    window.addEventListener("moveJoystick", handleJoystick);
    window.addEventListener("jump", handleJumpEvent);
    window.addEventListener("launchFirecracker", handleLaunch);
    window.addEventListener("triggerInteract", handleMobileInteract);
    window.addEventListener("navigateToBuilding", handleNav);

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

      if (!isGrounded) {
        velocityY += gravity * delta;
        char.position.y += velocityY * delta;
        if (char.position.y <= 0) {
          char.position.y = 0;
          isGrounded = true;
          velocityY = 0;
        }
      }

      cameraOffset.azimuth += (targetAzimuth - cameraOffset.azimuth) * 0.1;
      cameraOffset.polar += (targetPolar - cameraOffset.polar) * 0.1;

      if (isAutoWalking && autoWalkTarget) {
          const dist = char.position.distanceTo(autoWalkTarget);
          if (dist > 18) {
              const dir = new THREE.Vector3().subVectors(autoWalkTarget, char.position);
              dir.y = 0;
              dir.normalize();
              char.position.addScaledVector(dir, speed * delta * 1.5);
              const targetRot = Math.atan2(dir.x, -dir.z);
              char.rotation.y += (targetRot - char.rotation.y) * 0.15;
              const dx = char.position.x - autoWalkTarget.x;
              const dz = char.position.z - autoWalkTarget.z;
              targetAzimuth = Math.atan2(dx, dz);
          } else {
              isAutoWalking = false;
              window.currentPromptObj = autoWalkBuildingMesh;
              window.dispatchEvent(new CustomEvent("showInteractionPrompt", { detail: autoWalkBuildingMesh.userData.title }));
          }
      } else if (isMoving) {
        const inputDir = new THREE.Vector3(moveX, 0, moveZ).normalize();
        const camDir = new THREE.Vector3();
        camera.getWorldDirection(camDir);
        camDir.y = 0;
        camDir.normalize();

        const camRight = new THREE.Vector3();
        camRight.crossVectors(camDir, new THREE.Vector3(0, 1, 0)).normalize();

        let worldMove = new THREE.Vector3();
        worldMove.copy(camDir).multiplyScalar(inputDir.z);
        worldMove.addScaledVector(camRight, inputDir.x);
        worldMove.normalize();

        char.position.addScaledVector(worldMove, speed * delta);
        char.position.x = THREE.MathUtils.clamp(char.position.x, -50, 50);
        char.position.z = THREE.MathUtils.clamp(char.position.z, -50, 50);
        const targetRot = Math.atan2(worldMove.x, -worldMove.z);
        char.rotation.y += (targetRot - char.rotation.y) * 0.15;
      }

      let closestBuilding = null;
      let minDistance = 25; 

      for(let i=0; i<buildingsGroup.userData.interactables.length; i++) {
         const b = buildingsGroup.userData.interactables[i];
         const bPos = new THREE.Vector3();
         b.getWorldPosition(bPos);
         const dist = char.position.distanceTo(bPos);
         if(dist < minDistance) {
             minDistance = dist;
             closestBuilding = b;
         }
      }

      const activeBuildingData = document.getElementById("active-building-flag")?.innerText;

      if (closestBuilding && !activeBuildingData) {
         if (window.currentPromptObj !== closestBuilding) {
            window.currentPromptObj = closestBuilding;
            window.dispatchEvent(new CustomEvent("showInteractionPrompt", { detail: closestBuilding.userData.title }));
         }
      } else {
         if (!isAutoWalking && window.currentPromptObj) {
            window.currentPromptObj = null;
            window.dispatchEvent(new CustomEvent("hideInteractionPrompt"));
         }
      }

      const y = char.position.y + Math.sin(cameraOffset.polar) * cameraOffset.radius;
      const flat = Math.cos(cameraOffset.polar) * cameraOffset.radius;
      const x = char.position.x + Math.sin(cameraOffset.azimuth) * flat;
      const z = char.position.z + Math.cos(cameraOffset.azimuth) * flat;

      camera.position.lerp(new THREE.Vector3(x, y, z), 1);
      camera.lookAt(char.position.x, char.position.y + 1.5, char.position.z);

      const t = clock.getElapsedTime();
      sky.userData.update?.(t, delta, char.position);
      floor.userData.update?.(t, char.position);
      buildingsGroup.userData.update?.(t);
      balloons.userData.update?.(t);
      planets.userData.update?.(t);
      char.userData.update?.(delta);
      
      firecrackers.update(delta, char.position, () => {
        firecrackerCount++;
        window.dispatchEvent(new CustomEvent("updateFirecracker", { detail: firecrackerCount }));
      });

      renderer.render(scene, camera);
    }
    animate();
    billboard.playEntryAnimation();

    return () => {
      billboard.stopFlicker?.();
      billboard.animationTimeline?.kill?.();
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      window.removeEventListener("contextmenu", onContextMenu);
      renderer.domElement.removeEventListener("pointerdown", onPointerDown);
      renderer.domElement.removeEventListener("pointermove", onPointerMove);
      renderer.domElement.removeEventListener("pointerup", onPointerUp);
      
      window.removeEventListener("moveJoystick", handleJoystick);
      window.removeEventListener("jump", handleJumpEvent);
      window.removeEventListener("launchFirecracker", handleLaunch);
      window.removeEventListener("triggerInteract", handleMobileInteract);
      window.removeEventListener("navigateToBuilding", handleNav);
      window.removeEventListener("resize", handleResize);
      mountRef.current.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div style={{ position: "relative", width: "100vw", height: "100vh", overflow: "hidden" }}>
      <div ref={mountRef} style={{ width: "100%", height: "100%", position: "absolute", top: 0, left: 0 }} />
      <HUD />
      <MobileControls />
    </div>
  );
}