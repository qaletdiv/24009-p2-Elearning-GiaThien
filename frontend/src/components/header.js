"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Headers() {
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    
    const token = localStorage.getItem("token");
    if (!token) {
      setUser(null);
      return;
    }

    fetch("http://localhost:8080/api/users/me", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (res) => {
        const body = await res.json().catch(() => ({}));

        if (!res.ok) {
          // token sai/hết hạn
          if (res.status === 401 || res.status === 403) {
            localStorage.removeItem("token");
            setUser(null);
            router.replace("/login");
            return null;
          }
          throw new Error(body.message || `users/me failed (${res.status})`);
        }

        return body;
      })
      .then((u) => {
        if (u) setUser(u);
      })
      .catch((err) => console.error("Header load user error:", err));
  }, [router]);

  const logout = () => {
    localStorage.removeItem("token");
    router.replace("/login");
  };

  return (
    <div className="w-full bg-blue-600 text-white">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex gap-4">
          <Link href="/dashboard" className="hover:underline">Khóa học của tôi</Link>
          <Link href="/courses" className="hover:underline">Tất cả khóa học</Link>
          <Link href="/profile" className="hover:underline">Hồ sơ</Link>
        </div>

        <div className="flex items-center gap-3">
          <span>{user ? `Xin chào, ${user.name}` : "Chưa đăng nhập"}</span>
          <button
            onClick={logout}
            className="bg-red-500 px-3 py-1 rounded hover:bg-red-600"
          >
            Đăng xuất
          </button>
        </div>
      </div>
    </div>
  );
}
