import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { ArrowRightIcon, PlayIcon, BookOpenIcon } from '@heroicons/react/24/outline'

const Landing = () => {
  const { t, i18n } = useTranslation()
  const isRTL = i18n.language === 'ar'

  return (
    <div dir={isRTL ? 'rtl' : 'ltr'} className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Navbar */}
      <nav className="container mx-auto px-4 py-6 flex justify-between items-center">
        <div className="text-2xl font-bold text-blue-600">
          VideoIndexer
        </div>
        <div className="flex gap-4">
          <button
            onClick={() => i18n.changeLanguage(i18n.language === 'ar' ? 'en' : 'ar')}
            className="px-4 py-2 text-gray-600 hover:text-gray-900"
          >
            {i18n.language === 'ar' ? 'English' : 'العربية'}
          </button>
          <Link
            to="/login"
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            {t('login')}
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-4xl mx-auto"
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            {t('hero.title')}
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            {t('hero.subtitle')}
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              to="/signup"
              className="px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-lg flex items-center gap-2"
            >
              {t('getStarted')}
              <ArrowRightIcon className={`w-5 h-5 ${isRTL ? 'rotate-180' : ''}`} />
            </Link>
            <button className="px-8 py-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition text-lg flex items-center gap-2">
              <PlayIcon className="w-5 h-5" />
              {t('watchDemo')}
            </button>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center p-6"
          >
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <PlayIcon className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold mb-2">{t('features.multiPlatform.title')}</h3>
            <p className="text-gray-600">{t('features.multiPlatform.desc')}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-center p-6"
          >
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <BookOpenIcon className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold mb-2">{t('features.indexing.title')}</h3>
            <p className="text-gray-600">{t('features.indexing.desc')}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-center p-6"
          >
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2">{t('features.private.title')}</h3>
            <p className="text-gray-600">{t('features.private.desc')}</p>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">{t('cta.title')}</h2>
          <p className="text-xl mb-8 text-blue-100">{t('cta.subtitle')}</p>
          <Link
            to="/signup"
            className="px-8 py-4 bg-white text-blue-600 rounded-lg hover:bg-gray-100 transition text-lg inline-block"
          >
            {t('startNow')}
          </Link>
        </div>
      </section>
    </div>
  )
}

export default Landing