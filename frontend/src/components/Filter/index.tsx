import React from 'react'
import FilterCheckbox from './FilterCheckbox'
import LeagueSelectComponent from './LeagueSelect'

interface IFilterProps {
  accounts: poetracker.IAccountType[]
  leagues: poetracker.ILeagueType[]
  filter: poetracker.IFilter
  onFilterChanged: (filter: poetracker.IFilter) => void
}

const Filter = (props: IFilterProps) => {
  const { filter, accounts, leagues, onFilterChanged } = props
  const nonTwitchAccounts = accounts.filter(e => !e.twitchURL)
  const twitchAccounts = accounts.filter(e => e.twitchURL)

  const onChangeSelectedLeague = (selectedLeague: string) =>
    onFilterChanged({
      ...filter,
      selectedLeague
    })

  const onChangeHideDead = (evt: React.ChangeEvent<HTMLInputElement>) =>
    onFilterChanged({
      ...filter,
      hideDead: evt.currentTarget.checked
    })

  const onChangeShowOnline = (evt: React.ChangeEvent<HTMLInputElement>) =>
    onFilterChanged({
      ...filter,
      onlyShowOnline: evt.currentTarget.checked
    })

  const onChangeHideStreamers = (evt: React.ChangeEvent<HTMLInputElement>) =>
    onFilterChanged({
      ...filter,
      hideStreamers: evt.currentTarget.checked
    })

  const onChangeHideStandardLeague = (
    evt: React.ChangeEvent<HTMLInputElement>
  ) =>
    onFilterChanged({
      ...filter,
      hideStandardLeagues: evt.currentTarget.checked
    })

  const onShowOnlyAccount = (evt: React.ChangeEvent<HTMLSelectElement>) =>
    onFilterChanged({
      ...filter,
      showOnlyAccount: evt.currentTarget.value
    })

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
                onLeagueSelect={onChangeSelectedLeague}
              />
            </div>
          </div>
        </div>
        <div className="col-md-7 col-12">
          <div className="row">
            <FilterCheckbox
              checked={filter.hideDead}
              onChange={onChangeHideDead}
              label="Hide dead"
            />
            <FilterCheckbox
              checked={filter.onlyShowOnline}
              onChange={onChangeShowOnline}
              label="Only show online"
            />
            <FilterCheckbox
              checked={filter.hideStreamers}
              onChange={onChangeHideStreamers}
              label="Hide streamers"
            />
            <FilterCheckbox
              checked={filter.hideStandardLeagues}
              onChange={onChangeHideStandardLeague}
              label="Hide standard"
            />
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-md-5 col-12">
          <div className="row">
            <label
              htmlFor="id_filter_account"
              className="col-4 col-md-2 text-right"
            >
              Account:
            </label>
            <div className="col-md-6">
              <select
                id="id_filter_account"
                value={filter.showOnlyAccount}
                className="form-control form-control-sm"
                onChange={onShowOnlyAccount}
              >
                <option value="">-- Show all --</option>
                {nonTwitchAccounts && nonTwitchAccounts.length && (
                  <optgroup label="Accounts">
                    {nonTwitchAccounts.map(account => (
                      <option
                        key={account.accountName}
                        value={account.accountName}
                      >
                        {account.accountName}
                      </option>
                    ))}
                  </optgroup>
                )}
                {twitchAccounts && twitchAccounts.length && (
                  <optgroup label="Streamers">
                    {twitchAccounts.map(account => (
                      <option
                        key={account.accountName}
                        value={account.accountName}
                      >
                        {account.accountName}
                        {account.twitchUsername !== account.accountName &&
                          ` (${account.twitchUsername})`}
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
  )
}
export default Filter
