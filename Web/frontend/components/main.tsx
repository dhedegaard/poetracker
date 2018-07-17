import React from 'react';

import CharacterTableContainer from "../containers/character-table";
import ErrorContainer from "../containers/error";
import FilterContainer from "../containers/filter";

const Main = () => {
  return (
    <React.Fragment>
      <ErrorContainer />
      <FilterContainer />
      <hr />
      <CharacterTableContainer />
    </React.Fragment>
  );
};
export default Main;
