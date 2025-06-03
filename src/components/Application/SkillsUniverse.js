import React, { useRef, useEffect } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const SkillsUniverse = ({ skillsData }) => {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      55,
      mount.clientWidth / mount.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 10;
    camera.position.y = 5;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    mount.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0x404040, 2);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(0, 20, 20);
    scene.add(directionalLight);

    const categories = Object.keys(skillsData);
    let allSkillSpheres = [];

    categories.forEach((category, index) => {
      const angle = (index / categories.length) * Math.PI * 2;
      const distance = 2;
      const x = Math.cos(angle) * distance;
      const y = Math.sin(angle) * distance;

      const geometry = new THREE.SphereGeometry(0.5, 32, 32);
      const material = new THREE.MeshStandardMaterial({
        color: Math.random() * 0xffffff,
      });
      const categorySphere = new THREE.Mesh(geometry, material);
      categorySphere.position.set(x, y, 0);
      scene.add(categorySphere);

      skillsData[category].forEach((skill, skillIndex) => {
        const skillGeometry = new THREE.SphereGeometry(0.15, 16, 16);
        const skillMaterial = new THREE.MeshStandardMaterial({
          color: Math.random() * 0xffffff,
        });
        const skillSphere = new THREE.Mesh(skillGeometry, skillMaterial);

        const skillAngle =
          (skillIndex / skillsData[category].length) * Math.PI * 2;
        const skillDistance = 3;
        const skillX = x + Math.cos(skillAngle) * skillDistance;
        const skillY = y + Math.sin(skillAngle) * skillDistance;

        skillSphere.position.set(skillX, skillY, 0);
        scene.add(skillSphere);

        allSkillSpheres.push({
          skillSphere,
          categorySphere,
          skillAngle,
          skillDistance,
        });
      });
    });

    let categoryOrbitSpeed = 0.001;
    function animate() {
      requestAnimationFrame(animate);

      allSkillSpheres.forEach(
        ({ skillSphere, categorySphere, skillAngle, skillDistance }) => {
          skillSphere.position.x =
            categorySphere.position.x +
            Math.cos(skillAngle + Date.now() * categoryOrbitSpeed) *
              skillDistance;
          skillSphere.position.y =
            categorySphere.position.y +
            Math.sin(skillAngle + Date.now() * categoryOrbitSpeed) *
              skillDistance;
        }
      );

      renderer.render(scene, camera);
    }
    animate();

    return () => {
      if (renderer.domElement && mount) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, [skillsData]);

  return <div ref={mountRef} style={{ width: "100%", height: "100%" }} />;
};

export default SkillsUniverse;
