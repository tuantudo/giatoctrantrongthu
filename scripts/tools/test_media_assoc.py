import sqlite3
import json

conn = sqlite3.connect('server/family_archive.db')
c = conn.cursor()

c.execute("SELECT relation_id, person_id FROM person_media")
pms = c.fetchall()

c.execute("SELECT id FROM media")
medias = [r[0] for r in c.fetchall()]

mapped = 0
unmapped = 0

for pm in pms:
    rel_id = pm[0]
    person_id = pm[1]
    
    # rel_id is like PMR_I223_G1B5-W5Y
    # media is like MEDIA_FS_G1B5-W5Y
    # Split by _
    parts = rel_id.split('_')
    if len(parts) >= 3:
        media_hash = parts[-1]
        expected_media_id = "MEDIA_FS_" + media_hash
        if expected_media_id in medias:
            mapped += 1
        else:
            unmapped += 1
    else:
        unmapped += 1

print(f"Total PM: {len(pms)}")
print(f"Mapped via relation_id heuristic: {mapped}")
print(f"Unmapped: {unmapped}")
