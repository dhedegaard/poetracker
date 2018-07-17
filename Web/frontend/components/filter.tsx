import React from "react";
import LeagueSelectComponent from "./league-select";

interface IFilterProps {
  accounts: poetracker.IAccountType[];
  leagues: poetracker.ILeagueType[];
  filter: poetracker.IFilter;
  onFilterChanged: (filter: poetracker.IFilter) => void;
}

export default class Filter extends React.Component<IFilterProps, {}> {
  constructor(props: IFilterProps) {
    super(props);
  }

  render() {
    const { filter, accounts, leagues, onFilterChanged } = this.props;
    const nonTwitchAccounts = accounts.filter((e) => !e.twitchURL);
    const twitchAccounts = accounts.filter((e) => e.twitchURL);

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
                  selectedLeague={filter.selectedLeague}
                  leagues={leagues}
                  onLeagueSelect={(selectedLeague) => onFilterChanged({
                    ...filter,
                    selectedLeague,
                  })}
                />
              </div>
            </div>
          </div>
          <div className="col-md-7 col-12">
            <div className="row">
              <div className="col-md-2">
                <input
                  id="id_hide_dead"
                  type="checkbox"
                  checked={filter.hideDead}
                  onChange={(evt) => onFilterChanged({
                    ...filter,
                    hideDead: evt.currentTarget.checked,
                  })}
                />
                <label htmlFor="id_hide_dead">
                  <small>Hide dead</small>
                </label>
              </div>
              <div className="col-md-3">
                <input
                  id="id_only_show_online"
                  type="checkbox"
                  checked={filter.onlyShowOnline}
                  onChange={(evt) => onFilterChanged({
                    ...filter,
                    onlyShowOnline: evt.currentTarget.checked,
                  })}
                />
                <label htmlFor="id_only_show_online">
                  <small>Only show online</small>
                </label>
              </div>
              <div className="col-md-3">
                <input
                  id="id_hide_streamers"
                  type="checkbox"
                  checked={filter.hideStreamers}
                  onChange={(evt) => onFilterChanged({
                    ...filter,
                    hideStreamers: evt.currentTarget.checked,
                  })}
                />
                <label htmlFor="id_hide_streamers">
                  <small>Hide streamers</small>
                </label>
              </div>
              <div className="col-md-4">
                <input
                  id="id_hide_standard_leagues"
                  type="checkbox"
                  checked={filter.hideStandardLeagues}
                  onChange={(evt) => onFilterChanged({
                    ...filter,
                    hideStandardLeagues: evt.currentTarget.checked,
                  })}
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
              <label htmlFor="id_filter_account" className="col-4 col-md-2 text-right">Account:</label>
              <div className="col-md-6">
                <select
                  id="id_filter_account"
                  value={filter.showOnlyAccount}
                  className="form-control form-control-sm"
                  onChange={(evt) => onFilterChanged({
                    ...filter,
                    showOnlyAccount: evt.currentTarget.value,
                  })}
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
