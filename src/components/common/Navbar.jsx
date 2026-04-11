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
    <nav className="bg-white border-b-4 border-black sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-5">
        <div className="flex justify-between items-center h-20">

          {/* Logo Section */}
          <div
            onClick={() =>
              navigate(user?.role === 'ADMIN' ? '/admin' : '/student')
            }
            className="flex items-center gap-3 cursor-pointer group"
          >
            {/* Logo Box: Sharp, Black, with Hard Shadow */}
            <div className="w-10 h-10 bg-black text-white flex items-center justify-center text-xl font-black border-2 border-black shadow-[3px_3px_0px_0px_rgba(59,130,246,1)] group-hover:shadow-none group-hover:translate-x-[2px] group-hover:translate-y-[2px] transition-all">
              Q
            </div>
            <span className="text-xl font-black uppercase italic tracking-tighter">
              Skill<span className="text-[#3b82f6]">Master</span>
            </span>
          </div>

          {/* Navigation / User Section */}
          <div className="flex items-center gap-6">

            {/* User Profile Badge */}
            <div className="hidden sm:flex items-center gap-3 px-4 py-2 border-2 border-black bg-[#f8fafc] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <div className="p-1 bg-[#3b82f6] border border-black">
                <User size={14} className="text-white" strokeWidth={3} />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-black uppercase tracking-tight leading-none">
                  {user?.fullName}
                </span>
                <span className="text-[9px] font-bold text-[#3b82f6] uppercase tracking-[0.1em] mt-1">
                  {user?.role} ACCESS
                </span>
              </div>
            </div>

            {/* Logout Button: High Contrast Red */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 border-2 border-black bg-white text-red-500 text-xs font-black uppercase tracking-widest shadow-[4px_4px_0px_0px_rgba(239,68,68,1)] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] active:bg-red-500 active:text-white transition-all"
            >
              <LogOut size={16} strokeWidth={3} />
              <span className="hidden xs:inline">Exit</span>
            </button>

          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;