"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function CourseDetail() {
  const { id } = useParams();
  const router = useRouter();

  const [course, setCourse] = useState(null);
  const [isEnrolled, setIsEnrolled] = useState(false);

  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ rating: 5, comment: "" });

  const stars = useMemo(() => [1, 2, 3, 4, 5], []);

  // ===== Fetch course detail (public) =====
  useEffect(() => {
    if (!id) return;

    fetch(`http://localhost:8080/api/courses/${id}`)
      .then((res) => res.json())
      .then((data) => {
        // Tính tiến độ học (nếu có lessons)
        if (data?.lessons?.length) {
          const completed = data.lessons.filter((l) => l.completed).length;
          data.progress = Math.round((completed / data.lessons.length) * 100);
        } else {
          data.progress = 0;
        }

        setCourse(data);
        setReviews(Array.isArray(data.reviews) ? data.reviews : []);
      })
      .catch((err) => {
        console.error("Fetch course detail error:", err);
      });
  }, [id]);

  // ===== Check enrollment (need token) =====
  useEffect(() => {
    if (!id) return;

    const token = localStorage.getItem("token");
    if (!token) return;

    fetch(`http://localhost:8080/api/courses/${id}/enrollment`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setIsEnrolled(!!data.isEnrolled);
      })
      .catch((error) => {
        console.error("Error checking enrollment:", error);
        // Fallback: check in my courses
        fetch(`http://localhost:8080/api/courses/my`, {
          headers: { Authorization: `Bearer ${token}` },
        })
          .then((res) => res.json())
          .then((data) => {
            const enrolled = Array.isArray(data) && data.some((c) => c.id === id);
            setIsEnrolled(enrolled);
          })
          .catch((e) => console.error("Fallback enrollment error:", e));
      });
  }, [id]);

  // ===== Action button =====
  const handleAction = async () => {
    if (!course) return;

    if (isEnrolled) {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      try {
        const res = await fetch(`http://localhost:8080/api/courses/${id}/lesson/last`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json().catch(() => ({}));

        if (res.ok && data.lessonId) {
          router.push(`/courses/${id}/lessons/${data.lessonId}`);
          return;
        }

        // Nếu đã hoàn thành tất cả, đi đến bài học đầu tiên
        const firstLesson = course.lessons?.[0];
        if (firstLesson) {
          router.push(`/courses/${id}/lessons/${firstLesson.id}`);
        } else {
          alert("Khóa học chưa có bài học nào!");
        }
      } catch (error) {
        console.error("Error getting last lesson:", error);
        const firstLesson = course.lessons?.[0];
        if (firstLesson) router.push(`/courses/${id}/lessons/${firstLesson.id}`);
      }

      return;
    }

    // Nếu chưa enroll:
    if (course.price && course.price !== "Miễn phí") {
      router.push(`/checkout?courseId=${id}`);
      return;
    }

    // Miễn phí -> đăng ký luôn
    handleRegister();
  };

  // ===== Register course =====
  const handleRegister = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    try {
      const res = await fetch(`http://localhost:8080/api/courses/${id}/register`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json().catch(() => ({}));

      if (res.ok) {
        setIsEnrolled(true);
        alert(data.message || "Đăng ký khóa học thành công!");

        const firstLesson = course?.lessons?.[0];
        if (firstLesson) {
          router.push(`/courses/${id}/lessons/${firstLesson.id}`);
        }
      } else {
        alert(data.message || "Đăng ký thất bại");
      }
    } catch (error) {
      console.error("Registration error:", error);
      alert("Có lỗi xảy ra khi đăng ký khóa học");
    }
  };

  // ===== Submit review =====
  const handleReviewSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    const payload = {
      rating: Number(newReview.rating),
      comment: newReview.comment.trim(),
    };

    if (!payload.comment) {
      alert("Vui lòng nhập nội dung đánh giá");
      return;
    }

    try {
      const res = await fetch(`http://localhost:8080/api/courses/${id}/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok) {
        // ✅ backend trả { message, review }
        if (data?.review) {
          setReviews((prev) => [...prev, data.review]);
        }
        setNewReview({ rating: 5, comment: "" });
      } else {
        alert(data.message || "Gửi đánh giá thất bại");
      }
    } catch (err) {
      console.error("Submit review error:", err);
      alert("Có lỗi xảy ra khi gửi đánh giá");
    }
  };

  // ===== Helpers =====
  const renderStars = (rating) => {
    const r = Math.max(1, Math.min(5, Number(rating) || 0));
    return (
      <span aria-label={`${r} sao`}>
        {stars.map((i) => (i <= r ? "⭐" : "☆")).join("")}
      </span>
    );
  };

  const formatDate = (d) => {
    if (!d) return "";
    const dt = new Date(d);
    if (isNaN(dt.getTime())) return "";
    return dt.toLocaleString();
  };

  if (!course) return <p className="p-6">Đang tải...</p>;

  const canTakeQuiz = isEnrolled && Array.isArray(course.lessons) && course.lessons.length > 0 && course.lessons.every((l) => l.completed);

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">{course.title}</h1>

      <img
        src={course.image}
        alt={course.title}
        className="w-full h-64 object-cover rounded mb-4"
      />

      <p className="mb-4">{course.description}</p>

      <div className="space-y-1 mb-4">
        <p className="font-semibold">Giá: {course.price}</p>
        <p>Giảng viên: {course.instructor}</p>
        <p>Thời lượng: {course.duration}</p>
        <p>Đánh giá trung bình: ⭐ {`${course.rating}/5`}</p>
        <p className="font-semibold text-blue-600">Tiến độ: {course.progress}%</p>
      </div>

      <button
        onClick={handleAction}
        className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
      >
        {isEnrolled
          ? "Tiếp tục học"
          : course.price && course.price !== "Miễn phí"
            ? "Đăng ký học"
            : "Tham gia ngay"}
      </button>

      {/* ===== Danh sách bài học ===== */}
      <h2 className="text-xl font-bold mt-6 mb-2">Danh sách bài học</h2>
      <ul className="list-disc ml-6 space-y-2">
        {Array.isArray(course.lessons) &&
          course.lessons.map((l, index) => {
            const isPreviousCompleted = index === 0 || course.lessons[index - 1].completed;
            const isDisabled = !isEnrolled || !isPreviousCompleted;

            return (
              <li key={l.id} className="space-y-2">
                <div
                  className={`cursor-pointer hover:underline ${l.completed
                      ? "text-green-600"
                      : isDisabled
                        ? "text-gray-400 cursor-not-allowed"
                        : ""
                    }`}
                  onClick={() => {
                    if (!isEnrolled) {
                      alert("Bạn cần tham gia khóa học trước khi xem bài học.");
                      return;
                    }
                    if (!isPreviousCompleted) {
                      alert("Bạn cần hoàn thành bài học trước đó trước khi học bài này.");
                      return;
                    }
                    router.push(`/courses/${id}/lessons/${l.id}`);
                  }}
                >
                  {l.title} {l.completed ? "✅" : isDisabled ? "🔒" : "❌"}
                </div>
              </li>
            );
          })}

        {/* Quiz cuối khóa */}
        {canTakeQuiz && (
          <li className="mt-4 pt-4 border-t">
            <div className="flex items-center gap-2">
              <span className="text-lg font-semibold text-purple-600">🎯 Quiz cuối khóa</span>
              <button
                onClick={() => router.push(`/courses/${id}/quiz`)}
                className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 font-semibold"
              >
                Bắt đầu Quiz
              </button>
            </div>
            <p className="text-sm text-gray-600 mt-1">
              Hoàn thành tất cả bài học để mở khóa quiz cuối khóa
            </p>
          </li>
        )}
      </ul>

      {/* ===== Đánh giá ===== */}
      <h2 className="text-xl font-bold mt-6 mb-2">Đánh giá khóa học</h2>

      <div className="space-y-4">
        {reviews.length > 0 ? (
          reviews.map((r, idx) => (
            <div key={idx} className="border p-3 rounded">
              <div className="flex items-center justify-between gap-3">
                <div className="font-semibold text-gray-900">
                  {r.name || "Ẩn danh"}
                </div>
                <div className="text-sm text-gray-500">
                  {formatDate(r.date)}
                </div>
              </div>

              <div className="mt-1 text-lg">{renderStars(r.rating)}</div>

              <p className="mt-2 text-gray-800 whitespace-pre-wrap">
                {r.comment}
              </p>
            </div>
          ))
        ) : (
          <p>Chưa có đánh giá nào</p>
        )}
      </div>

      {/* ===== Form viết đánh giá ===== */}
      {isEnrolled && (
        <form onSubmit={handleReviewSubmit} className="mt-6 border-t pt-4 space-y-3">
          <h3 className="font-bold">Viết đánh giá của bạn</h3>

          <div className="flex items-center gap-3">
            <label className="text-sm text-gray-600">Số sao:</label>
            <select
              value={newReview.rating}
              onChange={(e) => setNewReview({ ...newReview, rating: Number(e.target.value) })}
              className="border p-2 rounded"
            >
              {[5, 4, 3, 2, 1].map((r) => (
                <option key={r} value={r}>
                  {r} sao
                </option>
              ))}
            </select>

            <span className="text-lg">{renderStars(newReview.rating)}</span>
          </div>

          <textarea
            value={newReview.comment}
            onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
            placeholder="Nhập bình luận..."
            className="w-full border p-2 rounded"
            rows={4}
          />

          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Gửi đánh giá
          </button>
        </form>
      )}
    </div>
  );
}
