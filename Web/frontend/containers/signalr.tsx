import { connect } from "react-redux";
import SignalR, { ISignalRProps } from "../components/signalr";
import * as actions from "../store/actions";

const mapStateToProps = (state: poetracker.IState): Partial<ISignalRProps> => ({
  getCharData: state.getCharData,
});

const mapDispatchToProps = (dispatch: (action: poetracker.IActionType) => void): ISignalRProps => ({
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
