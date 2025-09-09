// src/components/HabitCard.jsx
import React, { useState } from 'react'

export default function HabitCard({ habit, onToggle, onDelete }) {
  const [loading, setLoading] = useState(false)

  const handleToggle = async () => {
    if (loading) return
    setLoading(true)
    try {
      await onToggle(habit._id)
    } finally {
      setLoading(false)
    }
  }

  const getCategoryEmoji = (category) => {
    const emojis = {
      health: '🏥',
      productivity: '💼',
      learning: '📚',
      fitness: '💪',
      other: '🎯'
    }
    return emojis[category] || '🎯'
  }

  return (
    <div className={`bg-white rounded-xl shadow-sm border-2 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${
      habit.completedToday 
        ? 'border-green-200 bg-gradient-to-br from-green-50 to-green-100' 
        : 'border-gray-200'
    }`}>
      <div className={`h-2 rounded-t-xl ${
        habit.completedToday 
          ? 'bg-gradient-to-r from-green-400 to-green-500' 
          : 'bg-gradient-to-r from-indigo-400 to-purple-500'
      }`}></div>
      
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-900 mb-2">{habit.name}</h3>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
              <span className="mr-1">{getCategoryEmoji(habit.category)}</span>
              {habit.category}
            </span>
          </div>
          
          <button
            onClick={() => onDelete(habit._id)}
            className="text-gray-400 hover:text-red-500 p-1 rounded-md transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">🔥 {habit.currentStreak || 0}</div>
            <div className="text-xs text-gray-600">Current</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{habit.longestStreak || 0}</div>
            <div className="text-xs text-gray-600">Best</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-indigo-600">{habit.totalCompletions || 0}</div>
            <div className="text-xs text-gray-600">Total</div>
          </div>
        </div>

        {/* Toggle Button */}
        <div className="mt-6">
          {habit.completedToday ? (
            <div className="bg-green-100 text-green-800 py-3 px-4 rounded-lg text-center font-medium border border-green-200">
              <span className="text-lg mr-2">✅</span>
              Completed Today!
            </div>
          ) : (
            <button
              onClick={handleToggle}
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-bold py-3 px-4 rounded-lg transition-colors"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-t-2 border-white rounded-full animate-spin mr-2"></div>
                  Marking...
                </div>
              ) : (
                <>
                  <span className="text-lg mr-2">✨</span>
                  Mark Complete
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}