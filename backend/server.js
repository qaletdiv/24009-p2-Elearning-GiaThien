const express = require('express')
const cors = require('cors');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const path = require("path");
const multer = require("multer");
// Import data functions
const {
  getUsers,
  updateUser,
  getCourses,
  getLessons,
  getCourseQuizzes,
  getUserCourses,
  getNextUserId,
  addUser,
  updateLesson,
  addUserCourse
} = require('./data/data');

const app = express();
const PORT = 8080;
const SECRET_KEY = 'abcd'

// middleware
app.use(cors({ credentials: true, origin: 'http://localhost:3000' }));
app.use(express.json());
app.use(express.static('public'));

app.use("/files", express.static(path.join(__dirname, "public/files")));
app.use("/uploads", express.static(path.join(__dirname, "public/uploads")));




// API đăng kí
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body;

    if (!name || !email || !password || !confirmPassword) {
      return res.status(400).json({ message: 'Vui lòng nhập đầy đủ thông tin' });
    }
    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Mật khẩu không khớp' });
    }

    const existingUser = getUsers().find(u => u.email === email);
    if (existingUser) {
      return res.status(409).json({ message: 'Email đã được sử dụng' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = {
      id: getNextUserId(),
      name,
      email,
      password: hashedPassword
    };
    addUser(newUser);

    const token = jwt.sign({ id: newUser.id, email: newUser.email }, SECRET_KEY, { expiresIn: '5h' });

    return res.status(201).json({
      message: 'Đăng kí thành công',
      user: { id: newUser.id, name: newUser.name, email: newUser.email },
      token
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Lỗi server' });
  }
});

// API đăng nhập
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;

  const user = getUsers().find(u => u.email === email);
  if (!user) {
    return res.status(401).json({ message: "Email hoặc mật khẩu không đúng" });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(401).json({ message: 'Email hoặc mật khẩu không đúng' });
  }

  const token = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, { expiresIn: '5h' });

  return res.json({
    message: 'Đăng nhập thành công',
    user: { id: user.id, name: user.name, email: user.email },
    token
  });
});


function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.sendStatus(401);

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

// AVATAR
const avatarStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "public/uploads/avatars"));
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname || "").toLowerCase();
    const safeExt = [".png", ".jpg", ".jpeg", ".webp"].includes(ext) ? ext : ".png";
    cb(null, `u${req.user.id}_${Date.now()}${safeExt}`);
  },
});

const uploadAvatar = multer({
  storage: avatarStorage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
  fileFilter: (req, file, cb) => {
    const ok = ["image/png", "image/jpeg", "image/webp"].includes(file.mimetype);
    if (!ok) return cb(new Error("Chỉ cho phép PNG/JPG/WEBP"));
    cb(null, true);
  },
});




// API lấy danh sách người dùng (chỉ cho user đăng nhập)
app.get('/api/users', authenticateToken, (req, res) => {
  const safeUsers = getUsers().map(u => ({ id: u.id, name: u.name, email: u.email }));
  res.json(safeUsers);
});

// API lấy thông tin user hiện tại
app.get("/api/users/me", authenticateToken, (req, res) => {
  const userId = parseInt(req.user.id);
  const user = getUsers().find((u) => u.id === userId);

  if (!user) return res.status(404).json({ message: "Không tìm thấy user" });

  res.json({ id: user.id, name: user.name, email: user.email });
});
// API cập nhật user
app.put("/api/users/me", authenticateToken, async (req, res) => {
  try {
    const userId = Number(req.user.id);

    const {
      name,
      email,
      avatar,
      currentPassword,
      newPassword,
      confirmNewPassword,
    } = req.body;

    const user = getUsers().find((u) => u.id === userId);
    if (!user) return res.status(404).json({ message: "Không tìm thấy user" });

    // nếu muốn đổi email  check trùng
    if (email && email !== user.email) {
      const exists = getUsers().some((u) => u.email === email && u.id !== userId);
      if (exists) return res.status(409).json({ message: "Email đã được sử dụng" });
    }

    const updates = {};

    if (typeof name === "string" && name.trim()) updates.name = name.trim();
    if (typeof email === "string" && email.trim()) updates.email = email.trim();
    if (typeof avatar === "string" && avatar.trim()) updates.avatar = avatar.trim();

    // đổi password 
    if (newPassword) {
      if (!currentPassword) {
        return res.status(400).json({ message: "Vui lòng nhập mật khẩu hiện tại" });
      }
      if (confirmNewPassword !== undefined && newPassword !== confirmNewPassword) {
        return res.status(400).json({ message: "Mật khẩu mới không khớp" });
      }

      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Mật khẩu hiện tại không đúng" });
      }

      updates.password = await bcrypt.hash(newPassword, 10);
    }

    const updated = updateUser(userId, updates);
    if (!updated) return res.status(500).json({ message: "Cập nhật thất bại" });

    // Nếu email đổi -> trả token mới để FE lưu lại
    let token = null;
    if (updates.email && updates.email !== req.user.email) {
      token = jwt.sign(
        { id: updated.id, email: updated.email },
        SECRET_KEY,
        { expiresIn: "5h" }
      );
    }

    return res.json({
      message: "Cập nhật hồ sơ thành công",
      user: {
        id: updated.id,
        name: updated.name,
        email: updated.email,
        avatar: updated.avatar || "",
      },
      ...(token ? { token } : {}),
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Lỗi server" });
  }
});

app.post("/api/users/me/avatar", authenticateToken, uploadAvatar.single("avatar"), (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "Không có file avatar" });

    const userId = Number(req.user.id);

    const avatarUrl = `http://localhost:${PORT}/uploads/avatars/${req.file.filename}`;

    const updated = updateUser(userId, { avatar: avatarUrl });
    if (!updated) return res.status(500).json({ message: "Cập nhật avatar thất bại" });

    return res.json({
      message: "Cập nhật avatar thành công",
      avatar: avatarUrl,
      user: { id: updated.id, name: updated.name, email: updated.email, avatar: avatarUrl },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Lỗi server" });
  }
});


// API lọc trong trang courses
app.get("/api/categories", (req, res) => {
  const uniqueCategories = [...new Set(getCourses().map(c => c.category || "Khác"))];
  res.json(uniqueCategories);
});

// API lấy tất cả khóa học (public)
app.get("/api/courses", (req, res) => {
  const { keyword, category, level, description, target } = req.query;

  let result = [...getCourses()];

  if (keyword) {
    result = result.filter(c =>
      c.title.toLowerCase().includes(String(keyword).toLowerCase())
    );
  }

  if (category) {
    result = result.filter(c => c.category === category);
  }

  if (level) {
    result = result.filter(c => c.level === level);
  }

  if (description) {
    result = result.filter(c => c.description === description);
  }
  if (target) {
    result = result.filter(c => c.target === target);
  }
  const formatted = result.map(c => ({
    id: c.id,
    title: c.title,
    image: `http://localhost:${PORT}${c.image}`,
    description: c.description || "",
    target: c.target || "",
    category: c.category || "Chưa phân loại",
    level: c.level || "Cơ bản",
    price: c.price ?? "Miễn phí",
  }));

  res.json(formatted);
});



//  API lấy danh sách khóa học của user  (PHẢI đặt trước /api/courses/:id)
app.get("/api/courses/my", authenticateToken, (req, res) => {
  const userId = parseInt(req.user.id);

  const filteredUserCourses = getUserCourses().filter((uc) => uc.userId === userId);

  const myCourses = filteredUserCourses
    .map((uc) => {
      const course = getCourses().find((c) => c.id === uc.courseId);
      if (!course) return null;

      return {
        id: course.id,
        title: course.title,
        image: `http://localhost:${PORT}${course.image}`,
        progress: uc.progress,
      };
    })
    .filter(Boolean);

  res.json(myCourses);
});

// API lấy bài học gần nhất chưa hoàn thành (đặt trước /:id để tránh bị nuốt nếu bạn đổi path)
app.get("/api/courses/:id/lesson/last", authenticateToken, (req, res) => {
  const courseId = req.params.id;
  const course = getCourses().find((c) => c.id === courseId);

  if (!course) return res.status(404).json({ message: "Không tìm thấy khóa học" });

  const courseLessons = getLessons().filter(l => l.courseId === courseId);
  const nextLesson = courseLessons.find((lesson) => !lesson.completed);

  if (!nextLesson) {
    return res.json({ message: "Bạn đã hoàn thành khóa học này" });
  }

  res.json({
    courseId: course.id,
    lessonId: nextLesson.id,
    title: nextLesson.title,
  });
});

// ✅ Lấy quiz cuối khóa (đặt trước /:id)
app.get("/api/courses/:id/quiz", (req, res) => {
  const quiz = getCourseQuizzes().find(q => q.courseId === req.params.id);
  if (!quiz) return res.status(404).json({ message: "Không có quiz cho khóa học này" });
  res.json(quiz);
});

// Nộp quiz cuối khóa
app.post("/api/courses/:id/quiz/submit", authenticateToken, (req, res) => {
  const { answers } = req.body;
  const quiz = getCourseQuizzes().find(q => q.courseId === req.params.id);
  if (!quiz) return res.status(404).json({ message: "Không tìm thấy quiz" });

  let correctCount = 0;
  const details = quiz.questions.map(q => {
    const userAnswer = answers.find(a => a.questionId === q.id);
    const isCorrect = userAnswer && userAnswer.answerIndex === q.correct;
    if (isCorrect) correctCount++;
    return {
      question: q.question,
      options: q.options,
      correctAnswer: q.correct,
      userAnswer: userAnswer ? userAnswer.answerIndex : null,
      explanation: q.explanation,
      isCorrect,
    };
  });

  const score = Math.round((correctCount / quiz.questions.length) * 100);
  res.json({ score, correctCount, total: quiz.questions.length, details });
});

// Đăng ký khóa học
app.post("/api/courses/:id/register", authenticateToken, (req, res) => {
  const courseId = req.params.id;
  const userId = parseInt(req.user.id);

  const course = getCourses().find(c => c.id === courseId);
  if (!course) {
    return res.status(404).json({ message: "Không tìm thấy khóa học" });
  }

  const exists = getUserCourses().find(uc => uc.userId === userId && uc.courseId === courseId);
  if (exists) {
    return res.status(400).json({ message: "Bạn đã tham gia khóa học này rồi" });
  }

  addUserCourse({ userId, courseId, progress: 0 });
  res.json({ message: "Đăng ký khóa học thành công!" });
});

// Kiểm tra trạng thái đăng ký
app.get("/api/courses/:courseId/enrollment", authenticateToken, (req, res) => {
  const courseId = req.params.courseId;
  const userId = parseInt(req.user.id);

  const enrollment = getUserCourses().find(uc => uc.userId === userId && uc.courseId === courseId);

  res.json({
    isEnrolled: !!enrollment
  });
});

// Review khóa học
app.post("/api/courses/:id/reviews", authenticateToken, (req, res) => {
  const { rating, comment } = req.body;
  const course = getCourses().find(c => c.id === req.params.id);
  if (!course) return res.status(404).json({ message: "Không tìm thấy khóa học" });

  const review = {
    userId: parseInt(req.user.id),
    name: getUsers().find(u => u.id === parseInt(req.user.id))?.name || "Ẩn danh",
    rating,
    comment,
    date: new Date()
  };
  course.reviews = course.reviews || [];
  course.reviews.push(review);

  res.json({ message: "Đánh giá thành công", review });
});

// API lấy danh sách bài học trong khóa
app.get("/api/courses/:id/lessons", authenticateToken, (req, res) => {
  const { id } = req.params;
  const course = getCourses().find(c => c.id === id);
  if (!course) return res.status(404).json({ message: "Không tìm thấy khóa học" });

  const courseLessons = getLessons().filter(l => l.courseId === id);
  res.json(courseLessons.map(l => ({
    id: l.id,
    title: l.title,
    completed: l.completed
  })));
});

// API lấy chi tiết bài học
app.get("/api/courses/:id/lessons/:lessonId", authenticateToken, (req, res) => {
  const { id, lessonId } = req.params;
  const course = getCourses().find(c => c.id === id);
  if (!course) return res.status(404).json({ message: "Không tìm thấy khóa học" });

  const lesson = getLessons().find(l => l.id === lessonId && l.courseId === id);
  if (!lesson) return res.status(404).json({ message: "Không tìm thấy bài học" });

  res.json({
    id: lesson.id,
    title: lesson.title,
    videoUrl: lesson.videoUrl || "https://www.w3schools.com/html/mov_bbb.mp4",
    content: lesson.content || "Nội dung đang cập nhật...",
    completed: lesson.completed || false,
    resources: lesson.resources || []
  });
});

// Đánh dấu bài học hoàn thành
app.post("/api/courses/:id/lessons/:lessonId/complete", authenticateToken, (req, res) => {
  const { id, lessonId } = req.params;
  const course = getCourses().find(c => c.id === id);
  if (!course) return res.status(404).json({ message: "Không tìm thấy khóa học" });

  const lesson = getLessons().find(l => l.id === lessonId && l.courseId === id);
  if (!lesson) return res.status(404).json({ message: "Không tìm thấy bài học" });

  updateLesson(lessonId, id, { completed: true });
  res.json({ message: "Đã đánh dấu bài học là hoàn thành", lesson });
});

// ✅ API lấy chi tiết khóa học (route động /:id) — ĐẶT CUỐI CÙNG trong nhóm /api/courses/*
app.get("/api/courses/:id", (req, res) => {
  const id = req.params.id;
  const course = getCourses().find(c => c.id === id);

  if (!course) {
    return res.status(404).json({ message: "Không tìm thấy khóa học" });
  }

  const courseLessons = getLessons().filter(l => l.courseId === id);

  const total = courseLessons.length;
  const completed = courseLessons.filter(l => l.completed).length;
  const progress = total > 0 ? Math.round((completed / total) * 100) : 0;

  res.json({
    id: course.id,
    title: course.title,
    image: `http://localhost:${PORT}${course.image}`,
    description: course.description || "Khoá học hấp dẫn",
    price: course.price || "Miễn phí",
    instructor: course.instructor || "Giảng viên chưa rõ",
    duration: course.duration || "5 giờ",
    rating: course.rating || 4.5,
    progress,
    lessons: courseLessons,
    reviews: course.reviews || []
  });
});

app.listen(PORT, () => {
  console.log(`Backend chạy tại http://localhost:${PORT}`);
});
