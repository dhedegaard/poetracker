import { Box, FormLabel, NativeSelect, NoSsr, Paper } from '@material-ui/core'
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
  const nonTwitchAccounts = accounts.filter((e) => !e.twitchURL)
  const twitchAccounts = accounts.filter((e) => e.twitchURL)

  const onChangeSelectedLeague = (selectedLeague: string) =>
    onFilterChanged({
      ...filter,
      selectedLeague,
    })

  const onChangeHideDead = (evt: React.ChangeEvent<HTMLInputElement>) =>
    onFilterChanged({
      ...filter,
      hideDead: evt.currentTarget.checked,
    })

  const onChangeShowOnline = (evt: React.ChangeEvent<HTMLInputElement>) =>
    onFilterChanged({
      ...filter,
      onlyShowOnline: evt.currentTarget.checked,
    })

  const onChangeHideStreamers = (evt: React.ChangeEvent<HTMLInputElement>) =>
    onFilterChanged({
      ...filter,
      hideStreamers: evt.currentTarget.checked,
    })

  const onChangeHideStandardLeague = (
    evt: React.ChangeEvent<HTMLInputElement>
  ) =>
    onFilterChanged({
      ...filter,
      hideStandardLeagues: evt.currentTarget.checked,
    })

  const onShowOnlyAccount = (evt: React.ChangeEvent<HTMLSelectElement>) =>
    onFilterChanged({
      ...filter,
      showOnlyAccount: evt.currentTarget.value,
    })

  return (
    <Paper>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Box
          p={2}
          display="flex"
          flexDirection="column"
          height="100%"
          justifyContent="space-between"
        >
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            width="100%"
            maxWidth="350px"
          >
            <FormLabel htmlFor="id_league_select">League:&nbsp;</FormLabel>
            <Box minWidth="250px" display="flex" justifyContent="flex-end">
              <LeagueSelectComponent
                selectedLeague={filter.selectedLeague}
                leagues={leagues}
                onLeagueSelect={onChangeSelectedLeague}
              />
            </Box>
          </Box>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            width="100%"
            maxWidth="350px"
          >
            <FormLabel htmlFor="id_filter_account">Account:&nbsp;</FormLabel>
            <Box minWidth="250px" display="flex" justifyContent="flex-end">
              <NativeSelect
                id="id_filter_account"
                value={filter.showOnlyAccount}
                onChange={onShowOnlyAccount}
              >
                <option value="">-- Show all --</option>
                {nonTwitchAccounts && nonTwitchAccounts.length && (
                  <optgroup label="Accounts">
                    {nonTwitchAccounts.map((account) => (
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
                    {twitchAccounts.map((account) => (
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
              </NativeSelect>
            </Box>
          </Box>
        </Box>
        <Box display="flex" flexWrap="wrap">
          <NoSsr>
            <Box width="50%" flexBasis="50%">
              <FilterCheckbox
                checked={filter.hideDead}
                onChange={onChangeHideDead}
                label="Hide dead"
              />
            </Box>
            <Box width="50%" flexBasis="50%">
              <FilterCheckbox
                checked={filter.onlyShowOnline}
                onChange={onChangeShowOnline}
                label="Only show online"
              />
            </Box>
            <Box width="50%" flexBasis="50%">
              <FilterCheckbox
                checked={filter.hideStreamers}
                onChange={onChangeHideStreamers}
                label="Hide streamers"
              />
            </Box>
            <Box width="50%" flexBasis="50%">
              <FilterCheckbox
                checked={filter.hideStandardLeagues}
                onChange={onChangeHideStandardLeague}
                label="Hide standard"
              />
            </Box>
          </NoSsr>
        </Box>
      </Box>
    </Paper>
  )
}
export default Filter
