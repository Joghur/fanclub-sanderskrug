import { Timestamp } from 'firebase/firestore/lite';

export interface Game {
    Goals?: Goal[];
    Group?: Group;
    LastUpdateDateTime?: Date;
    LeagueId?: number;
    LeagueName?: string;
    LeagueSeason?: number;
    LeagueShortcut?: string;
    Location?: null;
    MatchDateTime?: Date;
    MatchDateTimeUTC?: Date;
    MatchID?: number;
    MatchIsFinished?: boolean;
    MatchResults?: MatchResult[];
    NumberOfViewers?: number;
    Team1?: Team;
    Team2?: Team;
    TimeZoneID?: string;
}

export interface MatchResult {
    ResultID: number;
    ResultName: string;
    PointsTeam1: number;
    PointsTeam2: number;
    ResultDescription: string;
    ResultOrderID: number;
    ResultTypeID: number;
}

export interface Goal {
    Comment?: string;
    GoalGetterID?: number;
    GoalGetterName?: string;
    GoalID?: number;
    IsOvertime?: boolean;
    IsOwnGoal?: boolean;
    IsPenalty?: boolean;
    MatchMinute?: number;
    ScoreTeam1?: number;
    ScoreTeam2?: number;
}

export interface Group {
    GroupID?: number;
    GroupOrderID?: number;
    GroupName?: string;
}

export interface Team {
    ShortName?: string;
    TeamGroupName?: string;
    TeamIconUrl?: string;
    TeamId?: number;
    TeamName?: string;
}

export type GameType = 'league' | 'cup' | 'other';

export interface NextMatch extends NextMatchProperties {
    matchDate: Date;
}

export interface NextMatchDB extends NextMatchProperties {
    matchDate: Timestamp;
}

interface NextMatchProperties {
    gameId?: string;
    location?: string;
    matchDay?: number;
    matchType: GameType;
    opponent: string;
    nextMatch: boolean;
    active: boolean;
    busTour: boolean;
}

export interface MatchDay {
    GroupId: string;
    GroupName: string;
    GroupOrderID: number;
}
