import React, { useRef, useEffect } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const SkillsUniverse = ({ skillsData }) => {
  const mountRef = useRef(null);

  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      55,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 10;
    camera.position.y = 5;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(
      mountRef.current.clientWidth,
      mountRef.current.clientHeight
    );
    mountRef.current.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0x404040, 2);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(0, 20, 20);
    scene.add(directionalLight);

    const categories = Object.keys(skillsData); // Clés de catégorie

    categories.forEach((category, index) => {
      // Position de la catégorie principale
      const angle = (index / categories.length) * Math.PI * 2;
      const distance = 5;
      const x = Math.cos(angle) * distance;
      const y = Math.sin(angle) * distance;

      // Créer une sphère pour la catégorie
      const geometry = new THREE.SphereGeometry(0.5, 32, 32);
      const material = new THREE.MeshStandardMaterial({
        color: Math.random() * 0xffffff,
      });
      const categorySphere = new THREE.Mesh(geometry, material);
      categorySphere.position.set(x, y, 0);
      scene.add(categorySphere);

      // Créer des orbites pour chaque compétence
      skillsData[category].forEach((skill, skillIndex) => {
        const skillGeometry = new THREE.SphereGeometry(0.1, 16, 16);
        const skillMaterial = new THREE.MeshStandardMaterial({
          color: Math.random() * 0xffffff,
        });
        const skillSphere = new THREE.Mesh(skillGeometry, skillMaterial);

        // Calculer la position initiale de la compétence sur son orbite
        const skillAngle =
          (skillIndex / skillsData[category].length) * Math.PI * 2;
        const skillDistance = 1; // Distance de l'orbite à la catégorie principale
        const skillX = x + Math.cos(skillAngle) * skillDistance;
        const skillY = y + Math.sin(skillAngle) * skillDistance;

        skillSphere.position.set(skillX, skillY, 0);
        scene.add(skillSphere);

        // Animation de l'orbite
        let orbitSpeed = 0.02; // Vitesse de l'orbite
        function animate() {
          requestAnimationFrame(animate);
          skillSphere.position.x =
            categorySphere.position.x +
            Math.cos(skillAngle + Date.now() * orbitSpeed) * skillDistance;
          skillSphere.position.y =
            categorySphere.position.y +
            Math.sin(skillAngle + Date.now() * orbitSpeed) * skillDistance;
          renderer.render(scene, camera);
        }
        animate();
      });
    });

    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      const mountNode = mountRef.current;
      if (renderer.domElement && mountNode) {
        mountNode.removeChild(renderer.domElement);
      }
    };
  }, [skillsData]); // Assurez-vous que skillsData est stable pour éviter des re-rendus inutiles

  return <div ref={mountRef} style={{ width: "100%", height: "100%" }} />;
};

export default SkillsUniverse;
