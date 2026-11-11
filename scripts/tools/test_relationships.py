import sqlite3
import json

conn = sqlite3.connect('server/family_archive.db')
c = conn.cursor()

c.execute("SELECT id FROM people")
people = set([r[0] for r in c.fetchall()])

c.execute("SELECT payload FROM families")
families = [json.loads(r[0]) for r in c.fetchall()]

valid_spouse = 0
orphan_spouse = 0
valid_child = 0
orphan_child = 0

for f in families:
    husband = f.get('husband')
    wife = f.get('wife')
    
    if husband:
        if husband in people:
            valid_spouse += 1
        else:
            orphan_spouse += 1
            
    if wife:
        if wife in people:
            valid_spouse += 1
        else:
            orphan_spouse += 1
            
    children = f.get('children', [])
    for child in children:
        if child in people:
            valid_child += 1
        else:
            orphan_child += 1

print(f"Total families: {len(families)}")
print(f"Spouse references (Husband/Wife): Valid: {valid_spouse}, Orphan: {orphan_spouse}")
print(f"Child references: Valid: {valid_child}, Orphan: {orphan_child}")
