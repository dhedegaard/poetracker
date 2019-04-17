import React from 'react'

import CharacterTableContainer from '../containers/character-table'
import ErrorContainer from '../containers/error'
import FilterContainer from '../containers/filter'
import Loading from './Loading'

const Main: React.FunctionComponent<{}> = () => (
  <>
    <ErrorContainer />
    <FilterContainer />
    <hr />
    <CharacterTableContainer />
    <Loading />
  </>
)
export default Main
