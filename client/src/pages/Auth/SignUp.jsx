import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { supabase } from '../../services/supabase'
import toast from 'react-hot-toast'
import { EnvelopeIcon, LockClosedIcon, UserIcon, ArrowRightIcon } from '@heroicons/react/24/outline'

const signUpSchema = z.object({
  fullName: z.string().min(2, 'الاسم يجب أن يكون حرفين على الأقل'),
  email: z.string().email('البريد الإلكتروني غير صحيح'),
  password: z.string().min(6, 'كلمة المرور يجب أن تكون 6 أحرف على الأقل'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "كلمة المرور غير متطابقة",
  path: ["confirmPassword"]
})

const SignUp = () => {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const isRTL = i18n.language === 'ar'

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(signUpSchema)
  })

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      const { error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            full_name: data.fullName
          }
        }
      })

      if (error) throw error

      toast.success(t('signUpSuccess'))
      navigate('/dashboard')
    } catch (error) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div dir={isRTL ? 'rtl' : 'ltr'} className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            {t('createAccount')}
          </h1>
          <p className="text-gray-600">
            {t('joinNow')}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('fullName')}
            </label>
            <div className="relative">
              <UserIcon className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-3 w-5 h-5 text-gray-400`} />
              <input
                {...register('fullName')}
                type="text"
                className={`w-full ${isRTL ? 'pr-10' : 'pl-10'} p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition`}
                placeholder={t('enterFullName')}
              />
            </div>
            {errors.fullName && (
              <p className="text-red-500 text-sm mt-1">{errors.fullName.message}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('email')}
            </label>
            <div className="relative">
              <EnvelopeIcon className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-3 w-5 h-5 text-gray-400`} />
              <input
                {...register('email')}
                type="email"
                className={`w-full ${isRTL ? 'pr-10' : 'pl-10'} p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition`}
                placeholder={t('enterEmail')}
              />
            </div>
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('password')}
            </label>
            <div className="relative">
              <LockClosedIcon className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-3 w-5 h-5 text-gray-400`} />
              <input
                {...register('password')}
                type="password"
                className={`w-full ${isRTL ? 'pr-10' : 'pl-10'} p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition`}
                placeholder={t('enterPassword')}
              />
            </div>
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('confirmPassword')}
            </label>
            <div className="relative">
              <LockClosedIcon className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-3 w-5 h-5 text-gray-400`} />
              <input
                {...register('confirmPassword')}
                type="password"
                className={`w-full ${isRTL ? 'pr-10' : 'pl-10'} p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition`}
                placeholder={t('confirmPassword')}
              />
            </div>
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>
            )}
          </div>

          {/* Terms */}
          <div className="flex items-center">
            <input
              type="checkbox"
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              required
            />
            <span className="mr-2 text-sm text-gray-600">
              {t('agreeToTerms')}{' '}
              <Link to="/terms" className="text-blue-600 hover:text-blue-800">
                {t('termsAndConditions')}
              </Link>
            </span>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <span>{t('signUp')}</span>
                <ArrowRightIcon className={`w-5 h-5 ${isRTL ? 'rotate-180' : ''}`} />
              </>
            )}
          </button>
        </form>

        {/* Login link */}
        <p className="text-center mt-6 text-gray-600">
          {t('alreadyHaveAccount')}{' '}
          <Link to="/login" className="text-blue-600 hover:text-blue-800 font-semibold">
            {t('login')}
          </Link>
        </p>
      </motion.div>
    </div>
  )
}

export default SignUp