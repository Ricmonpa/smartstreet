import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AppProvider } from './context/AppContext'
import HomePage from './pages/HomePage'
import RouteSelectionPage from './pages/RouteSelectionPage'
import NavigationPage from './pages/NavigationPage'

function App() {
  return (
    <AppProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/routes" element={<RouteSelectionPage />} />
          <Route path="/navigation" element={<NavigationPage />} />
        </Routes>
      </Router>
    </AppProvider>
  )
}

export default App

