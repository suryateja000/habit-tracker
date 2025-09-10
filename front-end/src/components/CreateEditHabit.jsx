import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { createHabit, updateHabit, getHabits } from '../Api'

export default function CreateEditHabit() {
  const navigate = useNavigate()
  const { id } = useParams()
  const isEditing = !!id

  const [formData, setFormData] = useState({
    name: '',
    category: 'other',
    frequency: 'daily'
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (isEditing) {
      loadHabit()
    }
  }, [id, isEditing])

  const loadHabit = async () => {
    try {
      const habits = await getHabits()
      const habit = habits.find(h => h._id === id)
      
      if (habit) {
        setFormData({
          name: habit.name,
          category: habit.category,
          frequency: habit.frequency
        })
      } else {
        setError('Habit not found')
      }
    } catch (err) {
      setError('Failed to load habit')
    }
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    if (error) setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!formData.name.trim()) {
      setError('Habit name is required')
      return
    }

    setLoading(true)

    try {
      if (isEditing) {
        await updateHabit(id, formData)
      } else {
        await createHabit(formData)
      }
      navigate('/dashboard')
    } catch (err) {
      setError(err.message || `Failed to ${isEditing ? 'update' : 'create'} habit`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <button
                onClick={() => navigate('/dashboard')}
                className="text-indigo-600 hover:text-indigo-700 mb-2 flex items-center"
              >
                <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Dashboard
              </button>
              <h1 className="text-3xl font-bold text-gray-900">
                {isEditing ? '✏️ Edit Habit' : '➕ Create New Habit'}
              </h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-sm p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Habit Name *
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="e.g., Drink 8 glasses of water"
                value={formData.name}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                id="category"
                name="category"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                value={formData.category}
                onChange={handleChange}
              >
                <option value="health">Health</option>
                <option value="fitness"> Fitness</option>
                <option value="productivity"> Productivity</option>
                <option value="learning"> Learning</option>
                <option value="other"> Other</option>
              </select>
            </div>

            <div>
              <label htmlFor="frequency" className="block text-sm font-medium text-gray-700 mb-2">
                Frequency
              </label>
              <select
                id="frequency"
                name="frequency"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                value={formData.frequency}
                onChange={handleChange}
              >
                <option value="daily">📅 Daily</option>
                <option value="weekly">📆 Weekly</option>
              </select>
            </div>

            <div className="flex space-x-4 pt-6">
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-3 px-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white rounded-lg font-medium"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-t-2 border-white rounded-full animate-spin mr-2"></div>
                    {isEditing ? 'Updating...' : 'Creating...'}
                  </div>
                ) : (
                  isEditing ? 'Update Habit' : 'Create Habit'
                )}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}
