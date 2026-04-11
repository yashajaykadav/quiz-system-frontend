import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(credentials);

    if (result.success) {
      if (result.role === 'ADMIN') {
        navigate('/admin');
      } else {
        navigate('/student');
      }
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#eef2ff] p-6 font-sans">
      {/* Main Card: Blue-tinted white with sharp black borders */}
      <div className="w-full max-w-sm bg-white border-2 border-black p-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">

        <div className="mb-10 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-[#3b82f6] border-2 border-black text-white font-bold text-xl shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] mb-4">
            Q
          </div>
          <h1 className="text-2xl font-black uppercase tracking-tight text-gray-900">
            Quiz<span className="text-[#3b82f6]">Hub</span>
          </h1>
          <div className="h-1 w-12 bg-black mx-auto mt-2"></div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest mb-1 text-gray-600">
              Admin Username
            </label>
            <input
              type="text"
              value={credentials.username}
              onChange={(e) =>
                setCredentials({ ...credentials, username: e.target.value })
              }
              className="w-full border-2 border-black px-4 py-2.5 text-sm font-bold bg-[#f8fafc] focus:outline-none focus:bg-[#dbeafe] transition-colors rounded-none placeholder:text-gray-400"
              placeholder="e.g. admin_01"
              required
            />
          </div>

          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest mb-1 text-gray-600">
              Access Password
            </label>
            <input
              type="password"
              value={credentials.password}
              onChange={(e) =>
                setCredentials({ ...credentials, password: e.target.value })
              }
              className="w-full border-2 border-black px-4 py-2.5 text-sm font-bold bg-[#f8fafc] focus:outline-none focus:bg-[#dbeafe] transition-colors rounded-none placeholder:text-gray-400"
              placeholder="••••••••"
              required
            />
          </div>

          {error && (
            <div className="bg-[#fee2e2] border-2 border-black p-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <p className="text-[10px] font-bold text-red-600 uppercase tracking-tight">
                System Error: {error}
              </p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#3b82f6] text-white py-3 border-2 border-black text-xs font-black uppercase tracking-[0.2em] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] active:bg-black transition-all disabled:opacity-50"
          >
            {loading ? 'Processing...' : 'Authorize Login'}
          </button>
        </form>

        <p className="text-[11px] text-center mt-8 font-bold text-gray-500 uppercase">
          Forgotten Credentials?{' '}
          <span
            onClick={() => navigate('/contact')}
            className="text-[#3b82f6] cursor-pointer hover:underline underline-offset-4 decoration-2"
          >
            Request Access
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;