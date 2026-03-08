import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import DashboardLayout from '../../components/Layout/DashboardLayout'
import { supabase } from '../../services/supabase'
import {
  VideoCameraIcon,
  ClockIcon,
  BookmarkIcon,
  PlusCircleIcon,
  ChartBarIcon,
  PlayIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline'

const Dashboard = () => {
  const { t, i18n } = useTranslation()
  const [stats, setStats] = useState({
    totalVideos: 0,
    totalChapters: 0,
    totalViews: 0,
    recentVideos: []
  })
  const [loading, setLoading] = useState(true)
  const isRTL = i18n.language === 'ar'

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      const { count: videoCount } = await supabase
        .from('videos')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)

      const { count: chapterCount } = await supabase
        .from('video_chapters')
        .select('*', { count: 'exact', head: true })

      const { data: recentVideos } = await supabase
        .from('videos')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(6)

      setStats({
        totalVideos: videoCount || 0,
        totalChapters: chapterCount || 0,
        totalViews: 0,
        recentVideos: recentVideos || []
      })
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const statCards = [
    {
      title: 'إجمالي الفيديوهات',
      value: stats.totalVideos,
      icon: VideoCameraIcon,
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
      link: '/videos'
    },
    {
      title: 'إجمالي المقاطع',
      value: stats.totalChapters,
      icon: BookmarkIcon,
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600',
      link: '/videos'
    },
    {
      title: 'إجمالي المشاهدات',
      value: '1.2K',
      icon: ChartBarIcon,
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600',
      link: '#'
    }
  ]

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header مع ترحيب */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
        >
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              مرحباً بعودتك! 👋
            </h1>
            <p className="text-gray-600 mt-2">
              هذا ملخص نشاطك في الأسبوع الأخير
            </p>
          </div>
          <Link
            to="/video/new"
            className="group px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-300 flex items-center gap-2"
          >
            <PlusCircleIcon className="w-5 h-5" />
            <span>إضافة فيديو جديد</span>
            <ArrowRightIcon className={`w-4 h-4 group-hover:translate-x-1 transition-transform ${isRTL ? 'rotate-180 group-hover:-translate-x-1' : ''}`} />
          </Link>
        </motion.div>

        {/* Stats Cards متطورة */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {statCards.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="relative bg-white rounded-2xl shadow-lg overflow-hidden group cursor-pointer"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm mb-1">{stat.title}</p>
                    {loading ? (
                      <div className="h-8 w-16 bg-gray-200 animate-pulse rounded"></div>
                    ) : (
                      <p className="text-3xl font-bold text-gray-800">{stat.value}</p>
                    )}
                  </div>
                  <div className={`${stat.bgColor} p-4 rounded-xl`}>
                    <stat.icon className={`w-6 h-6 ${stat.iconColor}`} />
                  </div>
                </div>
                <div className="mt-4 text-sm text-gray-500">
                  <span className="text-green-500">↑ 12%</span> عن الأسبوع الماضي
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl shadow-lg p-6"
        >
          <h2 className="text-xl font-bold mb-4">إجراءات سريعة</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: PlusCircleIcon, label: 'رفع فيديو', color: 'bg-blue-500', link: '/video/new' },
              { icon: DocumentTextIcon, label: 'إنشاء فهرس', color: 'bg-purple-500', link: '/videos' },
              { icon: VideoCameraIcon, label: 'مشاهدة الكل', color: 'bg-green-500', link: '/videos' },
              { icon: Cog6ToothIcon, label: 'الإعدادات', color: 'bg-orange-500', link: '/settings' }
            ].map((action, index) => (
              <Link
                key={index}
                to={action.link}
                className="group flex flex-col items-center p-4 rounded-xl hover:bg-gray-50 transition-all duration-300"
              >
                <div className={`${action.color} p-3 rounded-xl text-white mb-2 group-hover:scale-110 transition-transform duration-300`}>
                  <action.icon className="w-6 h-6" />
                </div>
                <span className="text-sm text-gray-600">{action.label}</span>
              </Link>
            ))}
          </div>
        </motion.div>

        {/* Recent Videos Section متطورة */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl shadow-lg p-6"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">آخر الفيديوهات المضافة</h2>
            <Link to="/videos" className="text-blue-600 hover:text-blue-800 flex items-center gap-1">
              عرض الكل
              <ArrowRightIcon className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
            </Link>
          </div>
          
          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-48 bg-gray-200 animate-pulse rounded-xl"></div>
              ))}
            </div>
          ) : stats.recentVideos.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {stats.recentVideos.map((video, index) => (
                <motion.div
                  key={video.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                  className="group bg-gray-50 rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300"
                >
                  <Link to={`/video/${video.id}`}>
                    <div className="relative h-40 bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                      <PlayIcon className="w-12 h-12 text-white opacity-50 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300" />
                      <span className="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                        15:30
                      </span>
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-800 mb-1 line-clamp-1">
                        {video.title || 'فيديو بدون عنوان'}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {new Date(video.created_at).toLocaleDateString('ar-EG')}
                      </p>
                      <div className="flex items-center gap-2 mt-3">
                        <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded">
                          ٣ مقاطع
                        </span>
                        <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded">
                          {video.source_type || 'يوتيوب'}
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <VideoCameraIcon className="w-20 h-20 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">لا توجد فيديوهات بعد</p>
              <Link
                to="/video/new"
                className="inline-block px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all duration-300"
              >
                أضف أول فيديو لك
              </Link>
            </div>
          )}
        </motion.div>
      </div>
    </DashboardLayout>
  )
}

export default Dashboard