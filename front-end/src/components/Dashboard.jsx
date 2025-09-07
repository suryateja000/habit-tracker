// src/components/Dashboard.jsx
import { useAuth } from '../contexts/AuthContext';

export default function Dashboard() {
  const { user, logout } = useAuth();

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Habit Tracker Dashboard</h1>
        <div className="user-info">
          <span>Welcome, {user?.username}!</span>
          <button onClick={logout} className="logout-button">
            Logout
          </button>
        </div>
      </header>

      <main className="dashboard-content">
        <div className="welcome-card">
          <h2>🎯 Ready to build some habits?</h2>
          <p>Your habit tracking journey starts here. This is where you'll manage your daily habits and track your progress.</p>
          
          <div className="user-details">
            <h3>Profile Information</h3>
            <p><strong>Username:</strong> {user?.username}</p>
            <p><strong>Email:</strong> {user?.email}</p>
            <p><strong>Joined:</strong> {new Date(user?.createdAt).toLocaleDateString()}</p>
          </div>

          <div className="coming-soon">
            <h3>🚀 Coming Soon</h3>
            <ul>
              <li>Create and manage habits</li>
              <li>Daily check-ins and streaks</li>
              <li>Friends and social features</li>
              <li>Progress analytics</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}
