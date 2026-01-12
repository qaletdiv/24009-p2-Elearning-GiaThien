'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Headers from '@/components/header'
export default function LessonPage() {
  const { id, lessonId } = useParams()
  const [lesson, setLesson] = useState(null)
  const [lessons, setLessons] = useState([])
  const router = useRouter()

  // Lấy token
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null

  // Lấy dữ liệu bài học và danh sách bài học
  useEffect(() => {
    if (!token) {
      router.push('/login')
      return
    }

    Promise.all([
      fetch(`http://localhost:8080/api/courses/${id}/lessons/${lessonId}`, {
        headers: { Authorization: `Bearer ${token}` }
      }).then(res => res.json()),
      fetch(`http://localhost:8080/api/courses/${id}/lessons`, {
        headers: { Authorization: `Bearer ${token}` }
      }).then(res => res.json())
    ])
      .then(([lessonData, lessonsData]) => {
        console.log('Lesson data:', lessonData)
        console.log('Lessons data:', lessonsData)
        console.log('Lessons is array:', Array.isArray(lessonsData))
        setLesson(lessonData)
        setLessons(Array.isArray(lessonsData) ? lessonsData : [])
      })
      .catch(err => console.error(err))
  }, [id, lessonId])

  const handleComplete = async () => {
    try {
      const res = await fetch(`http://localhost:8080/api/courses/${id}/lessons/${lessonId}/complete`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      })

      if (res.ok) {
        alert('Đã đánh dấu hoàn thành!')
        setLesson(prev => ({ ...prev, completed: true }))

        // Cập nhật danh sách lessons để cập nhật trạng thái
        const lessonsRes = await fetch(`http://localhost:8080/api/courses/${id}/lessons`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        if (lessonsRes.ok) {
          const updatedLessons = await lessonsRes.json()
          setLessons(updatedLessons)
        }
      } else {
        alert('Có lỗi xảy ra khi đánh dấu hoàn thành!')
      }
    } catch (error) {
      console.error('Error completing lesson:', error)
      alert('Có lỗi xảy ra khi đánh dấu hoàn thành!')
    }
  }

  if (!lesson) return <p className="p-6">Đang tải bài học...</p>

  // Tìm bài trước và sau
  const currentIndex = (Array.isArray(lessons) && lessons.length > 0) ? lessons.findIndex(l => l.id === lessonId) : -1
  const prevLesson = (Array.isArray(lessons) && currentIndex > 0) ? lessons[currentIndex - 1] : null
  const nextLesson = (Array.isArray(lessons) && currentIndex >= 0 && currentIndex < lessons.length - 1) ? lessons[currentIndex + 1] : null

  return (
    <div className="min-h-screen bg-gray-50">

      <Headers />

      <div className="flex">

        <aside className="w-72 bg-white border-r p-4 min-h-[calc(100vh-64px)]">
          <h2 className="text-lg font-semibold mb-3">Danh sách bài học</h2>
          <ul className="space-y-2">
            {Array.isArray(lessons) &&
              lessons.map((l) => (
                <li
                  key={l.id}
                  onClick={() => router.push(`/courses/${id}/lessons/${l.id}`)}
                  className={`cursor-pointer p-2 rounded transition ${l.id == lessonId ? "bg-blue-100 text-blue-700" : "hover:bg-gray-100"
                    }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm">{l.title}</span>
                    <span className="text-sm">{l.completed ? "✅" : ""}</span>
                  </div>
                </li>
              ))}
          </ul>
        </aside>

        {/* Main content */}
        <main className="flex-1 p-6">

          <div className="mb-4">
            <button
              onClick={() => router.push(`/courses/${id}`)}
              className="flex items-center px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Quay lại khóa học
            </button>
          </div>

          <h1 className="text-2xl font-bold mb-4">{lesson.title}</h1>

          <video src={lesson.videoUrl} controls className="w-full max-w-4xl rounded mb-4 bg-black" />

          <p className="mb-4 text-gray-700">{lesson.content}</p>

          {Array.isArray(lesson.resources) && lesson.resources.length > 0 ? (
            <div className="mt-6 p-4 bg-white border rounded">
              <h3 className="font-semibold text-lg mb-3">Tài liệu bài học</h3>

              <ul className="space-y-2">
                {lesson.resources.map((r, idx) => (
                  <li key={idx} className="flex items-center justify-between gap-3">
                    <span className="text-gray-800">{r.name}</span>

                    <a
                      href={`http://localhost:8080${r.url}`}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700 text-sm"
                    >
                      Xem tài liệu
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="mt-6 p-4 bg-gray-50 border rounded text-gray-600">
              Bài học này chưa có tài liệu đính kèm.
            </div>
          )}


          <div className="flex flex-wrap items-center gap-3 mt-6">
            <button
              onClick={handleComplete}
              disabled={lesson.completed}
              className={`px-4 py-2 rounded ${lesson.completed ? "bg-gray-400 text-white" : "bg-green-600 hover:bg-green-700 text-white"
                }`}
            >
              {lesson.completed ? "Đã hoàn thành" : "Đánh dấu hoàn thành"}
            </button>

            {prevLesson && (
              <button
                onClick={() => router.push(`/courses/${id}/lessons/${prevLesson.id}`)}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Bài trước
              </button>
            )}
            {nextLesson && (
              <button
                onClick={() => router.push(`/courses/${id}/lessons/${nextLesson.id}`)}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Bài tiếp theo
              </button>
            )}
          </div>

          {lesson.completed && (
            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200 max-w-4xl">
              <h3 className="text-lg font-semibold text-blue-800 mb-2">Hoàn thành bài học!</h3>
              <p className="text-blue-700 mb-3">
                Bạn đã hoàn thành bài học "{lesson.title}". Hãy làm quiz để kiểm tra kiến thức của mình.
              </p>
              <button
                onClick={() => router.push(`/courses/${id}/quiz`)}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 font-semibold"
              >
                Làm Quiz cuối khóa
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
