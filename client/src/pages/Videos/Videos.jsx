import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import DashboardLayout from '../../components/Layout/DashboardLayout'
import { supabase } from '../../services/supabase'
import toast from 'react-hot-toast'
import {
  VideoCameraIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  PencilIcon,
  TrashIcon,
  PlayIcon,
  ClockIcon,
  BookmarkIcon
} from '@heroicons/react/24/outline'

const Videos = () => {
  const { t, i18n } = useTranslation()
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedPlatform, setSelectedPlatform] = useState('all')
  const isRTL = i18n.language === 'ar'

  useEffect(() => {
    fetchVideos()
  }, [])

  const fetchVideos = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      const { data, error } = await supabase
        .from('videos')
        .select(`
          *,
          video_chapters (
            id,
            title,
            start_time,
            end_time
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setVideos(data || [])
    } catch (error) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (videoId) => {
    if (!confirm(t('confirmDelete'))) return

    try {
      const { error } = await supabase
        .from('videos')
        .delete()
        .eq('id', videoId)

      if (error) throw error

      setVideos(videos.filter(v => v.id !== videoId))
      toast.success(t('videoDeleted'))
    } catch (error) {
      toast.error(error.message)
    }
  }

  // Filter videos
  const filteredVideos = videos.filter(video => {
    const matchesSearch = video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         video.description?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesPlatform = selectedPlatform === 'all' || video.source_type === selectedPlatform
    return matchesSearch && matchesPlatform
  })

  const platforms = [
    { value: 'all', label: t('allPlatforms'), icon: VideoCameraIcon },
    { value: 'youtube', label: 'YouTube', icon: '/youtube-icon.svg' },
    { value: 'facebook', label: 'Facebook', icon: '/facebook-icon.svg' },
    { value: 'twitter', label: 'Twitter', icon: '/twitter-icon.svg' },
    { value: 'vimeo', label: 'Vimeo', icon: '/vimeo-icon.svg' },
    { value: 'local', label: t('local'), icon: VideoCameraIcon }
  ]

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-2xl font-bold text-gray-800">{t('myVideos')}</h1>
          <Link
            to="/video/new"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition w-full sm:w-auto justify-center"
          >
            <VideoCameraIcon className="w-5 h-5" />
            <span>{t('addVideo')}</span>
          </Link>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <MagnifyingGlassIcon className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-3 w-5 h-5 text-gray-400`} />
              <input
                type="text"
                placeholder={t('searchVideos')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full ${isRTL ? 'pr-10' : 'pl-10'} p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none`}
              />
            </div>

            {/* Platform Filter */}
            <div className="relative">
              <select
                value={selectedPlatform}
                onChange={(e) => setSelectedPlatform(e.target.value)}
                className="appearance-none w-full md:w-48 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
              >
                {platforms.map(p => (
                  <option key={p.value} value={p.value}>{p.label}</option>
                ))}
              </select>
              <FunnelIcon className={`absolute ${isRTL ? 'left-3' : 'right-3'} top-2.5 w-5 h-5 text-gray-400 pointer-events-none`} />
            </div>
          </div>
        </div>

        {/* Videos Grid */}
        {loading ? (
          // Skeleton loading
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="bg-white rounded-xl shadow-sm p-4">
                <div className="aspect-video bg-gray-200 animate-pulse rounded-lg mb-4"></div>
                <div className="h-4 bg-gray-200 animate-pulse rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 animate-pulse rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : filteredVideos.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVideos.map((video, index) => (
              <motion.div
                key={video.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition group"
              >
                {/* Thumbnail */}
                <div className="relative aspect-video bg-gray-100 rounded-t-xl overflow-hidden">
                  {video.thumbnail_url ? (
                    <img 
                      src={video.thumbnail_url} 
                      alt={video.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
                      <VideoCameraIcon className="w-12 h-12 text-blue-300" />
                    </div>
                  )}
                  
                  {/* Play button overlay */}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition flex items-center justify-center">
                    <Link
                      to={`/video/${video.id}`}
                      className="w-12 h-12 bg-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition transform scale-90 group-hover:scale-100"
                    >
                      <PlayIcon className="w-6 h-6 text-blue-600" />
                    </Link>
                  </div>

                  {/* Platform badge */}
                  <div className="absolute top-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                    {video.source_type}
                  </div>
                </div>

                {/* Video info */}
                <div className="p-4">
                  <Link to={`/video/${video.id}`}>
                    <h3 className="font-semibold text-gray-800 mb-1 hover:text-blue-600 transition line-clamp-1">
                      {video.title}
                    </h3>
                  </Link>
                  
                  {video.description && (
                    <p className="text-sm text-gray-500 mb-3 line-clamp-2">
                      {video.description}
                    </p>
                  )}

                  {/* Stats */}
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                    <div className="flex items-center gap-1">
                      <ClockIcon className="w-4 h-4" />
                      <span>{Math.floor(video.duration / 60)}:{(video.duration % 60).toString().padStart(2, '0')}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <BookmarkIcon className="w-4 h-4" />
                      <span>{video.video_chapters?.length || 0} {t('chapters')}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-end gap-2 pt-3 border-t">
                    <Link
                      to={`/video/${video.id}/edit`}
                      className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                    >
                      <PencilIcon className="w-5 h-5" />
                    </Link>
                    <button
                      onClick={() => handleDelete(video.id)}
                      className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                    >
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          // Empty state
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <VideoCameraIcon className="w-20 h-20 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">{t('noVideosYet')}</h3>
            <p className="text-gray-500 mb-6">{t('startAddingVideos')}</p>
            <Link
              to="/video/new"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition"
            >
              <VideoCameraIcon className="w-5 h-5" />
              <span>{t('addFirstVideo')}</span>
            </Link>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}

export default Videos