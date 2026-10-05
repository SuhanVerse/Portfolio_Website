const toggle = document.querySelector(".menu-toggle");
const nav = document.querySelector("#site-nav");
const mobile = window.matchMedia("(max-width:760px)");
function setMenu(open, { returnFocus = false } = {}) {
  nav.hidden = mobile.matches && !open;
  toggle.setAttribute("aria-expanded", String(mobile.matches && open));
  toggle.innerHTML = open
    ? 'Close <span aria-hidden="true">−</span>'
    : 'Menu <span aria-hidden="true">+</span>';
  if (returnFocus) toggle.focus();
}
if (toggle && nav) {
  toggle.hidden = false;
  setMenu(false);
  toggle.addEventListener("click", () =>
    setMenu(toggle.getAttribute("aria-expanded") !== "true"),
  );
  nav.addEventListener("click", (e) => {
    if (e.target.closest("a") && mobile.matches)
      setMenu(false, { returnFocus: true });
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && toggle.getAttribute("aria-expanded") === "true")
      setMenu(false, { returnFocus: true });
  });
  mobile.addEventListener("change", () => setMenu(false));
}
const copy = document.querySelector("#copy-email");
if (copy && navigator.clipboard) {
  copy.hidden = false;
  copy.addEventListener("click", async () => {
    const status = document.querySelector("#copy-status");
    try {
      await navigator.clipboard.writeText("khsuhan100@gmail.com");
      status.textContent = "Email address copied.";
    } catch {
      status.textContent =
        "Copy unavailable. Select the email address above or open it in your mail app.";
    }
  });
}

const load = document.querySelector("#load-scene");
if (load) {
  const host = document.querySelector("#scene-host");
  const poster = document.querySelector("#scene-poster");
  const controls = document.querySelector("#scene-controls");
  const status = document.querySelector("#scene-status");
  const phaseLabel = document.querySelector("#scene-phase");
  const pause = document.querySelector("#pause-scene");
  const auto = document.querySelector("#auto-scene");
  const reduced = matchMedia("(prefers-reduced-motion: reduce)");
  const connection = navigator.connection;
  let scene = null,
    loading = false,
    stopped = false,
    paused = reduced.matches;
  let autoTimer = null;
  const descriptions = {
    sense:
      "Sense — the arcs illustrate an ultrasonic scan. This is a demonstration, not live sensor data.",
    compute:
      "Compute — the highlighted controller represents interpreting an input and choosing a response.",
    act: "Act — rotating wheels show how motor commands become movement.",
    auto: "Automatic demonstration: scan, process and move. Use Pause motion to hold a frame.",
  };
  function updatePause() {
    pause.textContent = paused ? "Play motion" : "Pause motion";
    pause.setAttribute("aria-pressed", String(paused));
  }
  function reset() {
    scene?.dispose();
    scene = null;
    host.classList.remove("active");
    poster.hidden = false;
    controls.hidden = true;
    phaseLabel.hidden = true;
    controls
      .querySelectorAll("[data-part]")
      .forEach((b) => b.setAttribute("aria-pressed", "false"));
    auto.setAttribute("aria-pressed", "true");
    load.hidden = false;
    load.disabled = false;
    load.innerHTML = 'Explore in 3D <span aria-hidden="true">↗</span>';
  }
  load.hidden = false;
  async function start(manual = false) {
    if (scene || loading) return;
    if (
      !manual &&
      (stopped ||
        document.hidden ||
        reduced.matches ||
        connection?.saveData ||
        /(^|-)2g$/.test(connection?.effectiveType || ""))
    )
      return;
    loading = true;
    load.disabled = true;
    if (manual) status.textContent = "Opening the miniature workbench…";
    try {
      let timer;
      const module = await Promise.race([
        import("./scene.js"),
        new Promise((_, reject) => {
          timer = setTimeout(
            () => reject(new Error("Scene load timeout")),
            12000,
          );
        }),
      ]).finally(() => clearTimeout(timer));
      // Respect a preference change while the module was being downloaded.
      if (!manual && (stopped || reduced.matches || connection?.saveData))
        return;
      paused = reduced.matches;
      host.classList.add("active");
      scene = module.createScene(
        host,
        () => {
          const hadFocus = controls.contains(document.activeElement);
          stopped = true;
          reset();
          status.textContent =
            "3D is unavailable. The static illustration remains available.";
          if (hadFocus) load.focus();
        },
        (phase) => {
          phaseLabel.textContent = phase;
        },
        paused,
      );
      poster.hidden = true;
      controls.hidden = false;
      load.hidden = true;
      phaseLabel.hidden = false;
      updatePause();
      status.textContent = paused
        ? "Motion is paused to respect your reduced-motion setting. You can inspect each subsystem."
        : descriptions.auto;
      if (manual) controls.querySelector("button").focus();
    } catch {
      stopped = true;
      reset();
      status.textContent =
        "3D could not load. You can still explore every project below.";
    } finally {
      loading = false;
      load.disabled = false;
    }
  }
  load.addEventListener("click", () => start(true));
  function select(part) {
    scene?.highlight(part);
    controls
      .querySelectorAll("[data-part]")
      .forEach((b) =>
        b.setAttribute("aria-pressed", String(b.dataset.part === part)),
      );
    auto.setAttribute("aria-pressed", String(part === "auto"));
    status.textContent = descriptions[part];
  }
  controls
    .querySelectorAll("[data-part]")
    .forEach((button) =>
      button.addEventListener("click", () => select(button.dataset.part)),
    );
  auto.addEventListener("click", () => select("auto"));
  pause.addEventListener("click", () => {
    paused = !paused;
    scene?.setPaused(paused);
    updatePause();
    status.textContent = paused
      ? "Motion paused. Subsystem and view controls remain available."
      : "Motion playing. The selected demonstration continues.";
  });
  document
    .querySelector("#rotate-scene")
    .addEventListener("click", () => scene?.rotate());
  document.querySelector("#close-scene").addEventListener("click", () => {
    stopped = true;
    reset();
    status.textContent =
      "3D closed. Select Explore in 3D to reopen the demonstration.";
    load.focus();
  });
  const observer = new IntersectionObserver(
    (entries) => {
      clearTimeout(autoTimer);
      if (entries[0].isIntersecting) autoTimer = setTimeout(() => start(), 800);
    },
    { threshold: 0.25 },
  );
  observer.observe(document.querySelector(".workbench"));
  reduced.addEventListener("change", () => {
    if (reduced.matches) {
      paused = true;
      scene?.setPaused(true);
      updatePause();
    }
  });
}
