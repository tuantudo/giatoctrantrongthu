/**
 * GIATOC UI SYSTEM vNEXT — boot-public.js
 * Entry point for the PUBLIC shell (/).
 *
 * Uses renderShell to establish the publication shell:
 * - Utility strip
 * - Masthead with logo ngang (assets/images/logoGiaToc_ngang.svg)
 * - Navigation across 6 areas of PUBLIC Communication Architecture
 * - RenderPublicHome mounted into the main content region
 * - Canonical Colophon / Footer
 */

import { resolveContext } from './navigation.js';
import { renderShell } from './shell.js';
import { renderPublicHome } from './public-home.js';
import { renderInvitationGateway } from './gateway.js';
import { loadAssetManifest } from './assets.js';
import { setTypographyStack, viewportClass, typography } from './tokens.js';

const GATEWAY_ROUTES = new Set([
  'gia-pha',
  'mach',
  'tu-lieu',
  'lich',
  'tim-kiem',
  'thanh-vien',
  'tu-cach-thanh-vien'
]);

async function boot() {
  const host = document.querySelector('#gi-app');
  const context = resolveContext(window.location.pathname);

  setTypographyStack(typography.active);
  document.documentElement.dataset.viewport = viewportClass();

  const assets = await loadAssetManifest();
  const { content } = renderShell(host, {
    context,
    assets,
    title: 'Gia Tộc Trần Trọng Thu — PUBLIC'
  });

  function route() {
    const raw = window.location.hash || '';
    if (!raw || raw === '#' || raw === '#/') {
      if (!content.querySelector('.gi-public-home')) {
        renderPublicHome(content, context, assets);
      }
      if (raw === '#' || raw === '#/') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      return;
    }

    const isGatewayHash = raw.startsWith('#/');
    if (isGatewayHash) {
      const cleanRoute = raw.slice(2).split('/')[0].split('?')[0].toLowerCase();
      if (GATEWAY_ROUTES.has(cleanRoute)) {
        renderInvitationGateway(content, cleanRoute);
        return;
      }
    }

    if (!content.querySelector('.gi-public-home')) {
      renderPublicHome(content, context, assets);
    }

    const anchorId = raw.replace(/^#\/?/, '');
    const target = anchorId ? document.getElementById(anchorId) : null;
    if (target && typeof target.scrollIntoView === 'function') {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  window.addEventListener('hashchange', route);
  route();
}

boot().catch((err) => {
  const host = document.querySelector('#gi-app');
  if (host) {
    host.textContent = `Không khởi tạo được giao diện: ${err && err.message ? err.message : err}`;
  }
});
