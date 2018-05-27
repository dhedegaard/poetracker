import React from 'react';

import CharacterTableComponent from './character-table.component';
import LeagueSelectComponent from './league-select.component';
import SignalRComponent, { InitialPayload } from './signalr.component';
import FilterComponent from './filter.component';

export interface DatapointResult {
  datapoint: Datapoint;
  previousDatapoint?: Datapoint;
}

export interface Datapoint {
  account: AccountType;
  accountId: string;
  charId: string;
  charname: string;
  experience: number;
  globalRank: number;
  league: LeagueType;
  leagueId: string;
  level: number;
  timestamp: string;
  class: string;
  dead: boolean;
  online: boolean;
  poeProfileURL: string;
}

interface AccountType {
  accountName: string;
  twitchUsername?: string;
  twitchURL: string;
}

export interface LeagueType {
  id: string;
  startAt: string;
  endAt?: string;
  url: string;
}


interface MainComponentState {
  error: string;
  leagues: LeagueType[];
  selectedLeague: string;
  datapoints: DatapointResult[];
}

export default class MainComponent extends React.Component<{}, MainComponentState> {
  filterComponent!: FilterComponent;

  constructor(props: {}) {
    super(props);
    this.state = {
      error: '',
      leagues: [],
      selectedLeague: '',
      datapoints: [],
    };
    this.onSignalRNotifyNewData = this.onSignalRNotifyNewData.bind(this);
    this.onSignalRInitialPayload = this.onSignalRInitialPayload.bind(this);
    this.onSignalRConnectionClosed = this.onSignalRConnectionClosed.bind(this);
    this.onLeagueSelect = this.onLeagueSelect.bind(this);
    this.onClickReloadPage = this.onClickReloadPage.bind(this);
  }

  componentDidMount() {
    // Patch in a font and use it everywhere (after it's done loading).
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css?family=Open+Sans:400,700';
    link.rel = 'stylesheet';
    link.onload = () => {
      document.body.style.fontFamily = '"Open Sans", sans-serif';
    };
    document.head.appendChild(link);
  }

  /**
   * Triggers on the initial payload, just after the connection was established.
   */
  onSignalRInitialPayload(data: InitialPayload) {
    let selectedLeague = '';

    // Check for an existing selectedLeague value from the localStorage.
    if (window.localStorage && window.localStorage.getItem('selectedLeague')) {
      selectedLeague = window.localStorage.getItem('selectedLeague')!;
    }

    // Check if what we have is valid, otherwise default to the first element (if any).
    if (!selectedLeague || !data.leagues || !data.leagues.filter(e => e.id === selectedLeague)) {
      selectedLeague = '';
    }

    // If there's no league selected, and there's no league data in the localStorage,
    // select the last league that's not either HC or SSF.
    if (selectedLeague === '' && window.localStorage && window.localStorage.getItem('selectedLeague') === null) {
      selectedLeague = data.leagues.filter(e => e.id.indexOf('HC') === -1 && e.id.indexOf('SSF') === -1)[0].id;
    }

    this.setState({
      leagues: data.leagues,
      selectedLeague: selectedLeague,
      datapoints: data.latestDatapoints,
    });
    console.log('initial payload:', data);
  }

  /**
   * Triggers when there's new delta data to work on.
   */
  onSignalRNotifyNewData(data: DatapointResult[]) {
    console.log('NotifyNewData:', data);
    // Copy the datapoints state.
    let datapoints = this.state.datapoints.slice();

    // Iterate on the delta update, handling changes as we go along.
    for (const datapoint of data) {

      // Remove any existing entries for the given char, probably not the
      // most efficient if there's a lot of datapoints.
      datapoints = datapoints.filter(e => e.datapoint.charId !== datapoint.datapoint.charId);

      // Push the new datapoint.
      datapoints.push(datapoint);
    }

    // Set the new state.
    this.setState({
      datapoints: datapoints,
    });
  }

  /**
   * Gets called wheneveer the SignalR connection gets closed for some reason. For now there's no reason for the disconnect.
   */
  onSignalRConnectionClosed() {
    this.setState({
      error: 'You have been disconnected',
    });
  }

  /**
   * Reloads the page, use this as a click event handler when something goes haywire.
   */
  onClickReloadPage(evt: React.MouseEvent<HTMLAnchorElement>) {
    window.location.reload();
  }

  /**
   * Triggers when the league select element triggers a change event.
   */
  onLeagueSelect(value: string) {
    // Set the value in the state.
    this.setState({
      selectedLeague: value,
    });
    // Store the value in the localStorage for reloads and such.
    if (window.localStorage) {
      localStorage.setItem('selectedLeague', value);
    }
  }


  render() {
    const datapoints = (this.filterComponent || new FilterComponent({} as any)).filterDatapoints(this.state.datapoints);

    return (
      <React.Fragment>
        <SignalRComponent
          onSignalRInitialPayload={this.onSignalRInitialPayload}
          onSignalRNotifyNewData={this.onSignalRNotifyNewData}
          onSignalRConnectionClosed={this.onSignalRConnectionClosed}
        />
        {this.state.leagues && this.state.leagues.length && (
          <React.Fragment>
            {this.state.error && (
              <div className="alert alert-danger">
                <b>Error</b>: {this.state.error}
                {' '}
                <a onClick={this.onClickReloadPage} className="text-primary" href="javascript:void(0);"><b>Reload page</b></a>
              </div>
            )}
            < hr />
            <FilterComponent
              onFilterChanged={() => { this.forceUpdate(); }}
              leagues={this.state.leagues}
              ref={(filterComponent) => { this.filterComponent = filterComponent!; }}
            />
            <hr />
            <CharacterTableComponent
              leagues={this.state.leagues}
              datapoints={datapoints}
              selectedLeague={this.state.selectedLeague}
              clickedLeague={this.onLeagueSelect}
            />
          </React.Fragment>
        ) || (
            // No data yet.
            <React.Fragment>
              <br />
              <div className="alert alert-info text-center">Loading data...</div>
            </React.Fragment>
          )}
      </React.Fragment>
    );
  }
}
