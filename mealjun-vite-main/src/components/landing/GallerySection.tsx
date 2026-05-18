import { useState, useEffect } from 'react'
import { galleryAPI } from '../../services/api'
import { Loader, X, ChevronLeft, ChevronRight } from 'lucide-react'

interface GalleryItem {
  id: string
  image_url: string
  caption: string
  display_order: number
  is_published: boolean
  created_at: string
  created_by: string
}

export default function GallerySection() {
  const [gallery, setGallery] = useState<GalleryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null)
  const [lightboxIndex, setLightboxIndex] = useState(0)

  useEffect(() => {
    ;(async () => {
      try {
        const res = await galleryAPI.getPublicGallery()
        setGallery(res.data.data || [])
      } catch {
        setGallery([])
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  const openLightbox = (item: GalleryItem) => {
    const index = gallery.findIndex((img) => img.id === item.id)
    setSelectedImage(item)
    setLightboxIndex(index)
  }

  const closeLightbox = () => {
    setSelectedImage(null)
  }

  const goToPrevious = () => {
    const newIndex =
      lightboxIndex === 0 ? gallery.length - 1 : lightboxIndex - 1
    setSelectedImage(gallery[newIndex])
    setLightboxIndex(newIndex)
  }

  const goToNext = () => {
    const newIndex =
      lightboxIndex === gallery.length - 1 ? 0 : lightboxIndex + 1
    setSelectedImage(gallery[newIndex])
    setLightboxIndex(newIndex)
  }

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedImage) return
      if (e.key === 'ArrowLeft') goToPrevious()
      if (e.key === 'ArrowRight') goToNext()
      if (e.key === 'Escape') closeLightbox()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [selectedImage, lightboxIndex, gallery])

  return (
    <section
      id="galeri"
      className="py-20 bg-gradient-to-b from-white to-gray-50"
    >
      <div className="container mx-auto px-4">
        <div className="mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-3">Galeri Kami</h2>
          <p className="text-gray-600">
            Koleksi foto produk dan momen spesial dari Mealjun
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader className="animate-spin text-orange-500 mr-2" size={32} />
            <span className="text-gray-600">Memuat galeri...</span>
          </div>
        ) : gallery.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-gray-200">
            <p className="text-gray-500">Galeri sedang kosong</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-4 gap-6">
            {gallery.map((img) => (
              <div
                key={img.id}
                onClick={() => openLightbox(img)}
                className="group relative overflow-hidden rounded-2xl cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-300"
              >
                {/* Image */}
                <div className="relative h-56 overflow-hidden bg-gray-200">
                  <img
                    src={img.image_url}
                    alt={img.caption}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                  {/* Caption Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <p className="text-white font-semibold text-sm line-clamp-2">
                      {img.caption || 'Gallery Image'}
                    </p>
                  </div>

                  {/* Hover Icon */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="bg-white bg-opacity-90 rounded-full p-3">
                      <svg
                        className="w-6 h-6 text-orange-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <>
          {/* Backdrop */}
          <div
            onClick={closeLightbox}
            className="fixed inset-0 bg-black/40 backdrop-blur-lg z-[90]"
          />

          {/* Modal Content */}
          <div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
            onClick={closeLightbox}
          >
            {/* Close Button */}
            <button
              className="absolute top-4 right-4 bg-white bg-opacity-30 hover:bg-opacity-50 text-white p-2 rounded-full transition-all duration-200 z-10"
              title="Close (ESC)"
            >
              <X size={24} className="text-black" />
            </button>

            {/* Main Image Container */}
            <div
              className="relative max-w-4xl max-h-[80vh] flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={selectedImage.image_url}
                alt={selectedImage.caption}
                className="max-w-full max-h-full object-contain rounded-xl"
              />

              {/* Navigation Buttons */}
              {gallery.length > 1 && (
                <>
                  <button
                    onClick={goToPrevious}
                    className="absolute -left-24 bg-white bg-opacity-30 hover:bg-opacity-50 text-white p-3 rounded-full transition-all duration-200 z-10"
                    title="Previous (← Arrow)"
                  >
                    <ChevronLeft size={28} className="text-black" />
                  </button>
                  <button
                    onClick={goToNext}
                    className="absolute -right-24 bg-white bg-opacity-30 hover:bg-opacity-50 text-white p-3 rounded-full transition-all duration-200 z-10"
                    title="Next (→ Arrow)"
                  >
                    <ChevronRight size={28} className="text-black" />
                  </button>
                </>
              )}
            </div>

            {/* Caption and Info */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/50 to-transparent p-6 pointer-events-none">
              <h3 className="text-white text-xl font-semibold mb-2">
                {selectedImage.caption || 'Gallery Image'}
              </h3>
              <p className="text-gray-300 text-sm">
                {lightboxIndex + 1} dari {gallery.length}
              </p>
            </div>
          </div>
        </>
      )}
    </section>
  )
}
