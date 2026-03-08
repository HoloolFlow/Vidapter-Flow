import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { supabase } from '../../services/supabase'
import {
  HomeIcon,
  VideoCameraIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
  UserCircleIcon
} from '@heroicons/react/24/outline'

const DashboardLayout = ({ children }) => {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [user, setUser] = useState(null)
  const isRTL = i18n.language === 'ar'

  useEffect(() => {
    getUser()
  }, [])

  const getUser = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    setUser(user)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/')
  }

  const menuItems = [
    { path: '/dashboard', icon: HomeIcon, label: t('dashboard') },
    { path: '/videos', icon: VideoCameraIcon, label: t('myVideos') },
    { path: '/settings', icon: Cog6ToothIcon, label: t('settings') }
  ]

  return (
    <div dir={isRTL ? 'rtl' : 'ltr'} className="min-h-screen bg-gray-50">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <motion.aside
        initial={{ x: isRTL ? 300 : -300 }}
        animate={{ x: sidebarOpen ? 0 : isRTL ? 300 : -300 }}
        transition={{ type: 'tween' }}
        className={`fixed top-0 ${isRTL ? 'right-0' : 'left-0'} h-full w-64 bg-white shadow-lg z-30 lg:translate-x-0 lg:static lg:z-0`}
      >
        {/* Logo */}
        <div className="p-6 border-b">
          <h1 className="text-2xl font-bold text-blue-600">VideoIndexer</h1>
        </div>

        {/* User info */}
        <div className="p-4 border-b">
          <div className="flex items-center gap-3">
            <UserCircleIcon className="w-10 h-10 text-gray-400" />
            <div>
              <p className="font-semibold">{user?.user_metadata?.full_name || 'User'}</p>
              <p className="text-sm text-gray-500">{user?.email}</p>
            </div>
          </div>
        </div>

        {/* Menu */}
        <nav className="p-4">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 mb-2 rounded-lg transition ${
                  isActive
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            )
          })}

          {/* Logout button */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition mt-4"
          >
            <ArrowRightOnRectangleIcon className={`w-5 h-5 ${isRTL ? 'rotate-180' : ''}`} />
            <span>{t('logout')}</span>
          </button>
        </nav>
      </motion.aside>

      {/* Main content */}
      <div className="lg:mr-0 lg:ml-0" style={{ marginRight: isRTL ? '16rem' : 0, marginLeft: !isRTL ? '16rem' : 0 }}>
        {/* Header */}
        <header className="bg-white shadow-sm sticky top-0 z-10">
          <div className="flex items-center justify-between p-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
            >
              <Bars3Icon className="w-6 h-6" />
            </button>

            <div className="flex-1" />

            {/* Language switcher */}
            <button
              onClick={() => i18n.changeLanguage(i18n.language === 'ar' ? 'en' : 'ar')}
              className="px-4 py-2 text-gray-600 hover:text-gray-900"
            >
              {i18n.language === 'ar' ? 'English' : 'العربية'}
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  )
}

export default DashboardLayout