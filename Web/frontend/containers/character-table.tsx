import * as React from 'react';
import { connect } from "react-redux";
import CharacterTable, { ICharacterTableProps } from "../components/character-table";
import { getCharData } from "../store/actions";

const mapStateToProps = (state: poetracker.IState): Partial<ICharacterTableProps> => ({
  datapoints: state.filteredDatapoints,
  leagues: state.leagues,
  selectedRow: state.selectedRow,
});

const mapDispatchToProps = (dispatch: (action: poetracker.IActionType) => void): Partial<ICharacterTableProps> => ({
  getCharData: (leagueId: string, charname: string) => dispatch(getCharData(leagueId, charname)),
});

const CharacterTableContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(CharacterTable);
export default CharacterTableContainer;
