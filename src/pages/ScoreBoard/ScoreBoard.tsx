//import QuizList from "../../components/Dashboard/QuizList/QuizList";
import { Link, useParams } from "react-router-dom";
import DashboardLayout from "../../components/DashboardLayout/DashboardLayout";
import { useEffect, useState } from "react";
import { baseUrl } from "../../utils";
import toast from "react-hot-toast";

const ScoreBoard = () => {
    const { id } = useParams();
    const [user, setUser] = useState<any>(null);
    const [token, setToken] = useState<any>("");
    const [result, setResult] = useState<any>(null);


    // Fetch quiz result with the id
    /* useEffect(() => {
        
    }, [token]) */
    
    useEffect(() => {
        const storedUser = JSON.parse(sessionStorage.getItem("user") as string);
        const storedToken = sessionStorage.getItem("token");
        console.log(storedUser)
        setUser(storedUser);
        setToken(storedToken);


        const fetchResult = async () => {
            const toastId = toast.loading("Fetching result...");
            try {
                const response = await fetch(`${baseUrl}/results/${id}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${storedToken}`,
                    },
                });
                const data = await response.json();
                console.log(data);
                if (response.ok) {
                    setResult(data.result);
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
        fetchResult()
        if (token !== "") {
            //console.log(token)
            fetchResult()
        }
    }, []);

    

    const [passStatus, setPassStatus] = useState<string>("");
    useEffect(() => {        
        // Check if score is greater than half of the total possible points and set a display state to be different
        const isPassed = result?.score > result?.totalPossiblePoints / 2;
        // Is score half of the total possible points
        const isHalf = result?.score === result?.totalPossiblePoints / 2;
        // Is score less than half of the total possible points
        const isFailed = result?.score < result?.totalPossiblePoints / 2;
        
        if (isPassed) {
            setPassStatus("Passed");
        } else if (isHalf) {
            setPassStatus("Halfway");
        } else if (isFailed) {
            setPassStatus("Failed");
        }
    }, [result]);

    return (
        <DashboardLayout>      
            <div className="pt-5 md:pt-16" >
                <h1 className="text-[#5A0B4D] font-bold text-center text-xl lg:text-2xl mb-8" >
                    Scoreboard
                </h1>
                <section className="bg-[#0A4975] min-h-[78vh] py-10 lg:py-16 text-center" >
                    { result &&
                        <div className="mx-auto w-full max-w-[600px] px-10 ">
                            <h2 className="text-white font-bold text-base lg:text-lg mb-8" >
                                Keep the streak alive!
                            </h2>

                            <div className="bg-[#5A0B4D] rounded-lg py-12 px-5 w-full relative mx-auto text-white font-bold" >
                                <div className="text-left mb-4" >
                                    <h3 className="text-sm lg:text-base mb-2 ">{user?.username}</h3>
                                    <button className="flex gap-1 items-center justify-center px-2.5 py-0.5 border border-[#16364D] rounded-full"
                                        style={{ 'background': 'linear-gradient(90deg, #0A4975 52.5%, #1389DB 87%)' }} >
                                        <img src="/noto_coin.svg" alt="coin" />
                                        <span>
                                            {result?.score + "/" + result?.totalPossiblePoints } points
                                        </span> 
                                    </button>
                                </div>

                                <p className="" >                                
                                    {
                                        passStatus === "Passed" ? "Hurray, you did great, well done!" :
                                        passStatus === "Halfway" ? "You can always go higher, keep practicing!" :
                                        passStatus === "Failed" ? "Thats’s poor, but you can keep trying!" : ""
                                    }
                                </p>

                                <img
                                    src=
                                    {
                                        passStatus === "Passed" ? "/Group 6.png" :
                                        passStatus === "Halfway" ? "/amico.png" :
                                        passStatus === "Failed" ? "/rafiki.png" : ""
                                    }
                                    alt="" className="absolute transform -translate-x-1/2 left-1/2"
                                />                            
                            </div>

                            <Link to="/dashboard/quizzes" >
                                <button className="bg-white w-full mt-44 font-bold py-3 md:py-4 rounded-2xl text-[#5A0B4D]" >
                                    Take a new quiz
                                </button>
                            </Link>

                            <div className="mt-5 text-white font-bold" >
                                <h4 className="lg:text-xl mb-5" >
                                    Performance stats
                                </h4>

                                <div className="flex justify-between gap-14" >
                                    <button className="relative flex flex-col items-center justify-center bg-[#5A0B4D] px-6 py-3 md:py-6 rounded-2xl w-full flex-1" >
                                        <img src="/incorrect.svg" alt="" className="absolute left-0 bottom-0 z-0 max-w-[60%] md:max-w-none" />
                                        <span className="text-sm lg:text-lg z-10" >{result?.incorrectAnswersCount}</span>
                                        <span className="text-sm lg:text-lg z-10" > incorrect answers</span>
                                    </button>
                                    <button className="relative flex flex-col items-center justify-center bg-[#5A0B4D] px-6 py-3 md:py-6 rounded-2xl w-full flex-1" >
                                        <img src="/correct.svg" alt="" className="absolute left-0 bottom-0 z-0 max-w-[40%] md:max-w-none" />
                                        <span className="text-sm lg:text-lg z-10" >{result?.correctAnswersCount}</span>
                                        <span className="text-sm lg:text-lg z-10" > correct answers</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    }
                </section>
            </div>
        </DashboardLayout>
    );
};

export default ScoreBoard;
