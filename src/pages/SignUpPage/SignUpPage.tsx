import  { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
//import { Pencil } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { baseUrl } from '../../utils';

const SignUp = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({
    hasMinLength: false,
    hasLetter: false,
    hasNumber: false
  });

  const validateEmail = (email:any) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const checkPasswordStrength = (password:any) => {
    setPasswordStrength({
      hasMinLength: password.length >= 8,
      hasLetter: /[a-zA-Z]/.test(password),
      hasNumber: /\d/.test(password)
    });
  };

  const isFormValid = () => {
    const { email, username } = formData;
    return (
      validateEmail(email) &&
      username.trim() !== '' &&
      Object.values(passwordStrength).every(Boolean)
    );
  };

  const handleSubmit = async (e:any) => {
    e.preventDefault();
    if (!isFormValid()) return;

    setIsLoading(true);
    const toastId = toast.loading("Signing up...");
    try {
      const response = await fetch(`${baseUrl}/users/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await response.json();

      if (data.token) {
        sessionStorage.setItem('token', data.token);
        sessionStorage.setItem('user', JSON.stringify(data.user));
        toast.success('Signup successful! Redirecting to main page...');
        navigate('/dashboard/home');
      } else {
        toast.error(data.message || 'Signup failed. Please try again.');
      }
    } catch (error) {
      console.error('Signup Error:', error);
      toast.error('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
      toast.dismiss(toastId);
    }
  };

  const handleChange = (e:any) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (name === 'password') {
      checkPasswordStrength(value);
    }
  };
  

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="fixed top-0 w-full bg-white shadow-md z-50 px-5 py-2.5 flex justify-end items-center">
        <Link to="/signin" className="bg-[#5a0b4d] text-white text-sm py-1 px-3 rounded hover:bg-[#5a0b4d] transition-colors">
          Sign In
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
          
          <div className="w-full bg-white p-5 rounded relative flex flex-col items-center justify-center">
            <div className="mb-5 text-center relative">
              <h2 className="font-bold text-[#5a0b4d] mt-3 text-2xl lg:text-3xl mb-1">Sign Up</h2>
              <p className="font-bold text-sm">Create your IQ account</p>
            </div>

            <form onSubmit={handleSubmit} className='space-y-5 w-full max-w-[400px]' >
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
                  
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-1">
                <label className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pencil" viewBox="0 0 16 16">
                                <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325"/>
                              </svg> Username
                </label>
                <input
                  type="text"
                  name="username"
                  className="w-full h-[35px] text-sm rounded-[0.5px] border p-2 focus:outline-none"
                  placeholder="Enter Username"
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2">
                  <img src="icon.png" alt="Password Icon" /> Password
                </label>
                <input
                  type="password"
                  name="password"
                  className="w-full h-[35px] text-sm rounded-[0.5px] border p-2 focus:outline-none"
                  placeholder="******"
                  onChange={handleChange}
                />
                <ul className="list-none mt-2">
                  {[
                    { condition: passwordStrength.hasMinLength, text: 'contain 8 characters' },
                    { condition: passwordStrength.hasLetter, text: 'Must contain a letter' },
                    { condition: passwordStrength.hasNumber, text: 'Must contain a number' }
                  ].map((item, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke={item.condition ? 'green' : 'red'}
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <circle cx="12" cy="12" r="10" />
                        <path d="M9 12l2 2 4-4" />
                      </svg>
                      {item.text}
                    </li>
                  ))}
                </ul>
              </div>

              <button
                type="submit"
                disabled={!isFormValid() || isLoading}
                className="cursor-pointer w-full h-8 text-sm rounded-[0.5px] bg-[#2972ad] text-white hover:shadow-[0_4px_6px_#5a0b4d] hover:border-[#5a0b4d] hover:border transition-shadow disabled:opacity-90"
              >
                {isLoading ? 'Processing...' : 'Sign Up'}
              </button>
            </form>

            <div className="text-center mt-5">
              <Link to="/signin" className="no-underline">
                <span className="text-black">Already have an account?</span>{' '}
                <span className="text-[#5a0b4d]">Sign In</span>
              </Link>
            </div>

            
          </div>
          <img src="icomoon-free_book.png" alt="Book Icon" className="w-20 h-20 absolute bottom-[10px] left-[10px]" />
        </div>
      </div>
      <Toaster />
    </div>
  );
};

export default SignUp;