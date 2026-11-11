import re

with open('docs/audit/REPORT_PUBLIC_HOME_UX_QA_v0.2.md', 'r') as f:
    content = f.read()

# Remove the old V0 -> V1 Delta Audit section
content = re.sub(r'# V0 → V1 PRODUCT DELTA AUDIT.*', '', content, flags=re.DOTALL)

with open('docs/audit/REPORT_PUBLIC_HOME_UX_QA_v0.2.md', 'w') as f:
    f.write(content)
