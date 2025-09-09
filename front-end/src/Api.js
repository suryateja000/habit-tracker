const API_BASE_URL = 'https://habit-tracker-gx4l.onrender.com/api';

const getAuthToken = () => localStorage.getItem('token');

const getAuthHeaders = () => {
  const token = getAuthToken();
  const headers = { 'Content-Type': 'application/json' };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  return headers;
};

const handleResponse = async (response) => {
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`HTTP ${response.status}: ${errorText}`);
  }

  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return await response.json();
  }

  return await response.text();
};

// Authentication APIs
export const register = async (username, email, password) => {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, email, password })
  });
  return await handleResponse(response);
};

export const login = async (username, password) => {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
  return await handleResponse(response);
};

export const getProfile = async () => {
  const response = await fetch(`${API_BASE_URL}/auth/profile`, {
    headers: getAuthHeaders()
  });
  return await handleResponse(response);
};

// Habit Management APIs
export const getHabits = async () => {
  const response = await fetch(`${API_BASE_URL}/habits`, {
    headers: getAuthHeaders()
  });
  return await handleResponse(response);
};

export const createHabit = async (habitData) => {
  const response = await fetch(`${API_BASE_URL}/habits`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(habitData)
  });
  return await handleResponse(response);
};

export const updateHabit = async (habitId, habitData) => {
  const response = await fetch(`${API_BASE_URL}/habits/${habitId}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(habitData)
  });
  return await handleResponse(response);
};

export const deleteHabit = async (habitId) => {
  const response = await fetch(`${API_BASE_URL}/habits/${habitId}`, {
    method: 'DELETE',
    headers: getAuthHeaders()
  });
  return await handleResponse(response);
};

export const toggleHabitCompletion = async (habitId) => {
  const response = await fetch(`${API_BASE_URL}/habits/${habitId}/toggle`, {
    method: 'POST',
    headers: getAuthHeaders()
  });
  return await handleResponse(response);
};

// Social Features APIs
export const searchUsers = async (query) => {
  const response = await fetch(`${API_BASE_URL}/social/search?q=${encodeURIComponent(query)}`, {
    headers: getAuthHeaders()
  });
  return await handleResponse(response);
};

export const sendFollowRequest = async (recipientId) => {
  const response = await fetch(`${API_BASE_URL}/social/follow`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ recipientId })
  });
  return await handleResponse(response);
};

export const unfollowUser = async (userId) => {
  const response = await fetch(`${API_BASE_URL}/social/unfollow`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ userId })
  });
  return await handleResponse(response);
};

export const getFriends = async () => {
  const response = await fetch(`${API_BASE_URL}/social/friends`, {
    headers: getAuthHeaders()
  });
  return await handleResponse(response);
};

export const getFriendsActivity = async (page = 1) => {
  const response = await fetch(`${API_BASE_URL}/social/activity?page=${page}`, {
    headers: getAuthHeaders()
  });
  return await handleResponse(response);
};

export const getUserProfile = async (userId) => {
  const response = await fetch(`${API_BASE_URL}/social/profile/${userId}`, {
    headers: getAuthHeaders()
  });
  return await handleResponse(response);
};

export const checkFriendshipStatus = async (userId) => {
  const response = await fetch(`${API_BASE_URL}/social/friendship-status/${userId}`, {
    headers: getAuthHeaders()
  });
  return await handleResponse(response);
};

// Leaderboard API
export const getLeaderboard = async () => {
  const response = await fetch(`${API_BASE_URL}/leaderboard`, {
    headers: getAuthHeaders()
  });
  return await handleResponse(response);
};

