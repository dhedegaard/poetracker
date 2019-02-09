import { createSelector } from 'reselect'

const getFrom = (state: poetracker.IState) => state.graphFrom

export const getFromDate = createSelector(
  [getFrom],
  from => {
    switch (from) {
      case '1 week':
        return new Date(new Date().getTime() - 1000 * 60 * 60 * 24 * 7)
      case '3 days':
        return new Date(new Date().getTime() - 1000 * 60 * 60 * 24 * 3)
      case '1 day':
        return new Date(new Date().getTime() - 1000 * 60 * 60 * 24)
      case '6 hours':
        return new Date(new Date().getTime() - 1000 * 60 * 60 * 6)
      case '1 hour':
        return new Date(new Date().getTime() - 1000 * 60 * 60 * 1)
      case 'forever':
        return undefined
      default:
        throw new Error(`Unhandled case: ${from}`)
    }
  }
)
