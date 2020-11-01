import { Box, FormLabel, NativeSelect } from '@material-ui/core'
import React from 'react'
import { connect } from 'react-redux'
import { graphFromChanged } from '../../store/actions'

type Props = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps>

const ShowFromSelect: React.FunctionComponent<Props> = (props) => {
  const onSelectChanged = (evt: React.ChangeEvent<HTMLSelectElement>) => {
    props.fromChanged(evt.currentTarget.value as poetracker.GraphFromType)
  }

  return (
    <Box mb={2} display="flex">
      <Box ml={2}>
        <FormLabel htmlFor="id_graph_from">
          <small>Show from:</small>
        </FormLabel>
      </Box>
      <Box ml={2}>
        <NativeSelect
          id="id_graph_from"
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
        </NativeSelect>
      </Box>
    </Box>
  )
}

const mapStateToProps = (state: poetracker.IState) => ({
  from: state.graphFrom,
})
const mapDispatchToProps = (
  dispatch: (action: poetracker.IActionType) => void
) => ({
  fromChanged: (from: poetracker.GraphFromType) =>
    dispatch(graphFromChanged(from)),
})

export default connect(mapStateToProps, mapDispatchToProps)(ShowFromSelect)
