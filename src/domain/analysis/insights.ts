export function generateInsights(profile: any) {
  const insights: string[] = [];

  if ((profile.problemSolving?.hard || 0) < 20) {
    insights.push("Improve hard problem solving");
  }

  if ((profile.projects || 0) < 3) {
    insights.push("Build more real-world projects");
  }

  if ((profile.activityScore || 0) < 10) {
    insights.push("Increase GitHub activity");
  }

  if (!profile.skills || profile.skills.length === 0) {
    insights.push("Develop more technical skills");
  }

  return insights.length ? insights : ["Profile looks strong"];
}