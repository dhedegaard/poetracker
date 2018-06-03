import React from "react";

import CharacterTableRowComponent from "./character-table-row.component";
import { IDatapoint, IDatapointResult, ILeagueType } from "./main.component";

interface ICharacterTableComponentProps {
  // Data
  datapoints: IDatapointResult[];
  leagues: ILeagueType[];
  // Filters
  selectedLeague: string;
  // Forwarded methods */
  getCharData: (leagueId: string, charname: string) => Promise<IDatapoint[]>;
}

interface IComponentState {
  selectedRow: {
    charname: string,
    leagueId: string,
  } | undefined;
}

export default class CharacterTableComponent extends React.Component<ICharacterTableComponentProps, IComponentState> {
  state: IComponentState = {
    selectedRow: undefined,
  };

  constructor(props: ICharacterTableComponentProps) {
    super(props);
    this.onClickedRow = this.onClickedRow.bind(this);
  }

  onClickedRow(charname: string, leagueId: string) {
    this.setState((oldState) => {
      // If we selected the same row again, collapse it. */
      if (oldState.selectedRow &&
        oldState.selectedRow.charname === charname &&
        oldState.selectedRow.leagueId === leagueId
      ) {
        return {
          selectedRow: undefined,
        };
      }

      /* Otherwise, modify the state. */
      return {
        selectedRow: { charname, leagueId },
      };
    });
  }

  render() {
    return (
      <div className="table-responsive" style={{ overflowX: 'hidden' }}>
        <table className="table table-bordered table-hover table-dark">
          <thead>
            <tr>
              <th>Rank</th>
              <th className="text-nowrap">Character name</th>
              <th>Class</th>
              <th className="text-right">Level</th>
            </tr>
          </thead>
          <tbody>
            {this.props.datapoints.map((datapoint) => (
              <CharacterTableRowComponent
                datapoint={datapoint}
                getCharData={this.props.getCharData}
                selectedLeague={this.props.selectedLeague}
                clickedRow={this.onClickedRow}
                isSelected={
                  this.state.selectedRow !== undefined &&
                  this.state.selectedRow.charname === datapoint.datapoint.charname &&
                  this.state.selectedRow.leagueId === datapoint.datapoint.leagueId
                }
                key={
                  datapoint.datapoint.charname +
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
