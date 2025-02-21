import React, { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { base64ToFile, /* baseUrl, */ fileToBase64 } from "../../utils";
//import { FiMenu, FiX } from "react-icons/fi";

const QuizCreationPage = () => {
  const navigate = useNavigate();

  // State for questions
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number | null>(null);
  const [questionTitle, setQuestionTitle] = useState<string>("");
  const [options, setOptions] = useState<string[]>(["", "", "", ""]);
  const [correctAnswers, setCorrectAnswers] = useState<number[]>([]);
  const [image, setImage] = useState<string | null>(null);
  //const [sidebarOpen, setSidebarOpen] = useState(false); // Mobile sidebar state

  // Quiz details from sessionStorage
  //const quizDetails = JSON.parse(sessionStorage.getItem("quizDetails") as string) || {};

  
  // Handle Image Upload (Store File Instead of URL)
  const [imageFile, setImageFile] = useState<File | null>(null);
  
  // Handle Image Upload
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    console.log(file)
    if (file) {
        setImageFile(file); // Store the actual file
        setImage(URL.createObjectURL(file)); // Keep preview
    }

  };

  // Toggle correct answer selection
  const toggleCorrectAnswer = (index: number) => {
    setCorrectAnswers((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  // Add or Update Question
  const addOrUpdateQuestion = () => {
    if (!questionTitle.trim() || options.some(opt => opt.trim() === "")) {
      alert("Please fill in all fields and select at least one correct answer.");
      return;
    }
    if (correctAnswers.length === 0) {
      toast.error("Please select a correct answer from the options.");
      return;
    }

    const newQuestion = {
      title: questionTitle,
      options,
      correctAnswers: correctAnswers.map(index => options[index]),
      media: imageFile,
      displayImage: image
    };

    if (currentQuestionIndex !== null) {
      const updatedQuestions = [...questions];
      updatedQuestions[currentQuestionIndex] = newQuestion;
      setQuestions(updatedQuestions);
    } else {
      setQuestions([...questions, newQuestion]);
    }

    // Reset inputs
    setQuestionTitle("");
    setOptions(["", "", "", ""]);
    setCorrectAnswers([]);
    setImage(null);
    setCurrentQuestionIndex(null);
    setImageFile(null);
  };

  // Load question when clicked from sidebar
  const loadQuestion = (index: number) => {
    const question = questions[index];
    setQuestionTitle(question.title);
    setOptions([...question.options]);
    setCorrectAnswers(question.options
      .map((opt: string, i: number) => (question.correctAnswers.includes(opt) ? i : null))
      .filter((i: number | null) => i !== null) as number[]);
    setImage(question.displayImage);
    setImageFile(question.media)
    setCurrentQuestionIndex(index);
    //setSidebarOpen(false); // Close sidebar on selection (for mobile)
  };
  
  const previewQuiz = async() => {
    if (questions.length === 0) {
      toast.error("You need to add at least one question.");
      return;
    }    
    // Convert media files to Base64
    const questionsWithBase64 = await Promise.all(
      questions.map(async (q) => {
        if (q.media && q.media instanceof File) {
          const base64 = await fileToBase64(q.media);
          //console.log(base64)
          return { ...q, media: base64 }; // Store as base64 string
        }
        return q;
      })
    );

    sessionStorage.setItem("previewQuestions", JSON.stringify(questionsWithBase64));
    navigate("/preview-quiz");
  };
  

  // Retrieve quiz details from sessionStorage
  /* const quizDetails = JSON.parse(sessionStorage.getItem("quizDetails") as string) || {};
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

    questions.forEach((q, index) => {
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
      const response = await fetch(`${baseUrl}/uiz/media`, {
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
        //navigate("/dashboard/home");
      } else {
        toast.error("Failed to publish quiz.");
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      toast.dismiss(toastId)
    }
  }; */

  //On page load, check for questions in sessionStorage and set the state
  useEffect(() => {
    //const storedQuestions = JSON.parse(sessionStorage.getItem("previewQuestions") as string) || [];
    const retrievedQuestions = JSON.parse(sessionStorage.getItem("previewQuestions") as string) || [];

    // Convert Base64 back to File object
    const storedQuestions = retrievedQuestions.map((q:any) => {
      if (q.media && typeof q.media === "string") {
        const file = base64ToFile(q.media, "uploaded-media"); // Restore File object
        return { ...q, media: file };
      }
      return q;
    });
    console.log(storedQuestions)
    setQuestions(storedQuestions);
  }, []);
    
    return (    
        <div className="">
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
                    <button 
                      onClick={addOrUpdateQuestion}
                      className="bg-[#5a0b4d] text-white px-3 py-1 rounded mr-4">
                        Save Question
                    </button>
                    <button 
                      onClick={previewQuiz}
                      className="border px-3 py-1 rounded text-[#5a0b4d]">
                        Preview Quiz
                    </button>
                </div>
                {/* Mobile Menu Button */}
              //{/* <button className="md:hidden text-2xl" onClick={() => setSidebarOpen(true)}>
                <FiMenu />
              </button> */}
            </div>
            <div className="min-h-screen md:flex">
                {/* Left Sidebar */}
                
                <div className="w-[20%] bg-white p-4 hidden md:block border border-black">
                    <h3 className="text-sm font-bold">Quiz Questions</h3>
                    <div className="mt-2">
                        {questions.map((question, index) => (
                            <button
                            key={index}
                            className={`block w-full p-2 my-1 text-left rounded ${
                                currentQuestionIndex === index ? "bg-[#EAF4FD] text-black" : "bg-gray-200"
                            }`}
                            onClick={() => loadQuestion(index)}
                            >
                            {/* Question {index + 1} */}
                            {question.title.length > 20 ? question.title.slice(0, 20) + "..." : question.title}
                            </button>
                        ))}
                    </div>
                    <button
                        onClick={addOrUpdateQuestion}
                        className="w-fit bg-[#5a0b4d] text-white px-4 py-2 mt-10 rounded block mx-auto"
                    >
                    Add Question
                    </button>
                </div>
                {/* Main Content */}
                <div className="md:w-3/4 p-6">
                    <div className="flex flex-col items-center">
                        <input
                            type="text"
                            className="border p-2 w-3/4 text-center"
                            placeholder="Start typing your question..."
                            value={questionTitle}
                            onChange={(e) => setQuestionTitle(e.target.value)}
                        />
                        {/* Image Upload */}
                        <label className="mt-4 cursor-pointer">
                            <input type="file" className="hidden" onChange={handleImageUpload} />
                            {/* {image ? (
                            <img src={image} alt="Uploaded" className="w-48 h-48 object-cover" /> */}
                            {imageFile ? (
                            <img src={URL.createObjectURL(imageFile)} alt="Uploaded" className="w-48 h-48 object-cover" />
                            ) : (
                            <img src="/Frame 184.png" alt="Upload" className="w-full md:w-[350px] h-full md:h-[300px]" />
                            )}
                        </label>
                    </div>
                    {/* Answer Options */}
                    <div className="mt-6  mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
                        {options.map((opt, index) => (
                            <div
                            key={index}
                            className={`flex items-center w-full pr-4 rounded min-h-14 px-3
                                ${index === 0 ? "bg-blue-200"
                                : index === 1 ? "bg-red-200"
                                : index === 2 ? "bg-purple-200"
                                : "bg-green-200"}`}
                            >
                            {/* Colored Side Indicator */}
                            <div className={`w-3 h-full mr-3
                                ${index === 0 ? "bg-blue-700"
                                : index === 1 ? "bg-red-700"
                                : index === 2 ? "bg-purple-700"
                                : "bg-green-700"}`}
                            />
                            {/* Input Box */}
                            <input
                                type="text"
                                className="bg-transparent border-none w-full outline-none text-black h-full"
                                placeholder={`Option ${index + 1}`}
                                value={opt}
                                onChange={(e) => {
                                const newOptions = [...options];
                                newOptions[index] = e.target.value;
                                setOptions(newOptions);
                                }}
                            />
                
                            {/* Checkbox */}
                            <input
                                type="checkbox"
                                className="ml-3"
                                checked={correctAnswers.includes(index)}
                                onChange={() => toggleCorrectAnswer(index)}
                            />
                            </div>
                        ))}
                    </div>
                    {/* Buttons */}
                    <div className="flex md:hidden justify-center mt-6 space-x-4">
                        <button
                            onClick={addOrUpdateQuestion}
                            className="bg-[#5a0b4d] text-white px-4 py-2 rounded"
                        >
                            Save Question
                        </button>
                        <button
                            onClick={previewQuiz}
                            className="bg-green-600 text-white px-4 py-2 rounded"
                        >
                            Preview Quiz
                        </button>
                    </div>
                    <Link to="/dashboard/home">
                      <button className="py-2 px-4 border border-[#888787] mx-auto block rounded mt-5" >
                        Back to home
                      </button>
                    </Link>
                </div>
            </div>
            <Toaster />
    </div>
  );
};

export default QuizCreationPage;
