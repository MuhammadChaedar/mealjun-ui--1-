import { useState, useEffect } from 'react'
import { dashboardAPI } from '../../services/api'
import {
  Users,
  Package,
  MapPin,
  MessageSquare,
  Zap,
  TrendingUp,
  Eye,
  AlertCircle,
  Loader,
} from 'lucide-react'

interface DashboardData {
  summary: {
    total_products: number
    featured_products: number
    out_of_stock_products: number
    total_testimonials: number
    pending_testimonials: number
    total_store_locations: number
    unread_messages: number
    total_captions_generated: number
  }
  recent_messages: Array<{
    id: string
    name: string
    phone_number: string
    is_read: boolean
    created_at: string
  }>
  visitor_today: number
  visitor_week: number
  top_products: Array<{
    id: string
    name: string
    view_count: number
  }>
}

interface AnalyticsData {
  total_visits_period: number
  unique_cities: number
  top_countries: Array<{
    visitor_country: string
    visits: number
  }>
  top_cities: Array<{
    visitor_city: string
    visits: number
  }>
  daily_visits: Array<{
    visit_date: string
    visits: number
  }>
}

interface CustomerOrder {
  id: string
  customer_name: string
  phone: string
  items: Array<{
    name: string
    price: number
    quantity: number
  }>
  total: number
  status: string
  created_at: string
}

export default function DashboardOverview() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null)
  const [customerOrders, setCustomerOrders] = useState<CustomerOrder[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadDashboard()
    const savedOrders = JSON.parse(
      localStorage.getItem('Toko Erina_orders') || '[]'
    )
    setCustomerOrders(savedOrders)
  }, [])

  const loadDashboard = async () => {
    setLoading(true)
    setError(null)
    try {
      const [dashRes, analyticsRes] = await Promise.all([
        dashboardAPI.getDashboard(),
        dashboardAPI.getAnalytics(1),
      ])
      setDashboardData(dashRes.data)
      setAnalyticsData(analyticsRes.data)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Gagal memuat dashboard')
      console.error('Failed to load dashboard:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader className="animate-spin mr-2" size={24} />
        <span className="text-lg text-gray-600">Memuat dashboard...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 flex items-start gap-4">
        <AlertCircle size={24} className="text-red-600 flex-shrink-0 mt-1" />
        <div>
          <h3 className="text-lg font-semibold text-red-900 mb-2">
            Gagal Memuat Dashboard
          </h3>
          <p className="text-red-700 mb-4">{error}</p>
          <button
            onClick={loadDashboard}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    )
  }

  const summary = dashboardData?.summary

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Ringkasan lengkap operasional Toko Erina
          </p>
        </div>
        <button
          onClick={loadDashboard}
          disabled={loading}
          className="px-6 py-2 bg-sky-800 text-white rounded-lg hover:bg-sky-900 disabled:opacity-50 transition-colors font-medium flex items-center gap-2"
        >
          <Zap size={18} />
          Refresh
        </button>
      </div>

      {/* Summary Stats - 4 Columns */}
      <div className="grid md:grid-cols-4 gap-5">
        {/* Total Products */}
        <div className="bg-gradient-to-br from-sky-50 to-sky-100 border-2 border-sky-200 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-sky-800 font-medium mb-1">
                Total Produk
              </p>
              <p className="text-3xl font-bold text-sky-950">
                {summary?.total_products || 0}
              </p>
            </div>
            <Package size={32} className="text-sky-700 opacity-20" />
          </div>
          <div className="text-xs text-sky-700">
            {summary?.featured_products || 0} unggulan
          </div>
        </div>

        {/* Out of Stock */}
        <div className="bg-gradient-to-br from-red-50 to-red-100 border-2 border-red-200 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-red-600 font-medium mb-1">
                Stok Habis
              </p>
              <p className="text-3xl font-bold text-red-900">
                {summary?.out_of_stock_products || 0}
              </p>
            </div>
            <AlertCircle size={32} className="text-red-500 opacity-20" />
          </div>
          <div className="text-xs text-red-700">Butuh restok</div>
        </div>

        {/* Testimonials */}
        <div className="bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-200 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-green-600 font-medium mb-1">
                Testimonial
              </p>
              <p className="text-3xl font-bold text-green-900">
                {summary?.total_testimonials || 0}
              </p>
            </div>
            <Users size={32} className="text-green-500 opacity-20" />
          </div>
          <div className="text-xs text-green-700">
            {summary?.pending_testimonials || 0} pending
          </div>
        </div>

        {/* Store Locations */}
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-blue-600 font-medium mb-1">
                Lokasi Toko
              </p>
              <p className="text-3xl font-bold text-blue-900">
                {summary?.total_store_locations || 0}
              </p>
            </div>
            <MapPin size={32} className="text-blue-500 opacity-20" />
          </div>
          <div className="text-xs text-blue-700">Aktif</div>
        </div>
      </div>

      {/* Secondary Stats - 4 Columns */}
      <div className="grid md:grid-cols-4 gap-5">
        {/* Unread Messages */}
        <div className="bg-white border-2 border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-gray-600 font-medium mb-1">
                Pesan Belum Dibaca
              </p>
              <p className="text-3xl font-bold text-gray-900">
                {summary?.unread_messages || 0}
              </p>
            </div>
            <MessageSquare size={32} className="text-gray-400 opacity-40" />
          </div>
        </div>

        {/* Generated Captions */}
        <div className="bg-white border-2 border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-gray-600 font-medium mb-1">
                Caption Terbuat
              </p>
              <p className="text-3xl font-bold text-gray-900">
                {summary?.total_captions_generated || 0}
              </p>
            </div>
            <Zap size={32} className="text-gray-400 opacity-40" />
          </div>
        </div>

        {/* Visitor Today */}
        <div className="bg-white border-2 border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-gray-600 font-medium mb-1">
                Pengunjung Hari Ini
              </p>
              <p className="text-3xl font-bold text-gray-900">
                {dashboardData?.visitor_today || 0}
              </p>
            </div>
            <Eye size={32} className="text-gray-400 opacity-40" />
          </div>
        </div>

        {/* Visitor This Week */}
        <div className="bg-white border-2 border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-gray-600 font-medium mb-1">
                Pengunjung Minggu Ini
              </p>
              <p className="text-3xl font-bold text-gray-900">
                {dashboardData?.visitor_week || 0}
              </p>
            </div>
            <TrendingUp size={32} className="text-gray-400 opacity-40" />
          </div>
        </div>
      </div>

      {/* Customer Orders & Top Products */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Customer Orders */}
        <div className="bg-white border-2 border-gray-200 rounded-2xl p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            Pesanan Konsumen
          </h3>
          <div className="space-y-3">
            {customerOrders.length === 0 ? (
              <div className="p-6 rounded-xl border-2 border-gray-200 bg-gray-50 text-center">
                <p className="font-semibold text-gray-900">
                  Belum ada pesanan konsumen
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  Pesanan yang dibuat dari keranjang akan tampil di sini.
                </p>
              </div>
            ) : (
              customerOrders.slice(0, 5).map((order) => (
                <div
                  key={order.id}
                  className="p-4 rounded-xl border-2 border-sky-200 bg-sky-50/50 transition-colors"
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <h4 className="font-semibold text-gray-900">
                        {order.customer_name}
                      </h4>
                      <p className="text-xs text-sky-800 font-semibold">
                        {order.id}
                      </p>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 text-xs font-semibold">
                      {order.status}
                    </span>
                  </div>

                  <p className="text-sm text-gray-600 mb-2">{order.phone}</p>

                  <div className="space-y-1 mb-3">
                    {order.items.map((item, index) => (
                      <div
                        key={`${order.id}-${index}`}
                        className="flex items-center justify-between text-sm"
                      >
                        <span className="text-gray-700">
                          {item.quantity} x {item.name}
                        </span>
                        <span className="font-semibold text-gray-900">
                          Rp{' '}
                          {(item.price * item.quantity).toLocaleString(
                            'id-ID'
                          )}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-sky-200">
                    <p className="text-xs text-gray-500">
                      {new Date(order.created_at).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                    <p className="font-bold text-sky-800">
                      Rp {order.total.toLocaleString('id-ID')}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white border-2 border-gray-200 rounded-2xl p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            Produk Paling Dilihat
          </h3>
          <div className="space-y-3">
            {dashboardData?.top_products.slice(0, 5).map((product, idx) => (
              <div
                key={product.id}
                className="p-4 bg-gradient-to-r from-sky-50 to-transparent rounded-xl border-2 border-sky-200"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-sky-800 rounded-full flex items-center justify-center">
                      <span className="text-sm font-bold text-white">
                        {idx + 1}
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">
                        {product.name}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-sky-800">
                      {product.view_count} views
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Overall Analytics Summary */}
      {analyticsData && (
        <div className="space-y-6">
          {/* Summary Box */}
          <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border-2 border-purple-200 rounded-2xl p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Ringkasan Analitik
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-600 font-medium mb-2">
                  Total Kunjungan
                </p>
                <p className="text-4xl font-bold text-purple-900">
                  {analyticsData.total_visits_period}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 font-medium mb-2">
                  Kota Unik
                </p>
                <p className="text-4xl font-bold text-indigo-900">
                  {analyticsData.unique_cities}
                </p>
              </div>
            </div>
          </div>

          {/* Daily Visits Trend */}
          <div className="bg-white border-2 border-gray-200 rounded-2xl p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Tren Kunjungan Harian
            </h3>
            <div className="space-y-2">
              {analyticsData.daily_visits.slice(-14).map((day, idx) => {
                const maxVisits =
                  Math.max(
                    ...analyticsData.daily_visits.map((d) => d.visits),
                  ) || 1
                const percentage = (day.visits / maxVisits) * 100
                const date = new Date(day.visit_date).toLocaleDateString(
                  'id-ID',
                  { day: 'numeric', month: 'short' },
                )

                return (
                  <div key={idx} className="flex items-center gap-3">
                    <span className="text-xs font-medium text-gray-600 w-16">
                      {date}
                    </span>
                    <div className="flex-1">
                      <div className="bg-gray-200 rounded-full h-6 overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-sky-500 to-sky-800 h-6 rounded-full flex items-center justify-end pr-2 transition-all"
                          style={{ width: `${percentage}%` }}
                        >
                          {percentage > 15 && (
                            <span className="text-xs font-bold text-white">
                              {day.visits}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    {percentage <= 15 && (
                      <span className="text-xs font-semibold text-gray-900 w-6 text-right">
                        {day.visits}
                      </span>
                    )}
                  </div>
                )
              })}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-xs text-gray-600 font-medium mb-1">
                    Hari dengan Kunjungan Tertinggi
                  </p>
                  <p className="text-lg font-bold text-sky-800">
                    {Math.max(
                      ...analyticsData.daily_visits.map((d) => d.visits),
                    )}{' '}
                    visits
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 font-medium mb-1">
                    Rata-rata Harian
                  </p>
                  <p className="text-lg font-bold text-sky-800">
                    {Math.round(
                      analyticsData.daily_visits.reduce(
                        (sum, d) => sum + d.visits,
                        0,
                      ) / analyticsData.daily_visits.length,
                    )}{' '}
                    visits
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 font-medium mb-1">
                    Total Hari Dilacak
                  </p>
                  <p className="text-lg font-bold text-sky-800">
                    {analyticsData.daily_visits.length} hari
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}




