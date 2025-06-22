import React, { useState, useEffect, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';
import AuthContext from '../context/AuthContext';
import TipOfTheDay from '../components/TipOfTheDay';
import SparkPointsMeter from '../components/SparkPointsMeter';

const QuestSkeleton = () => (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg animate-pulse">
        <div className="h-6 bg-gray-700 rounded w-3/4 mb-4"></div>
        <div className="h-4 bg-gray-700 rounded w-full mb-2"></div>
        <div className="h-4 bg-gray-700 rounded w-5/6 mb-4"></div>
        <div className="flex gap-2 mb-4">
            <div className="h-6 w-20 bg-gray-700 rounded-full"></div>
            <div className="h-6 w-20 bg-gray-700 rounded-full"></div>
        </div>
        <div className="h-10 bg-gray-700 rounded w-1/2 mt-4"></div>
    </div>
);

function DashboardPage() {
  const [quests, setQuests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user, userProfile } = useContext(AuthContext);
  const location = useLocation();
  const [successMessage, setSuccessMessage] = useState(location.state?.message);

  // Clear success message after a few seconds
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage(null);
        window.history.replaceState({}, document.title)
      }, 6000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  useEffect(() => {
    const fetchQuests = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get('/api/quests/');
        setQuests(response.data);
      } catch (err) {
        setError('Failed to fetch quests. Please try again later.');
        console.error('Failed to fetch quests:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchQuests();
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-extrabold text-white">
          Welcome back, <span className="text-purple-400">{user?.username || 'Spark-Seeker'}!</span>
        </h1>
        <p className="text-lg text-gray-400 mt-2">
          Here are your recommended quests. Let's get growing!
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <TipOfTheDay />
        <SparkPointsMeter points={userProfile?.spark_points ?? 0} />
      </div>

      {successMessage && <div className="p-4 text-sm text-green-300 bg-green-900 bg-opacity-50 rounded-lg">{successMessage}</div>}
      {error && <div className="p-4 text-sm text-red-300 bg-red-900 bg-opacity-50 rounded-lg">{error}</div>}

      <div>
        <h2 className="text-3xl font-bold text-white mb-4">Your Quests</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
            Array.from(new Array(6)).map((_, index) => <QuestSkeleton key={index} />)
          ) : (
            quests.map(quest => (
              <div key={quest.id} className="bg-gray-800 p-6 rounded-lg shadow-lg flex flex-col justify-between transform transition-all duration-300 hover:scale-105 hover:shadow-purple-500/20">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">{quest.title}</h2>
                  <p className="text-gray-400 mb-4 h-20 overflow-hidden">{quest.description}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {quest.tags.map(tag => (
                      <span key={tag.id} className="bg-purple-500 bg-opacity-20 text-purple-300 text-xs font-semibold px-3 py-1 rounded-full">
                        {tag.name}
                      </span>
                    ))}
                  </div>
                </div>
                <Link
                  to={`/reflection/${quest.id}`}
                  className="w-full mt-4 bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-md text-center transition-colors duration-300"
                >
                  Start Quest ({quest.points} pts)
                </Link>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default DashboardPage; 