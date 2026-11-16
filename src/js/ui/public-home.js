/**
 * GIATOC UI vNEXT — public-home.js
 * HOMEPAGE V3: TÁI ĐỊNH VỊ NỘI DUNG VÀ TRẢI NGHIỆM TRANG CHỦ
 *
 * Triết lý định hướng (Human Intent & Editorial OS):
 * - Khởi phát từ một nỗ lực cá nhân: tìm kiếm và ghi lại ký ức gia đình.
 * - Không tự nhận đại diện cho toàn thể gia tộc, không áp đặt một góc nhìn duy nhất.
 * - Để lại một dấu vết chân thật cho thế hệ sau và mở ra không gian cho những tiếng nói khác.
 * - Không dùng ngôn ngữ khẩu hiệu, hô hào truyền thông hay hành chính.
 * - Hai phân vùng nội dung cấp cao: CÂY PHẢ HỆ & MẠCH.
 */

import { el } from './dom.js';

/**
 * IMG-01: Chưa tìm thấy di ảnh chân dung của Cụ Giuse Trần Trọng Thu và Cụ Bà Nguyễn Thị Xuân;
 * ảnh tư liệu trên hồ sơ là ảnh chụp bia mộ gia đình. Giữ chữ khắc danh xưng giản dị,
 * không biến thành huy hiệu trang trí hay logo thương hiệu.
 */
function HonorificCrest(givenName, fullName) {
  return el('div', {
    class: 'gi-cr-ancestor-crest',
    role: 'img',
    'aria-label': `${fullName} — chưa tìm thấy di ảnh chân dung`
  }, [
    el('span', { class: 'gi-cr-ancestor-crest__mark', 'aria-hidden': 'true', text: givenName.charAt(0) }),
    el('span', { class: 'gi-cr-ancestor-crest__name', 'aria-hidden': 'true', text: givenName })
  ]);
}

export function renderPublicHome(content, context, assets = null) {
  content.innerHTML = ''; // Đảm bảo container sạch sẽ trước khi mount

  const wrapper = el('div', { class: 'gi-public-home gi-public-home--cr01', 'data-audience': 'descendants' });

  // =========================================================================
  // SECTION 01 — HERO (MỘT NỖ LỰC CÁ NHÂN)
  // =========================================================================
  const secHero = el('section', { class: 'gi-cr-hero', id: 'dinh-vi', 'aria-label': 'Lời mở đầu về nỗ lực lưu giữ ký ức' }, [
    el('div', { class: 'gi-cr-hero-grid' }, [
      // Left text column: Văn bản tự sự biên tập (Documentary Editorial)
      el('div', { class: 'gi-cr-hero-text' }, [
        el('span', {
          class: 'gi-v3-hero-eyebrow',
          text: 'MỘT NỖ LỰC CÁ NHÂN: TÌM KIẾM VÀ GHI LẠI KÝ ỨC GIA ĐÌNH'
        }),
        el('h1', {
          class: 'gi-v3-hero-title',
          'data-editable-id': 'v3.hero.title'
        }, [
          el('span', { text: 'Từ những tấm ảnh cũ,' }),
          el('br'),
          el('span', { text: 'tôi lần tìm lại những câu chuyện gia đình.' })
        ]),
        el('div', { class: 'gi-v3-hero-prose' }, [
          el('p', {
            class: 'gi-v3-hero-para',
            text: 'Trang web này bắt đầu từ một nỗ lực rất cụ thể của tôi: tìm lại những tấm ảnh cũ, những trang giấy ghi chép và những câu chuyện gia đình còn sót lại. Tôi cố gắng kết nối những tư liệu còn lại thành những dấu vết rõ ràng, để mọi người trong gia đình khi cần có thể tra cứu và tìm lại.'
          }),
          el('p', {
            class: 'gi-v3-hero-para',
            text: 'Những tư liệu hiện có chắc chắn chưa đầy đủ, có chỗ còn thiếu sót hoặc chưa thật chính xác theo thời gian. Nhưng tôi không tạo ra nơi này để khôi phục một trật tự cũ hay nói thay cho tất cả mọi người.'
          }),
          el('p', {
            class: 'gi-v3-hero-para',
            text: 'Nơi này trước hết là chỗ lưu giữ những gì tôi đã tìm thấy, và luôn sẵn sàng tiếp nhận những ký ức, câu chuyện cùng những góc nhìn khác từ mọi người.'
          })
        ]),
        el('div', { class: 'gi-cr-hero-actions' }, [
          el('a', {
            class: 'gi-btn gi-btn--primary gi-cr-hero-btn',
            href: '/me/tree',
            text: 'Tra cứu Cây Phả Hệ →'
          }),
          el('a', {
            class: 'gi-btn gi-btn--secondary gi-cr-hero-btn',
            style: { background: 'transparent', color: 'var(--color-brand-heritage, #881337)', borderColor: 'var(--color-brand-heritage, #881337)' },
            href: '/me/mach',
            text: 'Đọc Chuyên San MẠCH →'
          }),
          el('a', {
            class: 'gi-cr-hero-anchor',
            href: '#hai-huong-tiep-can',
            text: 'Tìm hiểu hai hướng tiếp cận ↓'
          })
        ])
      ]),

      // Right visual column: Ảnh tư liệu gia đình sum họp xưa (Tư liệu gốc)
      el('aside', { class: 'gi-cr-hero-visual', 'aria-label': 'Ảnh tư liệu gia đình xưa' }, [
        el('div', { class: 'gi-cr-visual-frame' }, [
          el('img', {
            src: '/assets/images/mach/issue-01/Haudue-ongThu-baSa.jpg',
            alt: 'Ảnh tư liệu gia đình: Một buổi sum họp của các thế hệ con cháu',
            class: 'gi-cr-visual-img'
          })
        ]),
        el('p', {
          class: 'gi-cr-visual-caption',
          text: 'Một buổi sum họp gia đình, những năm tháng cũ. Ký ức bắt đầu từ những khoảnh khắc đời thường như thế này.'
        }),
        el('span', {
          class: 'gi-cr-visual-sub',
          text: 'Tư liệu Album gia đình · Dấu tích của sự tiếp nối'
        })
      ])
    ])
  ]);
  wrapper.appendChild(secHero);

  // =========================================================================
  // SECTION 02 — HAI CÁCH TIẾP CẬN DI SẢN (CÂY PHẢ HỆ & MẠCH)
  // =========================================================================
  const secPortals = el('section', { class: 'gi-cr-section gi-v2-portals-section', id: 'hai-huong-tiep-can', 'aria-label': 'Hai cách tiếp cận di sản gia đình' }, [
    el('header', { class: 'gi-cr-section-header' }, [
      el('h2', { class: 'gi-cr-section-title', text: 'Hai Cách Tiếp Cận Ký Ức Gia Đình' })
    ]),
    el('p', {
      class: 'gi-cr-flow-lead',
      text: 'Lịch sử của một gia đình có thể được nhìn qua hai lăng kính bổ trợ cho nhau: một bên là cấu trúc huyết thống và thế hệ; một bên là những câu chuyện và dấu vết của đời sống đời thường.'
    }),

    el('div', { class: 'gi-v2-portals-grid' }, [
      // 01. PHÂN VÙNG CÂY PHẢ HỆ
      el('article', { class: 'gi-v2-portal-card gi-v2-portal-card--genealogy', id: 'cay-pha-he' }, [
        el('div', {}, [
          el('span', { class: 'gi-v2-portal-badge', text: 'CẤU TRÚC & THẾ HỆ' }),
          el('h3', { class: 'gi-v2-portal-title', text: 'Cây Phả Hệ' }),
          el('p', { class: 'gi-v2-portal-lead', text: 'Những con người, thế hệ và mối quan hệ làm nên lịch sử gia đình.' }),
          el('p', { class: 'gi-v2-portal-desc', style: { fontSize: '13.5px', color: 'var(--color-text-secondary, #4a4a4a)', lineHeight: '1.6', marginBottom: '16px' }, text: 'Hệ thống hóa danh tính, ngày sinh, ngày mất, các mối liên kết huyết thống và hôn phối qua các thế hệ. Cung cấp phả đồ tương tác, niên biểu tưởng niệm và những bức di ảnh được gắn kết với từng nhân vật.' }),
          el('ul', { class: 'gi-v2-portal-features' }, [
            el('li', { class: 'gi-v2-portal-feature' }, [
              el('span', { class: 'gi-v2-portal-feature-icon', text: '•' }),
              el('span', { text: 'Phả đồ tương tác & hồ sơ cá nhân theo từng nhánh họ' })
            ]),
            el('li', { class: 'gi-v2-portal-feature' }, [
              el('span', { class: 'gi-v2-portal-feature-icon', text: '•' }),
              el('span', { text: 'Lịch giỗ truyền thống và các mốc thời gian tưởng niệm' })
            ]),
            el('li', { class: 'gi-v2-portal-feature' }, [
              el('span', { class: 'gi-v2-portal-feature-icon', text: '•' }),
              el('span', { text: 'Di ảnh và tư liệu lịch sử được bảo tồn gắn với nhân vật' })
            ])
          ])
        ]),
        el('a', { class: 'gi-v2-portal-cta', href: '/me/tree', text: 'Tra cứu Cây Phả Hệ →' })
      ]),

      // 02. PHÂN VÙNG MẠCH
      el('article', { class: 'gi-v2-portal-card gi-v2-portal-card--mach', id: 'chuyen-san-mach' }, [
        el('div', {}, [
          el('span', { class: 'gi-v2-portal-badge', text: 'KÝ ỨC & ĐỜI SỐNG' }),
          el('h3', { class: 'gi-v2-portal-title', text: 'Chuyên San MẠCH' }),
          el('p', { class: 'gi-v2-portal-lead', text: 'Những câu chuyện, hình ảnh, lá thư và dấu vết của đời sống gia đình.' }),
          el('p', { class: 'gi-v2-portal-desc', style: { fontSize: '13.5px', color: 'var(--color-text-secondary, #4a4a4a)', lineHeight: '1.6', marginBottom: '16px' }, text: 'Một không gian biên tập độc lập dành cho những câu chuyện đời sống, hồi ức gia đình và những khảo cứu từ cội nguồn Thanh Hóa đến xóm đạo Gia Kiệm và các phương trời xa xứ. Nơi tôn trọng sự chân thực, chấp nhận cả những khoảng khuyết thiếu và những cách nhớ khác nhau.' }),
          el('ul', { class: 'gi-v2-portal-features' }, [
            el('li', { class: 'gi-v2-portal-feature' }, [
              el('span', { class: 'gi-v2-portal-feature-icon', text: '•' }),
              el('span', { text: 'MẠCH Số 01: Dòng Chảy & Sự Tiếp Nối (12 bài viết khảo cứu & ký ức)' })
            ]),
            el('li', { class: 'gi-v2-portal-feature' }, [
              el('span', { class: 'gi-v2-portal-feature-icon', text: '•' }),
              el('span', { text: 'Thư từ, hồi ức và những lời tâm tình giữa các thế hệ' })
            ]),
            el('li', { class: 'gi-v2-portal-feature' }, [
              el('span', { class: 'gi-v2-portal-feature-icon', text: '•' }),
              el('span', { text: 'Tinh thần biên tập: Chân thực, không tô vẽ hay áp đặt' })
            ])
          ])
        ]),
        el('a', { class: 'gi-v2-portal-cta', href: '/me/mach', text: 'Đọc Chuyên San MẠCH →' })
      ])
    ])
  ]);
  wrapper.appendChild(secPortals);

  // =========================================================================
  // SECTION 03 — CỘI NGUỒN TIỀN NHÂN
  // =========================================================================
  const secFoundations = el('section', { class: 'gi-cr-section', id: 'coi-nguon', 'aria-label': 'Về cội nguồn tiền nhân' }, [
    el('header', { class: 'gi-cr-section-header' }, [
      el('h2', { class: 'gi-cr-section-title', text: 'Về Cội Nguồn Tiền Nhân' })
    ]),
    el('p', {
      class: 'gi-cr-flow-lead',
      text: 'Gốc phả hệ của gia đình bắt đầu từ Cụ Giuse Trần Trọng Thu và Cụ bà Nguyễn Thị Xuân tại Thanh Hóa. Những ghi chép hiện có được xây dựng dựa trên bia mộ gia đình và lời kể truyền khẩu của các bậc cao niên.'
    }),

    el('div', { class: 'gi-cr-ancestors-grid' }, [
      // Cụ Giuse Trần Trọng Thu
      el('article', { class: 'gi-cr-ancestor-card' }, [
        HonorificCrest('Thu', 'Cụ Giuse Trần Trọng Thu'),
        el('div', { class: 'gi-cr-ancestor-meta' }, [
          el('span', { class: 'gi-cr-ancestor-tag', text: 'Gốc phả hệ F0' }),
          el('h3', { class: 'gi-cr-ancestor-name', text: 'Cụ Giuse Trần Trọng Thu' }),
          el('p', { class: 'gi-cr-ancestor-years', text: '1872 – 1969' }),
          el('p', { class: 'gi-cr-ancestor-detail', text: 'Sinh quán và an táng tại Thanh Hóa. Hiện chưa tìm thấy di ảnh chân dung; tư liệu gốc duy nhất là ảnh chụp bia mộ gia đình.' })
        ])
      ]),

      // Cụ bà Nguyễn Thị Xuân (Út)
      el('article', { class: 'gi-cr-ancestor-card' }, [
        HonorificCrest('Xuân', 'Cụ bà Nguyễn Thị Xuân (Út)'),
        el('div', { class: 'gi-cr-ancestor-meta' }, [
          el('span', { class: 'gi-cr-ancestor-tag', text: 'Hôn phối chính thất' }),
          el('h3', { class: 'gi-cr-ancestor-name', text: 'Cụ bà Nguyễn Thị Xuân (Út)' }),
          el('p', { class: 'gi-cr-ancestor-years', text: '1888 – 1929' }),
          el('p', { class: 'gi-cr-ancestor-detail', text: 'Hôn phối của Cụ Giuse Trần Trọng Thu. Tư liệu về Cụ được ghi nhận qua bia mộ và ký ức truyền khẩu của con cháu.' })
        ])
      ])
    ])
  ]);
  wrapper.appendChild(secFoundations);

  // =========================================================================
  // SECTION 04 — DẤU VẾT ĐANG ĐƯỢC LƯU GIỮ
  // =========================================================================
  const secFlow = el('section', { class: 'gi-cr-section', id: 'dong-chay', 'aria-label': 'Dấu vết đang được lưu giữ' }, [
    el('header', { class: 'gi-cr-section-header' }, [
      el('h2', { class: 'gi-cr-section-title', text: 'Dấu Vết Đang Được Lưu Giữ' })
    ]),
    el('p', {
      class: 'gi-v3-stats-note',
      text: 'Những con số này phản ánh khối lượng dữ liệu bước đầu được thu thập từ các nguồn tư liệu hiện có, không phải bản kiểm kê hoàn tất của toàn thể dòng họ.'
    }),

    // Bốn con số ghi nhận (Archival Baseline)
    el('div', { class: 'gi-cr-stats-strip' }, [
      el('div', { class: 'gi-cr-stat-box' }, [
        el('div', { class: 'gi-cr-stat-val', text: '5' }),
        el('div', { class: 'gi-cr-stat-lbl', text: 'Thế hệ' }),
        el('div', { class: 'gi-cr-stat-sub', text: 'Từ 1872 đến nay' })
      ]),
      el('div', { class: 'gi-cr-stat-box' }, [
        el('div', { class: 'gi-cr-stat-val', text: '223' }),
        el('div', { class: 'gi-cr-stat-lbl', text: 'Thành viên ghi nhận' }),
        el('div', { class: 'gi-cr-stat-sub', text: 'Đã đối soát bước đầu' })
      ]),
      el('div', { class: 'gi-cr-stat-box' }, [
        el('div', { class: 'gi-cr-stat-val', text: '68' }),
        el('div', { class: 'gi-cr-stat-lbl', text: 'Mái ấm gia đình' }),
        el('div', { class: 'gi-cr-stat-sub', text: 'Qua các thế hệ & nhánh' })
      ]),
      el('div', { class: 'gi-cr-stat-box' }, [
        el('div', { class: 'gi-cr-stat-val', text: '185' }),
        el('div', { class: 'gi-cr-stat-lbl', text: 'Di ảnh & tư liệu' }),
        el('div', { class: 'gi-cr-stat-sub', text: 'Đã số hóa & gắn kết' })
      ])
    ]),

    // Dải chân dung các bậc tiền nhân đã khuất
    el('div', { class: 'gi-cr-ribbon' }, [
      el('p', { class: 'gi-cr-ribbon-desc', text: 'Di ảnh của các bậc tiền bối đã khuất được con cháu trân trọng gìn giữ lại qua các giai đoạn lịch sử khác nhau.' }),
      el('div', { class: 'gi-cr-ribbon-avatars', title: 'Tư liệu di ảnh các bậc tiền bối qua các thế hệ' }, [
        el('img', { src: '/assets/images/avatars/FS_AVATAR_G5X4-ZNG.jpg', alt: 'F1 An-tôn Thư', class: 'gi-cr-avatar' }),
        el('img', { src: '/assets/images/avatars/FS_AVATAR_G5XX-2HY.jpg', alt: 'Tiền bối Micae Thìn', class: 'gi-cr-avatar' }),
        el('img', { src: '/assets/images/avatars/FS_AVATAR_G5XX-KTZ.jpg', alt: 'Tiền bối Phaolo Hữu', class: 'gi-cr-avatar' }),
        el('img', { src: '/assets/images/avatars/FS_AVATAR_G5XX-XTR.jpg', alt: 'Tiền bối Giuse Trường', class: 'gi-cr-avatar' })
      ])
    ])
  ]);
  wrapper.appendChild(secFlow);

  // =========================================================================
  // SECTION 05 — KHÔNG GIAN ĐÓNG GÓP: NHỮNG KÝ ỨC KHÁC VẪN CÒN CHỖ Ở ĐÂY
  // =========================================================================
  const secOpenSpace = el('section', { class: 'gi-v3-open-section', id: 'dong-gop', 'aria-label': 'Không gian mở cho những ký ức khác' }, [
    el('div', { class: 'gi-v3-open-grid' }, [
      // Left text column: Tinh thần tiếp nhận ký ức mở (Open Memory Reflection)
      el('div', {}, [
        el('span', { class: 'gi-v3-hero-eyebrow', text: 'TIẾNG NÓI & KÝ ỨC BỔ SUNG' }),
        el('h2', { class: 'gi-cr-section-title', style: { marginBottom: '16px' }, text: 'Những Ký Ức Khác Vẫn Còn Chỗ Ở Đây' }),
        el('p', {
          class: 'gi-v3-open-lead',
          text: 'Những gì đang được lưu giữ ở đây chỉ là phần ký ức mà tôi có cơ hội tiếp cận. Có thể anh chị em, các gia đình và những nhánh khác còn lưu giữ những hình ảnh, tài liệu hoặc câu chuyện mà tôi chưa biết đến.'
        }),
        el('p', {
          class: 'gi-v3-open-lead',
          text: 'Nếu muốn chia sẻ, bổ sung hoặc đính chính, mọi người đều có thể gửi lại. Những đóng góp sẽ được tiếp nhận, đối chiếu và trao đổi trước khi được đưa vào hệ thống lưu trữ hoặc công bố.'
        }),
        el('p', {
          class: 'gi-v3-open-lead',
          style: { fontStyle: 'italic', marginBottom: 0, fontSize: '13.5px', color: 'var(--color-text-muted, #78716c)' },
          text: 'Việc gửi đóng góp nhằm giúp hoàn thiện bức tranh chung của gia đình. Các thông tin sẽ được xem xét và trao đổi kỹ lưỡng để đảm bảo tính xác thực trước khi cập nhật vào cơ sở dữ liệu.'
        })
      ]),

      // Right column: Ba kênh tham gia thực tế đang hoạt động
      el('div', { class: 'gi-v3-channels-list' }, [
        el('a', { class: 'gi-v3-channel-item', href: '/me/requests' }, [
          el('h4', { class: 'gi-v3-channel-title', text: 'Gửi Đề Xuất & Bổ Sung Tư Liệu →' }),
          el('p', { class: 'gi-v3-channel-desc', text: 'Dành cho thành viên đã có tài khoản: gửi thông tin, tài liệu, đề xuất bổ sung hoặc đính chính dữ liệu.' })
        ]),
        el('a', {
          class: 'gi-v3-channel-item',
          href: 'https://www.facebook.com/share/g/1J2P3jtGTV/',
          target: '_blank',
          rel: 'noopener noreferrer'
        }, [
          el('h4', { class: 'gi-v3-channel-title', text: 'Nhóm Trao Đổi Gia Đình ↗' }),
          el('p', { class: 'gi-v3-channel-desc', text: 'Không gian kết nối để chia sẻ ký ức, trao đổi hình ảnh, tin tức và thảo luận giữa các gia đình.' })
        ]),
        el('a', { class: 'gi-v3-channel-item', href: '/help' }, [
          el('h4', { class: 'gi-v3-channel-title', text: 'Trang Hướng Dẫn & Trợ Giúp →' }),
          el('p', { class: 'gi-v3-channel-desc', text: 'Hỗ trợ tài khoản thành viên, hướng dẫn tra cứu phả hệ và cách gửi thông tin đóng góp.' })
        ])
      ])
    ])
  ]);
  wrapper.appendChild(secOpenSpace);

  // =========================================================================
  // SECTION 06 — FOOTER / COLOPHON (LỜI KẾT & THÔNG TIN VẬN HÀNH)
  // =========================================================================
  const secFooter = el('footer', { class: 'gi-cr-footer', 'aria-label': 'Thông tin lưu truyền và liên kết hai phân vùng' }, [
    el('div', { class: 'gi-cr-footer-grid' }, [
      el('div', { class: 'gi-cr-footer-brand' }, [
        el('h4', { class: 'gi-cr-footer-title', text: 'Gia Tộc Trần Trọng Thu' }),
        el('p', { class: 'gi-cr-footer-lead', text: 'Một nỗ lực cá nhân nhằm lưu giữ ký ức gia đình. Trang web này không đại diện cho một tổ chức hành chính hay một tiếng nói duy nhất.' })
      ]),
      el('nav', { class: 'gi-cr-footer-col', 'aria-label': 'Phân vùng Cây Phả Hệ' }, [
        el('h5', { text: 'Cây Phả Hệ' }),
        el('a', { href: '/me/tree', text: 'Cây Phả Đồ Tương Tác' }),
        el('a', { href: '/me/events', text: 'Lịch Giỗ & Niên Biểu' }),
        el('a', { href: '/me/gallery', text: 'Kho Di Ảnh Gắn Kết' })
      ]),
      el('nav', { class: 'gi-cr-footer-col', 'aria-label': 'Phân vùng Chuyên San MẠCH' }, [
        el('h5', { text: 'Chuyên San MẠCH' }),
        el('a', { href: '/me/mach', text: 'MẠCH Số 01 (12 bài viết)' }),
        el('a', { href: '/me/letters', text: 'Thư Gửi Nhau' }),
        el('span', { class: 'gi-cr-footer-tag-pending', text: 'MẠCH Số 02 (Đang biên soạn)' })
      ]),
      el('nav', { class: 'gi-cr-footer-col gi-cr-footer-col--social', 'aria-label': 'Kết nối & Trợ giúp' }, [
        el('h5', { text: 'Kết Nối & Trợ Giúp' }),
        el('a', { href: '/me/requests', text: 'Đóng Góp & Yêu Cầu' }),
        el('a', { href: '/me/account', text: 'Tài Khoản Thành Viên' }),
        el('a', { href: '/help', text: 'Hướng Dẫn & Trợ Giúp' }),
        el('a', {
          href: 'https://www.facebook.com/share/g/1J2P3jtGTV/',
          target: '_blank',
          rel: 'noopener noreferrer',
          class: 'gi-cr-footer-social-link',
          title: 'Nhóm Facebook Trao đổi Gia đình (Mở tab mới)'
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
          el('span', { text: 'Cộng đồng Facebook ↗' })
        ])
      ])
    ]),
    el('div', { class: 'gi-cr-footer-bottom' }, [
      el('div', { text: '© 2026 Lưu trữ ký ức gia đình. Khởi xướng và duy trì từ sự tự nguyện.' }),
      el('div', { text: 'Cội nguồn Thanh Hóa · Dấu tích cho các thế hệ' })
    ])
  ]);
  wrapper.appendChild(secFooter);

  content.appendChild(wrapper);
  return content;
}
