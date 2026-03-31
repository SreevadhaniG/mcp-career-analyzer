import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

import { analyzeProfileTool } from "./tools/analyzeProfile.js";
import { trendsResource } from "./resources/trends.js";
import { analyzePrompt } from "./prompts/analyzePrompt.js";

const server = new McpServer({
  name: "career-analyzer",
  version: "1.0.0",
});

// Tools
server.tool(
  analyzeProfileTool.name,
  analyzeProfileTool.schema,
  analyzeProfileTool.handler
);

// Resources
server.resource(
  trendsResource.name,
  trendsResource.template,
  trendsResource.handler
);

// Prompts
server.prompt(
  analyzePrompt.name,
  analyzePrompt.schema,
  analyzePrompt.handler
);

// Transport
const transport = new StdioServerTransport();
await server.connect(transport);