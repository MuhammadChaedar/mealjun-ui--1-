import { ArrowRight, ShoppingBag } from 'lucide-react'
import { ImageWithFallback } from '../figma/ImageWithFallback'

export default function HeroSection() {
  const scrollToProducts = () => {
    const element = document.querySelector('#produk')
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const scrollToAbout = () => {
    const element = document.querySelector('#tentang')
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section
      id="beranda"
      className="relative h-screen flex items-center overflow-hidden bg-gradient-to-br from-orange-50 via-white to-amber-50"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-64 h-64 bg-orange-500 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-amber-500 rounded-full filter blur-3xl"></div>
      </div>

      <div className="relative container mx-auto">
        <div className="flex justify-between gap-2 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="inline-block">
              <span className="inline-flex items-center px-4 py-2 rounded-full bg-orange-100 text-orange-700 text-sm font-semibold">
                <ShoppingBag size={16} className="mr-2" />
                Camilan Tradisional Modern
              </span>
            </div>

            <div className="space-y-4">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight">
                Keripik Lumpia
                <span className="block text-orange-600">Renyah & Gurih</span>
              </h1>
              <p className="text-lg text-gray-600 max-w-2xl leading-relaxed">
                Nikmati kelezatan keripik lumpia dengan berbagai pilihan rasa
                autentik. Dibuat dengan bahan pilihan, tanpa pengawet, sempurna
                untuk setiap momen.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={scrollToProducts}
                className="inline-flex items-center justify-center px-8 py-4 bg-orange-600 text-white font-semibold rounded-full hover:bg-orange-700 transition-colors shadow-lg hover:shadow-xl"
              >
                Lihat Produk
                <ArrowRight size={20} className="ml-2" />
              </button>
              <button
                onClick={scrollToAbout}
                className="inline-flex items-center justify-center px-8 py-4 border-2 border-orange-600 text-orange-600 font-semibold rounded-full hover:bg-orange-50 transition-colors"
              >
                Pelajari Lebih Lanjut
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 pt-8 border-t border-gray-200">
              <div>
                <div className="text-3xl font-bold text-orange-600">100%</div>
                <div className="text-sm text-gray-600">Tanpa Pengawet</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-orange-600">Fresh</div>
                <div className="text-sm text-gray-600">Produksi Harian</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-orange-600">5+</div>
                <div className="text-sm text-gray-600">Varian Rasa</div>
              </div>
            </div>
          </div>

          {/* Right Content - Product Image */}
          <div className="relative">
            <div className="relative z-10">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-400 to-amber-500 rounded-3xl transform rotate-3"></div>
              <div className="relative bg-white rounded-3xl shadow-2xl p-8 transform -rotate-2 hover:rotate-0 transition-transform duration-300">
                <ImageWithFallback
                  src="/mealjun.jpg"
                  alt="Keripik Lumpia Mealjun"
                  className="w-full h-96 object-cover rounded-2xl"
                />
              </div>
            </div>

            {/* Floating Badge - Certificate */}
            <div
              className="absolute top-8 -left-4 bg-white rounded-2xl shadow-xl p-4 z-20 animate-bounce"
              style={{ animationDelay: '0.2s' }}
            >
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-2xl">
                  ✓
                </div>
                <div>
                  <div className="text-sm text-gray-600">Sertifikat</div>
                  <div className="font-semibold text-orange-600">
                    BPOM & Halal
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Badge - Rating */}
            <div
              className="absolute bottom-8 -right-4 bg-white rounded-2xl shadow-xl p-4 z-20 animate-bounce"
              style={{ animationDelay: '0.4s' }}
            >
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center text-2xl">
                  ⭐
                </div>
                <div>
                  <div className="text-sm text-gray-600">Rating</div>
                  <div className="font-semibold text-orange-600">4.9/5.0</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
