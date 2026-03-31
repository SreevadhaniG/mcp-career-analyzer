export function normalizeHackerRank(data: any) {
  return {
    skills: data.skills || [],
  };
}