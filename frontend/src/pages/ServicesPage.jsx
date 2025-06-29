import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const IMAGE_BASE_URL = import.meta.env.VITE_IMAGES_BASE_URL;

const ServicesPage = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/services`);
        setServices(res.data);
      } catch (err) {
        console.error('Failed to fetch services:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-extrabold text-center text-blue-700 mb-10">
        🔧 Service Providers
      </h1>

      {loading ? (
        <p className="text-center text-gray-600">Loading services...</p>
      ) : services.length === 0 ? (
        <p className="text-center text-gray-600">No services available.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {services.map((s) => (
            <div
              key={s._id}
              className="bg-white shadow-md rounded-lg overflow-hidden flex flex-col"
            >
              {s.imageUrl && (
                <img
                  src={`${IMAGE_BASE_URL}${s.imageUrl}`}
                  alt={s.name}
                  className="h-40 w-full object-cover"
                />
              )}

              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-800">{s.name}</h2>
                  <p className="text-sm text-blue-600">{s.expertise}</p>
                  <p className="text-sm text-gray-600 mt-1">{s.location}</p>
                  <p className="text-gray-700 text-sm mt-2">{s.description}</p>
                  <p className="text-sm mt-2">
                    <span className="font-semibold text-gray-700">Contact:</span>{' '}
                    <a href={`mailto:${s.contactEmail}`} className="text-blue-500 hover:underline">
                      {s.contactEmail}
                    </a>
                    <br />
                    <span className="text-gray-700">Phone:</span> {s.phone}
                  </p>
                </div>

                <div className="mt-4">
                  {s.available ? (
                    user ? (
                      <button
                        className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded text-sm font-medium transition"
                      >
                        Hire Now
                      </button>
                    ) : (
                      <Link
                        to="/login"
                        className="w-full block text-center bg-blue-500 hover:bg-blue-600 text-white py-2 rounded text-sm font-medium"
                      >
                        Login to Hire
                      </Link>
                    )
                  ) : (
                    <p className="text-red-600 text-sm font-semibold text-center">
                      Currently Unavailable
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ServicesPage;