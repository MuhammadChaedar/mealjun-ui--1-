import { Bell, User, LogOut } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'

export default function AdminHeader() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/admin/login')
  }

  return (
    <header className="bg-white border-b border-gray-200 px-8 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl text-gray-900">Dashboard Admin Mealjun</h2>
          <p className="text-sm text-gray-600">Kelola konten website Anda</p>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3">
            <div className="text-right">
              <div className="text-sm text-gray-900">
                {user?.full_name || 'Admin Mealjun'}
              </div>
              <div className="text-xs text-gray-500">
                {user?.email || 'admin@mealjun.com'}
              </div>
            </div>
            <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full flex items-center justify-center">
              <User size={20} className="text-white" />
            </div>
            <button
              onClick={handleLogout}
              className="p-2 hover:bg-red-50 rounded-lg transition-colors group"
              title="Logout"
            >
              <LogOut
                size={20}
                className="text-gray-600 group-hover:text-red-600"
              />
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
