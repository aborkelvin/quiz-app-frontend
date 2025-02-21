import { useEffect, useState } from "react";
import DashboardLayout from "../../components/DashboardLayout/DashboardLayout";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { baseUrl } from "../../utils";

const DashboardQuizzes = () => {
  const [user, setUser] = useState<any>(null);
  const [token, setToken] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(sessionStorage.getItem("user") as string);
    const storedToken = sessionStorage.getItem("token");

    if (!storedUser || !storedToken) {
      toast.error("Unauthorized access! Please sign in.");
      navigate("/signin")
      return;
    }

    setUser(storedUser);
    setToken(storedToken);
  }, []);
    
    
    const [quizzes, setQuizzes] = useState(
        JSON.parse(sessionStorage.getItem("quizzes") || "[]")
    );

  useEffect(() => {
    const toastId = toast.loading("Loading quizzes...");
    fetch(`${baseUrl}/quiz`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        toast.success("Quizzes loaded successfully", { id: toastId });
        sessionStorage.setItem("quizzes", JSON.stringify(data));
        console.log(data)
        setQuizzes(data);        
      })
      .catch(() => {
        toast.error("Failed to load quizzes", { id: toastId });
      });
  }, [token]);


    return (
        <DashboardLayout>
            <div className="p-5 md:p-16" >
                <div className="font-bold mb-4" >
                    <h1 className="text-xl lg:text-2xl mb-1 text-[#5A0B4D]">Hi, {user?.username}!</h1>
                    <p className="lg:text-xl text-[#0A4975]">Let’s get the fun strted!</p>
                </div>
                <h2 className="text-[#5A0B4D] lg:text-xl font-bold text-center mb-10 md:mb-16">Let’s play</h2>

                <section className="flex flex-wrap gap-8 justify-center">
                    {quizzes.map((quiz: any, index: number) => (
                        <QuizDisplayBox key={quiz._id} quiz={quiz} index={index} />
                    ))}
                    
                </section>

            </div>
            <Toaster />
        </DashboardLayout>
    );
};

export default DashboardQuizzes;


const COLORS = [
    { bg: "bg-[#0A4975]", border: "bg-[#082D47]" }, // Dark Blue
    { bg: "bg-[#50124E]", border: "bg-[#320A30]" }, // Dark Purple
    { bg: "bg-[#C15353]", border: "bg-[#8F2F2F]" }, // Reddish
    { bg: "bg-[#7A2F6F]", border: "bg-[#4D1B47]" }, // Dark Pink
    { bg: "bg-[#4C7EA6]", border: "bg-[#285272]" }, // Light Blue
];



const QuizDisplayBox = ({ quiz, index }: { quiz: any; index: number }) => {
    const navigate = useNavigate();

    // Rotate colors based on the index
    const { bg, border } = COLORS[index % COLORS.length];

    return (
        <div
            key={quiz._id}
            className={`relative flex items-center w-full md:w-[250px] lg:w-[320px] h-[200px] ${bg} text-white shadow-lg cursor-pointer transform hover:scale-105 transition-transform hover:shadow-2xl`}
            onClick={() => navigate(`/take-quiz/${quiz._id}`)}
        >
            {/* Left Border to create "book effect" */}
            <div className={`absolute left-0 top-0 h-full w-[15px] ${border} rounded-l-md`} />

            {/* Content */}
            <div className="flex flex-col justify-center items-center w-full text-center px-4">
                <strong className="text-lg">{quiz.title}</strong>
                <p className="text-sm">{quiz.questions.length} question{quiz.questions.length !== 1 ? "s" : ""}</p>
            </div>
        </div>
    );
};
