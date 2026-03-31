export function normalizeGithub(data: any) {
  return {
    projects: data.publicRepos,
    activityScore: data.followers,
  };
}