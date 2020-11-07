import { Box, Link } from '@material-ui/core'
import GithubIcon from '@material-ui/icons/GitHub'
import React from 'react'
import styled from 'styled-components'

const StyledLink = styled(Link)`
  && {
    color: #fff;
    display: flex;
    align-items: center;
  }
`

const GithubLink: React.FC = () => (
  <Box display="flex" alignItems="center">
    <StyledLink
      href="https://github.com/dhedegaard/poetracker"
      target="_blank"
      rel="noopener noreferer"
    >
      <Box mr={1}>
        <GithubIcon fontSize="small" />
      </Box>
      Github
    </StyledLink>
  </Box>
)

export default GithubLink
