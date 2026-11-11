/**
 * GIATOC UI SYSTEM v0.2 — assets.js
 * Asset access goes through assets/ASSET_MANIFEST.json (Phase 9).
 * No filename is hardcoded in components or pages.
 *
 * [RULE] No placeholder artwork. If the manifest is missing or an asset is
 * absent, the header renders text-only instead of inventing an image.
 */

const MANIFEST_URL = '/assets/ASSET_MANIFEST.json';

let manifestPromise = null;

export function loadAssetManifest() {
  if (!manifestPromise) {
    manifestPromise = fetch(MANIFEST_URL, { credentials: 'same-origin' })
      .then(res => (res.ok ? res.json() : null))
      .catch(() => null)
      .then((manifest) => {
        const assets = (manifest && manifest.assets) || {};
        return {
          logoNgang: assets['brand.logoHorizontal']?.path || null,
          logoVertical: assets['brand.logoVertical']?.path || null,
          logoIcon: assets['brand.logoIcon']?.path || null,
          favicon: assets['brand.favicon']?.path || null,
          available: Boolean(manifest)
        };
      });
  }
  return manifestPromise;
}

/** <link rel="icon"> applied from the manifest, never hardcoded per page. */
export function applyFavicon(assets) {
  if (!assets || !assets.favicon) return;
  let link = document.querySelector('link[rel="icon"]');
  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', 'icon');
    document.head.appendChild(link);
  }
  link.setAttribute('href', assets.favicon);
}
