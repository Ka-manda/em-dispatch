import React from 'react'
import { Box, Container } from '@mui/material'
import { DispatchForm } from './DispatchForm'

export default function App() {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: 'background.default',
        py: 4,
      }}
    >
      <Container maxWidth="md">
        <DispatchForm />
      </Container>
    </Box>
  )
}
