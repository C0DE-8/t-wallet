import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import AddExistingWalletPage from './pages/AddExistingWalletPage'
import WalletDashboard from './pages/WalletDashboard'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AddExistingWalletPage />} />
        <Route path="/wallet" element={<WalletDashboard />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
