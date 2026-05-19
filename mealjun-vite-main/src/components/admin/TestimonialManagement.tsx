import { useState, useEffect } from 'react'
import { testimonialsAPI } from '../../services/api'
import {
  Plus,
  Trash2,
  Edit2,
  AlertCircle,
  Loader,
  Star,
  Upload,
  X,
} from 'lucide-react'
import { handleImageUpload } from '../../utils/imageUpload'

interface Testimonial {
  id: string
  customer_name: string
  customer_location: string
  rating: number
  review_text: string
  customer_avatar: string
  is_featured: boolean
}

export default function TestimonialManagement() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingTestimonial, setEditingTestimonial] =
    useState<Testimonial | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    customer_name: '',
    customer_location: '',
    rating: 5,
    review_text: '',
    avatar_base64: '',
    is_featured: false,
  })

  useEffect(() => {
    loadTestimonials()
  }, [])

  const loadTestimonials = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await testimonialsAPI.getTestimonials()
      setTestimonials(response.data.data || response.data)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Gagal memuat testimoni')
    } finally {
      setIsLoading(false)
    }
  }

  const openAddModal = () => {
    setEditingTestimonial(null)
    setAvatarPreview(null)
    setUploadError(null)
    setFormData({
      customer_name: '',
      customer_location: '',
      rating: 5,
      review_text: '',
      avatar_base64: '',
      is_featured: false,
    })
    setIsModalOpen(true)
  }

  const openEditModal = (testimonial: Testimonial) => {
    setEditingTestimonial(testimonial)
    setAvatarPreview(testimonial.customer_avatar)
    setUploadError(null)
    setFormData({
      customer_name: testimonial.customer_name,
      customer_location: testimonial.customer_location,
      rating: testimonial.rating,
      review_text: testimonial.review_text,
      avatar_base64: '',
      is_featured: testimonial.is_featured,
    })
    setIsModalOpen(true)
  }

  const handleImageUploadChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0]
    if (!file) return

    const result = await handleImageUpload(file)
    if (result.success && result.data) {
      setFormData({ ...formData, avatar_base64: result.data })
      setAvatarPreview(result.data)
      setUploadError(null)
    } else {
      setUploadError(result.error || 'Gagal mengupload avatar')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setError(null)

    try {
      // Jika tidak ada avatar baru, hapus field avatar_base64
      const submitData =
        editingTestimonial && !formData.avatar_base64
          ? (() => {
              const { avatar_base64, ...rest } = formData
              return rest
            })()
          : formData

      if (editingTestimonial) {
        await testimonialsAPI.updateTestimonial(
          editingTestimonial.id,
          submitData,
        )
      } else {
        await testimonialsAPI.createTestimonial(submitData)
      }
      await loadTestimonials()
      setIsModalOpen(false)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Gagal menyimpan testimoni')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus testimoni ini?')) return

    try {
      setError(null)
      await testimonialsAPI.deleteTestimonial(id)
      await loadTestimonials()
    } catch (err: any) {
      setError(err.response?.data?.message || 'Gagal menghapus testimoni')
    }
  }

  const handleToggleFeatured = async (id: string) => {
    try {
      setError(null)
      await testimonialsAPI.toggleFeatured(id)
      await loadTestimonials()
    } catch (err: any) {
      setError(err.response?.data?.message || 'Gagal mengubah status unggulan')
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader className="animate-spin mr-2" />
        <span>Memuat testimoni...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl text-gray-900">Manajemen Testimoni</h1>
          <p className="text-gray-600 mt-2">
            Kelola review dan testimoni pelanggan
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="bg-sky-800 text-white px-4 py-2 rounded-lg hover:bg-sky-900 transition-colors flex items-center gap-2"
        >
          <Plus size={20} />
          Tambah Testimoni
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
          <AlertCircle
            size={20}
            className="text-red-600 flex-shrink-0 mt-0.5"
          />
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {testimonials.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl border border-gray-200">
          <p className="text-gray-500 mb-4">Belum ada testimoni</p>
          <button
            onClick={openAddModal}
            className="text-sky-600 hover:text-sky-700 font-medium"
          >
            Tambah testimoni pertama →
          </button>
        </div>
      ) : (
        <div className="grid gap-6">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow"
            >
              <div className="flex gap-4 items-start">
                <img
                  src={testimonial.customer_avatar}
                  alt={testimonial.customer_name}
                  className="w-16 h-16 rounded-full object-cover"
                  onError={(e) => {
                    ;(e.target as HTMLImageElement).src =
                      'https://api.dicebear.com/7.x/avataaars/svg?seed=default'
                  }}
                />
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="text-lg text-gray-900 font-semibold">
                        {testimonial.customer_name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {testimonial.customer_location}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star
                          key={i}
                          size={16}
                          className="fill-yellow-400 text-yellow-400"
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm mb-4">
                    {testimonial.review_text}
                  </p>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleToggleFeatured(testimonial.id)}
                      className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                        testimonial.is_featured
                          ? 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      ⭐ Unggulan
                    </button>
                    <button
                      onClick={() => openEditModal(testimonial)}
                      className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-1"
                    >
                      <Edit2 size={16} /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(testimonial.id)}
                      className="px-3 py-1 text-sm bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors flex items-center gap-1"
                    >
                      <Trash2 size={16} /> Hapus
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <>
          {/* Modal Content */}
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-lg z-[100] flex items-center justify-center p-4"
            onClick={() => setIsModalOpen(false)}
          >
            {/* Close Button */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 bg-white bg-opacity-30 hover:bg-opacity-50 text-gray-900 p-2 rounded-full transition-all duration-200 z-10"
              title="Close (ESC)"
            >
              <X size={24} />
            </button>

            {/* Modal Container */}
            <div
              className="bg-white rounded-2xl p-8 w-full max-w-2xl max-h-screen overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-2xl text-gray-900 mb-6">
                {editingTestimonial
                  ? 'Edit Testimoni'
                  : 'Tambah Testimoni Baru'}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="text"
                  placeholder="Nama Pelanggan"
                  value={formData.customer_name}
                  onChange={(e) =>
                    setFormData({ ...formData, customer_name: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-700"
                  required
                />

                <input
                  type="text"
                  placeholder="Lokasi / Kota"
                  value={formData.customer_location}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      customer_location: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-700"
                  required
                />

                <div>
                  <label className="block text-sm text-gray-700 mb-2">
                    Rating
                  </label>
                  <select
                    value={formData.rating}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        rating: parseInt(e.target.value),
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-700"
                  >
                    <option value="5">5 Bintang - Sangat Puas</option>
                    <option value="4">4 Bintang - Puas</option>
                    <option value="3">3 Bintang - Biasa</option>
                    <option value="2">2 Bintang - Kurang Puas</option>
                    <option value="1">1 Bintang - Tidak Puas</option>
                  </select>
                </div>

                <textarea
                  placeholder="Teks Review"
                  value={formData.review_text}
                  onChange={(e) =>
                    setFormData({ ...formData, review_text: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-700"
                  rows={4}
                  required
                />

                {/* Avatar Upload (Optional) */}
                <div className="space-y-3">
                  <label className="block">
                    <span className="text-gray-700 font-semibold mb-2">
                      Upload Avatar (Opsional)
                    </span>
                    <div className="mt-2 flex items-center justify-center w-full">
                      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <Upload size={24} className="text-gray-400 mb-2" />
                          <p className="text-sm text-gray-500">
                            Klik untuk upload avatar
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            PNG, JPG, WebP, GIF (max 5MB)
                          </p>
                        </div>
                        <input
                          type="file"
                          className="hidden"
                          accept="image/jpeg,image/png,image/webp,image/gif"
                          onChange={handleImageUploadChange}
                        />
                      </label>
                    </div>
                  </label>

                  {uploadError && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2">
                      <AlertCircle
                        size={16}
                        className="text-red-600 flex-shrink-0 mt-0.5"
                      />
                      <p className="text-sm text-red-800">{uploadError}</p>
                    </div>
                  )}

                  {avatarPreview && (
                    <div className="relative flex justify-center">
                      <img
                        src={avatarPreview}
                        alt="Preview"
                        className="w-32 h-32 object-cover rounded-full border border-gray-300"
                      />
                      {formData.avatar_base64 && (
                        <button
                          type="button"
                          onClick={() => {
                            setAvatarPreview(null)
                            setFormData({ ...formData, avatar_base64: '' })
                          }}
                          className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
                        >
                          <X size={16} />
                        </button>
                      )}
                    </div>
                  )}
                </div>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is_featured}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        is_featured: e.target.checked,
                      })
                    }
                    className="w-4 h-4 rounded border-gray-300"
                  />
                  <span className="text-sm text-gray-700">
                    Tampilkan di halaman utama (Unggulan)
                  </span>
                </label>

                <div className="flex gap-4 pt-4 border-t">
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="flex-1 bg-sky-800 text-white py-2 rounded-lg hover:bg-sky-900 transition-colors disabled:opacity-50"
                  >
                    {isSaving ? 'Menyimpan...' : 'Simpan'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Batal
                  </button>
                </div>
              </form>
            </div>
          </div>
        </>
      )}
    </div>
  )
}




