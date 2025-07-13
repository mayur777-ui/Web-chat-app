import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTheme } from '../hooks/ThemHook';
import { FaMoon, FaSun } from 'react-icons/fa';
import { GoogleLogin } from '@react-oauth/google';

export default function Register() {
  const USER_API_END_POINT = 'https://webchat-backend-658o.onrender.com/user';
  const [input, setInput] = useState({ name: '', email: '', password: '' });
  const [errors, setErrors] = useState({
    nameError: '',
    emailError: '',
    passwordError: '',
    allError: '',
  });
  const [showAlert, setShowAlert] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const navigate = useNavigate();
  const { isDarkMode, toggleTheme } = useTheme();

  const handleGoogleLogin = async (response) => {
    try{
      let googleToken = response.credential;
      // console.log('Google token received:', googleToken); 
      const res = await axios.post(`${USER_API_END_POINT}/googellogin`, {token:googleToken});
      // console.log('Google login response:', res.data);
       const token = res.data.token;
       localStorage.setItem('token', token);
       let id = res.data.id;
       navigate(`/Home/${id}`, { replace: true });
    }catch (error) {
      console.log("Google login error:", error.message);
      setErrors((prevErrors) => ({
        ...prevErrors,
        nameError:'',
        emailError: '',
        passwordError: '',
        allError: error.response?.data?.message || 'Google login failed. Please try again.',
      }));
      setShowAlert(true);
    }
  }
  const handleInput = (e) => {
    const { name, value } = e.target;
    setInput({ ...input, [name]: value });
    setErrors((prev) => ({ ...prev, [name + 'Error']: '', allError: '' }));
    setShowAlert(false); // Hide alert when user starts typing
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errorToSet = { nameError: '', emailError: '', passwordError: '', allError: '' };

    if (!input.name && !input.email && !input.password) {
      errorToSet.allError = 'Please fill all required fields!';
    }
    if (!input.name) {
      errorToSet.allError = 'Please fill your name!';
      errorToSet.nameError = 'Username is required!';
    }
    const emailPtrn = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!input.email) {
      errorToSet.allError = 'Please fill your email!';
      errorToSet.emailError = 'Email is required!';
    } else if (!emailPtrn.test(input.email)) {
      errorToSet.allError = 'Enter a valid email!';
      errorToSet.emailError = 'Enter a valid email!';
    }
    if (!input.password) {
      errorToSet.allError = 'Please fill your password!';
      errorToSet.passwordError = 'Password is required!';
    } else if (input.password.length < 8 || input.password.length > 20) {
      errorToSet.allError = 'Password must be between 8 to 20 characters long!';
      errorToSet.passwordError = 'Password length must be between 8 to 20 characters!';
    } else {
      const passwordPtrn = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/;
      if (!passwordPtrn.test(input.password)) {
        errorToSet.allError = 'Password format is invalid!';
        errorToSet.passwordError =
          'Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character!';
      }
    }

    setErrors(errorToSet);
    if (errorToSet.nameError || errorToSet.emailError || errorToSet.passwordError || errorToSet.allError) {
      setShowAlert(true); // Show alert for errors
      return;
    }

    try {
      const response = await axios.post(`${USER_API_END_POINT}/register`, input, {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true,
      });
      const token = response.data.token;
      localStorage.setItem('token', token);
      setInput({ name: '', email: '', password: '' });
      const id = response.data.user._id;
      navigate(`/Home/${id}`, { replace: true });
    } catch (e) {
      if (e.response?.status === 409) {
        setErrors({ ...errors, allError: 'With this email user already exists!' });
      } else {
        setErrors({ ...errors, allError: 'Registration failed. Please try again!' });
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
          Sign Up
        </motion.h1>
        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-6" noValidate>
          <div className="flex flex-col gap-2">
            <label
              htmlFor="name"
              className={`text-lg font-medium font-sans ${
                isDarkMode ? 'text-text-secondaryDark' : 'text-text-secondary'
              }`}
            >
              Username
            </label>
            <input
              id="name"
              name="name"
              type="text"
              placeholder="Enter your username"
              className={`w-full px-4 py-3 rounded-lg shadow-inner focus:ring-2 focus:ring-primary-500 focus:outline-none transition duration-200 ${
                isDarkMode
                  ? 'bg-neutral-700/50 text-text-primaryDark placeholder-neutral-400'
                  : 'bg-neutral-200/50 text-text-primary placeholder-neutral-400'
              }`}
              value={input.name}
              onChange={handleInput}
              aria-describedby={errors.nameError ? 'name-error' : undefined}
            />
          </div>
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
              aria-describedby={errors.emailError ? 'email-error' : undefined}
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
                aria-describedby={errors.passwordError ? 'password-error' : undefined}
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
           
          </div>
          <motion.button
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`btn w-full py-3 mt-4 ${
              isDarkMode
                ? 'bg-primary-500 text-neutral-50 hover:bg-primary-600'
                : 'bg-primary-500 text-neutral-50 hover:bg-primary-600'
            } font-semibold font-sans rounded-lg transition duration-200 shadow-md`}
          >
            Sign Up
          </motion.button>
          <div className="flex items-center w-full gap-2 text-sm text-gray-400">
        <div className="flex-1 h-px bg-gray-300 dark:bg-gray-700" />
        <span>or</span>
        <div className="flex-1 h-px bg-gray-300 dark:bg-gray-700" />
      </div>

  <div className="w-[200px] m-auto rounded-xl border overflow-hidden">
  <GoogleLogin
    onSuccess={handleGoogleLogin}
    
    // onError={() =>
    //   setErrors({ google: 'Google login failed. Please try again.' })
    // }
  />
</div>
        </form>
        <p
          className={`mt-6 text-sm font-sans ${
            isDarkMode ? 'text-text-secondaryDark' : 'text-text-secondary'
          }`}
        >
          Already have an account?{' '}
          <Link
            to="/login"
            className={`${
              isDarkMode ? 'text-primary-300' : 'text-primary-500'
            } hover:underline transition duration-200`}
          >
            Log In
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
            {errors.allError && <p id="all-error" className="text-red-400">{errors.allError}</p>}
            {errors.nameError && <p id="name-error" className="text-red-400">{errors.nameError}</p>}
            {errors.emailError && <p id="email-error" className="text-red-400">{errors.emailError}</p>}
            {errors.passwordError && <p id="password-error" className="text-red-400">{errors.passwordError}</p>}
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
