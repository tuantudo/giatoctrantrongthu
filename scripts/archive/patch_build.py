import sys

def patch_file(filepath):
    with open(filepath, 'r') as f:
        content = f.read()

    # 1. Add med_clara_008
    med_007_block = '''    "med_clara_007": {
        "id": "med_clara_007",
        "src": "assets/images/mach/thu-gui-clara/007.png",
        "rawSrc": "assets/images/mach/thu-gui-clara/007.png",
        "type": "editorial",
        "dimensions": {"width": 1200, "height": 800, "aspectRatio": "3/2"},
        "alt": "Bìa Thư gửi Clara — Số 07: Thể Diện, Sĩ Diện & Tự Do",
        "caption": "",
        "provenance": "Ảnh minh họa chuỗi Thư gửi Clara",
        "responsive": {
            "thumb": "assets/images/mach/thu-gui-clara/007.png",
            "medium": "assets/images/mach/thu-gui-clara/007.png",
            "large": "assets/images/mach/thu-gui-clara/007.png"
        }
    }'''
    
    med_008_block = med_007_block + ''',
    "med_clara_008": {
        "id": "med_clara_008",
        "src": "assets/images/mach/thu-gui-clara/008.jpg",
        "rawSrc": "assets/images/mach/thu-gui-clara/008.jpg",
        "type": "editorial",
        "dimensions": {"width": 1200, "height": 1200, "aspectRatio": "1/1"},
        "alt": "Bìa Thư gửi Clara — Số 08: Ý Nghĩa & Di Sản",
        "caption": "",
        "provenance": "Ảnh minh họa chuỗi Thư gửi Clara",
        "responsive": {
            "thumb": "assets/images/mach/thu-gui-clara/008.jpg",
            "medium": "assets/images/mach/thu-gui-clara/008.jpg",
            "large": "assets/images/mach/thu-gui-clara/008.jpg"
        }
    }'''
    
    if '"med_clara_008"' not in content:
        content = content.replace(med_007_block, med_008_block)

    # 2. Add art_clara_008
    art_007_block = '''    {
        "id": "art_clara_007",
        "file": "Thư gửi Clara, Rina, Tina, Tin và Tito - 007.md",
        "slug": "clara-007",
        "order": 7,
        "title": "Thư gửi Clara — Số 07: Thể Diện, Sĩ Diện & Tự Do",
        "shortTitle": "Thư 07: Thể diện, sĩ diện & tự do",
        "subtitle": "Thể diện, sĩ diện, cái nhìn của người đời và sự tự do nội tâm trước cuộc đời rộng lớn.",
        "deckLead": "Thể diện, sĩ diện, ánh nhìn của người đời và sự tự do nội tâm đích thực trước cuộc đời rộng lớn.",
        "section": "Thư từ",
        "authorId": "tuan",
        "articleType": "letter",
        "editorialVoice": "personal",
        "presentationVariant": "letter",
        "heroMediaId": "med_clara_007",
        "date": "03/09/2026",
        "topics": ["thu-tu", "gia-phong", "the-he"],
        "relatedPeople": ["@I170@"]
    }'''
    
    art_008_block = art_007_block + ''',
    {
        "id": "art_clara_008",
        "file": "Thư gửi Clara - 008.md",
        "slug": "clara-008",
        "order": 8,
        "title": "Thư gửi Clara — Số 08: Entropy và Di Sản",
        "shortTitle": "Thư 08: Entropy & Di sản",
        "subtitle": "Ký ức nhạt nhoà theo định luật entropy và hành trình hệ thống hoá thành di sản.",
        "deckLead": "Ký ức của những người đi trước rồi sẽ nhạt nhoà theo định luật entropy, nếu không được gọi tên và hệ thống hoá.",
        "section": "Thư từ",
        "authorId": "tuan",
        "articleType": "letter",
        "editorialVoice": "personal",
        "presentationVariant": "letter",
        "heroMediaId": "med_clara_008",
        "date": "15/09/2026",
        "topics": ["thu-tu", "ky-uc", "the-he"],
        "relatedPeople": ["@I170@"]
    }'''

    if '"art_clara_008"' not in content:
        content = content.replace(art_007_block, art_008_block)
        
    # 3. Add to WIKILINK_MAP
    wiki_007_block = '    "Thư gửi Clara, Rina, Tina, Tin và Tito - 007": "clara-007"'
    wiki_008_block = wiki_007_block + ',\n    "Thư gửi Clara - 008": "clara-008"'
    if '"Thư gửi Clara - 008"' not in content:
        content = content.replace(wiki_007_block, wiki_008_block)

    with open(filepath, 'w') as f:
        f.write(content)
        
    print("Patched successfully")

if __name__ == "__main__":
    patch_file("scripts/build_mach.py")
