import { NativeSelect } from '@material-ui/core'
import React from 'react'

interface ILeagueSelectProps {
  selectedLeague: string
  leagues: poetracker.ILeagueType[]
  onLeagueSelect: (league: string) => void
}

const LeagueSelect = (props: ILeagueSelectProps) => {
  const standardLeagues = props.leagues.filter((e) => e.endAt === null)
  const temporaryLeagues = props.leagues.filter((e) => e.endAt !== null)

  const onChange = (evt: React.ChangeEvent<HTMLSelectElement>) => {
    props.onLeagueSelect(evt.currentTarget.value)
  }

  return (
    <NativeSelect
      id="id_league_select"
      value={props.selectedLeague}
      onChange={onChange}
    >
      <option value="">-- Show all --</option>
      {temporaryLeagues && temporaryLeagues.length && (
        <optgroup label="Temporary leagues">
          {temporaryLeagues.map((league) => (
            <option key={league.id} value={league.id}>
              {league.id}
            </option>
          ))}
        </optgroup>
      )}
      {standardLeagues && standardLeagues.length && (
        <optgroup label="Standard leagues">
          {standardLeagues.map((league) => (
            <option key={league.id} value={league.id}>
              {league.id}
            </option>
          ))}
        </optgroup>
      )}
    </NativeSelect>
  )
}
export default LeagueSelect
