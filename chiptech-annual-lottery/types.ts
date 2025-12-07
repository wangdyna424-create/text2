export enum PrizeLevel {
  Third = 'Third',
  Second = 'Second',
  First = 'First',
  Grand = 'Grand'
}

export interface PrizeConfig {
  id: PrizeLevel;
  label: string;
  count: number;
  color: string;
  icon: string;
}

export interface Winner {
  name: string;
  level: PrizeLevel;
  timestamp: number;
}

export interface LotteryState {
  remainingCandidates: string[];
  winners: Winner[];
  currentLevel: PrizeLevel;
  isRolling: boolean;
  rollingName: string;
  showCelebration: boolean;
}