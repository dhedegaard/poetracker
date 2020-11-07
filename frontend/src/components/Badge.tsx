import { Chip, createMuiTheme, Link, ThemeProvider } from '@material-ui/core'
import { green, red } from '@material-ui/core/colors'
import React from 'react'
import styled, { css } from 'styled-components'

const successTheme = createMuiTheme({ palette: { primary: green } })
const failureTheme = createMuiTheme({ palette: { primary: red } })
const twitchTheme = createMuiTheme({ palette: { primary: { 500: '#4b367c' } } })
const profileTheme = createMuiTheme({
  palette: { primary: { 500: '#17a2b8' } },
})

const StyledChip = styled(Chip)<{ $isLink: boolean }>`
  && {
    display: inline-flex;
    align-items: center;
    height: 20px;
    margin-left: 2px;
    margin-right: 2px;

    & > span {
      padding-left: 6px;
      padding-right: 6px;
    }

    ${(p) =>
      p.$isLink &&
      css`
        cursor: pointer;
      `}
  }
`

type Props = {
  label: string
  type: 'success' | 'failure' | 'twitch' | 'profile'
} & React.ComponentProps<typeof Chip> &
  Partial<Pick<React.HTMLProps<HTMLAnchorElement>, 'target' | 'rel' | 'href'>>

const Badge: React.FC<Props> = ({ type, ...props }) => {
  const theme = React.useMemo(() => {
    switch (type) {
      case 'success':
        return successTheme
      case 'failure':
        return failureTheme
      case 'twitch':
        return twitchTheme
      case 'profile':
        return profileTheme
      default:
        throw new Error(`Unmapped type: ${type}`)
    }
  }, [type])

  const isLink = props.href != null

  const onClickHandler = React.useCallback(
    (event: React.MouseEvent<HTMLAnchorElement>) => {
      event.stopPropagation()
    },
    []
  )

  if (isLink) {
    const { href, target, rel, ...rest } = props
    return (
      <ThemeProvider theme={theme}>
        <Link href={href} target={target} rel={rel} onClick={onClickHandler}>
          <StyledChip
            $isLink
            size="small"
            color="primary"
            {...rest}
            as="span"
          />
        </Link>
      </ThemeProvider>
    )
  }

  return (
    <ThemeProvider theme={theme}>
      <StyledChip
        $isLink={false}
        size="small"
        color="primary"
        {...props}
        as="span"
      />
    </ThemeProvider>
  )
}

export default Badge
