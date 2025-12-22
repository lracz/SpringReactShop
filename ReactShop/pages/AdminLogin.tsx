import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { ApiService } from '../services/api';
import { useNavigate } from 'react-router-dom';

export const AdminLogin: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
        const user = await ApiService.login(username, password);
        
        if (user && user.role === 'admin') {
            login(user);
            navigate('/admin/dashboard');
        } else {
            setError('Invalid admin credentials');
        }
    } catch (err) {
        setError('Login failed');
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-gray-800 p-10 rounded-2xl shadow-2xl border border-gray-700">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-white">Admin Portal</h2>
          <p className="mt-2 text-center text-sm text-gray-400">
            Restricted Access
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <input
                type="text"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-600 placeholder-gray-400 text-white bg-gray-700 rounded-t-md focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                placeholder="Username (admin)"
                value={username}
                onChange={e => setUsername(e.target.value)}
              />
            </div>
            <div>
              <input
                type="password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-600 placeholder-gray-400 text-white bg-gray-700 rounded-b-md focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                placeholder="Password (admin)"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </div>
          </div>

          {error && <div className="text-red-400 text-sm text-center">{error}</div>}

          <div>
            <button
              type="submit"
              disabled={loading}
              className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {loading ? 'Authenticating...' : 'Access Dashboard'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};