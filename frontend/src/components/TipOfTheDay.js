import React, { useState, useEffect } from 'react';

const tips = [
  "Take a few deep breaths before starting your day. It can make a world of difference.",
  "What's one small thing you can do today that your future self will thank you for?",
  "Reflection is not about judging the past, but about illuminating the future.",
  "Celebrate your small wins. Every step forward is progress.",
  "Your thoughts shape your reality. Focus on the positive.",
  "Kindness is a gift everyone can afford to give. Start with yourself.",
  "Don't be afraid to disconnect. Your mind needs rest to recharge.",
  "Curiosity is the engine of achievement. What are you curious about today?",
  "Listen to your emotions. They are messengers trying to tell you something important.",
  "The journey of a thousand miles begins with a single step. What's your first step today?"
];

const TipOfTheDay = () => {
  const [tip, setTip] = useState('');

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * tips.length);
    setTip(tips[randomIndex]);
  }, []);

  return (
    <div className="bg-gradient-to-r from-purple-500 to-indigo-600 p-6 rounded-lg shadow-lg text-white text-center">
      <h3 className="text-2xl font-bold mb-2">A Spark for Your Day</h3>
      <p className="text-lg italic">"{tip}"</p>
    </div>
  );
};

export default TipOfTheDay; 