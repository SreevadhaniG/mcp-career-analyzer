import { ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js";

export const trendsResource = {
  name: "industry_trends",

  template: new ResourceTemplate("trends://latest", {}),

  handler: async () => ({
    contents: [
      {
        uri: "trends://latest",
        text: `
Top Trends:
- DSA + System Design for SDE roles
- AI/ML + LLM apps
- Backend + APIs
- Cloud (AWS, GCP)
        `,
      },
    ],
  }),
};