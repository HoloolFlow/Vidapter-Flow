import { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { supabase } from '../../services/supabase'
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline'

const EmailConfirmed = () => {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const location = useLocation()
  const [status, setStatus] = useState('loading')
  const [message, setMessage] = useState('')
  const isRTL = i18n.language === 'ar'

  useEffect(() => {
    const handleEmailConfirmation = async () => {
      try {
        // Supabase بتتعامل مع التأكيد تلقائياً
        // بنحتاج فقط نفحص الـ hash في الـ URL
        const hashParams = new URLSearchParams(location.hash.substring(1))
        const error = hashParams.get('error')
        
        if (error) {
          setStatus('error')
          setMessage(t('confirmationFailed'))
          return
        }

        // لو مفيش error، يبقى التأكيد تم بنجاح
        setStatus('success')
        setMessage(t('emailConfirmed'))
        
        // بعد 3 ثوان نوجه لصفحة الدخول
        setTimeout(() => {
          navigate('/login')
        }, 3000)
        
      } catch (error) {
        setStatus('error')
        setMessage(error.message)
      }
    }

    handleEmailConfirmation()
  }, [location, navigate, t])

  return (
    <div dir={isRTL ? 'rtl' : 'ltr'} className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8 text-center"
      >
        {status === 'loading' && (
          <>
            <div className="w-20 h-20 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-6"></div>
            <h1 className="text-2xl font-bold text-gray-800 mb-3">
              {t('confirmingEmail')}
            </h1>
            <p className="text-gray-600">
              {t('pleaseWait')}
            </p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircleIcon className="w-10 h-10 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-3">
              {t('emailConfirmed')}
            </h1>
            <p className="text-gray-600 mb-6">
              {message}
            </p>
            <p className="text-sm text-gray-500">
              {t('redirectingToLogin')}
            </p>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <XCircleIcon className="w-10 h-10 text-red-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-3">
              {t('confirmationFailed')}
            </h1>
            <p className="text-gray-600 mb-6">
              {message}
            </p>
            <button
              onClick={() => navigate('/signup')}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition"
            >
              {t('tryAgain')}
            </button>
          </>
        )}
      </motion.div>
    </div>
  )
}

export default EmailConfirmed