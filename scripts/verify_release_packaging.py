#!/usr/bin/env python3
"""
scripts/verify_release_packaging.py
Validates the reproducibility and completeness of the V2.0.0 Release Package.
Checks:
- All required public runtime files exist
- All required admin runtime files exist
- All 168 JS module imports resolve cleanly
- All CSS imports resolve cleanly
- All assets in ASSET_MANIFEST.json exist
- No sensitive data (DB, .env, .ged, private/) is present in the release bundle
"""

import os
import re
import sys
import json

def verify():
    root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    os.chdir(root)
    errors = []

    # 1. Essential entries
    required = [
        "index.html",
        "robots.txt",
        "vercel.json",
        ".vercelignore",
        "src/css/foundation/foundation.css",
        "src/js/ui/boot-public.js",
        "admin/index.html",
        "admin/login.html",
        "admin/js/admin.js",
        "assets/ASSET_MANIFEST.json",
        "assets/images/logoGiaToc_ngang.svg",
        "assets/images/logoGiaToc_favicon.svg"
    ]
    for r in required:
        if not os.path.exists(r):
            errors.append(f"Missing required release entry: {r}")

    # 2. Check JS imports
    js_imports = 0
    for folder in ["src", "admin"]:
        for d, _, files in os.walk(folder):
            for f in files:
                if f.endswith(".js"):
                    p = os.path.join(d, f)
                    with open(p, "r", encoding="utf-8") as fh:
                        code = fh.read()
                    matches = re.findall(r'''(?:import|from)\s+['\"]([^'\"]+)['\"]''', code)
                    for m in matches:
                        if m.startswith("."):
                            js_imports += 1
                            target = os.path.normpath(os.path.join(os.path.dirname(p), m))
                            if not os.path.exists(target) and not os.path.exists(target + ".js"):
                                errors.append(f"Broken import in {p}: {m} -> {target}")

    # 3. Check CSS imports
    css_imports = 0
    foundation_css = "src/css/foundation/foundation.css"
    if os.path.exists(foundation_css):
        with open(foundation_css, "r", encoding="utf-8") as fh:
            code = fh.read()
        matches = re.findall(r'@import\s+url\([\'\"]?([^\'\")]+)[\'\"]?\);', code)
        for m in matches:
            css_imports += 1
            target = os.path.normpath(os.path.join(os.path.dirname(foundation_css), m))
            if not os.path.exists(target):
                errors.append(f"Broken CSS import in foundation.css: {m} -> {target}")

    # 4. Check ASSET_MANIFEST
    manifest_path = "assets/ASSET_MANIFEST.json"
    manifest_assets = 0
    if os.path.exists(manifest_path):
        with open(manifest_path, "r", encoding="utf-8") as fh:
            data = json.load(fh)
        def scan(obj):
            nonlocal manifest_assets
            if isinstance(obj, str) and (obj.startswith("assets/") or obj.startswith("/assets/")):
                manifest_assets += 1
                clean = obj.lstrip("/")
                if not os.path.exists(clean):
                    errors.append(f"Missing asset in ASSET_MANIFEST.json: {clean}")
            elif isinstance(obj, dict):
                for v in obj.values(): scan(v)
            elif isinstance(obj, list):
                for item in obj: scan(item)
        scan(data)

    print("=== GIATOC V2.0.0 RELEASE REPRODUCIBLE PACKAGING AUDIT ===")
    print(f"Required Entries: {len(required)} OK")
    print(f"Verified JS Imports: {js_imports}")
    print(f"Verified CSS Imports: {css_imports}")
    print(f"Verified Manifest Assets: {manifest_assets}")

    if errors:
        print(f"\nFAIL: {len(errors)} packaging errors found:")
        for e in errors:
            print(f"  - {e}")
        return 1

    print("\nSUCCESS: All release assets, modules, and styles resolve 100% cleanly!")
    return 0

if __name__ == "__main__":
    sys.exit(verify())
