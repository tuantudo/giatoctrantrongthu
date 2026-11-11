const fs = require('fs');
const os = require('os');
const path = require('path');

const vscodeMcpFile = path.join(os.homedir(), 'Library', 'Application Support', 'Code', 'User', 'globalStorage', 'saoudrizwan.claude-dev', 'settings', 'cline_mcp_settings.json');

try {
  let data = JSON.parse(fs.readFileSync(vscodeMcpFile, 'utf8'));
  
  if (!data.mcpServers) data.mcpServers = {};
  
  // Add filesystem using VS Code schema (direct properties)
  data.mcpServers["filesystem"] = {
    "type": "stdio",
    "command": "npx",
    "args": [
      "-y",
      "@modelcontextprotocol/server-filesystem",
      "/Users/tuantq/Projects/Personal/giatoctrantrongthu"
    ],
    "disabled": false
  };
  
  fs.writeFileSync(vscodeMcpFile, JSON.stringify(data, null, 2));
  console.log('Successfully updated VS Code MCP settings');
} catch (e) {
  console.error('Error updating VS Code MCP:', e);
}
