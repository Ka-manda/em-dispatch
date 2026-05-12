import React from 'react'
import { Typography } from '@mui/material'

export const InlineError = ({ message }) => {
  if (!message) return null
  return (
    <Typography
      sx={{
        fontSize: '12px',
        color: 'error.main',
        mt: 0.5,
      }}
    >
      {message}
    </Typography>
  )
}
