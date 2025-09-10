// src/App.jsx

import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './contexts/AuthContext'
import Login from './components/Login'
import Register from './components/Register'
import Dashboard from './components/Dashboard'
import FriendsActivity from './components/FriendsActivity'
import CreateEditHabit from './components/CreateEditHabit'
import UserProfile from './components/UserProfile'
import Leaderboard from './components/Leaderboard'
import LoadingSpinner from './components/LoadingSpinner'
import SimpleLandingPage from './components/LandingPage'

function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth()
  
  if (loading) return <LoadingSpinner />
  
  return isAuthenticated ? children : <Navigate to="/login" />
}

function PublicRoute({ children }) {
  const { isAuthenticated, loading } = useAuth()
  
  if (loading) return <LoadingSpinner />
  
  return isAuthenticated ? <Navigate to="/dashboard" /> : children
}

export default function App() {
  return (
    <Routes>
      <Route 
        path="/login" 
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        } 
      />
      <Route 
        path="/register" 
        element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        } 
      />
      <Route 
        path="/" 
        element={
          <PublicRoute>
            <SimpleLandingPage />
          </PublicRoute>
        } 
      />

      
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/friends" 
        element={
          <ProtectedRoute>
            <FriendsActivity />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/create-habit" 
        element={
          <ProtectedRoute>
            <CreateEditHabit />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/edit-habit/:id" 
        element={
          <ProtectedRoute>
            <CreateEditHabit />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/profile" 
        element={
          <ProtectedRoute>
            <UserProfile />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/leaderboard" 
        element={
          <ProtectedRoute>
            <Leaderboard />
          </ProtectedRoute>
        } 
      />

      
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  )
}
