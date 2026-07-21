'use client';
import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

// Palette holographique « Arc Reactor »
const CYAN = 0x5ce0ff;
const CYAN_SOFT = 0x2aa8ff;
const GOLD = 0xffcb6b;

// Texture de halo additif (réutilisée par tous les glows/particules)
function makeGlowTexture() {
  const c = document.createElement('canvas');
  c.width = c.height = 128;
  const ctx = c.getContext('2d');
  const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
  g.addColorStop(0, 'rgba(200,248,255,1)');
  g.addColorStop(0.25, 'rgba(120,225,255,0.75)');
  g.addColorStop(0.55, 'rgba(70,180,255,0.28)');
  g.addColorStop(1, 'rgba(70,180,255,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 128, 128);
  return new THREE.CanvasTexture(c);
}

// Étiquette texte holographique (sprite face caméra)
function makeLabel(text, hex) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  const font = '600 40px "SF Mono", ui-monospace, Menlo, monospace';
  ctx.font = font;
  const width = Math.ceil(ctx.measureText(text.toUpperCase()).width) + 48;
  canvas.width = width;
  canvas.height = 68;
  ctx.font = font;
  ctx.textBaseline = 'middle';
  ctx.shadowColor = hex;
  ctx.shadowBlur = 16;
  ctx.fillStyle = hex;
  ctx.fillText(text.toUpperCase(), 24, 36);
  const texture = new THREE.CanvasTexture(canvas);
  const material = new THREE.SpriteMaterial({
    map: texture,
    transparent: true,
    depthWrite: false,
    depthTest: false,
  });
  const sprite = new THREE.Sprite(material);
  sprite.scale.set((width / 68) * 0.9, 0.9, 1);
  sprite.renderOrder = 5;
  return sprite;
}

// Répartition sphérique homogène (spirale de Fibonacci)
function fibonacciPoint(i, n, radius) {
  const phi = Math.acos(1 - (2 * (i + 0.5)) / n);
  const theta = Math.PI * (1 + Math.sqrt(5)) * i;
  return new THREE.Vector3(
    Math.cos(theta) * Math.sin(phi),
    Math.cos(phi),
    Math.sin(theta) * Math.sin(phi)
  ).multiplyScalar(radius);
}

const SkillsHologram = ({ skillsData, onHover }) => {
  const mountRef = useRef(null);
  const hoverRef = useRef(onHover);

  // On garde la dernière callback dans un ref (mis à jour via effet, jamais
  // pendant le render) pour que la boucle d'animation lise toujours la version courante.
  useEffect(() => {
    hoverRef.current = onHover;
  }, [onHover]);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return undefined;

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    } catch {
      return undefined;
    }

    const width = mount.clientWidth || 400;
    const height = mount.clientHeight || 320;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 100);
    camera.position.set(0, 3.2, 12);

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.55;
    controls.enablePan = false;
    controls.minDistance = 7;
    controls.maxDistance = 20;
    controls.target.set(0, 0, 0);

    const glowTex = makeGlowTexture();
    const disposables = [glowTex];
    const track = (obj) => {
      disposables.push(obj);
      return obj;
    };

    const glowSprite = (scale, hex, opacity = 1) => {
      const mat = track(
        new THREE.SpriteMaterial({
          map: glowTex,
          color: hex,
          transparent: true,
          opacity,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
        })
      );
      const s = new THREE.Sprite(mat);
      s.scale.set(scale, scale, 1);
      return s;
    };

    const world = new THREE.Group();
    scene.add(world);

    // -------- Cœur (réacteur Arc) --------
    const core = new THREE.Group();
    world.add(core);

    const coreSphereGeo = track(new THREE.IcosahedronGeometry(0.55, 2));
    const coreSphereMat = track(
      new THREE.MeshBasicMaterial({ color: 0xdffaff, transparent: true, opacity: 0.95 })
    );
    const coreSphere = new THREE.Mesh(coreSphereGeo, coreSphereMat);
    core.add(coreSphere);
    core.add(glowSprite(5.5, CYAN, 0.9));

    const coreRings = [];
    for (let i = 0; i < 3; i += 1) {
      const geo = track(new THREE.TorusGeometry(0.9 + i * 0.28, 0.02, 8, 64));
      const mat = track(
        new THREE.MeshBasicMaterial({
          color: i === 1 ? GOLD : CYAN,
          transparent: true,
          opacity: 0.85,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
        })
      );
      const ring = new THREE.Mesh(geo, mat);
      ring.rotation.x = Math.PI / 2 + i * 0.4;
      ring.rotation.y = i * 0.6;
      core.add(ring);
      coreRings.push(ring);
    }

    // Anneaux HUD externes rotatifs
    const hudRings = [];
    [
      [4.2, CYAN_SOFT, 0.35],
      [5.1, CYAN, 0.22],
    ].forEach(([r, hex, op]) => {
      const geo = track(new THREE.TorusGeometry(r, 0.012, 6, 96));
      const mat = track(
        new THREE.MeshBasicMaterial({
          color: hex,
          transparent: true,
          opacity: op,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
        })
      );
      const ring = new THREE.Mesh(geo, mat);
      ring.rotation.x = Math.random() * Math.PI;
      ring.rotation.y = Math.random() * Math.PI;
      world.add(ring);
      hudRings.push(ring);
    });

    // -------- Catégories + compétences --------
    const categories = Object.keys(skillsData);
    const pickables = [];
    const linePositions = [];
    const dataLinks = []; // pour l'animation de flux

    const nodeGeo = track(new THREE.OctahedronGeometry(0.16, 0));
    const hubGeo = track(new THREE.IcosahedronGeometry(0.3, 1));

    categories.forEach((category, ci) => {
      const angle = (ci / categories.length) * Math.PI * 2;
      const hubPos = new THREE.Vector3(
        Math.cos(angle) * 4.3,
        (ci % 2 === 0 ? 1 : -1) * 1.1,
        Math.sin(angle) * 4.3
      );

      const hubMat = track(
        new THREE.MeshBasicMaterial({ color: GOLD, transparent: true, opacity: 0.95 })
      );
      const hub = new THREE.Mesh(hubGeo, hubMat);
      hub.position.copy(hubPos);
      hub.userData = { type: 'category', name: category, count: skillsData[category].length };
      world.add(hub);
      hub.add(glowSprite(2.4, GOLD, 0.8));
      pickables.push(hub);

      const label = makeLabel(category, '#ffd98a');
      label.position.copy(hubPos).add(new THREE.Vector3(0, 0.62, 0));
      world.add(label);
      disposables.push(label.material.map, label.material);

      // lien cœur → hub
      linePositions.push(0, 0, 0, hubPos.x, hubPos.y, hubPos.z);

      const skills = skillsData[category];
      skills.forEach((skill, si) => {
        const local = fibonacciPoint(si, Math.max(skills.length, 4), 1.5);
        const pos = hubPos.clone().add(local);

        const mat = track(
          new THREE.MeshBasicMaterial({ color: CYAN, transparent: true, opacity: 0.95 })
        );
        const node = new THREE.Mesh(nodeGeo, mat);
        node.position.copy(pos);
        node.userData = {
          type: 'skill',
          name: skill.Name,
          details: skill.Details.join(' · '),
          category,
        };
        world.add(node);

        const halo = glowSprite(0.95, CYAN, 0.7);
        node.add(halo);
        node.userData.halo = halo;
        pickables.push(node);

        // lien hub → compétence
        linePositions.push(hubPos.x, hubPos.y, hubPos.z, pos.x, pos.y, pos.z);
        dataLinks.push({ from: hubPos.clone(), to: pos.clone() });
      });
    });

    // Réseau de liens (lignes additives)
    const lineGeo = track(new THREE.BufferGeometry());
    lineGeo.setAttribute(
      'position',
      new THREE.Float32BufferAttribute(linePositions, 3)
    );
    const lineMat = track(
      new THREE.LineBasicMaterial({
        color: CYAN_SOFT,
        transparent: true,
        opacity: 0.28,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      })
    );
    world.add(new THREE.LineSegments(lineGeo, lineMat));

    // Impulsions de données qui circulent sur les liens
    const pulseCount = Math.min(dataLinks.length, 40);
    const pulseGeo = track(new THREE.BufferGeometry());
    const pulseArr = new Float32Array(pulseCount * 3);
    pulseGeo.setAttribute('position', new THREE.BufferAttribute(pulseArr, 3));
    const pulseMat = track(
      new THREE.PointsMaterial({
        color: 0xffffff,
        size: 0.16,
        map: glowTex,
        transparent: true,
        opacity: 0.9,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      })
    );
    const pulses = new THREE.Points(pulseGeo, pulseMat);
    world.add(pulses);
    const pulseState = Array.from({ length: pulseCount }, (_, i) => ({
      link: dataLinks[i % dataLinks.length],
      t: Math.random(),
      speed: 0.4 + Math.random() * 0.6,
    }));

    // Grille holographique au sol
    const grid = new THREE.PolarGridHelper(9, 12, 8, 64, CYAN_SOFT, CYAN_SOFT);
    grid.material.transparent = true;
    grid.material.opacity = 0.12;
    grid.material.blending = THREE.AdditiveBlending;
    grid.material.depthWrite = false;
    grid.position.y = -3.4;
    world.add(grid);
    disposables.push(grid.geometry, grid.material);

    // Poussière de données
    const dustCount = 260;
    const dustGeo = track(new THREE.BufferGeometry());
    const dustArr = new Float32Array(dustCount * 3);
    for (let i = 0; i < dustCount; i += 1) {
      dustArr[i * 3] = (Math.random() - 0.5) * 22;
      dustArr[i * 3 + 1] = (Math.random() - 0.5) * 14;
      dustArr[i * 3 + 2] = (Math.random() - 0.5) * 22;
    }
    dustGeo.setAttribute('position', new THREE.BufferAttribute(dustArr, 3));
    const dustMat = track(
      new THREE.PointsMaterial({
        color: CYAN,
        size: 0.05,
        transparent: true,
        opacity: 0.5,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      })
    );
    world.add(new THREE.Points(dustGeo, dustMat));

    // -------- Interaction (survol) --------
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2(-2, -2);
    let hasPointer = false;
    let hovered = null;

    const onPointerMove = (e) => {
      const rect = renderer.domElement.getBoundingClientRect();
      pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      hasPointer = true;
    };
    const onPointerLeave = () => {
      hasPointer = false;
    };
    renderer.domElement.addEventListener('pointermove', onPointerMove);
    renderer.domElement.addEventListener('pointerleave', onPointerLeave);

    const setHover = (obj) => {
      if (hovered === obj) return;
      if (hovered) {
        hovered.scale.setScalar(1);
        if (hovered.userData.halo) hovered.userData.halo.material.opacity = 0.7;
      }
      hovered = obj;
      if (obj) {
        obj.scale.setScalar(1.6);
        if (obj.userData.halo) obj.userData.halo.material.opacity = 1;
        controls.autoRotate = false;
        hoverRef.current?.({
          type: obj.userData.type,
          name: obj.userData.name,
          details: obj.userData.details,
          category: obj.userData.category,
          count: obj.userData.count,
        });
      } else {
        controls.autoRotate = true;
        hoverRef.current?.(null);
      }
      renderer.domElement.style.cursor = obj ? 'pointer' : 'default';
    };

    // -------- Boucle --------
    let raf;
    const clock = new THREE.Clock();
    const tmp = new THREE.Vector3();

    const animate = () => {
      raf = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      coreSphere.rotation.y += 0.01;
      coreSphere.rotation.x += 0.006;
      coreSphere.scale.setScalar(1 + Math.sin(t * 2.5) * 0.06);
      coreRings.forEach((r, i) => {
        r.rotation.z += 0.006 * (i + 1);
        r.rotation.y += 0.004 * (i + 1);
      });
      hudRings[0].rotation.z += 0.004;
      hudRings[1].rotation.x += 0.003;
      lineMat.opacity = 0.2 + Math.sin(t * 1.8) * 0.1;

      // flux de données le long des liens
      for (let i = 0; i < pulseCount; i += 1) {
        const p = pulseState[i];
        p.t += p.speed * 0.01;
        if (p.t > 1) p.t -= 1;
        tmp.lerpVectors(p.link.from, p.link.to, p.t);
        pulseArr[i * 3] = tmp.x;
        pulseArr[i * 3 + 1] = tmp.y;
        pulseArr[i * 3 + 2] = tmp.z;
      }
      pulseGeo.attributes.position.needsUpdate = true;

      if (hasPointer) {
        raycaster.setFromCamera(pointer, camera);
        const hits = raycaster.intersectObjects(pickables, false);
        setHover(hits.length ? hits[0].object : null);
      } else {
        setHover(null);
      }

      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // -------- Redimensionnement --------
    const resize = () => {
      const w = mount.clientWidth || width;
      const h = mount.clientHeight || height;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    const ro = new ResizeObserver(resize);
    ro.observe(mount);

    // -------- Nettoyage --------
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      renderer.domElement.removeEventListener('pointermove', onPointerMove);
      renderer.domElement.removeEventListener('pointerleave', onPointerLeave);
      controls.dispose();
      disposables.forEach((d) => d.dispose?.());
      renderer.dispose();
      if (renderer.domElement.parentNode === mount) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, [skillsData]);

  return <div ref={mountRef} style={{ width: '100%', height: '100%' }} />;
};

export default SkillsHologram;
