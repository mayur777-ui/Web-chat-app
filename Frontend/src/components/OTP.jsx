import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
export default function OTP() {
  const navigate  = useNavigate();
  const [otp, setOtp] = useState({ otp1: '', otp2: '', otp3: '', otp4: '' });
  const USER_API_END_POINT = 'http://localhost:5000/user';
  const inputRefs = {
    otp1: useRef(null),
    otp2: useRef(null),
    otp3: useRef(null),
    otp4: useRef(null),
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (!/^\d?$/.test(value)) return;

    setOtp((prev) => ({ ...prev, [name]: value }));

    if (value && name !== 'otp4') {
      const next = `otp${parseInt(name.slice(3)) + 1}`;
      inputRefs[next].current.focus();
    }
  };

  const handleKeyDown = (e) => {
    // console.log(e);
    const { name, value } = e.target;

    if (e.key === 'Backspace' && !value) {
      const prev = `otp${parseInt(name.slice(3)) - 1}`;
      if (inputRefs[prev]) inputRefs[prev].current.focus();
    }
  };

  const otpValue = Object.values(otp).join('');

  const handleSubmit  = async(e) => {
    if(otpValue.length < 4){
      return alert("Please enter a valid OTP");
    }
    // console.log("OTP Submitted: ", otpValue);
    // if (typeof otpValue === "string") {
    //   alert("OTP Submitted: " + otpValue);
    // }
    try{
    let res = await axios.post(`${USER_API_END_POINT}/verifyOtp`, {otp: otpValue, email: localStorage.getItem("email")});
    console.log("OTP verified successfully:", res.data.userId);
    localStorage.setItem("userId", res.data.userId);
    setOtp({ otp1: '', otp2: '', otp3: '', otp4: '' });
    inputRefs.otp1.current.focus();
    navigate('/resetPassword');
    }catch(err){
      console.error("Error verifying OTP:", err);
      alert("Failed to verify OTP. Please try again.");
    }
  }

  return (
    <motion.div
      className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-indigo-100 to-indigo-300 p-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-sm">
        <h2 className="text-2xl font-bold text-center text-indigo-600 mb-6">
          Enter OTP
        </h2>
        <div className="flex justify-between gap-3">
          {['otp1', 'otp2', 'otp3', 'otp4'].map((key, index) => (
            <input
              key={key}
              name={key}
              type="text"
              maxLength={1}
              value={otp[key]}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              ref={inputRefs[key]}
              className="w-12 h-12 text-center text-xl rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            />
          ))}
        </div>

        <button
          className="w-full mt-6 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition-all duration-200"
          onClick={handleSubmit}
        >
          Verify OTP
        </button>
      </div>
    </motion.div>
  );
}
