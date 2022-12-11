export interface Standing {
    TeamInfoId: number;
    Draw: number;
    GoalDiff: number;
    Goals: number;
    Lost: number;
    Matches: number;
    OpponentGoals: number;
    Points: number;
    ShortName: string;
    TeamIconUrl: string;
    TeamName: string;
    Won: number;
}

export type League = 'bl1' | 'bl2' | 'bl3' | 'dfb' | 'uefacl' | 'wm';
