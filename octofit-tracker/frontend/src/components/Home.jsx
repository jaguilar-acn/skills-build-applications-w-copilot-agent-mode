import { useEffect, useState } from 'react'
import { apiGet } from '../utils/api'

export default function Home() {
  const [stats, setStats] = useState({
    users: 0,
    teams: 0,
    activities: 0,
    workouts: 0,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true)
        const [usersRes, teamsRes, activitiesRes, workoutsRes] = await Promise.all([
          apiGet('users'),
          apiGet('teams'),
          apiGet('activities'),
          apiGet('workouts'),
        ])

        setStats({
          users: Array.isArray(usersRes) ? usersRes.length : usersRes.total || 0,
          teams: Array.isArray(teamsRes) ? teamsRes.length : teamsRes.total || 0,
          activities: Array.isArray(activitiesRes) ? activitiesRes.length : activitiesRes.total || 0,
          workouts: Array.isArray(workoutsRes) ? workoutsRes.length : workoutsRes.total || 0,
        })
        setError(null)
      } catch (err) {
        console.error('Error fetching stats:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  return (
    <div>
      <h1>🐙 Octofit Tracker</h1>
      <p className="lead">Track activities, manage teams, and compete on the leaderboard!</p>

      {error && (
        <div className="alert alert-danger">
          <strong>Error:</strong> {error}
        </div>
      )}

      {loading ? (
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <div className="row mt-5">
          <div className="col-md-6 col-lg-3 mb-4">
            <div className="card bg-primary text-white">
              <div className="card-body">
                <h5 className="card-title">Total Users</h5>
                <p className="card-text display-4">{stats.users}</p>
              </div>
            </div>
          </div>

          <div className="col-md-6 col-lg-3 mb-4">
            <div className="card bg-success text-white">
              <div className="card-body">
                <h5 className="card-title">Total Teams</h5>
                <p className="card-text display-4">{stats.teams}</p>
              </div>
            </div>
          </div>

          <div className="col-md-6 col-lg-3 mb-4">
            <div className="card bg-info text-white">
              <div className="card-body">
                <h5 className="card-title">Total Activities</h5>
                <p className="card-text display-4">{stats.activities}</p>
              </div>
            </div>
          </div>

          <div className="col-md-6 col-lg-3 mb-4">
            <div className="card bg-warning text-white">
              <div className="card-body">
                <h5 className="card-title">Total Workouts</h5>
                <p className="card-text display-4">{stats.workouts}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="mt-5">
        <h2>Features</h2>
        <ul className="list-group">
          <li className="list-group-item">👥 Manage users and profiles</li>
          <li className="list-group-item">🏃 Log activities and workouts</li>
          <li className="list-group-item">🤝 Create and manage teams</li>
          <li className="list-group-item">🏆 Compete on the leaderboard</li>
          <li className="list-group-item">📊 Get personalized workout suggestions</li>
        </ul>
      </div>
    </div>
  )
}
