import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ChevronRight } from 'lucide-react';

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
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-6 relative overflow-hidden font-sans">
      {/* Decorative Blur Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[120px] animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/20 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-2xl shadow-xl shadow-blue-500/20 mb-6 text-white text-3xl font-black italic tracking-tighter">
            Q
          </div>
          <h1 className="text-4xl font-black text-white tracking-tight mb-2">
            Skill<span className="text-blue-500">Master</span>
          </h1>
          <p className="text-slate-400 font-medium">Internal Quiz Assessment Portal</p>
        </div>

        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2.5rem] shadow-2xl p-10 md:p-12">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-2">
              <label className="block text-xs font-black text-slate-400 uppercase tracking-[0.2em] ml-1">
                University ID / Username
              </label>
              <div className="relative group">
                <input
                  type="text"
                  value={credentials.username}
                  onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                  placeholder="Enter your username"
                  className="w-full bg-slate-900/50 border border-slate-800 text-white px-6 py-4 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none group-hover:border-slate-700"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-black text-slate-400 uppercase tracking-[0.2em] ml-1">
                Access Password
              </label>
              <div className="relative group">
                <input
                  type="password"
                  value={credentials.password}
                  onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                  placeholder="••••••••"
                  className="w-full bg-slate-900/50 border border-slate-800 text-white px-6 py-4 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none group-hover:border-slate-700"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-4 rounded-2xl text-sm font-bold flex items-center gap-3 animate-in fade-in zoom-in duration-300">
                <div className="w-5 h-5 bg-red-500/20 rounded-full flex items-center justify-center text-xs">!</div>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white py-5 rounded-2xl font-black uppercase tracking-widest text-sm transition-all shadow-xl shadow-blue-600/25 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                   <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                   Authenticating...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                   Secure Login
                   <ChevronRight size={18} className="translate-x-0 group-hover:translate-x-1 transition-transform" />
                </span>
              )}
            </button>
          </form>

          <div className="mt-10 pt-8 border-t border-white/5 text-center">
             <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">
               Forgot Password? <button className="text-blue-500 hover:text-blue-400 transition-colors">Contact Admin</button>
             </p>
          </div>
        </div>
        
        <p className="text-center mt-10 text-slate-600 text-[10px] font-bold uppercase tracking-[0.3em]">
          &copy; 2024 NEXANOVA INTERNSHIP SYSTEM
        </p>
      </div>
    </div>
  );
};

export default Login;