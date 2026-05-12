import React from 'react'
import { Box, TextField, Typography } from '@mui/material'
import { RequiredMark } from './RequiredMark'
import { InlineError } from './InlineError'

export const FormField = ({
  type = 'text',
  label,
  placeholder,
  value,
  onChange,
  required = false,
  error = '',
  rows = 3,
  disabled = false,
}) => (
  <Box>
    {label && (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.75 }}>
        <Typography
          sx={{
            fontSize: '14px',
            fontWeight: 500,
            color: 'text.primary',
          }}
        >
          {label}
        </Typography>
        {required && <RequiredMark />}
      </Box>
    )}
    <TextField
      fullWidth
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      size="small"
      multiline={type === 'textarea'}
      rows={type === 'textarea' ? rows : undefined}
      disabled={disabled}
      error={Boolean(error)}
      InputProps={{
        sx: {
          color: 'text.primary',
        },
      }}
      sx={{
        '& .MuiOutlinedInput-root': {
          color: 'text.primary',
        },
      }}
    />
    <InlineError message={error} />
  </Box>
)
