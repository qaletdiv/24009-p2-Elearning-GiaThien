"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Headers from "@/components/header";

export default function PaymentPage() {
  const router = useRouter();
  const params = useSearchParams();
  const courseId = params.get("courseId");

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);

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

    fetch(`http://localhost:8080/api/courses/${courseId}`)
      .then((res) => res.json())
      .then((data) => setCourse(data))
      .catch((err) => console.error("Payment load course error:", err))
      .finally(() => setLoading(false));
  }, [courseId, router, token]);

  const priceText = useMemo(() => {
    if (!course) return "";
    if (course.price === "Miễn phí") return "Miễn phí";
    if (typeof course.price === "number") return `${course.price}k`;
    return String(course.price || "Miễn phí");
  }, [course]);

  const handlePaySuccess = async () => {
    if (!courseId) return;

    setPaying(true);
    try {

      const res = await fetch(`http://localhost:8080/api/courses/${courseId}/register`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        alert(data.message || "Thanh toán/enroll thất bại");
        setPaying(false);
        return;
      }

      alert("Thanh toán thành công! Đã đăng ký khóa học ");


      router.replace(`/courses/${courseId}`);
    } catch (err) {
      console.error(err);
      alert("Có lỗi khi xử lý thanh toán");
      setPaying(false);
    }
  };

  if (loading) return <p className="p-6">Đang tải payment...</p>;
  if (!course) return <p className="p-6">Không tìm thấy khóa học</p>;

  return (
    <div className="min-h-screen bg-gray-100">
      <Headers />

      <div className="max-w-xl mx-auto p-6">
        <button
          onClick={() => router.push(`/checkout?courseId=${courseId}`)}
          className="mb-4 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
        >
          Quay lại checkout
        </button>

        <h1 className="text-2xl font-bold mb-4">Thanh toán</h1>

        <div className="bg-white rounded-lg shadow p-5">
          <div className="flex items-start gap-4">
            <Image
              src={course.image}
              alt={course.title}
              width={400}
              height={200}
              className="w-24 h-24 object-cover rounded"
            />
            <div className="flex-1">
              <div className="font-semibold text-lg">{course.title}</div>
              <div className="text-sm text-gray-600 mt-1">
                {course.description || "Chưa có mô tả"}
              </div>
              <div className="mt-2 text-sm">
                <span className="font-semibold">Tổng:</span>{" "}
                <span className="text-green-700 font-bold">{priceText}</span>
              </div>
            </div>
          </div>



          <div className="mt-5 grid grid-cols-1 gap-3">
            <button
              onClick={handlePaySuccess}
              disabled={paying}
              className={`w-full py-2 rounded text-white ${paying ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"
                }`}
            >
              {paying ? "Đang xử lý..." : "Thanh toán"}
            </button>

            <button
              onClick={() => router.replace(`/courses/${courseId}`)}
              className="w-full py-2 rounded bg-gray-200 hover:bg-gray-300"
            >
              Hủy & quay lại khóa học
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
