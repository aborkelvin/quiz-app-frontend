
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/DashboardLayout/DashboardLayout";
import { useEffect, useState } from "react";
import { baseUrl } from "../../utils";
import toast from "react-hot-toast";
import { FaShareAlt, FaTimes, FaCopy } from "react-icons/fa";

const Activities = () => {
    //const [user, setUser] = useState<any>(null);
    const [token, setToken] = useState<any>("");
    const [results, setResults] = useState<any>([]);
    const [createdQuizzes, setCreatedQuizzes] = useState<any>([]);
    
    useEffect(() => {
        const storedUser = JSON.parse(sessionStorage.getItem("user") as string);
        const storedToken = sessionStorage.getItem("token");
        //console.log(storedUser)
        //setUser(storedUser);
        setToken(storedToken);


        const fetchResult = async () => {
            const toastId = toast.loading("Fetching result...");
            try {
                const response = await fetch(`${baseUrl}/results/mine`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${storedToken}`,
                    },
                });
                const data = await response.json();
                console.log(data);
                if (response.ok) {
                    setResults(data.results);
                    //setResults([])
                    toast.success("Result fetched successfully");
                }else{
                    toast.error(data.message || "Failed to fetch result");
                }
            } catch (error) {
                console.log(error);
                toast.error("Failed to fetch result");
            } finally {
                toast.dismiss(toastId);
            }
        }
        //fetchResult()

        const fetchCreatorQuiz = async () => {
            //const toastId = toast.loading("Fetching result...");
            try {
                const response = await fetch(`${baseUrl}/quiz/creator/${storedUser._id}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${storedToken}`,
                    },
                });
                const data = await response.json();
                console.log(data);
                if (response.ok) {
                    //setResults(data.results);
                    //setResults([])
                    //toast.success("Result fetched successfully");
                    setCreatedQuizzes(data);
                }else{
                    toast.error(data.message || "Failed to fetch result");
                }
            } catch (error) {
                console.log(error);
                toast.error("Failed to fetch result");
            } finally {
                //toast.dismiss(toastId);
            }
        }

        if (token !== "") {
            //console.log(token)
            fetchResult()
            fetchCreatorQuiz()
        }
    }, [token]);

    
    const [pageDisplay, setPageDisplay] = useState<string>("completed");

    return (
        <DashboardLayout>      
            <div className="pt-5 md:pt-10" >
                <div className="flex px-5 md:px-20 gap-10 lg:gap-16">
                    <button
                        onClick={() => setPageDisplay("completed")}
                        className={` ${pageDisplay == "completed" ? "text-black" : "text-[#888787]"}  text-sm md:text-lg mb-8 flex items-center gap-2`} >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <g clip-path="url(#clip0_1298_1354)">
                            <path d="M17.4727 6.97266L18.5273 8.02734L9.75 16.8047L5.47266 12.5273L6.52734 11.4727L9.75 14.6953L17.4727 6.97266ZM12 0C13.1016 0 14.1641 0.140625 15.1875 0.421875C16.2109 0.703125 17.168 1.10547 18.0586 1.62891C18.9492 2.15234 19.7578 2.77734 20.4844 3.50391C21.2109 4.23047 21.8359 5.04297 22.3594 5.94141C22.8828 6.83984 23.2852 7.79688 23.5664 8.8125C23.8477 9.82812 23.9922 10.8906 24 12C24 13.1016 23.8594 14.1641 23.5781 15.1875C23.2969 16.2109 22.8945 17.168 22.3711 18.0586C21.8477 18.9492 21.2227 19.7578 20.4961 20.4844C19.7695 21.2109 18.957 21.8359 18.0586 22.3594C17.1602 22.8828 16.2031 23.2852 15.1875 23.5664C14.1719 23.8477 13.1094 23.9922 12 24C10.8984 24 9.83594 23.8594 8.8125 23.5781C7.78906 23.2969 6.83203 22.8945 5.94141 22.3711C5.05078 21.8477 4.24219 21.2227 3.51562 20.4961C2.78906 19.7695 2.16406 18.957 1.64062 18.0586C1.11719 17.1602 0.714844 16.207 0.433594 15.1992C0.152344 14.1914 0.0078125 13.125 0 12C0 10.8984 0.140625 9.83594 0.421875 8.8125C0.703125 7.78906 1.10547 6.83203 1.62891 5.94141C2.15234 5.05078 2.77734 4.24219 3.50391 3.51562C4.23047 2.78906 5.04297 2.16406 5.94141 1.64062C6.83984 1.11719 7.79297 0.714844 8.80078 0.433594C9.80859 0.152344 10.875 0.0078125 12 0ZM12 22.5C12.9609 22.5 13.8867 22.375 14.7773 22.125C15.668 21.875 16.5039 21.5234 17.2852 21.0703C18.0664 20.6172 18.7773 20.0664 19.418 19.418C20.0586 18.7695 20.6055 18.0625 21.0586 17.2969C21.5117 16.5312 21.8672 15.6953 22.125 14.7891C22.3828 13.8828 22.5078 12.9531 22.5 12C22.5 11.0391 22.375 10.1133 22.125 9.22266C21.875 8.33203 21.5234 7.49609 21.0703 6.71484C20.6172 5.93359 20.0664 5.22266 19.418 4.58203C18.7695 3.94141 18.0625 3.39453 17.2969 2.94141C16.5312 2.48828 15.6953 2.13281 14.7891 1.875C13.8828 1.61719 12.9531 1.49219 12 1.5C11.0391 1.5 10.1133 1.625 9.22266 1.875C8.33203 2.125 7.49609 2.47656 6.71484 2.92969C5.93359 3.38281 5.22266 3.93359 4.58203 4.58203C3.94141 5.23047 3.39453 5.9375 2.94141 6.70312C2.48828 7.46875 2.13281 8.30469 1.875 9.21094C1.61719 10.1172 1.49219 11.0469 1.5 12C1.5 12.9609 1.625 13.8867 1.875 14.7773C2.125 15.668 2.47656 16.5039 2.92969 17.2852C3.38281 18.0664 3.93359 18.7773 4.58203 19.418C5.23047 20.0586 5.9375 20.6055 6.70312 21.0586C7.46875 21.5117 8.30469 21.8672 9.21094 22.125C10.1172 22.3828 11.0469 22.5078 12 22.5Z" fill="#888787"/>
                            </g>
                            <defs>
                            <clipPath id="clip0_1298_1354">
                            <rect width="24" height="24" fill="white"/>
                            </clipPath>
                            </defs>
                        </svg>
                        Completed
                    </button>
                    <button
                        onClick={() => setPageDisplay("created")}
                        className={` ${pageDisplay == "created" ? "text-black" : "text-[#888787]"}  text-sm md:text-lg mb-8 flex items-center gap-2`} >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <g clip-path="url(#clip0_1298_1354)">
                            <path d="M17.4727 6.97266L18.5273 8.02734L9.75 16.8047L5.47266 12.5273L6.52734 11.4727L9.75 14.6953L17.4727 6.97266ZM12 0C13.1016 0 14.1641 0.140625 15.1875 0.421875C16.2109 0.703125 17.168 1.10547 18.0586 1.62891C18.9492 2.15234 19.7578 2.77734 20.4844 3.50391C21.2109 4.23047 21.8359 5.04297 22.3594 5.94141C22.8828 6.83984 23.2852 7.79688 23.5664 8.8125C23.8477 9.82812 23.9922 10.8906 24 12C24 13.1016 23.8594 14.1641 23.5781 15.1875C23.2969 16.2109 22.8945 17.168 22.3711 18.0586C21.8477 18.9492 21.2227 19.7578 20.4961 20.4844C19.7695 21.2109 18.957 21.8359 18.0586 22.3594C17.1602 22.8828 16.2031 23.2852 15.1875 23.5664C14.1719 23.8477 13.1094 23.9922 12 24C10.8984 24 9.83594 23.8594 8.8125 23.5781C7.78906 23.2969 6.83203 22.8945 5.94141 22.3711C5.05078 21.8477 4.24219 21.2227 3.51562 20.4961C2.78906 19.7695 2.16406 18.957 1.64062 18.0586C1.11719 17.1602 0.714844 16.207 0.433594 15.1992C0.152344 14.1914 0.0078125 13.125 0 12C0 10.8984 0.140625 9.83594 0.421875 8.8125C0.703125 7.78906 1.10547 6.83203 1.62891 5.94141C2.15234 5.05078 2.77734 4.24219 3.50391 3.51562C4.23047 2.78906 5.04297 2.16406 5.94141 1.64062C6.83984 1.11719 7.79297 0.714844 8.80078 0.433594C9.80859 0.152344 10.875 0.0078125 12 0ZM12 22.5C12.9609 22.5 13.8867 22.375 14.7773 22.125C15.668 21.875 16.5039 21.5234 17.2852 21.0703C18.0664 20.6172 18.7773 20.0664 19.418 19.418C20.0586 18.7695 20.6055 18.0625 21.0586 17.2969C21.5117 16.5312 21.8672 15.6953 22.125 14.7891C22.3828 13.8828 22.5078 12.9531 22.5 12C22.5 11.0391 22.375 10.1133 22.125 9.22266C21.875 8.33203 21.5234 7.49609 21.0703 6.71484C20.6172 5.93359 20.0664 5.22266 19.418 4.58203C18.7695 3.94141 18.0625 3.39453 17.2969 2.94141C16.5312 2.48828 15.6953 2.13281 14.7891 1.875C13.8828 1.61719 12.9531 1.49219 12 1.5C11.0391 1.5 10.1133 1.625 9.22266 1.875C8.33203 2.125 7.49609 2.47656 6.71484 2.92969C5.93359 3.38281 5.22266 3.93359 4.58203 4.58203C3.94141 5.23047 3.39453 5.9375 2.94141 6.70312C2.48828 7.46875 2.13281 8.30469 1.875 9.21094C1.61719 10.1172 1.49219 11.0469 1.5 12C1.5 12.9609 1.625 13.8867 1.875 14.7773C2.125 15.668 2.47656 16.5039 2.92969 17.2852C3.38281 18.0664 3.93359 18.7773 4.58203 19.418C5.23047 20.0586 5.9375 20.6055 6.70312 21.0586C7.46875 21.5117 8.30469 21.8672 9.21094 22.125C10.1172 22.3828 11.0469 22.5078 12 22.5Z" fill="#888787"/>
                            </g>
                            <defs>
                            <clipPath id="clip0_1298_1354">
                            <rect width="24" height="24" fill="white"/>
                            </clipPath>
                            </defs>
                        </svg>
                        Created Quizzes
                    </button>
                </div>
                {
                    pageDisplay == "completed" ? (
                        <section className="bg-[#0A4975] min-h-[90vh] py-10 lg:py-16 text-center" >
                            <div className="mx-auto w-full px-10 ">
                                {
                                    //if there are no results
                                    results?.length == 0 && (
                                        <>
                                            <h2 className="text-white font-bold text-base lg:text-lg mb-8" >
                                                It looks like you don’t have any completed quiz 
                                            </h2>
                                            <img src="/arcticons_game-plugins.png" alt="" className="mx-auto" />
                                        </>
                                    )                                                                        
                                }
                                <div className="flex flex-wrap gap-8 justify-center">
                                    {
                                        results.map((result: any , index: number) => (
                                            <ResultDisplayBox key={result._id} result={result} index={index} />
                                        ))
                                    }
                                </div>
                            </div>
                        </section>
                    ) : (
                            <section className="bg-[#0A4975] min-h-[90vh] py-10 lg:py-16 text-center" >
                                <div className="mx-auto w-full px-10 ">
                                    {
                                        //if there are no results
                                        createdQuizzes?.length == 0 && (
                                            <>
                                                <h2 className="text-white font-bold text-base lg:text-lg mb-8" >
                                                    It looks like you don’t have any saved quiz  
                                                </h2>
                                                <img src="/arcticons_game-plugins.png" alt="" className="mx-auto" />
                                            </>
                                        )                                                                        
                                    }
                                    <div className="flex flex-wrap gap-8 justify-center">
                                        {
                                            createdQuizzes.map((quiz: any , index: number) => (
                                                <QuizDisplayBox key={quiz._id} quiz={quiz} index={index} />
                                            ))
                                        }
                                    </div>
                                </div>
                            </section>
                    ) 
                }
            </div>
        </DashboardLayout>
    );
};

export default Activities;


const COLORS = [
    //{ bg: "bg-[#0A4975]", border: "bg-[#082D47]" }, // Dark Blue
    { bg: "bg-[#50124E]", border: "bg-[#320A30]" }, // Dark Purple
    { bg: "bg-[#C15353]", border: "bg-[#8F2F2F]" }, // Reddish
    { bg: "bg-[#7A2F6F]", border: "bg-[#4D1B47]" }, // Dark Pink
    { bg: "bg-[#4C7EA6]", border: "bg-[#285272]" }, // Light Blue
];



const ResultDisplayBox = ({ result, index }: { result: any, index:number }) => {
    const navigate = useNavigate();

    const { bg, border } = COLORS[index % COLORS.length];

    return (
        <div
            key={result._id}
            className={`relative flex items-center w-full md:w-[250px] lg:w-[320px] h-[200px] ${bg} text-white shadow-lg cursor-pointer transform hover:scale-105 transition-transform hover:shadow-2xl`}
            onClick={() => navigate(`/score-board/${result._id}`)}
        >
            {/* Left Border to create "book effect" */}
            <div className={`absolute left-0 top-0 h-full w-[15px] ${border} rounded-l-md`} />

            {/* Content */}
            <div className="flex flex-col justify-center items-center w-full text-center px-4">
                <strong className="text-lg">{result.quizId.title}</strong>
                <p className="text-sm">{result.quizId.description}</p>
                <p className="text-sm">Score: {result.score}/{result.totalPossiblePoints}</p>
            </div>
        </div>
    );
}


//Create a quiz display box that shows the quiz title, number of questions and an share button to share quiz 
/* const QuizDisplayBox = ({ quiz, index }: { quiz: any; index: number }) => {
    const navigate = useNavigate();

    // Rotate colors based on the index
    const { bg, border } = COLORS[index % COLORS.length];

    return (
        <div
            key={quiz._id}
            className={`relative flex items-center w-full md:w-[250px] lg:w-[320px] h-[200px] ${bg} text-white shadow-lg cursor-pointer transform hover:scale-105 transition-transform hover:shadow-2xl`}
            onClick={() => navigate(`/take-quiz/${quiz._id}`)}
        >
            
            <div className={`absolute left-0 top-0 h-full w-[15px] ${border} rounded-l-md`} />

            
            <div className="flex flex-col justify-center items-center w-full text-center px-4">
                <strong className="text-lg">{quiz.title}</strong>
                <p className="text-sm">{quiz.questions.length} question{quiz.questions.length !== 1 ? "s" : ""}</p>
            </div>
        </div>
    );
}; */

const QuizDisplayBox = ({ quiz, index }: { quiz: any; index: number }) => {
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);
    const shareLink = `https://iq-quiz-decode.vercel.app/take-quiz/${quiz._id}`;

    // Rotate colors based on the index
    const { bg, border } = COLORS[index % COLORS.length];

    const copyToClipboard = () => {
        navigator.clipboard.writeText(shareLink);
        toast.success("Link copied to clipboard!");
    };

    return (
        <>
            <div
                key={quiz._id}
                className={`relative flex items-center w-full md:w-[250px] lg:w-[320px] h-[200px] ${bg} text-white shadow-lg cursor-pointer transform hover:scale-105 transition-transform hover:shadow-2xl`}
                onClick={() => navigate(`/take-quiz/${quiz._id}`)}
            >
                {/* Left Border for "book effect" */}
                <div className={`absolute left-0 top-0 h-full w-[15px] ${border} rounded-l-md`} />

                {/* Content */}
                <div className="flex flex-col justify-center items-center w-full text-center px-4">
                    <strong className="text-lg">{quiz.title}</strong>
                    <p className="text-sm">{quiz.questions.length} question{quiz.questions.length !== 1 ? "s" : ""}</p>
                </div>

                {/* Share Icon */}
                <button
                    className="absolute top-4 right-4 text-white hover:text-gray-300"
                    onClick={(e) => {
                        e.stopPropagation();
                        setShowModal(true);
                    }}
                >
                    <FaShareAlt size={18} />
                </button>
            </div>

            {/* Share Modal */}
            {showModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-80 text-center">
                        <h3 className="text-lg font-bold mb-3">Share this Quiz</h3>
                        <p className="text-gray-600 break-words">{shareLink}</p>

                        <div className="flex justify-center gap-3 mt-4">
                            <button
                                onClick={copyToClipboard}
                                className="flex items-center gap-2 bg-[#5A0B4D] text-white px-4 py-2 rounded-md "
                            >
                                <FaCopy /> Copy Link
                            </button>

                            <button
                                onClick={() => setShowModal(false)}
                                className="flex items-center gap-2 bg-white border border-[#5A0B4D] text-[#5A0B4D] px-4 py-2 rounded-md "
                            >
                                <FaTimes /> Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

