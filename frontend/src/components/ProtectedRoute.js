'use client'

import { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'

export default function ProtectedRoute({ children }) {
  const router = useRouter()
  const pathname = usePathname()
  const [ok, setOk] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.replace(`/login?next=${encodeURIComponent(pathname)}`)
      return
    }
    setOk(true)
  }, [router, pathname])

  if (!ok) {
    return <p className="text-center mt-10 text-gray-600">Đang kiểm tra đăng nhập...</p>
  }

  return children
}
