# Verification — portfolio redesign

Reviewed in local Chromium on 29 September 2026. No contact messages were sent.

- Homepage: 320×740, 390×844, 768×1024, 1440×1000, 844×390. No horizontal document overflow, including open mobile navigation.
- Mobile menu: opens, closes with Escape, hides closed links and returns focus to its toggle.
- All four case-study routes: 390 px reflow, one h1, local assets and source links present.
- axe-core WCAG 2 A/AA and 2.1 AA checks: no violations in the tested homepage states or four case-study pages. This is not a claim of complete WCAG conformance.
- Initial page requests do not fetch the Three.js scene module.
- Scene activation, subsystem controls, rotation and close behavior work. Closing removes the canvas and returns focus to the activation button.
- Simulated WebGL context loss: renderer cleanup and static fallback recovered.
- Blocked scene module: static poster and project content remain available with a clear status message.
- JavaScript disabled: navigation and all four project summaries remain visible, and the nonfunctional 3D activation button stays hidden.
- `npm test`: checks generated pages, local links/anchors, duplicate IDs, domain preservation and JavaScript budgets.
- Production dependency audit reported no known vulnerabilities at review time.

The local browser test harness used Playwright, axe-core and Chromium with software WebGL. It is not a physical-device GPU benchmark. Before release, also check Safari/iOS, an actual mid-range Android phone, screen-reader navigation, clipboard permissions and the deployed custom domain. No field LCP, INP or CLS claims are made.

## 5 October refinement

See `docs/REVIEW-2026-10-05.md` for the current review. The earlier click-only/no-idle-motion behavior is superseded: the scene now starts automatically when eligible and visible, with manual startup for reduced-motion/data-saving visitors. Verified animation, all three automatic phases, subsystem selection, pause, rotation while paused, offscreen stop/resume, close persistence, reduced-motion and Save-Data handling, no-JavaScript navigation, blocked module fallback and simulated context loss. Five homepage viewports and all four mobile case pages passed overflow and axe checks. All 23 GitHub project/evidence links returned HTTP 200. Screenshots are in `docs/refinement-*.jpg`.
