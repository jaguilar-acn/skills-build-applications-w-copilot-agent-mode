import { useEffect, useState } from 'react'
import { apiGet, apiPost } from '../utils/api'

export default function Activities() {
  const [activities, setActivities] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    userId: '',
    activityType: '',
    duration: '',
    caloriesBurned: '',
    date: new Date().toISOString().split('T')[0],
  })
  const [submitting, setSubmitting] = useState(false)

  const fetchActivities = async () => {
    try {
      setLoading(true)
      const data = await apiGet('activities')
      setActivities(Array.isArray(data) ? data : data.data || [])
      setError(null)
    } catch (err) {
      console.error('Error fetching activities:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchActivities()
  }, [])

  const handleFormChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setSubmitting(true)
      await apiPost('activities', {
        userId: formData.userId,
        activityType: formData.activityType,
        duration: parseInt(formData.duration),
        caloriesBurned: parseInt(formData.caloriesBurned),
        date: formData.date,
      })
      setFormData({
        userId: '',
        activityType: '',
        duration: '',
        caloriesBurned: '',
        date: new Date().toISOString().split('T')[0],
      })
      setShowForm(false)
      await fetchActivities()
    } catch (err) {
      console.error('Error creating activity:', err)
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div>
      <h1>Activities</h1>

      {error && (
        <div className="alert alert-danger">
          <strong>Error:</strong> {error}
        </div>
      )}

      <button
        className="btn btn-primary mb-3"
        onClick={() => setShowForm(!showForm)}
      >
        {showForm ? 'Cancel' : '+ New Activity'}
      </button>

      {showForm && (
        <div className="card mb-3">
          <div className="card-body">
            <h5 className="card-title">Add New Activity</h5>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="userId" className="form-label">
                  User ID
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="userId"
                  name="userId"
                  value={formData.userId}
                  onChange={handleFormChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="activityType" className="form-label">
                  Activity Type
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="activityType"
                  name="activityType"
                  value={formData.activityType}
                  onChange={handleFormChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="duration" className="form-label">
                  Duration (minutes)
                </label>
                <input
                  type="number"
                  className="form-control"
                  id="duration"
                  name="duration"
                  value={formData.duration}
                  onChange={handleFormChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="caloriesBurned" className="form-label">
                  Calories Burned
                </label>
                <input
                  type="number"
                  className="form-control"
                  id="caloriesBurned"
                  name="caloriesBurned"
                  value={formData.caloriesBurned}
                  onChange={handleFormChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="date" className="form-label">
                  Date
                </label>
                <input
                  type="date"
                  className="form-control"
                  id="date"
                  name="date"
                  value={formData.date}
                  onChange={handleFormChange}
                  required
                />
              </div>
              <button
                type="submit"
                className="btn btn-success"
                disabled={submitting}
              >
                {submitting ? 'Saving...' : 'Save Activity'}
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
      ) : activities.length === 0 ? (
        <p className="text-muted">No activities yet.</p>
      ) : (
        <table className="table table-striped table-hover">
          <thead className="table-dark">
            <tr>
              <th>Activity Type</th>
              <th>Duration (min)</th>
              <th>Calories Burned</th>
              <th>Date</th>
              <th>User ID</th>
            </tr>
          </thead>
          <tbody>
            {activities.map((activity) => (
              <tr key={activity._id}>
                <td>{activity.activityType}</td>
                <td>{activity.duration}</td>
                <td>{activity.caloriesBurned}</td>
                <td>{new Date(activity.date).toLocaleDateString()}</td>
                <td>{activity.userId}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
