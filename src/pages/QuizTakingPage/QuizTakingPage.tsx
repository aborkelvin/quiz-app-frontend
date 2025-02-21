import  { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { baseUrl } from "../../utils";

const QuizTakingPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  
  // Load questions from session storage or API
  const storedQuestions = JSON.parse(sessionStorage.getItem("previewQuestions") as string) || [];
  const [questions, setQuestions] = useState(storedQuestions);
  // Modal State
  const [showModal, setShowModal] = useState(true);
  const [showConfirmSubmission, setShowConfirmSubmission] = useState(false);
  const [showSubmissionSuccessful, setShowSubmissionSuccessful] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{ questionId: string, selectedOption: string }[]>([]);
  
  const [timeLeft, setTimeLeft] = useState(3600); // Example: 1 hour limit (adjust as needed)

  // Block refresh and navigation away
  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "You have an ongoing quiz. Are you sure you want to leave?";
    };
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  // Block F5 reload
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "F5") {
        event.preventDefault();
        toast.error("You cannot refresh the page during the quiz!");
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Fetch Quiz Data
  const startQuiz = async () => {
    const toastId = toast.loading("Starting quiz...");
    try {
      const startResponse = await fetch(`${baseUrl}/quiz/${id}/start`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      });
      
      const startData = await startResponse.json();
      console.log(startData)
      
      if (!startResponse.ok) {
        toast.error(startData.message || "Failed to start quiz");
        return;
      }
      
      

      const quizResponse = await fetch(`${baseUrl}/quiz/${id}`);
      if (!quizResponse.ok) throw new Error("Failed to fetch quiz data");

      const quizData = await quizResponse.json();
      console.log(quizData)
      // Set quiz questions and timer
      setQuestions(quizData.questions);
      setTimeLeft(quizData.settings.timer * 60); // Convert minutes to seconds

      // Save in sessionStorage
      sessionStorage.setItem("quizQuestions", JSON.stringify(quizData.questions));
      sessionStorage.setItem("quizTimer", JSON.stringify(quizData.settings.timer * 60));
      
      // Close modal
      setShowModal(false);
    } catch (error) {
      toast.error("Error starting quiz. Please try again.");
      console.error(error);
    } finally {
      toast.dismiss(toastId);
    }
  };

  
  /* useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []); */
  
  
  // Timer Countdown
  useEffect(() => {    
    // Alert user at final 5 minutes
    if (timeLeft == 300) {
      toast.error("You have 5 minutes left to complete the quiz!");
    }
    //Automatically submit quiz when time runs out
    if (timeLeft === 0) {
      toast.error("Time's up! Submitting quiz...");
      handleSubmitQuiz();
      return;
    }    
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
      sessionStorage.setItem("quizTimer", JSON.stringify(timeLeft - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleOptionSelect = (questionId: string, option: string) => {
    console.log('Run once')
    setSelectedAnswers((prev) => {
      const existing = prev.find((ans) => ans.questionId === questionId);
      //console.log(existing)
      console.log('I run twice:', option, questionId)
      if (existing) {
        return prev.map((ans) =>
          ans.questionId === questionId ? { ...ans, selectedOption: option } : ans
        );
      }
      return [...prev, { questionId, selectedOption: option }];
    });
  };

  useEffect(() => {
    console.log("Selected Answers:", selectedAnswers);
  }, [selectedAnswers]);

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      toast.success("You have reached the last question.");
    }
  };

  const handleBack = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };


  const [quizResult, setQuizResult] = useState<any>(null);
  
  // Submit Quiz
  const handleSubmitQuiz = async () => {
    if (selectedAnswers.length < questions.length && timeLeft > 0) {
      toast.error("Please answer all questions before submitting.");

      //Show unanswered question numbers
      const unansweredQuestions = questions.filter((q:any) => !selectedAnswers.find((ans) => ans.questionId === q._id));
      const unansweredQuestionNumbers = unansweredQuestions.map((q:any) => questions.indexOf(q) + 1);
      toast.error(`You have not answered questions ${unansweredQuestionNumbers.join(", ")}`);
      return;
    }
    
    console.log("Submitting answers:", selectedAnswers);
    const toastId = toast.loading("Submitting quiz...");
    try {
      const response = await fetch(`${baseUrl}/quiz/${id}/submit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
        body: JSON.stringify({ answers: selectedAnswers }),
      });

      if (!response.ok) throw new Error("Failed to submit quiz");
      
      const data = await response.json();
      console.log(data);
      toast.success(data.message)
      setQuizResult({result:data.result, score:data.score});
      toast.success("Quiz submitted successfully!");
      //navigate("/results");
      // Show Submission Successful Modal
      setShowConfirmSubmission(false);
      setShowSubmissionSuccessful(true);
    } catch (error) {
      toast.error("Error submitting quiz.");
      console.error(error);
    } finally {
      toast.dismiss(toastId);
    }
  };

  

  // Format Timer Display
  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs}h ${mins}m ${secs}s`;
  };

  return (
    <div className="">
      
      {/* Navbar */}
      <div className="flex items-center p-4 shadow-md bg-white relative">
        <div className="flex items-center gap-2">
          <img src="/Group 2 anyi[1].png" alt="Logo" className="w-10" />
          <h3 className="text-lg font-bold">Students' Assessment</h3>
        </div>
        {/* <h2 className="text-2xl font-bold absolute left-1/2 transform -translate-x-1/2">
          {questions[currentIndex].title}
        </h2> */}
      </div>

      {/* Modal Before Starting Quiz */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-md text-center h-[200px] w-[250px] md:h-[300px] md:w-[500px] border border-[#16364D] flex items-center justify-center flex-col space-y-5 md:space-y-8">
            <h2 className="text-xl font-bold text-[#0A4975]">WELCOME IQER!</h2>
            <p className="mt-2 text-[#5A0B4D]">GET READY... SET...</p>
            <button
              onClick={startQuiz}
              className="mt-4 bg-[#5A0B4D] text-white px-4 py-2 rounded"
            >
              Start Quiz
            </button>
          </div>
        </div>
      )}

      <ConfirmSubmissionModal
        showConfirmSubmission={showConfirmSubmission}
        setShowConfirmSubmission={setShowConfirmSubmission}
        handleSubmit = {handleSubmitQuiz}
      />
      <SubmissionSuccessfulModal
        showSubmissionSuccessful={showSubmissionSuccessful}
        setShowSubmissionSuccessful={setShowSubmissionSuccessful}
        handleSubmit={() => navigate(`/score-board/${quizResult.result._id}`) }
      />

      {/* Don't display main content when start quiz modal is showing */}
      { showModal ? null : 
        <div className="flex min-h-screen">        
          {/* Sidebar */}                          
          <div className="w-[20%] bg-white p-4 border">          
            <div className="mt-2">
              {questions.map((question:any, index:any) => (
                <button
                  key={index}
                  className={`block w-full p-2 my-1 text-center rounded ${
                    currentIndex === index ? "bg-[#EAF4FD] text-black" : "bg-gray-200"
                  }`}
                  onClick={() => setCurrentIndex(index)}
                >
                  {index + 1}. {question.title}
                </button>
              ))}
            </div>
            <p className="mt-10 font-medium text-black text-center" >
              Question {currentIndex + 1} of {questions.length}
            </p>
            <div className="mt-4 text-center">
              <p className="text-sm font-bold">Time till end of quiz</p>
              <button className="bg-[#5A0B4D] text-white px-3 py-1 rounded mt-2">{formatTime(timeLeft)}</button>
            </div>
          </div>        
          {/* Main Content */}
          <div className="flex-1 p-6">
            {questions.length > 0 && (
              <>
                <h2 className="text-2xl font-bold text-center">{questions[currentIndex].title}</h2>
        
                {/* Image Display */}
        
                  <div className="flex justify-center my-4 min-h-[40vh] max-h-[50vh]">
                    <img src={questions[currentIndex].mediaUrl ?? "/logo nav.png"} alt="Question" className={`${questions[currentIndex].mediaUrl ? "w-1/2":"w-1/3" } object-cover`} />
                  </div>
        
                {/* Answer Options */}
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                  {questions[currentIndex].options.map((option: string, index: number) => (
                    <div
                      key={index}
                      className={`flex items-center w-full px-3 py-2 rounded border cursor-pointer
                      ${selectedAnswers.find(ans => ans.questionId === questions[currentIndex]._id)?.selectedOption === option ? "border-2 border-black" : "border-gray-300"}
                      ${index === 0 ? "bg-blue-200"
                        : index === 1 ? "bg-red-200"
                        : index === 2 ? "bg-purple-200"
                        : "bg-green-200"}`}
                      onClick={() => handleOptionSelect(questions[currentIndex]._id, option)}
                    >
                      <div className={`w-3 h-full mr-3
                        ${index === 0 ? "bg-blue-700"
                          : index === 1 ? "bg-red-700"
                          : index === 2 ? "bg-purple-700"
                          : "bg-green-700"}`} />
                      <p className="text-lg">{option}</p>
                      <input
                        type="radio"
                        name={`question-${questions[currentIndex]._id}`}
                        className="ml-auto"
                        checked={selectedAnswers.find(ans => ans.questionId === questions[currentIndex]._id)?.selectedOption === option}
                        onChange={() => handleOptionSelect(questions[currentIndex]._id, option)}
                      />
                    </div>
                  ))}
                </div>
                {/* Navigation Buttons */}
                <div className="flex justify-between mt-6">
                  <button
                    onClick={handleBack}
                    disabled={currentIndex === 0}
                    className={`px-4 py-2 rounded ${currentIndex === 0 ? "bg-gray-300" : "bg-gray-600 text-white"}`}
                  >
                    Back
                  </button>
                  <button
                    onClick={handleNext}
                    disabled={currentIndex === questions.length - 1}
                    className={`px-4 py-2 rounded ${currentIndex === questions.length - 1 ? "bg-gray-300" : "bg-blue-600 text-white"}`}
                  >
                    Next
                  </button>
                </div>
                {/* Submit Button */}
                {/* {currentIndex === questions.length - 1 && (
                  <div className="text-center mt-6">
                    <button onClick={() => setShowConfirmSubmission(true)} className="bg-green-600 text-white px-6 py-2 rounded">
                      Submit
                    </button>
                  </div>
                )} */}
                
                <div className="text-center mt-6">
                  <button onClick={() => setShowConfirmSubmission(true)} className="bg-green-600 text-white px-6 py-2 rounded">
                    Submit
                  </button>
                </div>                
              </>
            )}
          </div>  
          
        </div>
      }
      <Toaster />
    </div>
  );
};

export default QuizTakingPage;



const ConfirmSubmissionModal = ({ showConfirmSubmission, setShowConfirmSubmission, handleSubmit }: any) => {  
  if (!showConfirmSubmission) return null;
  return (
    <div
      className={`fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center
         ${ showConfirmSubmission ? "" : "hidden" }`}
    >
      <div className="bg-white p-6 rounded shadow-md text-center h-[250px] w-[300px] md:h-[300px] md:w-[500px] border border-[#16364D] flex items-center justify-center flex-col space-y-2 md:space-y-8">
        <img src="/Group 2 anyi[1].png" alt="IQ Logo" className="w-14 mb-4" /> 
        <h2 className="md:text-lg font-medium text-black">Are you sure you want to submit this quiz?</h2>
        <div className="mt-6 flex items-center justify-center gap-4">
          <button
            onClick={() => setShowConfirmSubmission(false)}
            className="border border-black text-black px-4 py-2 rounded"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}

//Submission Successful Modal
const SubmissionSuccessfulModal = ({ showSubmissionSuccessful, handleSubmit }: any) => {
  
  if (!showSubmissionSuccessful) return null;

  return (
    <div
      className={`fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center
         ${ showSubmissionSuccessful ? "" : "hidden" }`}
    >
      <div className="bg-white p-6 rounded shadow-md text-center h-[250px] w-[300px] md:h-[300px] md:w-[500px] border border-[#16364D] flex items-center justify-center flex-col">
        <img src="/Group 2 anyi[1].png" alt="IQ Logo" className="w-14 mb-2" /> 
        <h2 className="md:text-xl text-green-600 font-bold mb-1">Congratulations!</h2>
        <p className="text-[#5A0B4D]" >Submission succesful</p>
        <div className="mt-6 flex items-center justify-center gap-4">
          <button
            onClick={handleSubmit}
            className="border border-black text-black px-6 py-1.5 rounded"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}