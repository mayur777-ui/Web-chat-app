import React from 'react';

export default function StartChat() {
  return (
    <div className="hidden w-full md:flex justify-center items-center h-screen bg-slate-100 text-zinc-600">
       <div>
       <h1 className="text-5xl font-bold mb-6">
          Welcome to WebChat
        </h1>
        <p className="text-xl text-center mb-6 animate__animated animate__fadeIn animate__delay-2s">
          Start your conversation below
        </p>
       </div>
      </div>
  );
}
