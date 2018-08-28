import { connect } from "react-redux";

import CharacterGraph from "../components/character-graph";
import { IActionType } from "../poetracker";
import * as Action from "../store/actions";

export interface ICharacterGraphStateToProps {
  graphData: poetracker.IGraphData[];
  from: poetracker.GraphFromType;
}
const mapStateToProps = (state: poetracker.IState): ICharacterGraphStateToProps => ({
  from: state.graphFrom,
  graphData: state.chardata ? state.chardata.result : [],
});

export interface ICharacterGraphDispatchToProps {
  fromChanged: (from: poetracker.GraphFromType) => void;
}
const mapDispatchToProps = (dispatch: (action: IActionType) => void): ICharacterGraphDispatchToProps => ({
  fromChanged: (from: poetracker.GraphFromType) => dispatch(Action.graphFromChanged(from)),
});

const CharacterGraphContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(CharacterGraph);
export default CharacterGraphContainer;
