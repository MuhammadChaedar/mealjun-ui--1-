import { useState, useEffect } from 'react'
import { testimonialsAPI } from '../../services/api'
import { Star, Loader, MapPin } from 'lucide-react'

export default function ReviewSection() {
  const [reviews, setReviews] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    ;(async () => {
      try {
        const res = await testimonialsAPI.getPublicTestimonials()
        setReviews(res.data.data || [])
      } catch {
        setReviews([])
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  const StarRating = ({ rating }: { rating: number }) => (
    <div className="flex gap-1">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          size={18}
          className={
            i < rating
              ? 'fill-yellow-400 text-yellow-400'
              : 'text-gray-300 fill-gray-300'
          }
        />
      ))}
    </div>
  )

  const AvatarPlaceholder = ({ name }: { name: string }) => {
    const initial = name.charAt(0).toUpperCase()
    return (
      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-sky-400 to-sky-600 flex items-center justify-center text-white font-bold text-lg">
        {initial}
      </div>
    )
  }

  return (
    <section
      id="review"
      className="py-20 bg-gradient-to-b from-yellow-50 to-white"
    >
      <div className="container mx-auto px-4">
        <div className="mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-3">
            Testimoni Pelanggan
          </h2>
          <p className="text-gray-600">
            Dengarkan apa yang pelanggan kami katakan tentang produk Toko Erina
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader className="animate-spin text-sky-800 mr-2" size={32} />
            <span className="text-gray-600">Memuat testimoni...</span>
          </div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-gray-200">
            <p className="text-gray-500">Belum ada testimoni</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-4 gap-6">
            {reviews.map((r) => (
              <div
                key={r.id}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border border-gray-100 relative"
              >
                {/* Unggulan Badge */}
                {r.is_featured && (
                  <div className="absolute top-4 right-4 bg-sky-800 text-white px-3 py-1 rounded-full text-xs font-semibold">
                    ⭐ Unggulan
                  </div>
                )}

                {/* Quote Mark */}
                <div className="text-6xl text-sky-200 leading-none mb-2">
                  "
                </div>

                {/* Review Text */}
                <p className="text-gray-700 leading-relaxed mb-4 line-clamp-3">
                  {r.review_text}
                </p>

                {/* Star Rating */}
                <div className="mb-4">
                  <StarRating rating={r.rating} />
                </div>

                {/* Divider */}
                <div className="border-t border-gray-200 mb-4"></div>

                {/* Customer Info */}
                <div className="flex items-start gap-3">
                  {/* Avatar */}
                  {r.customer_avatar ? (
                    <img
                      src={r.customer_avatar}
                      alt={r.customer_name}
                      className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                    />
                  ) : (
                    <AvatarPlaceholder name={r.customer_name} />
                  )}

                  {/* Customer Details */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 truncate">
                      {r.customer_name}
                    </h3>
                    <div className="flex items-center gap-1 text-gray-500 text-sm">
                      <MapPin size={14} />
                      <span className="truncate">{r.customer_location}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}




