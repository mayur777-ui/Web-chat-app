import React, { useState, useEffect, useRef } from 'react';
import defaultpic from '../images/default.jpg';
import { Send, ArrowLeft } from 'lucide-react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import useSound from 'use-sound';
import { motion } from 'framer-motion';
import { useTheme } from '../hooks/ThemHook';
// import Picker from '@emoji-mart/react';
// import data from '@emoji-mart/data';

export default function ChatBox() {
  const navigate = useNavigate();
  const { connectionId, id } = useParams();
  const [logUser, setLogUser] = useState({});
  const token = localStorage.getItem('token');
  const [receiverDetails, setReceiverDetails] = useState({});
  const [messages, setMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = useRef(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const USER_API_END_POINT = 'http://localhost:5000/message';
  const { isDarkMode } = useTheme();
  const [playSound] = useSound('/sound.mp3', { volume: 1 });
  const[showEmojiPicker, setShowEmojiPicker] = useState(false);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const socketRef = useRef(null);
  useEffect(() => {
    socketRef.current = io('http://localhost:5000', {
      withCredentials: true,
      query: { userId: logUser._id },
      auth: { token },
    });

    socketRef.current.on('connect', () => {
      socketRef.current.emit('userConnected', logUser);
    });

    socketRef.current.on('newMessage', (message) => {
      setMessages((prev) => [...prev, message]);
      playSound();
    });

    socketRef.current.on('userTyping', ({ senderId }) => {
      if (senderId === connectionId) {
        setIsTyping(true);
      }
    });

    socketRef.current.on('userStoppedTyping', ({ senderId }) => {
      if (senderId === connectionId) {
        setIsTyping(false);
      }
    });

    socketRef.current.on('connect_error', (err) => {
      console.error('Socket connection error:', err);
    });

    return () => {
      socketRef.current.emit('stopTyping', {
        senderId: logUser._id,
        receiverId: connectionId,
      });
      socketRef.current.disconnect();
    };
  }, [logUser._id, connectionId, playSound, token]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/user/getDetails/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setLogUser(response.data.user);
      } catch (err) {
        console.error('Error:', err);
      }
    };
    fetchUser();
  }, [id, token]);

  useEffect(() => {
    const chatUserInfo = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/user/getDetails/${connectionId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setReceiverDetails(res.data.user);
      } catch (err) {
        console.error('Error:', err);
      }
    };
    chatUserInfo();
  }, [connectionId, token]);

  useEffect(() => {
    const fetchMessage = async () => {
      try {
        const res = await axios.get(`${USER_API_END_POINT}/get/${connectionId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMessages(res.data.messages || []);
        // console.log('Messages:', res.data.messages);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };
    fetchMessage();
  }, [connectionId, token]);

  const handleTyping = () => {
    if (!socketRef.current || !logUser._id || !connectionId) return;

    socketRef.current.emit('typing', {
      senderId: logUser._id,
      receiverId: connectionId,
    });

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      socketRef.current.emit('stopTyping', {
        senderId: logUser._id,
        receiverId: connectionId,
      });
    }, 3000);
  };

  const handleInputChange = (e) => {
    setCurrentMessage(e.target.value);
    handleTyping();
  };

  const handleSendMessage = async () => {
    if (currentMessage.trim() === '') return;
    const newMessage = { content: currentMessage, sender: logUser._id, receiver: connectionId };
    setMessages((prev) => [...prev, newMessage]);
    try {
      await axios.post(
        `${USER_API_END_POINT}/send/${connectionId}`,
        { content: currentMessage },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      socketRef.current.emit('sendMessage', newMessage);
    } catch (err) {
      console.error(err);
    }
    setCurrentMessage('');
    inputRef.current?.focus();

    socketRef.current.emit('stopTyping', {
      senderId: logUser._id,
      receiverId: connectionId,
    });
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleBack = () => {
    socketRef.current.emit('stopTyping', {
      senderId: logUser._id,
      receiverId: connectionId,
    });
    navigate(-1);
  };

  const [deviceType, setDeviceType] = useState('desktop');
  useEffect(() => {
    const handleResize = () => {
      setDeviceType(window.innerWidth <= 768 ? 'mobile' : 'desktop');
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col w-full h-screen bg-neutral-50 dark:bg-gradient-to-br dark:from-neutral-900 dark:to-neutral-800 transition-colors duration-300 font-sans"
    >
      {/* Header */}
      <div className="flex items-center p-3 bg-neutral-100/70 dark:bg-neutral-800/70 backdrop-blur-lg shadow-md rounded-b-lg">
        {deviceType === 'mobile' && (
          <motion.button
            whileHover={{ scale: 1.1 }}
            onClick={handleBack}
            className="mr-3 p-3.5 rounded-full bg-neutral-200/50 dark:bg-neutral-700/50 text-text-primary dark:text-text-primaryDark hover:bg-neutral-300 dark:hover:bg-neutral-600 transition-colors"
            aria-label="Back to connections"
          >
            <ArrowLeft size={20} />
          </motion.button>
        )}
        <div className="relative">
          <img
            src={defaultpic}
            className="w-10 h-10 md:w-12 md:h-12 rounded-full border-2 border-neutral-300 dark:border-neutral-700"
            alt="Connection"
          />
          <span
            className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white dark:border-neutral-900 ${
              receiverDetails.status === 'online' ? 'bg-green-400' : 'bg-red-400'
            }`}
          ></span>
        </div>
        <div className="ml-4">
          <h1 className="text-lg font-semibold text-text-primary dark:text-text-primaryDark">
            {receiverDetails.name}
          </h1>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            {/* {receiverDetails.status === 'online' ? 'Online' : `Last seen ${new Date().toLocaleTimeString()}`} */}
          </p>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2 md:space-y-4" role="region" aria-label="Chat messages">
        {messages.map((message, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={`flex ${message.sender?.toString() === logUser._id?.toString() ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[70%] p-3 rounded-2xl shadow-md ${
                message.sender?.toString() === logUser._id?.toString()
                  ? 'bg-primary-500 text-white'
                  : 'bg-neutral-200/70 dark:bg-neutral-700/70 text-text-primary dark:text-text-primaryDark'
              }`}
            >
              <p>{message.content}</p>
              <p className="text-[9px] text-right mt-1 text-gray-400 dark:text-gray-500 opacity-60 leading-tight">
  <span className="block">
    {new Date(Number(message.date)).toLocaleTimeString()}
  </span>
  <span className="block opacity-50">
    {new Date(Number(message.date)).toLocaleDateString()}
  </span>
</p>

            </div>
          </motion.div>
        ))}
        <div ref={messagesEndRef} />
        {isTyping && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.3 }}
            className="fle justify-start"
            role="status"
            aria-live="polite"
          >
            <div className="flex items-center gap-1 bg-neutral-200 dark:bg-neutral-700 px-3 py-1 rounded-full text-neutral-500 dark:text-neutral-400 text-sm">
              <span
                className="inline-block w-2 h-2 bg-neutral-500 dark:bg-neutral-400 rounded-full animate-dot-pulse"
                style={{ animationDelay: '0s' }}
              ></span>
              <span
                className="inline-block w-2 h-2 bg-neutral-500 dark:bg-neutral-400 rounded-full animate-dot-pulse"
                style={{ animationDelay: '0.2s' }}
              ></span>
              <span
                className="inline-block w-2 h-2 bg-neutral-500 dark:bg-neutral-400 rounded-full animate-dot-pulse"
                style={{ animationDelay: '0.4s' }}
              ></span>
              <span>{receiverDetails.name} is typing...</span>
            </div>
          </motion.div>
        )}
      </div>

      {/* Send Box */}
      <div className="flex items-center p-3 border-t border-neutral-200/50 dark:border-neutral-700/50 bg-neutral-100/70 dark:bg-neutral-800/70 backdrop-blur-lg sticky bottom-0">
        <motion.button
          whileHover={{ scale: 1.1 }}
          className="p-2 rounded-full bg-neutral-200/50 dark:bg-neutral-700/50 text-text-primary dark:text-text-primaryDark hover:bg-neutral-300 dark:hover:bg-neutral-600"
          aria-label="Open emoji picker"
        >
          😊
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.1 }}
          className="p-2 rounded-full bg-neutral-200/50 dark:bg-neutral-700/50 text-text-primary dark:text-text-primaryDark hover:bg-neutral-300 dark:hover:bg-neutral-600 ml-2"
          aria-label="Attach file"
        >
          📎
        </motion.button>
        <input
          ref={inputRef}
          type="text"
          className="flex-1 p-3 mx-2 rounded-full bg-neutral-200/50 dark:bg-neutral-700/50 text-text-primary dark:text-text-primaryDark focus:ring-2 focus:ring-primary-500 focus:outline-none placeholder:text-neutral-400 dark:placeholder:text-neutral-500 transition-all"
          placeholder="Type a message..."
          value={currentMessage}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          aria-label="Type and send a message"
        />
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="p-3.5 rounded-full bg-primary-500 text-white hover:bg-primary-600 transition-colors"
          onClick={handleSendMessage}
          aria-label="Send message"
        >
          <Send size={20} />
        </motion.button>
      </div>
    </motion.div>
  );
}