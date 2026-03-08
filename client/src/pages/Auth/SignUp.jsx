import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { supabase } from '../../services/supabase'
import toast from 'react-hot-toast'
import { 
  EnvelopeIcon, 
  LockClosedIcon, 
  UserIcon,
  EyeIcon,
  EyeSlashIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline'

const signUpSchema = z.object({
  fullName: z.string().min(2, 'الاسم يجب أن يكون حرفين على الأقل'),
  email: z.string().email('البريد الإلكتروني غير صحيح'),
  password: z.string()
    .min(8, 'كلمة المرور يجب أن تكون 8 أحرف على الأقل')
    .regex(/[A-Z]/, 'يجب أن تحتوي على حرف كبير واحد على الأقل')
    .regex(/[0-9]/, 'يجب أن تحتوي على رقم واحد على الأقل'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "كلمة المرور غير متطابقة",
  path: ["confirmPassword"]
})

const SignUp = () => {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [agreeTerms, setAgreeTerms] = useState(false)
  const isRTL = i18n.language === 'ar'

  const { register, handleSubmit, watch, formState: { errors, touchedFields } } = useForm({
    resolver: zodResolver(signUpSchema),
    mode: 'onChange'
  })

  const password = watch('password', '')

  const passwordRequirements = [
    { text: '8 أحرف على الأقل', met: password.length >= 8 },
    { text: 'حرف كبير واحد', met: /[A-Z]/.test(password) },
    { text: 'رقم واحد على الأقل', met: /[0-9]/.test(password) },
  ]

  const onSubmit = async (data) => {
    if (!agreeTerms) {
      toast.error('يجب الموافقة على الشروط والأحكام')
      return
    }

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

      toast.success('تم إنشاء الحساب بنجاح! يرجى تفعيل بريدك الإلكتروني')
      navigate('/login')
    } catch (error) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div dir={isRTL ? 'rtl' : 'ltr'} className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 flex items-center justify-center p-4">
      {/* خلفية متحركة */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-5xl bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden"
      >
        <div className="flex flex-col lg:flex-row">
          {/* الجانب الأيسر - صورة/معلومات */}
          <div className="lg:w-1/2 bg-gradient-to-br from-blue-600 to-purple-700 p-12 text-white hidden lg:flex flex-col justify-between">
            <div>
              <motion.h2 
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-4xl font-bold mb-6"
              >
                {t('joinNow')}
              </motion.h2>
              <motion.p 
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-xl text-blue-100 mb-8"
              >
                ابدأ رحلة فهرسة فيديوهاتك بذكاء
              </motion.p>
            </div>

            <motion.div 
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="space-y-6"
            >
              {[
                'فهرسة ذكية للفيديوهات',
                'تقسيم تلقائي للمقاطع',
                'مشاركة سهلة مع فريقك',
                'تحليلات متقدمة'
              ].map((feature, index) => (
                <div key={index} className="flex items-center gap-3">
                  <CheckCircleIcon className="w-6 h-6 text-green-300" />
                  <span>{feature}</span>
                </div>
              ))}
            </motion.div>

            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-12"
            >
              <div className="bg-white/20 rounded-lg p-4 backdrop-blur-sm">
                <p className="text-sm">
                  "أفضل أداة استخدمتها لتنظيم فيديوهاتي التعليمية"
                </p>
                <p className="text-sm mt-2 font-semibold">- أحمد محمد, مدرب معتمد</p>
              </div>
            </motion.div>
          </div>

          {/* الجانب الأيمن - نموذج التسجيل */}
          <div className="lg:w-1/2 p-8 lg:p-12">
            <div className="text-center mb-8">
              <motion.h1 
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
              >
                {t('createAccount')}
              </motion.h1>
              <motion.p 
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="text-gray-600 mt-2"
              >
                {t('joinNow')}
              </motion.p>
            </div>

            <motion.form 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              onSubmit={handleSubmit(onSubmit)} 
              className="space-y-5"
            >
              {/* الاسم الكامل */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  {t('fullName')}
                </label>
                <div className="relative group">
                  <UserIcon className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-3.5 w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors`} />
                  <input
                    {...register('fullName')}
                    type="text"
                    className={`w-full ${isRTL ? 'pr-10' : 'pl-10'} p-3.5 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100 outline-none transition-all`}
                    placeholder="أدخل اسمك الكامل"
                  />
                </div>
                {errors.fullName && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                    {errors.fullName.message}
                  </p>
                )}
              </div>

              {/* البريد الإلكتروني */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  {t('email')}
                </label>
                <div className="relative group">
                  <EnvelopeIcon className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-3.5 w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors`} />
                  <input
                    {...register('email')}
                    type="email"
                    className={`w-full ${isRTL ? 'pr-10' : 'pl-10'} p-3.5 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100 outline-none transition-all`}
                    placeholder="أدخل بريدك الإلكتروني"
                  />
                </div>
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* كلمة المرور */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  {t('password')}
                </label>
                <div className="relative group">
                  <LockClosedIcon className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-3.5 w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors`} />
                  <input
                    {...register('password')}
                    type={showPassword ? 'text' : 'password'}
                    className={`w-full ${isRTL ? 'pr-10 pl-10' : 'pl-10 pr-10'} p-3.5 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100 outline-none transition-all`}
                    placeholder="أدخل كلمة المرور"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className={`absolute ${isRTL ? 'left-3' : 'right-3'} top-3.5 text-gray-400 hover:text-gray-600`}
                  >
                    {showPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                  </button>
                </div>

                {/* متطلبات كلمة المرور */}
                {touchedFields.password && (
                  <div className="mt-3 space-y-2">
                    {passwordRequirements.map((req, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm">
                        <div className={`w-4 h-4 rounded-full flex items-center justify-center ${
                          req.met ? 'bg-green-500' : 'bg-gray-300'
                        }`}>
                          {req.met && <CheckCircleIcon className="w-3 h-3 text-white" />}
                        </div>
                        <span className={req.met ? 'text-green-600' : 'text-gray-500'}>
                          {req.text}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* تأكيد كلمة المرور */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  {t('confirmPassword')}
                </label>
                <div className="relative group">
                  <LockClosedIcon className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-3.5 w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors`} />
                  <input
                    {...register('confirmPassword')}
                    type={showConfirmPassword ? 'text' : 'password'}
                    className={`w-full ${isRTL ? 'pr-10 pl-10' : 'pl-10 pr-10'} p-3.5 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100 outline-none transition-all`}
                    placeholder="أكد كلمة المرور"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className={`absolute ${isRTL ? 'left-3' : 'right-3'} top-3.5 text-gray-400 hover:text-gray-600`}
                  >
                    {showConfirmPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>

              {/* الموافقة على الشروط */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="terms"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-2 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="terms" className="text-sm text-gray-600">
                  {t('agreeToTerms')}{' '}
                  <Link to="/terms" className="text-blue-600 hover:text-blue-800 font-semibold">
                    {t('termsAndConditions')}
                  </Link>
                </label>
              </div>

              {/* زر التسجيل */}
              <button
                type="submit"
                disabled={loading || !agreeTerms}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3.5 px-4 rounded-xl transition duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]"
              >
                {loading ? (
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  'إنشاء حساب'
                )}
              </button>
            </motion.form>

            {/* رابط تسجيل الدخول */}
            <p className="text-center mt-6 text-gray-600">
              لديك حساب بالفعل؟{' '}
              <Link to="/login" className="text-blue-600 hover:text-blue-800 font-semibold">
                تسجيل الدخول
              </Link>
            </p>
          </div>
        </div>
      </motion.div>

      <style jsx>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  )
}

export default SignUp