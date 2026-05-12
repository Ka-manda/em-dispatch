# Safaricom AI Dispatch Portal

A React + Material UI emergency dispatch portal prototype for Safaricom.

## Tech Stack

- **React 18** - UI framework
- **Material UI (MUI)** - Component library
- **Vite** - Build tool
- **React** - State management

## Project Structure

```
src/
├── App.jsx                 # Main application component
├── DispatchForm.jsx        # Multi-step dispatch form
├── api-client.js           # API integration
├── main.jsx                # React entry point
└── components/
    ├── FormField.jsx       # Reusable form field
    ├── FormGrid.jsx        # Grid layout for forms
    ├── InlineError.jsx     # Error message display
    ├── RequiredMark.jsx    # Required field indicator
    ├── SectionHeader.jsx   # Section title
    ├── StepperComponent.jsx # Multi-step indicator
    ├── SuccessDialog.jsx   # Success confirmation modal
    └── index.js            # Component exports
```

## Local Development

### Prerequisites

- Node.js 16+ and npm

### Installation

```bash
npm install
```

### Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Deployment to Vercel

### Option 1: Using Vercel CLI

```bash
npm install -g vercel
vercel
```

### Option 2: GitHub Integration

1. Push your code to GitHub
2. Connect your repository on [Vercel Dashboard](https://vercel.com)
3. Vercel will automatically detect the Vite project and configure it
4. Your app will be deployed automatically on every push to main

## Features

- **Multi-Step Form**: Three-step incident creation process
- **Form Validation**: Client-side validation with error messaging
- **ID Verification**: Mock ID verification flow
- **Responsive Design**: Mobile-friendly Material UI layout
- **Dark Theme**: Optimized dark mode interface
- **Mock API**: Built-in mock API responses for prototyping

## Form Steps

1. **Caller Information**
   - Phone number and caller name
   - Relationship to patient
   - Patient identification and demographic data

2. **Clinical Data**
   - Incident type (single/mass casualty)
   - Clinical observations (consciousness, breathing, bleeding)
   - Medical history

3. **Incident Location**
   - Location and landmark information
   - Ambulance and facility assignment
   - Contact confirmation

## API Integration

The app uses a mock API client that simulates backend responses. To connect to a real backend:

1. Update `src/api-client.js` with your API endpoint
2. Replace the mock response with actual fetch calls

```javascript
export const postDispatchIntent = async (payload) => {
  const response = await fetch('https://your-api.com/api/dispatch', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  return response.json()
}
```

## Environment Variables

Create a `.env` file in the project root for environment-specific configuration:

```env
VITE_API_URL=https://your-api.com
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

Proprietary - Safaricom
