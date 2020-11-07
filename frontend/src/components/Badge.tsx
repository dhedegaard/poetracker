import { Chip, Link } from '@material-ui/core'
import { green, red } from '@material-ui/core/colors'
import React from 'react'
import styled, { css } from 'styled-components'

const StyledChip = styled.span<{ $isLink: boolean; $color: string }>`
  && {
    display: inline-flex;
    align-items: center;
    height: 20px;
    margin-left: 2px;
    margin-right: 2px;
    background-color: ${(p) => p.$color};
    font-size: 12px;
    color: #fff;

    text-decoration: none !important;

    border-radius: 10px;
    padding: 2px 8px;

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

const Badge: React.FC<Props> = ({ type, label, ...props }) => {
  const color = React.useMemo(() => {
    switch (type) {
      case 'success':
        return green[500]
      case 'failure':
        return red[700]
      case 'twitch':
        return '#4b367c'
      case 'profile':
        return '#128091'
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
      <Link
        href={href}
        target={target}
        rel={rel}
        onClick={onClickHandler}
        underline="none"
      >
        <StyledChip $isLink $color={color} {...rest}>
          {label}
        </StyledChip>
      </Link>
    )
  }

  return (
    <StyledChip $isLink={false} $color={color} {...props}>
      {label}
    </StyledChip>
  )
}

export default Badge
