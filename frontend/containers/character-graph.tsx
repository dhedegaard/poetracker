import React from "react";
import { connect } from "react-redux";

import Loader from "../components/CharacterGraph/Loader";
import { IActionType } from "../poetracker";
import * as Action from "../store/actions";

const CharacterGraph = React.lazy(() => import("../components/CharacterGraph"));

export type ICharacterGraphStateToProps = ReturnType<typeof mapStateToProps>;
const mapStateToProps = (state: poetracker.IState) => ({
  from: state.graphFrom,
  graphData: state.chardata ? state.chardata.result : [],
  isLoadingGraphData: state.getCharData != null,
});

export interface ICharacterGraphDispatchToProps {
  fromChanged: (from: poetracker.GraphFromType) => void;
}
const mapDispatchToProps = (
  dispatch: (action: IActionType) => void,
): ICharacterGraphDispatchToProps => ({
  fromChanged: (from: poetracker.GraphFromType) =>
    dispatch(Action.graphFromChanged(from)),
});

const CharacterGraphContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)((props) => (
  <React.Suspense fallback={<Loader />}>
    <CharacterGraph {...props} />
  </React.Suspense>
));
export default CharacterGraphContainer;
