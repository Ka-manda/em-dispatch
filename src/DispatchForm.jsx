import React, { useState } from 'react'
import {
  Paper,
  Box,
  Typography,
  TextField,
  Select,
  MenuItem,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
  Checkbox,
  FormGroup,
  Button,
  InputAdornment,
  CircularProgress,
} from '@mui/material'
import {
  RequiredMark,
  SectionHeader,
  FormField,
  FormGrid,
  InlineError,
  StepperComponent,
  SuccessDialog,
} from './components'
import { postDispatchIntent } from './api-client'

const steps = ['Caller Information', 'Clinical data', 'Incident Location']

export const DispatchForm = () => {
  const [currentStep, setCurrentStep] = useState(1)
  const [showSuccess, setShowSuccess] = useState(false)
  const [isVerifying, setIsVerifying] = useState(false)
  const [isIdVerified, setIsIdVerified] = useState(false)
  const [isLoadingData, setIsLoadingData] = useState(false)
  const [incidentCoordinates, setIncidentCoordinates] = useState(null)
  const [isLoaded, setIsLoaded] = useState(true)
  const [ambulances, setAmbulances] = useState([{ id: 'T460DZN', name: 'T460DZN' }])
  const [facilities, setFacilities] = useState([
    { facility: { fr_code: 'KNH', official_name: 'Kenyatta National Hospital' } },
  ])
  const [routeInfo, setRouteInfo] = useState(null)
  const [initialNumber, setInitialNumber] = useState('')

  const [formData, setFormData] = useState({
    phoneCountryCode: '+254',
    phoneNumber: '',
    callerName: '',
    isCallerPatient: 'no',
    relationshipToPatient: '',
    isPatientKnown: false,
    idType: '',
    nationalId: '',
    firstName: '',
    middleName: '',
    lastName: '',
    isAdultOrChild: 'child',
    approximateAge: '',
    sex: '',
    incidentType: 'single',
    numberOfPatients: '',
    incidentDescription: '',
    priorityLevel: '',
    multiAgencyFire: false,
    multiAgencySecurity: false,
    levelOfConsciousness: '',
    breathingStatus: '',
    activelyBleeding: 'no',
    medicalHistoryInfo: '',
    location: '',
    landmark: '',
    assignAmbulance: '',
    healthFacility: '',
    driverContacted: 'no',
    facilityContacted: 'no',
  })

  const [errors, setErrors] = useState({})

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }))
    }
  }

  const handleVerifyId = async () => {
    setIsVerifying(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setIsIdVerified(true)
      setFormData((prev) => ({
        ...prev,
        firstName: 'John',
        middleName: 'James',
        lastName: 'Doe',
      }))
    } catch (err) {
      console.error('ID verification failed:', err)
    } finally {
      setIsVerifying(false)
    }
  }

  const handleStepClick = (step) => {
    if (step < currentStep) {
      setCurrentStep(step)
    }
  }

  const validateStep = (step) => {
    const newErrors = {}

    if (step === 1) {
      if (!formData.phoneNumber) newErrors.phoneNumber = 'Phone number is required'
      if (!formData.callerName) newErrors.callerName = 'Caller name is required'
      if (formData.isCallerPatient === 'no' && !formData.relationshipToPatient) {
        newErrors.relationshipToPatient = 'Please select a relationship'
      }
      if (!formData.approximateAge) newErrors.approximateAge = 'Approximate age is required'
      if (!formData.sex) newErrors.sex = 'Sex is required'
    } else if (step === 2) {
      if (!formData.incidentDescription) newErrors.incidentDescription = 'Incident description is required'
      if (!formData.priorityLevel) newErrors.priorityLevel = 'Priority level is required'
      if (!formData.levelOfConsciousness) newErrors.levelOfConsciousness = 'Consciousness level is required'
      if (!formData.breathingStatus) newErrors.breathingStatus = 'Breathing status is required'
    } else if (step === 3) {
      if (!formData.location) newErrors.location = 'Location is required'
      if (!formData.assignAmbulance) newErrors.assignAmbulance = 'Ambulance assignment is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = async () => {
    if (validateStep(currentStep)) {
      if (currentStep === 3) {
        await handleSubmit()
      } else {
        setCurrentStep(currentStep + 1)
      }
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async () => {
    setIsLoadingData(true)
    try {
      const payload = {
        caller: {
          phoneCountryCode: formData.phoneCountryCode,
          phoneNumber: formData.phoneNumber,
          name: formData.callerName,
          isPatient: formData.isCallerPatient === 'yes',
          relationshipToPatient: formData.relationshipToPatient,
        },
        patient: {
          isKnown: formData.isPatientKnown,
          idType: formData.idType,
          idNumber: formData.nationalId,
          firstName: formData.firstName,
          middleName: formData.middleName,
          lastName: formData.lastName,
          ageGroup: formData.isAdultOrChild,
          approximateAge: formData.approximateAge,
          sex: formData.sex,
        },
        incident: {
          type: formData.incidentType,
          numberOfPatients: formData.numberOfPatients,
          description: formData.incidentDescription,
          priorityLevel: formData.priorityLevel,
          multiAgency: {
            fire: formData.multiAgencyFire,
            security: formData.multiAgencySecurity,
          },
          clinicalInfo: {
            consciousness: formData.levelOfConsciousness,
            breathing: formData.breathingStatus,
            activelyBleeding: formData.activelyBleeding,
            medicalHistory: formData.medicalHistoryInfo,
          },
        },
        location: {
          address: formData.location,
          landmark: formData.landmark,
        },
        resources: {
          ambulanceId: formData.assignAmbulance,
          facilityId: formData.healthFacility,
          driverContacted: formData.driverContacted,
          facilityContacted: formData.facilityContacted,
        },
      }

      await postDispatchIntent(payload)
      setShowSuccess(true)
      setCurrentStep(1)
      setFormData((prev) => ({
        ...prev,
        phoneNumber: '',
        callerName: '',
        isCallerPatient: 'no',
        relationshipToPatient: '',
        incidentDescription: '',
        priorityLevel: '',
        location: '',
        landmark: '',
        assignAmbulance: '',
        healthFacility: '',
      }))
    } catch (err) {
      console.error('Submit failed:', err)
      setErrors({ submit: 'Failed to submit incident' })
    } finally {
      setIsLoadingData(false)
    }
  }

  const handleCloseSuccess = () => setShowSuccess(false)

  const handleViewIncident = () => {
    setShowSuccess(false)
  }

  return (
    <Box sx={{ p: 3, maxWidth: 900, mx: 'auto' }}>
      <Paper
        elevation={0}
        sx={{
          p: 3,
          borderRadius: '12px',
          backgroundColor: 'background.paper',
          border: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Box sx={{ mb: 3 }}>
          <Typography
            sx={{
              fontSize: '18px',
              fontWeight: 600,
              lineHeight: '28px',
              color: 'text.primary',
              mb: 0.5,
            }}
          >
            Create Incident
          </Typography>
          <Typography
            sx={{
              fontSize: '14px',
              fontWeight: 400,
              lineHeight: '20px',
              color: 'text.secondary',
            }}
          >
            Record incident details to allocate emergency resources
          </Typography>
        </Box>

        <StepperComponent steps={steps} currentStep={currentStep} onStepClick={handleStepClick} />

        {currentStep === 1 && (
          <Box>
            <SectionHeader>Caller Information</SectionHeader>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
              <FormGrid>
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.75 }}>
                    <Typography
                      sx={{
                        fontSize: '14px',
                        fontWeight: 500,
                        color: 'text.primary',
                      }}
                    >
                      Phone number
                      <RequiredMark />
                    </Typography>
                    {initialNumber && (
                      <Typography
                        sx={{
                          fontSize: '11px',
                          fontWeight: 500,
                          color: 'primary.main',
                          backgroundColor: 'rgba(81, 162, 255, 0.1)',
                          padding: '2px 8px',
                          borderRadius: '4px',
                        }}
                      >
                        Auto-filled
                      </Typography>
                    )}
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <FormControl sx={{ minWidth: 90 }} size="small">
                      <Select
                        value={formData.phoneCountryCode}
                        onChange={(e) => handleInputChange('phoneCountryCode', e.target.value)}
                        disabled={initialNumber !== ''}
                        sx={{
                          color: 'text.primary',
                          '& .MuiSelect-select': {
                            color: 'text.primary',
                          },
                          '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: 'divider',
                          },
                          '&.Mui-disabled': {
                            backgroundColor: 'action.disabledBackground',
                          },
                        }}
                      >
                        <MenuItem value="+254">+254</MenuItem>
                        <MenuItem value="+255">+255</MenuItem>
                      </Select>
                    </FormControl>
                    <TextField
                      fullWidth
                      placeholder="700000000"
                      value={formData.phoneNumber}
                      onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                      size="small"
                      disabled={initialNumber !== ''}
                      error={Boolean(errors.phoneNumber)}
                      InputProps={{
                        sx: {
                          color: 'text.primary',
                        },
                      }}
                      sx={{
                        '& .Mui-disabled': {
                          backgroundColor: 'action.disabledBackground',
                          cursor: 'not-allowed',
                        },
                      }}
                    />
                  </Box>
                  <InlineError message={errors.phoneNumber} />
                </Box>

                <FormField
                  type="text"
                  label="Caller names"
                  placeholder="Input caller name"
                  value={formData.callerName}
                  onChange={(value) => handleInputChange('callerName', value)}
                  required
                  error={errors.callerName}
                />
              </FormGrid>

              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                <Box>
                  <Typography
                    sx={{
                      fontSize: '14px',
                      fontWeight: 500,
                      color: 'text.primary',
                      mb: 0.75,
                    }}
                  >
                    Is caller the patient?
                  </Typography>
                  <RadioGroup
                    row
                    value={formData.isCallerPatient}
                    onChange={(e) => {
                      const value = e.target.value
                      handleInputChange('isCallerPatient', value)
                      if (value === 'yes') {
                        handleInputChange('relationshipToPatient', 'self')
                      } else if (formData.relationshipToPatient === 'self') {
                        handleInputChange('relationshipToPatient', '')
                      }
                    }}
                  >
                    <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                    <FormControlLabel value="no" control={<Radio />} label="No" />
                  </RadioGroup>
                </Box>

                <Box>
                  <Typography
                    sx={{
                      fontSize: '14px',
                      fontWeight: 500,
                      color: 'text.primary',
                      mb: 0.75,
                    }}
                  >
                    Relationship to patient
                    {formData.isCallerPatient === 'no' && <RequiredMark />}
                  </Typography>
                  <FormControl fullWidth size="small" error={Boolean(errors.relationshipToPatient)}>
                    <Select
                      value={formData.relationshipToPatient}
                      onChange={(e) => handleInputChange('relationshipToPatient', e.target.value)}
                      displayEmpty
                      disabled={formData.isCallerPatient === 'yes'}
                      renderValue={(selected) => {
                        if (!selected) {
                          return (
                            <Box component="span" sx={{ color: 'text.disabled' }}>
                              Select relationship
                            </Box>
                          )
                        }
                        const labelMap = {
                          self: 'Self',
                          parent: 'Parent',
                          spouse: 'Spouse',
                          next_of_kin: 'Next of Kin',
                          good_samaritan: 'Good Samaritan',
                        }
                        return labelMap[selected] || selected
                      }}
                      sx={{
                        color: 'text.primary',
                        '& .MuiSelect-select': {
                          color: 'text.primary',
                        },
                      }}
                    >
                      {formData.isCallerPatient === 'yes' && (
                        <MenuItem value="self">Self</MenuItem>
                      )}
                      <MenuItem value="parent">Parent</MenuItem>
                      <MenuItem value="spouse">Spouse</MenuItem>
                      <MenuItem value="next_of_kin">Next of Kin</MenuItem>
                      <MenuItem value="good_samaritan">Good Samaritan</MenuItem>
                    </Select>
                  </FormControl>
                  <InlineError message={errors.relationshipToPatient} />
                </Box>
              </Box>
            </Box>

            <SectionHeader sx={{ mt: 3 }}>Patient Information</SectionHeader>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
              <Box>
                <Typography
                  sx={{
                    fontSize: '14px',
                    fontWeight: 500,
                    color: 'text.primary',
                    mb: 0.75,
                  }}
                >
                  Is patient known?
                </Typography>
                <RadioGroup
                  row
                  value={formData.isPatientKnown ? 'yes' : 'no'}
                  onChange={(e) => handleInputChange('isPatientKnown', e.target.value === 'yes')}
                >
                  <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                  <FormControlLabel value="no" control={<Radio />} label="No" />
                </RadioGroup>
              </Box>

              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: 2 }}>
                <Box>
                  <Typography
                    sx={{
                      fontSize: '14px',
                      fontWeight: 500,
                      color: 'text.primary',
                      mb: 0.75,
                    }}
                  >
                    ID Type
                  </Typography>
                  <FormControl fullWidth size="small">
                    <Select
                      value={formData.idType}
                      onChange={(e) => handleInputChange('idType', e.target.value)}
                      displayEmpty
                      disabled={!formData.isPatientKnown}
                      sx={{
                        color: formData.idType ? 'text.primary' : 'text.disabled',
                        '& .MuiSelect-select': {
                          color: formData.idType ? 'text.primary' : 'text.disabled',
                        },
                        '&.Mui-disabled': {
                          backgroundColor: 'action.disabledBackground',
                        },
                      }}
                    >
                      <MenuItem value="" disabled>
                        Select ID Type
                      </MenuItem>
                      <MenuItem value="National ID">National ID</MenuItem>
                      <MenuItem value="Alien ID">Alien ID</MenuItem>
                      <MenuItem value="Refugee ID">Refugee ID</MenuItem>
                      <MenuItem value="Not Applicable">Not Applicable</MenuItem>
                    </Select>
                  </FormControl>
                </Box>

                <Box>
                  <Typography
                    sx={{
                      fontSize: '14px',
                      fontWeight: 500,
                      color: 'text.primary',
                      mb: 0.75,
                    }}
                  >
                    ID Number
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <TextField
                      fullWidth
                      placeholder="Enter ID Number"
                      value={formData.nationalId}
                      onChange={(e) => handleInputChange('nationalId', e.target.value)}
                      size="small"
                      disabled={!formData.isPatientKnown}
                      InputProps={{
                        sx: {
                          color: 'text.primary',
                        },
                      }}
                    />
                    <Button
                      variant="outlined"
                      onClick={handleVerifyId}
                      disabled={isVerifying || !formData.nationalId || !formData.idType || !formData.isPatientKnown}
                      sx={{
                        minWidth: '80px',
                        textTransform: 'none',
                        fontWeight: 600,
                        fontSize: '13px',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {isVerifying ? <CircularProgress size={20} /> : 'Verify ID'}
                    </Button>
                  </Box>
                </Box>
              </Box>

              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 2 }}>
                <Box>
                  <Typography
                    sx={{
                      fontSize: '14px',
                      fontWeight: 500,
                      color: 'text.primary',
                      mb: 0.75,
                    }}
                  >
                    First Name
                  </Typography>
                  <TextField
                    fullWidth
                    placeholder="Enter First Name"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    size="small"
                    disabled={!formData.isPatientKnown || (isIdVerified && !!formData.firstName)}
                    InputProps={{
                      sx: {
                        color: 'text.primary',
                      },
                    }}
                  />
                </Box>
                <Box>
                  <Typography
                    sx={{
                      fontSize: '14px',
                      fontWeight: 500,
                      color: 'text.primary',
                      mb: 0.75,
                    }}
                  >
                    Middle Name
                  </Typography>
                  <TextField
                    fullWidth
                    placeholder="Enter Middle Name"
                    value={formData.middleName}
                    onChange={(e) => handleInputChange('middleName', e.target.value)}
                    size="small"
                    disabled={!formData.isPatientKnown || (isIdVerified && !!formData.middleName)}
                    InputProps={{
                      sx: {
                        color: 'text.primary',
                      },
                    }}
                  />
                </Box>
                <Box>
                  <Typography
                    sx={{
                      fontSize: '14px',
                      fontWeight: 500,
                      color: 'text.primary',
                      mb: 0.75,
                    }}
                  >
                    Last Name
                  </Typography>
                  <TextField
                    fullWidth
                    placeholder="Enter Last Name"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    size="small"
                    disabled={!formData.isPatientKnown || (isIdVerified && !!formData.lastName)}
                    InputProps={{
                      sx: {
                        color: 'text.primary',
                      },
                    }}
                  />
                </Box>
              </Box>

              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 2 }}>
                <Box>
                  <Typography
                    sx={{
                      fontSize: '14px',
                      fontWeight: 500,
                      color: 'text.primary',
                      mb: 0.75,
                    }}
                  >
                    Is patient an adult or a child?
                  </Typography>
                  <RadioGroup
                    row
                    value={formData.isAdultOrChild}
                    onChange={(e) => {
                      const value = e.target.value
                      handleInputChange('isAdultOrChild', value)
                    }}
                  >
                    <FormControlLabel value="adult" control={<Radio />} label="Adult" disabled={isIdVerified} />
                    <FormControlLabel value="child" control={<Radio />} label="Child" disabled={isIdVerified} />
                  </RadioGroup>
                </Box>

                <Box>
                  <Typography
                    sx={{
                      fontSize: '14px',
                      fontWeight: 500,
                      color: 'text.primary',
                      mb: 0.75,
                    }}
                  >
                    Approximate age
                    <RequiredMark />
                  </Typography>
                  <FormControl fullWidth size="small" error={Boolean(errors.approximateAge)}>
                    <Select
                      value={formData.approximateAge}
                      onChange={(e) => {
                        const ageRange = e.target.value
                        handleInputChange('approximateAge', ageRange)
                        if (ageRange === '0-10' || ageRange === '10-17') {
                          handleInputChange('isAdultOrChild', 'child')
                        } else if (ageRange === '18-30' || ageRange === '30+') {
                          handleInputChange('isAdultOrChild', 'adult')
                        }
                      }}
                      displayEmpty
                      disabled={isIdVerified}
                      sx={{
                        color: 'text.primary',
                        '& .MuiSelect-select': {
                          color: 'text.primary',
                        },
                      }}
                    >
                      <MenuItem value="0-10" disabled={formData.isAdultOrChild === 'adult'}>
                        0-10
                      </MenuItem>
                      <MenuItem value="10-17" disabled={formData.isAdultOrChild === 'adult'}>
                        10-17
                      </MenuItem>
                      <MenuItem value="18-30" disabled={formData.isAdultOrChild === 'child'}>
                        18-30
                      </MenuItem>
                      <MenuItem value="30+" disabled={formData.isAdultOrChild === 'child'}>
                        30+
                      </MenuItem>
                    </Select>
                  </FormControl>
                  <InlineError message={errors.approximateAge} />
                </Box>

                <Box>
                  <Typography
                    sx={{
                      fontSize: '14px',
                      fontWeight: 500,
                      color: 'text.primary',
                      mb: 0.75,
                    }}
                  >
                    Sex
                    <RequiredMark />
                  </Typography>
                  <FormControl fullWidth size="small" error={Boolean(errors.sex)}>
                    <Select
                      value={formData.sex}
                      onChange={(e) => handleInputChange('sex', e.target.value)}
                      displayEmpty
                      disabled={isIdVerified && !!formData.sex}
                      sx={{
                        color: 'text.primary',
                        '& .MuiSelect-select': {
                          color: 'text.primary',
                        },
                      }}
                    >
                      <MenuItem value="male">Male</MenuItem>
                      <MenuItem value="female">Female</MenuItem>
                    </Select>
                  </FormControl>
                  <InlineError message={errors.sex} />
                </Box>
              </Box>
            </Box>
          </Box>
        )}

        {currentStep === 2 && (
          <Box>
            <SectionHeader>Clinical data</SectionHeader>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
              <Box sx={{ display: 'grid', gridTemplateColumns: formData.incidentType === 'mass' ? '1fr 1fr' : '1fr', gap: 2 }}>
                <Box>
                  <Typography
                    sx={{
                      fontSize: '14px',
                      fontWeight: 500,
                      color: 'text.primary',
                      mb: 0.75,
                    }}
                  >
                    Incident Type
                  </Typography>
                  <RadioGroup
                    row
                    value={formData.incidentType}
                    onChange={(e) => handleInputChange('incidentType', e.target.value)}
                  >
                    <FormControlLabel value="single" control={<Radio />} label="Single Incident" />
                    <FormControlLabel value="mass" control={<Radio />} label="Mass Casualty" />
                  </RadioGroup>
                </Box>

                {formData.incidentType === 'mass' && (
                  <Box>
                    <Typography
                      sx={{
                        fontSize: '14px',
                        fontWeight: 500,
                        color: 'text.primary',
                        mb: 0.75,
                      }}
                    >
                      Number of Patients
                    </Typography>
                    <TextField
                      fullWidth
                      placeholder="Enter number of patients"
                      value={formData.numberOfPatients}
                      onChange={(e) => handleInputChange('numberOfPatients', e.target.value)}
                      size="small"
                      InputProps={{
                        sx: {
                          color: 'text.primary',
                        },
                      }}
                    />
                  </Box>
                )}
              </Box>

              <FormField
                type="textarea"
                label="Incident Description"
                placeholder="Enter description"
                rows={3}
                value={formData.incidentDescription}
                onChange={(value) => handleInputChange('incidentDescription', value)}
                required
                error={errors.incidentDescription}
              />

              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                <Box>
                  <Typography
                    sx={{
                      fontSize: '14px',
                      fontWeight: 500,
                      color: 'text.primary',
                      mb: 0.75,
                    }}
                  >
                    Priority level
                    <RequiredMark />
                  </Typography>
                  <FormControl fullWidth size="small" error={Boolean(errors.priorityLevel)}>
                    <Select
                      value={formData.priorityLevel}
                      onChange={(e) => handleInputChange('priorityLevel', e.target.value)}
                      displayEmpty
                      sx={{
                        color: 'text.primary',
                        '& .MuiSelect-select': {
                          color: 'text.primary',
                        },
                      }}
                    >
                      <MenuItem value="" disabled>
                        Select priority level
                      </MenuItem>
                      <MenuItem value="critical">Critical</MenuItem>
                      <MenuItem value="high">High</MenuItem>
                      <MenuItem value="medium">Medium</MenuItem>
                    </Select>
                  </FormControl>
                  <InlineError message={errors.priorityLevel} />
                </Box>

                <Box>
                  <Typography
                    sx={{
                      fontSize: '14px',
                      fontWeight: 500,
                      color: 'text.primary',
                      mb: 0.75,
                    }}
                  >
                    Multi agency incident?
                  </Typography>
                  <FormGroup row>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={formData.multiAgencyFire}
                          onChange={(e) => handleInputChange('multiAgencyFire', e.target.checked)}
                        />
                      }
                      label="Fire"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={formData.multiAgencySecurity}
                          onChange={(e) => handleInputChange('multiAgencySecurity', e.target.checked)}
                        />
                      }
                      label="Security"
                    />
                  </FormGroup>
                </Box>
              </Box>

              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 2 }}>
                <Box>
                  <Typography
                    sx={{
                      fontSize: '14px',
                      fontWeight: 500,
                      color: 'text.primary',
                      mb: 0.75,
                    }}
                  >
                    Consciousness
                    <RequiredMark />
                  </Typography>
                  <FormControl fullWidth size="small" error={Boolean(errors.levelOfConsciousness)}>
                    <Select
                      value={formData.levelOfConsciousness}
                      onChange={(e) => handleInputChange('levelOfConsciousness', e.target.value)}
                      displayEmpty
                      sx={{
                        color: 'text.primary',
                        '& .MuiSelect-select': {
                          color: 'text.primary',
                        },
                      }}
                    >
                      <MenuItem value="" disabled>
                        Select consciousness
                      </MenuItem>
                      <MenuItem value="alert">Alert</MenuItem>
                      <MenuItem value="verbal">Verbal</MenuItem>
                      <MenuItem value="unconscious">Unconscious</MenuItem>
                    </Select>
                  </FormControl>
                  <InlineError message={errors.levelOfConsciousness} />
                </Box>

                <Box>
                  <Typography
                    sx={{
                      fontSize: '14px',
                      fontWeight: 500,
                      color: 'text.primary',
                      mb: 0.75,
                    }}
                  >
                    Breathing
                    <RequiredMark />
                  </Typography>
                  <FormControl fullWidth size="small" error={Boolean(errors.breathingStatus)}>
                    <Select
                      value={formData.breathingStatus}
                      onChange={(e) => handleInputChange('breathingStatus', e.target.value)}
                      displayEmpty
                      sx={{
                        color: 'text.primary',
                        '& .MuiSelect-select': {
                          color: 'text.primary',
                        },
                      }}
                    >
                      <MenuItem value="" disabled>
                        Select breathing
                      </MenuItem>
                      <MenuItem value="normal">Normal</MenuItem>
                      <MenuItem value="labored">Labored</MenuItem>
                    </Select>
                  </FormControl>
                  <InlineError message={errors.breathingStatus} />
                </Box>

                <Box>
                  <Typography
                    sx={{
                      fontSize: '14px',
                      fontWeight: 500,
                      color: 'text.primary',
                      mb: 0.75,
                    }}
                  >
                    Actively bleeding?
                  </Typography>
                  <RadioGroup
                    row
                    value={formData.activelyBleeding}
                    onChange={(e) => handleInputChange('activelyBleeding', e.target.value)}
                  >
                    <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                    <FormControlLabel value="no" control={<Radio />} label="No" />
                  </RadioGroup>
                </Box>
              </Box>

              <FormField
                type="textarea"
                label="Medical History/Information"
                placeholder="Enter description"
                rows={3}
                value={formData.medicalHistoryInfo}
                onChange={(value) => handleInputChange('medicalHistoryInfo', value)}
              />
            </Box>
          </Box>
        )}

        {currentStep === 3 && (
          <Box>
            <SectionHeader>Incident Location</SectionHeader>

            <Box
              sx={{
                width: '100%',
                height: '200px',
                backgroundColor: 'action.hover',
                borderRadius: '8px',
                mb: 3,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid',
                borderColor: 'divider',
                overflow: 'hidden',
                position: 'relative',
              }}
            >
              {!isLoaded ? (
                <CircularProgress size={30} sx={{ color: 'primary.main' }} />
              ) : (
                <Box sx={{ textAlign: 'center' }}>
                  <Typography sx={{ color: 'text.secondary', fontSize: '12px' }}>
                    Map integration available with Google Maps API
                  </Typography>
                </Box>
              )}
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
              <SectionHeader sx={{ mb: 0 }}>Incident Details</SectionHeader>

              <FormGrid>
                <FormField
                  type="text"
                  label="Location"
                  placeholder="Enter location"
                  value={formData.location}
                  onChange={(value) => handleInputChange('location', value)}
                  required
                  error={errors.location}
                />
                <FormField
                  type="text"
                  label="Landmark"
                  placeholder="Enter nearest landmark"
                  value={formData.landmark}
                  onChange={(value) => handleInputChange('landmark', value)}
                />
              </FormGrid>

              <Typography
                sx={{
                  fontSize: '14px',
                  fontWeight: 400,
                  color: 'text.secondary',
                }}
              >
                Please Note: The Ambulance and facilities in the list below are those closest to the incident
                location above
              </Typography>

              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                <Box sx={{ minWidth: 0 }}>
                  <Typography
                    sx={{
                      fontSize: '14px',
                      fontWeight: 500,
                      color: 'text.primary',
                      mb: 0.75,
                    }}
                  >
                    Assign ambulance
                    <RequiredMark />
                  </Typography>
                  <FormControl fullWidth size="small" error={Boolean(errors.assignAmbulance)} sx={{ minWidth: 0 }}>
                    <Select
                      value={formData.assignAmbulance}
                      onChange={(e) => handleInputChange('assignAmbulance', e.target.value)}
                      displayEmpty
                      disabled={isLoadingData || ambulances.length === 0}
                      sx={{
                        minWidth: 0,
                        '& .MuiSelect-select': {
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          maxWidth: '100%',
                        },
                        '& .MuiOutlinedInput-input': {
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        },
                      }}
                    >
                      {ambulances.map((ambulance) => (
                        <MenuItem
                          key={ambulance.id}
                          value={ambulance.id}
                          title={ambulance.name}
                          sx={{
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {ambulance.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <InlineError message={errors.assignAmbulance} />
                </Box>

                <Box sx={{ minWidth: 0 }}>
                  <Typography
                    sx={{
                      fontSize: '14px',
                      fontWeight: 500,
                      color: 'text.primary',
                      mb: 0.75,
                    }}
                  >
                    Health facility
                  </Typography>
                  <FormControl fullWidth size="small" sx={{ minWidth: 0 }}>
                    <Select
                      value={formData.healthFacility}
                      onChange={(e) => handleInputChange('healthFacility', e.target.value)}
                      displayEmpty
                      disabled={isLoadingData || facilities.length === 0}
                      sx={{
                        minWidth: 0,
                        '& .MuiSelect-select': {
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          maxWidth: '100%',
                        },
                        '& .MuiOutlinedInput-input': {
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        },
                      }}
                    >
                      {facilities.map((facilityItem) => (
                        <MenuItem
                          key={facilityItem.facility.fr_code}
                          value={facilityItem.facility.fr_code}
                          title={facilityItem.facility.official_name}
                          sx={{
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {facilityItem.facility.official_name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>
              </Box>

              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.75 }}>
                    <Typography
                      sx={{
                        fontSize: '14px',
                        fontWeight: 500,
                        color: 'text.primary',
                      }}
                    >
                      Driver Contacts
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: '14px',
                        color: 'text.secondary',
                      }}
                    >
                      ----
                    </Typography>
                  </Box>
                  <Typography
                    sx={{
                      fontSize: '14px',
                      fontWeight: 400,
                      color: 'text.secondary',
                      mb: 0.75,
                    }}
                  >
                    Have you contacted the ambulance?
                  </Typography>
                  <RadioGroup
                    row
                    value={formData.driverContacted}
                    onChange={(e) => handleInputChange('driverContacted', e.target.value)}
                  >
                    <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                    <FormControlLabel value="no" control={<Radio />} label="No" />
                  </RadioGroup>
                </Box>

                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.75 }}>
                    <Typography
                      sx={{
                        fontSize: '14px',
                        fontWeight: 500,
                        color: 'text.primary',
                      }}
                    >
                      Facility Contact
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: '14px',
                        color: 'text.secondary',
                      }}
                    >
                      ----
                    </Typography>
                  </Box>
                  <Typography
                    sx={{
                      fontSize: '14px',
                      fontWeight: 400,
                      color: 'text.secondary',
                      mb: 0.75,
                    }}
                  >
                    Have you contacted the facility?
                  </Typography>
                  <RadioGroup
                    row
                    value={formData.facilityContacted}
                    onChange={(e) => handleInputChange('facilityContacted', e.target.value)}
                  >
                    <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                    <FormControlLabel value="no" control={<Radio />} label="No" />
                  </RadioGroup>
                </Box>
              </Box>
            </Box>
          </Box>
        )}

        <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, mt: 3 }}>
          {currentStep > 1 ? (
            <Button
              variant="outlined"
              onClick={handleBack}
              sx={{
                px: 3,
                py: 1.25,
                textTransform: 'none',
                fontWeight: 600,
              }}
            >
              Back
            </Button>
          ) : (
            <Button
              variant="outlined"
              sx={{
                px: 3,
                py: 1.25,
                textTransform: 'none',
                fontWeight: 600,
              }}
            >
              Cancel
            </Button>
          )}
          <Button
            variant="contained"
            onClick={handleNext}
            disabled={isLoadingData}
            sx={{
              px: 3,
              py: 1.25,
              textTransform: 'none',
              fontWeight: 600,
            }}
          >
            {isLoadingData && currentStep === 3 ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CircularProgress size={16} sx={{ color: 'white' }} />
                Submitting...
              </Box>
            ) : currentStep === 3 ? (
              'Submit'
            ) : (
              'Next'
            )}
          </Button>
        </Box>
      </Paper>

      <SuccessDialog
        open={showSuccess}
        onClose={handleCloseSuccess}
        onViewIncident={handleViewIncident}
        message="Incident created and dispatched"
        subMessage={`${ambulances.find((amb) => amb.id === formData.assignAmbulance)?.name || 'Ambulance'} dispatched`}
      />
    </Box>
  )
}
