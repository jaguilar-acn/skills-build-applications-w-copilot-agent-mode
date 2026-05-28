import { useEffect, useState } from 'react'

const teamsEndpoint = import.meta.env.VITE_CODESPACE_NAME?.trim()
  ? `https://${import.meta.env.VITE_CODESPACE_NAME}-8000.app.github.dev/api/teams`
  : 'http://localhost:8000/api/teams'

export default function Teams() {
  const [teams, setTeams] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    creatorId: '',
  })
  const [submitting, setSubmitting] = useState(false)

  const fetchTeams = async () => {
    try {
      setLoading(true)
      const response = await fetch(teamsEndpoint)
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || `API responded with ${response.status}`)
      }
      const data = await response.json()
      setTeams(Array.isArray(data) ? data : data.data || [])
      setError(null)
    } catch (err) {
      console.error('Error fetching teams:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTeams()
  }, [])

  const handleFormChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setSubmitting(true)
      const response = await fetch(teamsEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || `API responded with ${response.status}`)
      }
      setFormData({
        name: '',
        description: '',
        creatorId: '',
      })
      setShowForm(false)
      await fetchTeams()
    } catch (err) {
      console.error('Error creating team:', err)
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div>
      <h1>Teams</h1>

      {error && (
        <div className="alert alert-danger">
          <strong>Error:</strong> {error}
        </div>
      )}

      <button
        className="btn btn-primary mb-3"
        onClick={() => setShowForm(!showForm)}
      >
        {showForm ? 'Cancel' : '+ New Team'}
      </button>

      {showForm && (
        <div className="card mb-3">
          <div className="card-body">
            <h5 className="card-title">Create New Team</h5>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="name" className="form-label">
                  Team Name
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleFormChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="description" className="form-label">
                  Description
                </label>
                <textarea
                  className="form-control"
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleFormChange}
                  rows="3"
                />
              </div>
              <div className="mb-3">
                <label htmlFor="creatorId" className="form-label">
                  Creator ID
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="creatorId"
                  name="creatorId"
                  value={formData.creatorId}
                  onChange={handleFormChange}
                  required
                />
              </div>
              <button
                type="submit"
                className="btn btn-success"
                disabled={submitting}
              >
                {submitting ? 'Creating...' : 'Create Team'}
              </button>
            </form>
          </div>
        </div>
      )}

      {loading ? (
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : teams.length === 0 ? (
        <p className="text-muted">No teams yet.</p>
      ) : (
        <div className="row">
          {teams.map((team) => (
            <div key={team._id} className="col-md-6 col-lg-4 mb-3">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">{team.name}</h5>
                  <p className="card-text">{team.description || 'No description'}</p>
                  <p className="card-text text-muted">
                    <small>Creator: {team.creator?.name || team.creatorId || 'Unknown'}</small>
                  </p>
                  <p className="card-text text-muted">
                    <small>Members: {team.members?.length || 0}</small>
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
