import { useState, useEffect } from 'react'
import { productsAPI } from '../../services/api'
import { Loader, ShoppingCart, X } from 'lucide-react'

type ProductSectionProps = {
  addToCart: (product: any) => void
}

export default function ProductSection({ addToCart }: ProductSectionProps) {
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null)

  useEffect(() => {
    ;(async () => {
      try {
        const res = await productsAPI.getPublicProducts({ limit: 12 })
        setProducts(res.data.data || [])
      } catch {
        setProducts([])
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  const getStockStatus = (status: string) => {
    const statusMap: {
      [key: string]: { label: string; color: string; bgColor: string }
    } = {
      available: {
        label: 'Tersedia',
        color: 'text-green-700',
        bgColor: 'bg-green-50',
      },
      limited: {
        label: 'Terbatas',
        color: 'text-yellow-700',
        bgColor: 'bg-yellow-50',
      },
      out_of_stock: {
        label: 'Habis',
        color: 'text-red-700',
        bgColor: 'bg-red-50',
      },
    }
    return statusMap[status] || statusMap.available
  }

  return (
    <section
      id="produk"
      className="py-20 bg-gradient-to-b from-gray-50 to-white"
    >
      <div className="container mx-auto px-4">
        <div className="mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-3">Produk Kami</h2>
          <p className="text-gray-600">
            Pilihan kue dan dessert terbaik dengan bahan berkualitas premium
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader className="animate-spin text-sky-800 mr-2" size={32} />
            <span className="text-gray-600">Memuat produk...</span>
          </div>
        ) : (
          <div className="grid md:grid-cols-4 gap-6">
            {products.map((p) => {
              const stock = getStockStatus(p.stock_status)
              return (
                <div
                  key={p.id}
                  className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 cursor-pointer"
                  onClick={() => setSelectedProduct(p)}
                >
                  {/* Image Container */}
                  <div className="relative overflow-hidden h-56 bg-gray-200 group">
                    <img
                      src={p.image_url}
                      alt={p.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {/* Stock Badge */}
                    <div
                      className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-semibold ${stock.bgColor} ${stock.color} border border-current border-opacity-30`}
                    >
                      {stock.label}
                    </div>
                    {/* Unggulan Badge */}
                    {p.is_featured && (
                      <div className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-semibold bg-sky-800 text-white">
                        ⭐ Unggulan
                      </div>
                    )}
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    {/* Hover Icon */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="bg-white bg-opacity-90 rounded-full p-3">
                        <svg
                          className="w-6 h-6 text-sky-600"
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

                  {/* Content */}
                  <div className="p-5 space-y-3">
                    {/* Title and Flavor */}
                    <div>
                      <h3 className="font-bold text-lg text-gray-900 mb-1">
                        {p.name}
                      </h3>
                      <p className="text-sm text-sky-600 font-semibold">
                        {p.flavor}
                      </p>
                    </div>

                    {/* Description */}
                    <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
                      {p.description}
                    </p>

                    {/* Price */}
                    <div className="pt-2 border-t border-gray-200">
                      <p className="text-2xl font-bold text-sky-600">
                        Rp {p.price?.toLocaleString('id-ID')}
                      </p>
                    </div>

                    {/* Cart Action */}
                    <div className="pt-2">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          addToCart(p)
                        }}
                        disabled={p.stock_status === 'out_of_stock'}
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-sky-600 hover:bg-sky-700 disabled:bg-gray-200 disabled:text-gray-500 disabled:cursor-not-allowed text-white transition-colors text-sm font-semibold"
                      >
                        <ShoppingCart size={18} />
                        <span>
                          {p.stock_status === 'out_of_stock'
                            ? 'Stok Habis'
                            : 'Tambah ke Keranjang'}
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

      </div>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <>
          {/* Backdrop */}
          <div
            onClick={() => setSelectedProduct(null)}
            className="fixed inset-0 bg-black/40 backdrop-blur-lg z-[90]"
          />

          {/* Modal Content */}
          <div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
            onClick={() => setSelectedProduct(null)}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedProduct(null)}
              className="absolute top-4 right-4 bg-white bg-opacity-30 hover:bg-opacity-50 text-gray-900 p-2 rounded-full transition-all duration-200 z-10"
              title="Close (ESC)"
            >
              <X size={24} />
            </button>

            {/* Main Modal Container */}
            <div
              className="bg-white rounded-2xl overflow-hidden w-full max-w-3xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Image Section */}
              <div className="relative h-80 bg-gray-200 overflow-hidden">
                <img
                  src={selectedProduct.image_url}
                  alt={selectedProduct.name}
                  className="w-full h-full object-cover"
                />
                {/* Stock Badge in Modal */}
                <div
                  className={`absolute top-4 right-4 px-4 py-2 rounded-full text-sm font-semibold ${
                    getStockStatus(selectedProduct.stock_status).bgColor
                  } ${getStockStatus(selectedProduct.stock_status).color}`}
                >
                  {getStockStatus(selectedProduct.stock_status).label}
                </div>
                {selectedProduct.is_featured && (
                  <div className="absolute top-4 left-4 px-4 py-2 rounded-full text-sm font-semibold bg-sky-800 text-white">
                    ⭐ Unggulan
                  </div>
                )}
              </div>

              {/* Content Section */}
              <div className="p-8 space-y-6">
                {/* Header */}
                <div>
                  <h2 className="text-4xl font-bold text-gray-900 mb-2">
                    {selectedProduct.name}
                  </h2>
                  <p className="text-xl text-sky-600 font-semibold mb-4">
                    {selectedProduct.flavor}
                  </p>
                  <p className="text-3xl font-bold text-sky-600">
                    Rp {selectedProduct.price?.toLocaleString('id-ID')}
                  </p>
                </div>

                {/* Divider */}
                <div className="border-t border-gray-200"></div>

                {/* Description */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Deskripsi Produk
                  </h3>
                  <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                    {selectedProduct.description}
                  </p>
                </div>

                {/* Divider */}
                <div className="border-t border-gray-200"></div>

                {/* Cart Order */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Pesan Sekarang
                  </h3>
                  <button
                    type="button"
                    onClick={() => {
                      addToCart(selectedProduct)
                      setSelectedProduct(null)
                    }}
                    disabled={selectedProduct.stock_status === 'out_of_stock'}
                    className="w-full flex items-center justify-center gap-2 bg-sky-600 hover:bg-sky-700 disabled:bg-gray-200 disabled:text-gray-500 disabled:cursor-not-allowed text-white px-4 py-3 rounded-xl transition-colors font-semibold"
                  >
                    <ShoppingCart size={20} />
                    <span>
                      {selectedProduct.stock_status === 'out_of_stock'
                        ? 'Stok Habis'
                        : 'Tambah ke Keranjang'}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </section>
  )
}




