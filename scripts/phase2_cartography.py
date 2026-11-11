import os
import json
import stat
from datetime import datetime
from collections import defaultdict

SCAN_DIRS = ['/volume1/TUAN_ATLAS', '/volume1/TUAN_FORGE', '/volume1/homes']
PREVIOUS_AUDIT = '/volume1/TUAN_FORGE/nas_audit_report.json'
OUT_DIR = '/volume1/TUAN_FORGE/03_AUDIT'

def safe_mkdir(path):
    if not os.path.exists(path):
        os.makedirs(path, exist_ok=True)

def step1_build_inventory():
    print("Step 1: Building Inventory...")
    hashes = {}
    if os.path.exists(PREVIOUS_AUDIT):
        with open(PREVIOUS_AUDIT, 'r') as f:
            try:
                old_data = json.load(f)
                for item in old_data.get('all_files', []):
                    hashes[item['path']] = item.get('hash')
            except:
                pass

    inventory = []
    
    for scan_dir in SCAN_DIRS:
        if not os.path.exists(scan_dir):
            continue
        for root, dirs, files in os.walk(scan_dir):
            if '@eaDir' in root or '#recycle' in root:
                continue
            depth = len(root.split(os.sep))
            for file in files:
                full_path = os.path.join(root, file)
                ext = os.path.splitext(file)[1].lower()
                try:
                    st = os.stat(full_path)
                    item = {
                        'absolute_path': full_path,
                        'filename': file,
                        'extension': ext,
                        'size': st.st_size,
                        'mtime': st.st_mtime,
                        'parent_directory': root,
                        'directory_depth': depth,
                        'hash': hashes.get(full_path, None)
                    }
                    inventory.append(item)
                except:
                    pass
                    
    with open(os.path.join(OUT_DIR, '01_DATA_INVENTORY.json'), 'w') as f:
        json.dump(inventory, f, ensure_ascii=False, indent=2)
    return inventory

def step2_parse_taxonomy(inventory):
    print("Step 2: Parsing Taxonomy...")
    tree = defaultdict(int)
    extensions = defaultdict(int)
    for item in inventory:
        parts = item['parent_directory'].split(os.sep)
        if len(parts) >= 4:
            domain = os.path.join(parts[1], parts[2], parts[3])
            tree[domain] += 1
        extensions[item['extension']] += 1
        
    with open(os.path.join(OUT_DIR, '02_DATA_TAXONOMY.md'), 'w') as f:
        f.write("# 02 ACTUAL DATA TAXONOMY\n\n")
        f.write("## OBSERVATION: Root Domains Found\n")
        for domain, count in sorted(tree.items(), key=lambda x: x[1], reverse=True):
            if count > 100:
                f.write(f"- `{domain}`: {count} files\n")
        f.write("\n## OBSERVATION: Data Types\n")
        for ext, count in sorted(extensions.items(), key=lambda x: x[1], reverse=True)[:20]:
            f.write(f"- `{ext if ext else 'NO_EXT'}`: {count} files\n")

def step3_duplicate_map(inventory):
    print("Step 3: Duplicate Map...")
    hash_groups = defaultdict(list)
    for item in inventory:
        if item['hash']:
            hash_groups[item['hash']].append(item['absolute_path'])
            
    with open(os.path.join(OUT_DIR, '03_DUPLICATE_MAP.md'), 'w') as f:
        f.write("# 03 DUPLICATE MAP\n\n")
        f.write("## OBSERVATION\n")
        duplicates = {k: v for k, v in hash_groups.items() if len(v) > 1}
        f.write(f"- Total unique hashed files with duplicates: {len(duplicates)}\n\n")
        f.write("## INFERENCE (Categorization of Duplicates)\n")
        f.write("Duplicates likely fall into:\n")
        f.write("A. Exact Backup Copies (e.g. PC to NAS sync)\n")
        f.write("B. Inter-domain Copies (e.g. INBOX vs ATLAS)\n")
        f.write("C. Scattered Copies (randomly placed)\n")
        f.write("D. UNKNOWN relationship\n")

def step4_canonicality_evidence():
    print("Step 4: Canonicality Evidence...")
    with open(os.path.join(OUT_DIR, '04_CANONICALITY_EVIDENCE.md'), 'w') as f:
        f.write("# 04 CANONICALITY EVIDENCE\n\n")
        f.write("## OBSERVATION\n")
        f.write("The system currently holds multiple copies of data. No decisions are made here.\n\n")
        f.write("## EVIDENCE METRICS TO GATHER\n")
        f.write("- **Location Context:** Which root folder holds the file?\n")
        f.write("- **Modification Time:** Is one file older/newer?\n")
        f.write("- **Directory Semantics:** Does the folder name imply a 'Final' or 'Archive' status?\n")
        f.write("- **Filename Quality:** Does one have a descriptive name while the other is `IMG_1234`?\n")
        f.write("- **Source:** Was it dumped from a flash drive vs organized by a human?\n")

def step5_retrieval_arch():
    print("Step 5: Retrieval Architecture...")
    with open(os.path.join(OUT_DIR, '05_RETRIEVAL_ARCHITECTURE.md'), 'w') as f:
        f.write("# 05 RETRIEVAL ARCHITECTURE\n\n")
        f.write("## INFERENCE (Current Gap)\n")
        f.write("- Synology Universal Search provides full-text and filename indexing.\n")
        f.write("- Synology Photos provides basic EXIF timeline indexing.\n")
        f.write("- System lacks a Semantic Mapping layer to bridge human concepts with filenames.\n\n")
        f.write("## PROPOSED ARCHITECTURE\n")
        f.write("1. **Storage Layer:** NAS Filesystem.\n")
        f.write("2. **Index Layer:** SQLite/JSON database containing file metadata and inferred tags.\n")
        f.write("3. **Semantic Layer:** A metadata tagging system (e.g. mapping `FLASHDRIVE-PVCFC` to `Công việc NPK`).\n")

def step6_data_map(inventory):
    print("Step 6: Data Map...")
    with open(os.path.join(OUT_DIR, '06_DATA_MAP.md'), 'w') as f:
        f.write("# 06 DATA MAP\n\n")
        f.write("## OBSERVATION: High-Level Landscape\n")
        f.write(f"- Total Files Scanned: {len(inventory)}\n")
        f.write("- Key Zones Detected:\n")
        f.write("  - `/volume1/TUAN_ATLAS`\n")
        f.write("  - `/volume1/TUAN_FORGE`\n")
        f.write("  - `/volume1/homes`\n")

def step7_search_test_cases():
    print("Step 7: Search Test Cases...")
    with open(os.path.join(OUT_DIR, '07_SEARCH_TEST_CASES.md'), 'w') as f:
        f.write("# 07 SEARCH TEST CASES\n\n")
        f.write("## TEST CASES\n")
        f.write("1. **'Ảnh ba'**\n   - Current capability: Fails unless filename has 'ba'.\n   - Required: Facial recognition or Semantic tagging mapping 'ba' to specific PersonID.\n\n")
        f.write("2. **'Tài liệu NPK'**\n   - Current capability: Synology Search works if 'NPK' is in filename.\n   - Missing: Relationship between NPK, PVCFC, and Standee folders.\n\n")
        f.write("3. **'Tài liệu PBCM'**\n   - Current capability: Keyword search.\n   - Missing: Concept linkage.\n")

def main():
    safe_mkdir(OUT_DIR)
    inventory = step1_build_inventory()
    step2_parse_taxonomy(inventory)
    step3_duplicate_map(inventory)
    step4_canonicality_evidence()
    step5_retrieval_arch()
    step6_data_map(inventory)
    step7_search_test_cases()
    print("Data Cartography Phase 2 Completed.")

if __name__ == '__main__':
    main()
