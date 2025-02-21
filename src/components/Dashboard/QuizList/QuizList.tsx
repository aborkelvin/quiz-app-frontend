import { useState, useEffect } from "react";
import { baseUrl } from "../../../utils";

const QuizList = ({ token, userRole }:{token:any, userRole:any}) => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${baseUrl}/quiz`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data)
        setQuizzes(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [token]);

  return (
    <div className="w-full max-w-lg text-center">
      <h2 className="font-bold text-2xl mb-4">Available Quizzes</h2>

      {loading ? (
        <p className="text-gray-500">Loading quizzes...</p>
      ) : quizzes.length === 0 ? (
        <p className="text-gray-500">No quizzes available at this time.</p>
      ) : (
        quizzes.map((quiz:any) => (
          <div
            key={quiz._id}
            className="border p-3 rounded-md mt-3 bg-gray-100 hover:bg-gray-200 cursor-pointer"
            onClick={() => (window.location.href = `take-quiz.html?quizId=${quiz.id}`)}
          >
            <strong>{quiz.title}</strong> - {quiz.description}
          </div>
        ))
      )}

      {userRole === "creator" && (
        <button
          onClick={() => (window.location.href = "/create-quiz")}
          className="bg-secondary text-white px-5 py-2 w-full mt-4 rounded-md hover:bg-highlight"
        >
          Create Your Own Quiz
        </button>
      )}
    </div>
  );
};

export default QuizList;
