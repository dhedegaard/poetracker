const initialData = (initialPayload: poetracker.IInitialPayload): poetracker.IActionType => ({
  accounts: initialPayload.accounts,
  datapoints: initialPayload.datapoints,
  leagues: initialPayload.leagues,
  type: "INITIAL_DATA",
});

const notifyNewData = (data: poetracker.IDatapointResult[]): poetracker.IActionType => ({
  newDatapoints: data,
  type: "NOTIFY_UPDATE",
});

const setError = (error: string): poetracker.IActionType => ({
  error,
  type: "SET_ERROR",
});

const filterChanged = (filterState: poetracker.IFilter): poetracker.IActionType => ({
  hideDead: filterState.hideDead,
  hideStandardLeagues: filterState.hideStandardLeagues,
  hideStreamers: filterState.hideStreamers,
  onlyShowOnly: filterState.onlyShowOnline,
  selectedLeague: filterState.selectedLeague,
  showOnlyAccount: filterState.showOnlyAccount,
  type: "FILTER_CHANGED",
});

const getCharData = (leagueId: string, charname: string): poetracker.IActionType => ({
  getData: { leagueId, charname },
  type: "GET_CHAR_DATA",
});

const receivedCharData = (result: poetracker.IGetCharDataResult): poetracker.IActionType => ({
  result,
  type: "RECEIVED_CHAR_DATA",
});

const graphFromChanged = (from: poetracker.GraphFromType): poetracker.IActionType => ({
  from,
  type: "GRAPH_FROM_CHANGED",
});

export {
  filterChanged,
  getCharData,
  initialData,
  notifyNewData,
  receivedCharData,
  setError,
  graphFromChanged,
};
