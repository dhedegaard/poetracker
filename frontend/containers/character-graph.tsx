import React from "react";
import { connect } from "react-redux";

import { IActionType } from "../poetracker";
import * as Action from "../store/actions";

const CharacterGraph = React.lazy(() =>
  import("../components/character-graph"),
);

export interface ICharacterGraphStateToProps {
  graphData: poetracker.IGraphData[];
  from: poetracker.GraphFromType;
}
const mapStateToProps = (
  state: poetracker.IState,
): ICharacterGraphStateToProps => ({
  from: state.graphFrom,
  graphData: state.chardata ? state.chardata.result : [],
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
  <React.Suspense
    fallback={
      <div
        style={{
          color: "#000",
          fontSize: 24,
          textAlign: "center",
        }}
      >
        loading...
      </div>
    }
  >
    <CharacterGraph {...props} />
  </React.Suspense>
));
export default CharacterGraphContainer;
