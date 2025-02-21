import { ReactNode, useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Home, CreditCard, Award, Activity, LogOut } from "lucide-react";
import { MdMenu, MdClose } from 'react-icons/md';
import { toast } from "react-toastify";
import { Toaster } from "react-hot-toast";

const menuItems = [
  { name: "Home", icon: <Home size={20} />, path: "/dashboard/home" },
  { name: "Activities", icon: <Activity size={20} />, path: "#" },
  { name: "Quizzes", icon: <CreditCard size={20} />, path: "/dashboard/quizzes" },
  { name: "Certificates", icon: <Award size={20} />, path:  "#" },
];

const Sidebar = ({ isOpen, toggleSidebar }: { isOpen: boolean, toggleSidebar: () => void }) => {

    const navigate = useNavigate();
    const handleLogout = () => {
        sessionStorage.clear();
        toast.success("Logged out successfully.");
        setTimeout(() => {
            navigate("/signin");
        }, 1000);
    };
  
  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black opacity-40 md:hidden z-40" onClick={toggleSidebar}></div>
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-screen w-64 bg-white shadow-lg p-5 lg:p-8 z-50 md:hidden
          transform ${isOpen ? "translate-x-0" : "-translate-x-full"} 
          transition-transform md:translate-x-0`}
      >
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
              <img src="/Group 2 anyi[1].png" alt="Company Logo" className="max-w-14" />
              <span className="font-bold">IQ Quiz</span>
          </div>
          <button className="md:hidden text-gray-700" onClick={toggleSidebar}>
            <MdClose size={24} />
          </button>
        </div>

        <nav className="mt-7 lg:mt-8 space-y-3">
          {menuItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center px-4 py-3 text-gray-700 transition rounded ${isActive && item.path !== "#" ? "bg-[#0A4975] text-white" : "hover:bg-green-100"
                }`
              }
              onClick={toggleSidebar} // Close sidebar when a link is clicked on mobile
            >
              <span className="mr-3">{item.icon}</span>
              {item.name}
            </NavLink>
          ))}
        </nav>

        <button
          onClick={handleLogout}
          className="w-full flex items-center px-4 py-3 mt-3 text-gray-600 hover:bg-gray-200 rounded-md"
        >
            <LogOut size={20} className="mr-3" />
          Logout
        </button>
      </aside>
    </>
  )
};


const Header = ({ isOpen, toggleSidebar }: { isOpen: boolean, toggleSidebar: () => void }) => {
    const navigate = useNavigate();
    return (
        <header className="fixed top-0 left-0 w-full bg-white text-black px-6 md:px-16 py-2 
        flex justify-end md:justify-between items-center z-10 shadow h-16"
        >            
            <div className="hidden md:flex items-center gap-7">
                <img src="/Group 2 anyi[1].png" alt="Company Logo" className="max-w-14" />
                <NavLink to="/dashboard/home" className={({isActive}) => `${isActive ? 'font-bold' : 'font-normal'}`} >
                    <div className="flex items-center gap-2">
                        <Home size={16} />
                        <h1 className="text-lg">
                            Home
                        </h1>
                    </div>
                </NavLink>
                <NavLink to="/dashboard/activities" className={({isActive}) => `${isActive ? 'font-bold' : 'font-normal'}`} >
                    <div className="flex items-center gap-2">
                        <img src="/activity.svg" alt="activity" className="w-4" />
                        <h1 className="text-lg">
                            Activity
                        </h1>
                    </div>
                </NavLink>
                <NavLink to="/dashboard/quizzes" className={({isActive}) => `${isActive ? 'font-bold' : 'font-normal'}`} >
                    <div className="flex items-center gap-2">
                        <img src="/quiz.svg" alt="quiz" className="w-4" />
                        <h1 className="text-lg">
                            Quizes
                        </h1>
                    </div>
                </NavLink>
                
            </div>            
                
            {/* Icons and Profile */}
            <div className="flex items-center space-x-4">        
                <button
                    className="w-fit bg-[#5a0b4d] text-white px-4 py-1.5 rounded block mx-auto"
                    onClick={() => navigate('/create-quiz')}
                >
                Create
                </button>
                {/* Mobile Menu Button */}
                <button className="md:hidden" onClick={toggleSidebar}>
                {isOpen ? <MdClose size={24} /> : <MdMenu size={24} />}
                </button>
            </div>

        
        </header>
    );
};


const DashboardLayout = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };
  
  const navigate = useNavigate()  
  // Redirect to login page if not authenticated
  useEffect(() => { 
    const userData = JSON.parse(sessionStorage.getItem("user") || "{}");
    const isAuthenticated = !!userData._id;
    if (!isAuthenticated) {
      navigate("/auth/signin");
    }
  },[])

  return (
    <div className="md:flex">
      <Sidebar isOpen={isOpen} toggleSidebar={toggleSidebar} />
      <main className="min-h-screen w-full">
        <Header isOpen={isOpen} toggleSidebar={toggleSidebar} />
        <div className="mt-16">
          {children}
        </div>
      </main>
      <Toaster />
    </div>
  );
};

export default DashboardLayout;
