import { useEffect, useState } from 'react'

const leaderboardEndpoint = import.meta.env.VITE_CODESPACE_NAME?.trim()
  ? `https://${import.meta.env.VITE_CODESPACE_NAME}-8000.app.github.dev/api/leaderboard`
  : 'http://localhost:8000/api/leaderboard'

export default function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchLeaderboard = async () => {
    try {
      setLoading(true)
      const response = await fetch(leaderboardEndpoint)
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || `API responded with ${response.status}`)
      }
      const data = await response.json()
      setLeaderboard(Array.isArray(data) ? data : data.data || [])
      setError(null)
    } catch (err) {
      console.error('Error fetching leaderboard:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLeaderboard()
  }, [])

  return (
    <div>
      <h1>Leaderboard</h1>
      <p className="lead">Top performers</p>

      {error && (
        <div className="alert alert-danger">
          <strong>Error:</strong> {error}
          <button
            className="btn btn-sm btn-outline-danger ms-2"
            onClick={fetchLeaderboard}
          >
            Retry
          </button>
        </div>
      )}

      <button className="btn btn-secondary mb-3" onClick={fetchLeaderboard}>
        🔄 Refresh
      </button>

      {loading ? (
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : leaderboard.length === 0 ? (
        <p className="text-muted">No leaderboard data yet.</p>
      ) : (
        <table className="table table-striped table-hover">
          <thead className="table-dark">
            <tr>
              <th>Rank</th>
              <th>Name</th>
              <th>Points</th>
              <th>Email</th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.map((entry, index) => (
              <tr key={entry._id || index}>
                <td>
                  <strong>
                    {index === 0
                      ? '🥇'
                      : index === 1
                        ? '🥈'
                        : index === 2
                          ? '🥉'
                          : index + 1}
                  </strong>
                </td>
                <td>{entry.name || entry.username || 'Unknown'}</td>
                <td className="fw-bold">{entry.points || 0}</td>
                <td>{entry.email || 'N/A'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
