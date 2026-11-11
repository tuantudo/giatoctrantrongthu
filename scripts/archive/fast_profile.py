import os
from collections import Counter

zones = {
    '/volume1/TUAN_ATLAS/FAMILYSEARCH': {'count': 0, 'exts': Counter(), 'dirs': set(), 'files': []},
    '/volume1/TUAN_FORGE/03_CORE': {'count': 0, 'exts': Counter(), 'dirs': set(), 'files': []},
    '/volume1/TUAN_FORGE/ChiLinh': {'count': 0, 'exts': Counter(), 'dirs': set(), 'files': []},
    '/volume1/TUAN_FORGE/_DEPRECATED': {'count': 0, 'exts': Counter(), 'dirs': set(), 'files': []}
}

current_zone = None
current_dir = None
current_ext = None
current_file = None

with open('/volume1/TUAN_FORGE/03_AUDIT/01_DATA_INVENTORY.json', 'r') as f:
    for line in f:
        line = line.strip()
        if line.startswith('"absolute_path":'):
            path = line.split('": "')[1].strip('",')
            current_zone = None
            for z in zones:
                if path.startswith(z):
                    current_zone = z
                    zones[z]['count'] += 1
                    break
        elif current_zone:
            if line.startswith('"filename":'):
                name = line.split('": "')[1].strip('",')
                if len(zones[current_zone]['files']) < 5:
                    zones[current_zone]['files'].append(name)
            elif line.startswith('"extension":'):
                ext = line.split('": "')[1].strip('",')
                zones[current_zone]['exts'][ext.lower()] += 1
            elif line.startswith('"parent_directory":'):
                pdir = line.split('": "')[1].strip('",')
                zones[current_zone]['dirs'].add(pdir)

for z, p in zones.items():
    print(f"\n=====================================")
    print(f"ZONE: {z}")
    print(f"File Count: {p['count']}")
    print(f"Subdirectories: {len(p['dirs'])}")
    print(f"Top 5 Subdirectories: {list(p['dirs'])[:5]}")
    print(f"Top 5 Extensions: {p['exts'].most_common(5)}")
    print(f"Name Sample: {p['files']}")
