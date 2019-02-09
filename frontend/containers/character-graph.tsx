import React from 'react'
import { connect } from 'react-redux'

import Loader from '../components/CharacterGraph/Loader'

const CharacterGraph = React.lazy(() => import('../components/CharacterGraph'))

export type ICharacterGraphStateToProps = ReturnType<typeof mapStateToProps>
const mapStateToProps = (state: poetracker.IState) => ({
  from: state.graphFrom,
  graphData: state.chardata ? state.chardata.result : [],
  isLoadingGraphData: state.getCharData != null
})

const CharacterGraphContainer = connect(mapStateToProps)(props => (
  <React.Suspense fallback={<Loader />}>
    <CharacterGraph {...props} />
  </React.Suspense>
))
export default CharacterGraphContainer
