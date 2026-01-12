"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Headers from "@/components/header";
export default function ChapterQuizPage() {
  const { id, quizId } = useParams();
  const router = useRouter();
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [result, setResult] = useState(null);
  
  // 📘 Lấy quiz theo chương
  useEffect(() => {
    console.log(id, quizId);
    fetch(`http://localhost:8080/api/courses/${id}/quiz/${quizId}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        console.log('Quiz data received:', data);
        if (!data.questions || !Array.isArray(data.questions)) {
          console.error('Invalid quiz data structure:', data);
          alert('Dữ liệu quiz không hợp lệ');
          return;
        }
        setQuiz(data);
      })
      .catch((error) => {
        console.error('Error fetching quiz:', error);
        alert('Không thể tải quiz. Vui lòng thử lại.');
      });
  }, [id, quizId]);

  // 📘 Cập nhật đáp án
  const handleAnswer = (questionId, answerIndex) => {
    setAnswers((prev) => {
      const updated = [...prev];
      const existing = updated.find((a) => a.questionId === questionId);
      if (existing) existing.answerIndex = answerIndex;
      else updated.push({ questionId, answerIndex });
      return updated;
    });
  };

  // 📘 Nộp bài
  const handleSubmit = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Vui lòng đăng nhập trước khi làm bài!");
      router.push("/logIn");
      return;
    }

    const res = await fetch(
      `http://localhost:8080/api/courses/${id}/quiz/${quizId}/submit`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ answers }),
      }
    );

    const data = await res.json();
    setResult(data);
  };

  if (!quiz || !quiz.questions || !Array.isArray(quiz.questions)) {
    return <p className="p-6">Đang tải bài kiểm tra...</p>;
  }

  // 📘 Nếu đã nộp bài => hiển thị kết quả
  if (result)
    return (

      <div className="p-6 max-w-3xl mx-auto">
        <Headers></Headers>
        <h1 className="text-2xl font-bold mb-4">{quiz.title}</h1>
        <p className="mb-4 text-lg font-semibold text-green-700">
          Điểm của bạn: {result.score} ({result.correctCount}/{result.total} đúng)
        </p>

        {result.details.map((d, i) => (
          <div
            key={i}
            className={`border p-3 mb-3 rounded ${
              d.isCorrect ? "border-green-500" : "border-red-500"
            }`}
          >
            <p className="font-semibold mb-1">{d.question}</p>
            {d.options.map((opt, idx) => (
              <p
                key={idx}
                className={`ml-3 ${
                  idx === d.correctAnswer
                    ? "text-green-600"
                    : idx === d.userAnswer
                    ? "text-red-600"
                    : ""
                }`}
              >
                {idx + 1}. {opt}
              </p>
            ))}
            <p className="text-sm text-gray-500 mt-1">
              💡 {d.explanation}
            </p>
          </div>
        ))}

        <button
          onClick={() => router.push(`/courses/${id}`)}
          className="mt-6 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Quay lại khóa học
        </button>
      </div>
    );

  // 📘 Nếu chưa nộp => hiển thị quiz
  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">{quiz.title}</h1>

      {quiz.questions.map((q) => (
        <div key={q.id} className="mb-6">
          <p className="font-semibold mb-2">{q.question}</p>
          {q.options.map((opt, idx) => (
            <label key={idx} className="block cursor-pointer">
              <input
                type="radio"
                name={`q${q.id}`}
                onChange={() => handleAnswer(q.id, idx)}
                className="mr-2"
              />
              {opt}
            </label>
          ))}
        </div>
      ))}

      <button
        onClick={handleSubmit}
        className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
      >
        Nộp bài
      </button>
    </div>
  );
}
