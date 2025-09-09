// src/components/Leaderboard.jsx - Professional design without icons/emojis
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { getLeaderboard } from '../Api'

export default function Leaderboard() {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const [leaderboard, setLeaderboard] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadLeaderboard()
  }, [])

  const loadLeaderboard = async () => {
    try {
      setError('')
      const data = await getLeaderboard()
      setLeaderboard(data)
    } catch (err) {
      console.error('Failed to load leaderboard:', err)
      setError('Failed to load leaderboard')
    } finally {
      setLoading(false)
    }
  }

 const rankStyles = [
  { backgroundColor: '#FFD700', color: 'white' }, // 1st - Gold
  { backgroundColor: '#C0C0C0', color: 'white' }, // 2nd - Silver
  { backgroundColor: '#CD7F32', color: 'white' }, // 3rd - Bronze
];


  const getRankStyle = (index) => {
    return rankStyles[index] || { backgroundColor: '#dcb2ffff', color: '#374151' }; // Default: gray bg, dark text
  };

  const getRankBadge = (index) => {
    return `TOP ${index + 1}`;
  };
  if (loading) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: '#f6f7fb' }}>
        {/* Floating Elements */}
        <div className="absolute top-16 left-16 w-24 h-24 rounded-full opacity-40" style={{ backgroundColor: '#faca15' }}></div>
        <div className="absolute top-1/4 right-20 w-16 h-16 rounded-full opacity-50" style={{ backgroundColor: '#3ad2ff' }}></div>
        <div className="absolute bottom-32 left-8 w-20 h-20 rounded-full opacity-35" style={{ backgroundColor: '#e04e4e' }}></div>
        
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center bg-white rounded-3xl p-16 shadow-2xl border border-violet-100">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 mx-auto mb-6" style={{ borderTopColor: '#7e3ff2' }}></div>
            <p className="text-xl font-semibold" style={{ color: '#7e3ff2' }}>Loading leaderboard...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f6f7fb' }}>
      {/* Floating Elements */}
      <div className="absolute top-16 left-16 w-24 h-24 rounded-full opacity-40" style={{ backgroundColor: '#faca15' }}></div>
      <div className="absolute top-1/4 right-20 w-16 h-16 rounded-full opacity-50" style={{ backgroundColor: '#3ad2ff' }}></div>
      <div className="absolute bottom-32 left-8 w-20 h-20 rounded-full opacity-35" style={{ backgroundColor: '#e04e4e' }}></div>

      {/* Clean Header */}
      <header className="bg-white/90 backdrop-blur-sm shadow-sm border-b border-violet-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              {isAuthenticated && (
                <button
                  onClick={() => navigate('/dashboard')}
                  className="text-violet-600 hover:text-violet-800 mb-3 transition-colors font-medium"
                >
                  ← Back to Dashboard
                </button>
              )}
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Community Leaderboard</h1>
              <p className="text-gray-600 mt-1">See who's building the strongest habit streaks</p>
            </div>
            
            {!isAuthenticated && (
              <div className="flex space-x-3">
                <button
                  onClick={() => navigate('/login')}
                  className="text-violet-600 hover:text-violet-700 px-4 py-2 border-2 border-violet-200 rounded-xl font-medium transition-colors"
                >
                  Login
                </button>
                <button
                  onClick={() => navigate('/register')}
                  className="text-white px-4 py-2 rounded-xl font-medium transition-colors shadow-lg"
                  style={{ backgroundColor: '#7e3ff2' }}
                >
                  Join Now
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-12 relative z-10">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-2xl shadow-lg">
            <p className="font-medium">{error}</p>
          </div>
        )}

        {/* Leaderboard Card */}
        <div className="bg-white/90 backdrop-blur-md rounded-2xl sm:rounded-3xl shadow-xl border border-violet-100 overflow-hidden">
          <div className="p-6 sm:p-8 border-b border-gray-100" style={{ backgroundColor: '#f6f7fb' }}>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Top Performers</h2>
                <p className="text-sm sm:text-base text-gray-600 mt-1">Ranked by average streak length</p>
              </div>
              <div className="flex items-center space-x-2 bg-white/60 backdrop-blur-sm rounded-full px-4 py-2 border border-violet-200">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-violet-800 font-semibold text-sm">{leaderboard.length} Competitors</span>
              </div>
            </div>
          </div>

          <div className="p-4 sm:p-6 lg:p-8">
            {leaderboard.length === 0 ? (
              <div className="text-center py-12 sm:py-16">
                <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full mx-auto mb-6 flex items-center justify-center border-2 border-gray-200" style={{ backgroundColor: '#f6f7fb' }}>
                  <div className="text-gray-400 font-bold text-2xl">RANK</div>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">No rankings yet</h3>
                <p className="text-sm sm:text-base text-gray-600 mb-8 max-w-md mx-auto">
                  Be the first to build habit streaks and claim the top spot on our leaderboard.
                </p>
                {!isAuthenticated && (
                  <button
                    onClick={() => navigate('/register')}
                    className="px-6 sm:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl font-semibold text-white transition-colors shadow-lg hover:shadow-xl text-sm sm:text-base"
                    style={{ backgroundColor: '#7e3ff2' }}
                  >
                    Get Started
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-4 sm:space-y-6">
                {leaderboard.map((user, index) => (
                  <div 
                    key={user._id} 
                    className={`flex items-center p-4 sm:p-6 rounded-2xl sm:rounded-3xl border-2 transition-all duration-200 hover:shadow-lg ${
                      index < 3 
                        ? 'border-violet-200 shadow-md' 
                        : 'border-gray-200 bg-white hover:border-violet-200'
                    }`}
                    style={index < 3 ? { backgroundColor: '#f6f7fb' } : {}}
                  >
                    <div className="flex items-center space-x-4 sm:space-x-6 flex-1">
                      
                      {/* Rank Badge */}
                      {index < 3 && (
                        <div 
                          className="px-3 py-1 rounded-full text-xs font-bold tracking-wide"
                          style={getRankStyle(index)}
                        >
                          {getRankBadge(index)}
                        </div>
                      )}
                      
                      {/* Rank Number */}
                      <div className={`text-xl sm:text-2xl font-bold min-w-[3rem] ${
                        index < 3 ? 'text-violet-600' : 'text-gray-600'
                      }`}>
                        #{index + 1}
                      </div>
                      
                      {/* User Avatar */}
                      <div 
                        className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center text-white font-bold text-lg sm:text-xl shadow-lg"
                        style={getRankStyle(index)}
                      >
                        {user.username.charAt(0).toUpperCase()}
                      </div>
                      
                      {/* User Info */}
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-gray-900 text-base sm:text-lg truncate">
                          {user.username}
                        </div>
                        <div className="text-xs sm:text-sm text-gray-600 mt-1">
                          <span className="inline-flex items-center space-x-1">
                            <span>{user.totalHabits} habits</span>
                            <span>•</span>
                            <span>{user.totalStreaks} total streaks</span>
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Average Streak */}
                    <div className="text-right">
                      <div className="text-xl sm:text-2xl font-bold" style={{ color: '#7e3ff2' }}>
                        {user.avgStreak.toFixed(1)}
                      </div>
                      <div className="text-xs text-gray-600">avg streak</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Call to Action for Non-Authenticated Users */}
        {!isAuthenticated && (
          <div className="mt-8 bg-white/80 backdrop-blur-sm border-2 border-violet-200 rounded-2xl sm:rounded-3xl p-6 sm:p-8 text-center shadow-xl">
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
              Ready to Join the Challenge?
            </h3>
            <p className="text-sm sm:text-base text-gray-600 mb-6 max-w-md mx-auto">
              Start building habits and compete with the community for the top spot on our leaderboard.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <button
                onClick={() => navigate('/register')}
                className="px-6 sm:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl font-semibold text-white transition-colors shadow-lg hover:shadow-xl text-sm sm:text-base"
                style={{ backgroundColor: '#7e3ff2' }}
              >
                Sign Up Now
              </button>
              <button
                onClick={() => navigate('/login')}
                className="px-6 sm:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl font-semibold text-violet-600 border-2 border-violet-200 bg-white hover:bg-violet-50 transition-colors text-sm sm:text-base"
              >
                Already have an account?
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
