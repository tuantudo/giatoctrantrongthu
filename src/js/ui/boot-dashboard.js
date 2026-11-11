/**
 * GIATOC UI SYSTEM v0.2 — boot-dashboard.js
 * Entry point for the Member Dashboard page (/me).
 * Order matters: assets -> navigation context -> shell -> page content.
 */

import { resolveContext } from './navigation.js';
import { renderShell, resolveMemberSessionFlags } from './shell.js';
import { renderDashboard } from './dashboard.js';
import { api } from './data.js';
import { loadAssetManifest } from './assets.js';
import { setTypographyStack, viewportClass, typography } from './tokens.js';

async function boot() {
  const host = document.querySelector('#gi-app');
  await resolveMemberSessionFlags(api);
  const context = resolveContext(window.location.pathname);

  // Typography stays on the approved-for-now site stack; the switch is one call.
  setTypographyStack(typography.active);
  document.documentElement.dataset.viewport = viewportClass();

  const assets = await loadAssetManifest();
  const { content } = renderShell(host, {
    context,
    assets,
    title: context.route ? context.route.label : 'Member'
  });

  renderDashboard(content, context);
}

boot().catch((err) => {
  // Boot failure must still be legible rather than a blank page.
  const host = document.querySelector('#gi-app');
  if (host) {
    host.textContent = `Không khởi tạo được giao diện: ${err && err.message ? err.message : err}`;
  }
});
