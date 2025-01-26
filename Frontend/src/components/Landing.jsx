import React from 'react';
import ChatImg from '../images/WebChat.png';
import { useNavigate } from 'react-router-dom';
import '../styles/Home.css';
import TypewriterEffect from '../SideEffects/TypeWriter';
export default function Landing() {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/login');
  };

  const handleRegister = () => {
    navigate('/register');
  };

  return (
    <div
  className="home-container flex flex-col md:flex-row items-center justify-between h-screen"
>
      {/* Left Section */}
      {/* <div className="image-section hidden md:block flex-1 h-full relative">
        <img
          className="w-full h-full object-cover opacity-90"
          src={ChatImg}
          alt="Chat Illustration"
        />
        <div className="overlay absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
      </div> */}

      {/* Right Section */}
      <div className="content-section flex-1 flex flex-col items-center justify-center text-white gap-8 px-6 md:px-12">
        <h1 className="text-4xl md:text-6xl font-bold text-center animate-fade-in">
          {/* Welcome to <span className="text-blue-400">WebChat</span> */}
          <TypewriterEffect/>
        </h1>
        <p className="text-lg md:text-xl text-gray-300 text-center animate-fade-in">
          Connect with friends and family in real time with ease.
        </p>
        <div className="buttons flex flex-col md:flex-row gap-6 animate-slide-up">
          <button
            className="flex items-center justify-center w-[12rem] md:w-[14rem] h-[3rem] text-lg bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg hover:scale-105 transition-transform shadow-lg"
            onClick={handleLogin}
          >
            <i className="fas fa-sign-in-alt mr-2"></i> Login
          </button>
          <button
            className="flex items-center justify-center w-[12rem] md:w-[14rem] h-[3rem] text-lg bg-gradient-to-r from-green-500 to-teal-500 rounded-lg hover:scale-105 transition-transform shadow-lg"
            onClick={handleRegister}
          >
            <i className="fas fa-user-plus mr-2"></i> Register
          </button>
        </div>
      </div>
    </div>
  );
}
