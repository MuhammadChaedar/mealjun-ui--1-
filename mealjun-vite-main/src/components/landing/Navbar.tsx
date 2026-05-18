import { useState } from 'react'
import { Menu, X, LogIn, LayoutDashboard, ShoppingCart } from 'lucide-react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

type NavbarProps = {
  cartItemCount?: number
}

export default function Navbar({ cartItemCount = 0 }: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { isAuthenticated, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  const navItems = [
    { label: 'Beranda', href: '#beranda' },
    { label: 'Tentang', href: '#tentang' },
    { label: 'Galeri', href: '#galeri' },
    { label: 'Produk', href: '#produk' },
    { label: 'Review', href: '#review' },
    { label: 'Kontak', href: '#kontak' },
  ]

  const scrollToSection = (href: string) => {
    if (location.pathname !== '/') {
      navigate(`/${href}`)
      setIsMobileMenuOpen(false)
      return
    }

    const element = document.querySelector(href)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
      setIsMobileMenuOpen(false)
    }
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0">
            <span className="text-2xl font-bold text-orange-600">Mealjun</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <button
                key={item.href}
                onClick={() => scrollToSection(item.href)}
                className="text-gray-700 transition-colors hover:text-orange-600"
              >
                {item.label}
              </button>
            ))}

            <Link
              to="/keranjang"
              className="relative flex items-center space-x-2 text-gray-700 transition-colors hover:text-orange-600"
            >
              <ShoppingCart size={20} />
              <span>Keranjang</span>
              {cartItemCount > 0 && (
                <span className="absolute -right-4 -top-3 min-w-5 rounded-full bg-orange-600 px-1.5 py-0.5 text-center text-xs font-bold text-white">
                  {cartItemCount}
                </span>
              )}
            </Link>

            {/* Admin Buttons - Desktop */}
            <div className="flex items-center space-x-3 ml-4 pl-4 border-l border-gray-300">
              {isAuthenticated ? (
                <>
                  <Link
                    to="/admin/dashboard"
                    className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-gradient-to-r from-orange-500 to-amber-500 text-white hover:from-orange-600 hover:to-amber-600 shadow-lg transition-all"
                  >
                    <LayoutDashboard size={18} />
                    <span>Dashboard</span>
                  </Link>
                  <button
                    onClick={logout}
                    className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition-all"
                  >
                    <X size={18} />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <Link
                  to="/admin/login"
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-orange-100 text-orange-600 hover:bg-orange-200 transition-all"
                >
                  <LogIn size={18} />
                  <span>Login</span>
                </Link>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-gray-700"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white shadow-lg">
          <div className="px-4 py-6 space-y-4">
            {navItems.map((item) => (
              <button
                key={item.href}
                onClick={() => scrollToSection(item.href)}
                className="block w-full text-left text-gray-700 hover:text-orange-600 transition-colors"
              >
                {item.label}
              </button>
            ))}

            <Link
              to="/keranjang"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center justify-between w-full text-gray-700 hover:text-orange-600 transition-colors"
            >
              <span className="flex items-center gap-2">
                <ShoppingCart size={18} />
                Keranjang
              </span>
              {cartItemCount > 0 && (
                <span className="rounded-full bg-orange-600 px-2 py-0.5 text-xs font-bold text-white">
                  {cartItemCount}
                </span>
              )}
            </Link>

            {/* Admin Buttons - Mobile */}
            <div className="pt-4 border-t border-gray-200 space-y-3">
              {isAuthenticated ? (
                <>
                  <Link
                    to="/admin/dashboard"
                    className="flex items-center justify-center space-x-2 w-full bg-gradient-to-r from-orange-500 to-amber-500 text-white px-4 py-3 rounded-lg hover:from-orange-600 hover:to-amber-600 transition-colors shadow-lg"
                  >
                    <LayoutDashboard size={18} />
                    <span>Admin Dashboard</span>
                  </Link>
                  <button
                    onClick={logout}
                    className="flex items-center justify-center space-x-2 w-full bg-red-100 text-red-600 px-4 py-3 rounded-lg hover:bg-red-200 transition-colors"
                  >
                    <X size={18} />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <Link
                  to="/admin/login"
                  className="flex items-center justify-center space-x-2 w-full bg-orange-100 text-orange-600 px-4 py-3 rounded-lg hover:bg-orange-200 transition-colors"
                >
                  <LogIn size={18} />
                  <span>Admin Login</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
