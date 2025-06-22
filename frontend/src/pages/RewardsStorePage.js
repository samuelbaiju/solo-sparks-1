import React, { useState, useEffect, useContext } from 'react';
import axiosInstance from '../utils/axiosInstance';
import AuthContext from '../context/AuthContext';

const RewardSkeleton = () => (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg animate-pulse">
        <div className="h-6 bg-gray-700 rounded w-3/4 mb-2"></div>
        <div className="h-8 bg-gray-700 rounded w-1/3 mb-4"></div>
        <div className="h-4 bg-gray-700 rounded w-full mb-2"></div>
        <div className="h-4 bg-gray-700 rounded w-5/6"></div>
        <div className="h-10 bg-gray-700 rounded w-full mt-6"></div>
    </div>
);

function RewardsStorePage() {
  const [rewards, setRewards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [redeemStatus, setRedeemStatus] = useState({});
  const { userProfile, authTokens, fetchUserProfile } = useContext(AuthContext);

  useEffect(() => {
    const fetchRewards = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get('/api/rewards/');
        setRewards(response.data);
      } catch (err) {
        setError('Failed to fetch rewards. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchRewards();
  }, []);

  const handleRedeem = async (rewardId, cost) => {
    if (userProfile.spark_points < cost) {
      setRedeemStatus({ id: rewardId, status: 'error', message: "You don't have enough points!" });
      return;
    }

    setRedeemStatus({ id: rewardId, status: 'loading' });

    try {
      const response = await axiosInstance.post(`/api/rewards/${rewardId}/redeem/`);
      setRedeemStatus({ id: rewardId, status: 'success', message: response.data.detail });
      await fetchUserProfile(authTokens.access); 
    } catch (err) {
      const errorMessage = err.response?.data?.detail || 'An error occurred during redemption.';
      setRedeemStatus({ id: rewardId, status: 'error', message: errorMessage });
    }
  };

  const userPoints = userProfile ? userProfile.spark_points : 0;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-extrabold text-white">Rewards Store</h1>
      </div>
      
      <div className="bg-gradient-to-r from-green-500 to-teal-500 p-6 rounded-lg shadow-lg text-white">
        <p className="text-lg">Your Spark Points</p>
        <p className="text-5xl font-bold">{userProfile ? userPoints : '...'}</p>
      </div>

      {error && <div className="p-4 text-sm text-red-300 bg-red-900 bg-opacity-50 rounded-lg">{error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {loading ? (
          Array.from(new Array(3)).map((_, index) => <RewardSkeleton key={index} />)
        ) : (
          rewards.map(reward => {
            const canAfford = userPoints >= reward.cost;
            const isRedeeming = redeemStatus.id === reward.id && redeemStatus.status === 'loading';
            
            return(
            <div key={reward.id} className={`bg-gray-800 p-6 rounded-lg shadow-lg flex flex-col justify-between transition-opacity ${!canAfford ? 'opacity-50' : ''}`}>
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">{reward.title}</h2>
                <p className="text-2xl font-bold text-green-400 mb-4">{reward.cost} Points</p>
                <p className="text-gray-400">{reward.description}</p>
              </div>
              <div className="mt-6">
                <button
                  onClick={() => handleRedeem(reward.id, reward.cost)}
                  disabled={!canAfford || isRedeeming}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md transition-colors duration-300 disabled:bg-gray-600 disabled:cursor-not-allowed"
                >
                  {isRedeeming ? 'Redeeming...' : 'Redeem'}
                </button>
                {redeemStatus.id === reward.id && redeemStatus.status !== 'loading' && (
                  <div className={`mt-4 p-3 text-sm rounded-lg ${redeemStatus.status === 'success' ? 'text-green-300 bg-green-900 bg-opacity-50' : 'text-red-300 bg-red-900 bg-opacity-50'}`}>
                    {redeemStatus.message}
                  </div>
                )}
              </div>
            </div>
          )})
        )}
      </div>
    </div>
  );
}

export default RewardsStorePage; 