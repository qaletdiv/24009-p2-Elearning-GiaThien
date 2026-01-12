"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Headers from "@/components/header";

export default function CheckoutPage() {
  const router = useRouter();
  const params = useSearchParams();
  const courseId = params.get("courseId");

  const [course, setCourse] = useState(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [loading, setLoading] = useState(true);

  const token = useMemo(() => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("token");
  }, []);

  useEffect(() => {
    if (!courseId) {
      router.replace("/courses");
      return;
    }

    if (!token) {
      router.replace("/login");
      return;
    }

    
    const fetchCourse = fetch(`http://localhost:8080/api/courses/${courseId}`)
      .then((res) => res.json())
      .then((data) => setCourse(data));

   
    const fetchEnroll = fetch(`http://localhost:8080/api/courses/${courseId}/enrollment`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setIsEnrolled(!!data.isEnrolled))
      .catch(() => setIsEnrolled(false));

    Promise.all([fetchCourse, fetchEnroll])
      .then(() => setLoading(false))
      .catch((err) => {
        console.error("Checkout load error:", err);
        setLoading(false);
      });
  }, [courseId, router, token]);

  const priceText = useMemo(() => {
    if (!course) return "";
    if (course.price === "Miễn phí") return "Miễn phí";
    if (typeof course.price === "number") return `${course.price}k`;
    return String(course.price || "Miễn phí");
  }, [course]);

  if (loading) return <p className="p-6">Đang tải checkout...</p>;
  if (!course) return <p className="p-6">Không tìm thấy khóa học</p>;

  return (
    <div className="min-h-screen bg-gray-100">
      <Headers />

      <div className="max-w-4xl mx-auto p-6">
        <button
          onClick={() => router.back()}
          className="mb-4 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
        >
          ← Quay lại
        </button>

        <h1 className="text-2xl font-bold mb-6">Checkout khóa học</h1>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <img
              src={course.image}
              alt={course.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h2 className="text-xl font-semibold">{course.title}</h2>
              <p className="text-sm text-gray-600 mt-2">
                {course.description || "Chưa có mô tả"}
              </p>

              <div className="mt-4 space-y-1 text-sm text-gray-700">
                <p>
                  <span className="font-semibold">Category:</span>{" "}
                  {course.category || "Chưa phân loại"}
                </p>
                <p>
                  <span className="font-semibold">Level:</span>{" "}
                  {course.level || "Cơ bản"}
                </p>
                <p>
                  <span className="font-semibold">Giá:</span> {priceText}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-5">
            <h3 className="text-lg font-semibold mb-3">Tóm tắt thanh toán</h3>

            <div className="border rounded p-4 bg-gray-50">
              <div className="flex justify-between text-sm">
                <span>Khóa học</span>
                <span className="font-semibold">{course.title}</span>
              </div>

              <div className="flex justify-between text-sm mt-2">
                <span>Giá</span>
                <span className="font-semibold">{priceText}</span>
              </div>

              <div className="flex justify-between text-sm mt-2">
                <span>Phí dịch vụ</span>
                <span className="font-semibold">0</span>
              </div>

              <div className="border-t mt-3 pt-3 flex justify-between">
                <span className="font-semibold">Tổng</span>
                <span className="font-bold text-green-700">{priceText}</span>
              </div>
            </div>

            {isEnrolled ? (
              <div className="mt-4 p-3 rounded bg-green-50 border border-green-200 text-green-800">
                Bạn đã đăng ký khóa học này rồi 
                <button
                  onClick={() => router.push(`/courses/${courseId}`)}
                  className="ml-2 underline"
                >
                  Xem khóa học
                </button>
              </div>
            ) : (
              <div className="mt-5 space-y-3">
                <button
                  onClick={() => router.push(`/payment?courseId=${courseId}`)}
                  className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                >
                  Tiếp tục thanh toán
                </button>

                <button
                  onClick={() => router.push(`/courses/${courseId}`)}
                  className="w-full bg-gray-200 text-gray-800 py-2 rounded hover:bg-gray-300"
                >
                  Quay lại trang khóa học
                </button>

                
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
