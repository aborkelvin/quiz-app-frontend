import { useEffect, useState } from "react";
//import QuizList from "../../components/Dashboard/QuizList/QuizList";
import DashboardLayout from "../../components/DashboardLayout/DashboardLayout";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const Dashboard = () => {
  const [user, setUser] = useState<any>(null);
  //const [token, setToken] = useState("");
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
    //setToken(storedToken);
  }, []);


  return (
    <DashboardLayout>
      <div className="p-5 md:p-16" >
        <div className="font-bold mb-10 md:mb-16" >
          <h1 className="text-xl lg:text-2xl mb-1 text-[#5A0B4D]">Hi, {user?.username}!</h1>
          <p className="lg:text-xl text-[#0A4975]">Welcome, let’s get you started!</p>
        </div>

        <section className="space-y-8">
          <div className="space-y-2 w-full md:w-1/2 mx-auto bg-[#0A4975] text-white border border-[#C6C3C3] p-4 md:p-6 rounded-lg" >
            <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="0.958225" y="1.31858" width="33.9167" height="33.9167" rx="9.76389" stroke="#C6C3C3" stroke-width="1.02778"/>
              <path d="M17.9167 28.471C15.9246 27.3208 13.6648 26.7154 11.3646 26.7154C9.06432 26.7154 6.80459 27.3208 4.8125 28.471V9.54273C6.80459 8.3926 9.06432 7.78711 11.3646 7.78711C13.6648 7.78711 15.9246 8.3926 17.9167 9.54273M17.9167 28.471C19.9088 27.3208 22.1685 26.7154 24.4688 26.7154C26.769 26.7154 29.0287 27.3208 31.0208 28.471V9.54273C29.0287 8.3926 26.769 7.78711 24.4688 7.78711C22.1685 7.78711 19.9088 8.3926 17.9167 9.54273M17.9167 28.471V9.54273" stroke="white" stroke-width="2.05556" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <h3 className="font-bold text-lg md:text-xl">Create your IQ quiz</h3>
            <p className="md:text-lg" >
              Tap "Create" to begin building your quiz. Set points and time limits per question, add as many questions in your IQ quiz as you like. You save, publish, and share via email or social media too!
            </p>
            <button
              className="w-fit bg-[#5a0b4d] text-white px-3 py-1.5 rounded text-sm"
              onClick={() => navigate('/create-quiz')}
              >
              Create
            </button>
          </div>

          <div className="flex flex-col md:flex-row gap-8" >
            <div className="space-y-2 w-full md:w-1/2 mx-auto bg-[#5A0B4D] text-white border border-[#C6C3C3] p-4 md:p-6 rounded-lg" >
              <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="0.958225" y="1.31858" width="33.9167" height="33.9167" rx="9.76389" stroke="#C6C3C3" stroke-width="1.02778"/>
                <path d="M11 9L25 18L11 27V9Z" fill="white" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <h3 className="font-bold text-lg md:text-xl">Take a quiz</h3>
              <p className="md:text-lg" >
                Tap "Play" to take an IQ quiz. Select from a variety of subjects and have fun while at it!
              </p>
              <button
                className="w-fit bg-[#0A4975] text-white px-7 py-1.5 rounded text-sm"
                onClick={() => navigate('/dashboard/quizzes')}
                >
                Play
              </button>
            </div>

            <div className="space-y-2 w-full md:w-1/2 mx-auto bg-[#E4FDEC] text-black border border-[#C6C3C3] p-4 md:p-6 rounded-lg" >
              <svg width="35" height="35" viewBox="0 0 35 35" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="0.728611" y="0.909275" width="33.4574" height="33.4574" rx="9.63169" stroke="#888787" stroke-width="1.01386"/>
                <path d="M31.8203 27.6918C31.8203 28.4537 31.5177 29.1843 30.979 29.723C30.4402 30.2618 29.7096 30.5644 28.9477 30.5644H5.96685C5.20498 30.5644 4.47432 30.2618 3.93561 29.723C3.39689 29.1843 3.09424 28.4537 3.09424 27.6918V7.58355C3.09424 6.82168 3.39689 6.09102 3.93561 5.5523C4.47432 5.01359 5.20498 4.71094 5.96685 4.71094H13.1484L16.021 9.01985H28.9477C29.7096 9.01985 30.4402 9.3225 30.979 9.86122C31.5177 10.3999 31.8203 11.1306 31.8203 11.8925V27.6918Z" stroke="#1E1E1E" stroke-width="4.05545" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>

              <h3 className="font-bold text-lg md:text-xl">View, preview publish and share saved quizes</h3>
              <p className="md:text-lg" >
                Access your previously created and saved IQ quizes by exploring your saved quizes folder
              </p>
              <button
                className="w-fit bg-[#5a0b4d] text-white px-3 py-1.5 rounded text-sm"
                >
                Saved
              </button>
            </div>
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
