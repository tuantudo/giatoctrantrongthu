/**
 * GIATOC SHARED UTILITIES — dom-helpers.js
 * Safe DOM construction and manipulation helpers.
 *
 * RULE (Mission Constraint #9): Database/API values are NEVER written through innerHTML.
 * All dynamic values are constructed safely via createElement + textContent or TextNodes.
 */

export function el(tag, props = {}, children = []) {
  const node = document.createElement(tag);
  for (const [key, value] of Object.entries(props || {})) {
    if (value === null || value === undefined || value === false) continue;
    if (key === 'class') node.className = value;
    else if (key === 'text') node.textContent = String(value);
    else if (key === 'html') node.innerHTML = String(value);
    else if (key === 'dataset') Object.assign(node.dataset, value);
    else if (key === 'style' && typeof value === 'object') Object.assign(node.style, value);
    else if (key.startsWith('on') && typeof value === 'function') {
      node.addEventListener(key.slice(2).toLowerCase(), value);
    } else if (value === true) node.setAttribute(key, '');
    else node.setAttribute(key, String(value));
  }
  for (const child of [].concat(children)) {
    if (child === null || child === undefined || child === false) continue;
    node.appendChild(typeof child === 'string' || typeof child === 'number'
      ? document.createTextNode(String(child))
      : child);
  }
  return node;
}

export function frag(children = []) {
  const f = document.createDocumentFragment();
  for (const child of [].concat(children)) {
    if (child === null || child === undefined || child === false) continue;
    f.appendChild(typeof child === 'string' || typeof child === 'number'
      ? document.createTextNode(String(child))
      : child);
  }
  return f;
}

export function clear(node) {
  while (node && node.firstChild) node.removeChild(node.firstChild);
  return node;
}

export function mount(target, ...children) {
  const host = typeof target === 'string' ? document.querySelector(target) : target;
  if (!host) return null;
  clear(host);
  for (const child of children.flat()) if (child) host.appendChild(child);
  return host;
}

