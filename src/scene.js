import * as THREE from "three";
// An illustrative teaching robot, not a CAD reconstruction of a project.
// Procedural geometry only. Animation is capped at 30 fps and suspended offscreen.
export function createScene(
  host,
  onLost,
  onPhase = () => {},
  initialPaused = false,
) {
  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: false,
    powerPreference: "low-power",
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
  renderer.setClearColor(0xe8e9df);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  host.appendChild(renderer.domElement);
  const scene = new THREE.Scene(),
    camera = new THREE.PerspectiveCamera(34, 1, 0.1, 60);
  camera.position.set(5.7, 4.3, 6.5);
  camera.lookAt(0, 0.6, 0);
  scene.add(new THREE.HemisphereLight(0xffffff, 0x69755e, 3));
  const key = new THREE.DirectionalLight(0xffffff, 3);
  key.position.set(3, 7, 5);
  scene.add(key);
  const robot = new THREE.Group();
  scene.add(robot);
  let disposed = false,
    visible = true,
    angle = -0.3;
  const wheels = [];
  const parts = { sense: [], compute: [], act: [] };
  const materials = [];
  function mat(color, metalness = 0) {
    const m = new THREE.MeshStandardMaterial({
      color,
      roughness: 0.65,
      metalness,
    });
    materials.push(m);
    return m;
  }
  const deck = mat(0xd8c89e, 0.2),
    green = mat(0x315b43),
    metal = mat(0xb8c0b6, 0.45),
    black = mat(0x29312d),
    orange = mat(0xb85a32),
    blue = mat(0x365e66),
    tire = mat(0x303833);
  function mesh(geo, m, x, y, z, part, parent = robot) {
    if (part) {
      m = m.clone();
      materials.push(m);
    }
    const obj = new THREE.Mesh(geo, m);
    obj.position.set(x, y, z);
    parent.add(obj);
    if (part) parts[part].push(obj);
    return obj;
  }
  const box = (w, h, d, m, x, y, z, part) =>
    mesh(new THREE.BoxGeometry(w, h, d), m, x, y, z, part);
  box(2.2, 0.14, 2.9, deck, 0, 0.48, 0);
  box(1.9, 0.12, 2.15, deck, 0, 1.05, -0.12);
  for (const x of [-0.85, 0.85])
    for (const z of [-0.85, 0.7])
      mesh(new THREE.CylinderGeometry(0.045, 0.045, 0.5, 8), metal, x, 0.79, z);
  for (const x of [-1.2, 1.2])
    for (const z of [-0.95, 0.95]) {
      const group = new THREE.Group();
      group.position.set(x, 0.4, z);
      robot.add(group);
      wheels.push(group);
      const wheel = mesh(
        new THREE.CylinderGeometry(0.47, 0.47, 0.28, 20),
        tire,
        0,
        0,
        0,
        "act",
        group,
      );
      wheel.rotation.z = Math.PI / 2;
      const hub = mesh(
        new THREE.CylinderGeometry(0.24, 0.24, 0.3, 12),
        green,
        0,
        0,
        0,
        "act",
        group,
      );
      hub.rotation.z = Math.PI / 2;
      for (let a = 0; a < 8; a++) {
        const tread = mesh(
          new THREE.BoxGeometry(0.3, 0.05, 0.14),
          black,
          0,
          Math.cos((a * Math.PI) / 4) * 0.45,
          Math.sin((a * Math.PI) / 4) * 0.45,
          "act",
          group,
        );
        tread.rotation.x = (-a * Math.PI) / 4;
      }
    }
  box(1.15, 0.08, 0.8, green, 0, 1.18, -0.05, "compute");
  box(0.38, 0.12, 0.36, black, 0, 1.28, -0.06, "compute");
  box(0.2, 0.16, 0.27, metal, -0.57, 1.28, 0.14, "compute");
  for (const x of [-0.42, 0.42])
    for (let i = 0; i < 6; i++)
      box(0.045, 0.08, 0.045, metal, x, 1.26, -0.32 + i * 0.1, "compute");
  box(0.6, 0.18, 1.0, black, 0, 0.68, -0.4);
  box(0.38, 0.25, 0.33, blue, 0, 1.28, 1.03, "sense");
  box(0.92, 0.45, 0.09, green, 0, 1.63, 1.14, "sense");
  for (const x of [-0.25, 0.25]) {
    const sensor = mesh(
      new THREE.CylinderGeometry(0.17, 0.17, 0.15, 24),
      metal,
      x,
      1.66,
      1.26,
      "sense",
    );
    sensor.rotation.x = Math.PI / 2;
    const face = mesh(
      new THREE.CylinderGeometry(0.125, 0.125, 0.16, 24),
      black,
      x,
      1.66,
      1.28,
      "sense",
    );
    face.rotation.x = Math.PI / 2;
  }
  for (const x of [-0.68, 0.68])
    box(0.17, 0.1, 0.32, black, x, 0.38, 1.5, "sense");
  for (const x of [-0.4, 0.4]) {
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(x, 1.2, 0.2),
      new THREE.Vector3(x + 0.15, 1.65, 0.5),
      new THREE.Vector3(x, 1.35, 1.1),
    ]);
    mesh(new THREE.TubeGeometry(curve, 12, 0.018, 6, false), orange, 0, 0, 0);
  }
  const ground = mesh(
    new THREE.CylinderGeometry(2.7, 2.7, 0.1, 64),
    mat(0xd4d9c9),
    0,
    -0.14,
    0,
    null,
    scene,
  );
  const grid = new THREE.GridHelper(7, 14, 0xb6bfac, 0xcbd1c1);
  grid.position.y = -0.21;
  scene.add(grid);
  robot.rotation.y = angle;

  // Sensor waves stay attached to the robot. They illustrate a scan, not measured data.
  const waves = [];
  for (let i = 0; i < 3; i++) {
    const points = [];
    for (let j = 0; j <= 24; j++) {
      const a = -0.65 + (j / 24) * 1.3;
      points.push(new THREE.Vector3(Math.sin(a), 0, Math.cos(a)));
    }
    const material = new THREE.MeshBasicMaterial({
      color: 0x387752,
      transparent: true,
      opacity: 0.7,
    });
    materials.push(material);
    const wave = new THREE.Mesh(
      new THREE.TubeGeometry(
        new THREE.CatmullRomCurve3(points),
        24,
        0.018,
        4,
        false,
      ),
      material,
    );
    wave.position.set(0, 1.62, 1.32);
    robot.add(wave);
    waves.push(wave);
  }
  const base = new Map(
    materials.filter((m) => m.emissive).map((m) => [m, m.color.clone()]),
  );
  let mode = "auto",
    phase = "",
    paused = initialPaused,
    elapsed = 0,
    last = 0,
    frame = 0;
  function setPhase(next) {
    if (next === phase) return;
    phase = next;
    host.dataset.phase = phase;
    for (const [m, c] of base) {
      m.color.copy(c);
      m.emissive.set(0x000000);
    }
    for (const obj of parts[phase] || []) obj.material.emissive.set(0x244b2f);
    onPhase(phase);
  }
  function pose() {
    setPhase(
      mode === "auto"
        ? ["sense", "compute", "act"][Math.floor(elapsed / 4) % 3]
        : mode,
    );
    robot.rotation.y = angle + Math.sin(elapsed * 0.35) * 0.12;
    robot.position.z = phase === "act" ? Math.sin(elapsed * 1.8) * 0.18 : 0;
    for (const wave of waves) wave.visible = phase === "sense";
    waves.forEach((wave, i) => {
      const scale = 0.25 + ((elapsed * 0.65 + i / 3) % 1) * 0.9;
      wave.scale.setScalar(scale);
      wave.material.opacity = 0.75 * (1 - (scale - 0.25) / 0.9);
    });
    for (const obj of parts.compute)
      obj.material.emissiveIntensity =
        phase === "compute" ? 0.7 + Math.sin(elapsed * 5) * 0.6 : 1;
    for (const wheel of wheels)
      wheel.rotation.x = phase === "act" ? elapsed * 2 : 0;
  }
  function render() {
    if (!disposed && visible && !document.hidden)
      renderer.render(scene, camera);
  }
  function tick(now) {
    frame = 0;
    if (disposed || paused || !visible || document.hidden) return;
    if (!last) last = now;
    if (now - last >= 1000 / 30) {
      elapsed += Math.min((now - last) / 1000, 0.1);
      last = now;
      pose();
      render();
    }
    frame = requestAnimationFrame(tick);
  }
  function sync() {
    cancelAnimationFrame(frame);
    frame = 0;
    last = 0;
    if (disposed || !visible || document.hidden) return;
    pose();
    render();
    if (!paused) frame = requestAnimationFrame(tick);
  }
  const resize = () => {
    if (disposed) return;
    const { width, height } = host.getBoundingClientRect();
    if (!width || !height) return;
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    render();
  };
  const ro = new ResizeObserver(resize);
  ro.observe(host);
  const io = new IntersectionObserver((entries) => {
    visible = entries[0].isIntersecting;
    sync();
  });
  io.observe(host);
  document.addEventListener("visibilitychange", sync);
  const lost = (e) => {
    e.preventDefault();
    onLost();
  };
  renderer.domElement.addEventListener("webglcontextlost", lost);
  pose();
  resize();
  sync();
  return {
    highlight(part) {
      mode = part;
      elapsed = 0;
      pose();
      render();
    },
    rotate() {
      angle += Math.PI / 5;
      pose();
      render();
    },
    setPaused(value) {
      paused = value;
      sync();
    },
    dispose() {
      if (disposed) return;
      disposed = true;
      cancelAnimationFrame(frame);
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", sync);
      renderer.domElement.removeEventListener("webglcontextlost", lost);
      scene.traverse((o) => {
        o.geometry?.dispose();
      });
      for (const m of materials) m.dispose();
      grid.material.dispose();
      renderer.dispose();
      renderer.domElement.remove();
      delete host.dataset.phase;
    },
  };
}
