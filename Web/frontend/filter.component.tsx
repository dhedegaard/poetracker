import React from "react";
import LeagueSelectComponent from "./league-select.component";
import { LeagueType, Datapoint, DatapointResult } from "./main.component";

interface FilterComponentProps {
  leagues: LeagueType[];
  onFilterChanged: () => void;
}

interface FilterComponentState {
  selectedLeague: string;
  hideDead: boolean;
  onlyShowOnline: boolean;
  hideStreamers: boolean;
}

export default class FilterComponent extends React.Component<FilterComponentProps, FilterComponentState> {
  constructor(props: FilterComponentProps) {
    super(props);
    this.onLeagueSelect = this.onLeagueSelect.bind(this);
    this.getCurrentLeague = this.getCurrentLeague.bind(this);

    /* Determine the initial state. */
    this.state = {
      selectedLeague: '',
      hideDead: false,
      onlyShowOnline: false,
      hideStreamers: false,
    };
    const oldState = localStorage.getItem('filterState');
    if (oldState) {
      try {
        this.state = JSON.parse(oldState) as FilterComponentState;
      } catch { };
    }
  }

  /**
   * Filters the given datapoints based on the current state.
   */
  public filterDatapoints(datapoints: DatapointResult[]): DatapointResult[] {
    // Filter based on league.
    if (this.state.selectedLeague) {
      datapoints = datapoints
        .filter(e => e.datapoint.leagueId === this.state.selectedLeague);
    }

    // Filter away the dead.
    if (this.state.hideDead) {
      datapoints = datapoints.filter(e => !e.datapoint.dead);
    }

    // Filter away the offline.
    if (this.state.onlyShowOnline) {
      datapoints = datapoints.filter(e => e.datapoint.online);
    }

    // Filter away the streamers.
    if (this.state.hideStreamers) {
      datapoints = datapoints.filter(e => !e.datapoint.account.twitchUsername)
    }

    // Finally, sort and return whatever remains.
    return datapoints.sort((a, b) =>
      a.datapoint.experience === b.datapoint.experience ?
        a.datapoint.globalRank - b.datapoint.globalRank :
        b.datapoint.experience - a.datapoint.experience);
  }

  onLeagueSelect(league: string) {
    this.setState({
      selectedLeague: league,
    });
  }

  /**
   * Calculates and returns the current LeagueType object, based on what is current selected.
   */
  getCurrentLeague(): LeagueType | undefined {
    if (!this.state.selectedLeague) {
      return undefined;
    }
    return this.props.leagues.filter(e => e.id === this.state.selectedLeague)[0];
  }

  componentDidUpdate(prevProps: FilterComponentProps, prevState: FilterComponentState) {
    if (prevState != this.state) {
      /* If the state changes, store the new state and propagate. */
      localStorage.setItem('filterState', JSON.stringify(this.state));
      this.props.onFilterChanged();
    }
  }

  render() {
    const currentLeague = this.getCurrentLeague();

    return (
      <div className="row form-row">
        <div className="col-md-6 col-12">
          <div className="row">
            <label
              className="col-4 col-md-2 text-right"
              htmlFor="id_league_select"
            >
              League:
            </label>
            <div className="col-md-6">
              <LeagueSelectComponent
                selectedLeague={this.state.selectedLeague}
                leagues={this.props.leagues}
                onLeagueSelect={this.onLeagueSelect}
              />
            </div>
            {this.state.selectedLeague && currentLeague && currentLeague.url && (
              <div className="d-none d-sm-block col-md-4">
                <a href={currentLeague.url} target="_blank" rel="nofollow">
                  View league thread
              </a>
              </div>
            )}
          </div>
        </div>
        <div className="col-md-6 col-12">
          <div className="row">
            <div className="col-md-4">
              <input
                id="id_hide_dead"
                type="checkbox"
                checked={this.state.hideDead}
                onChange={(evt) => {
                  this.setState({ hideDead: evt.currentTarget.checked, });
                }}
              />
              < label htmlFor="id_hide_dead">Hide dead</label>
            </div>
            <div className="col-md-4">
              <input
                id="id_only_show_online"
                type="checkbox"
                checked={this.state.onlyShowOnline}
                onChange={(evt) => {
                  this.setState({ onlyShowOnline: evt.currentTarget.checked, });
                }}
              />
              <label htmlFor="id_only_show_online">Only show online</label>
            </div>
            <div className="col-md-4">
              <input
                id="id_hide_streamers"
                type="checkbox"
                checked={this.state.hideStreamers}
                onChange={(evt) => {
                  this.setState({ hideStreamers: evt.currentTarget.checked, });
                }}
              />
              <label htmlFor="id_hide_streamers">Hide streamers</label>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
