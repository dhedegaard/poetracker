import React from 'react';

import CharacterTableComponent from './character-table.component';
import LeagueSelectComponent from './league-select.component';
import SignalRComponent, { InitialPayload } from './signalr.component';

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
}

interface AccountType {
  accountName: string;
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
    this.getCurrentLeague = this.getCurrentLeague.bind(this);
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
    console.log('NotifyNewData:', data);
    // Copy the datapoints state.
    let datapoints = this.state.datapoints.slice();

    // Iterate on the delta update, handling changes as we go along.
    for (const datapoint of data) {
      // Remove any existing entries for the given char.
      datapoints = datapoints.filter(e => e.charId !== datapoint.charId);

      // Push the new datapoint.
      datapoints.push(datapoint);
    }

    // Set the new state.
    this.setState({
      datapoints: datapoints.sort((a, b) => b.experience - a.experience),
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

  /**
   * Calculates and returns the current LeagueType object, based on what is current selected.
   */
  getCurrentLeague(): LeagueType | undefined {
    if (!this.state.selectedLeague) {
      return undefined;
    }
    return this.state.leagues.filter(e => e.id === this.state.selectedLeague)[0];
  }

  render() {
    const currentLeague = this.getCurrentLeague();
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
            <LeagueSelectComponent
              leagues={this.state.leagues}
              selectedLeague={this.state.selectedLeague}
              onLeagueSelect={this.onLeagueSelect}
            />
          </div>
          {this.state.selectedLeague && currentLeague && currentLeague.url && (
            <div className="d-none d-sm-block col-md-3">
              <a href={currentLeague.url} target="_blank" rel="nofollow">
                View league thread
              </a>
            </div>
          )}
        </div>
        <hr />
        <CharacterTableComponent
          leagues={this.state.leagues}
          datapoints={this.state.datapoints}
          selectedLeague={this.state.selectedLeague}
          clickedLeague={this.onLeagueSelect}
        />
      </React.Fragment>
    );
  }
}
