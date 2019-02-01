import React from "react";

import { ICharacterTableDispatchToProps, ICharacterTableStateToProps } from "../../containers/character-table";
import Row from "./Row";

type IProps = ICharacterTableStateToProps & ICharacterTableDispatchToProps;

const CharacterTable = (props: IProps) => {
  const onClickedRow = (charname: string, leagueId: string) => {
    const { selectedRow, getCharData } = props;
    if (selectedRow && selectedRow.charname === charname && selectedRow.leagueId === leagueId) {
      getCharData("", "");
    } else {
      getCharData(leagueId, charname);
    }
  };

  return (
    <div className="table-responsive-sm">
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
          {props.datapoints.map((datapoint) => (
            <Row
              datapoint={datapoint}
              clickedRow={onClickedRow}
              isSelected={
                props.selectedRow !== undefined &&
                props.selectedRow.charname === datapoint.datapoint.charname &&
                props.selectedRow.leagueId === datapoint.datapoint.leagueId
              }
              key={datapoint.datapoint.id}
            />
          ))}
          {!props.datapoints.length && (
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
};
export default CharacterTable;
