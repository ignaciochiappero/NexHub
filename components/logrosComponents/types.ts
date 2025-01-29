//app/dashboard/logros/components/types.ts
export interface Achievement {
  id: number;
  title: string;
  description: string;
  icon: string;
  stepsFinal: number;
  achievements: UserAchievement[];
}

export interface UserAchievement {
  stepsProgress: number;
  progress: number;
  completed: boolean;
  pendingSteps?: number[];
}

export interface ConfirmationModalType {
  show: boolean;
  achievementId: number;
  step: number;
}