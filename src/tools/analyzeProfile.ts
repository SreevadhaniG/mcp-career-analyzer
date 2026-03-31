import { z } from "zod";
import { analyzeProfile } from "../services/profile.service.js";

export const analyzeProfileTool = {
  name: "analyze_profile",

  schema: {
    github: z.string().optional(),
    leetcode: z.string().optional(),
    hackerrank: z.string().optional(),
  },

  handler: async (input: any) => {
    const result = await analyzeProfile(input);

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(result, null, 2),
        },
      ],
    };
  },
};