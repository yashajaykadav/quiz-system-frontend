import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { LogOut, User } from 'lucide-react';
import quizLogo from '../../assets/logo.png';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const goHome = () => {
    navigate(user?.role === 'ADMIN' ? '/admin' : '/student');
  };

  return (
    <nav className="bg-white border-b-4 border-black sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-5">
        <div className="flex justify-between items-center h-20">

          {/* Brand Section */}
          <div
            onClick={goHome}
            className="flex items-center gap-4 cursor-pointer group"
          >
            {/* Fixed Logo Box: Added borders and shadow to match your UI theme */}
            <div className="w-12 h-12 bg-white border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center overflow-hidden group-hover:translate-x-[1px] group-hover:translate-y-[1px] group-hover:shadow-none transition-all">
              <img
                src={quizLogo}
                alt="QuizHub Logo"
                className="w-10 h-10 object-contain"
              />
            </div>

            {/* Added Title back for context, consistent with Login page */}
            <h1 className="hidden md:block text-xl font-black uppercase tracking-tighter">
              Quiz<span className="text-[#3b82f6]">Hub</span>
            </h1>
          </div>

          {/* Navigation / User Section */}
          <div className="flex items-center gap-4 sm:gap-6">

            {/* User Profile Badge */}
            <div className="flex items-center gap-3 px-3 py-1.5 border-2 border-black bg-[#f8fafc] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <div className="p-1 bg-[#3b82f6] border border-black hidden xs:block">
                <User size={14} className="text-white" strokeWidth={3} />
              </div>
              <div className="flex flex-col justify-center">
                <span className="text-[10px] font-black uppercase tracking-tight leading-none">
                  {user?.fullName || 'Guest User'}
                </span>
                <span className="text-[8px] font-bold text-[#3b82f6] uppercase tracking-[0.1em] mt-0.5">
                  {user?.role || 'STUDENT'} ACCESS
                </span>
              </div>
            </div>

            {/* Logout Button: High Contrast */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 border-2 border-black bg-white text-black hover:text-red-500 text-[10px] font-black uppercase tracking-widest shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] transition-all"
            >
              <LogOut size={14} strokeWidth={3} />
              <span className="hidden sm:inline">Terminate</span>
            </button>

          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;