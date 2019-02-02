﻿import React from "react";

import CharacterTableContainer from "../containers/character-table";
import ErrorContainer from "../containers/error";
import FilterContainer from "../containers/filter";

const Main: React.SFC<{}> = () => (
  <>
    <ErrorContainer />
    <FilterContainer />
    <hr />
    <CharacterTableContainer />
  </>
);
export default Main;
