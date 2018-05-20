import React from "react";

import { LeagueType } from "./main.component";

interface LeagueSelectComponentProps {
  selectedLeague: string;
  leagues: LeagueType[];
  onLeagueSelect: (league: string) => void;
}

export default class LeagueSelectComponent extends React.Component<LeagueSelectComponentProps, {}> {
  render() {
    return (
      <select className="form-control form-control-sm" id="id_league_select" value={this.props.selectedLeague} onChange={(evt) => { this.props.onLeagueSelect(evt.currentTarget.value); }}>
        <option value="">-- Show all</option>
        {this.props.leagues.map((league) => (
          <option key={league.id} value={league.id}>{league.id}</option>
        ))}
      </select>
    );
  }
}