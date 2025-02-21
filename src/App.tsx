import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Landingpage from "./pages/landingpage/landingpage";
import Signup from "./pages/SignUpPage/SignUpPage";
import SignIn from "./pages/SigninPage/SigninPage";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import Dashboard from "./pages/Dashboard/Dashboard";
import QuizPageOne from "./pages/QuizPageOne/QuizPageOne";
import QuizSettings from "./pages/QuizSettings/QuizSettings";
import QuizPreviewPage from "./pages/PreviewPage/PreviewPage";
import DashboardQuizzes from "./pages/DashboardQuizzes/DashboardQuizzes";
import QuizTakingPage from "./pages/QuizTakingPage/QuizTakingPage";
import ScoreBoard from "./pages/ScoreBoard/ScoreBoard";
import Activities from "./pages/Activities/Activities";
/* import Dashboard from "./pages/Dashboard";
import PageOne from "./pages/PageOne"; // Quiz questions page
import PageTwo from "./pages/PageTwo"; // Quiz settings page
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import TakeQuiz from "./pages/TakeQuiz";
import NotFound from "./pages/NotFound"; */

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landingpage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/dashboard/home" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/quiz-questions" element={<ProtectedRoute><QuizPageOne /></ProtectedRoute>} />
        <Route path="/create-quiz" element={<ProtectedRoute><QuizSettings /></ProtectedRoute>} />
        <Route path="/preview-quiz" element={<ProtectedRoute><QuizPreviewPage /></ProtectedRoute>} />
        <Route path="/dashboard/quizzes" element={<ProtectedRoute><DashboardQuizzes /></ProtectedRoute>} />        
        <Route path="/take-quiz/:id" element={<QuizTakingPage />} />
        <Route path="/score-board/:id" element={<ProtectedRoute><ScoreBoard /> </ProtectedRoute>} />
        <Route path="/dashboard/activities" element = {<ProtectedRoute><Activities /> </ProtectedRoute>} />
        {/* <Route path="/result/:id" element
        
        <Route path="/" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/create-quiz" element={<ProtectedRoute><PageTwo /></ProtectedRoute>} />
        <Route path="/add-questions" element={<ProtectedRoute><PageOne /></ProtectedRoute>} />
        <Route path="/take-quiz/:quizId" element={<ProtectedRoute><TakeQuiz /></ProtectedRoute>} />
        <Route path="*" element={<NotFound />} /> */}
        {/* Fallback Redirects */}
        <Route path="/dashboard/*" element={<Navigate to="/dashboard/home" replace />} />
        <Route path="/auth/*" element={<Navigate to="/signin" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
