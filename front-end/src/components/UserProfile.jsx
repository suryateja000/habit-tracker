
import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getFriends, unfollowUser, getLeaderboard } from '../Api';

export default function UserPage() {
  const { user, token, isAuthenticated } = useAuth();
  const [followers, setFollowers] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  
  const fetchSocialData = async () => {
    if (!isAuthenticated) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const [friendsData, leaderboardData] = await Promise.all([
        getFriends(token),
        getLeaderboard()
      ]);

      
      const followersWithRank = friendsData.map(follower => {
        const leaderboardEntry = leaderboardData.find(
          entry => entry._id === follower._id
        );
        
        return {
          ...follower,
          streak: leaderboardEntry?.totalStreaks || 0,
          rank: leaderboardData.findIndex(entry => entry._id === follower._id) + 1 || 'Unranked'
        };
      });

      setFollowers(followersWithRank);
      setLeaderboard(leaderboardData);
    } catch (err) {
      console.error('Failed to fetch social data:', err);
      setError('Failed to load friend progress data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSocialData();
  }, [isAuthenticated, token]);

  
  const handleViewProfile = (followerId) => {
    console.log('Viewing profile for user:', followerId);
  };

  const handleUnfollow = async (followerId) => {
    if (!window.confirm('Are you sure you want to unfollow this user?')) {
      return;
    }

    try {
      await unfollowUser(token, followerId);
      
      
      setFollowers(prev => prev.filter(f => f._id !== followerId));
      
      console.log('Successfully unfollowed user');
    } catch (err) {
      console.error('Failed to unfollow user:', err);
      setError('Failed to unfollow user. Please try again.');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Access Restricted
          </h2>
          <p className="text-gray-600 mb-6">
            Please log in to view your friend progress.
          </p>
          <button 
            onClick={() => window.location.href = '/login'}
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700"
          >
            Log In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Welcome, {user?.username}!
              </h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        <section id="socialIntegration" className="bg-white rounded-xl shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Friend Progress
            </h2>
            <p className="text-gray-600">
              Displays follower data and streaks synced with leaderboard.
            </p>
          </div>

          <div className="p-6">
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
                {error}
                <button 
                  onClick={() => setError(null)}
                  className="ml-2 text-red-500 hover:text-red-700"
                >
                  ×
                </button>
              </div>
            )}

            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading friend progress...</p>
              </div>
            ) : followers.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">👥</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  No friends yet!
                </h3>
                <p className="text-gray-600 mb-6">
                  Start following friends to see their progress here.
                </p>
                <button
                  onClick={() => window.location.href = '/search-friends'}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium"
                >
                  Find Friends
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {followers.map(follower => (
                  <div 
                    key={follower._id} 
                    className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
                  >
                    
                    <div className="mb-4">
                      <div className="flex items-center mb-3">
                        <div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                          {follower.username.charAt(0).toUpperCase()}
                        </div>
                        <div className="ml-3">
                          <h3 className="font-semibold text-gray-900">
                            {follower.username}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {follower.email}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-gray-700">
                            Streak:
                          </span>
                          <span className="text-lg font-bold text-orange-600 flex items-center">
                            {follower.streak}
                          </span>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-gray-700">
                            Leaderboard Rank:
                          </span>
                          <span className="text-lg font-bold text-indigo-600">
                            #{follower.rank}
                          </span>
                        </div>
                      </div>
                    </div>

                    
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleViewProfile(follower._id)}
                        className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                      >
                        View Profile
                      </button>
                      <button
                        onClick={() => handleUnfollow(follower._id)}
                        className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                      >
                        Unfollow
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
