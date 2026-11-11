const fs = require('fs');
const filePath = '.aios/PROJECT_CONTRACT.json';

try {
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  
  if (!data.resources) data.resources = {};
  if (!data.resources.runtimes) data.resources.runtimes = {};
  
  data.resources.runtimes["Cline_CLI"] = {
    "identity": "Cline Local Execution Interface",
    "classification": "Execution Runtime",
    "status": "AIOS REGISTERED / ACTIVE",
    "execution_surface": "CLI / Local Terminal",
    "permission_boundary": "workspace-write (Strictly bounded to Cline Execution Surfaces)",
    "operating_constraints": [
      "Plan Mode: Mandatory",
      "Auto-Approve: Disabled"
    ],
    "allowed_capabilities": [
      "figma-design-to-code",
      "playwright-browser-qa",
      "frontend-file-mutation"
    ],
    "denied_capabilities": [
      "Database Mutation",
      "Backend Architecture Changes",
      "Production Deployment",
      "Modify AIOS Governance Files (.aios/, brand/, docs/)"
    ]
  };
  
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  console.log('Successfully patched PROJECT_CONTRACT.json');
} catch (e) {
  console.error('Error patching JSON:', e);
}
