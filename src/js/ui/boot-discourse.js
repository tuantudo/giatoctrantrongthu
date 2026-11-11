/**
 * GIATOC UI SYSTEM vNEXT — boot-discourse.js
 * Entry point for BOTH internal discourse surfaces (/me/mach, /me/clara).
 * The scope is taken from the navigation registry — never from the filename —
 * so the URL decides which voice the reader is inside.
 */

import { resolveContext } from './navigation.js';
import { renderShell, resolveMemberSessionFlags } from './shell.js';
import { renderDiscoursePage } from './discourse.js';
import { api } from './data.js';
import { loadAssetManifest } from './assets.js';
import { setTypographyStack, viewportClass, typography } from './tokens.js';

async function boot() {
  const host = document.querySelector('#gi-app');
  await resolveMemberSessionFlags(api);
  const context = resolveContext(window.location.pathname);

  if (!context.route || !context.discourse) {
    throw new Error('Trang này không thuộc phạm vi diễn ngôn nào.');
  }

  setTypographyStack(typography.active);
  document.documentElement.dataset.viewport = viewportClass();

  const assets = await loadAssetManifest();
  const { content } = renderShell(host, {
    context,
    assets,
    title: context.route.label
  });

  renderDiscoursePage(content, context, context.discourse);
}

boot().catch((err) => {
  const host = document.querySelector('#gi-app');
  if (host) {
    host.textContent = `Không khởi tạo được giao diện: ${err && err.message ? err.message : err}`;
  }
});