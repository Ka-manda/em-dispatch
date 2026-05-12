import React from 'react'
import { Box, Stepper, Step, StepLabel, StepButton } from '@mui/material'

export const StepperComponent = ({ steps, currentStep, onStepClick }) => (
  <Box sx={{ mb: 3 }}>
    <Stepper activeStep={currentStep - 1} sx={{ mb: 2 }}>
      {steps.map((step, index) => (
        <Step key={index}>
          <StepButton color="inherit" onClick={() => onStepClick(index + 1)}>
            <StepLabel>{step}</StepLabel>
          </StepButton>
        </Step>
      ))}
    </Stepper>
  </Box>
)
