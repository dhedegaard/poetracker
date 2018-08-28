import { connect } from "react-redux";

import SignalR from "../components/signalr";
import * as actions from "../store/actions";

export interface ISignalRStateToProps {
  getCharData?: poetracker.IGetCharDataInput;
}
const mapStateToProps = (state: poetracker.IState): ISignalRStateToProps => ({
  getCharData: state.getCharData,
});

export interface ISignalRDispatchToProps {
  onSignalRNotifyNewData: (data: poetracker.IDatapointResult[]) => void;
  onSignalRInitialPayload: (data: poetracker.IInitialPayload) => void;
  onSignalRConnectionClosed: () => void;
  receivedCharData: (chardata: poetracker.IGetCharDataResult) => void;
}
const mapDispatchToProps = (dispatch: (action: poetracker.IActionType) => void): ISignalRDispatchToProps => ({
  onSignalRConnectionClosed: () => dispatch(actions.setError("SignalR connnection got lost, try reloading.")),
  onSignalRInitialPayload: (data: poetracker.IInitialPayload) => dispatch(actions.initialData(data)),
  onSignalRNotifyNewData: (data: poetracker.IDatapointResult[]) => dispatch(actions.notifyNewData(data)),
  receivedCharData: (result: poetracker.IGetCharDataResult) => dispatch(actions.receivedCharData(result)),
});

const SignalRContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(SignalR);
export default SignalRContainer;
