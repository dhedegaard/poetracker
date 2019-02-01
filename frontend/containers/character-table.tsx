import { connect } from "react-redux";

import CharacterTable from "../components/CharacterTable";
import { getCharData } from "../store/actions";

export interface ICharacterTableStateToProps {
  datapoints: poetracker.IDatapointResult[];
  leagues: poetracker.ILeagueType[];
  selectedRow?: poetracker.ISelectedRowType;
}
const mapStateToProps = (state: poetracker.IState): ICharacterTableStateToProps => ({
  datapoints: state.filteredDatapoints,
  leagues: state.leagues,
  selectedRow: state.selectedRow,
});

export interface ICharacterTableDispatchToProps {
  getCharData: (leagueId: string, charname: string) => void;
}
const mapDispatchToProps = (dispatch: (action: poetracker.IActionType) => void): ICharacterTableDispatchToProps => ({
  getCharData: (leagueId: string, charname: string) => dispatch(getCharData(leagueId, charname)),
});

const CharacterTableContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(CharacterTable);
export default CharacterTableContainer;
