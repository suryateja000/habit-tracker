// src/components/Dashboard.jsx
import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getHabits, createHabit, toggleHabitCompletion, deleteHabit } from '../Api';

export default function Dashboard() {
  const { user, logout, token } = useAuth();
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [error, setError] = useState('');

  // Load habits when component mounts OR when token changes
  useEffect(() => {
    const loadHabits = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        setError('');
        console.log('Loading habits for token:', token); // Debug log
        const habitsData = await getHabits(token);
        console.log('Habits loaded:', habitsData); // Debug log
        setHabits(habitsData);
      } catch (err) {
        console.error('Load habits error:', err); // Debug log
        setError('Failed to load habits: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    loadHabits();
  }, [token]); // This will run when token changes (after login)

  const handleAddHabit = async (habitData) => {
    try {
      const newHabit = await createHabit(token, habitData);
      setHabits(prev => [{ ...newHabit, completedToday: false }, ...prev]);
    } catch (err) {
      setError('Failed to add habit: ' + err.message);
    }
  };

  const handleToggleHabit = async (habitId) => {
    try {
      const result = await toggleHabitCompletion(token, habitId);
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
    try {
      await deleteHabit(token, habitId);
      setHabits(prev => prev.filter(habit => habit._id !== habitId));
    } catch (err) {
      setError('Failed to delete habit: ' + err.message);
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

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading your habits...</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="header-content">
          <div className="header-left">
            <h1>🎯 Habit Tracker</h1>
            <p className="date">{todayDate}</p>
          </div>
          <div className="header-right">
            <span className="user-greeting">Hi, {user?.username}!</span>
            <button onClick={logout} className="logout-button">
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="dashboard-main">
        <div className="dashboard-content">
          {/* Debug Info */}
          {error && (
            <div className="error-message">
              <strong>Error:</strong> {error}
            </div>
          )}

          {/* Daily Summary */}
          <div className="daily-summary">
            <h2>Today's Progress</h2>
            <div className="progress-stats">
              <div className="progress-item">
                <span className="progress-number">{completedToday}</span>
                <span className="progress-label">Completed</span>
              </div>
              <div className="progress-divider">/</div>
              <div className="progress-item">
                <span className="progress-number">{totalHabits}</span>
                <span className="progress-label">Total Habits</span>
              </div>
            </div>
            {totalHabits > 0 && (
              <div className="progress-bar">
                <div 
                  className="progress-fill"
                  style={{ width: `${(completedToday / totalHabits) * 100}%` }}
                ></div>
              </div>
            )}
          </div>

          {/* Habits Section */}
          <div className="habits-section">
            <div className="section-header">
              <h2>Your Habits ({habits.length})</h2>
              <button 
                onClick={() => setShowAddForm(true)}
                className="add-habit-button"
              >
                ➕ Add Habit
              </button>
            </div>

            {habits.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">🎯</div>
                <h3>No habits yet!</h3>
                <p>Start building better habits by adding your first one.</p>
                <button 
                  onClick={() => setShowAddForm(true)}
                  className="add-first-habit-button"
                >
                  Add Your First Habit
                </button>
              </div>
            ) : (
              <div className="habits-grid">
                {habits.map(habit => (
                  <HabitCard
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

      {/* Add Habit Form Modal */}
      {showAddForm && (
        <AddHabitForm
          onAdd={handleAddHabit}
          onCancel={() => setShowAddForm(false)}
        />
      )}
    </div>
  );
}

// Keep your existing HabitCard and AddHabitForm components...
function HabitCard({ habit, onToggle, onDelete }) {
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

  return (
    <div className={`habit-card ${habit.completedToday ? 'completed' : ''}`}>
      <div className="habit-header">
        <div className="habit-info">
          <span className="habit-emoji">{getCategoryEmoji(habit.category)}</span>
          <div>
            <h3 className="habit-name">{habit.name}</h3>
            <div className="habit-meta">
              <span className="category-badge">{habit.category}</span>
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

function AddHabitForm({ onAdd, onCancel }) {
  const [formData, setFormData] = useState({
    name: '',
    category: 'other',
    frequency: 'daily'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const categories = [
    { value: 'health', label: '🏥 Health' },
    { value: 'fitness', label: '💪 Fitness' },
    { value: 'productivity', label: '💼 Productivity' },
    { value: 'learning', label: '📚 Learning' },
    { value: 'mindfulness', label: '🧘 Mindfulness' },
    { value: 'other', label: '🎯 Other' }
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
    <div className="add-habit-overlay">
      <form className="add-habit-form" onSubmit={handleSubmit}>
        <h3>Add New Habit</h3>
        
        <div className="form-group">
          <label>Habit Name</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g., Drink 8 glasses of water"
            required
            maxLength="100"
          />
        </div>

        <div className="form-group">
          <label>Category</label>
          <select
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          >
            {categories.map(cat => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Frequency</label>
          <select
            value={formData.frequency}
            onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
          </select>
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="form-actions">
          <button type="button" onClick={onCancel} className="cancel-button">
            Cancel
          </button>
          <button type="submit" disabled={loading} className="add-button">
            {loading ? 'Adding...' : 'Add Habit'}
          </button>
        </div>
      </form>
    </div>
  );
}
