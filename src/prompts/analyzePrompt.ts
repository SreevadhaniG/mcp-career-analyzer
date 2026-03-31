import { z } from "zod";

export const analyzePrompt = {
  name: "analyze_profile_prompt",

  schema: {
    input: z.string(),
  },

  handler: ({ input }: any) => ({
    messages: [
      {
        role: "user",
        content: {
          type: "text",
          text: `Analyze this developer profile:\n${input}`,
        },
      },
    ],
  }),
};