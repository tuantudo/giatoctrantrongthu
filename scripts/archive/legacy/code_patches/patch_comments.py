with open("src/js/ui/public-home.js", "r") as f:
    lines = f.readlines()

new_lines = []
for line in lines:
    if "02 — FAMILY VOICE" in line:
        line = line.replace("02 — FAMILY VOICE", "01 — FAMILY VOICE")
    elif "03 — FAMILY IDENTITY" in line:
        line = line.replace("03 — FAMILY IDENTITY", "02 — FAMILY IDENTITY")
    elif "04 — THE GATE" in line:
        line = line.replace("04 — THE GATE", "03 — THE GATE")
    elif "01 — FAMILY THRESHOLD" in line:
        # Skip this entire comment block
        pass
    new_lines.append(line)

# Let's do a proper clean up with regex
import re
with open("src/js/ui/public-home.js", "r") as f:
    content = f.read()

content = re.sub(r'/\*\s*------------------------------------------------------------------\n\s*\* 01 — FAMILY THRESHOLD(.*?)\n\s*---------------------------------------------------------------- \*/\n+', '', content, flags=re.DOTALL)
content = content.replace("02 — FAMILY VOICE", "01 — FAMILY VOICE")
content = content.replace("03 — FAMILY IDENTITY", "02 — FAMILY IDENTITY")
content = content.replace("04 — THE GATE", "03 — THE GATE")

with open("src/js/ui/public-home.js", "w") as f:
    f.write(content)
