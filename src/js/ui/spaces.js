/**
 * GIATOC UI SYSTEM vNEXT — spaces.js
 * Family Space (/me/family-spaces).
 *
 * Authority: docs/design/GIATOC_INNER_SITE_UX_IA_SPEC_v0.1.md §10
 *
 * [REWRITTEN 2026-10-04 — Inner Site implementation]
 *
 * The previous version of this page explained the ARCHITECTURE to the member. It
 * rendered a section titled "Phân biệt khái niệm" listing `FamilySpace`,
 * `GenealogyConstruct`, `Person` and `Tài khoản` as definitions, printed the raw
 * route string `/me/tree` as body copy, and said "Chưa có API nào phục vụ…".
 *
 * That is the failure this mission exists to remove: architecture ontology shown to
 * a member who did not ask for it. spec §15 maps "FamilySpace → Không gian gia đình"
 * and "Genealogy Construct → Cây phả đồ" — the UI should use the RIGHT words, not
 * explain the left ones. spec §16 bans API Status on the UI.
 *
 * Human resolution of Open Question 2 (spec §20): "Đề xuất thay đổi" is a STATIC
 * FORM at v0.1 — no submission backend. Family Space likewise has no capability, so
 * this surface states that once, in plain language, and offers nothing fake.
 * No fake membership, no fake roles, no fake content.
 */

import { el } from './dom.js';
import { PageHeader } from './components.js';
import { StatePanel, STATE } from './states.js';

export function renderSpacesPage(content, context) {
  content.appendChild(PageHeader({
    eyebrow: 'Không gian của gia tộc',
    title: 'Không gian gia đình',
    subtitle: 'Nơi gia đình cùng làm việc: ghi chép, ký ức, tư liệu và những trao đổi riêng của từng nhóm.'
  }));

  content.appendChild(el('div', { id: 'zone-spaces-status' }, [
    StatePanel({
      state: STATE.NOT_AVAILABLE,
      title: 'Không gian đang được xây dựng',
      explanation: 'Chưa có không gian gia đình nào được mở. '
                  + 'Khi có, mỗi không gian sẽ nằm ở đây, và bạn sẽ thấy những không gian mà mình tham gia.'
    })
  ]));

  return content;
}