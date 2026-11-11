const fs = require('fs');
const path = require('path');
const os = require('os');

const mcpFile = path.join(os.homedir(), '.cline', 'data', 'settings', 'cline_mcp_settings.json');

try {
  let data = JSON.parse(fs.readFileSync(mcpFile, 'utf8'));
  
  if (!data.mcpServers) data.mcpServers = {};
  
  data.mcpServers["filesystem"] = {
    "transport": {
      "type": "stdio",
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-filesystem",
        "/Users/tuantq/Projects/Personal/giatoctrantrongthu"
      ]
    },
    "disabled": false,
    "timeout": 30
  };
  
  // Ensure Playwright is active
  if (data.mcpServers["playwright"]) {
    data.mcpServers["playwright"].disabled = false;
  }
  
  fs.writeFileSync(mcpFile, JSON.stringify(data, null, 2));
  console.log('Successfully updated global MCP settings');
} catch (e) {
  console.error('Error updating MCP:', e);
}
