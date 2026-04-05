import { Link, useNavigate } from 'react-router-dom';
import { BookOpen } from 'lucide-react';

export default function Navbar({ user, setUser }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-sm border-b border-slate-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2 mr-8">
              <BookOpen className="h-6 w-6 text-blue-600" />
              <span className="font-bold text-lg text-slate-900 hidden sm:block">Scheme Portal</span>
            </Link>
            <div className="hidden md:flex gap-6">
              <Link to="/" className="text-sm font-semibold text-slate-600 hover:text-blue-600">Home</Link>
              <a href="/#contact" className="text-sm font-semibold text-slate-600 hover:text-blue-600">Contact Support</a>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <div className="text-sm font-medium text-slate-700">
                  Welcome, {user.name || user.username}
                </div>
                {user.role === 'admin' ? (
                  <Link to="/admin" className="text-sm font-semibold text-slate-600 hover:text-blue-600">Admin Panel</Link>
                ) : (
                  <>
                    <Link to="/dashboard" className="text-sm font-semibold text-slate-600 hover:text-blue-600">Dashboard</Link>
                    <Link to="/schemes" className="text-sm font-semibold text-slate-600 hover:text-blue-600">Schemes</Link>
                    <Link to="/saved-schemes" className="text-sm font-semibold text-slate-600 hover:text-blue-600">Saved</Link>
                  </>
                )}
                <button onClick={handleLogout} className="btn-secondary text-xs py-1.5">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-sm font-semibold text-slate-600 hover:text-blue-600">Login</Link>
                <Link to="/register" className="btn-primary">Get Started</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
