import * as React from "react";

import Main from "../components/Main";
import SignalRContainer from "./signalr";

const MainContainer: React.FunctionComponent<{}> = () => {
  React.useEffect(() => {
    // Patch in a font and use it everywhere (after it's done loading).
    const link = document.createElement("link");
    link.href = "https://fonts.googleapis.com/css?family=Open+Sans:400,700";
    link.rel = "stylesheet";
    link.onload = () => {
      document.body.style.fontFamily = `"Open Sans", sans-serif`;
    };
    document.head.appendChild(link);
    return () => {
      document.head.removeChild(link);
    };
  }, []);

  return (
    <>
      <Main />
      <SignalRContainer />
    </>
  );
};

export default MainContainer;
