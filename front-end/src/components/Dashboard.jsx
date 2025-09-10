
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import abc from '../public/reading.jpg';

import { 
  getHabits, 
  createHabit, 
  toggleHabitCompletion, 
  deleteHabit,
  getFriends,
  searchUsers,
  sendFollowRequest,
  unfollowUser
} from '../Api';


const API_BASE_URL = 'https://habit-tracker-gx4l.onrender.com/api';

const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

export default function Dashboard() {
  const { user, logout, token } = useAuth();
  const navigate = useNavigate();
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [error, setError] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  const [friends, setFriends] = useState([]);
  const [friendIds, setFriendIds] = useState(new Set());
  const [showFollowersModal, setShowFollowersModal] = useState(false);
  const [showAddFriendsModal, setShowAddFriendsModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState({});

  
  useEffect(() => {
    const loadHabits = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        setError('');
        console.log('Loading habits for token:', token);
        const habitsData = await getHabits();
        console.log('Habits loaded:', habitsData);
        setHabits(habitsData);
      } catch (err) {
        console.error('Load habits error:', err);
        setError('Failed to load habits: ' + err.message);
      } finally {
        setLoading(false);
      }
    };
    
    loadHabits();
  }, [token]);

  
  const loadFriends = async () => {
    if (!token) return;
    
    try {
      console.log('Loading friends list...');
      const friendsData = await getFriends();
      setFriends(friendsData);
      
    
      const friendIdSet = new Set(friendsData.map(friend => friend._id));
      setFriendIds(friendIdSet);
      
      console.log('Friends loaded:', friendsData.length, 'friends');
      console.log('Friend IDs:', Array.from(friendIdSet));
      
    } catch (err) {
      console.error('Failed to load friends:', err);
    }
  };

  
  useEffect(() => {
    if (token) {
      loadFriends();
    }
  }, [token]);

  
  useEffect(() => {
    const testBackendConnection = async () => {
      if (!token) return;
      
      try {
        console.log('Testing backend connection...');
        
        const response = await fetch(`${API_BASE_URL}/health`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          console.log('Backend connection test:', data);
        } else {
          console.error('Backend connection failed:', response.status);
        }
      } catch (error) {
        console.error('Backend connection error:', error);
      }
    };
    
    if (token) {
      testBackendConnection();
    }
  }, [token]);

  
  const handleAddHabit = async (habitData) => {
    try {
      const newHabit = await createHabit(habitData);
      setHabits(prev => [{ ...newHabit, completedToday: false }, ...prev]);
      setShowAddForm(false);
    } catch (err) {
      setError('Failed to add habit: ' + err.message);
    }
  };

  const handleToggleHabit = async (habitId) => {
    try {
      const result = await toggleHabitCompletion(habitId);
      setHabits(prev => 
        prev.map(habit => 
          habit._id === habitId 
            ? { ...result.habit, completedToday: result.completed }
            : habit
        )
      );
    } catch (err) {
      setError('Failed to toggle habit: ' + err.message);
    }
  };

  const handleDeleteHabit = async (habitId) => {
    if (window.confirm('Are you sure you want to delete this habit?')) {
      try {
        await deleteHabit(habitId);
        setHabits(prev => prev.filter(habit => habit._id !== habitId));
      } catch (err) {
        setError('Failed to delete habit: ' + err.message);
      }
    }
  };

  const isUserAlreadyFriend = (userId) => {
    const isFriend = friendIds.has(userId);
    console.log(`Is user ${userId} already a friend?`, isFriend);
    return isFriend;
  }
  
  const debouncedSearch = React.useCallback(
    debounce(async (searchQuery) => {
      if (searchQuery.trim().length < 2) {
        setSearchResults([]);
        return;
      }
      
      setSearchLoading(true);
      try {
        console.log('Searching for users:', searchQuery);
        const results = await searchUsers(searchQuery);
        const filteredResults = results.filter(searchUser => searchUser._id !== user?._id);
        setSearchResults(filteredResults);
        console.log('Search results:', filteredResults.length);
      } catch (err) {
        console.error('Search failed:', err);
        setError('Failed to search users');
      } finally {
        setSearchLoading(false);
      }
    }, 300),
    [user?._id]
  );

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    debouncedSearch(query);
  };

  const handleFollowUser = async (userId) => {
    console.log('Attempting to follow user:', userId);
    
    if (user && user._id === userId) {
      setError('You cannot follow yourself');
      return;
    }
    
    if (isUserAlreadyFriend(userId)) {
      console.log('User is already a friend, skipping API call');
      setError('This user is already your friend');
      return;
    }

    setActionLoading(prev => ({ ...prev, [userId]: true }));
    
    try {
      console.log('Sending follow request...');
      await sendFollowRequest(userId);
      
      
      const userToAdd = searchResults.find(user => user._id === userId);
      if (userToAdd) {
        setFriends(prev => [...prev, userToAdd]);
        setFriendIds(prev => new Set([...prev, userId]));
      }
      
      console.log('User followed successfully');
      setError('');
      
    } catch (err) {
      console.error('Failed to follow user:', err);
      setError(err.message || 'Failed to follow user');
    } finally {
      setActionLoading(prev => ({ ...prev, [userId]: false }));
    }
  };

  
  const handleUnfollowUser = async (userId) => {
    if (!window.confirm('Are you sure you want to unfollow this user?')) return;

    setActionLoading(prev => ({ ...prev, [userId]: true }));
    
    try {
      await unfollowUser(userId);
      
      setFriends(prev => prev.filter(friend => friend._id !== userId));
      setFriendIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(userId);
        return newSet;
      });
      
      console.log('User unfollowed successfully');
      
    } catch (err) {
      console.error('Failed to unfollow user:', err);
      setError('Failed to unfollow user: ' + err.message);
    } finally {
      setActionLoading(prev => ({ ...prev, [userId]: false }));
    }
  };
  
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const todayDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  const completedToday = habits.filter(h => h.completedToday).length;
  const totalHabits = habits.length;
  const progressPercentage = totalHabits > 0 ? Math.round((completedToday / totalHabits) * 100) : 0;
  const totalStreaks = habits.reduce((sum, habit) => sum + (habit.currentStreak || 0), 0);

  if (loading) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: '#f7eefdff' }} >
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center bg-white rounded-3xl p-16 shadow-2xl border">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 mx-auto mb-6" style={{ borderTopColor: '#7e3ff2' }}></div>
            <p className="text-xl font-semibold" style={{ color: '#7e3ff2' }}>Loading your dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-violet-50 to-purple-50">
      <div className="absolute top-16 left-16 w-24 h-24 rounded-full opacity-40" style={{ backgroundColor: '#faca15' }}></div>
      <div className="absolute top-1/4 right-20 w-16 h-16 rounded-full opacity-50" style={{ backgroundColor: '#3ad2ff' }}></div>
      <div className="absolute bottom-32 left-8 w-20 h-20 rounded-full opacity-35" style={{ backgroundColor: '#e04e4e' }}></div>

      <header className="bg-gradient-to-br from-slate-50 via-violet-50 to-purple-50 backdrop-blur-sm shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">HabitTracker</h1>
            <button 
              onClick={logout}
              className="text-gray-600 hover:text-gray-900 px-3 sm:px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors text-sm sm:text-base"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-12 space-y-6 sm:space-y-10">
        
        
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4 shadow-lg">
            <div className="flex justify-between items-center">
              <p className="text-red-800 font-medium text-sm sm:text-base">{error}</p>
              <button 
                onClick={() => setError('')}
                className="text-red-500 hover:text-red-700 font-bold text-xl"
              >
                ×
              </button>
            </div>
          </div>
        )}

        
        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl p-6 sm:p-10 relative overflow-hidden">
          <div className="grid lg:grid-cols-2 gap-6 lg:gap-10 items-center relative z-10">
            
          
            <div className="lg:col-span-1 order-2 lg:order-1">
              <div className="mb-6">
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                  Welcome, <span style={{ color: '#7e3ff2' }}>{user?.username}!</span>
                </h2>
                <p className="text-sm sm:text-base text-gray-600 mb-4">{todayDate}</p>
              </div>

          
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="text-center p-4 bg-gray-50 rounded-xl border">
                  <div className="text-xl sm:text-2xl font-bold mb-1" style={{ color: '#7e3ff2' }}>{progressPercentage}%</div>
                  <div className="text-xs sm:text-sm text-gray-600">Progress</div>
                  <div className="text-xs text-gray-500">{completedToday} of {totalHabits}</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-xl border">
                  <div className="text-xl sm:text-2xl font-bold mb-1" style={{ color: '#faca15' }}>{friends.length}</div>
                  <div className="text-xs sm:text-sm text-gray-600">Friends</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-xl border">
                  <div className="text-xl sm:text-2xl font-bold mb-1" style={{ color: '#3ad2ff' }}>{totalHabits}</div>
                  <div className="text-xs sm:text-sm text-gray-600">Total Habits</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-xl border">
                  <div className="text-xl sm:text-2xl font-bold mb-1" style={{ color: '#e04e4e' }}>{totalStreaks}</div>
                  <div className="text-xs sm:text-sm text-gray-600">Total Streaks</div>
                </div>
              </div>

              
              <div className="flex flex-wrap gap-2 sm:gap-3">
                <button 
                  onClick={() => setShowFollowersModal(true)}
                  className="px-4 sm:px-6 py-2 sm:py-3 rounded-xl sm:rounded-2xl font-semibold text-white transition-colors shadow-lg hover:shadow-xl text-sm sm:text-base"
                  style={{ backgroundColor: '#7e3ff2' }}
                >
                  My Friends ({friends.length})
                </button>
                <button 
                  onClick={() => setShowAddFriendsModal(true)}
                  className="px-4 sm:px-6 py-2 sm:py-3 rounded-xl sm:rounded-2xl font-semibold text-gray-700 transition-colors border-2 border-gray-200 hover:border-gray-300 bg-white text-sm sm:text-base"
                >
                  Find Friends
                </button>
                <button 
                  onClick={() => navigate('/friends')}
                  className="px-4 sm:px-6 py-2 sm:py-3 rounded-xl sm:rounded-2xl font-semibold text-gray-700 transition-colors border-2 border-gray-200 hover:border-gray-300 bg-white text-sm sm:text-base"
                >
                  Activity Feed
                </button>
                <button 
                  onClick={() => navigate('/leaderboard')}
                  className="px-4 sm:px-6 py-2 sm:py-3 rounded-xl sm:rounded-2xl font-semibold text-gray-700 transition-colors border-2 border-gray-200 hover:border-gray-300 bg-white text-sm sm:text-base"
                >
                  Leaderboard
                </button>
              </div>
            </div>

          
            <div className="lg:col-span-1 relative order-2 lg:order-3">
              <div className="w-64 h-40 sm:w-80 sm:h-48 md:w-96 md:h-56 lg:w-80 lg:h-52 xl:w-96 xl:h-60 mx-auto relative">
                <img 
                  src={abc} 
                  alt="Habit Tracker Hero" 
                  className="w-full h-full object-cover rounded-xl sm:rounded-2xl"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-violet-900/10 to-transparent rounded-xl sm:rounded-2xl"></div>

                
                <div className="absolute -top-2 -left-2 px-3 py-1 rounded-full text-xs font-medium text-white shadow-lg" style={{ backgroundColor: '#faca15' }}>
                  Mindfulness
                </div>
                <div className="absolute top-6 -right-4 px-3 py-1 rounded-full text-xs font-medium text-white shadow-lg" style={{ backgroundColor: '#3ad2ff' }}>
                  Fitness
                </div>
                <div className="absolute -bottom-2 left-4 px-3 py-1 rounded-full text-xs font-medium text-white shadow-lg" style={{ backgroundColor: '#e04e4e' }}>
                  Growth
                </div>
              </div>
            </div>

          </div>
        </div>

        
        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl overflow-hidden">
          <div className="p-4 sm:p-6 lg:p-8 border-b border-gray-100">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Your Habits ({totalHabits})</h2>
                <p className="text-sm sm:text-base text-gray-600 mt-1">Track your daily progress and build consistency</p>
              </div>
              
              <button 
                onClick={() => setShowAddForm(true)}
                className="px-4 sm:px-6 py-2 sm:py-3 rounded-xl sm:rounded-2xl font-semibold text-white transition-colors shadow-lg hover:shadow-xl text-sm sm:text-base whitespace-nowrap"
                style={{ backgroundColor: '#7e3ff2' }}
              >
                Add New Habit
              </button>
            </div>
          </div>
          
          <div className="p-4 sm:p-6 lg:p-8">
            {habits.length === 0 ? (
              <div className="text-center py-8 sm:py-12">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full mx-auto mb-4 sm:mb-6 flex items-center justify-center" style={{ backgroundColor: '#f6f7fb' }}>
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl" style={{ backgroundColor: '#7e3ff2' }}></div>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">Start Your Journey</h3>
                <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8 max-w-md mx-auto">
                  Create your first habit and begin building a better version of yourself, one day at a time.
                </p>
                <button 
                  onClick={() => setShowAddForm(true)}
                  className="px-6 sm:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl font-semibold text-white transition-colors shadow-lg hover:shadow-xl text-sm sm:text-base"
                  style={{ backgroundColor: '#7e3ff2' }}
                >
                  Create Your First Habit
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {habits.map(habit => (
                  <ModernHabitCard
                    key={habit._id}
                    habit={habit}
                    onToggle={handleToggleHabit}
                    onDelete={handleDeleteHabit}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
      {showFollowersModal && (
        <div className="fixed inset-0 bg-violet-50 backdrop-blur-md flex items-center justify-center z-50 p-4">
  <div className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full max-h-[85vh] overflow-hidden border border-violet-100">
    {/* Header with solid violet background */}
    <div className="p-8 bg-violet-500">
      <div className="flex justify-between items-center text-white">
        <div>
          <h3 className="text-3xl font-bold mb-2">My Friends</h3>
          <p className="text-lg text-white text-opacity-90">{friends.length} friends following your journey</p>
        </div>
        <button 
          onClick={() => setShowFollowersModal(false)}
          className="text-white hover:bg-white hover:bg-opacity-20 p-3 rounded-full transition-all duration-300"
        >
          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
    
    <div className="p-6 bg-white overflow-y-auto max-h-96 custom-scrollbar">
      {friends.length === 0 ? (
        <div className="text-center py-16">
          <div className="relative mb-8">
            <div className="w-24 h-24 mx-auto bg-violet-100 rounded-2xl flex items-center justify-center border-2 border-violet-200">
              <svg className="w-12 h-12 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div className="absolute top-4 left-1/2 transform -translate-x-8">
              <div className="w-3 h-3 bg-violet-400 rounded-full"></div>
            </div>
            <div className="absolute top-8 right-1/2 transform translate-x-8">
              <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
            </div>
          </div>
          <h4 className="text-2xl font-bold text-violet-800 mb-3">No friends yet</h4>
          <p className="text-lg text-violet-600 mb-8 max-w-md mx-auto">Start connecting with other habit builders!</p>
          <button
            onClick={() => {
              setShowFollowersModal(false);
              setShowAddFriendsModal(true);
            }}
            className="px-8 py-3 rounded-xl font-bold text-white transition-colors bg-violet-500 hover:bg-violet-600"
          >
            Find Friends
          </button>
        </div>
      ) : (
        <div className="grid gap-4">
          {friends.map(friend => {
            // Simple solid colors for avatars
            const photoColors = [
              'bg-violet-400',
              'bg-indigo-400',
              'bg-purple-400',
              'bg-fuchsia-400',
              'bg-pink-400',
              'bg-blue-400'
            ];
            const randomColor = photoColors[Math.abs(friend._id.charCodeAt(0)) % photoColors.length];
            
            return (
              <div key={friend._id} className="group bg-white rounded-2xl border-2 border-violet-100 hover:border-violet-300 hover:shadow-xl transition-all duration-300 overflow-hidden">
                <div className="flex items-center p-6">
                  {/* Simple avatar */}
                  <div className="relative mr-6">
                    <div className={`w-20 h-20 rounded-2xl ${randomColor} flex items-center justify-center shadow-lg`}>
                      <span className="text-white font-bold text-2xl">
                        {friend.username.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-violet-400 border-3 border-white rounded-full"></div>
                  </div>
                  
                  {/* User info */}
                  <div className="flex-1">
                    <h4 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-violet-600 transition-colors">
                      {friend.username}
                    </h4>
                    <p className="text-violet-500 text-base mb-2">{friend.email}</p>
                    
                    {/* Simple decorative elements */}
                    <div className="flex space-x-1 mt-2">
                      <div className="w-2 h-2 bg-violet-300 rounded-full opacity-60"></div>
                      <div className="w-2 h-2 bg-purple-300 rounded-full opacity-40"></div>
                      <div className="w-2 h-2 bg-fuchsia-300 rounded-full opacity-50"></div>
                    </div>
                  </div>
                  
                  {/* Unfollow button */}
                  <button
                    onClick={() => handleUnfollowUser(friend._id)}
                    disabled={actionLoading[friend._id]}
                    className="px-8 py-3 rounded-xl font-bold transition-colors disabled:opacity-50 bg-red-500 hover:bg-red-600 text-white"
                  >
                    {actionLoading[friend._id] ? 'Removing...' : 'Unfollow'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  </div>
</div>

      )}
      
      {showAddFriendsModal && (
        <div className="fixed inset-0 bg-violet-50 backdrop-blur-md flex items-center justify-center z-50 p-4">
  <div className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full max-h-[85vh] overflow-hidden relative border border-violet-100">
    {/* Header with solid background */}
    <div className="relative p-8 bg-violet-500">
      <div className="relative z-10 flex justify-between items-center text-white">
        <div>
          <h3 className="text-3xl font-bold mb-2">Discover People</h3>
          <p className="text-lg text-white text-opacity-90">Build your habit community</p>
        </div>
        <button 
          onClick={() => {
            setShowAddFriendsModal(false);
            setSearchQuery('');
            setSearchResults([]);
          }}
          className="text-white hover:bg-white hover:bg-opacity-20 p-3 rounded-full transition-all duration-300"
        >
          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
    
    <div className="p-6 bg-white">
      {/* Search bar */}
      <div className="mb-8 relative">
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
          <svg className="w-6 h-6 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          type="text"
          placeholder="Search by username or email..."
          value={searchQuery}
          onChange={handleSearch}
          className="w-full pl-12 pr-6 py-4 border-2 border-violet-200 rounded-2xl focus:ring-4 focus:ring-violet-100 focus:border-violet-400 transition-all duration-300 text-lg bg-violet-25 hover:bg-white"
        />
      </div>

      <div className="overflow-y-auto max-h-96 custom-scrollbar">
        {searchLoading && (
          <div className="text-center py-16">
            <p className="text-lg text-violet-700 font-medium">Finding amazing people...</p>
          </div>
        )}

        {searchResults.length > 0 ? (
          <div className="grid gap-4">
            {searchResults.map(searchUser => {
              const isAlreadyFriend = isUserAlreadyFriend(searchUser._id);
              const isLoading = actionLoading[searchUser._id];
              
              // Simple solid colors instead of gradients
              const photoColors = [
                'bg-violet-400',
                'bg-indigo-400',
                'bg-purple-400',
                'bg-fuchsia-400',
                'bg-pink-400',
                'bg-blue-400'
              ];
              const randomColor = photoColors[Math.abs(searchUser._id.charCodeAt(0)) % photoColors.length];
              
              return (
                <div key={searchUser._id} className="group bg-white rounded-2xl border-2 border-violet-100 hover:border-violet-300 hover:shadow-xl transition-all duration-300 overflow-hidden">
                  <div className="flex items-center p-6">
                    {/* Simple avatar */}
                    <div className="relative mr-6">
                      <div className={`w-20 h-20 rounded-2xl ${randomColor} flex items-center justify-center shadow-lg`}>
                        <span className="text-white font-bold text-2xl">
                          {searchUser.username.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-violet-400 border-3 border-white rounded-full"></div>
                    </div>
                    
                    {/* User info */}
                    <div className="flex-1">
                      <h4 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-violet-600 transition-colors">
                        {searchUser.username}
                      </h4>
                      <p className="text-violet-500 text-base mb-2">{searchUser.email}</p>
                      
                      {isAlreadyFriend && (
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-violet-400 rounded-full"></div>
                          <span className="text-sm font-semibold text-violet-600">Following</span>
                        </div>
                      )}
                      
                      {/* Simple decorative elements */}
                      <div className="flex space-x-1 mt-2">
                        <div className="w-2 h-2 bg-violet-300 rounded-full opacity-60"></div>
                        <div className="w-2 h-2 bg-purple-300 rounded-full opacity-40"></div>
                        <div className="w-2 h-2 bg-fuchsia-300 rounded-full opacity-50"></div>
                      </div>
                    </div>
                    
                    {/* Simple action button */}
                    <button
                      onClick={() => isAlreadyFriend ? handleUnfollowUser(searchUser._id) : handleFollowUser(searchUser._id)}
                      disabled={isLoading}
                      className={`px-8 py-3 rounded-xl font-bold transition-colors disabled:opacity-50 ${
                        isAlreadyFriend 
                          ? 'bg-red-500 hover:bg-red-600 text-white'
                          : 'bg-violet-500 hover:bg-violet-600 text-white'
                      }`}
                    >
                      {isLoading ? 'Loading...' : (isAlreadyFriend ? 'Unfollow' : 'Follow')}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : searchQuery && !searchLoading ? (
          <div className="text-center py-16">
            <div className="relative mb-8">
              <div className="w-24 h-24 mx-auto bg-violet-200 rounded-2xl flex items-center justify-center">
                <svg className="w-12 h-12 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2">
                <div className="w-4 h-4 bg-fuchsia-400 rounded-full opacity-60"></div>
              </div>
            </div>
            <h4 className="text-2xl font-bold text-violet-800 mb-3">No matches found</h4>
            <p className="text-lg text-violet-600 max-w-sm mx-auto">Try different keywords to discover new habit builders in your community.</p>
          </div>
        ) : !searchQuery ? (
          <div className="text-center py-16">
            <div className="relative mb-8">
              <div className="w-24 h-24 mx-auto bg-violet-100 rounded-2xl flex items-center justify-center border-2 border-violet-200">
                <svg className="w-12 h-12 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div className="absolute top-4 left-1/2 transform -translate-x-8">
                <div className="w-3 h-3 bg-violet-400 rounded-full"></div>
              </div>
              <div className="absolute top-8 right-1/2 transform translate-x-8">
                <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
              </div>
            </div>
            <h4 className="text-2xl font-bold text-violet-800 mb-3">Discover Your Community</h4>
            <p className="text-lg text-violet-600 max-w-md mx-auto">Start typing to find people who share your passion for building better habits.</p>
          </div>
        ) : null}
      </div>
    </div>
  </div>
</div>

      )}
      
      {showAddForm && (
        <ModernAddHabitForm
          onAdd={handleAddHabit}
          onCancel={() => setShowAddForm(false)}
        />
      )}
    </div>
  );
}

function ModernHabitCard({ habit, onToggle, onDelete }) {
  const [loading, setLoading] = useState(false);

  const handleToggle = async () => {
    setLoading(true);
    try {
      await onToggle(habit._id);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    await onDelete(habit._id);
    
  };

  return (
    <div className={`bg-white rounded-2xl sm:rounded-3xl shadow-lg p-4 sm:p-6 transition-all duration-200 hover:shadow-xl relative ${
      habit.completedToday ? 'ring-2' : ''
    }`}
    style={habit.completedToday ? { ringColor: '#3ad2ff' } : {}}
    >
      
      
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 min-w-0">
          <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2 truncate">{habit.name}</h3>
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2 sm:px-3 py-1 rounded-full text-xs font-medium text-white capitalize" style={{ backgroundColor: '#7e3ff2' }}>
              {habit.category}
            </span>
            <span className="px-2 sm:px-3 py-1 rounded-full text-xs font-medium text-gray-700 capitalize bg-gray-100">
              {habit.frequency}
            </span>
          </div>
        </div>
        
        <button
          onClick={handleDelete}
          className="text-gray-400 hover:text-red-500 p-1.5 sm:p-2 rounded-full hover:bg-red-50 transition-colors ml-2 flex-shrink-0"
          title="Delete habit"
        >
          <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>

      
      <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-4 sm:mb-6">
        <div className="text-center p-2 sm:p-3 rounded-xl sm:rounded-2xl" style={{ backgroundColor: '#f6f7fb' }}>
          <div className="text-sm sm:text-lg font-bold" style={{ color: '#7e3ff2' }}>{habit.currentStreak || 0}</div>
          <div className="text-xs text-gray-600">Current</div>
        </div>
        <div className="text-center p-2 sm:p-3 rounded-xl sm:rounded-2xl" style={{ backgroundColor: '#f6f7fb' }}>
          <div className="text-sm sm:text-lg font-bold" style={{ color: '#3ad2ff' }}>{habit.longestStreak || 0}</div>
          <div className="text-xs text-gray-600">Best</div>
        </div>
        <div className="text-center p-2 sm:p-3 rounded-xl sm:rounded-2xl" style={{ backgroundColor: '#f6f7fb' }}>
          <div className="text-sm sm:text-lg font-bold" style={{ color: '#faca15' }}>{habit.totalCompletions || 0}</div>
          <div className="text-xs text-gray-600">Total</div>
        </div>
      </div>

      
      {habit.completedToday ? (
        <div className="flex items-center justify-center py-2.5 sm:py-3 px-4 rounded-xl sm:rounded-2xl text-white font-semibold text-sm sm:text-base" style={{ backgroundColor: '#3ad2ff' }}>
          <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span className="text-sm">Completed!</span>
        </div>
      ) : (
        <button
          onClick={handleToggle}
          disabled={loading}
          className="w-full py-2.5 sm:py-3 px-4 rounded-xl sm:rounded-2xl font-semibold text-white transition-colors shadow-lg hover:shadow-xl text-sm sm:text-base"
          style={{ backgroundColor: '#7e3ff2' }}
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <div className="w-3.5 h-3.5 sm:w-4 sm:h-4 border-t-2 border-white rounded-full animate-spin mr-2"></div>
              Marking...
            </div>
          ) : (
            <div className="flex items-center justify-center">
              <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Mark Complete
            </div>
          )}
        </button>
      )}
    </div>
  );
}

function ModernAddHabitForm({ onAdd, onCancel }) {
  const [formData, setFormData] = useState({
    name: '',
    category: 'other',
    frequency: 'daily'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const categories = [
    { value: 'health', label: 'Health' },
    { value: 'fitness', label: 'Fitness' },
    { value: 'productivity', label: 'Productivity' },
    { value: 'learning', label: 'Learning' },
    { value: 'other', label: 'Other' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    setLoading(true);
    setError('');

    try {
      await onAdd(formData);
      setFormData({ name: '', category: 'other', frequency: 'daily' });
      onCancel();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl max-w-md w-full">
        <div className="p-6 sm:p-8 border-b border-gray-100" style={{ backgroundColor: '#f6f7fb' }}>
          <h3 className="text-xl sm:text-2xl font-bold text-gray-900">Add New Habit</h3>
          <p className="text-sm sm:text-base text-gray-600 mt-1">Start building a better you</p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-4 sm:p-6">
          <div className="space-y-4 sm:space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 sm:mb-3">Habit Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Drink 8 glasses of water"
                required
                maxLength="100"
                className="w-full px-4 sm:px-6 py-3 sm:py-4 border border-gray-200 rounded-xl sm:rounded-2xl focus:ring-2 transition-colors text-sm sm:text-base"
                style={{ focusRingColor: '#7e3ff2' }}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 sm:mb-3">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 sm:px-6 py-3 sm:py-4 border border-gray-200 rounded-xl sm:rounded-2xl focus:ring-2 transition-colors text-sm sm:text-base"
                style={{ focusRingColor: '#7e3ff2' }}
              >
                {categories.map(cat => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 sm:mb-3">Frequency</label>
              <select
                value={formData.frequency}
                onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
                className="w-full px-4 sm:px-6 py-3 sm:py-4 border border-gray-200 rounded-xl sm:rounded-2xl focus:ring-2 transition-colors text-sm sm:text-base"
                style={{ focusRingColor: '#7e3ff2' }}
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
              </select>
            </div>
          </div>

          {error && (
            <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl sm:rounded-2xl text-sm">
              {error}
            </div>
          )}

          <div className="flex space-x-3 sm:space-x-4 mt-6 sm:mt-8">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 py-3 sm:py-4 px-4 sm:px-6 border border-gray-200 text-gray-700 rounded-xl sm:rounded-2xl hover:bg-gray-50 font-semibold transition-colors text-sm sm:text-base"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !formData.name.trim()}
              className="flex-1 py-3 sm:py-4 px-4 sm:px-6 text-white rounded-xl sm:rounded-2xl font-semibold transition-colors shadow-lg hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50 text-sm sm:text-base"
              style={{ backgroundColor: '#7e3ff2' }}
            >
              {loading ? 'Adding...' : 'Add Habit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
