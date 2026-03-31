export interface UserProfile {
  problemSolving?: {
    easy: number;
    medium: number;
    hard: number;
  };

  skills?: string[];
  projects?: number;
  activityScore?: number;
}