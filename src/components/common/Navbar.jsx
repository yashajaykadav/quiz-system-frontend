import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { LogOut, User } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-center h-20">
          <div 
            onClick={() => navigate(user?.role === 'ADMIN' ? '/admin' : '/student')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center text-white font-black italic shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform">
              Q
            </div>
            <span className="text-xl font-black text-slate-900 tracking-tighter">
              Skill<span className="text-blue-600 font-extrabold">Master</span>
            </span>
          </div>

          <div className="flex items-center gap-8">
            <div className="hidden md:flex items-center gap-3 px-4 py-2 bg-slate-50 rounded-2xl border border-slate-100">
               <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                 <User size={18} />
               </div>
               <div className="flex flex-col">
                 <span className="text-xs font-black text-slate-900 leading-none mb-0.5">{user?.fullName}</span>
                 <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none">
                    {user?.role} Portal
                 </span>
               </div>
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-slate-400 hover:text-red-500 font-bold text-xs uppercase tracking-widest transition-colors px-2 py-1"
            >
              <LogOut size={16} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;