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
    image: "/images/01.jpg",
    description: "Khóa học React cho người mới bắt đầu",
    target: "Nắm được component, props/state, useEffect và làm được dự án nhỏ",
    category: "Công nghệ",
    level: "Cơ bản",
    price: 0,
  },
  {
    id: "C02",
    title: "Next.js Nâng Cao",
    image: "/images/02.jpg",
    description: "Xây dựng web hiện đại với Next.js App Router",
    target: "Biết protected routes, data fetching, tối ưu performance, deploy",
    category: "Công nghệ",
    level: "Nâng cao",
    price: 400,
  },
  {
    id: "C03",
    title: "HTML Cơ Bản",
    image: "/images/03.jpg",
    description: "Nền tảng HTML từ số 0",
    target: "Biết cấu trúc trang, semantic, form, table và best practices",
    category: "Công nghệ",
    level: "Cơ bản",
    price: 200,
  },
  {
    id: "C04",
    title: "CSS Cơ Bản",
    image: "/images/04.jpg",
    description: "CSS cho người mới bắt đầu",
    target: "Nắm box model, flexbox, responsive cơ bản",
    category: "Công nghệ",
    level: "Cơ bản",
    price: 200,
  },
  {
    id: "C05",
    title: "JavaScript Nâng Cao",
    image: "/images/05.jpg",
    description: "JS nâng cao: closure, async/await, prototype, patterns",
    target: "Làm chủ async, hiểu scope/closure, viết JS sạch và mạnh",
    category: "Công nghệ",
    level: "Nâng cao",
    price: 400,
  },

  // ===== Thiết kế =====
  {
    id: "C06",
    title: "Photoshop Cơ Bản",
    image: "/images/06.jpg",
    description: "Từ cơ bản đến chỉnh ảnh, ghép ảnh, retouch",
    target: "Làm được banner cơ bản, chỉnh màu, cắt ghép, export đúng chuẩn",
    category: "Thiết kế",
    level: "Cơ bản",
    price: 300,
  },
  {
    id: "C07",
    title: "Illustrator Thiết Kế Vector",
    image: "/images/07.jpg",
    description: "Thiết kế vector & in ấn (logo, decal, tem nhãn)",
    target: "Làm chủ pen tool, shape, xuất file in ấn chuẩn",
    category: "Thiết kế",
    level: "Trung cấp",
    price: 450,
  },
  {
    id: "C08",
    title: "UI/UX cho người mới",
    image: "/images/08.jpg",
    description: "Tư duy UI/UX + thực hành Figma",
    target: "Làm được wireframe, prototype, design system cơ bản",
    category: "Thiết kế",
    level: "Cơ bản",
    price: 350,
  },

  // ===== Marketing =====
  {
    id: "C09",
    title: "Content Marketing Thực chiến",
    image: "/images/09.jpg",
    description: "Viết nội dung bán hàng, xây kênh, lên kế hoạch content",
    target: "Tự làm plan content 30 ngày, viết caption/ads hiệu quả",
    category: "Marketing",
    level: "Trung cấp",
    price: 300,
  },
  {
    id: "C10",
    title: "Chạy quảng cáo Facebook Ads",
    image: "/images/10.jpg",
    description: "Từ cơ bản đến tối ưu chiến dịch",
    target: "Biết target, setup BM, tối ưu CPM/CPC, đọc chỉ số",
    category: "Marketing",
    level: "Nâng cao",
    price: 500,
  },

  // ===== Ngoại ngữ =====
  {
    id: "C11",
    title: "Tiếng Anh giao tiếp cho người đi làm",
    image: "/images/11.jpg",
    description: "Giao tiếp công sở, email, meeting",
    target: "Tự tin giao tiếp trong công việc và viết email cơ bản",
    category: "Ngoại ngữ",
    level: "Cơ bản",
    price: 250,
  },
  {
    id: "C12",
    title: "Tiếng Nhật N5 nền tảng",
    image: "/images/12.jpg",
    description: "Hiragana, Katakana, mẫu câu căn bản",
    target: "Nắm nền tảng N5, học tiếp N4 dễ dàng",
    category: "Ngoại ngữ",
    level: "Cơ bản",
    price: 250,
  },

  // ===== Kinh doanh / Kỹ năng =====
  {
    id: "C13",
    title: "Bán hàng & chốt đơn",
    image: "/images/13.jpg",
    description: "Kỹ năng tư vấn, xử lý từ chối, chốt đơn",
    target: "Tăng tỷ lệ chốt, biết kịch bản bán hàng",
    category: "Kinh doanh",
    level: "Trung cấp",
    price: 350,
  },
  {
    id: "C14",
    title: "Quản lý thời gian hiệu quả",
    image: "/images/14.jpg",
    description: "Lập kế hoạch, ưu tiên, chống trì hoãn",
    target: "Biết dùng Eisenhower/Time-blocking và duy trì thói quen",
    category: "Kỹ năng",
    level: "Cơ bản",
    price: 150,
  },
];


let lessons = [
  // =========================
  // C01 - React Cơ Bản
  // =========================
  {
    id: "L01",
    courseId: "C01",
    title: "Giới thiệu React",
    
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
    
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
    content:
      "Prototype chain, class, this, bind/call/apply. Hiểu cách JS hoạt động phía dưới class syntax.",
    resources: [
      { name: "OOP in JS (PDF)", url: "/files/23.pdf" },

    ],
  },
  // =========================
  // C06 - Photoshop Cơ Bản
  // =========================
  {
    id: "L24",
    courseId: "C06",
    title: "Giới thiệu Photoshop & giao diện",
    
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    content:
      "Làm quen workspace, panel, layer, thao tác cơ bản, cách lưu file PSD/JPG/PNG đúng chuẩn.",
    resources: [{ name: "Photoshop Basics (PDF)", url: "/files/24.pdf" }],
  },
  {
    id: "L25",
    courseId: "C06",
    title: "Cắt ghép ảnh với Selection",
    
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    content:
      "Học marquee/lasso/quick selection, refine edge, mask để cắt ghép sạch không bị viền.",
    resources: [{ name: "Selection & Mask (PDF)", url: "/files/25.pdf" }],
  },
  {
    id: "L26",
    courseId: "C06",
    title: "Chỉnh màu cơ bản & blend",
    
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    content:
      "Curves/Levels/HSL, color balance, blend mode. Tạo tone ảnh và phối màu cơ bản.",
    resources: [{ name: "Color Correction (PDF)", url: "/files/26.pdf" }],
  },
  {
    id: "L27",
    courseId: "C06",
    title: "Export ảnh đúng chuẩn",
    
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    content:
      "Export PNG/JPG, tối ưu dung lượng, kích thước, DPI, chuẩn đăng web & in ấn.",
    resources: [{ name: "Export Guide (PDF)", url: "/files/27.pdf" }],
  },

  // =========================
  // C07 - Illustrator Thiết Kế Vector
  // =========================
  {
    id: "L28",
    courseId: "C07",
    title: "Giao diện Illustrator & công cụ cơ bản",
    
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
    content:
      "Artboard, selection, align, stroke/fill. Làm quen hệ vector và cách quản lý layer.",
    resources: [{ name: "AI Basics (PDF)", url: "/files/28.pdf" }],
  },
  {
    id: "L29",
    courseId: "C07",
    title: "Pen Tool & vẽ logo đơn giản",
    
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
    content:
      "Pen tool, anchor/handle, curve mượt. Thực hành vẽ logo tối giản và icon.",
    resources: [{ name: "Pen Tool Practice (PDF)", url: "/files/29.pdf" }],
  },
  {
    id: "L30",
    courseId: "C07",
    title: "Màu sắc, gradient, pattern",
    
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
    content:
      "Swatches, gradient, pattern cơ bản. Tạo style tem nhãn/decal in ấn.",
    resources: [{ name: "Color & Pattern (PDF)", url: "/files/30.pdf" }],
  },
  {
    id: "L31",
    courseId: "C07",
    title: "Xuất file in ấn & cắt decal",
    
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4",
    content:
      "Xuất AI/PDF, outline font, bleed/crop marks, chuẩn in & die-cut cơ bản.",
    resources: [{ name: "Print & Die-cut (PDF)", url: "/files/31.pdf" }],
  },

  // =========================
  // C08 - UI/UX cho người mới
  // =========================
  {
    id: "L32",
    courseId: "C08",
    title: "UI/UX là gì? Quy trình thiết kế",
    
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/VolkswagenGTIReview.mp4",
    content:
      "Hiểu UI vs UX, user journey, pain points, và quy trình từ research → wireframe → UI.",
    resources: [{ name: "UIUX Overview (PDF)", url: "/files/32.pdf" }],
  },
  {
    id: "L33",
    courseId: "C08",
    title: "Wireframe & bố cục",
    
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    content:
      "Lưới (grid), spacing, hierarchy. Tạo wireframe cho 1 trang sản phẩm/courses.",
    resources: [{ name: "Wireframe Guide (PDF)", url: "/files/33.pdf" }],
  },
  {
    id: "L34",
    courseId: "C08",
    title: "Figma cơ bản & component",
    
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    content:
      "Frame, auto-layout, component/variant. Tạo button/input/card dùng lại.",
    resources: [{ name: "Figma Basics (PDF)", url: "/files/34.pdf" }],
  },
  {
    id: "L35",
    courseId: "C08",
    title: "Prototype & handoff",
    
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    content:
      "Link prototype, flow, chia sẻ handoff cho dev: spacing, color, export asset.",
    resources: [{ name: "Prototype & Handoff (PDF)", url: "/files/35.pdf" }],
  },

  // =========================
  // C09 - Content Marketing
  // =========================
  {
    id: "L36",
    courseId: "C09",
    title: "Content là gì? Chân dung khách hàng",
    
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    content:
      "Xác định tệp khách hàng, insight, mục tiêu nội dung và KPI cơ bản.",
    resources: [{ name: "Customer Persona (PDF)", url: "/files/36.pdf" }],
  },
  {
    id: "L37",
    courseId: "C09",
    title: "Framework viết bài (AIDA, PAS)",
    
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
    content:
      "Viết caption/bài bán hàng theo AIDA, PAS; luyện headline, CTA rõ ràng.",
    resources: [{ name: "Copywriting Frameworks (PDF)", url: "/files/37.pdf" }],
  },
  {
    id: "L38",
    courseId: "C09",
    title: "Lập kế hoạch content 30 ngày",
    
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
    content:
      "Xây content pillar, lịch đăng, phân bổ định dạng: video, carousel, blog, reels.",
    resources: [{ name: "30-day Plan Template (PDF)", url: "/files/38.pdf" }],
  },
  {
    id: "L39",
    courseId: "C09",
    title: "Đo lường & tối ưu",
    
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
    content:
      "Đọc chỉ số reach/engagement/click, A/B headline và tối ưu nội dung theo dữ liệu.",
    resources: [{ name: "Metrics & Optimization (PDF)", url: "/files/39.pdf" }],
  },

  // =========================
  // C10 - Facebook Ads
  // =========================
  {
    id: "L40",
    courseId: "C10",
    title: "Tổng quan Ads & cấu trúc chiến dịch",
    
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4",
    content:
      "Campaign/Adset/Ad, mục tiêu, pixel cơ bản và nguyên tắc setup sạch.",
    resources: [{ name: "FB Ads Overview (PDF)", url: "/files/40.pdf" }],
  },
  {
    id: "L41",
    courseId: "C10",
    title: "Targeting & creative",
    
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/VolkswagenGTIReview.mp4",
    content:
      "Target interest/lookalike, angle nội dung, tối ưu ảnh/video quảng cáo.",
    resources: [{ name: "Targeting & Creative (PDF)", url: "/files/41.pdf" }],
  },
  {
    id: "L42",
    courseId: "C10",
    title: "Tối ưu chi phí (CPC/CPM/CPA)",
    
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    content:
      "Đọc chỉ số, scaling, rule tắt/mở ads, xử lý học máy và phân bổ ngân sách.",
    resources: [{ name: "Optimization Guide (PDF)", url: "/files/42.pdf" }],
  },
  {
    id: "L43",
    courseId: "C10",
    title: "Case study & checklist chạy ads",
    
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    content:
      "Checklist trước khi chạy, lỗi thường gặp, case thực tế và cách tối ưu theo ngành.",
    resources: [{ name: "Ads Checklist (PDF)", url: "/files/43.pdf" }],
  },

  // =========================
  // C11 - English for Work
  // =========================
  {
    id: "L44",
    courseId: "C11",
    title: "Chào hỏi & giao tiếp công sở",
    
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    content:
      "Mẫu câu chào hỏi, small talk, giới thiệu bản thân và cách phản hồi lịch sự.",
    resources: [{ name: "Office Phrases (PDF)", url: "/files/44.pdf" }],
  },
  {
    id: "L45",
    courseId: "C11",
    title: "Email cơ bản",
    
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    content:
      "Cấu trúc email, subject, opening/closing, tone lịch sự, mẫu email hay dùng.",
    resources: [{ name: "Email Templates (PDF)", url: "/files/45.pdf" }],
  },
  {
    id: "L46",
    courseId: "C11",
    title: "Meeting & trình bày ý kiến",
    
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
    content:
      "Cách nêu ý kiến, đồng ý/không đồng ý, hỏi lại, tóm tắt và action items.",
    resources: [{ name: "Meeting Phrases (PDF)", url: "/files/46.pdf" }],
  },
  {
    id: "L47",
    courseId: "C11",
    title: "Thực hành tình huống",
    
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
    content:
      "Role-play: trao đổi deadline, báo cáo tiến độ, xin nghỉ, xử lý sự cố.",
    resources: [{ name: "Role-play Scenarios (PDF)", url: "/files/47.pdf" }],
  },

  // =========================
  // C12 - Japanese N5
  // =========================
  {
    id: "L48",
    courseId: "C12",
    title: "Hiragana & phát âm",
    
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
    content:
      "Bảng Hiragana, quy tắc phát âm, trường âm, âm ngắt. Luyện đọc chuẩn.",
    resources: [{ name: "Hiragana Sheet (PDF)", url: "/files/48.pdf" }],
  },
  {
    id: "L49",
    courseId: "C12",
    title: "Katakana & từ mượn",
    
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4",
    content:
      "Katakana, cách đọc từ mượn, dấu kéo dài, quy tắc ghép âm.",
    resources: [{ name: "Katakana Sheet (PDF)", url: "/files/49.pdf" }],
  },
  {
    id: "L50",
    courseId: "C12",
    title: "Mẫu câu N5 thông dụng",
    
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/VolkswagenGTIReview.mp4",
    content:
      "です/ます, これ/それ/あれ, trợ từ は/が/を/に/で. Thực hành hội thoại ngắn.",
    resources: [{ name: "N5 Patterns (PDF)", url: "/files/50.pdf" }],
  },
  {
    id: "L51",
    courseId: "C12",
    title: "Từ vựng & luyện đề mini",
    
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    content:
      "Từ vựng chủ đề: gia đình, thời gian, mua sắm. Mini test luyện phản xạ.",
    resources: [{ name: "N5 Vocab + Mini Test (PDF)", url: "/files/51.pdf" }],
  },

  // =========================
  // C13 - Sales & Closing
  // =========================
  {
    id: "L52",
    courseId: "C13",
    title: "Tư duy bán hàng & quy trình tư vấn",
    
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    content:
      "Hiểu pain-point, quy trình tư vấn từ chào hỏi → khai thác nhu cầu → đề xuất.",
    resources: [{ name: "Sales Process (PDF)", url: "/files/52.pdf" }],
  },
  {
    id: "L53",
    courseId: "C13",
    title: "Kịch bản tư vấn & hỏi đúng",
    
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    content:
      "Kỹ thuật đặt câu hỏi (SPIN), ghi nhận nhu cầu và tạo niềm tin.",
    resources: [{ name: "SPIN Questions (PDF)", url: "/files/53.pdf" }],
  },
  {
    id: "L54",
    courseId: "C13",
    title: "Xử lý từ chối",
    
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    content:
      "Phản hồi các từ chối: đắt, chưa cần, sợ rủi ro. Kỹ thuật phản biện mềm.",
    resources: [{ name: "Objection Handling (PDF)", url: "/files/54.pdf" }],
  },
  {
    id: "L55",
    courseId: "C13",
    title: "Chốt đơn & chăm sóc sau bán",
    
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
    content:
      "Kỹ thuật chốt, tạo urgency đúng cách, chăm sóc sau bán để upsell/referral.",
    resources: [{ name: "Closing Checklist (PDF)", url: "/files/55.pdf" }],
  },

  // =========================
  // C14 - Time Management
  // =========================
  {
    id: "L56",
    courseId: "C14",
    title: "Quản lý thời gian là gì?",
    
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
    content:
      "Xác định mục tiêu, đo thời gian thực tế, nhận diện việc quan trọng.",
    resources: [{ name: "Time Mgmt Basics (PDF)", url: "/files/56.pdf" }],
  },
  {
    id: "L57",
    courseId: "C14",
    title: "Ma trận Eisenhower",
    
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
    content:
      "Phân loại việc quan trọng/khẩn cấp. Cách giảm việc gấp và tăng việc quan trọng.",
    resources: [{ name: "Eisenhower Matrix (PDF)", url: "/files/57.pdf" }],
  },
  {
    id: "L58",
    courseId: "C14",
    title: "Time-blocking & Pomodoro",
    
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4",
    content:
      "Lập lịch theo block, Pomodoro, deep work. Cách tránh phân tâm.",
    resources: [{ name: "Time Blocking (PDF)", url: "/files/58.pdf" }],
  },
  {
    id: "L59",
    courseId: "C14",
    title: "Chống trì hoãn & duy trì thói quen",
    
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/VolkswagenGTIReview.mp4",
    content:
      "Kỹ thuật 2 phút, thói quen nhỏ, tracking và review tuần để bền vững.",
    resources: [{ name: "Anti-Procrastination (PDF)", url: "/files/59.pdf" }],
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
  {
    courseId: "C06",
    title: "Bài kiểm tra cuối khóa: Photoshop Cơ Bản",
    questions: [
      {
        id: 1,
        question: "Công cụ nào phù hợp nhất để cắt đối tượng và làm mượt viền?",
        options: ["Brush", "Quick Selection + Mask", "Eraser", "Crop Tool"],
        correct: 1,
        explanation: "Quick Selection kết hợp Mask giúp cắt sạch và chỉnh viền tốt."
      },
      {
        id: 2,
        question: "Định dạng nào phù hợp để giữ nền trong suốt?",
        options: ["JPG", "PNG", "MP4", "DOCX"],
        correct: 1,
        explanation: "PNG hỗ trợ alpha transparency."
      },
    ],
  },
  {
    courseId: "C07",
    title: "Bài kiểm tra cuối khóa: Illustrator Vector",
    questions: [
      {
        id: 1,
        question: "Công cụ nào dùng để vẽ đường cong vector chính xác?",
        options: ["Pen Tool", "Eraser", "Hand Tool", "Type Tool"],
        correct: 0,
        explanation: "Pen Tool là công cụ chuẩn để vẽ path vector."
      },
      {
        id: 2,
        question: "Để in ấn an toàn, thường cần làm gì với font?",
        options: ["Giữ nguyên", "Outline/Convert to curves", "Xóa font", "Đổi sang PNG"],
        correct: 1,
        explanation: "Outline font để tránh lỗi thiếu font khi in."
      },
    ],
  },
  {
    courseId: "C08",
    title: "Bài kiểm tra cuối khóa: UI/UX cho người mới",
    questions: [
      {
        id: 1,
        question: "Wireframe là gì?",
        options: ["Bản thiết kế màu hoàn chỉnh", "Bản phác bố cục", "Code giao diện", "Bảng dữ liệu"],
        correct: 1,
        explanation: "Wireframe là bản phác thảo bố cục và cấu trúc."
      },
      {
        id: 2,
        question: "Auto-layout trong Figma giúp gì?",
        options: ["Tăng FPS", "Tự căn chỉnh spacing khi nội dung đổi", "Tạo animation", "Xuất PDF"],
        correct: 1,
        explanation: "Auto-layout giúp layout linh hoạt theo nội dung."
      },
    ],
  },
  {
    courseId: "C09",
    title: "Bài kiểm tra cuối khóa: Content Marketing",
    questions: [
      {
        id: 1,
        question: "AIDA gồm những bước nào?",
        options: ["Analyze-Improve-Do-Act", "Attention-Interest-Desire-Action", "Ask-Inform-Deliver-Agree", "None"],
        correct: 1,
        explanation: "AIDA: Attention, Interest, Desire, Action."
      },
      {
        id: 2,
        question: "KPI nào phù hợp để đo hiệu quả bài viết kéo traffic?",
        options: ["Reach", "Click/CTR", "Like", "Comment"],
        correct: 1,
        explanation: "Click/CTR phù hợp để đo kéo traffic."
      },
    ],
  },
  {
    courseId: "C10",
    title: "Bài kiểm tra cuối khóa: Facebook Ads",
    questions: [
      {
        id: 1,
        question: "Trong cấu trúc quảng cáo, nơi đặt target thường là?",
        options: ["Campaign", "Adset", "Ad", "Page"],
        correct: 1,
        explanation: "Targeting thường nằm ở cấp Adset."
      },
      {
        id: 2,
        question: "CPA là viết tắt của?",
        options: ["Cost Per Action", "Click Per Ads", "Cost Per Audience", "Campaign Performance Ads"],
        correct: 0,
        explanation: "CPA = Cost Per Action."
      },
    ],
  },
  {
    courseId: "C11",
    title: "Bài kiểm tra cuối khóa: English for Work",
    questions: [
      {
        id: 1,
        question: "Trong email lịch sự, câu mở đầu phù hợp là?",
        options: ["Hey bro", "Dear ... / Hello ...", "Yo", "Sup"],
        correct: 1,
        explanation: "Dear/Hello là cách mở đầu lịch sự trong công việc."
      },
      {
        id: 2,
        question: "Trong meeting, câu nào đúng để xin nhắc lại?",
        options: ["Repeat now!", "Could you please repeat that?", "Say again!", "Talk louder!"],
        correct: 1,
        explanation: "Câu lịch sự: Could you please repeat that?"
      },
    ],
  },
  {
    courseId: "C12",
    title: "Bài kiểm tra cuối khóa: Tiếng Nhật N5",
    questions: [
      {
        id: 1,
        question: "Hiragana dùng để làm gì?",
        options: ["Viết số", "Viết từ mượn", "Viết tiếng Nhật cơ bản", "Viết tiếng Anh"],
        correct: 2,
        explanation: "Hiragana dùng cho từ thuần Nhật và ngữ pháp."
      },
      {
        id: 2,
        question: "Trợ từ を thường đi với?",
        options: ["Chủ ngữ", "Tân ngữ", "Địa điểm", "Thời gian"],
        correct: 1,
        explanation: "を thường đánh dấu tân ngữ."
      },
    ],
  },
  {
    courseId: "C13",
    title: "Bài kiểm tra cuối khóa: Bán hàng & Chốt đơn",
    questions: [
      {
        id: 1,
        question: "SPIN là kỹ thuật gì?",
        options: ["Chạy ads", "Đặt câu hỏi khai thác nhu cầu", "Thiết kế UI", "Làm video"],
        correct: 1,
        explanation: "SPIN là kỹ thuật đặt câu hỏi để khai thác nhu cầu."
      },
      {
        id: 2,
        question: "Từ chối 'giá cao' nên xử lý tốt nhất bằng?",
        options: ["Cãi lại khách", "So sánh giá rẻ hơn", "Nhấn mạnh giá trị/benefit", "Bỏ qua"],
        correct: 2,
        explanation: "Tập trung vào giá trị/benefit và chứng minh hiệu quả."
      },
    ],
  },
  {
    courseId: "C14",
    title: "Bài kiểm tra cuối khóa: Quản lý thời gian",
    questions: [
      {
        id: 1,
        question: "Ma trận Eisenhower gồm mấy nhóm chính?",
        options: ["2", "3", "4", "5"],
        correct: 2,
        explanation: "Eisenhower chia 4 nhóm: Quan trọng/khẩn cấp."
      },
      {
        id: 2,
        question: "Pomodoro phổ biến là bao nhiêu phút tập trung?",
        options: ["10", "25", "45", "60"],
        correct: 1,
        explanation: "Pomodoro phổ biến là 25 phút tập trung."
      },
    ],
  },
];

// Liên kết user ↔ khóa học (giả lập)
// progress tính theo % số bài học đã hoàn thành
let userCourses = [
  { userId: 1, courseId: "C01", progress: 0 },
  { userId: 1, courseId: "C02", progress: 0 },
  { userId: 2, courseId: "C02", progress: 0 },
  { userId: 3, courseId: "C01", progress: 0 },
  { userId: 1, courseId: "C03", progress: 0 },
  { userId: 1, courseId: "C04", progress: 0 },
  { userId: 1, courseId: "C05", progress: 0 },

];

let userLessonProgress = {
  
};

const isLessonCompleted = (userId, lessonId) => {
  const set = userLessonProgress[userId];
  return set ? set.has(lessonId) : false;
};

const markLessonCompleted = (userId, lessonId) => {
  if (!userLessonProgress[userId]) userLessonProgress[userId] = new Set();
  userLessonProgress[userId].add(lessonId);
};



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
  },

  isLessonCompleted,
  markLessonCompleted,
  getUserLessonProgress: () => userLessonProgress,
};
