/**
 * GIATOC UI SYSTEM vNEXT — boot-spaces.js
 * Entry point for the Family Space placeholder (/me/family-spaces).
 */

import { resolveContext } from './navigation.js';
import { renderShell } from './shell.js';
import { renderSpacesPage } from './spaces.js';
import { loadAssetManifest } from './assets.js';
import { setTypographyStack, viewportClass, typography } from './tokens.js';

async function boot() {
  const host = document.querySelector('#gi-app');
  const context = resolveContext(window.location.pathname);

  setTypographyStack(typography.active);
  document.documentElement.dataset.viewport = viewportClass();

  const assets = await loadAssetManifest();
  const { content } = renderShell(host, {
    context,
    assets,
    title: context.route ? context.route.label : 'Không gian gia đình'
  });

  renderSpacesPage(content, context);
}

boot().catch((err) => {
  const host = document.querySelector('#gi-app');
  if (host) {
    host.textContent = `Không khởi tạo được giao diện: ${err && err.message ? err.message : err}`;
  }
});