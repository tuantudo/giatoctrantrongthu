/**
 * GIATOC UI SYSTEM vNEXT — boot-tree.js
 * Entry point for the GENEALOGY shell (/me/tree).
 *
 * Same shape as every other member surface: resolve context -> render the shared
 * shell -> render the page. The surface that used to be served here was the legacy
 * hash-routed SPA (`server/member_baseline.html`); see tree.js for why.
 */

import { resolveContext } from './navigation.js';
import { renderShell, resolveMemberSessionFlags } from './shell.js';
import { renderTree } from './tree.js';
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
  const { content } = renderShell(host, { context, assets, title: 'Cây phả đồ' });

  renderTree(content, context);
}

boot().catch((err) => {
  const host = document.querySelector('#gi-app');
  if (host) {
    host.textContent = `Không khởi tạo được giao diện: ${err && err.message ? err.message : err}`;
  }
});
