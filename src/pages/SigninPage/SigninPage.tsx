import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { baseUrl } from "../../utils";

const SignIn = () => {
  
    const [email, setEmail] = useState("");  
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    function validateEmail(email:any) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    const navigate = useNavigate();
    
    const handleSignIn = async (e:any) => {
        e.preventDefault();
        console.log(email, password)
        if (!validateEmail(email)) {
            setErrorMessage("Invalid email address.");
            return;
        }
        if (!email || !password) {
            setErrorMessage("Invalid Login Details");
            return;
        }

        setIsLoading(true);
        const toastId = toast.loading("Signing in...");
        try {
            const response = await fetch(`${baseUrl}/users/signin`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email,
                    password
                })
            });
            const data = await response.json();
            console.log(data);
            if (data.token) {
                sessionStorage.setItem('token', data.token);
                sessionStorage.setItem('user', JSON.stringify(data.user));
                toast.success('Signin successful! Redirecting to main page...');
                
                //If redirect path exists in sessionStorage, redirect to that path else redirect to dashboard
                const redirectPath = sessionStorage.getItem('redirectPath');
                if (redirectPath) {
                    sessionStorage.removeItem('redirectPath');
                    setTimeout(() => {
                        navigate(redirectPath);
                    }, 1000);
                } else {
                    navigate('/dashboard/home');
                }

            } else {
                toast.error(data.message || 'Signup failed. Please try again.');
            }
        } catch (error) {
            console.error('Signup Error:', error);
            toast.error('An error occurred. Please try again.');
        } finally {
            toast.dismiss(toastId)
            setIsLoading(false);
        }
    };
    

    return (
        <div className="flex flex-col min-h-screen w-full bg-white">
            {/* Navbar */}
            <nav className="fixed top-0 w-full bg-white shadow-md z-50 px-5 py-2.5 flex justify-end items-center">
           
                <Link to="/signup" className="bg-[#5a0b4d] text-white text-sm py-1 px-3 rounded hover:bg-[#5a0b4d] transition-colors">
                    Sign Up
                </Link>
            </nav>

            {/* Main Container */}
            <div className="flex md:min-h-screen mt-[50px] flex-col md:flex-row">
                {/* Left Panel */}
                <div className="flex-[0.8] bg-[#1b496f] text-white flex flex-col justify-center items-center p-5 text-center w-full">
                    <img src="Group 2 anyi[1].png" alt="Logo" className="w-[100px]" />
                    <h1 className="font-bold">Welcome IQ Buddy!</h1>
                    <p className="mt-3 text-sm whitespace-nowrap">
                    Here at the IQ community, we help <br /> you challenge and prove your mind's prowess <br /> by unlocking achievements and climbing the IQers' <br /> leaderboard with each question conquered. Have fun!
                    </p>
                </div>

                {/* Right Panel */}
                <div className="flex-[0.8] flex justify-center items-center p-5 py-10 text-sm relative">
                    <img src="icomoon-free_book.png" alt="Book Icon" className="w-20 h-20 absolute top-[70px] right-[10px]" />
                    
                    <div className="bg-white p-5 w-full max-w-[400px]">
                        <div className="mb-5 text-center relative">
                            <h2 className="font-bold text-[#5a0b4d] mt-3 text-2xl lg:text-3xl mb-1">Sign In</h2>
                            <p className="font-bold text-sm">Sign in to your IQ account</p>
                        </div>

                        {errorMessage && (
                            <div className="bg-[#ffebee] text-[#c62828] p-2 rounded-md text-center mt-3">{errorMessage}</div>
                        )}

                        
                        <form className='mt-4 space-y-5 w-full max-w-[400px]' >
                            <div className="space-y-1">                                                        
                                <label className="flex items-center gap-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-person" viewBox="0 0 16 16">
                                    <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6m2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0m4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4m-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10s-3.516.68-4.168 1.332c-.678.678-.83 1.418-.832 1.664z"/>
                                    </svg>
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    className="w-full h-[35px] text-sm rounded-[0.5px] border p-2 focus:outline-none"
                                    placeholder="Email Address"
                                    
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            
                            
                            <div className="space-y-2">
                                <label className="flex items-center gap-2">
                                    <img src="icon.png" alt="Password Icon" /> Password
                                </label>
                                <input
                                    type="password"
                                    className="w-full h-[35px] text-sm rounded-[0.5px] border p-2 focus:outline-none"
                                    placeholder="******"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    
                                />
                            </div>

                            <div className="flex justify-between items-center mb-4">
                            
                                <label className="flex items-center text-sm">
                                    <input type="checkbox" className="mr-2" /> Remember me
                                </label>
                                <Link to="/reset" className="text-blue-600 text-sm">Forgot Password?</Link>
                            </div>


                            <button 
                                disabled={isLoading}
                                onClick={handleSignIn} className="cursor-pointer w-full h-8 text-sm rounded-[0.5px] bg-[#2972ad] text-white hover:shadow-[0_4px_6px_#5a0b4d] hover:border-[#5a0b4d] hover:border transition-shadow disabled:opacity-90">
                            
                                {isLoading ? 'Processing...' : 'Sign In'}
                            </button>
                        </form>

                        <div className="text-center mt-4">
                            <span className="text-sm">Don't have an account? </span>
                            <Link to="/signup" className="text-[#5a0b4d]">Sign Up</Link>
                        </div>
                    </div>
                </div>
            </div>      
            <Toaster />
        </div>
);
};

export default SignIn;
