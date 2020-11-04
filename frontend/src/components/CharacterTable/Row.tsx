import { Box, Chip, TableCell, TableRow, Typography } from '@material-ui/core'
import Image from 'next/image'
import React from 'react'
import styled from 'styled-components'
import CharacterGraphContainer from '../../containers/character-graph'
import Badge from '../Badge'

const StyledTableCell = styled(TableCell)`
  && {
    padding: 0;
  }
`

interface IProps {
  datapoint: poetracker.IDatapointResult
  getCharData?: (
    leagueId: string,
    charname: string
  ) => Promise<poetracker.IDatapoint[]>
  clickedRow: (charname: string, leagueId: string) => void
  isSelected: boolean
}

const Row: React.FunctionComponent<IProps> = (props) => {
  const { datapoint, isSelected } = props

  const onRowClick = () => {
    props.clickedRow(
      props.datapoint.datapoint.charname,
      props.datapoint.datapoint.leagueId
    )
  }

  return (
    <>
      <TableRow selected={isSelected} onClick={onRowClick} hover>
        <TableCell>
          <Box display="flex" whiteSpace="nowrap">
            <Image
              src={`/${datapoint.datapoint.online ? 'online' : 'offline'}.png`}
              title={datapoint.datapoint.online ? 'Online' : 'Offline'}
              width="15px"
              height="15px"
            />{' '}
            <Typography>
              {datapoint.datapoint.globalRank || '15000+'}
            </Typography>
            {datapoint.previousDatapoint &&
              (datapoint.previousDatapoint.globalRank || 15001) !==
                (datapoint.datapoint.globalRank || 15001) && (
                <>
                  {' '}
                  <Badge
                    type={
                      (datapoint.datapoint.globalRank || 15001) <
                      (datapoint.previousDatapoint.globalRank || 15001)
                        ? 'success'
                        : 'failure'
                    }
                    label={`${String.fromCharCode(
                      (datapoint.datapoint.globalRank || 15001) >
                        (datapoint.previousDatapoint.globalRank || 15001)
                        ? 8595
                        : 8593
                    )} ${Math.abs(
                      (datapoint.datapoint.globalRank || 15001) -
                        (datapoint.previousDatapoint.globalRank || 15001)
                    )}`}
                    title={
                      datapoint.previousDatapoint &&
                      datapoint.previousDatapoint.timestamp
                        ? `Compared to: ${new Date(
                            datapoint.previousDatapoint.timestamp
                          ).toLocaleString()}`
                        : undefined
                    }
                  />
                </>
              )}
          </Box>
        </TableCell>
        <TableCell
          title={
            `Account name: ${datapoint.datapoint.accountId}\n` +
            `League: ${datapoint.datapoint.leagueId}`
          }
        >
          <Box
            width="100%"
            display="flex"
            justifyContent="space-between"
            flexGrow="0"
            whiteSpace="nowrap"
          >
            <Typography>
              {datapoint.datapoint.charname}
              {datapoint.datapoint.dead && (
                <>
                  {' '}
                  <Chip size="small" label="Dead" color="secondary" />
                </>
              )}
            </Typography>
            <Box>
              {datapoint.datapoint.account.twitchURL && (
                <>
                  <Badge
                    type="twitch"
                    href={datapoint.datapoint.account.twitchURL}
                    target="_blank "
                    rel="nofollow noreferrer"
                    title={`Twitch username: ${datapoint.datapoint.account.twitchUsername}`}
                    label="Twitch"
                  />{' '}
                </>
              )}
              <Badge
                type="profile"
                href={datapoint.datapoint.poeProfileURL}
                target="_blank"
                rel="nofollow noreferrer"
                label="Profile"
              />
            </Box>
          </Box>
        </TableCell>
        <TableCell>{datapoint.datapoint.class}</TableCell>
        <TableCell align="right">
          {datapoint.previousDatapoint &&
            datapoint.previousDatapoint.level !== datapoint.datapoint.level && (
              <Badge
                type="success"
                title={
                  datapoint.previousDatapoint &&
                  datapoint.previousDatapoint.timestamp
                    ? `Compared to: ${new Date(
                        datapoint.previousDatapoint.timestamp
                      ).toLocaleString()}`
                    : undefined
                }
                label={`+${
                  datapoint.datapoint.level - datapoint.previousDatapoint.level
                }`}
              />
            )}
          <Typography
            title={`XP: ${datapoint.datapoint.experience.toLocaleString()}`}
          >
            {datapoint.datapoint.level}
          </Typography>
        </TableCell>
      </TableRow>
      {(isSelected && (
        <TableRow>
          <StyledTableCell colSpan={999}>
            <CharacterGraphContainer />
          </StyledTableCell>
        </TableRow>
      )) ||
        null}
    </>
  )
}

export default React.memo(Row)
