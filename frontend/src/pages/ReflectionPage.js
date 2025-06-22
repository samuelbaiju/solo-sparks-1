import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';
import AuthContext from '../context/AuthContext';

const ReflectionSkeleton = () => (
    <div className="bg-gray-800 p-8 rounded-lg shadow-lg animate-pulse">
        <div className="h-8 bg-gray-700 rounded w-3/4 mb-4"></div>
        <div className="h-4 bg-gray-700 rounded w-full mb-2"></div>
        <div className="h-4 bg-gray-700 rounded w-5/6 mb-6"></div>
        <div className="flex gap-2 mb-8">
            <div className="h-6 w-24 bg-gray-700 rounded-full"></div>
            <div className="h-6 w-24 bg-gray-700 rounded-full"></div>
        </div>
        <div className="h-40 bg-gray-700 rounded w-full"></div>
    </div>
);

function ReflectionPage() {
  const { questId } = useParams();
  const navigate = useNavigate();
  const { fetchUserProfile, authTokens } = useContext(AuthContext);
  const [quest, setQuest] = useState(null);
  const [reflection, setReflection] = useState('');
  const [photo, setPhoto] = useState(null);
  const [audio, setAudio] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchQuest = async () => {
      try {
        const response = await axiosInstance.get(`/api/quests/${questId}/`);
        setQuest(response.data);
      } catch (err) {
        console.error('Failed to fetch quest:', err);
        setError('Could not load quest details. Please go back and try again.');
      }
    };
    fetchQuest();
  }, [questId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData();
    formData.append('quest', questId);
    formData.append('text_reflection', reflection);
    if (photo) formData.append('photo', photo);
    if (audio) formData.append('audio', audio);

    try {
      await axiosInstance.post('/api/reflections/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      await fetchUserProfile(authTokens.access);
      navigate('/dashboard', { state: { message: `Quest "${quest.title}" completed! +${quest.points} points!` } });
    } catch (err) {
      setError('Failed to submit reflection. Please try again.');
      console.error('Failed to submit reflection:', err);
      setLoading(false);
    }
  };
  
  const inputBaseStyles = "w-full text-white bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500";


  if (!quest && !error) {
      return <ReflectionSkeleton />;
  }

  return (
    <div className="max-w-4xl mx-auto">
      {error && <div className="p-4 mb-6 text-sm text-red-300 bg-red-900 bg-opacity-50 rounded-lg">{error}</div>}
      
      {quest && (
        <div className="bg-gray-800 p-8 rounded-lg shadow-lg">
          <div className="border-b border-gray-700 pb-6 mb-6">
            <h1 className="text-4xl font-extrabold text-white">{quest.title}</h1>
            <p className="text-lg text-gray-400 mt-2">{quest.description}</p>
             <div className="flex flex-wrap gap-2 mt-4">
                {quest.tags.map(tag => (
                <span key={tag.id} className="bg-indigo-500 bg-opacity-20 text-indigo-300 text-xs font-semibold px-3 py-1 rounded-full">
                    {tag.name}
                </span>
                ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <label htmlFor="text-reflection" className="block text-lg font-medium text-white mb-2">Your Reflection</label>
                <textarea
                id="text-reflection"
                placeholder="Reflect on the quest, your actions, and what you've learned..."
                rows="10"
                value={reflection}
                onChange={(e) => setReflection(e.target.value)}
                required
                className={`${inputBaseStyles} p-4`}
                />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="photo-upload" className="block text-lg font-medium text-white mb-2">Upload a Photo</label>
                <label htmlFor="photo-upload" className="w-full flex items-center justify-center px-4 py-3 text-white bg-gray-700 border-2 border-dashed border-gray-600 rounded-md cursor-pointer hover:bg-gray-600 transition-colors">
                    {photo ? 'Photo Selected!' : 'Choose a file'}
                </label>
                <input id="photo-upload" type="file" accept="image/*" className="hidden" onChange={(e) => setPhoto(e.target.files[0])} />
                {photo && <span className="text-sm text-gray-400 mt-2 block">{photo.name}</span>}
              </div>

              <div>
                <label htmlFor="audio-upload" className="block text-lg font-medium text-white mb-2">Upload Audio</label>
                <label htmlFor="audio-upload" className="w-full flex items-center justify-center px-4 py-3 text-white bg-gray-700 border-2 border-dashed border-gray-600 rounded-md cursor-pointer hover:bg-gray-600 transition-colors">
                    {audio ? 'Audio Selected!' : 'Choose a file'}
                </label>
                <input id="audio-upload" type="file" accept="audio/*" className="hidden" onChange={(e) => setAudio(e.target.files[0])} />
                {audio && <span className="text-sm text-gray-400 mt-2 block">{audio.name}</span>}
              </div>
            </div>

            <div className="pt-4">
              <button 
                type="submit" 
                disabled={loading}
                className="w-full py-4 text-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-md transition-colors duration-300 disabled:bg-gray-500"
              >
                {loading ? 'Submitting...' : `Complete Quest (+${quest.points} Points)`}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default ReflectionPage; 