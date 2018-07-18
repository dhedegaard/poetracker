/* Handle restoring the old filter settings, or using the defaults. */
let initialFilter: poetracker.IFilter = {
  hideDead: false,
  hideStandardLeagues: true,
  hideStreamers: true,
  onlyShowOnline: false,
  selectedLeague: "",
};
const graphFilter = localStorage.getItem("graph-filter");
if (graphFilter) {
  initialFilter = {
    ...initialFilter,
    ...JSON.parse(graphFilter),
  };
}

const initialState: poetracker.IState = {
  accounts: [],
  datapoints: [],
  error: "",
  filter: initialFilter,
  filteredDatapoints: [],
  graphFrom: (localStorage.getItem("graph-from") || "forever") as poetracker.GraphFromType,
  leagues: [],
};
export { initialState };

const sortDatapoints = (datapoints: poetracker.IDatapointResult[]): poetracker.IDatapointResult[] => {
  if (!datapoints) {
    return datapoints;
  }
  return datapoints.sort((a, b) =>
    a.datapoint.experience === b.datapoint.experience ?
      (a.datapoint.globalRank || 15001) - (b.datapoint.globalRank || 15001) :
      b.datapoint.experience - a.datapoint.experience);
};

const buildFilteredDatapoints = (
  datapoints: poetracker.IDatapointResult[],
  filter: poetracker.IFilter,
): poetracker.IDatapointResult[] => {
  if (!datapoints || !datapoints.length || !filter) {
    return sortDatapoints(datapoints);
  }

  if (filter.selectedLeague) {
    datapoints = datapoints.filter((e) => e.datapoint.leagueId === filter.selectedLeague);
  }
  if (filter.hideDead) {
    datapoints = datapoints.filter((e) => !e.datapoint.dead);
  }
  if (filter.onlyShowOnline) {
    datapoints = datapoints.filter((e) => e.datapoint.online);
  }
  if (filter.hideStreamers) {
    datapoints = datapoints.filter((e) => !e.datapoint.account.twitchUsername);
  }
  if (filter.hideStandardLeagues) {
    datapoints = datapoints.filter((e) => e.datapoint.league.endAt);
  }
  if (filter.showOnlyAccount) {
    datapoints = datapoints.filter((e) => e.datapoint.accountId === filter.showOnlyAccount);
  }
  return sortDatapoints(datapoints);
};

const rootReducer = (state: poetracker.IState = initialState, action: poetracker.IActionType): poetracker.IState => {
  switch (action.type) {
    case "INITIAL_DATA":
      return {
        ...state,
        accounts: action.accounts.sort((a, b) => (
          (a.twitchUsername || a.accountName).localeCompare(b.twitchUsername || b.accountName))),
        datapoints: action.datapoints,
        filteredDatapoints: buildFilteredDatapoints(action.datapoints, state.filter),
        leagues: action.leagues,
      };
    case "NOTIFY_UPDATE":
      /* Start by filtering old datapoints that just got updated. */
      let datapoints = state.datapoints.slice().filter((datapoint) => {
        for (const newDatapoint of action.newDatapoints) {
          if (newDatapoint.datapoint.leagueId === datapoint.datapoint.leagueId &&
            newDatapoint.datapoint.accountId === datapoint.datapoint.accountId &&
            newDatapoint.datapoint.charname === datapoint.datapoint.charname) {
            return false;
          }
        }
        return true;
      });
      /* Finally append the old and the new to a final result. */
      datapoints = [...datapoints, ...action.newDatapoints];

      /* If we're viewing graph data and we just got notified with new data
         for that character, append data onto the graph data array. */
      let chardata = state.chardata;
      if (state.selectedRow && chardata) {
        for (const newDatapoint of action.newDatapoints) {
          if (newDatapoint.datapoint.charname === state.selectedRow.charname &&
            newDatapoint.datapoint.leagueId === state.selectedRow.leagueId) {
            const newElem = newDatapoint.datapoint as poetracker.IGraphData;
            newElem.timestampDate = new Date(newElem.timestamp);
            chardata = {
              ...chardata,
              result: [...chardata.result, newElem],
            };
          }
        }
      }

      /* Assemble and return the new state. */
      return {
        ...state,
        chardata,
        datapoints,
        filteredDatapoints: buildFilteredDatapoints(datapoints, state.filter),
      };
    case "SET_ERROR":
      return {
        ...state,
        error: action.error,
      };
    case "GET_CHAR_DATA":
      return {
        ...state,
        chardata: undefined,
        getCharData: action.getData,
        selectedRow: undefined,
      };
    case "RECEIVED_CHAR_DATA":
      return {
        ...state,
        chardata: {
          ...action.result,
        },
        getCharData: undefined,
        selectedRow: {
          charname: action.result.charname,
          leagueId: action.result.leagueId,
        },
      };
    case "FILTER_CHANGED":
      const filter = {
        hideDead: action.hideDead,
        hideStandardLeagues: action.hideStandardLeagues,
        hideStreamers: action.hideStreamers,
        onlyShowOnline: action.onlyShowOnly,
        selectedLeague: action.selectedLeague,
        showOnlyAccount: action.showOnlyAccount,
      };
      localStorage.setItem("graph-filter", JSON.stringify(filter));
      return {
        ...state,
        filter,
        filteredDatapoints: buildFilteredDatapoints(state.datapoints, filter),
      };
    case "GRAPH_FROM_CHANGED":
      localStorage.setItem("graph-from", action.from);
      return {
        ...state,
        graphFrom: action.from,
      };
    default:
      if (process.env.NODE_ENV === "development") {
        console.log("HIT DEFAULT CASE:", action);
      }
      return state;
  }
};
export default rootReducer;
