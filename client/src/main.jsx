import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ClerkProvider } from '@clerk/clerk-react'
import App from './App.jsx'
import './index.css'

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  throw new Error('Missing Clerk Publishable Key')
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <ClerkProvider
    publishableKey={PUBLISHABLE_KEY}
    afterSignOutUrl="/"
    afterSignInUrl="/dashboard"
    afterSignUpUrl="/dashboard"
    appearance={{
      variables: {
        colorPrimary: '#102542',
        colorText: '#102542',
        colorBackground: '#ffffff',
      },
      elements: {
        formButtonPrimary: 'bg-primary hover:bg-accent',
        card: 'shadow-lg',
      }
    }}
  >
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </ClerkProvider>,
)
