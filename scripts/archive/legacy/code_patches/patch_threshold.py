with open("src/js/ui/public-home.js", "r") as f:
    lines = f.readlines()

new_lines = []
skip = False
for line in lines:
    if "content.appendChild(el('div', { class: 'gi-threshold', id: 'threshold' }" in line:
        skip = True
    if skip and "]));" in line:
        skip = False
        continue
    if not skip:
        new_lines.append(line)

with open("src/js/ui/public-home.js", "w") as f:
    f.writelines(new_lines)
