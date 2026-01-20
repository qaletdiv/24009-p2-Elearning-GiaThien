'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from "next/image";
import Headers from '@/components/header'

export default function Dashboard() {
  const [user, setUser] = useState(null)
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem("token");

    const fetchUser = fetch("http://localhost:8080/api/users/me", {
      headers: { Authorization: `Bearer ${token}` },
    }).then(async (res) => {
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        if (res.status === 401 || res.status === 403) {
          localStorage.removeItem("token");
          router.replace("/login");
        }
        throw new Error(body.message || `users/me failed`);
      }
      return body;
    });

    const fetchMyCourses = fetch("http://localhost:8080/api/courses/my", {
      headers: { Authorization: `Bearer ${token}` },
    }).then(async (res) => {
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        if (res.status === 401 || res.status === 403) {
          localStorage.removeItem("token");
          router.replace("/login");
        }
        throw new Error(body.message || `courses/my failed`);
      }
      return body;
    });

    Promise.all([fetchUser, fetchMyCourses])
      .then(([userData, myCourses]) => {
        setUser(userData);
        setCourses(Array.isArray(myCourses) ? myCourses : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [router]);

  const handleContinue = async (courseId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.replace("/login");
      return;
    }

    const res = await fetch(
      `http://localhost:8080/api/courses/${courseId}/lesson/last`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      if (res.status === 401 || res.status === 403) {
        localStorage.removeItem("token");
        router.replace("/login");
      }
      return alert(data.message || "Không lấy được bài học");
    }

    if (data.lessonId) {
      router.push(`/courses/${courseId}/lessons/${data.lessonId}`);
    } else {
      alert(data.message || "Bạn đã hoàn thành khóa học này");
    }
  };

  /* ================= RENDER ================= */

  if (loading) {
    return <p className="text-center mt-10 text-gray-600">Đang tải...</p>
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Headers />

      <h1 className="text-2xl font-bold text-center mt-6 text-gray-800">
        Khóa học của tôi
      </h1>

      {courses.length === 0 ? (
        <div className="flex flex-col items-center justify-center mt-20 text-gray-600">
          <p className="text-lg mb-4">Bạn chưa có khóa học nào</p>
          <button
            onClick={() => router.push('/courses')}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            Khám phá khóa học
          </button>
        </div>
      ) : (

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-6">
          {courses.map((course) => (
            <div
              key={course.id}
              className="bg-white rounded-lg shadow hover:shadow-lg transition transform hover:-translate-y-1"
            >
              <Image
                src={course.image}
                alt={course.title}
                width={400}
                height={200}
                className="w-full h-40 object-cover rounded-t-lg"
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {course.title}
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Tiến độ: {course.progress}%
                </p>
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
      )}
    </div>
  )
}
