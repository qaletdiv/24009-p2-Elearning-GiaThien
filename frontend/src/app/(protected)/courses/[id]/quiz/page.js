"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Headers from "@/components/header";
export default function CourseQuizPage() {
  const { id } = useParams();
  const router = useRouter();
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [result, setResult] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:8080/api/courses/${id}/quiz`)
      .then(res => res.json())
      .then(setQuiz)
      .catch(console.error);
  }, [id]);

  const handleAnswer = (questionId, answerIndex) => {
    setAnswers(prev => {
      const updated = [...prev];
      const existing = updated.find(a => a.questionId === questionId);
      if (existing) existing.answerIndex = answerIndex;
      else updated.push({ questionId, answerIndex });
      return updated;
    });
  };

  const handleSubmit = async () => {
    const token = localStorage.getItem("token");
    const res = await fetch(`http://localhost:8080/api/courses/${id}/quiz/submit`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ answers }),
    });
    const data = await res.json();
    setResult(data);
  };

  if (!quiz) return <p className="p-6">Đang tải bài kiểm tra...</p>;

  if (result)
    return (
      <div className="p-6 max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">{quiz.title}</h1>
        <p>Điểm: {result.score} ({result.correctCount}/{result.total} đúng)</p>
        {result.details.map((d, i) => (
          <div key={i} className="border p-2 mt-3 rounded">
            <p className="font-semibold">{d.question}</p>
            {d.options.map((opt, idx) => (
              <p
                key={idx}
                className={`ml-3 ${idx === d.correctAnswer ? "text-green-600" :
                  idx === d.userAnswer ? "text-red-600" : ""}`}
              >
                {idx + 1}. {opt}
              </p>
            ))}
            <p className="text-sm text-gray-500 mt-1">💡 {d.explanation}</p>
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

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <Headers></Headers>
      <h1 className="text-2xl font-bold mb-6">{quiz.title}</h1>
      {quiz.questions.map(q => (
        <div key={q.id} className="mb-6">
          <p className="font-semibold mb-2">{q.question}</p>
          {q.options.map((opt, idx) => (
            <label key={idx} className="block">
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
