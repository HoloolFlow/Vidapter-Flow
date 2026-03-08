import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import DashboardLayout from '../../components/Layout/DashboardLayout'
import { supabase } from '../../services/supabase'
import toast from 'react-hot-toast'
import ReactPlayer from 'react-player'
import {
  ArrowLeftIcon,
  VideoCameraIcon,
  LinkIcon,
  CloudArrowUpIcon
} from '@heroicons/react/24/outline'

const videoSchema = z.object({
  title: z.string().min(2, 'العنوان يجب أن يكون حرفين على الأقل'),
  description: z.string().optional(),
  source_url: z.string().url('الرجاء إدخال رابط صحيح'),
  source_type: z.string()
})

const VideoForm = () => {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const { id } = useParams()
  const [loading, setLoading] = useState(false)
  const [videoUrl, setVideoUrl] = useState('')
  const [videoReady, setVideoReady] = useState(false)
  const isRTL = i18n.language === 'ar'

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm({
    resolver: zodResolver(videoSchema),
    defaultValues: {
      source_type: 'youtube'
    }
  })

  const watchSourceUrl = watch('source_url')
  const watchSourceType = watch('source_type')

  useEffect(() => {
    if (id) {
      fetchVideo()
    }
  }, [id])

  const fetchVideo = async () => {
    try {
      const { data, error } = await supabase
        .from('videos')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error

      setValue('title', data.title)
      setValue('description', data.description || '')
      setValue('source_url', data.source_url)
      setValue('source_type', data.source_type)
      setVideoUrl(data.source_url)
    } catch (error) {
      toast.error(error.message)
      navigate('/videos')
    }
  }

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()

      // Get video metadata from URL
      let videoData = {
        ...data,
        user_id: user.id,
        duration: 0, // You'll need to extract this from the video
        thumbnail_url: '' // You'll need to generate this
      }

      if (id) {
        // Update
        const { error } = await supabase
          .from('videos')
          .update(videoData)
          .eq('id', id)

        if (error) throw error
        toast.success(t('videoUpdated'))
      } else {
        // Create
        const { error } = await supabase
          .from('videos')
          .insert([videoData])

        if (error) throw error
        toast.success(t('videoCreated'))
      }

      navigate('/videos')
    } catch (error) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleUrlChange = (e) => {
    const url = e.target.value
    setVideoUrl(url)
    setVideoReady(ReactPlayer.canPlay(url))
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        {/* Back button */}
        <button
          onClick={() => navigate('/videos')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeftIcon className={`w-5 h-5 ${isRTL ? 'rotate-180' : ''}`} />
          <span>{t('backToVideos')}</span>
        </button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm p-6"
        >
          <h1 className="text-2xl font-bold text-gray-800 mb-6">
            {id ? t('editVideo') : t('addNewVideo')}
          </h1>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Platform Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('videoSource')}
              </label>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {[
                  { value: 'youtube', label: 'YouTube', icon: '🎥' },
                  { value: 'facebook', label: 'Facebook', icon: '📘' },
                  { value: 'twitter', label: 'Twitter', icon: '🐦' },
                  { value: 'vimeo', label: 'Vimeo', icon: '🎬' },
                  { value: 'local', label: t('local'), icon: '💻' }
                ].map(platform => (
                  <label
                    key={platform.value}
                    className={`flex flex-col items-center p-3 border rounded-lg cursor-pointer transition ${
                      watchSourceType === platform.value
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-300'
                    }`}
                  >
                    <input
                      type="radio"
                      value={platform.value}
                      {...register('source_type')}
                      className="hidden"
                    />
                    <span className="text-2xl mb-1">{platform.icon}</span>
                    <span className="text-sm">{platform.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* URL Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {watchSourceType === 'local' ? t('uploadVideo') : t('videoUrl')}
              </label>
              <div className="relative">
                {watchSourceType === 'local' ? (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition">
                    <CloudArrowUpIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600 mb-2">{t('dragAndDrop')}</p>
                    <p className="text-sm text-gray-500">{t('or')}</p>
                    <button
                      type="button"
                      className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    >
                      {t('browseFiles')}
                    </button>
                  </div>
                ) : (
                  <>
                    <LinkIcon className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-3 w-5 h-5 text-gray-400`} />
                    <input
                      {...register('source_url')}
                      type="url"
                      onChange={handleUrlChange}
                      className={`w-full ${isRTL ? 'pr-10' : 'pl-10'} p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none`}
                      placeholder="https://..."
                    />
                  </>
                )}
              </div>
              {errors.source_url && (
                <p className="text-red-500 text-sm mt-1">{errors.source_url.message}</p>
              )}
            </div>

            {/* Video Preview */}
            {videoUrl && videoReady && (
              <div className="aspect-video bg-black rounded-lg overflow-hidden">
                <ReactPlayer
                  url={videoUrl}
                  width="100%"
                  height="100%"
                  controls
                />
              </div>
            )}

            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('videoTitle')}
              </label>
              <input
                {...register('title')}
                type="text"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                placeholder={t('enterVideoTitle')}
              />
              {errors.title && (
                <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('description')} ({t('optional')})
              </label>
              <textarea
                {...register('description')}
                rows="4"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
                placeholder={t('enterDescription')}
              />
            </div>

            {/* Submit Button */}
            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto"></div>
                ) : (
                  id ? t('updateVideo') : t('createVideo')
                )}
              </button>
              <button
                type="button"
                onClick={() => navigate('/videos')}
                className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
              >
                {t('cancel')}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </DashboardLayout>
  )
}

export default VideoForm