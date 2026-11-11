import re

with open("src/css/main.css", "r") as f:
    css = f.read()

css = re.sub(r'    \.editorial-logo \{\n\s*height: 44px;\n\s*\}\n', '', css)
css = re.sub(r'    \.editorial-logo \{\n\s*height: 38px;\n\s*\}\n', '', css)
css = re.sub(r'    \.editorial-logo \{\n\s*height: 56px;\n\s*\}\n', '', css)

with open("src/css/main.css", "w") as f:
    f.write(css)
