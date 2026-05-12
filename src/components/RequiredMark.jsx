import React from 'react'
import { Typography } from '@mui/material'

export const RequiredMark = () => (
  <Typography component="span" sx={{ color: 'error.main', ml: 0.25 }}>
    *
  </Typography>
)
