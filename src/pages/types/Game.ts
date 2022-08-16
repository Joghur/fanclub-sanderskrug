export type Game = {
  goals?: Goal[];
  group?: Group;
  lastUpdateDateTime?: Date;
  leagueId?: number;
  leagueName?: string;
  leagueSeason?: number;
  leagueShortcut?: string;
  location?: null;
  matchDateTime?: Date;
  matchDateTimeUTC?: Date;
  matchID?: number;
  matchIsFinished?: boolean;
  matchResults?: MatchResult[];
  numberOfViewers?: number;
  team1?: Team;
  team2?: Team;
  timeZoneID?: string;
};

export type MatchResult = {
  resultID: number;
  resultName: string;
  pointsTeam1: number;
  pointsTeam2: number;
  resultDescription: string;
  resultOrderID: number;
  resultTypeID: number;
};

export type Goal = {
  comment?: string;
  goalGetterID?: number;
  goalGetterName?: string;
  goalID?: number;
  isOvertime?: boolean;
  isOwnGoal?: boolean;
  isPenalty?: boolean;
  matchMinute?: number;
  scoreTeam1?: number;
  scoreTeam2?: number;
};

export type Group = {
  groupID?: number;
  groupOrderID?: number;
  groupName?: string;
};

export type Team = {
  shortName?: string;
  teamGroupName?: string;
  teamIconUrl?: string;
  teamId?: number;
  teamName?: string;
};

export interface NextMatch {
  id?: string;
  matchDate: Date;
  location?: string;
  matchDay?: number;
  matchType: "league" | "cup" | "other";
  opponent: string;
  nextMatch: boolean;
  active: boolean;
  busTour: boolean;
}
