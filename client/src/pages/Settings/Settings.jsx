import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import DashboardLayout from '../../components/Layout/DashboardLayout'
import { supabase } from '../../services/supabase'
import toast from 'react-hot-toast'
import {
  UserCircleIcon,
  BellIcon,
  ShieldCheckIcon,
  PaintBrushIcon,
  LanguageIcon,
  DevicePhoneMobileIcon,
  ArrowRightIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline'

const Settings = () => {
  const { t, i18n } = useTranslation()
  const [activeTab, setActiveTab] = useState('profile')
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState(null)
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    language: 'ar',
    theme: 'light',
    notifications: {
      email: true,
      push: false,
      marketing: false
    }
  })

  const isRTL = i18n.language === 'ar'

  useEffect(() => {
    getUser()
  }, [])

  const getUser = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    setUser(user)
    setFormData(prev => ({
      ...prev,
      fullName: user?.user_metadata?.full_name || '',
      email: user?.email || ''
    }))
  }

  const handleUpdateProfile = async () => {
    setLoading(true)
    try {
      const { error } = await supabase.auth.updateUser({
        data: { full_name: formData.fullName }
      })
      if (error) throw error
      toast.success('تم تحديث الملف الشخصي بنجاح')
    } catch (error) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  const tabs = [
    { id: 'profile', name: 'الملف الشخصي', icon: UserCircleIcon },
    { id: 'notifications', name: 'الإشعارات', icon: BellIcon },
    { id: 'appearance', name: 'المظهر', icon: PaintBrushIcon },
    { id: 'security', name: 'الأمان', icon: ShieldCheckIcon }
  ]

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            الإعدادات
          </h1>
          <p className="text-gray-600 mt-2">
            إدارة إعدادات حسابك وتفضيلاتك الشخصية
          </p>
        </motion.div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-8 p-1 bg-gray-100 rounded-2xl">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium transition-all duration-300 ${
                activeTab === tab.id
                  ? 'bg-white text-blue-600 shadow-lg'
                  : 'text-gray-600 hover:bg-gray-200'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              <span className="hidden sm:inline">{tab.name}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg p-8"
        >
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="space-y-8">
              <div className="flex items-center gap-6">
                <div className="relative">
                  <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center">
                    <UserCircleIcon className="w-16 h-16 text-white" />
                  </div>
                  <button className="absolute -bottom-2 -right-2 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition">
                    <CameraIcon className="w-4 h-4" />
                  </button>
                </div>
                <div>
                  <h2 className="text-2xl font-bold">{formData.fullName || 'مستخدم'}</h2>
                  <p className="text-gray-500">{formData.email}</p>
                  <span className="inline-block mt-2 px-3 py-1 bg-green-100 text-green-600 rounded-full text-sm">
                    حساب نشط
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    الاسم الكامل
                  </label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full p-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all"
                    placeholder="أدخل اسمك الكامل"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    البريد الإلكتروني
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    disabled
                    className="w-full p-3 bg-gray-100 border-2 border-gray-200 rounded-xl cursor-not-allowed opacity-60"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    لا يمكن تغيير البريد الإلكتروني
                  </p>
                </div>

                <button
                  onClick={handleUpdateProfile}
                  disabled={loading}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all duration-300 flex items-center gap-2"
                >
                  {loading ? 'جاري الحفظ...' : 'حفظ التغييرات'}
                </button>
              </div>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold mb-4">إعدادات الإشعارات</h2>
              
              {[
                { id: 'email', label: 'إشعارات البريد الإلكتروني', desc: 'استقبل التحديثات على بريدك' },
                { id: 'push', label: 'إشعارات المتصفح', desc: 'إشعارات فورية عند إضافة محتوى' },
                { id: 'marketing', label: 'العروض والتسويق', desc: 'استقبل عروض وخصومات حصرية' }
              ].map((item) => (
                <div key={item.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div>
                    <h3 className="font-semibold">{item.label}</h3>
                    <p className="text-sm text-gray-500">{item.desc}</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.notifications[item.id]}
                      onChange={(e) => setFormData({
                        ...formData,
                        notifications: {
                          ...formData.notifications,
                          [item.id]: e.target.checked
                        }
                      })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              ))}
            </div>
          )}

          {/* Appearance Tab */}
          {activeTab === 'appearance' && (
            <div className="space-y-8">
              <div>
                <h2 className="text-xl font-bold mb-4">اللغة</h2>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => i18n.changeLanguage('ar')}
                    className={`p-4 border-2 rounded-xl flex items-center justify-center gap-2 transition-all ${
                      i18n.language === 'ar'
                        ? 'border-blue-600 bg-blue-50 text-blue-600'
                        : 'border-gray-200 hover:border-blue-300'
                    }`}
                  >
                    <LanguageIcon className="w-5 h-5" />
                    <span>العربية</span>
                    {i18n.language === 'ar' && <CheckCircleIcon className="w-5 h-5" />}
                  </button>
                  <button
                    onClick={() => i18n.changeLanguage('en')}
                    className={`p-4 border-2 rounded-xl flex items-center justify-center gap-2 transition-all ${
                      i18n.language === 'en'
                        ? 'border-blue-600 bg-blue-50 text-blue-600'
                        : 'border-gray-200 hover:border-blue-300'
                    }`}
                  >
                    <LanguageIcon className="w-5 h-5" />
                    <span>English</span>
                    {i18n.language === 'en' && <CheckCircleIcon className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div>
                <h2 className="text-xl font-bold mb-4">المظهر</h2>
                <div className="grid grid-cols-2 gap-4">
                  {['فاتح', 'داكن'].map((theme, index) => (
                    <button
                      key={index}
                      className={`p-4 border-2 rounded-xl transition-all ${
                        (index === 0 && formData.theme === 'light')
                          ? 'border-blue-600 bg-blue-50'
                          : 'border-gray-200 hover:border-blue-300'
                      }`}
                    >
                      <PaintBrushIcon className="w-5 h-5 mx-auto mb-2" />
                      <span>{theme}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold mb-4">الأمان والخصوصية</h2>
              
              <div className="p-4 bg-gray-50 rounded-xl">
                <h3 className="font-semibold mb-2">تغيير كلمة المرور</h3>
                <div className="space-y-3">
                  <input
                    type="password"
                    placeholder="كلمة المرور الحالية"
                    className="w-full p-3 bg-white border-2 border-gray-200 rounded-xl focus:border-blue-500 outline-none transition-all"
                  />
                  <input
                    type="password"
                    placeholder="كلمة المرور الجديدة"
                    className="w-full p-3 bg-white border-2 border-gray-200 rounded-xl focus:border-blue-500 outline-none transition-all"
                  />
                  <input
                    type="password"
                    placeholder="تأكيد كلمة المرور الجديدة"
                    className="w-full p-3 bg-white border-2 border-gray-200 rounded-xl focus:border-blue-500 outline-none transition-all"
                  />
                  <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all duration-300">
                    تحديث كلمة المرور
                  </button>
                </div>
              </div>

              <div className="p-4 bg-red-50 rounded-xl">
                <h3 className="font-semibold text-red-600 mb-2">منطقة الخطر</h3>
                <p className="text-sm text-red-500 mb-3">حذف الحساب نهائياً لا يمكن التراجع عنه</p>
                <button className="px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all duration-300">
                  حذف الحساب
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </DashboardLayout>
  )
}

export default Settings