# Suhan Khadka — Portfolio

A static portfolio connecting robotics, embedded systems and software. Published at **https://suhankhadka.com.np/**.

## Develop and preview

Requires Node.js 20 or later.

```sh
npm ci
npm run build
npm run check
npm run preview
```

Preview is served at `http://127.0.0.1:4173`. Set `PORT` to change it. Re-run the build after editing source. `npm test` builds and checks internal links, fragment IDs, basic document structure, the domain and JavaScript size budgets.

## Source and publishing

- `src/templates.mjs`: homepage, shared layout, contact and case-study templates.
- `src/projects.mjs`: project descriptions, status, evidence links and limitations.
- `src/site.css`: responsive layout, typography, colors and accessibility styles.
- `src/main.js`: mobile navigation, clipboard feedback, optional 3D loading.
- `src/scene.js`: procedural Three.js robot. Runs a 30 fps demonstration while visible; pauses offscreen and disposes resources when closed.
- `scripts/`: build, local static preview and validation.
- `assets/media/`: optimized portraits, project covers, scene poster and social preview.
- `index.html`, `projects/*/index.html`, `404.html`, `assets/site.css`, `assets/js/`, `robots.txt`, `sitemap.xml`: generated output, committed for the existing root-based GitHub Pages deployment. **Edit the source, then run the build; do not edit these outputs directly.**
- `CNAME`: custom domain. Keep it when publishing. `.nojekyll` enables direct static serving.

The original `css/` and `assets/img/` directories remain as historical source assets; the new page does not request them. The original résumé at `assets/cv.pdf` remains available. Update its education date and project/contribution details after confirming those facts.

Deployment uses the existing GitHub Pages source configuration. Merge a reviewed branch only when ready to publish. No deployment service, database, API key or new hosting provider is required.

## Content and media integrity

- Arduino robot cover: real photograph from `SuhanVerse/All_in_one_Arduino_Robot/docs/robo_2.png`; upstream repository uses Apache-2.0. See `assets/media/ATTRIBUTION.md` and the upstream license copy.
- EdumentX, VisioBot and RoboVault use compact HTML implementation overviews. Previous AI-generated covers remain as historical assets but are not requested by the site. Replace an overview with a real capture only when it represents the actual implementation.
- The workbench robot is an illustrative model, not an exact reconstruction of a project.
- Do not replace documented limitations with unmeasured outcomes or claim sole authorship of team projects without checking contributions.
- The degree start date is omitted because the existing résumé and profile disagree. Club/training information comes from the résumé; confirm it when updating content.

Contact is a normal email link with progressive clipboard enhancement. There is no simulated form submission and no backend. No third-party analytics or embedded social feeds are loaded.

## Accessibility and performance

Core content and navigation work without JavaScript. The mobile menu is an inline disclosure with a native button, hidden closed links, Escape and focus return. There is no modal focus trap because the menu is not a modal. Motion respects reduced-motion preferences.

Three.js is dynamically imported after the workbench becomes visible, with a brief delay for the initial page. Reduced-motion, Save-Data and slow-connection visitors retain the static poster until they choose **Explore in 3D**. Reduced-motion starts the viewer paused. A static image remains available if loading or WebGL fails. Animation is capped at 30 fps, stops offscreen/when the tab is hidden, and caps pixel ratio at 1.5. HTML controls provide sensor-scan, controller-pulse and moving-wheel demonstrations, automatic cycling, pause/play and rotation. Closing the viewer prevents automatic reopening. This is an illustrative model, not a physics simulator or live sensor feed. Keep the initial JS under 60 KB gzip and the complete optional JS under 1 MB gzip; `npm run check` enforces these upper bounds.

Before publishing substantive changes, verify 320–1440 px widths, keyboard navigation, no JavaScript, reduced motion, failed scene loading and WebGL context loss. Test actual phones and Safari in addition to Chromium. A static preview is not a substitute for field performance measurements.
