import { useState, useEffect } from 'react';
import { ExternalLink, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function SavedSchemes() {
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSavedSchemes = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/schemes/saved', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await res.json();
      if (res.ok) {
        setSchemes(data.schemes);
      }
    } catch (error) {
      console.error('Error fetching saved schemes:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSavedSchemes();
  }, []);

  const handleUnsave = async (schemeId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/schemes/saved/${schemeId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (res.ok) {
        setSchemes(schemes.filter(s => s.id !== schemeId));
      }
    } catch (error) {
      console.error('Error removing saved scheme:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex justify-center items-center">
        <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8 w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Saved Schemes</h1>
        <p className="text-slate-600">Your bookmarked government schemes and scholarships.</p>
      </div>

      {schemes.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-slate-100">
          <h3 className="text-xl font-medium text-slate-900 mb-2">No saved schemes yet</h3>
          <p className="text-slate-500">Go to the schemes page and bookmark the ones you are interested in.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {schemes.map((scheme, index) => (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              key={scheme.saved_id} 
              className="card p-6 flex flex-col hover:border-blue-500 transition-colors"
            >
              <div className="flex-1">
                <div className="flex justify-between items-start mb-4">
                  <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full">
                    {scheme.provider}
                  </span>
                  <button 
                    onClick={() => handleUnsave(scheme.id)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                    title="Remove Bookmark"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2 line-clamp-2">
                  {scheme.scheme_name}
                </h3>
                <p className="text-slate-600 text-sm mb-4 line-clamp-3">
                  {scheme.description}
                </p>
                <div className="space-y-2 mb-6">
                  <div className="flex text-sm">
                    <span className="text-slate-500 w-24">Target:</span>
                    <span className="font-medium text-slate-900">{scheme.target_role}</span>
                  </div>
                  <div className="flex text-sm">
                    <span className="text-slate-500 w-24">Income Limit:</span>
                    <span className="font-medium inline-block text-slate-900">
                      {scheme.income_limit === 9999999 ? 'No Limit' : `₹${scheme.income_limit.toLocaleString()}`}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="pt-4 border-t border-slate-100 mt-auto">
                <a 
                  href={scheme.official_link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-slate-50 hover:bg-blue-50 text-blue-600 font-medium rounded-lg transition-colors border border-slate-200 hover:border-blue-200"
                >
                  Apply Now <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
