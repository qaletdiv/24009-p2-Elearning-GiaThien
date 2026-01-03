'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function ProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  const [form, setForm] = useState({
    name: '',
    email: '',
    currentPassword: '',
    newPassword: '',
  })

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.replace('/login')
      return
    }

    fetch('http://localhost:8080/api/users/me', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (res) => {
        const body = await res.json().catch(() => ({}))
        if (!res.ok) {
          if (res.status === 401 || res.status === 403) {
            localStorage.removeItem('token')
            router.replace('/login')
            return null
          }
          throw new Error(body.message || `Fetch profile failed (${res.status})`)
        }
        return body
      })
      .then((data) => {
        if (!data) return
        setUser(data)
        setForm((prev) => ({ ...prev, name: data.name || '', email: data.email || '' }))
        setLoading(false)
      })
      .catch((err) => {
        console.error(err)
        setMessage(err.message || 'Lỗi khi tải hồ sơ')
        setLoading(false)
      })
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem('token')
    router.replace('/login')
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setMessage('')
    setSaving(true)

    try {
      const token = localStorage.getItem('token')
      if (!token) {
        router.replace('/login')
        return
      }

      // chỉ gửi field có ý nghĩa
      const payload = {
        name: form.name.trim(),
        email: form.email.trim(),
      }

      if (form.newPassword.trim()) {
        payload.currentPassword = form.currentPassword
        payload.newPassword = form.newPassword
      }

      const res = await fetch('http://localhost:8080/api/users/me', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      })

      const data = await res.json().catch(() => ({}))

      if (!res.ok) {
        if (res.status === 401 || res.status === 403) {
          localStorage.removeItem('token')
          router.replace('/login')
          return
        }
        throw new Error(data.message || `Update failed (${res.status})`)
      }

      setUser(data.user)
      setEditing(false)
      setForm((prev) => ({ ...prev, currentPassword: '', newPassword: '' }))
      setMessage('V Cập nhật hồ sơ thành công!')
    } catch (err) {
      console.error(err)
      setMessage(err.message || 'Cập nhật thất bại')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <p className="text-center mt-10 text-gray-600">Đang tải hồ sơ...</p>

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="flex justify-between items-center bg-blue-600 text-white px-6 py-3 shadow-md">
        <div className="space-x-4">
          <button onClick={() => router.push('/dashboard')} className="hover:underline">
            Khóa học của tôi
          </button>
          <button onClick={() => router.push('/courses')} className="hover:underline">
            Tất cả khóa học
          </button>
          <button onClick={() => router.push('/profile')} className="hover:underline font-semibold underline">
            Hồ sơ
          </button>
        </div>

        <div className="flex items-center space-x-3">
          <span className="font-semibold">Xin chào, {user?.name}</span>
          <button
            onClick={handleLogout}
            className="bg-red-500 px-3 py-1 rounded hover:bg-red-600 transition"
          >
            Đăng xuất
          </button>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Hồ sơ của tôi</h1>

        {message && (
          <div className={`mb-4 p-3 rounded border ${
            message.startsWith('V') ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-600 border-red-200'
          }`}>
            {message}
          </div>
        )}

        <div className="bg-white rounded-lg shadow p-6">
          {!editing ? (
            <>
              <div className="flex items-center justify-between border-b pb-4 mb-4">
                <div>
                  <p className="text-sm text-gray-500">Tên</p>
                  <p className="text-lg font-semibold text-gray-900">{user?.name || '-'}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">User ID</p>
                  <p className="text-lg font-semibold text-gray-900">{user?.id ?? '-'}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="text-base text-gray-900">{user?.email || '-'}</p>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => { setEditing(true); setMessage(''); }}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                  >
                    Chỉnh sửa hồ sơ
                  </button>
                </div>
              </div>
            </>
          ) : (
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-1">Tên</label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="pt-2 border-t">
                <p className="text-sm text-gray-500 mb-2">
                  Đổi mật khẩu (không bắt buộc)
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-gray-700 mb-1">Mật khẩu hiện tại</label>
                    <input
                      type="password"
                      name="currentPassword"
                      value={form.currentPassword}
                      onChange={handleChange}
                      className="w-full border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Nhập nếu đổi mật khẩu"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 mb-1">Mật khẩu mới</label>
                    <input
                      type="password"
                      name="newPassword"
                      value={form.newPassword}
                      onChange={handleChange}
                      className="w-full border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Nhập mật khẩu mới"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition disabled:opacity-60"
                >
                  {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setEditing(false)
                    setMessage('')
                    setForm((prev) => ({
                      ...prev,
                      name: user?.name || '',
                      email: user?.email || '',
                      currentPassword: '',
                      newPassword: '',
                    }))
                  }}
                  className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300 transition"
                >
                  Hủy
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
