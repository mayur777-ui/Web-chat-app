import React, { useState, useEffect } from 'react';
import Users1 from './Users1';
import { useLocation, Link, Outlet } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

export default function Home1() {
  const location = useLocation();
  const isChatRoute = location.pathname.includes('/connection/');
  const [deviceType, setDeviceType] = useState('desktop');

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setDeviceType('mobile');
      } else {
        setDeviceType('desktop');
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <>
      {deviceType === 'desktop' ? (
        <div className="flex bg-neutral-100 dark:bg-neutral-900/70 backdrop-blur-lg min-h-screen">
          <Users1 />
          <AnimatePresence>
            <Outlet />
          </AnimatePresence>
        </div>
      ) : (
        <div className="flex flex-col md:flex-row h-screen bg-neutral-100 dark:bg-neutral-900/70 backdrop-blur-lg">
          {/* Mobile View: Show Users List and ChatBox (on click) */}
          <div className="block md:hidden w-full h-full">
            {!isChatRoute ? <Users1 /> : <Outlet />}
          </div>
          {/* Desktop View: Show Users List and ChatBox side by side */}
          <div className="hidden md:flex w-full h-full">
            <div className="w-1/3 p-4">
              <Users1 />
            </div>
            <div className="w-2/3 p-4">
              <AnimatePresence>
                <Outlet />
              </AnimatePresence>
            </div>
          </div>
        </div>
      )}
    </>
  );
}