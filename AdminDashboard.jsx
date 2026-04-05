import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Users, MessageSquare, Save, Building2, LayoutDashboard, MapPin, GraduationCap } from 'lucide-react';

export default function AdminDashboard({ user }) {
  const [schemes, setSchemes] = useState([]);
  const [users, setUsers] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('schemes'); // schemes, users, new_scheme, messages
  
  const [formData, setFormData] = useState({
    scheme_name: '', provider: 'Central Government', target_role: 'All', 
    category_required: 'All', gender_required: 'All', income_limit: 9999999, 
    education_required: 'All', state: 'All India', description: '', official_link: ''
  });
  const [editingId, setEditingId] = useState(null);

  const fetchSchemes = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/admin/schemes', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await res.json();
      setSchemes(data.schemes || []);
    } catch (err) { console.error(err); }
  };

  const fetchUsers = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/admin/users', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await res.json();
      setUsers(data.users || []);
    } catch (err) { console.error(err); }
  };

  const fetchContacts = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/admin/contacts', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await res.json();
      setContacts(data.contacts || []);
    } catch (err) { console.error(err); }
  };

  useEffect(() => {
    Promise.all([fetchSchemes(), fetchUsers(), fetchContacts()]).then(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    if(window.confirm('Delete this scheme?')) {
      await fetch(`http://localhost:5000/api/admin/schemes/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      fetchSchemes();
    }
  };

  const handleEditClick = (scheme) => {
    setFormData(scheme);
    setEditingId(scheme.id);
    setActiveTab('new_scheme');
  };

  const handleSaveScheme = async (e) => {
    e.preventDefault();
    const isEdit = !!editingId;
    const url = isEdit ? `http://localhost:5000/api/admin/schemes/${editingId}` : 'http://localhost:5000/api/admin/schemes';
    const method = isEdit ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(formData)
    });

    if (res.ok) {
      alert(isEdit ? 'Updated' : 'Created');
      setFormData({
        scheme_name: '', provider: 'Central Government', target_role: 'All', 
        category_required: 'All', gender_required: 'All', income_limit: 9999999, 
        education_required: 'All', state: 'All India', description: '', official_link: ''
      });
      setEditingId(null);
      fetchSchemes();
      setActiveTab('schemes');
    }
  };

  if (loading) return <div>Loading Admin Panel...</div>;

  return (
    <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8 w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Admin Dashboard</h1>
        <p className="text-slate-600">Manage schemes and view registered users.</p>
      </div>

      <div className="flex gap-4 mb-6 border-b border-slate-200 pb-2">
        <button 
          className={`px-4 py-2 font-medium text-sm rounded-t-lg ${activeTab === 'schemes' ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-700' : 'text-slate-600'}`}
          onClick={() => setActiveTab('schemes')}
        >
          Manage Schemes
        </button>
        <button 
          className={`px-4 py-2 font-medium text-sm rounded-t-lg ${activeTab === 'new_scheme' ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-700' : 'text-slate-600'}`}
          onClick={() => { setActiveTab('new_scheme'); setEditingId(null); }}
        >
          {editingId ? 'Edit Scheme' : 'Add New Scheme'}
        </button>
        <button 
          className={`px-4 py-2 font-medium text-sm rounded-t-lg ${activeTab === 'users' ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-700' : 'text-slate-600'}`}
          onClick={() => setActiveTab('users')}
        >
          View Users
        </button>
        <button 
          className={`px-4 py-2 font-medium text-sm rounded-t-lg ${activeTab === 'messages' ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-700' : 'text-slate-600'}`}
          onClick={() => setActiveTab('messages')}
        >
          Messages
        </button>
      </div>

      <div className="card bg-white p-6">
        {activeTab === 'schemes' && (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Scheme Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Provider</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">State</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {schemes.map(s => (
                  <tr key={s.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{s.scheme_name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{s.provider}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{s.state}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                      <button onClick={() => handleEditClick(s)} className="text-blue-600 hover:text-blue-900 mr-4"><Edit2 className="w-4 h-4" /></button>
                      <button onClick={() => handleDelete(s.id)} className="text-red-600 hover:text-red-900"><Trash2 className="w-4 h-4" /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">State</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {users.map(u => (
                  <tr key={u.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{u.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{u.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{u.role || 'N/A'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{u.state || 'N/A'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'new_scheme' && (
          <div className="bg-white border text-left border-slate-200 rounded-xl max-w-4xl mx-auto shadow-sm">
            <div className="px-6 py-5 border-b border-slate-100 bg-slate-50 rounded-t-xl flex justify-between items-center">
              <h3 className="text-lg font-bold text-slate-900">{editingId ? 'Edit Scheme Details' : 'Add New Scheme Details'}</h3>
              <div className="text-xs font-semibold px-2 py-1 bg-blue-100 text-blue-700 rounded-md">Step 1 of 1</div>
            </div>
            <form onSubmit={handleSaveScheme} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Scheme Name</label>
                  <input required className="input-field shadow-sm bg-white" placeholder="e.g. Pragati Scholarship" value={formData.scheme_name} onChange={e=>setFormData({...formData, scheme_name: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Provider <Building2 className="inline w-4 h-4 ml-1 text-slate-400"/></label>
                  <select required className="input-field shadow-sm bg-white" value={formData.provider} onChange={e=>setFormData({...formData, provider: e.target.value})}>
                    <option value="Central Government">Central Government</option>
                    <option value="Tamil Nadu Government">Tamil Nadu Government</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Target Role <Users className="inline w-4 h-4 ml-1 text-slate-400"/></label>
                  <select required className="input-field shadow-sm bg-white" value={formData.target_role} onChange={e=>setFormData({...formData, target_role: e.target.value})}>
                    <option value="All">All</option>
                    <option value="Student">Student</option>
                    <option value="Women">Women</option>
                    <option value="Disabled">Disabled</option>
                    <option value="Farmer">Farmer</option>
                    <option value="Unemployed">Unemployed</option>
                    <option value="Senior Citizen">Senior Citizen</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Category Required <LayoutDashboard className="inline w-4 h-4 ml-1 text-slate-400"/></label>
                  <select required className="input-field shadow-sm bg-white" value={formData.category_required} onChange={e=>setFormData({...formData, category_required: e.target.value})}>
                    <option value="All">All</option>
                    <option value="General">General</option>
                    <option value="OBC">OBC</option>
                    <option value="SC">SC</option>
                    <option value="ST">ST</option>
                    <option value="BC">BC</option>
                    <option value="MBC">MBC</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Gender Required</label>
                  <select required className="input-field shadow-sm bg-white" value={formData.gender_required} onChange={e=>setFormData({...formData, gender_required: e.target.value})}>
                    <option value="All">All</option>
                    <option value="Male">Male Only</option>
                    <option value="Female">Female Only</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Income Limit</label>
                  <select required className="input-field shadow-sm bg-white" value={formData.income_limit} onChange={e=>setFormData({...formData, income_limit: Number(e.target.value)})}>
                    <option value={9999999}>No Limit</option>
                    <option value={100000}>Up to ₹1,00,000</option>
                    <option value={200000}>Up to ₹2,00,000</option>
                    <option value={250000}>Up to ₹2,50,000</option>
                    <option value={500000}>Up to ₹5,00,000</option>
                    <option value={800000}>Up to ₹8,00,000</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Education Required <GraduationCap className="inline w-4 h-4 ml-1 text-slate-400"/></label>
                  <select required className="input-field shadow-sm bg-white" value={formData.education_required} onChange={e=>setFormData({...formData, education_required: e.target.value})}>
                    <option value="All">All / None</option>
                    <option value="School">School Level</option>
                    <option value="Undergraduate">Undergraduate</option>
                    <option value="Postgraduate">Postgraduate</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">State Eligibility <MapPin className="inline w-4 h-4 ml-1 text-slate-400"/></label>
                  <select required className="input-field shadow-sm bg-white" value={formData.state} onChange={e=>setFormData({...formData, state: e.target.value})}>
                    <option value="All India">All India</option>
                    <option value="Tamil Nadu">Tamil Nadu</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Official Link</label>
                  <input required type="url" className="input-field shadow-sm bg-white" placeholder="https://..." value={formData.official_link} onChange={e=>setFormData({...formData, official_link: e.target.value})} />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Full Description</label>
                  <textarea required className="input-field shadow-sm bg-white" rows="4" placeholder="Describe the benefits and eligibility criteria..." value={formData.description} onChange={e=>setFormData({...formData, description: e.target.value})}></textarea>
                </div>
              </div>
              <div className="mt-8 pt-6 border-t border-slate-100 flex justify-end gap-4">
                <button type="button" onClick={() => setActiveTab('schemes')} className="px-6 py-2 rounded-lg text-slate-600 font-medium hover:bg-slate-50 transition-colors">Cancel</button>
                <button type="submit" className="btn-primary flex items-center bg-blue-600 hover:bg-blue-700"><Save className="w-4 h-4 mr-2"/> {editingId ? 'Update Scheme' : 'Save Scheme'}</button>
              </div>
            </form>
          </div>
        )}

        {activeTab === 'messages' && (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">From</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Message</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {contacts.length > 0 ? contacts.map(c => (
                  <tr key={c.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{new Date(c.created_at).toLocaleDateString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{c.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{c.email}</td>
                    <td className="px-6 py-4 text-sm text-slate-500 max-w-xs truncate">{c.message}</td>
                  </tr>
                )) : (
                  <tr><td colSpan="4" className="px-6 py-8 text-center text-slate-500">No messages found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
