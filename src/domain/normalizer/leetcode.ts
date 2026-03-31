export function normalizeLeetcode(data: any) {
  const result: any = {};

  data.forEach((d: any) => {
    result[d.difficulty.toLowerCase()] = d.count;
  });

  return {
    problemSolving: {
      easy: result.easy || 0,
      medium: result.medium || 0,
      hard: result.hard || 0,
    },
  };
}