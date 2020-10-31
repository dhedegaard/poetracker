export as namespace poetracker

export interface IDatapointResult {
  datapoint: IDatapoint
  previousDatapoint?: IDatapoint
}

export interface IDatapoint {
  id: number
  account: IAccountType
  accountId: string
  charname: string
  experience: number
  globalRank?: number
  league: ILeagueType
  leagueId: string
  level: number
  timestamp: string
  class: string
  dead: boolean
  online?: boolean
  poeProfileURL: string
}

export interface IAccountType {
  accountName: string
  twitchUsername?: string
  twitchURL?: string
}

export interface ILeagueType {
  id: string
  startAt: string
  endAt?: string
  url: string
}

export interface IGraphData extends IDatapoint {
  timestampDate: Date
}

export interface IInitialPayload {
  leagues: ILeagueType[]
  datapoints: IDatapointResult[]
  accounts: IAccountType[]
}

export type GraphFromType =
  | 'forever'
  | '1 week'
  | '3 days'
  | '1 day'
  | '6 hours'
  | '1 hour'

export interface IState {
  datapoints: IDatapointResult[]
  filteredDatapoints: IDatapointResult[]
  leagues: ILeagueType[]
  accounts: IAccountType[]
  loading: boolean
  error: string
  graphFrom: GraphFromType
  getCharData?: IGetCharDataInput
  chardata?: IGetCharDataResult
  filter: IFilter
  selectedRow?: ISelectedRowType
}

export interface ISelectedRowType {
  charname: string
  leagueId: string
}

export type IActionType =
  | {
      type: 'INITIAL_DATA'
      datapoints: IDatapointResult[]
      leagues: ILeagueType[]
      accounts: IAccountType[]
    }
  | {
      type: 'NOTIFY_UPDATE'
      newDatapoints: IDatapointResult[]
    }
  | {
      type: 'SET_ERROR'
      error: string
    }
  | {
      type: 'FILTER_CHANGED'
      selectedLeague: string
      hideDead: boolean
      onlyShowOnly: boolean
      hideStreamers: boolean
      hideStandardLeagues: boolean
      showOnlyAccount?: string
    }
  | {
      type: 'GET_CHAR_DATA'
      getData?: IGetCharDataInput
    }
  | {
      type: 'RECEIVED_CHAR_DATA'
      result: IGetCharDataResult
    }
  | {
      type: 'GRAPH_FROM_CHANGED'
      from: GraphFromType
    }

interface IGetCharDataInput {
  leagueId: string
  charname: string
}

interface IGetCharDataResult {
  leagueId: string
  charname: string
  result: IGraphData[]
}

interface IFilter {
  selectedLeague: string
  hideDead: boolean
  onlyShowOnline: boolean
  hideStreamers: boolean
  hideStandardLeagues: boolean
  showOnlyAccount?: string
}
