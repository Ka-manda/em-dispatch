import React from 'react'
import { Typography, Box } from '@mui/material'

export const SectionHeader = ({ children, sx = {} }) => (
  <Box sx={{ mb: 2, ...sx }}>
    <Typography
      sx={{
        fontSize: '16px',
        fontWeight: 600,
        color: 'primary.main',
        ...sx,
      }}
    >
      {children}
    </Typography>
  </Box>
)
