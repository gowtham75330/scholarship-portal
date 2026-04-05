import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserCircle } from 'lucide-react';

export default function ProfileForm({ user, setUser }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    role: user?.role || '',
    age: user?.age || '',
    gender: user?.gender || '',
    state: user?.state || '',
    district: user?.district || '',
    category: user?.category || '',
    income: user?.income || '',
    education_level: user?.education_level || '',
    institution_type: user?.institution_type || ''
  });
  const [message, setMessage] = useState('');

  const roles = ['Student', 'Employee', 'Unemployed', 'Women', 'Farmer', 'Senior Citizen', 'Disabled'];
  const categories = ['SC', 'ST', 'BC', 'MBC', 'OBC', 'General', 'EWS'];
  const educationLevels = ['School', 'College', 'Diploma', 'Undergraduate', 'Postgraduate'];
  const states = ['All India', 'Tamil Nadu', 'Kerala', 'Karnataka', 'Andhra Pradesh', 'Maharashtra', 'Delhi'];

  useEffect(() => {
    // Fetch latest profile on load
    const fetchProfile = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/users/profile', {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        const data = await res.json();
        if (data.user) {
          setFormData(prev => ({ ...prev, ...data.user }));
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      const res = await fetch('http://localhost:5000/api/users/profile', {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage('Profile updated successfully!');
        setUser({ ...user, ...data.user });
        localStorage.setItem('user', JSON.stringify({ ...user, ...data.user }));
        setTimeout(() => navigate('/dashboard'), 1000);
      } else {
        setMessage(data.message || 'Update failed');
      }
    } catch (err) {
      setMessage('Network error');
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <div className="card">
        <div className="px-6 py-8 border-b border-slate-100 bg-slate-50 flex items-center gap-4">
          <UserCircle className="w-12 h-12 text-blue-600" />
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Complete Your Profile</h2>
            <p className="text-slate-600 text-sm mt-1">
              Provide accurate details to find the best schemes you are eligible for.
            </p>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-8">
          {message && (
            <div className={`p-4 rounded-md text-sm ${message.includes('success') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
              {message}
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Primary Role */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-2">Primary Role / Identity <span className="text-red-500">*</span></label>
              <select name="role" required className="input-field" value={formData.role} onChange={handleChange}>
                <option value="">Select Role</option>
                {roles.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>

            {/* Personal Details */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Age</label>
              <input type="number" name="age" className="input-field" value={formData.age} onChange={handleChange} placeholder="e.g. 21" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Gender</label>
              <select name="gender" className="input-field" value={formData.gender} onChange={handleChange}>
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">State</label>
              <select name="state" className="input-field" value={formData.state} onChange={handleChange}>
                <option value="">Select State</option>
                {states.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">District</label>
              <input type="text" name="district" className="input-field" value={formData.district} onChange={handleChange} placeholder="e.g. Chennai" />
            </div>

            {/* Social & Economic Details */}
            <div className="md:col-span-2 pt-4 border-t border-slate-100">
              <h3 className="text-lg font-medium text-slate-900 mb-4">Social & Economic Details</h3>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Category / Caste</label>
              <select name="category" className="input-field" value={formData.category} onChange={handleChange}>
                <option value="">Select Category</option>
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Annual Family Income (₹)</label>
              <input type="number" name="income" className="input-field" value={formData.income} onChange={handleChange} placeholder="e.g. 250000" />
            </div>

            {/* Educational Background */}
            <div className="md:col-span-2 pt-4 border-t border-slate-100">
              <h3 className="text-lg font-medium text-slate-900 mb-4">Educational Background</h3>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Current Education Level</label>
              <select name="education_level" className="input-field" value={formData.education_level} onChange={handleChange}>
                <option value="">Select Level</option>
                {educationLevels.map(e => <option key={e} value={e}>{e}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Institution Type</label>
              <select name="institution_type" className="input-field" value={formData.institution_type} onChange={handleChange}>
                <option value="">Select Type</option>
                <option value="Government">Government</option>
                <option value="Private">Private</option>
              </select>
            </div>
          </div>
          
          <div className="pt-6 flex justify-end">
            <button type="submit" className="btn-primary px-8">
              Save Profile & Check Eligibility
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
