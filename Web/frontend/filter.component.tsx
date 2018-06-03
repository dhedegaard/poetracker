import React from "react";
import LeagueSelectComponent from "./league-select.component";
import {
  IAccountType,
  IDatapoint,
  IDatapointResult,
  ILeagueType,
} from "./main.component";

interface IFilterComponentProps {
  accounts: IAccountType[];
  leagues: ILeagueType[];
  onFilterChanged: () => void;
}

interface IFilterComponentState {
  selectedLeague: string;
  hideDead: boolean;
  onlyShowOnline: boolean;
  hideStreamers: boolean;
  hideStandardLeagues: boolean;
  showOnlyAccount?: string;
}

export default class FilterComponent extends React.Component<IFilterComponentProps, IFilterComponentState> {
  constructor(props: IFilterComponentProps) {
    super(props);
    this.onLeagueSelect = this.onLeagueSelect.bind(this);
    this.getCurrentLeague = this.getCurrentLeague.bind(this);

    /* Determine the initial state. */
    this.state = {
      hideDead: false,
      hideStandardLeagues: false,
      hideStreamers: false,
      onlyShowOnline: false,
      selectedLeague: '',
    };
    const oldState = localStorage.getItem('filterState');
    if (oldState) {
      try {
        this.state = JSON.parse(oldState) as IFilterComponentState;
      } catch { /* noop */ }
    }
  }

  /**
   * Filters the given datapoints based on the current state.
   */
  public filterDatapoints(datapoints: IDatapointResult[]): IDatapointResult[] {
    // Filter based on league.
    if (this.state.selectedLeague) {
      datapoints = datapoints
        .filter((e) => e.datapoint.leagueId === this.state.selectedLeague);
    }

    // Filter away the dead.
    if (this.state.hideDead) {
      datapoints = datapoints.filter((e) => !e.datapoint.dead);
    }

    // Filter away the offline.
    if (this.state.onlyShowOnline) {
      datapoints = datapoints.filter((e) => e.datapoint.online);
    }

    // Filter away the streamers.
    if (this.state.hideStreamers) {
      datapoints = datapoints.filter((e) => !e.datapoint.account.twitchUsername);
    }

    // Filter away standard leagues.
    if (this.state.hideStandardLeagues) {
      datapoints = datapoints.filter((e) => e.datapoint.league.endAt !== null);
    }

    if (this.state.showOnlyAccount) {
      datapoints = datapoints.filter((e) => e.datapoint.accountId === this.state.showOnlyAccount);
    }

    // Finally, sort and return whatever remains.
    return datapoints.sort((a, b) =>
      a.datapoint.experience === b.datapoint.experience ?
        (a.datapoint.globalRank || 15001) - (b.datapoint.globalRank || 15001) :
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
  getCurrentLeague(): ILeagueType | undefined {
    if (!this.state.selectedLeague) {
      return undefined;
    }
    return this.props.leagues.filter((e) => e.id === this.state.selectedLeague)[0];
  }

  componentDidUpdate(prevProps: IFilterComponentProps, prevState: IFilterComponentState) {
    if (prevState !== this.state) {
      /* If the state changes, store the new state and propagate. */
      localStorage.setItem('filterState', JSON.stringify(this.state));
      this.props.onFilterChanged();
    }
  }

  render() {
    const currentLeague = this.getCurrentLeague();

    const nonTwitchAccounts = this.props.accounts.filter((e) => !e.twitchURL);
    const twitchAccounts = this.props.accounts.filter((e) => e.twitchURL);

    return (
      <div className="alert alert-secondary">
        <div className="row">
          <div className="col-md-5 col-12">
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
                    <small>View league thread</small>
                  </a>
                </div>
              )}
            </div>
          </div>
          <div className="col-md-7 col-12">
            <div className="row">
              <div className="col-md-2">
                <input
                  id="id_hide_dead"
                  type="checkbox"
                  checked={this.state.hideDead}
                  onChange={(evt) => {
                    this.setState({ hideDead: evt.currentTarget.checked });
                  }}
                />
                <label htmlFor="id_hide_dead">
                  <small>Hide dead</small>
                </label>
              </div>
              <div className="col-md-3">
                <input
                  id="id_only_show_online"
                  type="checkbox"
                  checked={this.state.onlyShowOnline}
                  onChange={(evt) => {
                    this.setState({ onlyShowOnline: evt.currentTarget.checked });
                  }}
                />
                <label htmlFor="id_only_show_online">
                  <small>Only show online</small>
                </label>
              </div>
              <div className="col-md-3">
                <input
                  id="id_hide_streamers"
                  type="checkbox"
                  checked={this.state.hideStreamers}
                  onChange={(evt) => {
                    this.setState({ hideStreamers: evt.currentTarget.checked });
                  }}
                />
                <label htmlFor="id_hide_streamers">
                  <small>Hide streamers</small>
                </label>
              </div>
              <div className="col-md-4">
                <input
                  id="id_hide_standard_leagues"
                  type="checkbox"
                  checked={this.state.hideStandardLeagues}
                  onChange={(evt) => {
                    this.setState({ hideStandardLeagues: evt.currentTarget.checked });
                  }}
                />
                <label htmlFor="id_hide_standard_leagues">
                  <small>Hide standard leagues</small>
                </label>
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-md-5 col-12">
            <div className="row">
              <label className="col-4 col-md-2 text-right">Account:</label>
              <div className="col-md-6">
                <select
                  id="id_filter_account"
                  value={this.state.showOnlyAccount}
                  className="form-control form-control-sm"
                  onChange={(evt) => { this.setState({ showOnlyAccount: evt.currentTarget.value }); }}
                >
                  <option value="">-- Show all --</option>
                  {nonTwitchAccounts && nonTwitchAccounts.length && (
                    <optgroup label="Accounts">
                      {nonTwitchAccounts.map((account) => (
                        <option key={account.accountName} value={account.accountName}>
                          {account.accountName}
                        </option>
                      ))}
                    </optgroup>
                  )}
                  {twitchAccounts && twitchAccounts.length && (
                    <optgroup label="Streamers">
                      {twitchAccounts.map((account) => (
                        <option key={account.accountName} value={account.accountName}>
                          {account.accountName}
                          {account.twitchUsername !== account.accountName && (
                            <React.Fragment>
                              ({account.twitchUsername})
                            </React.Fragment>
                          )}
                        </option>
                      ))}
                    </optgroup>
                  )}
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
