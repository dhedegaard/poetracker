import { connect } from 'react-redux'
import Filter from '../components/Filter'
import { filterChanged } from '../store/actions'

const mapStateToProps = (state: poetracker.IState) => ({
  accounts: state.accounts,
  filter: state.filter,
  leagues: state.leagues
})

const mapDispatchToProps = (
  dispatch: (action: poetracker.IActionType) => void
) => ({
  onFilterChanged: (filterState: poetracker.IFilter) =>
    dispatch(filterChanged(filterState))
})

const FilterContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Filter)
export default FilterContainer
