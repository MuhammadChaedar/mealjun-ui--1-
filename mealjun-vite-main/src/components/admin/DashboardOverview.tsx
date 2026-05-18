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

export default function DashboardOverview() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadDashboard()
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
            Ringkasan lengkap bisnis Mealjun Anda
          </p>
        </div>
        <button
          onClick={loadDashboard}
          disabled={loading}
          className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 transition-colors font-medium flex items-center gap-2"
        >
          <Zap size={18} />
          Refresh
        </button>
      </div>

      {/* Summary Stats - 4 Columns */}
      <div className="grid md:grid-cols-4 gap-5">
        {/* Total Products */}
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 border-2 border-orange-200 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-orange-600 font-medium mb-1">
                Total Produk
              </p>
              <p className="text-3xl font-bold text-orange-900">
                {summary?.total_products || 0}
              </p>
            </div>
            <Package size={32} className="text-orange-500 opacity-20" />
          </div>
          <div className="text-xs text-orange-700">
            {summary?.featured_products || 0} di-featured
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

      {/* Analytics Section */}
      {analyticsData && (
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Top Countries */}
          <div className="bg-white border-2 border-gray-200 rounded-2xl p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Negara Pengunjung
            </h3>
            <div className="space-y-3">
              {analyticsData.top_countries.map((country, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                      <span className="text-sm font-bold text-purple-600">
                        {idx + 1}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {country.visitor_country}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-purple-500 h-2 rounded-full transition-all"
                        style={{
                          width: `${(country.visits / (analyticsData.top_countries[0]?.visits || 1)) * 100}%`,
                        }}
                      />
                    </div>
                    <span className="text-sm font-semibold text-gray-900 w-12 text-right">
                      {country.visits}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Cities */}
          <div className="bg-white border-2 border-gray-200 rounded-2xl p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Kota Dengan Pengunjung Terbanyak
            </h3>
            <div className="space-y-3">
              {analyticsData.top_cities.slice(0, 8).map((city, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <span className="text-sm font-bold text-blue-600">
                        {idx + 1}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {city.visitor_city}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full transition-all"
                        style={{
                          width: `${(city.visits / (analyticsData.top_cities[0]?.visits || 1)) * 100}%`,
                        }}
                      />
                    </div>
                    <span className="text-sm font-semibold text-gray-900 w-12 text-right">
                      {city.visits}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Recent Messages & Top Products */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Messages */}
        <div className="bg-white border-2 border-gray-200 rounded-2xl p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            Pesan Terbaru
          </h3>
          <div className="space-y-3">
            {dashboardData?.recent_messages.slice(0, 5).map((msg) => (
              <div
                key={msg.id}
                className={`p-4 rounded-xl border-2 transition-colors ${
                  msg.is_read
                    ? 'bg-gray-50 border-gray-200'
                    : 'bg-yellow-50 border-yellow-300'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-gray-900">{msg.name}</h4>
                    {!msg.is_read && (
                      <span className="inline-block w-2 h-2 bg-yellow-500 rounded-full"></span>
                    )}
                  </div>
                </div>
                {msg.phone_number && (
                  <p className="text-sm text-gray-600 mb-2">
                    {msg.phone_number}
                  </p>
                )}
                <p className="text-xs text-gray-500">
                  {new Date(msg.created_at).toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            ))}
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
                className="p-4 bg-gradient-to-r from-orange-50 to-transparent rounded-xl border-2 border-orange-200"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
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
                    <p className="text-sm font-bold text-orange-600">
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
                          className="bg-gradient-to-r from-orange-400 to-orange-600 h-6 rounded-full flex items-center justify-end pr-2 transition-all"
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
                  <p className="text-lg font-bold text-orange-600">
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
                  <p className="text-lg font-bold text-orange-600">
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
                  <p className="text-lg font-bold text-orange-600">
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
