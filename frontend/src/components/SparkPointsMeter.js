import React from 'react';

const SparkPointsMeter = ({ points }) => {
  const pointsPerLevel = 500; // Example: 500 points to level up
  const level = Math.floor(points / pointsPerLevel) + 1;
  const pointsInCurrentLevel = points % pointsPerLevel;
  const progressPercentage = (pointsInCurrentLevel / pointsPerLevel) * 100;

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-xl font-bold text-white">Your Spark Level</h3>
        <span className="text-lg font-semibold text-yellow-400">Level {level}</span>
      </div>
      <div className="w-full bg-gray-700 rounded-full h-4">
        <div 
          className="bg-yellow-400 h-4 rounded-full transition-all duration-500"
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>
      <div className="text-right text-gray-400 mt-1 text-sm">
        {pointsInCurrentLevel} / {pointsPerLevel} points to next level
      </div>
    </div>
  );
};

export default SparkPointsMeter; 