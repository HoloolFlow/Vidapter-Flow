import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { supabase } from './services/supabase'
import { Toaster } from 'react-hot-toast'
import './i18n/config'

// صفحات
import Landing from './pages/Landing/Landing'
import Login from './pages/Auth/Login'
import SignUp from './pages/Auth/SignUp'
import Dashboard from './pages/Dashboard/Dashboard'
import VideoIndex from './pages/VideoIndex/VideoIndex'
import Settings from './pages/Settings/Settings'

function App() {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <Router>
      <Toaster position="top-center" />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={!session ? <Login /> : <Navigate to="/dashboard" />} />
        <Route path="/signup" element={!session ? <SignUp /> : <Navigate to="/dashboard" />} />
        <Route path="/dashboard" element={session ? <Dashboard /> : <Navigate to="/login" />} />
        <Route path="/settings" element={session ? <Settings /> : <Navigate to="/login" />} />        
        <Route path="/videos" element={session ? <Videos /> : <Navigate to="/login" />} />
        <Route path="/video/:id" element={session ? <VideoIndex /> : <Navigate to="/login" />} />
        <Route path="/video/new" element={session ? <VideoIndex /> : <Navigate to="/login" />} />
      </Routes>
    </Router>
  )
}

export default App