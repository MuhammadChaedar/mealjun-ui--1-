import { useState, useEffect } from 'react'
import { aboutAPI } from '../../services/api'
import { Target, Award, Heart, Loader } from 'lucide-react'
import { ImageWithFallback } from '../figma/ImageWithFallback'

export default function AboutSection() {
  const [about, setAbout] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    ;(async () => {
      try {
        const res = await aboutAPI.getPublicAbout()
        setAbout(res.data.data || res.data || {})
      } catch {
        setAbout({})
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  if (loading) {
    return (
      <div className="py-20 flex items-center justify-center">
        <Loader className="animate-spin text-orange-500 mr-2" size={32} />
        <span className="text-gray-600">Memuat informasi...</span>
      </div>
    )
  }

  // Build features from API data
  const features = [
    {
      icon: Target,
      title: 'Visi Kami',
      description: about?.vision || 'Menjadi brand terpercaya',
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-50',
    },
    {
      icon: Award,
      title: 'Misi Kami',
      description: about?.mission || 'Memberikan produk berkualitas',
      color: 'from-orange-500 to-amber-500',
      bgColor: 'bg-orange-50',
    },
    {
      icon: Heart,
      title: 'Komitmen Kami',
      description:
        'Memberikan produk berkualitas dengan harga terjangkau dan pelayanan terbaik',
      color: 'from-pink-500 to-rose-500',
      bgColor: 'bg-pink-50',
    },
  ]

  const highlights = [
    {
      title: '100% Bahan Berkualitas',
      description: 'Dibuat dari bahan pilihan tanpa pengawet',
    },
    {
      title: 'Proses Higienis',
      description: 'Diproduksi dengan standar kebersihan tinggi',
    },
    {
      title: 'Produksi Fresh',
      description: 'Dibuat fresh setiap hari untuk kerenyahan maksimal',
    },
  ]

  return (
    <section
      id="tentang"
      className="py-20 bg-gradient-to-b from-white to-gray-50"
    >
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-block bg-orange-100 text-orange-600 px-4 py-2 rounded-full text-sm font-semibold mb-4">
            Tentang Kami
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {about?.title || 'Tentang Mealjun'}
          </h2>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto mb-16">
          {/* Text Content */}
          <div className="order-2 lg:order-1">
            <p className="text-lg text-gray-700 leading-relaxed mb-8 whitespace-pre-line">
              {about?.description || ''}
            </p>

            {/* Highlights */}
            <div className="space-y-4">
              {highlights.map((highlight, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-1">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                  <div>
                    <div className="text-gray-900 font-semibold mb-1">
                      {highlight.title}
                    </div>
                    <p className="text-sm text-gray-600">
                      {highlight.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Image */}
          <div className="order-1 lg:order-2">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
              <ImageWithFallback
                src={about?.image_url}
                alt="Tentang Mealjun"
                className="w-full h-96 object-cover"
              />
            </div>
          </div>
        </div>

        {/* Features Cards */}
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`${feature.bgColor} rounded-3xl p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-2`}
            >
              <div
                className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 shadow-lg`}
              >
                <feature.icon className="text-white" size={32} />
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">
                {feature.title}
              </h3>
              <p className="text-gray-700 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
