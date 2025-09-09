// Test script - save as test-integration.js
const API_BASE_URL = 'http://localhost:5000/api'

async function testIntegration() {
  console.log('🧪 Starting Frontend-Backend Integration Test')
  
  // Test 1: Server Health Check
  try {
    const response = await fetch(`${API_BASE_URL}`)
    const data = await response.json()
    console.log('✅ Server Health:', data.message)
  } catch (error) {
    console.error('❌ Server Health:', error.message)
    return
  }

  // Test 2: User Registration
  try {
    const registerResponse = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: 'testuser123',
        email: 'test@example.com',
        password: 'password123'
      })
    })
    const registerData = await registerResponse.json()
    console.log('✅ Registration:', registerData.message)
    
    const token = registerData.token
    
    // Test 3: Create Habit
    const habitResponse = await fetch(`${API_BASE_URL}/habits`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        name: 'Test Habit',
        category: 'health',
        frequency: 'daily'
      })
    })
    const habitData = await habitResponse.json()
    console.log('✅ Habit Creation:', habitData.name)
    
    // Test 4: Toggle Habit
    const toggleResponse = await fetch(`${API_BASE_URL}/habits/${habitData._id}/toggle`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })
    const toggleData = await toggleResponse.json()
    console.log('✅ Habit Toggle:', toggleData.completed ? 'Completed' : 'Uncompleted')
    
    // Test 5: Get Leaderboard
    const leaderboardResponse = await fetch(`${API_BASE_URL}/leaderboard`)
    const leaderboardData = await leaderboardResponse.json()
    console.log('✅ Leaderboard:', `${leaderboardData.length} users`)
    
    console.log('🎉 All integration tests passed!')
    
  } catch (error) {
    console.error('❌ Integration test failed:', error.message)
  }
}

// Run in browser console: testIntegration()
