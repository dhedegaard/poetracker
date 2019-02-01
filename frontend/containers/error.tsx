import { connect } from "react-redux";

import Error, { IErrorProps } from "../components/Error";

const mapStateToProps = (state: poetracker.IState): IErrorProps => ({
  error: state.error,
});

const ErrorContainer = connect(
  mapStateToProps,
)(Error);
export default ErrorContainer;
