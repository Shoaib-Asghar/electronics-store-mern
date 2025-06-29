import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const AdminServicesPage = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState({ type: '', message: '' });
  const [deletingId, setDeletingId] = useState(null);

  const fetchServices = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/services`);
      setServices(res.data);
    } catch (err) {
      console.error('Failed to fetch services:', err);
      setStatus({ type: 'error', message: 'Failed to load services.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleDelete = async (id) => {
    const confirm = window.confirm('Are you sure you want to delete this service?');
    if (!confirm) return;

    setDeletingId(id);
    try {
      await axios.delete(`${API_BASE_URL}/services/${id}`);
      setStatus({ type: 'success', message: 'Service deleted successfully.' });
      fetchServices();
    } catch (err) {
      console.error('Delete failed:', err);
      setStatus({ type: 'error', message: 'Failed to delete service.' });
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
        🛠️ Service Providers Management
      </h1>

      <div className="flex justify-end mb-4">
        <Link
          to="/services/admin/add"
          className="bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded shadow"
        >
          ➕ Add New Service
        </Link>
      </div>

      {status.message && (
        <div
          className={`mb-4 p-3 rounded text-sm ${
            status.type === 'success'
              ? 'bg-green-100 text-green-700'
              : 'bg-red-100 text-red-700'
          }`}
        >
          {status.message}
        </div>
      )}

      {loading ? (
        <p className="text-gray-600 text-center">Loading services...</p>
      ) : services.length === 0 ? (
        <p className="text-gray-600 text-center">No services found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <div
              key={service._id}
              className="bg-white shadow rounded-lg p-5 border flex flex-col justify-between"
            >
              <div>
                <h2 className="text-xl font-bold text-blue-700">{service.name}</h2>
                <p className="text-sm text-gray-600 mt-1">
                  {service.expertise}
                </p>
                <p className="mt-2 text-gray-700 text-sm">{service.description}</p>
                <p className="mt-2 text-sm text-gray-500">
                  Contact: {service.contactEmail}
                </p>
              </div>

              <div className="mt-4 flex justify-between space-x-2">
                <Link
                  to={`/services/admin/edit/${service._id}`}
                  className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(service._id)}
                  className={`bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 ${
                    deletingId === service._id ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                  disabled={deletingId === service._id}
                >
                  {deletingId === service._id ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminServicesPage;