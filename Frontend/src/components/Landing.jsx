import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../hooks/ThemHook.jsx';
import { FaMoon, FaSun, FaComments, FaRocket, FaShieldAlt } from 'react-icons/fa';
import { MessageCircle } from 'lucide-react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import chatPerson from '../images/chatPerson3.png';

export default function Landing() {
  const navigate = useNavigate();
  const { isDarkMode, toggleTheme } = useTheme();

  // Subtle scroll-based motion
  const { scrollY } = useScroll();
  const scale = useSpring(useTransform(scrollY, [0, 500], [1, 1.03]), { stiffness: 120, damping: 30 });
  const y = useSpring(useTransform(scrollY, [0, 500], [0, 40]), { stiffness: 120, damping: 30 });

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches) {
      scale.set(1);
      y.set(0);
    }
  }, [scale, y]);

  const clickLogin = () => navigate('/Login');
  const clickRegister = () => navigate('/Register');

  // Button variants
  const buttonVariants = {
    primary: `${isDarkMode ? 
      'bg-primary-500 hover:bg-primary-400 text-neutral-50' : 
      'bg-primary-500 hover:bg-primary-600 text-neutral-50'
    }`,
    secondary: `${isDarkMode ? 
      'bg-neutral-700 hover:bg-neutral-600 text-text-primaryDark' : 
      'bg-neutral-100 hover:bg-neutral-200 text-text-primary'
    }`,
    outline: `${isDarkMode ? 
      'border border-primary-500 hover:bg-primary-900/20 text-primary-300' : 
      'border border-primary-500 hover:bg-primary-50 text-primary-600'
    }`
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 font-sans ${
      isDarkMode ? 'bg-neutral-900 text-neutral-50' : 'bg-neutral-50 text-neutral-900'
    }`}>
      {/* Sticky Navbar */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className={`sticky top-0 z-50 flex items-center justify-between px-6 py-4 ${
          isDarkMode ? 'bg-neutral-800/90' : 'bg-neutral-50/90'
        } backdrop-blur-md shadow-sm`}
      >
        <div className="flex items-center gap-3">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className={`w-10 h-10 rounded-lg flex items-center justify-center shadow ${
              isDarkMode ? 'bg-primary-600' : 'bg-primary-100'
            }`}
          >
            <MessageCircle size={20} className={isDarkMode ? 'text-primary-200' : 'text-primary-600'} />
          </motion.div>
          <h1 className="text-2xl font-bold">
            Web<span className={isDarkMode ? 'text-primary-400' : 'text-primary-600'}>Chat</span>
          </h1>
        </div>
        <nav className="flex items-center gap-4">
          <button
            onClick={clickLogin}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${buttonVariants.secondary}`}
          >
            Login
          </button>
          <button
            onClick={clickRegister}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${buttonVariants.primary}`}
          >
            Sign Up
          </button>
        </nav>
      </motion.header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-6 pt-20 pb-24">
        <motion.div 
          className="flex flex-col lg:flex-row items-center gap-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex-1 space-y-8">
            <motion.h1 
              className="text-5xl font-bold leading-tight"
              initial={{ y: 20 }}
              animate={{ y: 0 }}
            >
              Connect <span className="bg-gradient-to-r from-primary-500 to-teal-400 bg-clip-text text-transparent">Smarter</span>,<br />
              Chat <span className="bg-gradient-to-r from-primary-500 to-teal-400 bg-clip-text text-transparent">Faster</span>
            </motion.h1>
            <p className={`text-xl ${isDarkMode ? 'text-neutral-300' : 'text-neutral-600'}`}>
              Modern communication platform with enterprise-grade security and intuitive design.
            </p>
            <div className="flex gap-4">
      <button onClick={clickRegister} className="relative group overflow-hidden border-2 border-blue-500 text-blue-500 px-6 py-3 rounded-lg font-medium">
        <span className="absolute left-0 top-0 h-full w-0 bg-blue-500 transition-all duration-500 group-hover:w-full z-0"></span>
        <span className="relative z-10 transition-colors duration-500 group-hover:text-white">
          Get Started
        </span>
        </button>
    </div>
          </div>
          <motion.div 
            className="flex-1"
            whileHover={{ scale: 1.02 }}
            transition={{ type: 'spring', stiffness: 200 }}
          >
            <img
              src={chatPerson}
              alt="WebChat interface preview"
              // className="rounded-2xl shadow-xl border-[3px] border-primary-500/20"
            />
          </motion.div>
        </motion.div>
      </main>

      {/* Features Section */}
      <section className={`py-24 ${isDarkMode ? 'bg-neutral-800' : 'bg-neutral-100'}`}>
        <div className="max-w-7xl mx-auto px-6">
          <motion.h3 
            className="text-3xl font-bold text-center mb-16"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            Why WebChat?
          </motion.h3>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className={`p-8 rounded-xl ${isDarkMode ? 'bg-neutral-700' : 'bg-white'} shadow-lg`}
                whileHover={{ y: -5 }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
              >
                <div className={`w-14 h-14 rounded-lg flex items-center justify-center mb-6 ${
                  isDarkMode ? 'bg-primary-600/20' : 'bg-primary-100'
                }`}>
                  {feature.icon}
                </div>
                <h4 className="text-xl font-semibold mb-4">{feature.title}</h4>
                <p className={isDarkMode ? 'text-neutral-300' : 'text-neutral-600'}>{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={`py-12 ${isDarkMode ? 'bg-neutral-800' : 'bg-neutral-100'}`}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 text-sm">
            <div className="space-y-4">
              <h5 className={`text-lg font-semibold ${isDarkMode ? 'text-primary-400' : 'text-primary-600'}`}>
                WebChat
              </h5>
              <p className={isDarkMode ? 'text-neutral-400' : 'text-neutral-600'}>
                Revolutionizing digital communication with security and style.
              </p>
            </div>
            <div className="space-y-4">
              <h5 className={`text-lg font-semibold ${isDarkMode ? 'text-primary-400' : 'text-primary-600'}`}>
                Product
              </h5>
              <ul className="space-y-2">
                <li><button onClick={clickLogin} className="hover:text-primary-500 transition-colors">Features</button></li>
                <li><button onClick={clickRegister} className="hover:text-primary-500 transition-colors">Pricing</button></li>
                <li><button onClick={clickLogin} className="hover:text-primary-500 transition-colors">Documentation</button></li>
              </ul>
            </div>
            <div className="space-y-4">
              <h5 className={`text-lg font-semibold ${isDarkMode ? 'text-primary-400' : 'text-primary-600'}`}>
                Company
              </h5>
              <ul className="space-y-2">
                <li><button className="hover:text-primary-500 transition-colors">About</button></li>
                <li><button className="hover:text-primary-500 transition-colors">Blog</button></li>
                <li><button className="hover:text-primary-500 transition-colors">Careers</button></li>
              </ul>
            </div>
            <div className="space-y-4">
              <h5 className={`text-lg font-semibold ${isDarkMode ? 'text-primary-400' : 'text-primary-600'}`}>
                Legal
              </h5>
              <ul className="space-y-2">
                <li><button className="hover:text-primary-500 transition-colors">Privacy</button></li>
                <li><button className="hover:text-primary-500 transition-colors">Terms</button></li>
                <li><button className="hover:text-primary-500 transition-colors">Security</button></li>
              </ul>
            </div>
          </div>
          
          <div className={`mt-12 pt-8 border-t ${
            isDarkMode ? 'border-neutral-700' : 'border-neutral-200'
          } text-center`}>
            <p className={isDarkMode ? 'text-neutral-500' : 'text-neutral-600'}>
              © {new Date().getFullYear()} WebChat. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      {/* Theme Toggle */}
      <motion.button
        onClick={toggleTheme}
        className={`fixed bottom-8 right-8 p-3 rounded-full shadow-lg ${
          isDarkMode ? 'bg-neutral-700 hover:bg-neutral-600' : 'bg-white hover:bg-neutral-100'
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
    </div>
  );
}

const features = [
  {
    icon: <FaComments className="w-7 h-7 text-primary-500" />,
    title: 'Real-time Chat',
    description: 'Instant messaging with end-to-end encryption and message history',
  },
  {
    icon: <FaRocket className="w-7 h-7 text-primary-500" />,
    title: 'Lightning Fast',
    description: 'Optimized performance with global server infrastructure',
  },
  {
    icon: <FaShieldAlt className="w-7 h-7 text-primary-500" />,
    title: 'Secure',
    description: 'Enterprise-grade security with regular audits',
  },
];