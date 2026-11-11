#!/usr/bin/env python3
"""
generate_fs_baseline_xd.py
Creates assets/XD/FamilySearch_Baseline_01.xd containing:
- 8 Complete Artboards (Desktop 1440, Tablet 768, Mobile 390, plus Dropdown and Drawer states)
- Reusable components (Header, Dropdown, Search Card, Section Blocks, Buttons)
- Prototype interactions in interactions.json connecting buttons to dropdowns and drawers
"""

import os
import json
import uuid
import zipfile
import shutil

OUTPUT_XD = "assets/XD/FamilySearch_Baseline_01.xd"
TEMP_DIR = "/tmp/xd_fs_baseline_build"

if os.path.exists(TEMP_DIR):
    shutil.rmtree(TEMP_DIR)
os.makedirs(TEMP_DIR, exist_ok=True)

def new_id():
    return str(uuid.uuid4())

def rgb_color(r, g, b, a=1.0):
    return {
        "mode": "RGB",
        "value": {"r": r, "g": g, "b": b},
        "alpha": a
    }

def make_rect(name, x, y, w, h, fill_rgb, stroke_rgb=None, stroke_width=1, r=0, obj_id=None):
    node_id = obj_id or new_id()
    style = {
        "fill": {
            "type": "solid",
            "color": rgb_color(*fill_rgb)
        }
    }
    if stroke_rgb:
        style["stroke"] = {
            "type": "solid",
            "color": rgb_color(*stroke_rgb),
            "width": stroke_width,
            "align": "inside"
        }
    shape_data = {
        "type": "rect",
        "x": 0,
        "y": 0,
        "width": w,
        "height": h
    }
    if r > 0:
        shape_data["r"] = [r, r, r, r]

    return {
        "type": "shape",
        "name": name,
        "id": node_id,
        "transform": {"a": 1, "b": 0, "c": 0, "d": 1, "tx": x, "ty": y},
        "style": style,
        "shape": shape_data
    }

def make_text(name, x, y, raw_text, font_size=14, font_weight="Regular", font_family="System", fill_rgb=(32,33,33), align="left", obj_id=None):
    node_id = obj_id or new_id()
    return {
        "type": "text",
        "name": name,
        "id": node_id,
        "transform": {"a": 1, "b": 0, "c": 0, "d": 1, "tx": x, "ty": y},
        "style": {
            "fill": {
                "type": "solid",
                "color": rgb_color(*fill_rgb)
            },
            "font": {
                "family": font_family,
                "style": font_weight,
                "size": font_size
            },
            "textAttributes": {
                "paragraphAlign": align
            }
        },
        "text": {
            "frame": {"type": "positioned"},
            "rawText": raw_text,
            "paragraphs": [
                {
                    "lines": [
                        [{"x": 0, "y": 0, "from": 0, "to": len(raw_text)}]
                    ]
                }
            ]
        }
    }

def make_group(name, children, x=0, y=0, obj_id=None):
    return {
        "type": "group",
        "name": name,
        "id": obj_id or new_id(),
        "transform": {"a": 1, "b": 0, "c": 0, "d": 1, "tx": x, "ty": y},
        "group": {
            "children": children
        }
    }

# Track elements that trigger prototype interactions
INTERACTION_MAP = {}

def add_interaction(source_id, target_artboard_id, trigger="tap", transition="dissolve", duration=0.25):
    if source_id not in INTERACTION_MAP:
        INTERACTION_MAP[source_id] = []
    INTERACTION_MAP[source_id].append({
        "triggerEvent": trigger,
        "action": "go-to-artboard",
        "id": new_id(),
        "properties": {
            "transition": transition,
            "duration": duration,
            "destination": target_artboard_id
        }
    })

# Define the 8 Artboards
ARTBOARDS = []

# IDs for artboards so they can link to each other
ID_DESKTOP_HOME = new_id()
ID_DESKTOP_TREE_DD = new_id()
ID_DESKTOP_SEARCH_DD = new_id()
ID_DESKTOP_MEMORIES_DD = new_id()
ID_TABLET_HOME = new_id()
ID_TABLET_MENU = new_id()
ID_MOBILE_HOME = new_id()
ID_MOBILE_MENU = new_id()

# IDs for interactive buttons
BTN_TREE_ID = new_id()
BTN_SEARCH_ID = new_id()
BTN_MEMORIES_ID = new_id()
BTN_TABLET_HAMBURGER_ID = new_id()
BTN_TABLET_CLOSE_ID = new_id()
BTN_MOBILE_HAMBURGER_ID = new_id()
BTN_MOBILE_CLOSE_ID = new_id()
BTN_LOGO_ID = new_id()

add_interaction(BTN_TREE_ID, ID_DESKTOP_TREE_DD)
add_interaction(BTN_SEARCH_ID, ID_DESKTOP_SEARCH_DD)
add_interaction(BTN_MEMORIES_ID, ID_DESKTOP_MEMORIES_DD)
add_interaction(BTN_TABLET_HAMBURGER_ID, ID_TABLET_MENU, transition="slide-left")
add_interaction(BTN_TABLET_CLOSE_ID, ID_TABLET_HOME, transition="slide-right")
add_interaction(BTN_MOBILE_HAMBURGER_ID, ID_MOBILE_MENU, transition="slide-left")
add_interaction(BTN_MOBILE_CLOSE_ID, ID_MOBILE_HOME, transition="slide-right")

# --- ARTBOARD 1: DESKTOP HOMEPAGE (1440 x 4650) ---
def build_desktop_homepage():
    children = []
    # 1. Header (60px)
    children.append(make_rect("Header Bg", 0, 0, 1440, 60, (254, 254, 254)))
    children.append(make_rect("Header Border", 0, 59, 1440, 1, (229, 231, 235)))
    children.append(make_text("Logo FamilySearch", 24, 38, "FamilySearch", 22, "Bold", fill_rgb=(133, 185, 64), obj_id=BTN_LOGO_ID))
    
    # Nav items
    children.append(make_text("Nav Family Tree", 210, 36, "Family Tree", 14, "Regular", fill_rgb=(32, 33, 33), obj_id=BTN_TREE_ID))
    children.append(make_text("Nav Search", 320, 36, "Search", 14, "Regular", fill_rgb=(32, 33, 33), obj_id=BTN_SEARCH_ID))
    children.append(make_text("Nav Memories", 400, 36, "Memories", 14, "Regular", fill_rgb=(32, 33, 33), obj_id=BTN_MEMORIES_ID))
    children.append(make_text("Nav Get Involved", 495, 36, "Get Involved", 14, "Regular", fill_rgb=(32, 33, 33)))
    children.append(make_text("Nav Activities", 610, 36, "Activities", 14, "Regular", fill_rgb=(32, 33, 33)))
    
    # Right utility items
    children.append(make_text("Locations", 1070, 36, "Locations", 14, "Regular", fill_rgb=(74, 85, 104)))
    children.append(make_text("Language", 1160, 36, "🌐", 16, "Regular", fill_rgb=(74, 85, 104)))
    children.append(make_text("Help", 1200, 36, "❓ Help", 14, "Regular", fill_rgb=(74, 85, 104)))
    children.append(make_rect("Btn Sign Up", 1265, 12, 75, 36, (255, 255, 255), stroke_rgb=(203, 213, 225), r=4))
    children.append(make_text("Text Sign Up", 1278, 35, "Sign Up", 13, "Bold", fill_rgb=(32, 33, 33)))
    children.append(make_rect("Btn Sign In", 1350, 12, 70, 36, (133, 185, 64), r=4))
    children.append(make_text("Text Sign In", 1362, 35, "Sign In", 13, "Bold", fill_rgb=(255, 255, 255)))

    # 2. Hero Section (600px)
    children.append(make_rect("Hero Bg", 0, 60, 1440, 600, (248, 250, 252)))
    children.append(make_text("Hero H1", 100, 240, "Find your family. Discover yourself.", 44, "Bold", fill_rgb=(32, 33, 33)))
    children.append(make_text("Hero Lead", 100, 300, "Bring to life your family’s history by exploring the lives of those that came before you.", 18, "Regular", fill_rgb=(74, 85, 104)))
    children.append(make_rect("Hero CTA Btn", 100, 350, 160, 48, (0, 85, 43), r=24))
    children.append(make_text("Hero CTA Text", 132, 380, "GET STARTED", 14, "Bold", fill_rgb=(255, 255, 255)))
    children.append(make_rect("Hero Image Frame", 800, 140, 540, 440, (226, 232, 240), stroke_rgb=(203, 213, 225), r=12))
    children.append(make_text("Hero Img Caption", 940, 360, "[ Family Collage & Generations Photo ]", 16, "Regular", fill_rgb=(100, 116, 139)))

    # 3. Cultural Campaign: Honor Their Memory (628px)
    y_sec2 = 660
    children.append(make_rect("Sec2 Bg", 0, y_sec2, 1440, 628, (255, 255, 255)))
    children.append(make_rect("Sec2 Image Frame", 100, y_sec2 + 90, 540, 440, (237, 242, 247), stroke_rgb=(226, 232, 240), r=12))
    children.append(make_text("Sec2 Img Label", 220, y_sec2 + 310, "[ Honor Their Memory Illustration ]", 16, "Regular", fill_rgb=(100, 116, 139)))
    children.append(make_text("Sec2 Tag", 720, y_sec2 + 180, "HERITAGE & TRADITION", 12, "Bold", fill_rgb=(5, 112, 145)))
    children.append(make_text("Sec2 H2", 720, y_sec2 + 230, "Honor Their Memory", 36, "Bold", fill_rgb=(32, 33, 33)))
    children.append(make_text("Sec2 Lead", 720, y_sec2 + 280, "Honor Their Memory is a celebration that unites history and cultural heritage,", 16, "Regular", fill_rgb=(74, 85, 104)))
    children.append(make_text("Sec2 Lead2", 720, y_sec2 + 306, "inspiring you to explore your family tree and keep alive the stories of those who deserve to be remembered.", 16, "Regular", fill_rgb=(74, 85, 104)))
    children.append(make_rect("Sec2 CTA Btn", 720, y_sec2 + 360, 180, 46, (5, 112, 145), r=23))
    children.append(make_text("Sec2 CTA Text", 755, y_sec2 + 389, "DISCOVER MORE", 14, "Bold", fill_rgb=(255, 255, 255)))

    # 4. Fast Ancestor Search Widget (510px)
    y_sec3 = 1288
    children.append(make_rect("Sec3 Bg", 0, y_sec3, 1440, 510, (248, 250, 252)))
    children.append(make_text("Sec3 H2", 440, y_sec3 + 70, "Start discovering your family story", 32, "Bold", fill_rgb=(32, 33, 33)))
    children.append(make_text("Sec3 Lead", 360, y_sec3 + 110, "Search billions of ancestor profiles, photographs, and historical documents at once—absolutely FREE.", 16, "Regular", fill_rgb=(74, 85, 104)))
    
    # Search Card (900x260)
    children.append(make_rect("Search Card", 270, y_sec3 + 160, 900, 260, (255, 255, 255), stroke_rgb=(226, 232, 240), stroke_width=1, r=8))
    # Inputs row 1
    children.append(make_rect("Input First Name", 300, y_sec3 + 190, 400, 48, (255, 255, 255), stroke_rgb=(203, 213, 225), r=4))
    children.append(make_text("Placeholder First", 316, y_sec3 + 220, "Ancestor's First and Middle Names", 14, "Regular", fill_rgb=(148, 163, 184)))
    children.append(make_rect("Input Last Name", 730, y_sec3 + 190, 400, 48, (255, 255, 255), stroke_rgb=(203, 213, 225), r=4))
    children.append(make_text("Placeholder Last", 746, y_sec3 + 220, "Ancestor's Last or Maiden Names *", 14, "Regular", fill_rgb=(148, 163, 184)))
    # Inputs row 2
    children.append(make_rect("Input Place", 300, y_sec3 + 260, 400, 48, (255, 255, 255), stroke_rgb=(203, 213, 225), r=4))
    children.append(make_text("Placeholder Place", 316, y_sec3 + 290, "Place Lived", 14, "Regular", fill_rgb=(148, 163, 184)))
    children.append(make_rect("Input Year", 730, y_sec3 + 260, 260, 48, (255, 255, 255), stroke_rgb=(203, 213, 225), r=4))
    children.append(make_text("Placeholder Year", 746, y_sec3 + 290, "Birth Year", 14, "Regular", fill_rgb=(148, 163, 184)))
    children.append(make_rect("Calc Btn", 1005, y_sec3 + 260, 125, 48, (241, 245, 249), stroke_rgb=(203, 213, 225), r=4))
    children.append(make_text("Calc Text", 1025, y_sec3 + 290, "📅 Calc Year", 13, "Regular", fill_rgb=(74, 85, 104)))
    # Action button
    children.append(make_rect("Search Action Btn", 630, y_sec3 + 340, 180, 48, (0, 85, 43), r=24))
    children.append(make_text("Search Action Text", 690, y_sec3 + 370, "SEARCH", 14, "Bold", fill_rgb=(255, 255, 255)))

    # 5. Historical Records Showcase (574px, Teal)
    y_sec4 = 1798
    children.append(make_rect("Sec4 Bg", 0, y_sec4, 1440, 574, (5, 112, 145)))
    children.append(make_text("Sec4 H2", 100, y_sec4 + 190, "Discover your family’s story through historical records.", 36, "Bold", fill_rgb=(255, 255, 255)))
    children.append(make_text("Sec4 Lead", 100, y_sec4 + 250, "With our collection of billions of records, you can piece together your ancestors’ history and bring their stories to life.", 18, "Regular", fill_rgb=(224, 242, 254)))
    children.append(make_rect("Sec4 CTA Btn", 100, y_sec4 + 310, 200, 48, (255, 255, 255), r=24))
    children.append(make_text("Sec4 CTA Text", 130, y_sec4 + 340, "START SEARCHING", 14, "Bold", fill_rgb=(5, 112, 145)))
    children.append(make_rect("Sec4 Image Frame", 800, y_sec4 + 100, 540, 380, (3, 84, 109), r=12))
    children.append(make_text("Sec4 Img Caption", 920, y_sec4 + 300, "[ Historical Census & Parish Books ]", 16, "Regular", fill_rgb=(186, 230, 253)))

    # 6. World's Shared Tree (650px)
    y_sec5 = 2372
    children.append(make_rect("Sec5 Bg", 0, y_sec5, 1440, 650, (255, 255, 255)))
    children.append(make_rect("Sec5 Image Frame", 100, y_sec5 + 110, 540, 420, (241, 245, 249), stroke_rgb=(226, 232, 240), r=12))
    children.append(make_text("Sec5 Img Caption", 230, y_sec5 + 330, "[ Interactive Pedigree Tree Diagram ]", 16, "Regular", fill_rgb=(100, 116, 139)))
    children.append(make_text("Sec5 H2", 720, y_sec5 + 220, "Find your family in the world’s largest shared family tree.", 34, "Bold", fill_rgb=(32, 33, 33)))
    children.append(make_text("Sec5 Lead", 720, y_sec5 + 280, "We have over a billion unique profiles in our tree, and growing. See what others have contributed.", 17, "Regular", fill_rgb=(74, 85, 104)))
    children.append(make_rect("Sec5 CTA Btn", 720, y_sec5 + 340, 270, 48, (0, 85, 43), r=24))
    children.append(make_text("Sec5 CTA Text", 745, y_sec5 + 370, "GET STARTED WITH YOUR TREE", 14, "Bold", fill_rgb=(255, 255, 255)))

    # 7. Nonprofit & Free (650px)
    y_sec6 = 3022
    children.append(make_rect("Sec6 Bg", 0, y_sec6, 1440, 650, (248, 250, 252)))
    children.append(make_text("Sec6 H2", 100, y_sec6 + 230, "Nonprofit and free.", 36, "Bold", fill_rgb=(32, 33, 33)))
    children.append(make_text("Sec6 Lead", 100, y_sec6 + 280, "FamilySearch is an international, nonprofit organization dedicated to helping all people discover their family story.", 18, "Regular", fill_rgb=(74, 85, 104)))
    children.append(make_rect("Sec6 CTA 1", 100, y_sec6 + 350, 220, 48, (255, 255, 255), stroke_rgb=(32, 33, 33), r=24))
    children.append(make_text("Sec6 Text 1", 125, y_sec6 + 380, "ABOUT FAMILYSEARCH", 13, "Bold", fill_rgb=(32, 33, 33)))
    children.append(make_rect("Sec6 CTA 2", 340, y_sec6 + 350, 130, 48, (133, 185, 64), r=24))
    children.append(make_text("Sec6 Text 2", 375, y_sec6 + 380, "DONATE", 14, "Bold", fill_rgb=(255, 255, 255)))
    children.append(make_rect("Sec6 Image Frame", 800, y_sec6 + 110, 540, 420, (226, 232, 240), stroke_rgb=(203, 213, 225), r=12))
    children.append(make_text("Sec6 Img Caption", 930, y_sec6 + 330, "[ Family Community & Volunteer Photo ]", 16, "Regular", fill_rgb=(100, 116, 139)))

    # 8. Guidance Network (508px)
    y_sec7 = 3672
    children.append(make_rect("Sec7 Bg", 0, y_sec7, 1440, 508, (255, 255, 255)))
    children.append(make_text("Sec7 H2", 480, y_sec7 + 80, "Find a guide, in person or online", 32, "Bold", fill_rgb=(32, 33, 33)))
    children.append(make_text("Sec7 Lead", 420, y_sec7 + 120, "We provide free guidance and resources to help you make more family history discoveries.", 16, "Regular", fill_rgb=(74, 85, 104)))
    
    # 3 Guidance Cards
    # Col 1
    children.append(make_rect("Card 1", 100, y_sec7 + 170, 380, 220, (255, 255, 255), stroke_rgb=(226, 232, 240), r=8))
    children.append(make_text("Card 1 H3", 130, y_sec7 + 220, "Get local family history help", 18, "Bold", fill_rgb=(32, 33, 33)))
    children.append(make_text("Card 1 Desc", 130, y_sec7 + 260, "Free, in-person guidance at any one of over 5,000 FamilySearch centers.", 14, "Regular", fill_rgb=(74, 85, 104)))
    children.append(make_text("Card 1 Link", 130, y_sec7 + 340, "Find one near you →", 14, "Bold", fill_rgb=(5, 112, 145)))
    # Col 2
    children.append(make_rect("Card 2", 530, y_sec7 + 170, 380, 220, (255, 255, 255), stroke_rgb=(226, 232, 240), r=8))
    children.append(make_text("Card 2 H3", 560, y_sec7 + 220, "Get answers in the Community", 18, "Bold", fill_rgb=(32, 33, 33)))
    children.append(make_text("Card 2 Desc", 560, y_sec7 + 260, "Online help is available anytime from other FamilySearch users.", 14, "Regular", fill_rgb=(74, 85, 104)))
    children.append(make_text("Card 2 Link", 560, y_sec7 + 340, "Visit the Community →", 14, "Bold", fill_rgb=(5, 112, 145)))
    # Col 3
    children.append(make_rect("Card 3", 960, y_sec7 + 170, 380, 220, (255, 255, 255), stroke_rgb=(226, 232, 240), r=8))
    children.append(make_text("Card 3 H3", 990, y_sec7 + 220, "Explore FamilySearch Library", 18, "Bold", fill_rgb=(32, 33, 33)))
    children.append(make_text("Card 3 Desc", 990, y_sec7 + 260, "Free access to the resources of the world's leading family history library in Salt Lake City.", 14, "Regular", fill_rgb=(74, 85, 104)))
    children.append(make_text("Card 3 Link", 990, y_sec7 + 340, "Learn More →", 14, "Bold", fill_rgb=(5, 112, 145)))

    # 9. Final Signup Section (450px, Forest Green)
    y_sec8 = 4180
    children.append(make_rect("Sec8 Bg", 0, y_sec8, 1440, 450, (0, 85, 43)))
    children.append(make_text("Sec8 H2", 460, y_sec8 + 180, "Sign up, and discover your place.", 36, "Bold", fill_rgb=(255, 255, 255)))
    children.append(make_rect("Sec8 CTA", 580, y_sec8 + 240, 280, 52, (255, 255, 255), r=26))
    children.append(make_text("Sec8 CTA Text", 610, y_sec8 + 272, "CREATE A FREE ACCOUNT", 15, "Bold", fill_rgb=(0, 85, 43)))
    children.append(make_text("Sec8 Link", 600, y_sec8 + 330, "Already have an account? Sign In", 15, "Regular", fill_rgb=(224, 242, 254)))

    # 10. Footer (300px, Dark Slate)
    y_foot = 4630
    children.append(make_rect("Foot Bg", 0, y_foot, 1440, 300, (26, 32, 44)))
    children.append(make_text("Foot Col 1", 100, y_foot + 60, "About FamilySearch · Volunteer · Blog · Locations · Press Room", 14, "Regular", fill_rgb=(160, 174, 192)))
    children.append(make_text("Foot Col 2", 100, y_foot + 100, "Terms of Use | Privacy Notice | Cookie Preferences | Site Map", 13, "Regular", fill_rgb=(113, 128, 150)))
    children.append(make_text("Foot Copy", 100, y_foot + 160, "© 2026 by Intellectual Reserve, Inc. All rights reserved. A service provided by The Church of Jesus Christ of Latter-day Saints", 12, "Regular", fill_rgb=(113, 128, 150)))

    return {
        "id": ID_DESKTOP_HOME,
        "name": "Desktop - 1440 - Homepage Default",
        "bounds": {"x": 0, "y": 0, "width": 1440, "height": 4930},
        "viewport": {"height": 900},
        "children": children
    }

# Helper to create Desktop Dropdown Artboards
def build_desktop_dropdown_artboard(artboard_id, name, active_tab_name, active_tab_x, active_tab_w, items, offset_x):
    children = []
    # Header
    children.append(make_rect("Header Bg", 0, 0, 1440, 60, (254, 254, 254)))
    children.append(make_rect("Header Border", 0, 59, 1440, 1, (229, 231, 235)))
    children.append(make_text("Logo FamilySearch", 24, 38, "FamilySearch", 22, "Bold", fill_rgb=(133, 185, 64)))
    
    # Active tab indicator
    children.append(make_rect("Active Underline", active_tab_x, 56, active_tab_w, 4, (133, 185, 64)))
    
    # Nav items
    children.append(make_text("Nav Family Tree", 210, 36, "Family Tree", 14, "Bold" if active_tab_name == "Family Tree" else "Regular", fill_rgb=(133, 185, 64) if active_tab_name == "Family Tree" else (32, 33, 33)))
    children.append(make_text("Nav Search", 320, 36, "Search", 14, "Bold" if active_tab_name == "Search" else "Regular", fill_rgb=(133, 185, 64) if active_tab_name == "Search" else (32, 33, 33)))
    children.append(make_text("Nav Memories", 400, 36, "Memories", 14, "Bold" if active_tab_name == "Memories" else "Regular", fill_rgb=(133, 185, 64) if active_tab_name == "Memories" else (32, 33, 33)))
    children.append(make_text("Nav Get Involved", 495, 36, "Get Involved", 14, "Regular", fill_rgb=(32, 33, 33)))
    children.append(make_text("Nav Activities", 610, 36, "Activities", 14, "Regular", fill_rgb=(32, 33, 33)))
    
    # Backdrop overlay to close dropdown
    backdrop_id = new_id()
    children.append(make_rect("Dismiss Backdrop", 0, 60, 1440, 840, (0, 0, 0, 0.15), obj_id=backdrop_id))
    add_interaction(backdrop_id, ID_DESKTOP_HOME)
    
    # Dropdown Card
    dd_w = 230
    dd_h = len(items) * 44 + 20
    children.append(make_rect("Dropdown Card", active_tab_x - 10, 60, dd_w, dd_h, (255, 255, 255), stroke_rgb=(226, 232, 240), r=6))
    for i, it in enumerate(items):
        item_y = 60 + 15 + i * 44
        children.append(make_rect(f"Item Hover {i}", active_tab_x - 5, item_y - 10, dd_w - 10, 38, (248, 250, 252) if i == 0 else (255, 255, 255), r=4))
        children.append(make_text(f"Item {i}", active_tab_x + 15, item_y + 14, it, 14, "Bold" if i == 0 else "Regular", fill_rgb=(32, 33, 33)))

    return {
        "id": artboard_id,
        "name": name,
        "bounds": {"x": offset_x, "y": 0, "width": 1440, "height": 900},
        "viewport": {"height": 900},
        "children": children
    }

# --- ARTBOARD 5: TABLET HOMEPAGE (768 x 4800) ---
def build_tablet_homepage():
    children = []
    # Header (60px)
    children.append(make_rect("Tab Header Bg", 0, 0, 768, 60, (254, 254, 254)))
    children.append(make_rect("Tab Header Border", 0, 59, 768, 1, (229, 231, 235)))
    children.append(make_text("Tab Logo", 20, 38, "FamilySearch", 20, "Bold", fill_rgb=(133, 185, 64)))
    children.append(make_text("Tab Lang", 630, 36, "🌐", 16, "Regular", fill_rgb=(74, 85, 104)))
    children.append(make_text("Tab Help", 670, 36, "❓", 16, "Regular", fill_rgb=(74, 85, 104)))
    # Hamburger button
    children.append(make_rect("Tab Hamburger Box", 710, 12, 40, 36, (241, 245, 249), r=4, obj_id=BTN_TABLET_HAMBURGER_ID))
    children.append(make_text("Tab Hamburger Icon", 722, 36, "☰", 18, "Bold", fill_rgb=(32, 33, 33)))

    # Hero Section
    children.append(make_rect("Tab Hero Bg", 0, 60, 768, 560, (248, 250, 252)))
    children.append(make_text("Tab Hero H1", 40, 180, "Find your family. Discover yourself.", 34, "Bold", fill_rgb=(32, 33, 33)))
    children.append(make_text("Tab Hero Lead", 40, 230, "Bring to life your family’s history by exploring the lives of those that came before you.", 16, "Regular", fill_rgb=(74, 85, 104)))
    children.append(make_rect("Tab Hero CTA", 40, 280, 160, 48, (0, 85, 43), r=24))
    children.append(make_text("Tab Hero CTA Text", 72, 310, "GET STARTED", 14, "Bold", fill_rgb=(255, 255, 255)))
    children.append(make_rect("Tab Hero Img", 40, 360, 688, 220, (226, 232, 240), r=8))
    children.append(make_text("Tab Hero Img Cap", 240, 480, "[ Family Collage Graphic (Tablet Layout) ]", 15, "Regular", fill_rgb=(100, 116, 139)))

    # Search Card on Tablet (stacked form)
    y_tab_search = 640
    children.append(make_rect("Tab Search Bg", 0, y_tab_search, 768, 540, (255, 255, 255)))
    children.append(make_text("Tab Search H2", 160, y_tab_search + 60, "Start discovering your family story", 28, "Bold", fill_rgb=(32, 33, 33)))
    children.append(make_rect("Tab Search Card", 40, y_tab_search + 110, 688, 380, (248, 250, 252), stroke_rgb=(226, 232, 240), r=8))
    children.append(make_rect("Tab Inp 1", 70, y_tab_search + 140, 628, 48, (255, 255, 255), stroke_rgb=(203, 213, 225), r=4))
    children.append(make_text("Tab Plh 1", 86, y_tab_search + 170, "Ancestor's First and Middle Names", 14, "Regular", fill_rgb=(148, 163, 184)))
    children.append(make_rect("Tab Inp 2", 70, y_tab_search + 205, 628, 48, (255, 255, 255), stroke_rgb=(203, 213, 225), r=4))
    children.append(make_text("Tab Plh 2", 86, y_tab_search + 235, "Ancestor's Last or Maiden Names *", 14, "Regular", fill_rgb=(148, 163, 184)))
    children.append(make_rect("Tab Inp 3", 70, y_tab_search + 270, 628, 48, (255, 255, 255), stroke_rgb=(203, 213, 225), r=4))
    children.append(make_text("Tab Plh 3", 86, y_tab_search + 300, "Place Lived", 14, "Regular", fill_rgb=(148, 163, 184)))
    children.append(make_rect("Tab Action Btn", 260, y_tab_search + 410, 248, 48, (0, 85, 43), r=24))
    children.append(make_text("Tab Action Text", 350, y_tab_search + 440, "SEARCH", 14, "Bold", fill_rgb=(255, 255, 255)))

    return {
        "id": ID_TABLET_HOME,
        "name": "Tablet - 768 - Homepage",
        "bounds": {"x": 0, "y": 5100, "width": 768, "height": 4800},
        "viewport": {"height": 1024},
        "children": children
    }

# --- ARTBOARD 6: TABLET MENU OPEN (768 x 1024) ---
def build_tablet_menu():
    children = []
    # Backdrop
    children.append(make_rect("Dim Backdrop", 0, 0, 768, 1024, (0, 0, 0, 0.4)))
    # Drawer (width 360)
    children.append(make_rect("Drawer Bg", 408, 0, 360, 1024, (255, 255, 255)))
    children.append(make_text("Drawer Title", 440, 42, "Menu", 20, "Bold", fill_rgb=(32, 33, 33)))
    children.append(make_text("Close Btn", 720, 42, "✕", 20, "Bold", fill_rgb=(100, 116, 139), obj_id=BTN_TABLET_CLOSE_ID))
    
    menu_items = ["Family Tree", "Search", "Memories", "Get Involved", "Activities", "Locations", "Help and Learning"]
    for i, item in enumerate(menu_items):
        y = 100 + i * 54
        children.append(make_rect(f"Menu Border {i}", 440, y + 40, 300, 1, (241, 245, 249)))
        children.append(make_text(f"Menu Item {i}", 440, y + 26, item, 16, "Regular", fill_rgb=(32, 33, 33)))
        children.append(make_text(f"Menu Arrow {i}", 710, y + 26, "›", 18, "Regular", fill_rgb=(148, 163, 184)))

    children.append(make_rect("Drawer Sign Up", 440, 560, 296, 46, (255, 255, 255), stroke_rgb=(203, 213, 225), r=4))
    children.append(make_text("Drawer Sign Up Text", 550, 589, "SIGN UP", 14, "Bold", fill_rgb=(32, 33, 33)))
    children.append(make_rect("Drawer Sign In", 440, 620, 296, 46, (133, 185, 64), r=4))
    children.append(make_text("Drawer Sign In Text", 555, 649, "SIGN IN", 14, "Bold", fill_rgb=(255, 255, 255)))

    return {
        "id": ID_TABLET_MENU,
        "name": "Tablet - 768 - Mobile Menu Open",
        "bounds": {"x": 950, "y": 5100, "width": 768, "height": 1024},
        "viewport": {"height": 1024},
        "children": children
    }

# --- ARTBOARD 7: MOBILE HOMEPAGE (390 x 5200) ---
def build_mobile_homepage():
    children = []
    # Mobile Header (60px)
    children.append(make_rect("Mob Header Bg", 0, 0, 390, 60, (254, 254, 254)))
    children.append(make_rect("Mob Header Border", 0, 59, 390, 1, (229, 231, 235)))
    children.append(make_text("Mob Logo", 16, 38, "FamilySearch", 18, "Bold", fill_rgb=(133, 185, 64)))
    children.append(make_text("Mob Lang", 280, 36, "🌐", 16, "Regular", fill_rgb=(74, 85, 104)))
    children.append(make_text("Mob Help", 315, 36, "❓", 16, "Regular", fill_rgb=(74, 85, 104)))
    # Mobile Hamburger
    children.append(make_rect("Mob Hamburger Box", 346, 12, 36, 36, (241, 245, 249), r=4, obj_id=BTN_MOBILE_HAMBURGER_ID))
    children.append(make_text("Mob Hamburger Icon", 356, 36, "☰", 18, "Bold", fill_rgb=(32, 33, 33)))

    # Hero Section Mobile (full width 354px content)
    children.append(make_rect("Mob Hero Bg", 0, 60, 390, 520, (248, 250, 252)))
    children.append(make_text("Mob Hero H1", 18, 140, "Find your family.", 28, "Bold", fill_rgb=(32, 33, 33)))
    children.append(make_text("Mob Hero H1 sub", 18, 175, "Discover yourself.", 28, "Bold", fill_rgb=(32, 33, 33)))
    children.append(make_text("Mob Hero Lead", 18, 220, "Bring to life your family’s history by exploring", 15, "Regular", fill_rgb=(74, 85, 104)))
    children.append(make_text("Mob Hero Lead 2", 18, 242, "the lives of those that came before you.", 15, "Regular", fill_rgb=(74, 85, 104)))
    children.append(make_rect("Mob Hero CTA", 18, 280, 354, 48, (0, 85, 43), r=24))
    children.append(make_text("Mob Hero CTA Text", 135, 310, "GET STARTED", 14, "Bold", fill_rgb=(255, 255, 255)))
    children.append(make_rect("Mob Hero Img", 18, 350, 354, 200, (226, 232, 240), r=8))
    children.append(make_text("Mob Hero Img Cap", 80, 460, "[ Mobile Family Photo ]", 14, "Regular", fill_rgb=(100, 116, 139)))

    # Mobile Ancestor Search (Full-width stacked inputs 354px)
    y_mob_search = 600
    children.append(make_rect("Mob Search Bg", 0, y_mob_search, 390, 600, (255, 255, 255)))
    children.append(make_text("Mob Search H2", 18, y_mob_search + 50, "Start discovering your family story", 22, "Bold", fill_rgb=(32, 33, 33)))
    children.append(make_rect("Mob Inp 1", 18, y_mob_search + 100, 354, 48, (255, 255, 255), stroke_rgb=(203, 213, 225), r=4))
    children.append(make_text("Mob Plh 1", 30, y_mob_search + 130, "First Names", 14, "Regular", fill_rgb=(148, 163, 184)))
    children.append(make_rect("Mob Inp 2", 18, y_mob_search + 160, 354, 48, (255, 255, 255), stroke_rgb=(203, 213, 225), r=4))
    children.append(make_text("Mob Plh 2", 30, y_mob_search + 190, "Last Names *", 14, "Regular", fill_rgb=(148, 163, 184)))
    children.append(make_rect("Mob Inp 3", 18, y_mob_search + 220, 354, 48, (255, 255, 255), stroke_rgb=(203, 213, 225), r=4))
    children.append(make_text("Mob Plh 3", 30, y_mob_search + 250, "Place Lived", 14, "Regular", fill_rgb=(148, 163, 184)))
    children.append(make_rect("Mob Inp 4", 18, y_mob_search + 280, 354, 48, (255, 255, 255), stroke_rgb=(203, 213, 225), r=4))
    children.append(make_text("Mob Plh 4", 30, y_mob_search + 310, "Birth Year", 14, "Regular", fill_rgb=(148, 163, 184)))
    children.append(make_rect("Mob Action Btn", 18, y_mob_search + 350, 354, 48, (0, 85, 43), r=24))
    children.append(make_text("Mob Action Text", 155, y_mob_search + 380, "SEARCH", 14, "Bold", fill_rgb=(255, 255, 255)))

    return {
        "id": ID_MOBILE_HOME,
        "name": "Mobile - 390 - Homepage",
        "bounds": {"x": 0, "y": 10100, "width": 390, "height": 5200},
        "viewport": {"height": 844},
        "children": children
    }

# --- ARTBOARD 8: MOBILE MENU OPEN (390 x 844) ---
def build_mobile_menu():
    children = []
    # Fullscreen Mobile Menu Drawer
    children.append(make_rect("Mob Drawer Bg", 0, 0, 390, 844, (255, 255, 255)))
    children.append(make_text("Mob Drawer Title", 24, 42, "Menu", 20, "Bold", fill_rgb=(32, 33, 33)))
    children.append(make_text("Mob Close Btn", 345, 42, "✕", 20, "Bold", fill_rgb=(100, 116, 139), obj_id=BTN_MOBILE_CLOSE_ID))
    
    menu_items = ["Family Tree", "Search", "Memories", "Get Involved", "Activities", "Locations", "Help and Learning"]
    for i, item in enumerate(menu_items):
        y = 90 + i * 52
        children.append(make_rect(f"Mob Menu Border {i}", 24, y + 38, 342, 1, (241, 245, 249)))
        children.append(make_text(f"Mob Menu Item {i}", 24, y + 25, item, 16, "Regular", fill_rgb=(32, 33, 33)))
        children.append(make_text(f"Mob Menu Arrow {i}", 350, y + 25, "›", 18, "Regular", fill_rgb=(148, 163, 184)))

    children.append(make_rect("Mob Drawer Sign Up", 24, 520, 342, 48, (255, 255, 255), stroke_rgb=(203, 213, 225), r=4))
    children.append(make_text("Mob Drawer Sign Up Text", 160, 550, "SIGN UP", 14, "Bold", fill_rgb=(32, 33, 33)))
    children.append(make_rect("Mob Drawer Sign In", 24, 580, 342, 48, (133, 185, 64), r=4))
    children.append(make_text("Mob Drawer Sign In Text", 165, 610, "SIGN IN", 14, "Bold", fill_rgb=(255, 255, 255)))

    return {
        "id": ID_MOBILE_MENU,
        "name": "Mobile - 390 - Mobile Menu Open",
        "bounds": {"x": 550, "y": 10100, "width": 390, "height": 844},
        "viewport": {"height": 844},
        "children": children
    }

# Assemble all 8 Artboards
ARTBOARDS.append(build_desktop_homepage())
ARTBOARDS.append(build_desktop_dropdown_artboard(
    ID_DESKTOP_TREE_DD,
    "Desktop - 1440 - Nav Dropdown (Family Tree)",
    "Family Tree", 210, 80,
    ["Overview", "Tree", "Person", "Find", "Following", "Person List", "My Contributions"],
    1600
))
ARTBOARDS.append(build_desktop_dropdown_artboard(
    ID_DESKTOP_SEARCH_DD,
    "Desktop - 1440 - Nav Dropdown (Search)",
    "Search", 320, 50,
    ["Records", "Images", "Family Tree", "Genealogies", "Catalog", "Books", "Research Wiki"],
    3200
))
ARTBOARDS.append(build_desktop_dropdown_artboard(
    ID_DESKTOP_MEMORIES_DD,
    "Desktop - 1440 - Nav Dropdown (Memories)",
    "Memories", 400, 70,
    ["Overview", "Gallery", "People", "Find"],
    4800
))
ARTBOARDS.append(build_tablet_homepage())
ARTBOARDS.append(build_tablet_menu())
ARTBOARDS.append(build_mobile_homepage())
ARTBOARDS.append(build_mobile_menu())

# Write files inside TEMP_DIR
# 1. mimetype (MUST be exactly application/vnd.adobe.sparkler.project+dcxucf)
with open(os.path.join(TEMP_DIR, "mimetype"), "w") as f:
    f.write("application/vnd.adobe.sparkler.project+dcxucf")

# 2. META-INF/metadata.xml
os.makedirs(os.path.join(TEMP_DIR, "META-INF"), exist_ok=True)
with open(os.path.join(TEMP_DIR, "META-INF", "metadata.xml"), "w") as f:
    f.write("""<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<x:xmpmeta xmlns:x="adobe:ns:meta/" x:xmptk="Adobe XMP Core 5.6-c140 79.160451, 2017/05/06-01:08:21        ">
  <rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#">
    <rdf:Description rdf:about="" xmlns:xmp="http://ns.adobe.com/xap/1.0/">
      <xmp:CreatorTool>Adobe XD 56.0</xmp:CreatorTool>
    </rdf:Description>
  </rdf:RDF>
</x:xmpmeta>""")

# 3. Create artboard directories and graphicContent.agc
artwork_children = [
    {
        "id": new_id(),
        "name": "pasteboard",
        "path": "pasteboard"
    }
]

os.makedirs(os.path.join(TEMP_DIR, "artwork", "pasteboard", "graphics"), exist_ok=True)
with open(os.path.join(TEMP_DIR, "artwork", "pasteboard", "graphics", "graphicContent.agc"), "w") as f:
    json.dump({
        "version": "2.4.0",
        "children": [],
        "resources": {"href": "/resources/graphics/graphicContent.agc"},
        "artboards": {"href": "/resources/graphics/graphicContent.agc"}
    }, f)

for ab in ARTBOARDS:
    artboard_folder = f"artboard-{ab['id']}"
    folder_path = os.path.join(TEMP_DIR, "artwork", artboard_folder, "graphics")
    os.makedirs(folder_path, exist_ok=True)
    
    # Write graphicContent.agc
    content = {
        "version": "2.4.0",
        "children": [
            {
                "id": ab["id"],
                "type": "artboard",
                "name": ab["name"],
                "artboard": {
                    "children": ab["children"],
                    "ref": ab["id"]
                }
            }
        ],
        "resources": {"href": "/resources/graphics/graphicContent.agc"},
        "artboards": {"href": "/resources/graphics/graphicContent.agc"}
    }
    with open(os.path.join(folder_path, "graphicContent.agc"), "w") as f:
        json.dump(content, f)

    child_manifest = {
        "id": ab["id"],
        "name": ab["name"],
        "path": artboard_folder,
        "uxdesign#bounds": ab["bounds"]
    }
    if "viewport" in ab:
        child_manifest["uxdesign#viewport"] = ab["viewport"]
    artwork_children.append(child_manifest)

# 4. resources/graphics/graphicContent.agc
os.makedirs(os.path.join(TEMP_DIR, "resources", "graphics"), exist_ok=True)
with open(os.path.join(TEMP_DIR, "resources", "graphics", "graphicContent.agc"), "w") as f:
    json.dump({
        "version": "2.4.0",
        "children": [],
        "resources": {
            "meta": {"ux": {"symbols": []}}
        },
        "artboards": {}
    }, f)

# 5. interactions/interactions.json
os.makedirs(os.path.join(TEMP_DIR, "interactions"), exist_ok=True)
with open(os.path.join(TEMP_DIR, "interactions", "interactions.json"), "w") as f:
    json.dump({
        "version": "2.4.0",
        "interactions": INTERACTION_MAP
    }, f, indent=2)

# 6. manifest
manifest = {
    "name": "FamilySearch_Baseline_01",
    "id": new_id(),
    "manifest-format-version": 1,
    "components": [],
    "children": [
        {
            "id": new_id(),
            "name": "artwork",
            "path": "artwork",
            "children": artwork_children
        },
        {
            "id": new_id(),
            "name": "resources",
            "path": "resources",
            "children": [
                {
                    "id": new_id(),
                    "name": "graphics",
                    "path": "graphics"
                }
            ]
        },
        {
            "id": new_id(),
            "name": "interactions",
            "path": "interactions",
            "children": []
        }
    ]
}
with open(os.path.join(TEMP_DIR, "manifest"), "w") as f:
    json.dump(manifest, f, indent=2)

# 7. Package into XD file with uncompressed mimetype first (UCF spec)
os.makedirs(os.path.dirname(OUTPUT_XD), exist_ok=True)
if os.path.exists(OUTPUT_XD):
    os.remove(OUTPUT_XD)

with zipfile.ZipFile(OUTPUT_XD, "w") as z:
    # 1. mimetype: MUST be first entry and stored (not compressed)
    mimetype_path = os.path.join(TEMP_DIR, "mimetype")
    z.write(mimetype_path, "mimetype", compress_type=zipfile.ZIP_STORED)
    
    # 2. Write all other files with DEFLATE compression
    for root, dirs, files in os.walk(TEMP_DIR):
        for file in files:
            full_path = os.path.join(root, file)
            rel_path = os.path.relpath(full_path, TEMP_DIR)
            if rel_path == "mimetype":
                continue
            z.write(full_path, rel_path, compress_type=zipfile.ZIP_DEFLATED)

print(f"Successfully generated {OUTPUT_XD} with {len(ARTBOARDS)} Artboards and {len(INTERACTION_MAP)} Interactive Prototyping links.")

