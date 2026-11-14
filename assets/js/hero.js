/* =========================================================
   Hero 3D robot — "Buzzbot", the bee-shaped BIOBUZZ concept
   robot (from the Buzzbot 3D artifact), drawn with three.js
   as a cloud of single-color dots, like the original hero.
   The model is built from ordinary meshes, then every mesh
   is swapped for dots scattered over its surface. The intake
   and flywheels spin, pollen launches, the wings flap and the
   robot slowly turns. Drag to rotate.
   ========================================================= */

(() => {
  const canvas = document.getElementById("robot-3d");
  if (!canvas || !window.THREE || !THREE.OrbitControls) return;
  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  const scene = new THREE.Scene();
  // dots further from the camera fade into the frame's dark teal, for depth
  scene.fog = new THREE.Fog(0x03232b, 44, 86);
  const DOT_COLOR = new THREE.Color(0x00dcfc);
  const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 500);
  camera.position.set(34, 21, 39);
  const controls = new THREE.OrbitControls(camera, canvas);
  controls.target.set(0, 6, 0);
  controls.enableDamping = true;
  controls.enableZoom = false; // keep page scrolling working
  controls.enablePan = false;
  controls.maxPolarAngle = Math.PI * 0.49;
  controls.autoRotate = !reduceMotion;
  controls.autoRotateSpeed = 1.2;

  // Meshes are only shapes to scatter dots over; they are never drawn themselves
  const M = () => new THREE.MeshBasicMaterial({ visible: false });
  const add = (mesh, parent = scene) => { parent.add(mesh); return mesh; };

  /* floor: a faint grid of dots, like field tiles */
  const floorPts = [];
  for (let x = -24; x <= 24; x += 2) for (let z = -24; z <= 24; z += 2) if (x * x + z * z <= 24 * 24) floorPts.push(x, 0, z);
  const floorGeo = new THREE.BufferGeometry();
  floorGeo.setAttribute("position", new THREE.Float32BufferAttribute(floorPts, 3));
  scene.add(new THREE.Points(floorGeo, new THREE.PointsMaterial({ color: DOT_COLOR, size: 0.28, transparent: true, opacity: 0.35, depthWrite: false })));

  const bot = new THREE.Group();
  scene.add(bot);

  /* chassis + mecanum wheels */
  add(new THREE.Mesh(new THREE.BoxGeometry(15, 1.4, 13), M()), bot).position.set(0, 3.4, 0);
  [[5.2, 6.7], [5.2, -6.7], [-5.2, 6.7], [-5.2, -6.7]].forEach(([x, z]) => {
    const w = new THREE.Group();
    w.position.set(x, 2.1, z);
    bot.add(w);
    add(new THREE.Mesh(new THREE.CylinderGeometry(2.1, 2.1, 1.5, 24), M()), w).rotation.x = Math.PI / 2;
    for (let i = 0; i < 9; i++) {
      const r = add(new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.42, 1.9, 10), M()), w);
      const a = (i / 9) * Math.PI * 2;
      r.position.set(Math.cos(a) * 2.05, Math.sin(a) * 2.05, 0);
      r.rotation.set(0, (x * z > 0 ? 1 : -1) * Math.PI / 4, a + Math.PI / 2);
    }
  });

  /* striped abdomen */
  const body = add(new THREE.Mesh(new THREE.SphereGeometry(1, 48, 32), M()), bot);
  // stripes as bright and dim bands of dots: 8 bands from end to end of the body
  body.userData.shade = (p) => (Math.floor((Math.acos(Math.max(-1, Math.min(1, p.y))) / Math.PI) * 8) % 2 ? 0.35 : 1);
  body.rotation.z = Math.PI / 2;
  body.scale.set(4.6, 7.2, 5.6);
  body.position.set(-0.8, 8.6, 0);

  /* stinger */
  const sting = add(new THREE.Mesh(new THREE.ConeGeometry(0.9, 3, 16), M()), bot);
  sting.rotation.z = Math.PI / 2;
  sting.position.set(-9.2, 8.4, 0);

  /* head, camera eyes, antennae */
  add(new THREE.Mesh(new THREE.SphereGeometry(3.1, 32, 24), M()), bot).position.set(6.6, 8.2, 0);
  [-1.5, 1.5].forEach((z) => {
    add(new THREE.Mesh(new THREE.SphereGeometry(1.05, 24, 16), M()), bot).position.set(8.9, 8.9, z);
    add(new THREE.Mesh(new THREE.SphereGeometry(0.45, 16, 12), M()), bot).position.set(9.85, 9.0, z);
    const ant = add(new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 4, 8), M()), bot);
    ant.position.set(7.9, 12.4, z * 0.9);
    ant.rotation.set(z * 0.12, 0, -0.35);
    add(new THREE.Mesh(new THREE.SphereGeometry(0.42, 12, 10), M()), bot).position.set(8.6, 14.3, z * 1.15);
  });

  /* intake roller + side plates */
  const intake = new THREE.Group();
  intake.position.set(8.7, 2.3, 0);
  bot.add(intake);
  add(new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 13, 10), M()), intake).rotation.x = Math.PI / 2;
  for (let i = -5; i <= 5; i++) {
    const fw = add(new THREE.Mesh(new THREE.CylinderGeometry(1.25, 1.25, 0.7, 6), M()), intake);
    fw.rotation.x = Math.PI / 2;
    fw.position.z = i * 1.15;
  }
  [-6.8, 6.8].forEach((z) => {
    add(new THREE.Mesh(new THREE.BoxGeometry(4.2, 3, 0.25), M()), bot).position.set(7.8, 3.1, z);
  });

  /* flywheel shooter + hood */
  const shooter = new THREE.Group();
  shooter.position.set(-2.6, 14.2, 0);
  bot.add(shooter);
  add(new THREE.Mesh(new THREE.BoxGeometry(4.6, 0.5, 6.2), M()), shooter).position.y = -1.9;
  const flywheels = [-1.9, 1.9].map((z) => {
    const fw = add(new THREE.Mesh(new THREE.CylinderGeometry(1.9, 1.9, 0.9, 32), M()), shooter);
    fw.rotation.x = Math.PI / 2;
    fw.position.z = z;
    add(new THREE.Mesh(new THREE.BoxGeometry(3.4, 0.3, 0.95), M()), fw);
    return fw;
  });
  const hood = add(new THREE.Mesh(
    new THREE.CylinderGeometry(3, 3, 2.6, 24, 1, true, Math.PI * 0.05, Math.PI * 0.6),
    M()
  ), shooter);
  hood.rotation.x = Math.PI / 2;
  hood.position.set(0.3, 0.4, 0);

  /* lexan wings */
  const wings = [-1, 1].map((s) => {
    const pivot = new THREE.Group();
    pivot.position.set(-1.2, 12.6, s * 2.6);
    bot.add(pivot);
    const wg = new THREE.Mesh(new THREE.CircleGeometry(1, 40), M());
    wg.scale.set(4.4, 1.8, 1);
    wg.rotation.set(-Math.PI / 2, 0, 0);
    wg.position.set(-2.4, 0, s * 3.6);
    pivot.add(wg);
    pivot.userData.s = s;
    return pivot;
  });

  /* pollen moving up the belly, then launched along an arc */
  const pollenMat = M();
  const belly = [[5.5, 4.6], [3, 5.6], [0.6, 7.4], [-1.6, 9.6]].map(([x, y]) => {
    const p = add(new THREE.Mesh(new THREE.SphereGeometry(1.25, 20, 16), pollenMat), bot);
    p.position.set(x, y, 0);
    p.visible = false;
    return p;
  });
  const shot = add(new THREE.Mesh(new THREE.SphereGeometry(1.5, 24, 18), pollenMat), bot);
  const trailPts = [];
  for (let t = 0; t <= 1; t += 0.02) trailPts.push(new THREE.Vector3(-2.6 - t * 22, 16 + 18 * t - 22 * t * t, 0));
  const trail = new THREE.Line(new THREE.BufferGeometry().setFromPoints(trailPts), new THREE.LineDashedMaterial({ color: DOT_COLOR, dashSize: 0.3, gapSize: 0.9, transparent: true, opacity: 0.7 }));
  trail.computeLineDistances();
  bot.add(trail);

  /* swap every mesh for dots: rows of dots along its edges and outlines,
     plus a light sprinkle over its surfaces for volume */
  scene.updateMatrixWorld(true);
  const meshes = [];
  bot.traverse((o) => o.isMesh && meshes.push(o));
  const EDGE_GAP = 0.45;   // world units between dots along an edge
  const FILL_DOTS = 1600;  // surface dots for the whole robot
  const a = new THREE.Vector3(), b = new THREE.Vector3(), c = new THREE.Vector3(), ab = new THREE.Vector3(), ac = new THREE.Vector3();
  const wa = new THREE.Vector3(), wb = new THREE.Vector3();
  const shadeOf = (mesh, p) => (mesh.userData.shade ? mesh.userData.shade(p) : 1);

  const surfaces = meshes.map((mesh) => {
    const geo = mesh.geometry.index ? mesh.geometry.toNonIndexed() : mesh.geometry;
    const pos = geo.attributes.position;
    const list = [];
    let total = 0;
    for (let i = 0; i < pos.count; i += 3) {
      // area in world units, so scaled shapes (like the body) get their fair share of dots
      a.fromBufferAttribute(pos, i).applyMatrix4(mesh.matrixWorld);
      b.fromBufferAttribute(pos, i + 1).applyMatrix4(mesh.matrixWorld);
      c.fromBufferAttribute(pos, i + 2).applyMatrix4(mesh.matrixWorld);
      total += ab.subVectors(b, a).cross(ac.subVectors(c, a)).length() / 2;
      list.push(total);
    }
    return { pos, list, total };
  });
  const fillDensity = FILL_DOTS / surfaces.reduce((sum, t) => sum + t.total, 0);

  meshes.forEach((mesh, m) => {
    const pts = [], cols = [];
    const put = (p) => {
      const k = shadeOf(mesh, p);
      pts.push(p.x, p.y, p.z);
      cols.push(DOT_COLOR.r * k, DOT_COLOR.g * k, DOT_COLOR.b * k);
    };
    // edges: a 3 degree threshold keeps the outlines and a sphere's rings, not the triangle seams
    const edges = new THREE.EdgesGeometry(mesh.geometry, 3).attributes.position;
    for (let i = 0; i < edges.count; i += 2) {
      a.fromBufferAttribute(edges, i);
      b.fromBufferAttribute(edges, i + 1);
      wa.copy(a).applyMatrix4(mesh.matrixWorld);
      wb.copy(b).applyMatrix4(mesh.matrixWorld);
      const steps = Math.max(1, Math.round(wa.distanceTo(wb) / EDGE_GAP));
      for (let k = 0; k < steps; k++) put(c.copy(a).lerp(b, k / steps));
    }
    // surface sprinkle: pick a triangle weighted by area, then a random point inside it
    const { pos, list, total } = surfaces[m];
    const n = Math.round(total * fillDensity);
    for (let k = 0; k < n; k++) {
      const r = Math.random() * total;
      let lo = 0, hi = list.length - 1;
      while (lo < hi) { const mid = (lo + hi) >> 1; if (list[mid] < r) lo = mid + 1; else hi = mid; }
      let u = Math.random(), v = Math.random();
      if (u + v > 1) { u = 1 - u; v = 1 - v; }
      const i = lo * 3;
      a.fromBufferAttribute(pos, i); b.fromBufferAttribute(pos, i + 1); c.fromBufferAttribute(pos, i + 2);
      put(a.clone().addScaledVector(ab.subVectors(b, a), u).addScaledVector(ac.subVectors(c, a), v));
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(pts, 3));
    g.setAttribute("color", new THREE.Float32BufferAttribute(cols, 3));
    // the dots ride along with their mesh, so moving parts keep moving
    mesh.add(new THREE.Points(g, new THREE.PointsMaterial({ size: 0.26, vertexColors: true })));
  });

  function resize() {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    const pr = renderer.getPixelRatio();
    if (canvas.width !== Math.floor(w * pr) || canvas.height !== Math.floor(h * pr)) {
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    }
  }

  const clock = new THREE.Clock();
  let cycle = 0;
  function frame() {
    const dt = Math.min(clock.getDelta(), 0.05), t = clock.elapsedTime;
    resize();
    if (!reduceMotion) {
      intake.rotation.z -= dt * 14;
      flywheels.forEach((f, i) => (f.rotation.y += (i ? -1 : 1) * dt * 30));
      cycle = (cycle + dt / 2.4) % 1;
      wings.forEach((w) => (w.rotation.x = w.userData.s * Math.sin(t * 22) * 0.22));
    }
    belly.forEach((p, i) => (p.visible = !reduceMotion && cycle < 0.5 && cycle * 8 > i && cycle * 8 < i + 1.2));
    if (cycle >= 0.5) {
      const k = (cycle - 0.5) / 0.5;
      shot.position.copy(trailPts[Math.min(trailPts.length - 1, Math.floor(k * (trailPts.length - 1)))]);
      shot.visible = true;
    } else {
      shot.position.set(-2.6, 16, 0);
      shot.visible = cycle > 0.42;
    }
    trail.visible = !reduceMotion;
    controls.update();
    renderer.render(scene, camera);
    requestAnimationFrame(frame);
  }
  frame();
})();
