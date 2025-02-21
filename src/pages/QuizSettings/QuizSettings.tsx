
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const QuizSettings: React.FC = () => {
  const navigate = useNavigate();

  // State with TypeScript types
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [timer, setTimer] = useState<number>(30);
  const [points, setPoints] = useState<number>(1);

  // Save settings to sessionStorage & Navigate to Add Questions page
  const saveSettings = () => {
    sessionStorage.setItem(
      "quizDetails",
      JSON.stringify({ title, description, timer, pointsPerQuestion: points })
    );
    navigate("/quiz-questions");
  };

  //Onpage load, check for quizDetails in sessionStorage and set the state
  useEffect(() => {
    const quizDetails = JSON.parse(sessionStorage.getItem("quizDetails") as string) || {};
    setTitle(quizDetails.title || "");
    setDescription(quizDetails.description || "");
    setTimer(quizDetails.timer || 30);
    setPoints(quizDetails.pointsPerQuestion || 1);
  }, []);

  return (
    <div className="min-h-screen flex flex-col md:bg-gray-100">
      {/* Navbar */}
      <div className="flex justify-between items-center bg-white shadow-md p-4">
        <h2 className="text-sm lg:text-lg font-bold text-black flex items-center gap-1">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-gear" viewBox="0 0 16 16">
                <path d="M8 4.754a3.246 3.246 0 1 0 0 6.492 3.246 3.246 0 0 0 0-6.492M5.754 8a2.246 2.246 0 1 1 4.492 0 2.246 2.246 0 0 1-4.492 0"/>
                <path d="M9.796 1.343c-.527-1.79-3.065-1.79-3.592 0l-.094.319a.873.873 0 0 1-1.255.52l-.292-.16c-1.64-.892-3.433.902-2.54 2.541l.159.292a.873.873 0 0 1-.52 1.255l-.319.094c-1.79.527-1.79 3.065 0 3.592l.319.094a.873.873 0 0 1 .52 1.255l-.16.292c-.892 1.64.901 3.434 2.541 2.54l.292-.159a.873.873 0 0 1 1.255.52l.094.319c.527 1.79 3.065 1.79 3.592 0l.094-.319a.873.873 0 0 1 1.255-.52l.292.16c1.64.893 3.434-.902 2.54-2.541l-.159-.292a.873.873 0 0 1 .52-1.255l.319-.094c1.79-.527 1.79-3.065 0-3.592l-.319-.094a.873.873 0 0 1-.52-1.255l.16-.292c.893-1.64-.902-3.433-2.541-2.54l-.292.159a.873.873 0 0 1-1.255-.52zm-2.633.283c.246-.835 1.428-.835 1.674 0l.094.319a1.873 1.873 0 0 0 2.693 1.115l.291-.16c.764-.415 1.6.42 1.184 1.185l-.159.292a1.873 1.873 0 0 0 1.116 2.692l.318.094c.835.246.835 1.428 0 1.674l-.319.094a1.873 1.873 0 0 0-1.115 2.693l.16.291c.415.764-.42 1.6-1.185 1.184l-.291-.159a1.873 1.873 0 0 0-2.693 1.116l-.094.318c-.246.835-1.428.835-1.674 0l-.094-.319a1.873 1.873 0 0 0-2.692-1.115l-.292.16c-.764.415-1.6-.42-1.184-1.185l.159-.291A1.873 1.873 0 0 0 1.945 8.93l-.319-.094c-.835-.246-.835-1.428 0-1.674l.319-.094A1.873 1.873 0 0 0 3.06 4.377l-.16-.292c-.415-.764.42-1.6 1.185-1.184l.292.159a1.873 1.873 0 0 0 2.692-1.115z"/>
              </svg>
          <span>IQ Settings</span> 
        </h2>
        <div className="space-x-1 md:space-x-4" >
          <button
            className="text-sm lg:text-base text-[#5a0b4d] border px-3 py-1 rounded hover:bg-gray-200"
            onClick={() => navigate("/dashboard/home")}
          >
            Cancel
          </button>
          <button
            onClick={saveSettings}
            className="bg-[#5a0b4d] text-sm lg:text-base text-white px-4 py-2 rounded"
          >
            Add Questions
          </button>
        </div>
      </div>

      {/* Sidebar & Form Container */}
      <div className="flex flex-col sm:flex-row mt-5 md:mt-2 gap-5 h-[90vh]">
        {/* Sidebar */}
        <div className="hidden sm:block w-1/4 p-4 bg-white">
          <h3 className="text-black font-semibold border-l-4 border-[#5a0b4d] pl-2 py-2">
            Basic Information
          </h3>
        </div>

        {/* Form */}
        <div className="flex-1 p-4 sm:p-8 bg-white md:shadow-md rounded-lg h-full md:h-fit">
          {/* Title */}
          <label className="block font-medium text-sm">
            Title
            <p className="text-sm text-gray-500">Enter a Title for your IQ quiz</p>
            <input
              type="text"
              placeholder="Quiz Title"
              className="border p-2 w-full mt-1 rounded focus:outline-none"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </label>

          {/* Description */}
          <label className="block font-medium text-sm mt-4">
            Description (Optional)
            <p className="text-sm text-gray-500">Provide a short description of your IQ</p>
            <textarea
              placeholder="Enter description..."
              className="border p-2 w-full mt-1 rounded h-24 focus:outline-none"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </label>

          {/* Timer & Points */}
          <div className="flex flex-col sm:flex-row sm:space-x-4 mt-6 text-sm">
            {/* Timer */}
            <label className="flex-1 font-medium">
              Timer (Minutes)
              <input
                type="number"
                min="10"
                max="600"
                className="border p-2 w-full mt-1 rounded"
                value={timer}
                onChange={(e) => setTimer(Number(e.target.value))}
              />
            </label>

            {/* Points per Question */}
            <label className="flex-1 font-medium mt-4 sm:mt-0">
              Points per Question
              <input
                type="number"
                min="1"
                max="10"
                className="border p-2 w-full mt-1 rounded"
                value={points}
                onChange={(e) => setPoints(Number(e.target.value))}
              />
            </label>
          </div>

          {/* Add Questions Button */}
          <div className="mt-6 flex justify-end">
            <button
              onClick={saveSettings}
              className="bg-[#5a0b4d] text-white px-6 py-2 rounded"
            >
              Add Questions
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizSettings;
