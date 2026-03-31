import axios, { AxiosError } from "axios";

type JsonRecord = Record<string, unknown>;

const hackerrankClient = axios.create({
  timeout: 10000,
  headers: {
    Accept: "application/json, text/plain, */*",
    "User-Agent": "mcp-career-analyzer/1.0",
  },
});

function isRecord(value: unknown): value is JsonRecord {
  return typeof value === "object" && value !== null;
}

function normalizeName(value: unknown): string | null {
  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim();
  return trimmed ? trimmed : null;
}

function appendCandidate(
  bucket: Set<string>,
  candidate: unknown,
  fieldNames: string[]
) {
  if (typeof candidate === "string") {
    const name = normalizeName(candidate);

    if (name) {
      bucket.add(name);
    }

    return;
  }

  if (!isRecord(candidate)) {
    return;
  }

  for (const fieldName of fieldNames) {
    const value = normalizeName(candidate[fieldName]);

    if (value) {
      bucket.add(value);
      return;
    }
  }
}

function extractNamedValues(
  payload: unknown,
  collectionKeys: string[],
  fieldNames: string[]
): string[] {
  const values = new Set<string>();
  const seen = new Set<unknown>();

  const visit = (node: unknown) => {
    if (node === null || node === undefined || seen.has(node)) {
      return;
    }

    if (typeof node !== "object") {
      return;
    }

    seen.add(node);

    if (Array.isArray(node)) {
      for (const entry of node) {
        appendCandidate(values, entry, fieldNames);
        visit(entry);
      }

      return;
    }

    for (const [key, value] of Object.entries(node)) {
      if (collectionKeys.includes(key) || fieldNames.includes(key)) {
        if (Array.isArray(value)) {
          for (const entry of value) {
            appendCandidate(values, entry, fieldNames);
          }
        } else {
          appendCandidate(values, value, fieldNames);
        }
      }

      visit(value);
    }
  };

  visit(payload);

  return [...values];
}

function extractJsonFromHtml(html: string): unknown {
  const nextDataMatch = html.match(
    /<script[^>]*id="__NEXT_DATA__"[^>]*type="application\/json"[^>]*>([\s\S]*?)<\/script>/i
  );

  if (nextDataMatch?.[1]) {
    try {
      return JSON.parse(nextDataMatch[1]);
    } catch {
      return null;
    }
  }

  const stateMatchers = [
    /window\.__INITIAL_STATE__\s*=\s*({[\s\S]*?});/i,
    /window\.__PRELOADED_STATE__\s*=\s*({[\s\S]*?});/i,
  ];

  for (const matcher of stateMatchers) {
    const match = html.match(matcher);

    if (!match?.[1]) {
      continue;
    }

    try {
      return JSON.parse(match[1]);
    } catch {
      continue;
    }
  }

  return null;
}

async function safeGetJson(url: string): Promise<unknown | null> {
  try {
    const response = await hackerrankClient.get(url);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError && error.response?.status === 404) {
      return null;
    }

    throw error;
  }
}

async function safeGetHtml(url: string): Promise<string | null> {
  try {
    const response = await hackerrankClient.get<string>(url, {
      headers: {
        Accept: "text/html,application/xhtml+xml",
      },
    });

    return typeof response.data === "string" ? response.data : null;
  } catch (error) {
    if (error instanceof AxiosError && error.response?.status === 404) {
      return null;
    }

    throw error;
  }
}

export async function fetchHackerRank(username: string) {
  const encodedUsername = encodeURIComponent(username);
  const skillsPayload = await safeGetJson(
    `https://www.hackerrank.com/rest/hackers/${encodedUsername}/skills`
  );
  const badgesPayload = await safeGetJson(
    `https://www.hackerrank.com/rest/hackers/${encodedUsername}/badges`
  );

  const skills = extractNamedValues(
    skillsPayload,
    ["skills", "models", "domains", "topics", "data"],
    ["name", "title", "skill", "skill_name", "topic_name", "domain_name"]
  );
  const badges = extractNamedValues(
    badgesPayload,
    ["badges", "models", "data"],
    ["name", "title", "badge_name"]
  );

  let fallbackSkills: string[] = [];

  if (skills.length === 0) {
    const html = await safeGetHtml(
      `https://www.hackerrank.com/profile/${encodedUsername}`
    );

    if (html) {
      const pageData = extractJsonFromHtml(html);
      fallbackSkills = extractNamedValues(
        pageData,
        ["skills", "models", "domains", "topics", "data"],
        ["name", "title", "skill", "skill_name", "topic_name", "domain_name"]
      );
    }
  }

  const mergedSkills = [...new Set([...skills, ...fallbackSkills])];

  if (mergedSkills.length === 0 && badges.length === 0) {
    throw new Error(`Unable to fetch HackerRank profile data for "${username}"`);
  }

  return {
    skills: mergedSkills.length > 0 ? mergedSkills : badges,
    badges,
  };
}
