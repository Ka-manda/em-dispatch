import React from 'react'
import { Box } from '@mui/material'

export const FormGrid = ({ children }) => (
  <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
    {children}
  </Box>
)
