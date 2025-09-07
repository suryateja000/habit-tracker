// src/components/AddHabitForm.jsx
import { useState } from 'react';

export default function AddHabitForm({ onAdd, onCancel }) {
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
