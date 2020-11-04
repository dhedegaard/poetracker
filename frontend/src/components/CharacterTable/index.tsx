import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@material-ui/core'
import React from 'react'

import {
  ICharacterTableDispatchToProps,
  ICharacterTableStateToProps,
} from '../../containers/character-table'
import Row from './Row'

type IProps = ICharacterTableStateToProps & ICharacterTableDispatchToProps

const CharacterTable = (props: IProps) => {
  const onClickedRow = (charname: string, leagueId: string) => {
    const { selectedRow, getCharData } = props
    if (
      selectedRow &&
      selectedRow.charname === charname &&
      selectedRow.leagueId === leagueId
    ) {
      getCharData('', '')
    } else {
      getCharData(leagueId, charname)
    }
  }

  return (
    <Paper>
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow hover>
              <TableCell>Rank</TableCell>
              <TableCell>
                <Typography noWrap> Character name</Typography>
              </TableCell>
              <TableCell>Class</TableCell>
              <TableCell align="right">Level</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {props.datapoints.map((datapoint) => (
              <Row
                datapoint={datapoint}
                clickedRow={onClickedRow}
                isSelected={
                  props.selectedRow !== undefined &&
                  props.selectedRow.charname === datapoint.datapoint.charname &&
                  props.selectedRow.leagueId === datapoint.datapoint.leagueId
                }
                key={datapoint.datapoint.id}
              />
            ))}
            {!props.datapoints.length && (
              <TableRow>
                <TableCell colSpan={999} align="center">
                  <b>Sorry!</b> I've got no datapoints for the given league, try
                  filtering on another league.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  )
}
export default React.memo(CharacterTable)
