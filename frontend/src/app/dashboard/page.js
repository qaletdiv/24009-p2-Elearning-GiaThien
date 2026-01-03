'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function Dashboard() {
  const [user, setUser] = useState(null)
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.replace("/login");
      return;
    }

    const fetchUser = fetch("http://localhost:8080/api/users/me", {
      headers: { Authorization: `Bearer ${token}` },
    }).then(async (res) => {
      const body = await res.json().catch(() => ({}));
      console.log("users/me:", res.status, body);
      if (!res.ok) {
        if (res.status === 401 || res.status === 403) {
          localStorage.removeItem("token");
          router.replace("/login");
        }
        throw new Error(body.message || `users/me failed (${res.status})`);
      }
      return body;
    });

    const fetchMyCourses = fetch("http://localhost:8080/api/courses/my", {
      headers: { Authorization: `Bearer ${token}` },
    }).then(async (res) => {
      const body = await res.json().catch(() => ({}));
      console.log("courses/my:", res.status, body);
      if (!res.ok) {
        if (res.status === 401 || res.status === 403) {
          localStorage.removeItem("token");
          router.replace("/login");
        }
        throw new Error(body.message || `courses/my failed (${res.status})`);
      }
      return body;
    });

    Promise.all([fetchUser, fetchMyCourses])
      .then(([userData, myCourses]) => {
        setUser(userData);
        setCourses(Array.isArray(myCourses) ? myCourses : []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Dashboard error:", err);
        setLoading(false);
      });
  }, [router]);

  // ✅ THÊM HÀM NÀY
  const handleContinue = async (courseId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.replace("/login");
        return;
      }

      const res = await fetch(`http://localhost:8080/api/courses/${courseId}/lesson/last`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        // nếu bị 401/403 thì đá về login
        if (res.status === 401 || res.status === 403) {
          localStorage.removeItem("token");
          router.replace("/login");
          return;
        }
        alert(data.message || "Không lấy được bài học");
        return;
      }

      if (data.lessonId) {
        // ⚠️ Route này bạn cần có page tương ứng
        router.push(`/courses/${courseId}/lessons/${data.lessonId}`);
      } else {
        alert(data.message || "Bạn đã hoàn thành khóa học này");
      }
    } catch (err) {
      console.error(err);
      alert("Lỗi khi tiếp tục học");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token')
    router.push('/login')
  }

  if (loading) return <p className="text-center mt-10 text-gray-600">Đang tải...</p>

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
          <button onClick={() => router.push('/profile')} className="hover:underline">
            Hồ sơ
          </button>
        </div>
        <div className="flex items-center space-x-3">
          <span className="font-semibold">Xin chào, {user?.name}</span>
          <button onClick={handleLogout} className="bg-red-500 px-3 py-1 rounded hover:bg-red-600 transition">
            Đăng xuất
          </button>
        </div>
      </nav>

      <h1 className="text-2xl font-bold text-center mt-6 text-gray-800">Khóa học của tôi</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-6">
        {courses.map((course) => (
          <div
            key={course.id}
            className="bg-white rounded-lg shadow hover:shadow-lg transition transform hover:-translate-y-1"
          >
            <img
              src={course.image}
              alt={course.title}
              className="w-full h-40 object-cover rounded-t-lg"
            />
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{course.title}</h3>
              <p className="text-sm text-gray-600 mb-4">Tiến độ: {course.progress}%</p>
              <button
                onClick={() => handleContinue(course.id)}
                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
              >
                Tiếp tục học
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
