"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Headers from "@/components/header";

export default function ProfilePage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);

  // user
  const [user, setUser] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [avatar, setAvatar] = useState(""); // url từ backend

  // update password
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  // avatar 
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState("");
  const [uploadingAvatar, setUploadingAvatar] = useState(false);


  const [message, setMessage] = useState("");


  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.replace("/login");
      return;
    }

    setLoading(true);
    fetch("http://localhost:8080/api/users/me", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (res) => {
        const body = await res.json().catch(() => ({}));
        if (!res.ok) {
          if (res.status === 401 || res.status === 403) {
            localStorage.removeItem("token");
            router.replace("/login");
          }
          throw new Error(body.message || `users/me failed (${res.status})`);
        }
        return body;
      })
      .then((u) => {
        setUser(u);
        setName(u?.name || "");
        setEmail(u?.email || "");
        setAvatar(u?.avatar || "");
        setLoading(false);
      })
      .catch((err) => {
        console.error("Profile load error:", err);
        setLoading(false);
      });
  }, [router]);


  const handleSelectAvatar = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const okTypes = ["image/png", "image/jpeg", "image/webp"];
    if (!okTypes.includes(file.type)) {
      alert("Chỉ cho phép PNG / JPG / WEBP");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      alert("Ảnh tối đa 2MB");
      return;
    }

    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };


  const handleUploadAvatar = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.replace("/login");
      return;
    }
    if (!avatarFile) {
      alert("Vui lòng chọn ảnh trước");
      return;
    }

    setUploadingAvatar(true);
    setMessage("");

    try {
      const fd = new FormData();
      fd.append("avatar", avatarFile);

      const res = await fetch("http://localhost:8080/api/users/me/avatar", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        if (res.status === 401 || res.status === 403) {
          localStorage.removeItem("token");
          router.replace("/login");
          return;
        }
        throw new Error(data.message || "Upload avatar thất bại");
      }

      const newAvatar = data.avatar || data?.user?.avatar || "";
      setAvatar(newAvatar);


      setAvatarFile(null);
      setAvatarPreview("");

      setMessage(data.message || "Cập nhật avatar thành công");
    } catch (err) {
      console.error(err);
      setMessage(err.message || "Lỗi upload avatar");
    } finally {
      setUploadingAvatar(false);
    }
  };


  const handleSaveProfile = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      router.replace("/login");
      return;
    }

    setMessage("");


    const wantChangePassword = !!newPassword || !!confirmNewPassword || !!currentPassword;
    if (wantChangePassword) {
      if (!currentPassword) {
        setMessage("Vui lòng nhập mật khẩu hiện tại");
        return;
      }
      if (!newPassword) {
        setMessage("Vui lòng nhập mật khẩu mới");
        return;
      }
      if (newPassword !== confirmNewPassword) {
        setMessage("Mật khẩu mới không khớp");
        return;
      }

    }

    try {
      const payload = {
        name: name.trim(),
        email: email.trim(),
      };

      if (wantChangePassword) {
        payload.currentPassword = currentPassword;
        payload.newPassword = newPassword;
        payload.confirmNewPassword = confirmNewPassword;
      }

      const res = await fetch("http://localhost:8080/api/users/me", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        if (res.status === 401 || res.status === 403) {
          localStorage.removeItem("token");
          router.replace("/login");
          return;
        }
        throw new Error(data.message || "Cập nhật thất bại");
      }


      setUser(data.user);
      setName(data.user?.name || "");
      setEmail(data.user?.email || "");
      if (data.user?.avatar) setAvatar(data.user.avatar);


      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");

      setMessage(data.message || "Cập nhật hồ sơ thành công");
    } catch (err) {
      console.error(err);
      setMessage(err.message || "Lỗi cập nhật hồ sơ");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.replace("/login");
  };

  if (loading) return <p className="text-center mt-10 text-gray-600">Đang tải hồ sơ...</p>;

  return (
    <div className="min-h-screen bg-gray-100">
      <Headers />

      <div className="max-w-4xl mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Hồ sơ cá nhân</h1>

        </div>

        {message ? (
          <div className="mb-4 p-3 rounded border bg-white text-sm text-gray-800">
            {message}
          </div>
        ) : null}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          <div className="bg-white rounded-lg shadow p-5">
            <div className="flex flex-col items-center gap-3">
              <img
                src={avatarPreview || avatar || "/images/default-avatar.jpg"}
                alt="avatar"
                className="w-28 h-28 rounded-full object-cover border"
              />

              <div className="w-full">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Chọn ảnh đại diện
                </label>
                <div className="w-full">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Chọn ảnh đại diện
                  </label>

                  <input
                    id="avatarInput"
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    onChange={handleSelectAvatar}
                    className="hidden"
                  />

                  <button
                    type="button"
                    onClick={() => document.getElementById("avatarInput")?.click()}
                    className="w-full border py-2 rounded hover:bg-gray-50"
                  >
                    Chọn ảnh
                  </button>

                  {avatarFile && (
                    <p className="text-xs text-green-600 mt-2">
                      Đã chọn: {avatarFile.name} ({Math.round(avatarFile.size / 1024)} KB)
                    </p>
                  )}

                  <button
                    type="button"
                    onClick={handleUploadAvatar}
                    disabled={uploadingAvatar}
                    className="w-full mt-3 bg-purple-600 text-white py-2 rounded hover:bg-purple-700 disabled:opacity-60"
                  >
                    {uploadingAvatar ? "Đang tải..." : "Tải avatar lên"}
                  </button>
                </div>

                <p className="text-xs text-gray-500 mt-2">PNG/JPG/WEBP • tối đa 2MB</p>
              </div>

             
            </div>
          </div>

         
          <div className="md:col-span-2 bg-white rounded-lg shadow p-5">
            <form onSubmit={handleSaveProfile} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Username / Tên hiển thị
                </label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Nhập tên hiển thị"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Nhập email"
                />
              </div>

              <div className="border-t pt-4">
                <h2 className="font-semibold text-gray-800 mb-3">Đổi mật khẩu</h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">
                      Mật khẩu hiện tại
                    </label>
                    <input
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      type="password"
                      className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Nhập mật khẩu hiện tại"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-700 mb-1">
                      Mật khẩu mới
                    </label>
                    <input
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      type="password"
                      className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Nhập mật khẩu mới"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-700 mb-1">
                      Nhập lại mật khẩu mới
                    </label>
                    <input
                      value={confirmNewPassword}
                      onChange={(e) => setConfirmNewPassword(e.target.value)}
                      type="password"
                      className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Nhập lại mật khẩu mới"
                    />
                  </div>
                </div>

                <p className="text-xs text-gray-500 mt-2">
                  Nếu không đổi mật khẩu, bạn có thể để trống cả 3 ô.
                </p>
              </div>

              <button
                type="submit"
                className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700"
              >
                Lưu thay đổi
              </button>

              <div className="text-xs text-gray-500">
                User ID: <span className="font-mono">{user?.id}</span>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
