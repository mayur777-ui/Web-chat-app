import React, { useEffect, useState, useRef } from 'react';
import defaultImg from '../images/default.jpg';
import { UserRoundPlus, LogOut, Search, Sun, Moon, Menu, X,Bell } from 'lucide-react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useTheme } from '../hooks/ThemHook';
import { motion } from 'framer-motion';


export default function Users1() {
  const USER_API_END_POINT = 'http://localhost:5000/user';
  const Notification_API_END_POINT = 'http://localhost:5000/notification';
  const token = localStorage.getItem('token');
  const [loggedInUser, setLoggedInUser] = useState({});
  const [connectionList, setConnectionList] = useState([]);
  const [filteredConnections, setFilteredConnections] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sendConnection, setSendConnection] = useState({ email: '', message: '' });
  const [isLoading, setIsLoading] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  const { isDarkMode, toggleTheme } = useTheme();
  const [addUser, setAddUser] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showNotification, setShowNotification] = useState(() => {
  const storedValue = localStorage.getItem('showNotification');
  if (storedValue !== null) {
    return storedValue === 'true'; // Convert string to boolean
  } else {
    localStorage.setItem('showNotification', 'false'); // default to false
    return false;
  }
});

  const [notifications, setNotifications] = useState([]);
  const menuRef = useRef(null);
  const [count, setCount] = useState(0);


  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('showNotification');
    navigate('/login');
  };

  const showAdd = () => setAddUser(!addUser);
  const showProfileToggle = () => setShowProfile(!showProfile);
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const showNotif = () => {
    const newValue = !showNotification;
  setShowNotification(newValue);
  localStorage.setItem('showNotification', newValue.toString());
  }
  // Handle outside click to close menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch user data
  useEffect(() => {
    const fetchUser = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`${USER_API_END_POINT}/getDetails/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setLoggedInUser(response.data.user);
        setConnectionList(response.data.user.connections || []);
        setFilteredConnections(response.data.user.connections || []);
      } catch (err) {
        console.error('Error:', err.response?.data || err.message);
        alert('Failed to fetch user data. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchUser();
  }, [id, token]);

  // Search handler
  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    setFilteredConnections(
      connectionList.filter((connection) =>
        connection.name.toLowerCase().includes(query)
      )
    );
  };

  const handleSendConnection = (e) => {
    const { name, value } = e.target;
    setSendConnection((prev) => ({ ...prev, [name]: value }));
  };

  const sendConnectionTo = async () => {
    setIsLoading(true);
    try {
      await axios.post(`${USER_API_END_POINT}/beginconnect/${id}`, sendConnection, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSendConnection({ email: '', message: '' });
      setAddUser(false);
      alert('Connection request sent!');
    } catch (e) {
      if (e.response?.status === 400) {
        alert('User already in your connections');
      } else {
        alert('Failed to send connection request. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };



  // get all notifications
  useEffect(()=>{
    let fetchNotifications = async () => {
      try{
        let res = await axios.get(`${Notification_API_END_POINT}/Allnotifications`,{
          headers: { Authorization: `Bearer ${token}` },
        });
        // console.log(res.data.data);
        setNotifications(res.data.data || []);
      }catch(err){
        console.error('Error fetching notifications:', err);
      }
    }
    fetchNotifications();
  },[]);

  // Mark notification as read
  const markAsRead = async(notificationId) => {
    console.log(notificationId)
    try {
      let res = await axios.patch(`${Notification_API_END_POINT}/markAsRead/${notificationId}`,{},{
        headers: { Authorization: `Bearer ${token}` },
      });
     setNotifications((prev) =>
  prev.map((n) =>
    n._id === notificationId ? { ...n, status: 'read' } : n
  )
);

    }catch(err) {
      console.error('Error marking notification as read:', err);
    }
  }


  useEffect(() => {
    const fetchUnreadCound = async() =>{
      try{
    const res = await axios.get(`${Notification_API_END_POINT}/unreadCount`,{
     headers: { Authorization: `Bearer ${token}` },
    });
    // console.log('Unread notifications count:', res.data.count);
    setCount(res.data.count);
  }catch(err){
    console.log('Error fetching unread notifications count:', err);
  }
    }
    fetchUnreadCound();

  })
  return (
    <div className="flex flex-col min-h-screen bg-neutral-100 dark:bg-neutral-900 transition-all duration-300 font-sans">
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-30 bg-neutral-100/70 dark:bg-neutral-900/70 backdrop-blur-lg shadow-lg border-b border-neutral-200/50 dark:border-neutral-700/50">
        <div className="flex items-center p-3">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleMenu}
            className="p-2 rounded-full text-text-primary dark:text-text-primaryDark hover:bg-neutral-200/50 dark:hover:bg-neutral-700/50 transition-all"
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </motion.button>
          {
            !showNotification && (
              <div className="flex-1 ml-3 flex items-center gap-2 bg-neutral-50/70 dark:bg-neutral-800/70 backdrop-blur-lg border border-neutral-200/50 rounded-lg px-3 py-2 shadow-sm">
            <input
              type="text"
              placeholder="Search connections..."
              value={searchQuery}
              onChange={handleSearch}
              className="flex-1 bg-transparent text-text-primary dark:text-text-primaryDark focus:ring-0 focus:outline-none text-sm"
              aria-label="Search connections"
            />
            <Search className="text-neutral-500 dark:text-neutral-400 hover:text-primary-500 transition-all" size={20} />
          </div>
            )
          }
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <motion.div
          ref={menuRef}
          initial={{ x: '-100%' }}
          animate={{ x: 0 }}
          exit={{ x: '-100%' }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="md:hidden fixed top-0 left-0 w-64 h-full bg-neutral-50/70 dark:bg-neutral-800/70 backdrop-blur-lg shadow-lg p-4 flex flex-col gap-4 z-50"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-text-primary dark:text-text-primaryDark">Menu</h2>
            <motion.button
              whileHover={{ scale: 1.1 }}
              onClick={toggleMenu}
              className="p-2 rounded-full text-text-primary dark:text-text-primaryDark hover:bg-neutral-200/50 dark:hover:bg-neutral-700/50 transition-all"
              aria-label="Close menu"
            >
              <X size={20} />
            </motion.button>
          </div>
          <div className="relative">
            <motion.div
              whileHover={{ scale: 1.05 }}
              onClick={() => {
                setShowProfile(true);
                setAddUser(false);
              }}
              className="flex items-center gap-3 cursor-pointer p-2 rounded-lg hover:bg-neutral-200/50 dark:hover:bg-neutral-700/50 transition-all"
            >
              <img
                src={defaultImg}
                className="w-10 h-10 rounded-full border-2 border-neutral-300 dark:border-neutral-700"
                alt="User Avatar"
              />
              <span className="text-text-primary dark:text-text-primaryDark">Profile</span>
            </motion.div>
            {showProfile && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="mt-2 w-full bg-neutral-50/70 dark:bg-neutral-800/70 backdrop-blur-lg border border-neutral-200/50 rounded-xl shadow-lg p-4 flex flex-col gap-4 z-50"
              >
                <h2 className="text-lg font-bold text-text-primary dark:text-text-primaryDark">
                  {loggedInUser.name}
                </h2>
                <p className="text-sm text-text-secondary dark:text-text-secondaryDark">
                  Welcome back! Manage your profile or check settings.
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  className="bg-primary-500 text-white text-sm font-semibold py-2 px-4 rounded-xl shadow-md hover:bg-primary-600 transition-all"
                >
                  View Profile
                </motion.button>
              </motion.div>
            )}
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            onClick={() => {
              setAddUser(true);
              setShowProfile(false);
            }}
            className="flex items-center gap-3 p-2 rounded-lg text-text-primary dark:text-text-primaryDark hover:bg-neutral-200/50 dark:hover:bg-neutral-700/50 transition-all"
          >
            <UserRoundPlus size={20} />
            <span>Add Connection</span>
          </motion.button>
          {addUser && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute top-0 left-0 w-full h-full bg-neutral-50/70 dark:bg-neutral-800/70 backdrop-blur-lg border border-neutral-200/50 rounded-xl shadow-lg p-6 flex flex-col gap-6 z-50"
            >
              <h1 className="text-center text-xl font-bold text-primary-500 dark:text-primary-300">
                Add Connections
              </h1>
              <div className="flex flex-col gap-2">
                <label htmlFor="email-mobile" className="text-sm font-semibold text-text-primary dark:text-text-primaryDark">
                  Email
                </label>
                <input
                  id="email-mobile"
                  type="email"
                  name="email"
                  value={sendConnection.email}
                  onChange={handleSendConnection}
                  placeholder="Enter email"
                  className="bg-neutral-200/50 dark:bg-neutral-700/50 text-text-primary dark:text-text-primaryDark border border-neutral-300 dark:border-neutral-600 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-primary-500 transition-all"
                  aria-label="Email for connection request"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="message-mobile" className="text-sm font-semibold text-text-primary dark:text-text-primaryDark">
                  Message
                </label>
                <textarea
                  id="message-mobile"
                  name="message"
                  placeholder="Type your message"
                  value={sendConnection.message}
                  onChange={handleSendConnection}
                  className="bg-neutral-200/50 dark:bg-neutral-700/50 text-text-primary dark:text-text-primaryDark border border-neutral-300 dark:border-neutral-600 rounded-lg px-3 py-2 w-full h-20 focus:ring-2 focus:ring-primary-500 transition-all"
                  aria-label="Message for connection request"
                />
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                onClick={sendConnectionTo}
                className="bg-primary-500 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-primary-600 transition-all disabled:opacity-50"
                disabled={isLoading}
              >
                {isLoading ? 'Sending...' : 'Send Request'}
              </motion.button>
              <button
                className="absolute top-3 right-3 text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300 transition-all"
                onClick={showAdd}
                aria-label="Close add connection"
              >
                ✕
              </button>
            </motion.div>
          )}
          <motion.button
            whileHover={{ scale: 1.05 }}
            onClick={toggleTheme}
            className="flex items-center gap-3 p-2 rounded-lg text-text-primary dark:text-text-primaryDark hover:bg-neutral-200/50 dark:hover:bg-neutral-700/50 transition-all"
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            <span>{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            onClick={logout}
            className="flex items-center gap-3 p-2 rounded-lg text-text-primary dark:text-text-primaryDark hover:bg-neutral-200/50 dark:hover:bg-neutral-700/50 transition-all"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </motion.button>
        </motion.div>
      )}

      {/* Desktop Sidebar */}
      <div className="hidden md:flex flex-col w-20 bg-neutral-100/70 dark:bg-neutral-900/70 backdrop-blur-lg shadow-lg fixed h-full z-20 border-r border-neutral-200/50 dark:border-neutral-700/50">
        <ul className="flex flex-col items-center gap-6 p-4">
          <li className="relative group">
            <motion.img
              whileHover={{ scale: 1.1 }}
              onClick={showProfileToggle}
              
              className="cursor-pointer rounded-full w-12 h-12 border-2 border-neutral-300 dark:border-neutral-700 hover:border-primary-500 transition-all"
              src={defaultImg}
              alt="User Avatar"
              aria-label="Toggle profile"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: showProfile ? 0 : 1, scale: showProfile ? 0.8 : 1 }}
              className="absolute left-24 top-0 hidden group-hover:flex bg-neutral-800/90 text-white text-sm px-2 py-1 rounded-md shadow-lg z-40"
            >
              Profile
            </motion.div>
            {showProfile && (
              <motion.div
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="absolute top-1 left-20 w-72"
              >
                <h2 className="text-xl font-semibold text-text-primary dark:text-text-primaryDark">
                  {loggedInUser.name}
                </h2>
                <p className="text-sm text-text-secondary dark:text-text-secondaryDark">
                  Welcome back! Manage your profile or check settings.
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  className="bg-primary-500 text-white text-sm font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-primary-600 transition-all"
                >
                  View Profile
                </motion.button>
              </motion.div>
            )}
          </li>
          <li className="relative group">
            <motion.div whileHover={{ scale: 1.1 }}>
              <UserRoundPlus
                className="cursor-pointer text-text-primary dark:text-text-primaryDark hover:text-primary-500 transition-all"
                size={28}
                onClick={showAdd}
                aria-label="Add connection"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: addUser ? 0 : 1, scale: addUser ? 0.8 : 1 }}
              className="absolute left-24 top-0 hidden group-hover:flex bg-neutral-800/90 text-white text-sm px-2 py-1 rounded-md shadow-lg z-40"
            >
              Add Connection
            </motion.div>
            {addUser && (
              <motion.div
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="absolute left-24 top-0 w-80 bg-neutral-50/70 dark:bg-neutral-800/70 backdrop-blur-lg border border-neutral-200/50 rounded-xl shadow-lg p-6 flex flex-col gap-4 z-50"
              >
                <h1 className="text-center text-xl font-semibold text-primary-500 dark:text-primary-300">
                  Add Connections
                </h1>
                <div className="flex flex-col gap-2">
                  <label htmlFor="email" className="text-sm font-semibold text-text-primary dark:text-text-primaryDark">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    name="email"
                    value={sendConnection.email}
                    onChange={handleSendConnection}
                    placeholder="Enter email"
                    className="bg-neutral-200/50 dark:bg-neutral-700/50 text-text-primary dark:text-text-primaryDark border border-neutral-300 dark:border-neutral-600 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-primary-500 transition-all"
                    aria-label="Email for connection request"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="message" className="text-sm font-semibold text-text-primary dark:text-text-primaryDark">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    placeholder="Type your message"
                    value={sendConnection.message}
                    onChange={handleSendConnection}
                    className="bg-neutral-200/50 dark:bg-neutral-700/50 text-text-primary dark:text-text-primaryDark border border-neutral-300 dark:border-neutral-600 rounded-lg px-3 py-2 w-full h-20 focus:ring-2 focus:ring-primary-500 transition-all"
                    aria-label="Message for connection request"
                  />
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  onClick={sendConnectionTo}
                  className="bg-primary-500 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-primary-600 transition-all disabled:opacity-50"
                  disabled={isLoading}
                >
                  {isLoading ? 'Sending...' : 'Send Request'}
                </motion.button>
                <button
                  className="absolute top-3 right-3 text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300 transition-all"
                  onClick={showAdd}
                  aria-label="Close add connection"
                >
                  ✕
                </button>
              </motion.div>
            )}
          </li>
          <li className="relative group">
            <motion.div whileHover={{ scale: 1.1 }}>
              <Sun
                className={`cursor-pointer text-text-primary dark:text-text-primaryDark hover:text-primary-500 transition-all ${isDarkMode ? 'hidden' : 'block'}`}
                size={28}
                onClick={toggleTheme}
                aria-label="Switch to dark mode"
              />
              <Moon
                className={`cursor-pointer text-text-primary dark:text-text-primaryDark hover:text-primary-500 transition-all ${isDarkMode ? 'block' : 'hidden'}`}
                size={28}
                onClick={toggleTheme}
                aria-label="Switch to light mode"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute left-24 top-0 hidden group-hover:flex bg-neutral-800/90 text-white text-sm px-2 py-1 rounded-md shadow-lg z-40"
            >
              {isDarkMode ? 'Light Mode' : 'Dark Mode'}
            </motion.div>
          </li>
          <li className="relative group">
            <motion.div whileHover={{ scale: 1.1 }}>
              <LogOut
                className="cursor-pointer text-text-primary dark:text-text-primaryDark hover:text-red-500 transition-all"
                size={28}
                onClick={logout}
                aria-label="Logout"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute left-24 top-0 hidden group-hover:flex bg-neutral-800/90 text-white text-sm px-2 py-1 rounded-md shadow-lg z-40"
            >
              Logout
            </motion.div>
          </li>
          <li className="relative group">
  <motion.div whileHover={{ scale: 1.1 }} className="relative">
    <Bell
      className="cursor-pointer text-text-primary dark:text-text-primaryDark hover:text-zinc-900 transition-all"
      size={28}
      aria-label="notification"
      onClick={showNotif}
    />
    {count > 0 && (
      <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center leading-none">
        {count}
      </span>
    )}
  </motion.div>

  <motion.div
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    className="absolute left-24 top-0 hidden group-hover:flex bg-neutral-800/90 text-white text-sm px-2 py-1 rounded-md shadow-lg z-40"
  >
    notification
  </motion.div>
</li>

        </ul>
      </div>

            {
              showNotification ? (
              <div className='flex-1 mt-16 md:mt-0 md:ml-20 overflow-auto bg-neutral-100 dark:bg-neutral-900'>
                  {
                  notifications?.length > 0 ? (
                    <div className='p-3'>
                      <h1 className='text-2xl font-bold text-center mb-4 text-text-primary dark:text-text-primaryDark'>
                        🔔 Notifications
                      </h1>
                      <ul>
                        {
                        notifications.map((notification, index) => (
                      <li key={index} className="mb-3">
                        <div className="p-4 bg-neutral-50 dark:bg-neutral-800 rounded-lg shadow-md mb-4">
                        <h3 className="text-md  text-text-primary dark:text-text-primaryDark">{notification.text}</h3>
                        {
                          notification.status === 'unread' && (
                            <button onClick={() => markAsRead(notification._id)}>
                          Mark as Read
                        </button>
                          )
                        }
                      </div>
                      </li>
                    )
                  )
                      }
                      </ul>
                    </div>
                  ):(
                    <h2>no notification</h2>
                    
                )
                }
              </div>
              ) : (
      <div className="flex-1 mt-16 md:mt-0 md:ml-20 overflow-auto bg-neutral-100 dark:bg-neutral-900">
        {/* Search connections */}
        <div className="p-4">
          <div className="hidden md:flex items-center gap-2 bg-neutral-50/70 dark:bg-neutral-800/70 backdrop-blur-lg border border-neutral-200/50 rounded-lg px-3 py-2 shadow-sm mb-4 max-w-md">
            <input
              type="text"
              placeholder="Search connections..."
              value={searchQuery}
              onChange={handleSearch}
              className="flex-1 bg-transparent text-text-primary dark:text-text-primaryDark focus:ring-0 focus:outline-none text-sm"
              aria-label="Search connections"
            />
            <Search className="text-neutral-500 dark:text-neutral-400 hover:text-primary-500 transition-all" size={20} />
          </div>
          
      {/* Connection List */}
          {isLoading  ? (
            <div className="text-center text-text-primary dark:text-text-primaryDark py-10">Loading...</div>
          ) : filteredConnections.length === 0 ? (
            <div className="text-center text-text-primary dark:text-text-primaryDark py-10">No connections found.</div>
          ) : (
            <div className="space-y-3">
              {filteredConnections.map((connectOne, i) => (
                <Link
                  key={i}
                  to={`connection/${connectOne._id}`}
                  role="link"
                  aria-label={`Chat with ${connectOne.name}`}
                >
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="flex items-center gap-4 p-3 backdrop-blur-lg hover:bg-neutral-200/50 dark:hover:bg-neutral-700/50 transition-all shadow-sm"
                  >
                    <img
                      src={defaultImg}
                      alt={connectOne.name}
                      className="w-12 h-12 rounded-full border-2 border-neutral-300 dark:border-neutral-700"
                    />
                    <h2 className="text-base font-medium text-text-primary dark:text-text-primaryDark">{connectOne.name}</h2>
                  </motion.div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
              )
            }
    </div>
  );
}