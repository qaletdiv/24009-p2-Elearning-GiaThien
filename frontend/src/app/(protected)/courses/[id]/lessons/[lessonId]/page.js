"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Headers from "@/components/header";

export default function LessonPage() {
  const { id, lessonId } = useParams();
  const router = useRouter();

  const [lesson, setLesson] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  // ===== helper: fetch JSON an toàn (xử lý 403 blocked) =====
  const fetchJSON = async (url, options) => {
    const res = await fetch(url, options);
    const data = await res.json().catch(() => ({}));
    return { ok: res.ok, status: res.status, data };
  };

  // ===== current index + previous status =====
  const currentIndex = useMemo(() => {
    if (!Array.isArray(lessons)) return -1;
    return lessons.findIndex((l) => String(l.id) === String(lessonId));
  }, [lessons, lessonId]);

  const prevLesson = useMemo(() => {
    if (currentIndex > 0) return lessons[currentIndex - 1];
    return null;
  }, [lessons, currentIndex]);

  const nextLesson = useMemo(() => {
    if (currentIndex >= 0 && currentIndex < lessons.length - 1) return lessons[currentIndex + 1];
    return null;
  }, [lessons, currentIndex]);

  const isPrevCompleted = useMemo(() => {
    if (currentIndex <= 0) return true;
    return !!lessons[currentIndex - 1]?.completed;
  }, [lessons, currentIndex]);

  const canGoNext = !!nextLesson && !!lesson?.completed; // ✅ chỉ cho qua bài sau khi bài hiện tại completed

  // ===== Load lesson + list lessons =====
  useEffect(() => {
    if (!token) {
      router.push("/login");
      return;
    }

    let cancelled = false;

    const load = async () => {
      setLoading(true);

      // luôn load list lessons trước để biết trạng thái completed
      const lessonsRes = await fetchJSON(`http://localhost:8080/api/courses/${id}/lessons`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (cancelled) return;

      if (!lessonsRes.ok) {
        // token lỗi -> về login
        if (lessonsRes.status === 401 || lessonsRes.status === 403) {
          localStorage.removeItem("token");
          router.replace("/login");
          return;
        }
        console.error("Load lessons error:", lessonsRes.data);
        setLessons([]);
      } else {
        setLessons(Array.isArray(lessonsRes.data) ? lessonsRes.data : []);
      }

      // load lesson detail
      const lessonRes = await fetchJSON(`http://localhost:8080/api/courses/${id}/lessons/${lessonId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (cancelled) return;

      
      if (!lessonRes.ok) {
        if (lessonRes.status === 401 || lessonRes.status === 403) {
          // case 403 blocked: { blocked, requiredLessonId, message }
          if (lessonRes.data?.blocked && lessonRes.data?.requiredLessonId) {
            alert(lessonRes.data.message || "Bạn cần hoàn thành bài trước đó.");
            router.replace(`/courses/${id}/lessons/${lessonRes.data.requiredLessonId}`);
            return;
          }

          // token hết hạn / không hợp lệ
          localStorage.removeItem("token");
          router.replace("/login");
          return;
        }

        console.error("Load lesson error:", lessonRes.data);
        setLesson(null);
        setLoading(false);
        return;
      }

      setLesson(lessonRes.data);
      setLoading(false);
    };

    load().catch((e) => {
      console.error(e);
      setLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, [id, lessonId, router, token]);

  // ===== Mark complete =====
  const handleComplete = async () => {
    if (!token) {
      router.push("/login");
      return;
    }

    try {
      const res = await fetchJSON(
        `http://localhost:8080/api/courses/${id}/lessons/${lessonId}/complete`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!res.ok) {
        alert(res.data?.message || "Có lỗi xảy ra khi đánh dấu hoàn thành!");
        return;
      }

      alert("Đã đánh dấu hoàn thành!");
      setLesson((prev) => ({ ...prev, completed: true }));

      
      const lessonsRes = await fetchJSON(`http://localhost:8080/api/courses/${id}/lessons`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (lessonsRes.ok) {
        setLessons(Array.isArray(lessonsRes.data) ? lessonsRes.data : []);
      }
    } catch (error) {
      console.error("Error completing lesson:", error);
      alert("Có lỗi xảy ra khi đánh dấu hoàn thành!");
    }
  };


  const handleClickLesson = (l, index) => {
    // luôn cho click bài hiện tại
    if (String(l.id) === String(lessonId)) return;

    
    if (index === 0) {
      router.push(`/courses/${id}/lessons/${l.id}`);
      return;
    }

    const prevDone = !!lessons[index - 1]?.completed;
    if (!prevDone) {
      alert("Bạn cần hoàn thành bài học trước đó trước khi học bài này.");
      return;
    }

    router.push(`/courses/${id}/lessons/${l.id}`);
  };

  if (loading) return <p className="p-6">Đang tải bài học...</p>;
  if (!lesson) return <p className="p-6 text-red-600">Không tải được bài học.</p>;

  return (
    <div className="min-h-screen bg-gray-50">
      <Headers />

      <div className="flex">
        
        <aside className="w-72 bg-white border-r p-4 min-h-[calc(100vh-64px)]">
          <h2 className="text-lg font-semibold mb-3">Danh sách bài học</h2>

          <ul className="space-y-2">
            {lessons.map((l, index) => {
              const prevDone = index === 0 ? true : !!lessons[index - 1]?.completed;
              const isLocked = !prevDone; // 🔒 nếu bài trước chưa xong
              const isActive = String(l.id) === String(lessonId);

              return (
                <li
                  key={l.id}
                  onClick={() => handleClickLesson(l, index)}
                  className={`p-2 rounded transition
                    ${isActive ? "bg-blue-100 text-blue-700" : ""}
                    ${isLocked && !isActive ? "bg-gray-50 text-gray-400 cursor-not-allowed" : "cursor-pointer hover:bg-gray-100"}
                  `}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm">{l.title}</span>
                    <span className="text-sm">
                      {l.completed ? "Xong" : isLocked && !isActive ? "Khóa" : ""}
                    </span>
                  </div>
                </li>
              );
            })}
          </ul>
        </aside>

       
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

          
          {!isPrevCompleted && currentIndex > 0 ? (
            <div className="mb-4 p-4 border rounded bg-yellow-50 text-yellow-800">
              Bạn cần hoàn thành bài <b>{prevLesson?.title}</b> trước khi học bài này.
              <button
                onClick={() => router.push(`/courses/${id}/lessons/${prevLesson?.id}`)}
                className="ml-3 px-3 py-1 rounded bg-yellow-600 text-white hover:bg-yellow-700 text-sm"
              >
                Quay về bài trước
              </button>
            </div>
          ) : null}

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
              className={`px-4 py-2 rounded ${
                lesson.completed ? "bg-gray-400 text-white" : "bg-green-600 hover:bg-green-700 text-white"
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
                onClick={() => {
                  if (!lesson.completed) {
                    alert("Bạn cần hoàn thành bài hiện tại trước khi qua bài tiếp theo.");
                    return;
                  }
                  router.push(`/courses/${id}/lessons/${nextLesson.id}`);
                }}
                className={`px-4 py-2 rounded ${
                  canGoNext ? "bg-blue-600 text-white hover:bg-blue-700" : "bg-gray-300 text-gray-600 cursor-not-allowed"
                }`}
                disabled={!canGoNext}
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
  );
}
