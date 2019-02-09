import React from 'react'
import { connect } from 'react-redux'
import { IActionType } from '../../poetracker'
import { graphFromChanged } from '../../store/actions'

type Props = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps>

const ShowFromSelect: React.FunctionComponent<Props> = props => {
  const onSelectChanged = (evt: React.ChangeEvent<HTMLSelectElement>) => {
    props.fromChanged(evt.currentTarget.value as poetracker.GraphFromType)
  }

  return (
    <div className="row" style={{ paddingBottom: 20 }}>
      <label
        htmlFor="id_graph_from"
        className="form-label col-3 col-sm-2 offset-1 text-muted text-right"
      >
        <small>Show from:</small>
      </label>
      <div className="col-sm-2 col-4">
        <select
          id="id_graph_from"
          className="form-control form-control-sm"
          onChange={onSelectChanged}
          defaultValue={props.from}
        >
          <option key="forever" value="forever">
            Forever
          </option>
          <option key="1 week" value="1 week">
            The last week
          </option>
          <option key="3 days" value="3 days">
            Last three days
          </option>
          <option key="1 day" value="1 day">
            The last day
          </option>
          <option key="6 hours" value="6 hours">
            Last six hours
          </option>
          <option key="1 hour" value="1 hour">
            Last hour
          </option>
        </select>
      </div>
    </div>
  )
}

const mapStateToProps = (state: poetracker.IState) => ({
  from: state.graphFrom
})
const mapDispatchToProps = (dispatch: (action: IActionType) => void) => ({
  fromChanged: (from: poetracker.GraphFromType) =>
    dispatch(graphFromChanged(from))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ShowFromSelect)
