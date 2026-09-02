import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import AddExistingWalletPage from './pages/AddExistingWalletPage/AddExistingWalletPage'
import LandingPage from './pages/LandingPage/LandingPage'
import WalletDashboard from './pages/WalletDashboard/WalletDashboard'
import './styles/app.css'
import './styles/pages.css'
import './styles/components.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/add-existing-wallet" element={<AddExistingWalletPage />} />
        <Route path="/wallet" element={<WalletDashboard />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
