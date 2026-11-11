/**
 * GIATOC UI vNEXT — public-home.js
 * CR-HOME-01 INTEGRATION: COMPACT ANCESTRAL HOMEPAGE
 *
 * Implements the executive directive for CR-HOME-01:
 * - Audience: Descendants and family members first, respectful public second.
 * - Voice: Dignified ancestral call & living continuation; not an academic research prospectus.
 * - Visuals: 100% genuine archival assets (no stock, no AI).
 * - Structure:
 *   Section 01: HERO — Năm Thế Hệ Tiếp Nối. Một Cội Nguồn Chung.
 *   Section 02: CỘI NGUỒN — Những Người Đặt Nền Móng (Cụ Thu & Cụ Bà Út).
 *   Section 03: DÒNG CHẢY GIA TỘC — Năm Thế Hệ Nối Dòng (5 generations, 223 members, 68 families, 185 media).
 *   Section 04: KHÔNG GIAN GIA TỘC — Những Cánh Cửa Trở Về (3 gateways to member spaces).
 *   Section 05: FOOTER / LƯU TRUYỀN — Minimal colophon, archival principles & MẠCH links.
 */

import { el } from './dom.js';

export function renderPublicHome(content, context, assets = null) {
  content.innerHTML = ''; // Ensure clean container

  const wrapper = el('div', { class: 'gi-public-home gi-public-home--cr01', 'data-audience': 'descendants' });

  // =========================================================================
  // SECTION 01 — HERO (LỜI HIỆU TRIỆU)
  // =========================================================================
  const secHero = el('section', { class: 'gi-cr-hero', id: 'dinh-vi', 'aria-label': 'Lời hiệu triệu cội nguồn' }, [
    el('div', { class: 'gi-cr-hero-grid' }, [
      // Left text column
      el('div', { class: 'gi-cr-hero-text' }, [
        el('h1', {
          class: 'gi-cr-hero-headline',
          'data-editable-id': 'cr.hero.headline',
          html: 'NĂM THẾ HỆ TIẾP NỐI.<br>MỘT CỘI NGUỒN CHUNG.'
        }),
        el('p', {
          class: 'gi-cr-hero-subhead',
          'data-editable-id': 'cr.hero.subhead',
          text: 'Lịch sử của gia tộc vẫn đang được viết tiếp — bởi chính chúng ta.'
        }),
        el('p', {
          class: 'gi-cr-hero-copy',
          'data-editable-id': 'cr.hero.copy',
          text: 'Dù ở quê nhà hay nơi xa xứ, dù thuộc thế hệ nào hay nhánh họ nào, mỗi người con cháu đều có một nơi để tìm về. Nơi lưu giữ tên tuổi, ký ức và những mối dây thân thuộc làm nên gia tộc chúng ta.'
        }),
        el('div', { class: 'gi-cr-hero-actions' }, [
          el('a', {
            class: 'gi-btn gi-btn--primary gi-cr-hero-btn',
            href: '/login',
            text: 'BƯỚC VÀO KHÔNG GIAN GIA TỘC →'
          }),
          el('a', {
            class: 'gi-cr-hero-anchor',
            href: '#coi-nguon',
            text: 'Tìm về cội nguồn ↓'
          })
        ])
      ]),

      // Right visual column: Ảnh gia đình / Tiếp nối thế hệ (Tư liệu gốc)
      el('aside', { class: 'gi-cr-hero-visual', 'aria-label': 'Ảnh tư liệu gia đình và sự tiếp nối thế hệ' }, [
        el('div', { class: 'gi-cr-visual-frame' }, [
          el('img', {
            src: '/assets/images/mach/issue-01/Haudue-ongThu-baSa.jpg',
            alt: 'Ảnh tư liệu gia đình: Các thế hệ con cháu Cụ Giuse Trần Trọng Thu sum họp',
            class: 'gi-cr-visual-img'
          })
        ]),
        el('p', {
          class: 'gi-cr-visual-caption',
          text: 'Ảnh kỷ niệm: Các thế hệ con cháu hậu duệ Cụ Giuse Trần Trọng Thu sum họp'
        }),
        el('span', {
          class: 'gi-cr-visual-sub',
          text: 'Tư liệu Album gia tộc · Ký ức và sự trao truyền'
        })
      ])
    ])
  ]);
  wrapper.appendChild(secHero);

  // =========================================================================
  // SECTION 02 — CỘI NGUỒN (NHỮNG NGƯỜI ĐẶT NỀN MÓNG)
  // =========================================================================
  const secFoundations = el('section', { class: 'gi-cr-section', id: 'coi-nguon', 'aria-label': 'Cội nguồn tiền nhân' }, [
    el('header', { class: 'gi-cr-section-header' }, [
      el('h2', { class: 'gi-cr-section-title', text: 'Những Người Đặt Nền Móng' })
    ]),

    el('div', { class: 'gi-cr-ancestors-grid' }, [
      // Cụ Giuse Trần Trọng Thu
      el('article', { class: 'gi-cr-ancestor-card' }, [
        el('img', {
          src: '/assets/images/avatars/FS_AVATAR_G5X4-48S.jpg',
          alt: 'Cụ Giuse Trần Trọng Thu',
          class: 'gi-cr-ancestor-avatar'
        }),
        el('div', { class: 'gi-cr-ancestor-meta' }, [
          el('span', { class: 'gi-cr-ancestor-tag', text: 'Gốc phả hệ F0' }),
          el('h3', { class: 'gi-cr-ancestor-name', text: 'Cụ Giuse Trần Trọng Thu' }),
          el('p', { class: 'gi-cr-ancestor-years', text: '1872 – 1969' }),
          el('p', { class: 'gi-cr-ancestor-detail', text: 'Sinh quán và an táng tại Thanh Hóa.' })
        ])
      ]),

      // Cụ bà Nguyễn Thị Xuân (Út)
      el('article', { class: 'gi-cr-ancestor-card' }, [
        el('img', {
          src: '/assets/images/avatars/FS_AVATAR_G5X4-NQX.jpg',
          alt: 'Cụ bà Nguyễn Thị Xuân (Út)',
          class: 'gi-cr-ancestor-avatar'
        }),
        el('div', { class: 'gi-cr-ancestor-meta' }, [
          el('span', { class: 'gi-cr-ancestor-tag', text: 'Hôn phối chính thất' }),
          el('h3', { class: 'gi-cr-ancestor-name', text: 'Cụ bà Nguyễn Thị Xuân (Út)' }),
          el('p', { class: 'gi-cr-ancestor-years', text: '1888 – 1929' }),
          el('p', { class: 'gi-cr-ancestor-detail', text: 'Hôn phối chính thất của Cụ Giuse Trần Trọng Thu.' })
        ])
      ])
    ])
  ]);
  wrapper.appendChild(secFoundations);

  // =========================================================================
  // SECTION 03 — DÒNG CHẢY GIA TỘC (NĂM THẾ HỆ NỐI DÒNG)
  // =========================================================================
  const secFlow = el('section', { class: 'gi-cr-section', id: 'dong-chay', 'aria-label': 'Dòng chảy gia tộc' }, [
    el('header', { class: 'gi-cr-section-header' }, [
      el('h2', { class: 'gi-cr-section-title', text: 'Năm Thế Hệ Nối Dòng' })
    ]),
    el('p', {
      class: 'gi-cr-flow-lead',
      text: 'Từ đôi tiền nhân thuở ban đầu, gia tộc đã tiếp nối qua năm thế hệ, với những con người và ký ức được lưu giữ trong hồ sơ phả hệ.'
    }),

    // Bốn con số thực chứng (Compact Statistics)
    el('div', { class: 'gi-cr-stats-strip' }, [
      el('div', { class: 'gi-cr-stat-box' }, [
        el('div', { class: 'gi-cr-stat-val', text: '5' }),
        el('div', { class: 'gi-cr-stat-lbl', text: 'Thế hệ' }),
        el('div', { class: 'gi-cr-stat-sub', text: 'Từ 1872 đến nay' })
      ]),
      el('div', { class: 'gi-cr-stat-box' }, [
        el('div', { class: 'gi-cr-stat-val', text: '223' }),
        el('div', { class: 'gi-cr-stat-lbl', text: 'Thành viên ghi nhận' }),
        el('div', { class: 'gi-cr-stat-sub', text: 'Hồ sơ phả hệ chuẩn' })
      ]),
      el('div', { class: 'gi-cr-stat-box' }, [
        el('div', { class: 'gi-cr-stat-val', text: '68' }),
        el('div', { class: 'gi-cr-stat-lbl', text: 'Mái ấm gia đình' }),
        el('div', { class: 'gi-cr-stat-sub', text: 'Gắn kết qua các nhánh' })
      ]),
      el('div', { class: 'gi-cr-stat-box' }, [
        el('div', { class: 'gi-cr-stat-val', text: '185' }),
        el('div', { class: 'gi-cr-stat-lbl', text: 'Di ảnh & tư liệu' }),
        el('div', { class: 'gi-cr-stat-sub', text: 'Bảo tồn số hóa' })
      ])
    ]),

    // Dải chân dung đại diện cho các thế hệ tiền nhân đã qua đời (bảo vệ quyền riêng tư người sống)
    el('div', { class: 'gi-cr-ribbon' }, [
      el('p', { class: 'gi-cr-ribbon-desc', text: 'Sự trao truyền thế hệ: Ký ức và dấu tích của các bậc tiền nhân qua các giai đoạn lịch sử luôn được các thế hệ con cháu trân trọng gìn giữ.' }),
      el('div', { class: 'gi-cr-ribbon-avatars', title: 'Tư liệu di ảnh các bậc tiền bối qua các thế hệ' }, [
        el('img', { src: '/assets/images/avatars/FS_AVATAR_G5X4-48S.jpg', alt: 'F0 Cụ Thu', class: 'gi-cr-avatar' }),
        el('img', { src: '/assets/images/avatars/FS_AVATAR_G5X4-ZNG.jpg', alt: 'F1 An-tôn Thư', class: 'gi-cr-avatar' }),
        el('img', { src: '/assets/images/avatars/FS_AVATAR_G5XX-2HY.jpg', alt: 'Tiền bối Micae Thìn', class: 'gi-cr-avatar' }),
        el('img', { src: '/assets/images/avatars/FS_AVATAR_G5XX-KTZ.jpg', alt: 'Tiền bối Phaolo Hữu', class: 'gi-cr-avatar' }),
        el('img', { src: '/assets/images/avatars/FS_AVATAR_G5XX-XTR.jpg', alt: 'Tiền bối Giuse Trường', class: 'gi-cr-avatar' })
      ])
    ])
  ]);
  wrapper.appendChild(secFlow);

  // =========================================================================
  // SECTION 04 — KHÔNG GIAN GIA TỘC (NHỮNG CÁNH CỬA TRỞ VỀ)
  // =========================================================================
  const secDoors = el('section', { class: 'gi-cr-section', id: 'khong-gian', 'aria-label': 'Những cánh cửa trở về' }, [
    el('header', { class: 'gi-cr-section-header' }, [
      el('h2', { class: 'gi-cr-section-title', text: 'Những Cánh Cửa Trở Về' })
    ]),

    el('div', { class: 'gi-cr-doors-grid' }, [
      // 01. CỘI NGUỒN & QUAN HỆ
      el('a', { class: 'gi-cr-door-card', href: '/me/tree' }, [
        el('div', {}, [
          el('span', { class: 'gi-cr-door-num', text: '01. CỘI NGUỒN & QUAN HỆ' }),
          el('h3', { class: 'gi-cr-door-title', text: 'Cây Phả Đồ' }),
          el('p', { class: 'gi-cr-door-copy', text: 'Tra cứu cội nguồn và mối quan hệ giữa các thế hệ.' })
        ]),
        el('span', { class: 'gi-cr-door-cta', text: 'Mở Cây Phả Đồ →' })
      ]),

      // 02. TƯỞNG NIỆM & HIẾU KÍNH
      el('a', { class: 'gi-cr-door-card', href: '/me/events' }, [
        el('div', {}, [
          el('span', { class: 'gi-cr-door-num', text: '02. TƯỞNG NIỆM & HIẾU KÍNH' }),
          el('h3', { class: 'gi-cr-door-title', text: 'Lịch Giỗ & Niên Biểu' }),
          el('p', { class: 'gi-cr-door-copy', text: 'Gìn giữ ngày tưởng niệm và những dấu mốc lịch sử của gia tộc.' })
        ]),
        el('span', { class: 'gi-cr-door-cta', text: 'Xem Niên Biểu →' })
      ]),

      // 03. TRAO TRUYỀN & ĐÓNG GÓP
      el('a', { class: 'gi-cr-door-card', href: '/me/gallery' }, [
        el('div', {}, [
          el('span', { class: 'gi-cr-door-num', text: '03. TRAO TRUYỀN & ĐÓNG GÓP' }),
          el('h3', { class: 'gi-cr-door-title', text: 'Kho Di Ảnh & Tư Liệu' }),
          el('p', { class: 'gi-cr-door-copy', text: 'Khám phá tư liệu và đóng góp những ký ức còn được lưu giữ.' })
        ]),
        el('span', { class: 'gi-cr-door-cta', text: 'Vào Kho Tư Liệu →' })
      ])
    ])
  ]);
  wrapper.appendChild(secDoors);

  // =========================================================================
  // SECTION 05 — FOOTER / LƯU TRUYỀN (THÔNG TIN NHẬN DIỆN & LIÊN KẾT CỐT LÕI)
  // =========================================================================
  const secFooter = el('footer', { class: 'gi-cr-footer', 'aria-label': 'Thông tin lưu truyền và liên kết cốt lõi' }, [
    el('div', { class: 'gi-cr-footer-grid' }, [
      el('div', { class: 'gi-cr-footer-brand' }, [
        el('h4', { class: 'gi-cr-footer-title', text: 'Gia Tộc Trần Trọng Thu' }),
        el('p', { class: 'gi-cr-footer-lead', text: 'Di sản gia đình được gìn giữ bằng sự thật lịch sử, lòng hiếu kính và sự gắn kết qua các thế hệ.' })
      ]),
      el('nav', { class: 'gi-cr-footer-col', 'aria-label': 'Lối vào phân hệ' }, [
        el('h5', { text: 'Liên kết' }),
        el('a', { href: '/me', text: 'Không gian Gia tộc' }),
        el('a', { href: '/me/tree', text: 'Cây Phả Đồ' }),
        el('a', { href: '/me/events', text: 'Lịch Giỗ & Niên Biểu' }),
        el('a', { href: '/me/gallery', text: 'Kho Tư Liệu' })
      ]),
      el('nav', { class: 'gi-cr-footer-col', 'aria-label': 'Ấn phẩm và bảo tồn' }, [
        el('h5', { text: 'Ấn phẩm & Bảo tồn' }),
        el('a', { href: '/me/mach', text: 'Chuyên san MẠCH' }),
        el('span', { class: 'gi-cr-footer-tag-pending', text: 'Nguyên tắc bảo tồn (Đang biên soạn)' })
      ]),
      el('nav', { class: 'gi-cr-footer-col gi-cr-footer-col--social', 'aria-label': 'Mạng xã hội và cộng đồng' }, [
        el('h5', { text: 'Mạng xã hội' }),
        el('a', {
          href: 'https://www.facebook.com/share/g/1J2P3jtGTV/',
          target: '_blank',
          rel: 'noopener noreferrer',
          class: 'gi-cr-footer-social-link',
          title: 'Nhóm Facebook Cộng đồng Gia tộc Trần Trọng Thu (Mở tab mới)'
        }, [
          el('svg', {
            viewBox: '0 0 24 24',
            width: '16',
            height: '16',
            fill: 'currentColor',
            style: { flexShrink: '0' }
          }, [
            el('path', {
              d: 'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z'
            })
          ]),
          el('span', { text: 'Cộng đồng Gia tộc Trần Trọng Thu ↗' })
        ])
      ])
    ]),
    el('div', { class: 'gi-cr-footer-bottom' }, [
      el('div', { text: '© 2026 Gia Tộc Trần Trọng Thu. Bảo tồn và lưu truyền qua các thế hệ.' }),
      el('div', { text: 'Cội nguồn Thanh Hóa · Phát triển bền vững' })
    ])
  ]);
  wrapper.appendChild(secFooter);

  content.appendChild(wrapper);
  return content;
}
