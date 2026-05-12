import React from 'react'
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Box } from '@mui/material'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'

export const SuccessDialog = ({
  open,
  onClose,
  onViewIncident,
  message,
  subMessage,
}) => (
  <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
    <DialogContent sx={{ textAlign: 'center', py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
        <CheckCircleIcon sx={{ fontSize: 48, color: 'success.main' }} />
      </Box>
      <DialogTitle sx={{ p: 0, mb: 1 }}>
        {message}
      </DialogTitle>
      <Typography sx={{ color: 'text.secondary', mb: 2 }}>
        {subMessage}
      </Typography>
    </DialogContent>
    <DialogActions sx={{ p: 2 }}>
      <Button variant="outlined" onClick={onClose}>
        Close
      </Button>
      <Button variant="contained" onClick={onViewIncident}>
        View Incident
      </Button>
    </DialogActions>
  </Dialog>
)
