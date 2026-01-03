"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AllCourses() {
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [keyword, setKeyword] = useState("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Lấy danh sách categories từ backend
  useEffect(() => {
    fetch("http://localhost:8080/api/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch((err) => console.error("Lỗi load categories:", err));
  }, []);

  // Lấy danh sách courses từ backend (có tìm kiếm + category)
  useEffect(() => {
    let url = "http://localhost:8080/api/courses";
    const params = new URLSearchParams();

    if (keyword) params.append("keyword", keyword);
    if (selectedCategory) params.append("category", selectedCategory);

    if (params.toString()) {
      url += `?${params.toString()}`;
    }

    setLoading(true);
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setCourses(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Lỗi load courses:", err);
        setLoading(false);
      });
  }, [keyword, selectedCategory]);

  return (
    <div className="flex min-h-screen bg-gray-100">
     
      <aside className="w-64 bg-white p-6 border-r shadow-sm">
        <h2 className="font-bold text-lg mb-4">Lọc theo Category</h2>
        <ul className="space-y-2">
          {categories.map((cat) => (
            <li key={cat}>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="category"
                  value={cat}
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
            className="mt-4 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Xóa lọc
          </button>
        )}
      </aside>

      <main className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-6">Tất cả khóa học</h1>

        
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

        {loading ? (
          <p>Đang tải...</p>
        ) : courses.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {courses.map((course) => (
              <div
                key={course.id}
                className="bg-white rounded-lg shadow hover:shadow-lg transition cursor-pointer"
                onClick={() => router.push(`/courses/${course.id}`)} 
              >
                <img
                  src={course.image}
                  alt={course.title}
                  className="w-full h-40 object-cover rounded-t-lg"
                />
                <div className="p-4">
                  <h3 className="text-lg font-semibold">{course.title}</h3>
                  <p className="text-sm text-gray-600">
                    Category: {course.category}
                  </p>
                  <p className="text-sm text-gray-600">Level: {course.level}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>Không có khóa học nào</p>
        )}
      </main>
    </div>
  );
}
