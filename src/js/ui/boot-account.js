/**
 * GIATOC UI SYSTEM vNEXT — boot-account.js
 * Entry point for the Member Account Center (/me/account).
 */

import { resolveContext } from './navigation.js';
import { renderShell, resolveMemberSessionFlags } from './shell.js';
import { renderAccount } from './account.js';
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
    title: 'Tài khoản của tôi'
  });

  renderAccount(content, context);
}

boot().catch((err) => {
  const host = document.querySelector('#gi-app');
  if (host) {
    host.textContent = `Không khởi tạo được giao diện: ${err && err.message ? err.message : err}`;
  }
});

