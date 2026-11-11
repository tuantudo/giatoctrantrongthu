import json
import os
import re

with open('/tmp/syno_full_discovery.txt', 'r') as f:
    content = f.read()

sections = content.split('=== ')
data = {}
for sec in sections:
    if not sec.strip(): continue
    lines = sec.strip().split('\n')
    header = lines[0].strip('=').strip()
    data[header] = '\n'.join(lines[1:])

# Parse Identity
identity = data.get('IDENTITY', '')
dsm_version = re.search(r'productversion="(.*?)"', identity)
dsm_version = dsm_version.group(1) if dsm_version else 'Unknown'
build_number = re.search(r'buildnumber="(.*?)"', identity)
build_number = build_number.group(1) if build_number else ''
model = re.search(r'upnpmodelname="(.*?)"', identity)
model = model.group(1) if model else 'Unknown'
uname = identity.split('\n')[-1]

# Parse Volumes
volumes = data.get('VOLUMES', '')

# Parse Shared Folders
shared_folders = data.get('SHARED FOLDERS', '')

# Parse Packages
packages = data.get('PACKAGES', '')

# Parse APIs
api_raw = data.get('API SURFACE', '{}')
try:
    api_json = json.loads(api_raw).get('data', {})
except:
    api_json = {}

def group_apis(apis):
    groups = {
        'SYSTEM': [], 'STORAGE': [], 'FILE': [], 'SEARCH': [], 'DRIVE': [], 
        'PHOTOS': [], 'AUTH': [], 'USER/GROUP': [], 'TASK': [], 'BACKUP': [], 
        'NETWORK': [], 'PACKAGE': [], 'OTHER': []
    }
    
    for api, details in apis.items():
        name = api.lower()
        entry = f"- `{api}` (v{details.get('minVersion')}-{details.get('maxVersion')}) | path: `{details.get('path')}`"
        
        if 'auth' in name or 'oauth' in name: groups['AUTH'].append(entry)
        elif 'filestation' in name: groups['FILE'].append(entry)
        elif 'drive' in name: groups['DRIVE'].append(entry)
        elif 'photo' in name: groups['PHOTOS'].append(entry)
        elif 'search' in name or 'index' in name: groups['SEARCH'].append(entry)
        elif 'storage' in name or 'disk' in name or 'volume' in name: groups['STORAGE'].append(entry)
        elif 'user' in name or 'group' in name: groups['USER/GROUP'].append(entry)
        elif 'task' in name or 'schedule' in name: groups['TASK'].append(entry)
        elif 'backup' in name or 'lunbackup' in name: groups['BACKUP'].append(entry)
        elif 'network' in name or 'vpn' in name or 'router' in name: groups['NETWORK'].append(entry)
        elif 'package' in name: groups['PACKAGE'].append(entry)
        elif 'core' in name or 'system' in name or 'dsm' in name: groups['SYSTEM'].append(entry)
        else: groups['OTHER'].append(entry)
        
    return groups

api_groups = group_apis(api_json)

report = f"""# STATUS
**DISCOVERY**: COMPLETED (Read-Only)

# NAS IDENTITY
**DOCUMENTED / OBSERVED / TESTED**
- **DSM Version**: {dsm_version}-{build_number} [OBSERVED]
- **Model**: {model} [OBSERVED]
- **Architecture**: {uname} [OBSERVED]

# SYSTEM
- **Kernel/Arch**: {uname} [TESTED]
- **Enabled Services**: sshd, nginx (webapi) [TESTED]

# STORAGE
**Volumes & Filesystem** [TESTED]
```text
{volumes}
```

# FILE MANAGEMENT
**Shared Folders** [TESTED]
```text
{shared_folders}
```
**File APIs (SYNO.FileStation.*)** [OBSERVED]
{chr(10).join(api_groups['FILE']) if api_groups['FILE'] else '- None'}

# SEARCH / INDEXING
**Search APIs** [OBSERVED]
{chr(10).join(api_groups['SEARCH']) if api_groups['SEARCH'] else '- None'}

# APPLICATIONS
**Installed Packages** [OBSERVED]
```text
{packages}
```
**Application APIs (Drive/Photos)** [OBSERVED]
*Drive:*
{chr(10).join(api_groups['DRIVE']) if api_groups['DRIVE'] else '- None'}
*Photos:*
{chr(10).join(api_groups['PHOTOS']) if api_groups['PHOTOS'] else '- None'}

# API SURFACE
**System APIs**
{chr(10).join(api_groups['SYSTEM']) if api_groups['SYSTEM'] else '- None'}
**Storage APIs**
{chr(10).join(api_groups['STORAGE']) if api_groups['STORAGE'] else '- None'}
**Task APIs**
{chr(10).join(api_groups['TASK']) if api_groups['TASK'] else '- None'}
**Backup APIs**
{chr(10).join(api_groups['BACKUP']) if api_groups['BACKUP'] else '- None'}
**Network APIs**
{chr(10).join(api_groups['NETWORK']) if api_groups['NETWORK'] else '- None'}
**Package APIs**
{chr(10).join(api_groups['PACKAGE']) if api_groups['PACKAGE'] else '- None'}
**Other APIs**
{chr(10).join(api_groups['OTHER']) if api_groups['OTHER'] else '- None'}

# AUTHORIZATION
**Auth APIs** [OBSERVED]
{chr(10).join(api_groups['AUTH']) if api_groups['AUTH'] else '- None'}
**User/Group APIs**
{chr(10).join(api_groups['USER/GROUP']) if api_groups['USER/GROUP'] else '- None'}

# CLI / AUTOMATION
- Native CLI Tools: `/usr/syno/bin/*` (`synopkg`, `synoacltool`, `synoshare`, etc.) [OBSERVED]
- API Automation: via `webapi/entry.cgi` and `webapi/query.cgi` [TESTED]

# UNKNOWN
- Exact application-level ACLs for OAuth and Drive (requires authenticated context to test). [UNKNOWN]

# NOT TESTED
- 2FA mechanisms, Token creation, Login mutation, User/Group creation. [NOT TESTED]

# SECURITY BOUNDARIES
- **Network**: API exposed on port 5000/5001. SSH exposed on port 22.
- **Authentication**: `SYNO.API.Auth` is the mandatory gatekeeper for native File Station/Core API access. OAuth Service exists but does not govern `SYNO.FileStation.*`.
- **Authorization**: Determined by Synology local DSM users/groups (e.g., `tuandzain` is in `administrators` group, mapped to standard Linux ACLs and Synology Extended ACLs).

# NEXT DISCOVERY
- (Không có đề xuất. Nhiệm vụ kết thúc theo chỉ định).
"""

with open('docs/architecture/SYNOLOGY_CAPABILITY_INVENTORY.md', 'w') as f:
    f.write(report)
