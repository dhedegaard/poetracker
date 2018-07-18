import * as React from "react";

import Main from "../components/main";
import SignalRContainer from "./signalr";

export default class MainContainer extends React.Component<{}, {}> {
  componentDidMount() {
    // Patch in a font and use it everywhere (after it's done loading).
    const link = document.createElement("link");
    link.href = "https://fonts.googleapis.com/css?family=Open+Sans:400,700";
    link.rel = "stylesheet";
    link.onload = () => {
      document.body.style.fontFamily = `"Open Sans", sans-serif`;
    };
    document.head.appendChild(link);
  }

  render() {
    return (
      <React.Fragment>
        <Main />
        <SignalRContainer />
      </React.Fragment>
    );
  }
}
