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
    { backgroundColor: '#FFD700', color: 'white' },  
    { backgroundColor: '#C0C0C0', color: 'white' }, 
    { backgroundColor: '#CD7F32', color: 'white' }, 
  ];

  const getRankStyle = (index) => {
    return rankStyles[index] || { backgroundColor: '#dcb2ffff', color: '#374151' };  
  };

  const getRankBadge = (index) => {
    return `TOP ${index + 1}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: '#f6f7fb' }}>
        <div className="absolute top-8 xs:top-12 sm:top-16 left-4 xs:left-8 sm:left-16 w-16 xs:w-20 sm:w-24 h-16 xs:h-20 sm:h-24 rounded-full opacity-40" style={{ backgroundColor: '#faca15' }}></div>
        <div className="absolute top-1/4 right-4 xs:right-8 sm:right-20 w-12 xs:w-14 sm:w-16 h-12 xs:h-14 sm:h-16 rounded-full opacity-50" style={{ backgroundColor: '#3ad2ff' }}></div>
        <div className="absolute bottom-16 xs:bottom-24 sm:bottom-32 left-2 xs:left-4 sm:left-8 w-14 xs:w-16 sm:w-20 h-14 xs:h-16 sm:h-20 rounded-full opacity-35" style={{ backgroundColor: '#e04e4e' }}></div>
        
        <div className="flex items-center justify-center min-h-screen px-4">
          <div className="text-center bg-white rounded-2xl xs:rounded-3xl p-8 xs:p-12 sm:p-16 shadow-2xl border border-violet-100 w-full max-w-sm">
            <div className="animate-spin rounded-full h-12 xs:h-14 sm:h-16 w-12 xs:w-14 sm:w-16 border-4 border-gray-200 mx-auto mb-4 xs:mb-6" style={{ borderTopColor: '#7e3ff2' }}></div>
            <p className="text-lg xs:text-xl font-semibold" style={{ color: '#7e3ff2' }}>Loading leaderboard...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f6f7fb' }}>
      <div className="absolute top-8 xs:top-12 sm:top-16 left-4 xs:left-8 sm:left-16 w-16 xs:w-20 sm:w-24 h-16 xs:h-20 sm:h-24 rounded-full opacity-40" style={{ backgroundColor: '#faca15' }}></div>
      <div className="absolute top-1/4 right-4 xs:right-8 sm:right-20 w-12 xs:w-14 sm:w-16 h-12 xs:h-14 sm:h-16 rounded-full opacity-50" style={{ backgroundColor: '#3ad2ff' }}></div>
      <div className="absolute bottom-16 xs:bottom-24 sm:bottom-32 left-2 xs:left-4 sm:left-8 w-14 xs:w-16 sm:w-20 h-14 xs:h-16 sm:h-20 rounded-full opacity-35" style={{ backgroundColor: '#e04e4e' }}></div>

      <header className="bg-white/90 backdrop-blur-sm shadow-sm border-b border-violet-100">
        <div className="max-w-7xl mx-auto px-3 xs:px-4 sm:px-6 py-3 xs:py-4">
          <div className="flex flex-col xs:flex-row xs:justify-between xs:items-center gap-4 xs:gap-0">
            <div className="flex-1">
              {isAuthenticated && (
                <button
                  onClick={() => navigate('/dashboard')}
                  className="text-violet-600 hover:text-violet-800 mb-2 xs:mb-3 transition-colors font-medium text-sm xs:text-base"
                >
                  ← Back to Dashboard
                </button>
              )}
              <h1 className="text-xl xs:text-2xl sm:text-3xl font-bold text-gray-900 leading-tight">
                Community Leaderboard
              </h1>
              <p className="text-gray-600 mt-1 text-sm xs:text-base">
                See who's building the strongest habit streaks
              </p>
            </div>
            
            {!isAuthenticated && (
              <div className="flex flex-col xs:flex-row gap-2 xs:gap-3 xs:min-w-fit">
                <button
                  onClick={() => navigate('/login')}
                  className="text-violet-600 hover:text-violet-700 px-3 xs:px-4 py-2 border-2 border-violet-200 rounded-lg xs:rounded-xl font-medium transition-colors text-sm xs:text-base text-center"
                >
                  Login
                </button>
                <button
                  onClick={() => navigate('/register')}
                  className="text-white px-3 xs:px-4 py-2 rounded-lg xs:rounded-xl font-medium transition-colors shadow-lg text-sm xs:text-base text-center"
                  style={{ backgroundColor: '#7e3ff2' }}
                >
                  Join Now
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-3 xs:px-4 sm:px-6 py-4 xs:py-6 sm:py-12 relative z-10">
        {error && (
          <div className="mb-4 xs:mb-6 p-3 xs:p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl xs:rounded-2xl shadow-lg">
            <p className="font-medium text-sm xs:text-base">{error}</p>
          </div>
        )}

        {/* Leaderboard Card - Enhanced responsive design */}
        <div className="bg-white/90 backdrop-blur-md rounded-xl xs:rounded-2xl sm:rounded-3xl shadow-xl border border-violet-100 overflow-hidden">
          <div className="p-4 xs:p-6 sm:p-8 border-b border-gray-100" style={{ backgroundColor: '#f6f7fb' }}>
            <div className="flex flex-col gap-3 xs:gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg xs:text-xl sm:text-2xl font-bold text-gray-900">Top Performers</h2>
                <p className="text-xs xs:text-sm sm:text-base text-gray-600 mt-1">
                  Ranked by average streak length
                </p>
              </div>
              <div className="flex items-center space-x-2 bg-white/60 backdrop-blur-sm rounded-full px-3 xs:px-4 py-2 border border-violet-200 self-start sm:self-auto">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-violet-800 font-semibold text-xs xs:text-sm">
                  {leaderboard.length} Competitors
                </span>
              </div>
            </div>
          </div>

          <div className="p-3 xs:p-4 sm:p-6 lg:p-8">
            {leaderboard.length === 0 ? (
              <div className="text-center py-8 xs:py-12 sm:py-16">
                <div className="w-20 h-20 xs:w-24 xs:h-24 sm:w-32 sm:h-32 rounded-full mx-auto mb-4 xs:mb-6 flex items-center justify-center border-2 border-gray-200" style={{ backgroundColor: '#f6f7fb' }}>
                  <div className="text-gray-400 font-bold text-lg xs:text-xl sm:text-2xl">RANK</div>
                </div>
                <h3 className="text-lg xs:text-xl sm:text-2xl font-bold text-gray-900 mb-2 xs:mb-3">
                  No rankings yet
                </h3>
                <p className="text-xs xs:text-sm sm:text-base text-gray-600 mb-6 xs:mb-8 max-w-md mx-auto px-4">
                  Be the first to build habit streaks and claim the top spot on our leaderboard.
                </p>
                {!isAuthenticated && (
                  <button
                    onClick={() => navigate('/register')}
                    className="px-4 xs:px-6 sm:px-8 py-2.5 xs:py-3 sm:py-4 rounded-lg xs:rounded-xl sm:rounded-2xl font-semibold text-white transition-colors shadow-lg hover:shadow-xl text-sm xs:text-base"
                    style={{ backgroundColor: '#7e3ff2' }}
                  >
                    Get Started
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-3 xs:space-y-4 sm:space-y-6">
                {leaderboard.map((user, index) => (
                  <div 
                    key={user._id} 
                    className={`flex items-center p-3 xs:p-4 sm:p-6 rounded-xl xs:rounded-2xl sm:rounded-3xl border-2 transition-all duration-200 hover:shadow-lg ${
                      index < 3 
                        ? 'border-violet-200 shadow-md' 
                        : 'border-gray-200 bg-white hover:border-violet-200'
                    }`}
                    style={index < 3 ? { backgroundColor: '#f6f7fb' } : {}}
                  >
                    <div className="flex items-center space-x-2 xs:space-x-3 sm:space-x-4 lg:space-x-6 flex-1 min-w-0">
                      
                      {/* Rank Badge - Responsive */}
                      {index < 3 && (
                        <div 
                          className="px-2 xs:px-3 py-1 rounded-full text-xs font-bold tracking-wide whitespace-nowrap"
                          style={getRankStyle(index)}
                        >
                          <span className="hidden xs:inline">{getRankBadge(index)}</span>
                          <span className="xs:hidden">#{index + 1}</span>
                        </div>
                      )}
                      
                      {/* Rank Number - Hidden on small screens for top 3, shown for others */}
                      <div className={`text-base xs:text-lg sm:text-xl lg:text-2xl font-bold min-w-[2rem] xs:min-w-[2.5rem] sm:min-w-[3rem] ${
                        index < 3 ? 'text-violet-600 hidden xs:block' : 'text-gray-600'
                      }`}>
                        #{index + 1}
                      </div>
                      
                      {/* User Avatar - Responsive sizing */}
                      <div 
                        className="w-10 h-10 xs:w-12 xs:h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-xl xs:rounded-2xl flex items-center justify-center text-white font-bold text-sm xs:text-base sm:text-lg lg:text-xl shadow-lg flex-shrink-0"
                        style={getRankStyle(index)}
                      >
                        {user.username.charAt(0).toUpperCase()}
                      </div>
                      
                      {/* User Info - Responsive text and spacing */}
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-gray-900 text-sm xs:text-base sm:text-lg truncate">
                          {user.username}
                        </div>
                        <div className="text-xs sm:text-sm text-gray-600 mt-0.5 xs:mt-1">
                          <div className="flex flex-col xs:flex-row xs:items-center xs:space-x-1">
                            <span className="whitespace-nowrap">{user.totalHabits} habits</span>
                            <span className="hidden xs:inline">•</span>
                            <span className="whitespace-nowrap">{user.totalStreaks} total streaks</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Average Streak - Responsive sizing */}
                    <div className="text-right flex-shrink-0 ml-2 xs:ml-0">
                      <div className="text-lg xs:text-xl sm:text-2xl font-bold" style={{ color: '#7e3ff2' }}>
                        {user.avgStreak.toFixed(1)}
                      </div>
                      <div className="text-xs text-gray-600 whitespace-nowrap">avg streak</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Call to Action for Non-Authenticated Users - Enhanced responsive */}
        {!isAuthenticated && (
          <div className="mt-6 xs:mt-8 bg-white/80 backdrop-blur-sm border-2 border-violet-200 rounded-xl xs:rounded-2xl sm:rounded-3xl p-4 xs:p-6 sm:p-8 text-center shadow-xl">
            <h3 className="text-base xs:text-lg sm:text-xl font-bold text-gray-900 mb-2">
              Ready to Join the Challenge?
            </h3>
            <p className="text-xs xs:text-sm sm:text-base text-gray-600 mb-4 xs:mb-6 max-w-md mx-auto px-2">
              Start building habits and compete with the community for the top spot on our leaderboard.
            </p>
            <div className="flex flex-col gap-3 xs:gap-4 sm:flex-row sm:justify-center max-w-md mx-auto">
              <button
                onClick={() => navigate('/register')}
                className="px-4 xs:px-6 sm:px-8 py-2.5 xs:py-3 sm:py-4 rounded-lg xs:rounded-xl sm:rounded-2xl font-semibold text-white transition-colors shadow-lg hover:shadow-xl text-sm xs:text-base w-full sm:w-auto"
                style={{ backgroundColor: '#7e3ff2' }}
              >
                Sign Up Now
              </button>
              <button
                onClick={() => navigate('/login')}
                className="px-4 xs:px-6 sm:px-8 py-2.5 xs:py-3 sm:py-4 rounded-lg xs:rounded-xl sm:rounded-2xl font-semibold text-violet-600 border-2 border-violet-200 bg-white hover:bg-violet-50 transition-colors text-sm xs:text-base w-full sm:w-auto"
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
