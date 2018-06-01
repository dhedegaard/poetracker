import React from "react";

import { ILeagueType } from "./main.component";

interface ILeagueSelectComponentProps {
  selectedLeague: string;
  leagues: ILeagueType[];
  onLeagueSelect: (league: string) => void;
}

export default class LeagueSelectComponent extends React.Component<ILeagueSelectComponentProps, {}> {
  render() {
    const standardLeagues = this.props.leagues.filter((e) => e.endAt === null);
    const temporaryLeagues = this.props.leagues.filter((e) => e.endAt !== null);

    return (
      <select
        className="form-control form-control-sm"
        id="id_league_select"
        value={this.props.selectedLeague}
        onChange={(evt) => { this.props.onLeagueSelect(evt.currentTarget.value); }}
      >
        <option value="">-- Show all --</option>
        {temporaryLeagues && temporaryLeagues.length && (
          <React.Fragment>
            <optgroup label="Temporary leagues">
              {temporaryLeagues.map((league) => (
                <option key={league.id} value={league.id}>{league.id}</option>
              ))}
            </optgroup>
          </React.Fragment>
        )}
        {standardLeagues && standardLeagues.length && (
          <React.Fragment>
            <optgroup label="Standard leagues">
              {standardLeagues.map((league) => (
                <option key={league.id} value={league.id}>{league.id}</option>
              ))}
            </optgroup>
          </React.Fragment>
        )}
      </select>
    );
  }
}
