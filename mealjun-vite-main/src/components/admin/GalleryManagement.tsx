import { useState, useEffect } from 'react'
import { galleryAPI } from '../../services/api'
import { Plus, AlertCircle, Loader, Upload, X } from 'lucide-react'
import { handleImageUpload } from '../../utils/imageUpload'

interface GalleryImage {
  id: string
  image_url: string
  caption: string
  order?: number
}

export default function GalleryManagement() {
  const [images, setImages] = useState<GalleryImage[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    image_base64: '',
    caption: '',
  })

  useEffect(() => {
    loadGallery()
  }, [])

  const loadGallery = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await galleryAPI.getGallery()
      setImages(response.data.data || response.data)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Gagal memuat galeri')
    } finally {
      setIsLoading(false)
    }
  }

  const handleImageUploadChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0]
    if (!file) return

    const result = await handleImageUpload(file)
    if (result.success && result.data) {
      setFormData({ ...formData, image_base64: result.data })
      setImagePreview(result.data)
      setUploadError(null)
    } else {
      setUploadError(result.error || 'Gagal mengupload gambar')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.image_base64) {
      setUploadError('Gambar harus diupload')
      return
    }

    setIsSaving(true)
    setError(null)

    try {
      await galleryAPI.createGalleryImage(formData)
      await loadGallery()
      setIsModalOpen(false)
      setFormData({ image_base64: '', caption: '' })
      setImagePreview(null)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Gagal menambah foto')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus foto ini?')) return

    try {
      setError(null)
      await galleryAPI.deleteGalleryImage(id)
      await loadGallery()
    } catch (err: any) {
      setError(err.response?.data?.message || 'Gagal menghapus foto')
    }
  }

  const handleReorder = async (newOrder: GalleryImage[]) => {
    try {
      const orderData = newOrder.map((img, index) => ({
        id: img.id,
        display_order: index,
      }))
      await galleryAPI.reorderGallery({ order: orderData })
      setImages(newOrder)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Gagal mengubah urutan foto')
    }
  }

  const moveImage = (index: number, direction: 'up' | 'down') => {
    const newImages = [...images]
    if (direction === 'up' && index > 0) {
      ;[newImages[index], newImages[index - 1]] = [
        newImages[index - 1],
        newImages[index],
      ]
    } else if (direction === 'down' && index < images.length - 1) {
      ;[newImages[index], newImages[index + 1]] = [
        newImages[index + 1],
        newImages[index],
      ]
    }
    handleReorder(newImages)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader className="animate-spin mr-2" />
        <span>Memuat galeri...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl text-gray-900">Manajemen Galeri</h1>
          <p className="text-gray-600 mt-2">
            Kelola foto produk dan momen Mealjun
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors flex items-center gap-2"
        >
          <Plus size={20} />
          Tambah Foto
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

      {images.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl border border-gray-200">
          <p className="text-gray-500 mb-4">Belum ada foto di galeri</p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="text-orange-600 hover:text-orange-700 font-medium"
          >
            Tambah foto pertama →
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {images.map((image, index) => (
            <div
              key={image.id}
              className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow"
            >
              <div className="flex gap-6">
                <img
                  src={image.image_url}
                  alt={image.caption}
                  className="w-32 h-32 object-cover rounded-xl"
                  onError={(e) => {
                    ;(e.target as HTMLImageElement).src =
                      'https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=400'
                  }}
                />
                <div className="flex-1">
                  <h3 className="text-lg text-gray-900 font-semibold mb-2">
                    {image.caption}
                  </h3>
                  <p className="text-sm text-gray-500 mb-4 break-all">
                    {image.image_url}
                  </p>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => moveImage(index, 'up')}
                      disabled={index === 0}
                      className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      ↑ Naik
                    </button>
                    <button
                      onClick={() => moveImage(index, 'down')}
                      disabled={index === images.length - 1}
                      className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      ↓ Turun
                    </button>
                    <button
                      onClick={() => handleDelete(image.id)}
                      className="px-3 py-1 text-sm bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors ml-auto"
                    >
                      Hapus
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
              className="bg-white rounded-2xl p-8 w-full max-w-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-2xl text-gray-900 mb-6">
                Tambah Foto Galeri
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Image Upload */}
                <div className="space-y-3">
                  <label className="block">
                    <span className="text-gray-700 font-semibold mb-2">
                      Upload Gambar Galeri *
                    </span>
                    <div className="mt-2 flex items-center justify-center w-full">
                      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <Upload size={24} className="text-gray-400 mb-2" />
                          <p className="text-sm text-gray-500">
                            Klik untuk upload gambar
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

                  {imagePreview && (
                    <div className="relative">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-40 object-cover rounded-lg border border-gray-300"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setImagePreview(null)
                          setFormData({ ...formData, image_base64: '' })
                        }}
                        className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm text-gray-700 mb-2">
                    Deskripsi / Caption
                  </label>
                  <textarea
                    placeholder="Deskripsi foto..."
                    value={formData.caption}
                    onChange={(e) =>
                      setFormData({ ...formData, caption: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    rows={3}
                    required
                  />
                </div>

                <div className="flex gap-4 pt-4 border-t">
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="flex-1 bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50"
                  >
                    {isSaving ? 'Menyimpan...' : 'Tambah Foto'}
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
