export function calculateScore(profile: any) {
  let score = 0;

  score += (profile.problemSolving?.easy || 0) * 1;
  score += (profile.problemSolving?.medium || 0) * 2;
  score += (profile.problemSolving?.hard || 0) * 3;

  score += (profile.projects || 0) * 5;
  score += (profile.activityScore || 0);

  return score;
}