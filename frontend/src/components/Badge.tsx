import { Chip, createMuiTheme, Link, ThemeProvider } from '@material-ui/core'
import { green, red } from '@material-ui/core/colors'
import React from 'react'

const successTheme = createMuiTheme({ palette: { primary: green } })
const failureTheme = createMuiTheme({ palette: { primary: red } })
const twitchTheme = createMuiTheme({ palette: { primary: { 500: '#4b367c' } } })
const profileTheme = createMuiTheme({
  palette: { primary: { 500: '#17a2b8' } },
})

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
          <Chip size="small" color="primary" {...rest} />
        </Link>
      </ThemeProvider>
    )
  }

  return (
    <ThemeProvider theme={theme}>
      <Chip size="small" color="primary" {...props} />
    </ThemeProvider>
  )
}

export default Badge
