
import { useNavigate } from "react-router-dom";
//import { FiMenu, FiX } from "react-icons/fi";
import toast, { Toaster } from "react-hot-toast";
import { base64ToFile, baseUrl } from "../../utils";

const QuizPreviewPage = () => {
  const navigate = useNavigate();

  // Retrieve quiz details from sessionStorage
  const quizDetails = JSON.parse(sessionStorage.getItem("quizDetails") as string) || {};
  //const questions = JSON.parse(sessionStorage.getItem("previewQuestions") as string) || [];

  const retrievedQuestions = JSON.parse(sessionStorage.getItem("previewQuestions") as string) || [];

  // Convert Base64 back to File object
  const questions = retrievedQuestions.map((q:any) => {
    if (q.media && typeof q.media === "string") {
      const file = base64ToFile(q.media, "uploaded-media"); // Restore File object
      return { ...q, media: file };
    }
    return q;
  });

 



  const publishQuiz = async () => {
    if (questions.length === 0) {
      toast.error("You need to add at least one question.");
      return;
    }

    console.log(questions)
    const formData = new FormData();
    formData.append("title", quizDetails.title || "Untitled Quiz");
    formData.append("description", quizDetails.description || "");
    formData.append("settings[timer]", quizDetails.timer || 30);
    formData.append("settings[pointsPerQuestion]", quizDetails.pointsPerQuestion || 1);

    questions.forEach((q:any, index:any) => {
      formData.append(`questions[${index}][title]`, q.title);
      q.options.forEach((opt: string, i: number) => {
        formData.append(`questions[${index}][options][${i}]`, opt);
      });
      q.correctAnswers.forEach((correctOpt: string, i: number) => {
        formData.append(`questions[${index}][correctAnswers][${i}]`, correctOpt);
      });
      if (q.media) {
        console.log(q.media)
        formData.append(`questions[${index}][media]`, q.media);
      }
    });

    
    //consolelog the formData by looping through the object in the form
    for (const pair of formData.entries()) {
      console.log(pair[0] + ": " + pair[1]);
    } 
    

    console.log("FormData ready to send:");
    const toastId = toast.loading("Publishing quiz..."); 
    try {
      const response = await fetch(`${baseUrl}/quiz/media`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem('token')}`,
        },
        body: formData, // Send FormData instead of JSON
      });

      const data = await response.json();
      console.log(data);

      if (response.ok) {
        toast.success("Quiz Published Successfully!");
        sessionStorage.removeItem("quizDetails");
        sessionStorage.removeItem("previewQuestions");
        setTimeout(() => {
          navigate("/dashboard/home");
        }, 1000)
      } else {
        toast.error("Failed to publish quiz.");
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      toast.dismiss(toastId)
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Navbar */}
      <div className="flex justify-between items-center p-4 shadow-md bg-white">
          <div className="flex items-center gap-2">
              <img src="/Group 2 anyi[1].png" alt="Logo" className="w-10" />
              <div className="border rounded-md p-1 text-sm flex max-w-[60%]">
                  <input
                      type="text"
                      placeholder="Enter IQ title..."
                      className="border-none outline-none flex-1"
                  />
                  <button
                      onClick={() => navigate("/create-quiz")}
                      className="bg-gray-300 px-2 py-1 rounded md:ml-2 text-black"
                      >
                      Settings
                  </button>
              </div>
          </div>
          <div className="hidden md:block" >
              {/* <button 
                onClick={addOrUpdateQuestion}
                className="bg-[#5a0b4d] text-white px-3 py-1 rounded mr-4">
                  Save Question
              </button> */}
              <button 
                onClick={publishQuiz}
                className="bg-[#5a0b4d] text-white px-3 py-1 flex items-center gap-1 rounded">
                  <img src="public/upload.svg" alt="upload icon" />
                  Publish
              </button>
          </div>
      </div>
      
      <div className="flex flex-col md:flex-row  p-6 items-center">
        {/* Left Section - Preview Text and Image */}
        <div className="md:w-1/3 p-6 rounded-md">
          <h2 className="text-xl font-semibold text-center">Preview your IQ quiz</h2>
          <img src="/preview-image.png" alt="Preview Quiz" className="mt-4 w-full rounded-md" />
        </div>
        {/* Right Section - Quiz Preview */}
        <div className="flex-1 md:ml-6">
            <div className=" bg-white">
              {/* Quiz Title */}
              <div className="border border-[#C6C3C3] p-6">
                  <div className="flex gap-4 items-center mb-4">
                    <img src="/Frame 258.png" alt="" />
                    <h1 className="text-2xl font-bold">{quizDetails.title || "Untitled Quiz"}</h1>
                  </div>
                  {/* <div className="flex space-x-3 md:space-x-6">
                      <button className="border border-[#5A0B4D] px-6 py-1 rounded-sm">Edit</button>
                      <button className="border border-[#5A0B4D] px-6 py-1 rounded-sm">Share</button>
                  </div> */}
              </div>
              {/* Loop Through Questions */}
              {questions.map((question: any, qIndex: number) => (
                <div className="">
                    <div key={qIndex} className="border border-[#C6C3C3] p-6">

                      {/* Question Text */}
                      <h3 className="text-lg font-semibold mt-1">{question.title}?</h3>
                      {/* Answer Options */}
                      <div className="mt-1">
                          <span>Answer choices</span>
                        <div className="grid grid-cols-2 gap-y-3 mt-1">
                            {question.options.map((option: string, i: number) => (
                              <div key={i} className="flex items-center space-x-2">
                                {question.correctAnswers.includes(option) ? (
                                  <img src="/good.svg" alt="" />
                                ) : (
                                  <img src="/bad.svg" alt="" />
                                )}
                                <span className="text-gray-700">{option}</span>
                              </div>
                            ))}
                        </div>
                      </div>
                </div>

                </div>
              ))}
            </div>
            {/* Navigation Buttons */}
              <div className="flex gap-5 items-center justify-center mt-6">
                  <button
                      onClick={() => navigate("/dashboard/home")}
                      className="border px-4 py-2 rounded-md"
                  >
                      Back to home
                  </button>
                  <button
                      onClick={() => navigate("/create-quiz")}
                      className="bg-[#5A0B4D] text-white px-4 py-2 rounded-md"
                  >
                      Back to edit
                  </button>
              </div>
        </div>
      </div>
      <Toaster />
    </div>
  );
};

export default QuizPreviewPage;
