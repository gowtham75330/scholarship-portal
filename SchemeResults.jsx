import { useState, useEffect } from 'react';
import { ExternalLink, Filter, Building2, Banknote, GraduationCap, MapPin, CheckCircle, Bookmark } from 'lucide-react';
import toast from 'react-hot-toast';

const getValidUrl = (url) => {
  if (!url) return '#';
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  return `https://${url}`;
};

export default function SchemeResults({ user }) {
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEligibleSchemes = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/schemes/eligible', {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        const data = await res.json();
        if (res.ok) {
          setSchemes(data.schemes || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchEligibleSchemes();
  }, []);

  const handleSaveScheme = async (schemeId) => {
    try {
      const res = await fetch('http://localhost:5000/api/schemes/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ scheme_id: schemeId })
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error('Failed to save scheme');
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8 w-full">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-4 border-b border-slate-200 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Eligible Schemes</h1>
          <p className="text-slate-600">Based on your profile, you are eligible for the following {schemes.length} schemes.</p>
        </div>
        <div className="flex items-center text-sm text-slate-500 gap-2 bg-white px-4 py-2 rounded-lg border border-slate-200">
          <Filter className="w-4 h-4" /> Automatically filtered using your profile
        </div>
      </div>

      {schemes.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl border border-slate-200 shadow-sm">
          <div className="mx-auto w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mb-6">
            <Filter className="w-10 h-10 text-slate-400" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">No Schemes Found</h2>
          <p className="text-slate-500 max-w-md mx-auto">
            We couldn't find any schemes matching your exact profile right now. 
            Make sure your profile details (like Income, Category, and State) are accurate.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {schemes.map(scheme => (
            <div key={scheme.id} className="card flex flex-col h-full bg-white transition-all hover:-translate-y-1 hover:shadow-lg hover:border-blue-200">
              <div className="p-6 flex-1">
                <div className="flex justify-between items-start mb-4">
                  <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10 mb-2">
                    {scheme.provider}
                  </span>
                  {scheme.state !== 'All India' && (
                    <span className="inline-flex items-center rounded-md bg-purple-50 px-2 py-1 text-xs font-medium text-purple-700 ring-1 ring-inset ring-purple-700/10">
                      {scheme.state} Only
                    </span>
                  )}
                  <button onClick={() => handleSaveScheme(scheme.id)} className="ml-auto p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors" title="Save this scheme">
                    <Bookmark className="w-5 h-5" />
                  </button>
                </div>
                
                <h3 className="text-xl font-bold text-slate-900 mb-3">{scheme.scheme_name}</h3>
                <p className="text-slate-600 text-sm mb-6 line-clamp-3 min-h-[60px]">{scheme.description}</p>
                
                <div className="grid grid-cols-2 gap-x-4 gap-y-3 mb-6 bg-slate-50 p-4 rounded-lg">
                  <div className="flex items-start gap-2 text-sm text-slate-700">
                    <Banknote className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                    <div>
                      <span className="block text-xs text-slate-500">Income Limit</span>
                      {scheme.income_limit === 9999999 ? 'No Limit' : `Up to ₹${scheme.income_limit.toLocaleString()}`}
                    </div>
                  </div>
                  <div className="flex items-start gap-2 text-sm text-slate-700">
                    <GraduationCap className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                    <div>
                      <span className="block text-xs text-slate-500">Education Required</span>
                      {scheme.education_required || 'All'}
                    </div>
                  </div>
                  <div className="flex items-start gap-2 text-sm text-slate-700">
                    <Building2 className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                    <div>
                      <span className="block text-xs text-slate-500">Target Role</span>
                      {scheme.target_role || 'All'}
                    </div>
                  </div>
                  <div className="flex items-start gap-2 text-sm text-slate-700">
                    <MapPin className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                    <div>
                      <span className="block text-xs text-slate-500">Category Required</span>
                      {scheme.category_required === 'All' ? 'All Categories' : scheme.category_required}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-between items-center">
                <span className="text-sm font-medium text-green-600 flex items-center gap-1">
                  <CheckCircle className="w-4 h-4" /> You are eligible
                </span>
                <a 
                  href={getValidUrl(scheme.official_link)} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="btn-primary bg-indigo-600 hover:bg-indigo-700"
                >
                  Apply Now <ExternalLink className="w-4 h-4 ml-2" />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
