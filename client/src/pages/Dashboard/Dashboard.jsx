import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import DashboardLayout from '../../components/Layout/DashboardLayout'
import { supabase } from '../../services/supabase'
import {
  VideoCameraIcon,
  ClockIcon,
  BookmarkIcon,
  PlusCircleIcon
} from '@heroicons/react/24/outline'

const Dashboard = () => {
  const { t } = useTranslation()
  const [stats, setStats] = useState({
    totalVideos: 0,
    totalChapters: 0,
    recentVideos: []
  })
  const [loading, setLoading] = useState(true)

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
        .eq('user_id', user.id)

      const { data: recentVideos } = await supabase
        .from('videos')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5)

      setStats({
        totalVideos: videoCount || 0,
        totalChapters: chapterCount || 0,
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
      title: t('totalVideos'),
      value: stats.totalVideos,
      icon: VideoCameraIcon,
      color: 'bg-blue-500'
    },
    {
      title: t('totalChapters'),
      value: stats.totalChapters,
      icon: BookmarkIcon,
      color: 'bg-green-500'
    }
  ]

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* 👇 التعديل هنا - إضافة عنوان الصفحة وزر الإضافة 👇 */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">{t('dashboard')}</h1>
          <Link
            to="/video/new"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition"
          >
            <PlusCircleIcon className="w-5 h-5" />
            <span>{t('addNewVideo')}</span>
          </Link>
        </div>
        {/* 👆 انتهى التعديل 👆 */}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {statCards.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">{stat.title}</p>
                  <p className="text-3xl font-bold mt-2">
                    {loading ? (
                      <div className="w-12 h-8 bg-gray-200 animate-pulse rounded"></div>
                    ) : (
                      stat.value
                    )}
                  </p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-4">{t('recentVideos')}</h2>
          
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-16 bg-gray-200 animate-pulse rounded"></div>
              ))}
            </div>
          ) : stats.recentVideos.length > 0 ? (
            <div className="space-y-3">
              {stats.recentVideos.map((video) => (
                <Link
                  key={video.id}
                  to={`/video/${video.id}`}
                  className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-16 h-12 bg-gray-200 rounded"></div>
                    <div>
                      <h3 className="font-semibold">{video.title}</h3>
                      <p className="text-sm text-gray-500">
                        {new Date(video.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <span className="text-blue-600">{t('view')}</span>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <VideoCameraIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">{t('noVideosYet')}</p>
              <Link
                to="/video/new"
                className="inline-block mt-4 text-blue-600 hover:text-blue-800"
              >
                {t('addYourFirstVideo')}
              </Link>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}

export default Dashboard