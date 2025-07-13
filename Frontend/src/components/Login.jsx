import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTheme } from '../hooks/ThemHook';
import { FaMoon, FaSun } from 'react-icons/fa';
import { GoogleLogin } from '@react-oauth/google';
export default function Login() {
  const USER_API_END_POINT = 'https://webchat-backend-658o.onrender.com/user';
  const [input, setInput] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({ email: '', password: '', google: '',both: '' });
  const [showAlert, setShowAlert] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const navigate = useNavigate();
  const { isDarkMode, toggleTheme } = useTheme();
  const [email, setEmail] = useState('');
  const handleInput = (e) => {
    const { name, value } = e.target;
    setInput({ ...input, [name]: value });
    setErrors({ ...errors, [name]: '', both: '' });
    setShowAlert(false); // Hide alert when user starts typing
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errorToSet = { email: '', password: '', google: '',both: '' };

    if (!input.email) {
      errorToSet.email = 'Email is required!';
      // errorToSet.both = 'Email is required!';
    }
    if (!input.password) {
      errorToSet.password = 'Password is required!';
      // errorToSet.both = 'Password is required!';
    }
    if (!input.email && !input.password) {
      errorToSet.both = 'Please fill all required fields!';
    }

    setErrors(errorToSet);
    if (errorToSet.both || errorToSet.email || errorToSet.password) {
      setShowAlert(true); // Show alert for errors
      return;
    }

    try {
      const res = await axios.post(`${USER_API_END_POINT}/login`, input, {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true,
      });
      const token = res.data.token;
      localStorage.setItem('token', token);
      setInput({ email: '', password: '' });
      const id = res.data.id;
      navigate(`/Home/${id}`, { replace: true });
    } catch (e) {
      if (e.response?.status === 404) {
        setErrors({ ...errors, both: 'User does not exist!', email: '', password: '' });
      } else if (e.response?.status === 400) {
        setErrors({ ...errors, both: 'Invalid credentials', email: '', password: '' });
      } else {
        setErrors({ ...errors, both: 'Internal server error', email: '', password: '' });
      }
      setShowAlert(true); // Show alert for server errors
    }
  };

  // Auto-dismiss alert after 2 seconds
  useEffect(() => {
    if (showAlert) {
      const timer = setTimeout(() => {
        setShowAlert(false);
      }, 2000);
      return () => clearTimeout(timer); // Cleanup timer
    }
  }, [showAlert]);

  const togglePassword = () => setShowPassword(!showPassword);

  const handleForgotPassword = () => {
    setShowForgotModal(true); // Show forgot password modal
  };

  const closeForgotModal = () => {
    setShowForgotModal(false);
  };

  // Google Login Handler
  const handleGoogleLogin = async (response) => {
    try{
      let googleToken = response.credential;
      console.log('Google token received:', googleToken); 
      const res = await axios.post('https://webchat-backend-658o.onrender.com/user/googellogin', {token:googleToken});
      // console.log('Google login response:', res.data);
       const token = res.data.token;
       localStorage.setItem('token', token);
       let id = res.data.id;
       navigate(`/Home/${id}`, { replace: true });
    }catch (error) {
      console.log("Google login error:", error.message);
      setErrors((prevErrors) => ({
        ...prevErrors,
        google: 'Google login failed. Please try again.',
        email: '',
        password: '',
        both: ''
      }));
      setShowAlert(true);
    }
  }

  const handelEmailChange = (e) =>{
    // console.log('Email changed:', e.target.value);
    setEmail(e.target.value);
  }
  // Forgot Password Modal Logic 
 const handleForgotPasswordSubmit = async (e) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) {
    setErrors({ email: 'Email is required!' });
    setShowAlert(true);
    return;
  } else if (!emailRegex.test(email)) {
    setErrors({ email: 'Enter a valid email address!' });
    setShowAlert(true);
    return;
  }

  localStorage.setItem('email', email);
  try {
    const res = await axios.post(`${USER_API_END_POINT}/forgotpassword`, { email });

    // if (res.status !== 200) {
    //   setErrors({ email: res.data.message });
    //   setShowAlert(true);
    //   return;
    // }
  
    setEmail('');
    navigate('/otp');
  } catch (error) {
    if (error.response && error.response.data) {
      setErrors({ email: error.response.data.message });
      setShowAlert(true);
    } else {
      setErrors("Something went wrong. Please try again.");
    }
  } 
};



  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className={`min-h-screen flex items-center justify-center px-4 sm:px-6 md:px-8 ${
        isDarkMode
          ? 'bg-gradient-to-br from-neutral-800 to-neutral-900'
          : 'bg-neutral-50'
      }`}
    >
      <div
        className={`w-full max-w-md ${
          isDarkMode
            ? 'bg-neutral-800/50 backdrop-blur-md'
            : 'bg-neutral-100/50 backdrop-blur-md'
        } rounded-2xl shadow-xl p-8 flex flex-col items-center`}
      >
        <motion.h1
          initial={{ y: 20 }}
          animate={{ y: 0 }}
          className={`text-3xl sm:text-4xl font-bold font-sans mb-6 ${
            isDarkMode ? 'text-primary-300' : 'text-primary-500'
          }`}
        >
          Login
        </motion.h1>
        <form className="w-full flex flex-col gap-6" onSubmit={handleSubmit} noValidate>
          <div className="flex flex-col gap-2">
            <label
              htmlFor="email"
              className={`text-lg font-medium font-sans ${
                isDarkMode ? 'text-text-secondaryDark' : 'text-text-secondary'
              }`}
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              name="email"
              placeholder="Enter your email"
              className={`w-full px-4 py-3 rounded-lg shadow-inner focus:ring-2 focus:ring-primary-500 focus:outline-none transition duration-200 ${
                isDarkMode
                  ? 'bg-neutral-700/50 text-text-primaryDark placeholder-neutral-400'
                  : 'bg-neutral-200/50 text-text-primary placeholder-neutral-400'
              }`}
              value={input.email}
              onChange={handleInput}
              aria-describedby={errors.email ? 'email-error' : undefined}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label
              htmlFor="password"
              className={`text-lg font-medium font-sans ${
                isDarkMode ? 'text-text-secondaryDark' : 'text-text-secondary'
              }`}
            >
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="Enter your password"
                className={`w-full px-4 py-3 pr-20 rounded-lg shadow-inner focus:ring-2 focus:ring-primary-500 focus:outline-none transition duration-200 ${
                  isDarkMode
                    ? 'bg-neutral-700/50 text-text-primaryDark placeholder-neutral-400'
                    : 'bg-neutral-200/50 text-text-primary placeholder-neutral-400'
                }`}
                value={input.password}
                onChange={handleInput}
                aria-describedby={errors.password ? 'password-error' : undefined}
              />
              {input.password && (
  <button
    type="button"
    onClick={togglePassword}
    className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium 
               px-2 py-1 rounded-md backdrop-blur-md bg-white/10 text-white 
               hover:bg-white/20 transition duration-200 border border-white/10"
    aria-label={showPassword ? 'Hide password' : 'Show password'}
  >
    {showPassword ? '🙈' : '👁️'}
  </button>
)}
            </div>
            <button
              type="button"
              onClick={handleForgotPassword}
              className={`text-sm font-sans text-right mt-2 ${
                isDarkMode ? 'text-primary-300 hover:text-primary-400' : 'text-primary-500 hover:text-primary-600'
              } transition duration-200`}
            >
              Forgot Password?
            </button>
          </div>
          <div className="flex flex-col items-center w-full gap-y-4 mt-4">
  <motion.button
    type="submit"
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    className={`btn w-full py-3 ${
      isDarkMode
        ? 'bg-primary-500 text-neutral-50 hover:bg-primary-600'
        : 'bg-primary-500 text-neutral-50 hover:bg-primary-600'
    } font-semibold font-sans rounded-lg transition duration-200 shadow-md`}
  >
    Sign In
  </motion.button>

   <div className="flex items-center w-full gap-2 text-sm text-gray-400">
        <div className="flex-1 h-px bg-gray-300 dark:bg-gray-700" />
        <span>or</span>
        <div className="flex-1 h-px bg-gray-300 dark:bg-gray-700" />
      </div>

  <div className="w-[200px] rounded-xl border overflow-hidden">
  <GoogleLogin
    onSuccess={handleGoogleLogin}
    // onError={() =>
    //   setErrors({ google: 'Google login failed. Please try again.' })
    // }
  />
</div>
</div>


        </form>

        <p
          className={`mt-6 text-sm font-sans ${
            isDarkMode ? 'text-text-secondaryDark' : 'text-text-secondary'
          }`}
        >
          Don't have an account?{' '}
          <Link
            to="/register"
            className={`${
              isDarkMode ? 'text-primary-300' : 'text-primary-500'
            } hover:underline transition duration-200`}
          >
            Sign Up
          </Link>
        </p>
      </div>

      {/* Error Alert */}
      {showAlert && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className={`fixed top-6 left-1/2 -translate-x-1/2 max-w-sm w-full p-4 rounded-lg shadow-lg border border-red-500/50 ${
            isDarkMode
              ? 'bg-neutral-800/90 text-text-primaryDark'
              : 'bg-neutral-50/90 text-text-primary'
          } backdrop-blur-md z-50`}
          role="alert"
          aria-live="assertive"
        >
          <div className="flex flex-col gap-2 text-sm">
            {errors.both && <p id="both-error" className="text-red-400">{errors.both}</p>}
            {errors.email && <p id="email-error" className="text-red-400">{errors.email}</p>}
            {errors.password && <p id="password-error" className="text-red-400">{errors.password}</p>}
            {errors.google && <p id="google-error" className="text-red-400">{errors.google}</p>}
          </div>
        </motion.div>
      )}

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className="modal modal-open"
        >
          <div
            className={`modal-box ${
              isDarkMode ? 'bg-neutral-800 text-text-primaryDark' : 'bg-neutral-50 text-text-primary'
            }`}
          >
            <h3 className="font-bold text-lg font-sans">Reset Password</h3>
            <p className="py-4">Enter your email to receive a password reset link.</p>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={handelEmailChange}
              className={`w-full px-4 py-3 rounded-lg shadow-inner focus:ring-2 focus:ring-primary-500 focus:outline-none transition duration-200 ${
                isDarkMode
                  ? 'bg-neutral-700/50 text-text-primaryDark placeholder-neutral-400'
                  : 'bg-neutral-200/50 text-text-primary placeholder-neutral-400'
              }`}
              // value={input.email}
            />
            <div className="modal-action">
              <button
                onClick={closeForgotModal}
                className={`btn ${
                  isDarkMode
                    ? 'bg-neutral-600 text-text-primaryDark hover:bg-neutral-700'
                    : 'bg-neutral-200 text-text-primary hover:bg-neutral-300'
                }`}
                aria-label="Cancel password reset"
              >
                Cancel
              </button>
              <button
                onClick={handleForgotPasswordSubmit} 
                className={`btn ${
                  isDarkMode
                    ? 'bg-primary-500 text-neutral-50 hover:bg-primary-600'
                    : 'bg-primary-500 text-neutral-50 hover:bg-primary-600'
                }`}
                aria-label="Send password reset link"
              >
                Send
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Theme Toggle */}
      <motion.button
        onClick={toggleTheme}
        className={`fixed bottom-8 right-8 p-3 rounded-full shadow-lg ${
          isDarkMode ? 'bg-neutral-700 hover:bg-neutral-600' : 'bg-neutral-50 hover:bg-neutral-100'
        }`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        aria-label={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
      >
        {isDarkMode ? (
          <FaMoon className="w-6 h-6 text-primary-400" />
        ) : (
          <FaSun className="w-6 h-6 text-primary-600" />
        )}
      </motion.button>
    </motion.div>
  );
}
