import { useState, useEffect } from 'react'
import { storeLocationsAPI } from '../../services/api'
import {
  Plus,
  Trash2,
  Edit2,
  AlertCircle,
  Loader,
  MapPin,
  Phone,
  X,
} from 'lucide-react'

interface StoreLocation {
  id: string
  store_name: string
  store_type: string
  address: string
  city: string
  phone: string
  maps_url: string
  is_active: boolean
}

export default function StoreLocator() {
  const [locations, setLocations] = useState<StoreLocation[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingLocation, setEditingLocation] = useState<StoreLocation | null>(
    null,
  )
  const [isSaving, setIsSaving] = useState(false)
  const [formData, setFormData] = useState({
    store_name: '',
    store_type: 'retail',
    address: '',
    city: '',
    phone: '',
    maps_url: '',
    is_active: true,
  })

  useEffect(() => {
    loadLocations()
  }, [])

  const loadLocations = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await storeLocationsAPI.getStoreLocations()
      setLocations(response.data.data || response.data)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Gagal memuat store locations')
    } finally {
      setIsLoading(false)
    }
  }

  const openAddModal = () => {
    setEditingLocation(null)
    setFormData({
      store_name: '',
      store_type: 'retail',
      address: '',
      city: '',
      phone: '',
      maps_url: '',
      is_active: true,
    })
    setIsModalOpen(true)
  }

  const openEditModal = (location: StoreLocation) => {
    setEditingLocation(location)
    setFormData({
      store_name: location.store_name,
      store_type: location.store_type,
      address: location.address,
      city: location.city,
      phone: location.phone,
      maps_url: location.maps_url,
      is_active: location.is_active,
    })
    setIsModalOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setError(null)

    try {
      if (editingLocation) {
        await storeLocationsAPI.updateStoreLocation(
          editingLocation.id,
          formData,
        )
      } else {
        await storeLocationsAPI.createStoreLocation(formData)
      }
      await loadLocations()
      setIsModalOpen(false)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Gagal menyimpan lokasi toko')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!id) {
      setError('Gagal menghapus lokasi toko: ID toko tidak ditemukan')
      return
    }

    if (!confirm('Apakah Anda yakin ingin menghapus lokasi toko ini?')) return

    try {
      setError(null)
      await storeLocationsAPI.deleteStoreLocation(id)
      await loadLocations()
    } catch (err: any) {
      const status = err.response?.status
      const message =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        'Gagal menghapus lokasi toko'

      setError(
        status
          ? `Gagal menghapus lokasi toko (${status}): ${message}`
          : message,
      )
    }
  }

  const toggleActive = async (id: string, currentStatus: boolean) => {
    try {
      setError(null)
      const location = locations.find((l) => l.id === id)
      if (location) {
        await storeLocationsAPI.updateStoreLocation(id, {
          ...location,
          is_active: !currentStatus,
        })
        await loadLocations()
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Gagal mengubah status toko')
    }
  }

  // Group by city
  const groupedLocations = locations.reduce(
    (acc: Record<string, StoreLocation[]>, loc) => {
      if (!acc[loc.city]) acc[loc.city] = []
      acc[loc.city].push(loc)
      return acc
    },
    {},
  )

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader className="animate-spin mr-2" />
        <span>Memuat store locations...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl text-gray-900">Store Locator</h1>
          <p className="text-gray-600 mt-2">
            Kelola lokasi toko penjualan Mealjun
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors flex items-center gap-2"
        >
          <Plus size={20} />
          Tambah Toko
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

      {locations.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl border border-gray-200">
          <p className="text-gray-500 mb-4">Belum ada toko terdaftar</p>
          <button
            onClick={openAddModal}
            className="text-orange-600 hover:text-orange-700 font-medium"
          >
            Tambah toko pertama →
          </button>
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(groupedLocations).map(([city, cityLocations]) => (
            <div key={city} className="space-y-4">
              <h2 className="text-2xl text-gray-900 font-semibold flex items-center gap-2">
                <MapPin size={24} className="text-orange-600" />
                {city}
              </h2>
              <div className="grid gap-4">
                {cityLocations.map((location) => (
                  <div
                    key={location.id}
                    className={`rounded-2xl p-6 border-2 transition-all ${
                      location.is_active
                        ? 'bg-white border-orange-200 shadow-lg'
                        : 'bg-gray-50 border-gray-200 opacity-60'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg text-gray-900 font-semibold">
                          {location.store_name}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span
                            className={`text-xs px-2 py-1 rounded-full font-medium ${
                              location.store_type === 'retail'
                                ? 'bg-blue-100 text-blue-600'
                                : 'bg-green-100 text-green-600'
                            }`}
                          >
                            {location.store_type.charAt(0).toUpperCase() +
                              location.store_type.slice(1)}
                          </span>
                          {location.is_active ? (
                            <span className="text-xs px-2 py-1 bg-green-100 text-green-600 rounded-full font-medium">
                              ✓ Aktif
                            </span>
                          ) : (
                            <span className="text-xs px-2 py-1 bg-red-100 text-red-600 rounded-full font-medium">
                              ✗ Tidak Aktif
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2 mb-4 text-sm text-gray-600">
                      <p className="flex items-start gap-2">
                        <MapPin size={16} className="flex-shrink-0 mt-0.5" />
                        <span>{location.address}</span>
                      </p>
                      <p className="flex items-center gap-2">
                        <Phone size={16} />
                        <span>{location.phone}</span>
                      </p>
                      {location.maps_url && (
                        <p>
                          <a
                            href={location.maps_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-orange-600 hover:text-orange-700 underline"
                          >
                            Lihat di Maps →
                          </a>
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-2 pt-4 border-t border-gray-200">
                      <button
                        onClick={() =>
                          toggleActive(location.id, location.is_active)
                        }
                        className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                          location.is_active
                            ? 'bg-green-100 text-green-600 hover:bg-green-200'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {location.is_active ? '✓ Aktif' : '✗ Nonaktif'}
                      </button>
                      <button
                        onClick={() => openEditModal(location)}
                        className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-1"
                      >
                        <Edit2 size={16} /> Edit
                      </button>
                      <button
                        onClick={() => handleDelete(location.id)}
                        className="px-3 py-1 text-sm bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors flex items-center gap-1"
                      >
                        <Trash2 size={16} /> Hapus
                      </button>
                    </div>
                  </div>
                ))}
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
                {editingLocation ? 'Edit Toko' : 'Tambah Toko Baru'}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="text"
                  placeholder="Nama Toko"
                  value={formData.store_name}
                  onChange={(e) =>
                    setFormData({ ...formData, store_name: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  required
                />

                <div className="grid grid-cols-2 gap-4">
                  <select
                    value={formData.store_type}
                    onChange={(e) =>
                      setFormData({ ...formData, store_type: e.target.value })
                    }
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="retail">Retail</option>
                    <option value="reseller">Reseller</option>
                  </select>

                  <input
                    type="text"
                    placeholder="Kota"
                    value={formData.city}
                    onChange={(e) =>
                      setFormData({ ...formData, city: e.target.value })
                    }
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    required
                  />
                </div>

                <input
                  type="text"
                  placeholder="Alamat Lengkap"
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  required
                />

                <input
                  type="tel"
                  placeholder="Nomor Telepon"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  required
                />

                <input
                  type="url"
                  placeholder="URL Google Maps (opsional)"
                  value={formData.maps_url}
                  onChange={(e) =>
                    setFormData({ ...formData, maps_url: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is_active}
                    onChange={(e) =>
                      setFormData({ ...formData, is_active: e.target.checked })
                    }
                    className="w-4 h-4 rounded border-gray-300"
                  />
                  <span className="text-sm text-gray-700">Toko aktif</span>
                </label>

                <div className="flex gap-4 pt-4 border-t">
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="flex-1 bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50"
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
