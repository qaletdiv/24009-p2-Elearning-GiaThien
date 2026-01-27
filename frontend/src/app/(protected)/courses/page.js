"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Headers from "@/components/header";

export default function AllCourses() {
  const router = useRouter();

  const [courses, setCourses] = useState([]);

  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const [selectedLevel, setSelectedLevel] = useState(null);

  const [keyword, setKeyword] = useState("");
  const [loading, setLoading] = useState(true);

  // ===== Pagination state =====
  const [page, setPage] = useState(1);
  const limit = 6
  const [total, setTotal] = useState(0);
  const totalPages = useMemo(() => Math.max(1, Math.ceil(total / limit)), [total, limit]);

  // ===== Load categories =====
  useEffect(() => {
    fetch("http://localhost:8080/api/categories")
      .then((res) => res.json())
      .then((data) => setCategories(Array.isArray(data) ? data : []))
      .catch((err) => console.error("Lỗi load categories:", err));
  }, []);

  // ===== Auto reset page when filters change =====
  useEffect(() => {
    setPage(1);
  }, [keyword, selectedCategory, selectedLevel]);

  // ===== Load courses (with filters + pagination) =====
  useEffect(() => {
    let url = "http://localhost:8080/api/courses";
    const params = new URLSearchParams();

    if (keyword) params.append("keyword", keyword);
    if (selectedCategory) params.append("category", selectedCategory);
    if (selectedLevel) params.append("level", selectedLevel);

    // pagination
    params.append("page", String(page));
    params.append("limit", String(limit));

    url += `?${params.toString()}`;

    setLoading(true);
    fetch(url)
      .then(async (res) => {
        const data = await res.json().catch(() => ({}));
        // Backend chuẩn nên trả: { items, total, page, limit, totalPages }
        // Fallback: nếu backend trả array thuần []
        if (Array.isArray(data)) {
          setCourses(data);
          setTotal(data.length); // fallback (không phân trang đúng nghĩa)
        } else {
          const items = Array.isArray(data.items) ? data.items : [];
          setCourses(items);
          setTotal(Number(data.total) || items.length);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Lỗi load courses:", err);
        setCourses([]);
        setTotal(0);
        setLoading(false);
      });
  }, [keyword, selectedCategory, selectedLevel, page]);

  // ===== Levels list (bổ sung Trung cấp) =====
  const levels = ["Cơ bản", "Trung cấp", "Nâng cao"];

  const canPrev = page > 1;
  const canNext = page < totalPages;

  const gotoPage = (p) => {
    const next = Math.min(Math.max(1, p), totalPages);
    setPage(next);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Headers />

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-72 bg-white p-6 border-r shadow-sm min-h-[calc(100vh-64px)] space-y-8">
          {/* Category */}
          <div>
            <h2 className="font-bold text-lg mb-3">Category</h2>
            <ul className="space-y-2">
              {categories.map((cat) => (
                <li key={cat}>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="category"
                      checked={selectedCategory === cat}
                      onChange={() => setSelectedCategory(cat)}
                    />
                    <span>{cat}</span>
                  </label>
                </li>
              ))}
            </ul>

            {selectedCategory && (
              <button
                onClick={() => setSelectedCategory(null)}
                className="mt-3 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
              >
                Xóa lọc category
              </button>
            )}
          </div>

          {/* Level */}
          <div>
            <h2 className="font-bold text-lg mb-3">Level</h2>
            <ul className="space-y-2">
              {levels.map((lv) => (
                <li key={lv}>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="level"
                      checked={selectedLevel === lv}
                      onChange={() => setSelectedLevel(lv)}
                    />
                    <span>{lv}</span>
                  </label>
                </li>
              ))}
            </ul>

            {selectedLevel && (
              <button
                onClick={() => setSelectedLevel(null)}
                className="mt-3 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
              >
                Xóa lọc level
              </button>
            )}
          </div>
        </aside>

        {/* Main */}
        <main className="flex-1 p-6">
          <div className="flex items-end justify-between gap-4 mb-4">
            <h1 className="text-2xl font-bold">Tất cả khóa học</h1>

            {/* Info pagination */}
            <div className="text-sm text-gray-600">
              Trang <span className="font-semibold">{page}</span> /{" "}
              <span className="font-semibold">{totalPages}</span>
              {total ? <span className="ml-2">({total} khóa học)</span> : null}
            </div>
          </div>

          {/* Search */}
          <div className="mb-6 flex">
            <input
              type="text"
              placeholder="Tìm kiếm khóa học..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="flex-1 border px-4 py-2 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={() => setKeyword(keyword)}
              className="bg-blue-600 text-white px-4 rounded-r-lg hover:bg-blue-700"
            >
              Tìm
            </button>
          </div>

          {/* List */}
          {loading ? (
            <p>Đang tải...</p>
          ) : courses.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {courses.map((course) => (
                  <div
                    key={course.id}
                    className="bg-white rounded-lg shadow hover:shadow-lg transition cursor-pointer"
                    onClick={() => router.push(`/courses/${course.id}`)}
                  >
                    <Image
                      src={course.image}
                      alt={course.title}
                      width={400}
                      height={200}
                      className="w-full h-40 object-cover rounded-t-lg"
                    />
                    <div className="p-4 space-y-1">
                      <h3 className="text-lg font-semibold">{course.title}</h3>
                      <p className="text-sm text-gray-600">Category: {course.category}</p>
                      <p className="text-sm text-gray-600">Level: {course.level}</p>
                      <p className="text-sm text-gray-600">{course.description}</p>
                      <p className="text-sm text-gray-600">{course.target}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination controls */}
              <div className="flex items-center justify-center gap-2 mt-8">
                <button
                  disabled={!canPrev}
                  onClick={() => gotoPage(page - 1)}
                  className="px-3 py-2 rounded border bg-white hover:bg-gray-50 disabled:opacity-50"
                >
                   Prev
                </button>

                {/* page numbers (hiển thị gọn) */}
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .slice(Math.max(0, page - 3), Math.max(0, page - 3) + 5)
                  .map((p) => (
                    <button
                      key={p}
                      onClick={() => gotoPage(p)}
                      className={`px-3 py-2 rounded border ${
                        p === page ? "bg-blue-600 text-white" : "bg-white hover:bg-gray-50"
                      }`}
                    >
                      {p}
                    </button>
                  ))}

                <button
                  disabled={!canNext}
                  onClick={() => gotoPage(page + 1)}
                  className="px-3 py-2 rounded border bg-white hover:bg-gray-50 disabled:opacity-50"
                >
                  Next 
                </button>
              </div>
            </>
          ) : (
            <p>Không có khóa học nào</p>
          )}
        </main>
      </div>
    </div>
  );
}
