import { connect } from "react-redux";
import CharacterGraph, { ICharacterGraphProps } from "../components/character-graph";
import { IActionType } from "../poetracker";
import * as Action from "../store/actions";

const mapStateToProps = (state: poetracker.IState): Partial<ICharacterGraphProps> => ({
  from: state.graphFrom,
  graphData: state.chardata ? state.chardata.result : [],
});

const mapDespatchToProps = (despatch: (action: IActionType) => void): Partial<ICharacterGraphProps> => ({
  fromChanged: (from: poetracker.GraphFromType) => despatch(Action.graphFromChanged(from)),
});

const CharacterGraphContainer = connect(
  mapStateToProps,
  mapDespatchToProps,
)(CharacterGraph);
export default CharacterGraphContainer;
