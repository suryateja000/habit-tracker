// src/components/HabitCard.jsx
import { useState } from 'react';

export default function HabitCard({ habit, onToggle, onDelete }) {
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
    if (window.confirm(`Delete "${habit.name}"? This action cannot be undone.`)) {
      await onDelete(habit._id);
    }
  };

  const getCategoryEmoji = (category) => {
    const emojis = {
      health: '🏥',
      productivity: '💼',
      learning: '📚',
      fitness: '💪',
      mindfulness: '🧘',
      other: '🎯'
    };
    return emojis[category] || '🎯';
  };

  const getCategoryColor = (category) => {
    const colors = {
      health: 'bg-red-100 text-red-800',
      productivity: 'bg-blue-100 text-blue-800',
      learning: 'bg-yellow-100 text-yellow-800',
      fitness: 'bg-green-100 text-green-800',
      mindfulness: 'bg-purple-100 text-purple-800',
      other: 'bg-gray-100 text-gray-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className={`habit-card ${habit.completedToday ? 'completed' : ''}`}>
      <div className="habit-header">
        <div className="habit-info">
          <span className="habit-emoji">{getCategoryEmoji(habit.category)}</span>
          <div>
            <h3 className="habit-name">{habit.name}</h3>
            <div className="habit-meta">
              <span className={`category-badge ${getCategoryColor(habit.category)}`}>
                {habit.category}
              </span>
              <span className="frequency-badge">{habit.frequency}</span>
            </div>
          </div>
        </div>
        <button 
          onClick={handleDelete}
          className="delete-button"
          title="Delete habit"
        >
          🗑️
        </button>
      </div>

      <div className="habit-stats">
        <div className="stat">
          <span className="stat-value">{habit.currentStreak}</span>
          <span className="stat-label">Current Streak</span>
        </div>
        <div className="stat">
          <span className="stat-value">{habit.longestStreak}</span>
          <span className="stat-label">Best Streak</span>
        </div>
        <div className="stat">
          <span className="stat-value">{habit.totalCompletions}</span>
          <span className="stat-label">Total</span>
        </div>
      </div>

      <button
        onClick={handleToggle}
        disabled={loading}
        className={`check-button ${habit.completedToday ? 'completed' : ''}`}
      >
        {loading ? '⏳' : habit.completedToday ? '✅ Completed Today' : '⭕ Mark Complete'}
      </button>
    </div>
  );
}
