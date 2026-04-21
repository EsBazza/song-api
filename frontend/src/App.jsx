import { Routes, Route } from 'react-router-dom'
import NavBar from './components/NavBar'
import HomePage from './pages/HomePage'
import WatchPage from './pages/WatchPage'

export default function App() {
  return (
    <div className="min-h-screen bg-[#0f0f0f]">
      <NavBar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/watch/:id" element={<WatchPage />} />
      </Routes>
    </div>
  )
}
