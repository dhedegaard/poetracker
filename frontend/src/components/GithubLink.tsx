import { Box, Link } from '@material-ui/core'
import React from 'react'
import styled from 'styled-components'

const StyledLink = styled(Link)`
  && {
    color: #fff;
  }
`

const GithubLink: React.FC = () => (
  <Box display="flex" alignItems="center">
    <StyledLink
      href="https://github.com/dhedegaard/poetracker"
      target="_blank"
      rel="noopener noreferer"
    >
      Github
    </StyledLink>
  </Box>
)

export default GithubLink
