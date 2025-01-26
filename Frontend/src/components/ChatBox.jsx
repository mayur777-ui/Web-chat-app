import React, { useState, useEffect, useRef } from 'react';
import defaultpic from '../images/default.jpg';
import { Send } from 'lucide-react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { io } from 'socket.io-client';

export default function ChatBox() {
  let { connectionId } = useParams();
  let { id } = useParams();
  const [logUser, setLogUser] = useState({});
  const token = localStorage.getItem('token');
  const [reciverDetails, setReciverDetails] = useState({});
  const [messages, setMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const messagesEndRef = useRef(null);
  const USER_API_END_POINT = 'http://localhost:5000/message';
  let socket;

  // Scroll to the bottom of the chat when a new message arrives
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Socket connection setup
  useEffect(() => {
    socket = io('http://localhost:5000', {
      withCredentials: true,
      query: {
        userId: logUser._id,
      },
    });

    socket.emit('userConnected', logUser);

    socket.on('connected', (message) => {
      // console.log(message);
    });

    socket.on('newMessage', (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socket.disconnect();
    };
  }, [logUser]);

  // Fetch user details
  useEffect(() => {
    let fetchUser = async () => {
      try {
        let response = await axios.get(`http://localhost:5000/user/getDetails/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setLogUser(response.data.user);
      } catch (err) {
        console.error('Error:', err);
      }
    };
    fetchUser();
  }, [id]);

  // Fetch receiver details
  useEffect(() => {
    let chatUserInfo = async () => {
      let res = await axios.get(`http://localhost:5000/user/getDetails/${connectionId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setReciverDetails(res.data.user);
    };
    chatUserInfo();
  }, [connectionId]);

  // Handle sending message
  const handleSendMessage = async () => {
    if (currentMessage.trim() === '') return;

    try {
      // Send the message via API
      let response = await axios.post(
        `${USER_API_END_POINT}/send/${connectionId}`,
        { content: currentMessage },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // // Emit the message to the server using socket
      // socket.emit('sendMessage', {
      //   sender: logUser._id,
      //   receiver: connectionId,
      //   content: currentMessage,
      // });

      setMessages((prev) => [...prev, response.data.newMessage]);
      setCurrentMessage('');
    } catch (err) {
      console.log(err);
    }
  };

  // Fetch messages on load
  useEffect(() => {
    let fetchMessage = async () => {
      try {
        let res = await axios.get(`${USER_API_END_POINT}/get/${connectionId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMessages(res.data.messages || []);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };
    fetchMessage();
  }, [connectionId]);

  // Handle Enter key press
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col w-full h-screen bg-gray-100">
      {/* Header Section */}
      <div className="flex items-center p-4 bg-white shadow-md rounded-b-lg">
        <img src={defaultpic} className="w-12 h-12 rounded-full border-2 border-gray-200" alt="Connection" />
        <h1 className="ml-4 text-xl font-semibold text-gray-800">{reciverDetails.name}</h1>
      </div>

      {/* Chat Area */}
      <div className="flex flex-col-reverse w-full h-full overflow-auto p-4">
        <div className="flex flex-col space-y-4">
          {messages.map((message, i) => (
            <div key={i} className={`flex ${message.sender === id ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-xs p-3 rounded-lg ${message.sender === 'You' ? 'bg-blue-500 text-white' : 'bg-gray-300 text-black'}`}>
                {message.content}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Send Box */}
      <div className="flex items-center p-4 border-t-2 border-gray-200">
        <input
          type="text"
          className="flex-grow p-4 rounded-full bg-gray-200 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
          placeholder="Type a message..."
          value={currentMessage}
          onChange={(e) => setCurrentMessage(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button
          className="ml-4 p-3 rounded-full bg-blue-500 text-white hover:bg-blue-600 active:bg-blue-700 transition-colors"
          onClick={handleSendMessage}
        >
          <Send size={24} />
        </button>
      </div>
    </div>
  );
}
