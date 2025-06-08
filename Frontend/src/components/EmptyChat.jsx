import React from 'react';
import { MessageCircle } from 'lucide-react';
import 'animate.css';

export default function StartChat() {
  return (
    <div
      className="hidden w-full md:flex justify-center items-center h-screen bg-neutral-100 dark:bg-gradient-to-br dark:from-neutral-900 dark:to-neutral-800 bg-opacity-70 text-zinc-600 dark:text-neutral-200"
      aria-label="Welcome to WebChat"
    >
      <div className="flex flex-col items-center gap-4">
        <MessageCircle
          size={48}
          className="text-primary-500 dark:text-primary-300 animate__animated animate__pulse animate__infinite"
        />
        <h1 className="text-5xl md:text-6xl font-bold text-center">
          Welcome to WebChat
        </h1>
        <p className="text-md md:text-l text-center animate__animated animate__fadeIn animate__delay-1s">
          Start your conversations with friends and family.
        </p>
      </div>
    </div>
  );
}