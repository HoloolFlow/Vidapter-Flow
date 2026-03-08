import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '../../services/supabase'
import {
  HomeIcon,
  VideoCameraIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
  UserCircleIcon,
  BellIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline'

const DashboardLayout = ({ children }) => {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [user, setUser] = useState(null)
  const [notifications, setNotifications] = useState(3)
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
    { path: '/dashboard', icon: HomeIcon, label: 'الرئيسية' },
    { path: '/videos', icon: VideoCameraIcon, label: 'الفيديوهات' },
    { path: '/settings', icon: Cog6ToothIcon, label: 'الإعدادات' }
  ]

  return (
    <div dir={isRTL ? 'rtl' : 'ltr'} className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Mobile sidebar backdrop */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-20 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={{ x: isRTL ? 300 : -300 }}
        animate={{ x: sidebarOpen ? 0 : isRTL ? 300 : -300 }}
        transition={{ type: 'spring', damping: 20 }}
        className={`fixed top-0 ${isRTL ? 'right-0' : 'left-0'} h-full w-72 bg-white/90 backdrop-blur-xl shadow-2xl z-30 lg:translate-x-0 lg:static lg:z-0 border-l border-gray-100`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-gray-100">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            VideoIndexer
          </h1>
        </div>

        {/* User info */}
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
              <UserCircleIcon className="w-8 h-8 text-white" />
            </div>
            <div>
              <p className="font-semibold text-gray-800">{user?.user_metadata?.full_name || 'مستخدم'}</p>
              <p className="text-sm text-gray-500">{user?.email}</p>
            </div>
          </div>
        </div>

        {/* Menu */}
        <nav className="p-4 space-y-1">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <item.icon className={`w-5 h-5 ${isActive ? '' : 'group-hover:scale-110 transition-transform'}`} />
                <span className="font-medium">{item.label}</span>
                {isActive && (
                  <motion.div
                    layoutId="activeIndicator"
                    className={`w-1 h-6 bg-white rounded-full ${isRTL ? 'mr-auto' : 'ml-auto'}`}
                  />
                )}
              </Link>
            )
          })}

          {/* Logout button */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-all duration-300 mt-4 group"
          >
            <ArrowRightOnRectangleIcon className={`w-5 h-5 group-hover:scale-110 transition-transform ${isRTL ? 'rotate-180' : ''}`} />
            <span className="font-medium">تسجيل الخروج</span>
          </button>
        </nav>

        {/* Upgrade plan */}
        <div className="absolute bottom-6 left-4 right-4">
          <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl p-4 text-white">
            <h3 className="font-semibold mb-1">الخطة المجانية</h3>
            <p className="text-sm text-blue-100 mb-3">3 فيديوهات متبقية</p>
            <button className="w-full bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg py-2 text-sm font-semibold transition">
              ترقية الآن
            </button>
          </div>
        </div>
      </motion.aside>

      {/* Main content */}
      <div className="lg:mr-72 lg:ml-0 transition-all duration-300">
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-xl sticky top-0 z-10 border-b border-gray-100">
          <div className="flex items-center justify-between p-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition"
            >
              <Bars3Icon className="w-6 h-6" />
            </button>

            {/* Search bar */}
            <div className="hidden md:flex items-center bg-gray-100 rounded-xl px-4 py-2 w-96">
              <MagnifyingGlassIcon className="w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="بحث..."
                className="bg-transparent border-none outline-none px-3 w-full"
              />
            </div>

            <div className="flex items-center gap-3">
              {/* Notifications */}
              <button className="relative p-2 hover:bg-gray-100 rounded-lg transition">
                <BellIcon className="w-6 h-6 text-gray-600" />
                {notifications > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                    {notifications}
                  </span>
                )}
              </button>

              {/* Language switcher */}
              <button
                onClick={() => i18n.changeLanguage(i18n.language === 'ar' ? 'en' : 'ar')}
                className="px-4 py-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition"
              >
                {i18n.language === 'ar' ? 'English' : 'العربية'}
              </button>

              {/* User menu */}
              <button className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg transition">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                  <UserCircleIcon className="w-6 h-6 text-white" />
                </div>
              </button>
            </div>
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