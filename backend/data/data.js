const bcrypt = require('bcryptjs');

//database users
const adminHashedPassword = bcrypt.hashSync("123", 10);
let users = [
  { id: 1, name: "admin", email: "admin@gmail.com", password: adminHashedPassword, avatar: "/avatars/default.png", },
  { id: 2, name: "user1", email: "user1@gmail.com", password: adminHashedPassword, avatar: "/avatars/default.png", },
  { id: 3, name: "user2", email: "user2@gmail.com", password: adminHashedPassword, avatar: "/avatars/default.png", }
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
    description: "Khóa học React cho người mới bắt đầu",
    target:"Sau khi học xong bạn sẽ có các kiến thức cơ bản về React",
    category: "Công nghệ",
    level: "Cơ bản",
    price: 0,
  },
  {
    id: "C02",
    title: "Next.js Nâng Cao",
    image: "/images/next-advanced.jpg",
    description:"Khóa học NextJS nâng cao",
    target:"Sau khi học xong bạn sẽ thành thạo NextJS",
    category: "Công nghệ",
    level: "Nâng cao",
    price: 400,
  },
  {
    id: "C03",
    title: "HTML cơ bản",
    image: "/images/html-basic.jpg",
    description:"Khóa học HTML cho người mới bắt đầu",
    target:"Sau khi học xong bạn sẽ có các kiến thức cơ bản về HTML",
    category: "Công nghệ",
    level: "Cơ bản",
    price: 400,
  },
  {
    id: "C04",
    title: "CSS cơ bản",
    image: "/images/css-basic.jpg",
    description:"Khóa học CSS cho người mới bắt đầu",
    target:"Sau khi học xong bạn sẽ có các kiến thức cơ bản về CSS",
    category: "Công nghệ",
    level: "Cơ bản",
    price: 400,
  },
  {
    id: "C05",
    title: "Javascript Nâng cao",
    image: "/images/js-advanced.jpg",
    description:"Khóa học Javascript nâng cao",
    target:"Sau khi học xong bạn sẽ thành thạo Javascript",
    category: "Công nghệ",
    level: "Nâng cao",
    price: 400,
  }
]

let lessons = [
  // =========================
  // C01 - React Cơ Bản
  // =========================
  {
    id: "L01",
    courseId: "C01",
    title: "Giới thiệu React",
    completed: true,
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    content:
      "React là thư viện JavaScript dùng để xây dựng giao diện người dùng theo hướng component. Trong bài này bạn sẽ hiểu JSX, component, và tư duy UI theo trạng thái.",
    resources: [
      { name: "Slide React B1 (PDF)", url: "/files/1.pdf" },
    ],
  },
  {
    id: "L02",
    courseId: "C01",
    title: "Component cơ bản",
    completed: false,
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    content:
      "Học cách tạo functional component, props, và tái sử dụng UI. Bạn sẽ xây dựng component Button/Card và luyện tập tách UI.",
    resources: [
      { name: "Bài tập Component (PDF)", url: "/files/2.pdf" },
    ],
  },
  {
    id: "L03",
    courseId: "C01",
    title: "Props và State",
    completed: false,
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    content:
      "Phân biệt props (dữ liệu truyền từ cha -> con) và state (trạng thái nội bộ). Thực hành useState và render theo trạng thái.",
    resources: [
      { name: "Cheatsheet Props/State (PDF)", url: "/files/3.pdf" },
     
    ],
  },
  {
    id: "L04",
    courseId: "C01",
    title: "Event Handling",
    completed: false,
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    content:
      "Xử lý sự kiện trong React: onClick, onChange, onSubmit. Làm form đơn giản và validate dữ liệu cơ bản.",
    resources: [
      { name: "Form cơ bản (PDF)", url: "/files/4.pdf" },
    ],
  },
  {
    id: "L05",
    courseId: "C01",
    title: "Lifecycle Methods",
    completed: false,
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
    content:
      "Tư duy vòng đời trong React hiện đại với useEffect: mount/update/unmount. Thực hành fetch API và cleanup effect.",
    resources: [
      { name: "useEffect Guide (PDF)", url: "/files/5.pdf" },
      
    ],
  },

  // =========================
  // C02 - Next.js Nâng Cao
  // =========================
  {
    id: "L06",
    courseId: "C02",
    title: "Routing cơ bản",
    completed: true,
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
    content:
      "Hiểu App Router, folder routes, dynamic routes, và navigation trong Next.js. Thực hành tạo trang /courses/[id].",
    resources: [
      { name: "Next Routing (PDF)", url: "/files/6.pdf" },
    ],
  },
  {
    id: "L07",
    courseId: "C02",
    title: "Data Fetching",
    completed: true,
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
    content:
      "Các cách fetch dữ liệu: client fetch, server fetch, caching và revalidate cơ bản. Lưu ý token trong client component.",
    resources: [
      { name: "Data Fetching (PDF)", url: "/files/7.pdf" },
      
    ],
  },
  {
    id: "L08",
    courseId: "C02",
    title: "Server Actions",
    completed: false,
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
    content:
      "Giới thiệu Server Actions (khái niệm), cách tổ chức form submit, và best-practices tránh lộ secret ở client.",
    resources: [
      { name: "Server Actions Notes (PDF)", url: "/files/8.pdf" },
    ],
  },
  {
    id: "L09",
    courseId: "C02",
    title: "API Routes",
    completed: false,
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4",
    content:
      "Tạo API route trong Next.js, hiểu request/response, validate input và cấu trúc trả JSON chuẩn.",
    resources: [
      { name: "API Routes (PDF)", url: "/files/9.pdf" },
      
    ],
  },
  {
    id: "L10",
    courseId: "C02",
    title: "Middleware",
    completed: false,
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
    content:
      "Middleware dùng để chặn route, kiểm tra auth, redirect. Thực hành protected routes và pattern an toàn.",
    resources: [
      { name: "Middleware Auth (PDF)", url: "/files/10.pdf" },
    ],
  },
  {
    id: "L11",
    courseId: "C02",
    title: "Deployment",
    completed: false,
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/VolkswagenGTIReview.mp4",
    content:
      "Triển khai Next.js: build, env variables, cấu hình production. Lưu ý CORS/backend và đường dẫn asset.",
    resources: [
      { name: "Deploy Checklist (PDF)", url: "/files/11.pdf" },
    ],
  },

  // =========================
  // C03 - HTML Cơ bản
  // =========================
  {
    id: "L12",
    courseId: "C03",
    title: "Giới thiệu HTML & cấu trúc trang",
    completed: false,
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    content:
      "HTML là ngôn ngữ đánh dấu. Bài này học cấu trúc: doctype, html, head, body và ý nghĩa semantic.",
    resources: [
      { name: "HTML Basics (PDF)", url: "/files/12.pdf" },
      
    ],
  },
  {
    id: "L13",
    courseId: "C03",
    title: "Thẻ văn bản & danh sách",
    completed: false,
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    content:
      "Học h1-h6, p, strong/em, block/inline và ul/ol/li. Thực hành tạo bài viết đơn giản.",
    resources: [
      { name: "Text & List Exercise (PDF)", url: "/files/13.pdf" },
    ],
  },
  {
    id: "L14",
    courseId: "C03",
    title: "Link, Image, Table",
    completed: false,
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    content:
      "Thực hành a, img, path ảnh, bảng table/thead/tbody/tr/td. Lưu ý alt, accessibility cơ bản.",
    resources: [
      { name: "Links/Images/Tables (PDF)", url: "/files/14.pdf" },
      
    ],
  },
  {
    id: "L15",
    courseId: "C03",
    title: "Form cơ bản",
    completed: false,
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    content:
      "input, textarea, select, label, button và submit. Thực hành form đăng ký + validate cơ bản.",
    resources: [
      { name: "HTML Form Exercise (PDF)", url: "/files/15.pdf" },
    ],
  },

  // =========================
  // C04 - CSS Cơ bản
  // =========================
  {
    id: "L16",
    courseId: "C04",
    title: "Giới thiệu CSS & selector",
    completed: false,
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
    content:
      "Cách nhúng CSS, selector cơ bản (class, id), độ ưu tiên (specificity) và reset/normalize.",
    resources: [
      { name: "CSS Selectors (PDF)", url: "/files/16.pdf" },
    ],
  },
  {
    id: "L17",
    courseId: "C04",
    title: "Box model",
    completed: false,
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
    content:
      "Hiểu margin, border, padding, content. Thực hành canh layout bằng box model và debug bằng devtools.",
    resources: [
      { name: "Box Model Practice (PDF)", url: "/files/17.pdf" },
     
    ],
  },
  {
    id: "L18",
    courseId: "C04",
    title: "Flexbox",
    completed: false,
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
    content:
      "Cách dùng display:flex, justify-content, align-items, gap, wrap. Thực hành layout card/grid đơn giản.",
    resources: [
      { name: "Flexbox Cheatsheet (PDF)", url: "/files/18.pdf" },
    ],
  },
  {
    id: "L19",
    courseId: "C04",
    title: "Responsive cơ bản",
    completed: false,
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4",
    content:
      "Media query, breakpoint, tư duy mobile-first. Thực hành responsive trang landing đơn giản.",
    resources: [
      { name: "Responsive Guide (PDF)", url: "/files/19.pdf" },
      
    ],
  },

  // =========================
  // C05 - JavaScript Nâng Cao
  // =========================
  {
    id: "L20",
    courseId: "C05",
    title: "Scope, Closure, Hoisting",
    completed: false,
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/VolkswagenGTIReview.mp4",
    content:
      "Nắm vững lexical scope, closure, hoisting, let/const/var. Đây là nền tảng để hiểu code JS nâng cao.",
    resources: [
      { name: "JS Advanced Notes (PDF)", url: "/files/20.pdf" },
      
    ],
  },
  {
    id: "L21",
    courseId: "C05",
    title: "Async: Promise, async/await",
    completed: false,
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    content:
      "Hiểu callback -> promise -> async/await. Thực hành fetch API và xử lý lỗi try/catch đúng chuẩn.",
    resources: [
      { name: "Async/Await Guide (PDF)", url: "/files/21.pdf" },
      
    ],
  },
  {
    id: "L22",
    courseId: "C05",
    title: "Array methods nâng cao",
    completed: false,
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    content:
      "map/filter/reduce/some/every/find. Thực hành xử lý danh sách sản phẩm, giỏ hàng và thống kê.",
    resources: [
      { name: "Array Methods (PDF)", url: "/files/22.pdf" },
    ],
  },
  {
    id: "L23",
    courseId: "C05",
    title: "OOP & Prototype",
    completed: false,
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
    content:
      "Prototype chain, class, this, bind/call/apply. Hiểu cách JS hoạt động phía dưới class syntax.",
    resources: [
      { name: "OOP in JS (PDF)", url: "/files/23.pdf" },
      
    ],
  },
];




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
  {
    courseId: "C03",
    title: "Bài kiểm tra cuối khóa: HTML cơ bản",
    questions: [
      {
        id: 1,
        question: "Thẻ nào dùng để tạo liên kết?",
        options: ["<link>", "<a>", "<href>", "<url>"],
        correct: 1,
        explanation: "Thẻ <a> dùng để tạo hyperlink."
      },
      {
        id: 2,
        question: "Thuộc tính nào bắt buộc của thẻ <img> để chỉ đường dẫn ảnh?",
        options: ["src", "href", "link", "path"],
        correct: 0,
        explanation: "src là thuộc tính chỉ nguồn ảnh."
      },
    ],
  },
  {
    courseId: "C04",
    title: "Bài kiểm tra cuối khóa: CSS cơ bản",
    questions: [
      {
        id: 1,
        question: "Thuộc tính nào dùng để đổi màu chữ?",
        options: ["background-color", "font-style", "color", "text-color"],
        correct: 2,
        explanation: "color dùng để đổi màu chữ."
      },
      {
        id: 2,
        question: "Flexbox dùng để làm gì?",
        options: [
          "Tạo animation",
          "Bố cục linh hoạt theo trục",
          "Tạo table",
          "Tạo font"
        ],
        correct: 1,
        explanation: "Flexbox là mô hình layout linh hoạt theo trục."
      },
    ],
  },
  {
    courseId: "C05",
    title: "Bài kiểm tra cuối khóa: Javascript nâng cao",
    questions: [
      {
        id: 1,
        question: "Async/Await là cú pháp giúp làm gì?",
        options: [
          "Chạy code nhanh hơn",
          "Viết code bất đồng bộ dễ đọc hơn",
          "Tạo UI",
          "Tạo CSS"
        ],
        correct: 1,
        explanation: "Async/Await giúp xử lý bất đồng bộ dễ đọc, giống code đồng bộ."
      },
      {
        id: 2,
        question: "Promise có mấy trạng thái chính?",
        options: ["1", "2", "3", "4"],
        correct: 2,
        explanation: "Promise có 3 trạng thái: pending, fulfilled, rejected."
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
  { userId: 1, courseId: "C03", progress: 0 },
  { userId: 1, courseId: "C04", progress: 0 },
  { userId: 1, courseId: "C05", progress: 0 },

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
