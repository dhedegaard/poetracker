import React from 'react';

import CharacterTableComponent from './character-table.component';
import LeagueSelectComponent from './league-select.component';
import SignalRComponent, { InitialPayload } from './signalr.component';

export interface Datapoint {
  accountId: string;
  charname: string;
  experience: number;
  globalRank: number;
  leagueId: string;
  level: number;
  timestamp: string;
  class: string;
  dead: boolean;
  online: boolean;
}

export interface LeagueType {
  id: string;
  startAt: string;
  endAt?: string;
}


interface MainComponentState {
  error: string;
  leagues: LeagueType[];
  selectedLeague: string;
  datapoints: Datapoint[];
}

export default class MainComponent extends React.Component<{}, MainComponentState> {

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
    this.onLeagueSelect = this.onLeagueSelect.bind(this);
    this.onClickReloadPage = this.onClickReloadPage.bind(this);
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

    this.setState({
      leagues: data.leagues,
      selectedLeague: selectedLeague,
      datapoints: data.latestDatapoints
        .sort((a, b) => b.experience - a.experience),
    });
    console.log('initial payload:', data);
  }

  /**
   * Triggers when there's new delta data to work on.
   */
  onSignalRNotifyNewData(data: Datapoint[]) {
    console.log('TODO data:', data);
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
    return (
      <React.Fragment>
        <SignalRComponent
          onSignalRInitialPayload={this.onSignalRInitialPayload}
          onSignalRNotifyNewData={this.onSignalRNotifyNewData}
        />
        <h2>Poetracker</h2>
        {this.state.error && (
          <div className="alert alert-danger">
            <b>Error</b>: {this.state.error}
            <a onClick={this.onClickReloadPage} className="text-muted" href="javascript:void(0);"><b>Please try reloading the page</b></a>
          </div>
        )}
        <hr />
        <div className="row form-rom">
          <label className="col-3 col-md-2 text-right" htmlFor="id_league_select">League:</label>
          <div className="col-9 col-md-4">
            <LeagueSelectComponent leagues={this.state.leagues} selectedLeague={this.state.selectedLeague} onLeagueSelect={this.onLeagueSelect} />
          </div>
        </div>
        <hr />
        <CharacterTableComponent datapoints={this.state.datapoints} selectedLeague={this.state.selectedLeague} />
      </React.Fragment>
    );
  }
}
