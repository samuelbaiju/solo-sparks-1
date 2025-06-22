import React, { useState, useEffect } from 'react';
import axiosInstance from '../utils/axiosInstance';

const ReflectionSkeleton = () => (
    <div className="bg-gray-800 rounded-lg shadow-lg animate-pulse overflow-hidden">
        <div className="bg-gray-700 h-48 w-full"></div>
        <div className="p-6">
            <div className="h-6 bg-gray-700 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-700 rounded w-1/2 mb-4"></div>
            <div className="h-4 bg-gray-700 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-700 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-700 rounded w-5/6"></div>
        </div>
    </div>
);

function MyReflectionsPage() {
  const [reflections, setReflections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '' });

  useEffect(() => {
    const fetchReflections = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get('/api/my-reflections/');
        setReflections(response.data);
      } catch (err) {
        setError('Failed to fetch your reflections.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchReflections();
  }, []);

  const handleShare = (reflectionId) => {
    const shareUrl = `${window.location.origin}/public/reflection/${reflectionId}`;
    navigator.clipboard.writeText(shareUrl)
      .then(() => {
        setSnackbar({ open: true, message: 'Share link copied to clipboard!' });
        setTimeout(() => setSnackbar({ open: false, message: '' }), 4000);
      })
      .catch(() => alert('Could not copy link. Please try again.'));
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-extrabold text-white">My Reflections</h1>
        <p className="text-lg text-gray-400 mt-2">
            A gallery of your growth and insights.
        </p>
      </div>

      {error && <div className="p-4 text-sm text-red-300 bg-red-900 bg-opacity-50 rounded-lg">{error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {loading ? (
          Array.from(new Array(3)).map((_, index) => <ReflectionSkeleton key={index} />)
        ) : reflections.length === 0 ? (
          <div className="md:col-span-2 lg:col-span-3 bg-gray-800 p-8 rounded-lg text-center">
            <h2 className="text-2xl font-bold text-white">No Reflections Yet</h2>
            <p className="text-gray-400 mt-2">Complete a quest from the dashboard to see your first reflection here!</p>
          </div>
        ) : (
          reflections.map(reflection => (
            <div key={reflection.id} className="bg-gray-800 rounded-lg shadow-lg overflow-hidden flex flex-col">
              {reflection.photo && (
                <img
                  src={`https://res.cloudinary.com/djzbdq8p4/${reflection.photo}`}
                  alt="User reflection"
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-6 flex-grow flex flex-col">
                <h2 className="text-xl font-bold text-white">
                  {reflection.quest.title}
                </h2>
                <p className="text-sm text-gray-400 mb-4">
                  {new Date(reflection.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
                <p className="text-gray-300 flex-grow">{reflection.text_reflection}</p>
                {reflection.audio && (
                  <audio controls className="w-full mt-4" src={reflection.audio}>
                    Your browser does not support the audio element.
                  </audio>
                )}
                 <div className="mt-6">
                    <button
                    onClick={() => handleShare(reflection.id)}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition-colors duration-300"
                    >
                    Copy Share Link
                    </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      {snackbar.open && (
        <div className="fixed bottom-10 right-10 bg-green-500 text-white py-2 px-4 rounded-lg shadow-lg">
          {snackbar.message}
        </div>
      )}
    </div>
  );
}

export default MyReflectionsPage; 