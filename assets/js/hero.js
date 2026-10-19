/* =========================================================
   Hero "point cloud" robot — a rotating 3D dot model of a
   generic FTC robot with the team number on the front.
   Drag (mouse or touch) to rotate.
   ========================================================= */

(() => {
  const canvas = document.getElementById("robot-cloud");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const TEAM_NUMBER = "34237";
  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

  const pts = [];
  const add = (x, y, z) => pts.push([x, y, z]);
  const jitter = () => (Math.random() - 0.5) * 0.015;

  function line(a, b, n) {
    for (let i = 0; i <= n; i++) {
      const t = i / n;
      add(a[0] + (b[0] - a[0]) * t + jitter(), a[1] + (b[1] - a[1]) * t + jitter(), a[2] + (b[2] - a[2]) * t + jitter());
    }
  }

  function box(x0, x1, y0, y1, z0, z1, density) {
    const c = [
      [x0, y0, z0], [x1, y0, z0], [x1, y1, z0], [x0, y1, z0],
      [x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1],
    ];
    const edges = [[0,1],[1,2],[2,3],[3,0],[4,5],[5,6],[6,7],[7,4],[0,4],[1,5],[2,6],[3,7]];
    edges.forEach(([a, b]) => {
      const len = Math.hypot(c[a][0]-c[b][0], c[a][1]-c[b][1], c[a][2]-c[b][2]);
      line(c[a], c[b], Math.round(len * density));
    });
  }

  function circle(cx, cy, cz, r, plane, n) {
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2;
      const u = Math.cos(a) * r, v = Math.sin(a) * r;
      if (plane === "yz") add(cx + jitter(), cy + u, cz + v);
      else add(cx + u, cy + v, cz + jitter());
    }
  }

  // Chassis (y grows downward)
  box(-1, 1, 0.15, 0.6, -0.7, 0.7, 70);
  // Inner rails
  line([-1, 0.38, -0.7], [1, 0.38, -0.7], 90);
  line([-1, 0.38, 0.7], [1, 0.38, 0.7], 90);
  // Wheels (mecanum-ish)
  [[-1.06, -0.48], [-1.06, 0.48], [1.06, -0.48], [1.06, 0.48]].forEach(([x, z]) => {
    circle(x, 0.6, z, 0.2, "yz", 46);
    circle(x, 0.6, z, 0.12, "yz", 26);
  });
  // Lift tower with truss bracing
  box(-0.55, 0.55, -0.75, 0.15, -0.35, 0.35, 50);
  for (let i = 0; i < 4; i++) {
    const y0 = -0.75 + i * 0.225, y1 = y0 + 0.225;
    line([-0.55, y0, 0.35], [0.55, y1, 0.35], 30);
    line([-0.55, y1, -0.35], [0.55, y0, -0.35], 30);
  }
  // Intake roller / arm on top
  circle(0, -0.95, 0, 0.22, "xy", 50);
  line([0, -0.75, 0], [0, -0.73 - 0.22, 0], 8);
  line([-0.7, -0.78, 0.55], [0.7, -0.78, 0.55], 60);

  // Team number on the front face, sampled from an offscreen canvas
  const off = document.createElement("canvas");
  off.width = 400; off.height = 100;
  const octx = off.getContext("2d");
  octx.fillStyle = "#fff";
  octx.font = "800 84px Orbitron, Arial Black, sans-serif";
  octx.textAlign = "center";
  octx.textBaseline = "middle";

  function sampleText() {
    octx.clearRect(0, 0, off.width, off.height);
    octx.fillText(TEAM_NUMBER, off.width / 2, off.height / 2 + 4);
    const data = octx.getImageData(0, 0, off.width, off.height).data;
    const textPts = [];
    for (let y = 0; y < off.height; y += 2) {
      for (let x = 0; x < off.width; x += 2) {
        if (data[(y * off.width + x) * 4 + 3] > 128) {
          textPts.push([(x / off.width - 0.5) * 1.85, 0.55 + (y / off.height - 0.5) * 0.44, 0.72]);
        }
      }
    }
    return textPts;
  }

  // Re-center the model vertically so it rotates around its middle
  pts.forEach((p) => (p[1] += 0.18));
  const basePts = pts.slice();
  let allPts = basePts.concat(sampleText());
  // Resample once the web font has loaded so the digits match the site font
  if (document.fonts && document.fonts.ready) {
    document.fonts.load("800 84px Orbitron").then(() => { allPts = basePts.concat(sampleText()); }).catch(() => {});
  }

  let w = 0, h = 0, dpr = 1;
  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    const r = canvas.getBoundingClientRect();
    w = r.width; h = r.height;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  new ResizeObserver(resize).observe(canvas);
  resize();

  let rotY = -0.45, rotX = -0.3, velY = reduceMotion ? 0 : 0.004;
  let dragging = false, lastX = 0, lastY = 0, idleSince = 0;

  canvas.addEventListener("pointerdown", (e) => {
    dragging = true; lastX = e.clientX; lastY = e.clientY;
    canvas.setPointerCapture(e.pointerId);
  });
  canvas.addEventListener("pointermove", (e) => {
    if (!dragging) return;
    const dx = e.clientX - lastX, dy = e.clientY - lastY;
    lastX = e.clientX; lastY = e.clientY;
    rotY += dx * 0.01;
    rotX = Math.max(-1.1, Math.min(0.6, rotX - dy * 0.01));
    if (!running) draw();
  });
  const end = () => { dragging = false; idleSince = performance.now(); };
  canvas.addEventListener("pointerup", end);
  canvas.addEventListener("pointercancel", end);

  function draw() {
    ctx.clearRect(0, 0, w, h);
    const cy = Math.cos(rotY), sy = Math.sin(rotY);
    const cx = Math.cos(rotX), sx = Math.sin(rotX);
    const scale = w * 0.3, fov = 3.2;
    for (let i = 0; i < allPts.length; i++) {
      const p = allPts[i];
      // rotate around Y, then X
      let x = p[0] * cy - p[2] * sy;
      let z = p[0] * sy + p[2] * cy;
      let y = p[1] * cx - z * sx;
      z = p[1] * sx + z * cx;
      const persp = fov / (fov + z);
      const px = w / 2 + x * scale * persp;
      const py = h / 2 + y * scale * persp;
      const depth = (1 - z) / 2; // ~0 (far) .. 1 (near)
      ctx.globalAlpha = 0.25 + depth * 0.75;
      ctx.fillStyle = depth > 0.55 ? "#ffb066" : "#ff7a00";
      const s = 1.1 + depth * 1.2;
      ctx.fillRect(px - s / 2, py - s / 2, s, s);
    }
    ctx.globalAlpha = 1;
  }

  let running = false, visible = true;
  function loop() {
    if (!visible) { running = false; return; }
    running = true;
    if (!dragging && performance.now() - idleSince > 1200) rotY += velY;
    draw();
    requestAnimationFrame(loop);
  }

  new IntersectionObserver(([e]) => {
    visible = e.isIntersecting;
    if (!visible || running) return;
    if (reduceMotion) draw(); else loop();
  }).observe(canvas);
})();
