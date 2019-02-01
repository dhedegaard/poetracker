import { connect } from "react-redux";

import SignalR from "../components/SignalR";
import * as actions from "../store/actions";

export type ISignalRStateToProps = ReturnType<typeof mapStateToProps>;
const mapStateToProps = (state: poetracker.IState) => ({
  getCharData: state.getCharData,
});

export type ISignalRDispatchToProps = ReturnType<typeof mapDispatchToProps>;
const mapDispatchToProps = (
  dispatch: (action: poetracker.IActionType) => void,
) => ({
  onSignalRConnectionClosed: () =>
    dispatch(actions.setError("SignalR connnection got lost, try reloading.")),
  onSignalRInitialPayload: (data: poetracker.IInitialPayload) =>
    dispatch(actions.initialData(data)),
  onSignalRNotifyNewData: (data: poetracker.IDatapointResult[]) =>
    dispatch(actions.notifyNewData(data)),
  receivedCharData: (result: poetracker.IGetCharDataResult) =>
    dispatch(actions.receivedCharData(result)),
});

const SignalRContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(SignalR);
export default SignalRContainer;
