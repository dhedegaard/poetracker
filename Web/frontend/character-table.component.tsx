import React from "react";

import CharacterTableRowComponent from "./character-table-row.component";
import { IDatapoint, IDatapointResult, ILeagueType } from "./main.component";

interface ICharacterTableComponentProps {
  // Data
  datapoints: IDatapointResult[];
  leagues: ILeagueType[];
  // Filters
  selectedLeague: string;
  // Callbacks
  clickedLeague: (leagueId: string) => void;
  // Forwarded methods */
  getCharData: (charId: string) => Promise<IDatapoint[]>;
}

export default class CharacterTableComponent extends React.Component<ICharacterTableComponentProps, {}> {

  constructor(props: ICharacterTableComponentProps) {
    super(props);
  }

  render() {
    return (
      <div className="table-responsive">
        <table className="table table-bordered table-hover table-dark">
          <thead>
            <tr>
              <th>Rank</th>
              <th className="text-nowrap">Character name</th>
              <th>Class</th>
              <th className="text-right">Level</th>
              {!this.props.selectedLeague && (
                <th className="d-none d-sm-block">League</th>
              ) || undefined}
            </tr>
          </thead>
          <tbody>
            {this.props.datapoints.map((datapoint) => (
              <CharacterTableRowComponent
                datapoint={datapoint}
                getCharData={this.props.getCharData}
                selectedLeague={this.props.selectedLeague}
                clickedLeague={this.props.clickedLeague}
                key={
                  datapoint.datapoint.charId +
                  datapoint.datapoint.experience +
                  datapoint.datapoint.online +
                  datapoint.datapoint.dead
                }
              />
            ))}
            {!this.props.datapoints.length && (
              <tr>
                <td colSpan={4} className="text-center">
                  <b>Sorry!</b> I've got no datapoints for the given league, try filtering on another league.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    );
  }
}
