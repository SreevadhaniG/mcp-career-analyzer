import { fetchGithub } from "../adapters/github.adapter.js";
import { fetchLeetcode } from "../adapters/leetcode.adapter.js";
import { fetchHackerRank } from "../adapters/hackerrank.adapter.js";

import { normalizeGithub } from "../domain/normalizer/github.js";
import { normalizeLeetcode } from "../domain/normalizer/leetcode.js";
import { normalizeHackerRank } from "../domain/normalizer/hackerrank.js";

import { generateInsights } from "../domain/analysis/insights.js";
import { calculateScore } from "../domain/analysis/scoring.js";

export async function analyzeProfile(input: any) {
  let profile: any = {};

  if (input.github) {
    const data = await fetchGithub(input.github);
    profile = { ...profile, ...normalizeGithub(data) };
  }

  if (input.leetcode) {
    const data = await fetchLeetcode(input.leetcode);
    profile = { ...profile, ...normalizeLeetcode(data) };
  }

  if (input.hackerrank) {
    const data = await fetchHackerRank(input.hackerrank);
    profile = { ...profile, ...normalizeHackerRank(data) };
  }

  const score = calculateScore(profile);
  const insights = generateInsights(profile);

  return {
    profile,
    score,
    insights,
  };
}