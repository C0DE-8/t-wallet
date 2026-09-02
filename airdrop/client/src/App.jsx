import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import AirdropPage from './pages/AirdropPage/AirdropPage'
import LandingPage from './pages/LandingPage/LandingPage'
import './styles/pages.css'
import './styles/components.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/airdrop" element={<AirdropPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
