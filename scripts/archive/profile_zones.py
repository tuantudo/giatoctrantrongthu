import json
import os
from collections import Counter
from datetime import datetime

ZONES = [
    '/volume1/TUAN_ATLAS/FAMILYSEARCH',
    '/volume1/TUAN_FORGE/03_CORE',
    '/volume1/TUAN_FORGE/ChiLinh',
    '/volume1/TUAN_FORGE/_DEPRECATED'
]

print("Loading inventory...")
with open('/volume1/TUAN_FORGE/03_AUDIT/01_DATA_INVENTORY.json', 'r') as f:
    data = json.load(f)

profiles = {z: {'count': 0, 'exts': Counter(), 'mtime_years': Counter(), 'names': set(), 'dirs': set()} for z in ZONES}

for item in data:
    path = item.get('absolute_path', '')
    for z in ZONES:
        if path.startswith(z):
            p = profiles[z]
            p['count'] += 1
            p['exts'][item.get('extension', '').lower()] += 1
            if 'mtime' in item:
                year = datetime.fromtimestamp(item['mtime']).year
                p['mtime_years'][year] += 1
            if len(p['names']) < 5:
                p['names'].add(item.get('filename', ''))
            
            p['dirs'].add(item.get('parent_directory', ''))
            break

for z in ZONES:
    p = profiles[z]
    print(f"\n=====================================")
    print(f"ZONE: {z}")
    print(f"File Count: {p['count']}")
    print(f"Subdirectories Count: {len(p['dirs'])}")
    print(f"Top 5 Subdirectories: {list(p['dirs'])[:5]}")
    print(f"Top 5 Extensions: {p['exts'].most_common(5)}")
    print(f"Mtime Years: {p['mtime_years'].most_common()}")
    print(f"Name Sample: {list(p['names'])}")

