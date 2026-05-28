import { useEffect, useState } from 'react'
import { apiGet, apiPost } from '../utils/api'

export default function Users() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    username: '',
    age: '',
    fitnessLevel: '',
  })
  const [submitting, setSubmitting] = useState(false)

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const data = await apiGet('users')
      setUsers(Array.isArray(data) ? data : data.data || [])
      setError(null)
    } catch (err) {
      console.error('Error fetching users:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const handleFormChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setSubmitting(true)
      await apiPost('users', {
        ...formData,
        age: formData.age ? parseInt(formData.age) : undefined,
      })
      setFormData({
        name: '',
        email: '',
        username: '',
        age: '',
        fitnessLevel: '',
      })
      setShowForm(false)
      await fetchUsers()
    } catch (err) {
      console.error('Error creating user:', err)
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div>
      <h1>Users</h1>

      {error && (
        <div className="alert alert-danger">
          <strong>Error:</strong> {error}
        </div>
      )}

      <button
        className="btn btn-primary mb-3"
        onClick={() => setShowForm(!showForm)}
      >
        {showForm ? 'Cancel' : '+ New User'}
      </button>

      {showForm && (
        <div className="card mb-3">
          <div className="card-body">
            <h5 className="card-title">Create New User</h5>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="name" className="form-label">
                  Full Name
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
                <label htmlFor="email" className="form-label">
                  Email
                </label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleFormChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="username" className="form-label">
                  Username
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleFormChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="age" className="form-label">
                  Age
                </label>
                <input
                  type="number"
                  className="form-control"
                  id="age"
                  name="age"
                  value={formData.age}
                  onChange={handleFormChange}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="fitnessLevel" className="form-label">
                  Fitness Level
                </label>
                <select
                  className="form-select"
                  id="fitnessLevel"
                  name="fitnessLevel"
                  value={formData.fitnessLevel}
                  onChange={handleFormChange}
                >
                  <option value="">Select a level</option>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                  <option value="elite">Elite</option>
                </select>
              </div>
              <button
                type="submit"
                className="btn btn-success"
                disabled={submitting}
              >
                {submitting ? 'Creating...' : 'Create User'}
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
      ) : users.length === 0 ? (
        <p className="text-muted">No users yet.</p>
      ) : (
        <table className="table table-striped table-hover">
          <thead className="table-dark">
            <tr>
              <th>Name</th>
              <th>Username</th>
              <th>Email</th>
              <th>Age</th>
              <th>Fitness Level</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>{user.name}</td>
                <td>{user.username}</td>
                <td>{user.email}</td>
                <td>{user.age || 'N/A'}</td>
                <td>{user.fitnessLevel || 'Not specified'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
