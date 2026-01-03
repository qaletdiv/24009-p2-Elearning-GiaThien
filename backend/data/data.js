const bcrypt = require('bcryptjs');

//database users
const adminHashedPassword = bcrypt.hashSync("123", 10);
let users = [
    { id: 1, name: "admin", email: "admin@gmail.com", password: adminHashedPassword },
    { id: 2, name: "user1", email: "user1@gmail.com", password: adminHashedPassword },
    { id: 3, name: "user2", email: "user2@gmail.com", password: adminHashedPassword }
];
let nextUserId = 4;
const updateUser = (userId, updates) => {
  const idx = users.findIndex(u => u.id === userId);
  if (idx === -1) return null;
  users[idx] = { ...users[idx], ...updates };
  return users[idx];
};



// ====== Database giả lập cho khóa học ======
let courses = [
    {
        id: "C01",
        title: "React Cơ Bản",
        image: "/images/react-basic.jpg",
        category: "Công nghệ",
        level: "Cơ bản",
        price: 500,
    },
    {
        id: "C02",
        title: "Next.js Nâng Cao",
        image: "/images/next-advanced.jpg",
        category: "Công nghệ",
        level: "Nâng cao",
        price: 400,
    },
]

let lessons = [
    { id: "L01", courseId: "C01", title: "Giới thiệu React", completed: true, videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" },
    { id: "L02", courseId: "C01", title: "Component cơ bản", completed: false, videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4" },
    { id: "L03", courseId: "C01", title: "Props và State", completed: false, videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4" },
    { id: "L04", courseId: "C01", title: "Event Handling", completed: false, videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4" },
    { id: "L05", courseId: "C01", title: "Lifecycle Methods", completed: false, videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4" },
    { id: "L06", courseId: "C02", title: "Routing cơ bản", completed: true, videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4" },
    { id: "L07", courseId: "C02", title: "Data Fetching", completed: true, videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4" },
    { id: "L08", courseId: "C02", title: "Server Actions", completed: false, videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4" },
    { id: "L09", courseId: "C02", title: "API Routes", completed: false, videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4" },
    { id: "L10", courseId: "C02", title: "Middleware", completed: false, videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4" },
    { id: "L11", courseId: "C02", title: "Deployment", completed: false, videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/VolkswagenGTIReview.mp4" },
]



// --- QUIZ TOÀN KHÓA ---
let courseQuizzes = [
    {
      courseId: "C01",
      title: "Bài kiểm tra cuối khóa: React Cơ Bản",
      questions: [
        {
          id: 1,
          question: "React là gì?",
          options: [
            "Thư viện JavaScript để xây dựng giao diện người dùng",
            "Framework CSS",
            "Ngôn ngữ lập trình",
            "Trình duyệt web",
          ],
          correct: 0,
          explanation: "React là thư viện JavaScript chuyên về UI."
        },
        {
          id: 2,
          question: "Hook useState dùng để làm gì?",
          options: [
            "Tạo route mới",
            "Lưu và cập nhật trạng thái trong component",
            "Kết nối với server",
            "Gọi API",
          ],
          correct: 1,
          explanation: "useState cho phép React lưu trữ và cập nhật trạng thái."
        },
      ],
    },
  ];

// Liên kết user ↔ khóa học (giả lập)
// progress tính theo % số bài học đã hoàn thành
let userCourses = [
    { userId: 1, courseId: "C01", progress: 60 },
    { userId: 1, courseId: "C02", progress: 30 },
    { userId: 2, courseId: "C02", progress: 20 },
    { userId: 3, courseId: "C01", progress: 40 },
];



// Export functions to allow modification
module.exports = {
    getUsers: () => users,
    updateUser,
    getCourses: () => courses,
    getLessons: () => lessons,
    getCourseQuizzes: () => courseQuizzes,
    getUserCourses: () => userCourses,
    getNextUserId: () => nextUserId,
    
    // Functions to modify data
    addUser: (user) => {
        users.push(user);
        nextUserId++;
    },
    updateLesson: (lessonId, courseId, updates) => {
        const lesson = lessons.find(l => l.id === lessonId && l.courseId === courseId);
        if (lesson) {
            Object.assign(lesson, updates);
        }
    },
    addUserCourse: (userCourse) => {
        userCourses.push(userCourse);
    }
};
  