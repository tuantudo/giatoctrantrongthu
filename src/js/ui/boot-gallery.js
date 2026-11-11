/**
 * GIATOC UI SYSTEM vNEXT — boot-gallery.js
 * Entry point for the Member Gallery shell (/me/gallery).
 *
 * Implements Increment 02 of Product Convergence V1.0.
 */

import { resolveContext } from './navigation.js';
import { renderShell, resolveMemberSessionFlags } from './shell.js';
import { renderGallery } from './gallery.js';
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
    title: 'Kho tư liệu & Di ảnh'
  });

  const urlParams = new URLSearchParams(window.location.search);
  const personId = urlParams.get('personId');
  const kind = urlParams.get('kind');

  renderGallery(content, context, { personId, kind });
}

boot().catch((err) => {
  const host = document.querySelector('#gi-app');
  if (host) {
    host.textContent = `Không khởi tạo được giao diện: ${err && err.message ? err.message : err}`;
  }
});

