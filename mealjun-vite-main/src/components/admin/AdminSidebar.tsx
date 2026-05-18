import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  ShoppingBag,
  Info,
  Image,
  Star,
  MapPin,
  Mail,
} from 'lucide-react'

export default function AdminSidebar() {
  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/admin/dashboard' },
    { icon: ShoppingBag, label: 'Produk', path: '/admin/products' },
    { icon: Info, label: 'Tentang', path: '/admin/about' },
    { icon: Image, label: 'Galeri', path: '/admin/gallery' },
    { icon: Star, label: 'Testimoni', path: '/admin/testimonials' },
    { icon: MapPin, label: 'Store Locator', path: '/admin/store-locator' },
    { icon: Mail, label: 'Pesan Kontak', path: '/admin/contact-messages' },
  ]

  return (
    <aside className="w-64 h-[100vh] h-full fixed left-0 top-0 z-50 bg-white border-r border-gray-200 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-2xl text-orange-600">Mealjun</h1>
        <p className="text-sm text-gray-500 mt-1">Admin Panel</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors ${
                isActive
                  ? 'bg-orange-50 text-orange-600'
                  : 'text-gray-700 hover:bg-gray-50'
              }`
            }
          >
            <item.icon size={20} />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
