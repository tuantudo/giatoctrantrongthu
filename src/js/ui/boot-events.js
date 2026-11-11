/**
 * GIATOC UI SYSTEM vNEXT — boot-events.js
 * Entry point for the Member Events & Memorial Timeline shell (/me/events).
 *
 * Implements Increment 03A of Product Convergence V1.0.
 */

import { resolveContext } from './navigation.js';
import { renderShell, resolveMemberSessionFlags } from './shell.js';
import { renderEvents } from './events.js';
import { api } from './data.js';
import { loadAssetManifest } from './assets.js';
import { setTypographyStack, viewportClass, typography } from './tokens.js';

async function boot() {
  const host = document.querySelector('#gi-app');
  await resolveMemberSessionFlags(api);
  const context = resolveContext(window.location.pathname);

  setTypographyStack(typography.active);
  document.documentElement.dataset.viewport = viewportClass();

  const assets = await loadAssetManifest();
  const { content } = renderShell(host, {
    context,
    assets,
    title: 'Lịch giỗ & Niên biểu'
  });

  renderEvents(content, context);
}

boot().catch((err) => {
  const host = document.querySelector('#gi-app');
  if (host) {
    host.textContent = `Không khởi tạo được giao diện: ${err && err.message ? err.message : err}`;
  }
});

