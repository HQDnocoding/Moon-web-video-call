import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import JitsiMeetingComponent from './JitsiMeetingComponent.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* <App /> */}
    <JitsiMeetingComponent/>
  </StrictMode>,
)
