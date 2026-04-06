import * as THREE from "three";

const Character = () => {
  const group = new THREE.Group();

  const body = new THREE.Mesh(
    new THREE.CapsuleGeometry(0.45, 0.9, 4, 12),
    new THREE.MeshStandardMaterial({
      color: 0x7ddbf9,
      emissive: 0x35abff,
      emissiveIntensity: 0.8,
      roughness: 0.2,
      metalness: 0.5,
    }),
  );
  body.position.y = 1.15;
  group.add(body);

  const head = new THREE.Mesh(
    new THREE.SphereGeometry(0.42, 16, 16),
    new THREE.MeshStandardMaterial({
      color: 0xffe39f,
      emissive: 0xffd47f,
      emissiveIntensity: 0.6,
      roughness: 0.25,
    }),
  );
  head.position.y = 2.4;
  group.add(head);

  const glow = new THREE.Mesh(
    new THREE.TorusGeometry(0.75, 0.08, 8, 64),
    new THREE.MeshStandardMaterial({
      color: 0xd68dff,
      emissive: 0xd68dff,
      emissiveIntensity: 1.2,
      roughness: 0.15,
      metalness: 0.6,
    }),
  );
  glow.rotation.x = Math.PI / 2;
  glow.position.y = 0.35;
  group.add(glow);


  group.position.set(0,0,45);
  return group;
};

export default Character;
