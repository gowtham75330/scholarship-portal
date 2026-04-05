import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { User, Wallet, MapPin, Briefcase, ChevronRight, CheckCircle } from 'lucide-react';

export default function Dashboard({ user }) {
  const [stats, setStats] = useState({ totalAvailable: 0, eligibleCount: 0 });

  useEffect(() => {
    // Fetch scheme counts to display
    const fetchEligibleSchemes = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/schemes/eligible', {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        const data = await res.json();
        if (res.ok) {
          setStats({
            totalAvailable: data.totalAvailable || 0,
            eligibleCount: data.schemes ? data.schemes.length : 0
          });
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchEligibleSchemes();
  }, []);

  const isProfileComplete = !!(user.role && user.state && user.category);

  return (
    <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8 w-full">
      <h1 className="text-3xl font-bold text-slate-900 mb-8">Hello, {user.name} 👋</h1>
      
      {!isProfileComplete && (
        <div className="bg-orange-50 border-l-4 border-orange-500 p-4 mb-8 rounded-r-md">
          <div className="flex">
            <div className="flex-1">
              <p className="text-sm text-orange-700">
                <strong className="font-bold">Important:</strong> Your profile is incomplete. We cannot match you with relevant schemes until you complete it.
              </p>
            </div>
            <Link to="/profile" className="text-sm font-medium text-orange-700 underline decoration-orange-300 hover:decoration-orange-500">
              Complete Profile
            </Link>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        
        {/* Profile Summary Card */}
        <div className="card p-6 md:col-span-1 bg-gradient-to-br from-blue-600 to-indigo-700 text-white border-0">
          <h2 className="text-lg font-semibold mb-4 text-blue-100 border-b border-blue-500/50 pb-2">Profile Summary</h2>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <User className="w-5 h-5 text-blue-200" />
              <div>
                <p className="text-xs text-blue-200">Name</p>
                <p className="font-medium">{user.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Briefcase className="w-5 h-5 text-blue-200" />
              <div>
                <p className="text-xs text-blue-200">Role</p>
                <p className="font-medium capitalize">{user.role || 'Not Set'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-blue-200" />
              <div>
                <p className="text-xs text-blue-200">State</p>
                <p className="font-medium">{user.state || 'Not Set'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Wallet className="w-5 h-5 text-blue-200" />
              <div>
                <p className="text-xs text-blue-200">Family Income</p>
                <p className="font-medium">{user.income ? `₹${user.income.toLocaleString()}` : 'Not Set'}</p>
              </div>
            </div>
          </div>
          <div className="mt-6 pt-4 border-t border-blue-500/50">
            <Link to="/profile" className="text-sm font-medium text-blue-100 hover:text-white flex items-center transition-colors">
              Edit Profile <ChevronRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
        </div>

        {/* Stats & Actions */}
        <div className="md:col-span-2 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="card p-6 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Total Schemes in DB</p>
                <p className="text-3xl font-bold text-slate-900 mt-1">{stats.totalAvailable}</p>
              </div>
              <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-slate-400" />
              </div>
            </div>
            
            <div className="card p-6 flex items-center justify-between bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-100">
              <div>
                <p className="text-sm font-medium text-emerald-800">Your Eligible Schemes</p>
                <p className="text-4xl font-extrabold text-emerald-600 mt-1">{stats.eligibleCount}</p>
              </div>
              <div className="w-12 h-12 bg-emerald-200 rounded-full flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-emerald-700" />
              </div>
            </div>
          </div>

          <div className="card p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-2">Ready to Apply?</h3>
            <p className="text-slate-600 mb-6">Explore the full list of scholarships and welfare schemes you are currently eligible for based on your profile details.</p>
            <Link to="/schemes" className="btn-primary text-base px-6 py-3">
              View My Schemes
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
