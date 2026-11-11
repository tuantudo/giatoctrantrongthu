#!/usr/bin/env python3
"""
RESEARCH EPUB COMPILER
Dự Án MẠCH & Tủ Sách Khảo Cứu Dòng Họ Trần Trọng Thu
Biên dịch công trình nghiên cứu xã hội học của GS. Baek Yong-Hun (ĐH Dankook, Hàn Quốc) thành định dạng EPUB3 chuẩn mực.
"""

import os
import re
import subprocess
from pathlib import Path

BASE_DIR = Path(__file__).parent.resolve()
OUTPUT_EPUB = BASE_DIR / "Su_Bien_Doi_Von_Xa_Hoi_O_Viet_Nam_WVS_2025.epub"
COVER_IMAGE = BASE_DIR / "cover.png"
CSS_FILE = BASE_DIR / "epub.css"
METADATA_FILE = BASE_DIR / "metadata.yaml"

METADATA_YAML = """---
title: "Sự Biến Đổi Vốn Xã Hội ở Việt Nam: Tăng Cường Giá Trị Gia Đình và Lòng Tin Nội Nhóm"
subtitle: "Khảo sát so sánh Hà Nội và TP.HCM qua WVS đợt 5 (2006) và đợt 7 (2020)"
author:
  - "GS. Baek Yong-Hun (백용훈 - Bạch Dũng Huân) - ĐH Dankook, Hàn Quốc"
contributor:
  - "Tủ Sách Khảo Cứu Dòng Họ & Dự Án MẠCH (Biên dịch và Chú giải)"
publisher: "Dự án MẠCH & Tủ Sách Khảo Cứu Dòng Họ"
date: "2025"
language: "vi"
rights: "© 2025 Viện Nghiên Cứu Đông Á - Đại học Dankook (동아연구소). Bản dịch học thuật tiếng Việt."
description: "Công trình nghiên cứu xã hội học định lượng về sự biến đổi của vốn xã hội, mạng lưới xã hội và lòng tin nội nhóm gia đình tại Việt Nam trong 15 năm (2006 - 2020)."
toc-title: "Mục Lục Tác Phẩm"
...
"""

FILES = [
    BASE_DIR / "README.md",
    BASE_DIR / "01_DAT_VAN_DE_VA_CO_SO_LY_THUYET.md",
    BASE_DIR / "02_DU_LIEU_BIEN_SO_VA_PHUONG_PHAP.md",
    BASE_DIR / "03_KET_QUA_PHAN_TICH_THUC_NGHIEM.md",
    BASE_DIR / "04_THAO_LUAN_GIA_DINH_VA_THE_CHE_HOA.md",
    BASE_DIR / "05_KET_LUAN_HAM_Y_VA_TAI_LIEU_THAM_KHAO.md",
]


def build():
    # 1. Write metadata
    with open(METADATA_FILE, "w", encoding="utf-8") as f:
        f.write(METADATA_YAML)

    # 2. Combine Markdown
    combined_md = BASE_DIR / "book_combined.md"
    with open(combined_md, "w", encoding="utf-8") as out_f:
        for file_path in FILES:
            with open(file_path, "r", encoding="utf-8") as in_f:
                content = in_f.read()
                # Strip YAML frontmatter
                if content.startswith("---"):
                    parts = content.split("---", 2)
                    if len(parts) >= 3:
                        content = parts[2].strip()

                # Clean internal file:// links
                content = re.sub(
                    r"\[([^\]]+)\]\(file:///[^\)]+\)", r"\1", content
                )
                out_f.write(content + "\n\n")

    # 3. Call Pandoc
    cmd = [
        "pandoc",
        str(METADATA_FILE),
        str(combined_md),
        "-o",
        str(OUTPUT_EPUB),
        f"--epub-cover-image={str(COVER_IMAGE)}",
        f"--css={str(CSS_FILE)}",
        "--toc",
        "--toc-depth=2",
        "--split-level=1",
        "--epub-chapter-level=1",
    ]

    print("Đang biên dịch EPUB bằng Pandoc...")
    res = subprocess.run(cmd, capture_output=True, text=True)
    if res.returncode == 0:
        print(f"✓ Biên dịch thành công: {OUTPUT_EPUB}")
        print(f"✓ Kích thước: {os.path.getsize(OUTPUT_EPUB):,} bytes")
    else:
        print("✗ Lỗi biên dịch Pandoc:", res.stderr)


if __name__ == "__main__":
    build()
