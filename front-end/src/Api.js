// src/api.js
const API_BASE = 'http://localhost:4000';

export async function register(username, email, password) {
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, email, password }),
  });
  
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || 'Registration failed');
  }
  
  return res.json();
}

export async function login(username, password) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || 'Login failed');
  }
  
  return res.json();
}

export async function getMe(token) {
  const res = await fetch(`${API_BASE}/auth/me`, {
    headers: { 
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
  });
  
  if (!res.ok) {
    throw new Error('Unauthorized');
  }
  
  return res.json();
}
// Add these to your existing src/api.js file

// Habit API functions
export async function getHabits(token) {
  const res = await fetch(`${API_BASE}/habits`, {
    headers: { 
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
  });
  
  if (!res.ok) {
    throw new Error('Failed to fetch habits');
  }
  
  return res.json();
}

export async function createHabit(token, habitData) {
  const res = await fetch(`${API_BASE}/habits`, {
    method: 'POST',
    headers: { 
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(habitData),
  });
  
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || 'Failed to create habit');
  }
  
  return res.json();
}

export async function toggleHabitCompletion(token, habitId) {
  const res = await fetch(`${API_BASE}/habits/${habitId}/toggle`, {
    method: 'PATCH',
    headers: { 
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
  });
  
  if (!res.ok) {
    throw new Error('Failed to toggle habit');
  }
  
  return res.json();
}

export async function deleteHabit(token, habitId) {
  const res = await fetch(`${API_BASE}/habits/${habitId}`, {
    method: 'DELETE',
    headers: { 
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
  });
  
  if (!res.ok) {
    throw new Error('Failed to delete habit');
  }
  
  return res.json();
}
