import { connect } from "react-redux";

import CharacterTable from "../components/CharacterTable";
import { getCharData } from "../store/actions";

export type ICharacterTableStateToProps = ReturnType<typeof mapStateToProps>;
const mapStateToProps = (state: poetracker.IState) => ({
  datapoints: state.filteredDatapoints,
  leagues: state.leagues,
  selectedRow: state.selectedRow,
});

export type ICharacterTableDispatchToProps = ReturnType<typeof mapDispatchToProps>;
const mapDispatchToProps = (dispatch: (action: poetracker.IActionType) => void) => ({
  getCharData: (leagueId: string, charname: string) => dispatch(getCharData(leagueId, charname)),
});

const CharacterTableContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(CharacterTable);
export default CharacterTableContainer;
