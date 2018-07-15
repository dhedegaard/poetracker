export as namespace poetracker;

export interface IDatapointResult {
  datapoint: IDatapoint;
  previousDatapoint?: IDatapoint;
}

export interface IDatapoint {
  account: IAccountType;
  accountId: string;
  charname: string;
  experience: number;
  globalRank?: number;
  league: ILeagueType;
  leagueId: string;
  level: number;
  timestamp: string;
  class: string;
  dead: boolean;
  online?: boolean;
  poeProfileURL: string;
}

export interface IAccountType {
  accountName: string;
  twitchUsername?: string;
  twitchURL?: string;
}

export interface ILeagueType {
  id: string;
  startAt: string;
  endAt?: string;
  url: string;
}

export interface IGraphData extends IDatapoint {
  timestampDate: Date;
}

export interface IInitialPayload {
  leagues: ILeagueType[];
  latestDatapoints: IDatapointResult[];
  accounts: IAccountType[];
}
