// src/components/FriendsActivity.jsx - Professional and Themed Layout
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { getFriendsActivity, getFriends } from '../Api';

export default function FriendsActivity() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activities, setActivities] = useState([]);
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedFriend, setSelectedFriend] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setError('');
      const [activityData, friendsData] = await Promise.all([
        getFriendsActivity(),
        getFriends()
      ]);
      
      setActivities(activityData.activities || []);
      setFriends(friendsData);
    } catch (err) {
      console.error('Failed to load activity data:', err);
      setError('Failed to load friends activity');
    } finally {
      setLoading(false);
    }
  };

  const formatTimeAgo = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const groupActivitiesByFriend = () => {
    const grouped = {};
    activities.forEach(activity => {
      const friendId = activity.user?._id;
      if (!grouped[friendId]) {
        grouped[friendId] = {
          user: activity.user,
          activities: []
        };
      }
      grouped[friendId].activities.push(activity);
    });
    return grouped;
  };

  const getFriendActivityCount = (friendId) => {
    return activities.filter(activity => activity.user?._id === friendId).length;
  };

  if (loading) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: '#f6f7fb' }}>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center bg-white rounded-3xl p-16 shadow-2xl border">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 mx-auto mb-6" style={{ borderTopColor: '#7e3ff2' }}></div>
            <p className="text-xl font-semibold" style={{ color: '#7e3ff2' }}>Loading activity feed...</p>
          </div>
        </div>
      </div>
    );
  }

  const groupedActivities = groupActivitiesByFriend();

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f6f7fb' }}>
      {/* Decorative Elements */}
      <div className="absolute top-16 left-16 w-24 h-24 rounded-full opacity-40" style={{ backgroundColor: '#faca15' }}></div>
      <div className="absolute top-1/4 right-20 w-16 h-16 rounded-full opacity-50" style={{ backgroundColor: '#3ad2ff' }}></div>
      <div className="absolute bottom-32 left-8 w-20 h-20 rounded-full opacity-35" style={{ backgroundColor: '#e04e4e' }}></div>

      {/* Clean Header */}
      <header className="bg-white/90 backdrop-blur-sm shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <button
                onClick={() => navigate('/dashboard')}
                className="flex items-center text-violet-600 hover:text-violet-800 mb-3 transition-colors"
              >
                ← Back to Dashboard
              </button>
              <h1 className="text-3xl font-bold text-gray-900">Friends Activity</h1>
              <p className="text-gray-600 mt-1">See what your friends have been up to</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-violet-600">{activities.length}</div>
              <div className="text-sm text-gray-600">Recent Activities</div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* Error Display */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4">
            <p className="text-red-800 font-medium">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Friends Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg border border-violet-100 sticky top-8">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-lg font-semibold text-gray-900">Your Friends</h2>
                <p className="text-sm text-gray-600">{friends.length} friends</p>
              </div>
              
              <div className="p-4 max-h-96 overflow-y-auto">
                
                
                {friends.map(friend => {
                  const activityCount = getFriendActivityCount(friend._id);
                  return (
                    <button
                      key={friend._id}
                      onClick={() => setSelectedFriend(friend._id)}
                      className={`w-full text-left p-3 rounded-xl mb-2 transition-colors ${
                        selectedFriend === friend._id 
                          ? 'bg-violet-100 text-violet-800 border border-violet-200' 
                          : 'hover:bg-gray-50 text-gray-700'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-violet-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                          {friend.username.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1">
                          <div className="font-medium">{friend.username}</div>
                          <div className="text-xs text-gray-500">{activityCount} activities</div>
                        </div>
                      </div>
                    </button>
                  );
                })}

                {friends.length === 0 && (
                  <div className="text-center py-6">
                    <p className="text-gray-500 text-sm mb-3">No friends yet</p>
                    <button
                      onClick={() => navigate('/dashboard')}
                      className="text-violet-600 hover:text-violet-700 text-sm font-medium"
                    >
                      Add friends
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Activity Content */}
          <div className="lg:col-span-3">
            {activities.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-lg border border-violet-100 p-12 text-center">
                <div className="w-20 h-20 bg-violet-100 rounded-full mx-auto mb-6 flex items-center justify-center">
                  <div className="w-10 h-10 text-violet-600"></div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">No Activity Yet</h3>
                <p className="text-gray-600 mb-6">Your friends haven't completed any habits recently.</p>
                <button
                  onClick={() => navigate('/dashboard')}
                  className="bg-violet-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-violet-700 transition-colors"
                >
                  Back to Dashboard
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {selectedFriend === null ? (
                  // Show all friends organized by friend
                  Object.entries(groupedActivities).map(([friendId, data]) => (
                    <div key={friendId} className="bg-white rounded-2xl shadow-lg border border-violet-100 overflow-hidden">
                      {/* Friend Header */}
                      <div className="p-6 bg-gradient-to-r from-violet-50 to-purple-50">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-violet-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                            {data.user?.username?.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-gray-800">{data.user?.username}</h3>
                            <p className="text-violet-700">{data.activities.length} recent activities</p>
                          </div>
                        </div>
                      </div>

                      {/* Friend's Activities */}
                      <div className="p-6">
                        <div className="space-y-4">
                          {data.activities.slice(0, 3).map((activity, index) => (
                            <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                              <div className="flex-1">
                                <div className="font-semibold text-gray-900">{activity.habit?.name}</div>
                                <div className="flex items-center space-x-4 mt-1 text-sm text-gray-600">
                                  <span>{formatTimeAgo(activity.createdAt)}</span>
                                  <span className="bg-gray-200 px-2 py-1 rounded-full capitalize">
                                    {activity.habit?.category}
                                  </span>
                                  {activity.habit?.currentStreak > 1 && (
                                    <span className="bg-orange-100 text-orange-700 px-2 py-1 rounded-full text-xs font-medium">
                                      {activity.habit.currentStreak} day streak
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
            
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  // Show selected friend's activities
                  (() => {
                    const friendData = groupedActivities[selectedFriend];
                    if (!friendData) return null;
                    
                    return (
                      <div className="bg-white rounded-2xl shadow-lg border border-violet-100 overflow-hidden">
                        <div className="p-6 bg-gradient-to-r from-violet-50 to-purple-50">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <div className="w-12 h-12 bg-violet-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                                {friendData.user?.username?.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <h3 className="text-xl font-bold text-gray-800">{friendData.user?.username}</h3>
                                <p className="text-violet-700">All activities</p>
                              </div>
                            </div>
                            <button
                              onClick={() => setSelectedFriend(null)}
                              className="text-violet-600 hover:text-violet-700 px-4 py-2 rounded-lg hover:bg-violet-100 transition-colors"
                            >
                              Back to All
                            </button>
                          </div>
                        </div>

                        <div className="p-6">
                          <div className="space-y-4">
                            {friendData.activities.map((activity, index) => (
                              <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl border border-gray-100 hover:bg-gray-100 transition-colors">
                                <div className="flex-1">
                                  <div className="font-semibold text-gray-900">{activity.habit?.name}</div>
                                  <div className="flex items-center space-x-4 mt-1 text-sm text-gray-600">
                                    <span>{formatTimeAgo(activity.createdAt)}</span>
                                    <span className="bg-gray-200 px-2 py-1 rounded-full capitalize">
                                      {activity.habit?.category}
                                    </span>
                                    <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full capitalize">
                                      {activity.habit?.frequency}
                                    </span>
                                    {activity.habit?.currentStreak > 1 && (
                                      <span className="bg-orange-100 text-orange-700 px-2 py-1 rounded-full text-xs font-medium">
                                        {activity.habit.currentStreak} day streak
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    );
                  })()
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
