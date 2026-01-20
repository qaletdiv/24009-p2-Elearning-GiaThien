"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const router = useRouter();
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      console.log(data);

      if (res.ok) {
        setMessage("Đăng nhập thành công!");
        // localStorage.setItem("token", data.token);
        // console.log("User info:", data.user);
        // router.push("/dashboard");
        console.log("token trước khi lưu:", data.token);

        localStorage.setItem("token", data.token);

        console.log("token sau khi lưu:", localStorage.getItem("token"));

        router.replace("/dashboard");
      } else {
        setMessage(data.message || "Sai email hoặc mật khẩu");
      }
    } catch (error) {
      console.error(error);
      setMessage("Lỗi");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-sm bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center mb-6">Login</h1>
        {message && (
          <p className="text-center mt-4 text-red-500 font-medium">{message}</p>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <p className="text-center">Chưa có tài khoản? <Link className="text-center text-blue-500 hover:text-blue-700 hover:underline cursor-pointer" href='/signin'>Đăng ký ngay</Link></p>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-200"
          >
            Đăng nhập
          </button>
        </form>

        
      </div>
    </div>
  );
}
