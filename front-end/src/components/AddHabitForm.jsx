// src/components/AddHabitForm.jsx
import React from 'react';
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
    { value: 'health', label: '🏥 Health', desc: 'Medical, wellness, self-care' },
    { value: 'fitness', label: '💪 Fitness', desc: 'Exercise, sports, physical activity' },
    { value: 'productivity', label: '💼 Productivity', desc: 'Work, organization, efficiency' },
    { value: 'learning', label: '📚 Learning', desc: 'Education, skills, knowledge' },
    { value: 'other', label: '🎯 Other', desc: 'General habits and goals' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setError('Habit name is required');
      return;
    }

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

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="bg-white rounded-xl p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900 flex items-center">
          <span className="text-2xl mr-2">✨</span>
          Create New Habit
        </h3>
        <button
          onClick={onCancel}
          className="text-gray-400 hover:text-gray-600 p-1"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Habit Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
            Habit Name *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g., Drink 8 glasses of water"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
            required
          />
        </div>

        {/* Category Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Category *
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {categories.map((category) => (
              <label
                key={category.value}
                className={`relative flex items-start p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors ${
                  formData.category === category.value
                    ? 'border-indigo-500 bg-indigo-50'
                    : 'border-gray-200'
                }`}
              >
                <input
                  type="radio"
                  name="category"
                  value={category.value}
                  checked={formData.category === category.value}
                  onChange={handleChange}
                  className="sr-only"
                />
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-900">
                    {category.label}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {category.desc}
                  </div>
                </div>
                {formData.category === category.value && (
                  <div className="text-indigo-500">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </label>
            ))}
          </div>
        </div>

        {/* Frequency Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Frequency *
          </label>
          <div className="flex space-x-4">
            <label className={`flex-1 flex items-center justify-center p-4 border-2 rounded-lg cursor-pointer transition-colors ${
              formData.frequency === 'daily'
                ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                : 'border-gray-200 hover:bg-gray-50'
            }`}>
              <input
                type="radio"
                name="frequency"
                value="daily"
                checked={formData.frequency === 'daily'}
                onChange={handleChange}
                className="sr-only"
              />
              <div className="text-center">
                <div className="text-2xl mb-1">📅</div>
                <div className="font-medium">Daily</div>
                <div className="text-xs text-gray-500">Every day</div>
              </div>
            </label>

            <label className={`flex-1 flex items-center justify-center p-4 border-2 rounded-lg cursor-pointer transition-colors ${
              formData.frequency === 'weekly'
                ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                : 'border-gray-200 hover:bg-gray-50'
            }`}>
              <input
                type="radio"
                name="frequency"
                value="weekly"
                checked={formData.frequency === 'weekly'}
                onChange={handleChange}
                className="sr-only"
              />
              <div className="text-center">
                <div className="text-2xl mb-1">🗓️</div>
                <div className="font-medium">Weekly</div>
                <div className="text-xs text-gray-500">Once a week</div>
              </div>
            </label>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-4 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 py-3 px-4 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 py-3 px-4 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 disabled:bg-indigo-400 transition-colors"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="w-5 h-5 border-t-2 border-white rounded-full animate-spin mr-2"></div>
                Creating...
              </div>
            ) : (
              'Create Habit'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
