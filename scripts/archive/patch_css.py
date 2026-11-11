import re

with open("src/css/main.css", "r") as f:
    css = f.read()

# Replace the base .editorial-logo block
new_logo_css = """
.editorial-logo {
    /* Base height for mobile (icon-only) */
    height: 64px;
    max-width: 90vw;
    width: auto;
    display: block;
    margin: 0 auto;
}

/* WIDE DESKTOP */
@media (min-width: 1024px) {
    .editorial-logo {
        height: 160px;
    }
    .header-nameplate {
        padding: 3rem 24px 2rem;
    }
}

/* NARROW DESKTOP / TABLET */
@media (min-width: 640px) and (max-width: 1023px) {
    .editorial-logo {
        height: 80px;
    }
    .header-nameplate {
        padding: 2.5rem 24px 2rem;
    }
}
"""

css = re.sub(
    r'\.editorial-logo\s*\{[^}]*\}',
    new_logo_css.strip(),
    css,
    count=1
)

# Strip out old mobile media queries that touched .editorial-logo
css = re.sub(r'@media \(max-width: 768px\) \{[^}]*\.editorial-logo\s*\{[^}]*\}[^}]*\}', '', css)
css = re.sub(r'@media \(max-width: 480px\) \{[^}]*\.editorial-logo\s*\{[^}]*\}[^}]*\}', '', css)

with open("src/css/main.css", "w") as f:
    f.write(css)
