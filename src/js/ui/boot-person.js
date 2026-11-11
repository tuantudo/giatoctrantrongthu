/**
 * GIATOC UI SYSTEM v0.2 — boot-person.js
 * Entry point for /me/tree/person/:id
 * The person id is a URL parameter — never read from a data attribute or
 * hardcoded markup.
 */

import { resolveContext } from './navigation.js';
import { renderShell, resolveMemberSessionFlags } from './shell.js';
import { renderPerson } from './person.js';
import { api } from './data.js';
import { loadAssetManifest } from './assets.js';
import { setTypographyStack, viewportClass, typography } from './tokens.js';

async function boot() {
  const host = document.querySelector('#gi-app');
  await resolveMemberSessionFlags(api);
  const context = resolveContext(window.location.pathname);
  const personId = context.params ? context.params.id : null;

  setTypographyStack(typography.active);
  document.documentElement.dataset.viewport = viewportClass();

  const assets = await loadAssetManifest();
  const { content } = renderShell(host, {
    context,
    assets,
    title: context.route ? context.route.label : 'Hồ sơ cá nhân'
  });

  renderPerson(content, personId, context.route);
}

boot().catch((err) => {
  const host = document.querySelector('#gi-app');
  if (host) host.textContent = `Không khởi tạo được trang: ${err && err.message ? err.message : err}`;
});
