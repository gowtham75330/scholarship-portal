import { Link } from 'react-router-dom';
import { Search, GraduationCap, Briefcase, Users, LayoutDashboard, ArrowRight, Send } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';
import toast from 'react-hot-toast';

export default function HomePage() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        toast.success('Message sent successfully!');
        setFormData({ name: '', email: '', message: '' });
      } else {
        toast.error('Failed to send message.');
      }
    } catch (err) {
      toast.error('Connection error.');
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="flex flex-col flex-1">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-violet-600 via-fuchsia-600 to-orange-500 text-white py-24 sm:py-32">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20 mix-blend-overlay"></div>
        {/* Animated Orbs */}
        <motion.div animate={{ y: [0, -20, 0] }} transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }} className="absolute -top-10 -left-10 w-64 h-64 bg-white/20 rounded-full blur-3xl"></motion.div>
        <motion.div animate={{ y: [0, 30, 0] }} transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }} className="absolute bottom-10 right-10 w-80 h-80 bg-orange-300/30 rounded-full blur-3xl"></motion.div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white z-10">
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight mb-6 drop-shadow-md">
            Discover Government <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-yellow-400">Schemes & Scholarships</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="mt-4 text-xl sm:text-2xl text-white/90 font-medium max-w-3xl mx-auto mb-10 drop-shadow-sm">
            One portal to find and apply for Central and Tamil Nadu Government welfare schemes tailored to your eligibility.
          </motion.p>
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, delay: 0.4 }} className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register" className="group inline-flex items-center justify-center rounded-full bg-white px-8 py-4 text-lg font-bold text-violet-700 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all">
              Find Your Schemes <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900">Who is this for?</h2>
            <p className="mt-4 text-lg text-slate-600">Find personalized schemes matching your specific profile.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="card p-6 flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4 text-blue-600">
                <GraduationCap className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-2">Students</h3>
              <p className="text-slate-600 text-sm">Post-matric, Central Sector, Pragati, and First Graduate scholarships.</p>
            </div>
            
            <div className="card p-6 flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4 text-purple-600">
                <Users className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-2">Women</h3>
              <p className="text-slate-600 text-sm">Moovalur Ramamirtham and other empowerment schemes.</p>
            </div>
            
            <div className="card p-6 flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4 text-green-600">
                <Briefcase className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-2">Unemployed / Farmers</h3>
              <p className="text-slate-600 text-sm">Livelihood support, farming subsidies, and training programs.</p>
            </div>

            <div className="card p-6 flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4 text-orange-600">
                <LayoutDashboard className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-2">Disabled / Seniors</h3>
              <p className="text-slate-600 text-sm">Saksham scholarship and special welfare schemes.</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* How it works */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-slate-900 mb-12">How It Works</h2>
          <div className="flex flex-col md:flex-row justify-center items-center gap-8 md:gap-12">
            <div className="flex-1 max-w-xs">
              <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto text-2xl font-bold text-blue-600 shadow-sm mb-4 border-2 border-blue-100">1</div>
              <h4 className="font-bold text-lg mb-2">Register</h4>
              <p className="text-sm text-slate-600">Create an account in minutes.</p>
            </div>
            <div className="hidden md:block w-16 h-0.5 bg-slate-300"></div>
            <div className="flex-1 max-w-xs">
              <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto text-2xl font-bold text-blue-600 shadow-sm mb-4 border-2 border-blue-100">2</div>
              <h4 className="font-bold text-lg mb-2">Complete Profile</h4>
              <p className="text-sm text-slate-600">Enter your details like income, caste category, and education.</p>
            </div>
            <div className="hidden md:block w-16 h-0.5 bg-slate-300"></div>
            <div className="flex-1 max-w-xs">
              <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto text-2xl font-bold text-blue-600 shadow-sm mb-4 border-2 border-blue-100">3</div>
              <h4 className="font-bold text-lg mb-2">Apply</h4>
              <p className="text-sm text-slate-600">Instantly see eligible schemes and apply on official portals.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-3xl p-8 md:p-12 shadow-lg border border-indigo-100"
          >
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Have Questions or Feedback?</h2>
              <p className="text-lg text-slate-600">Send us a message and our support team will get back to you shortly.</p>
            </div>
            
            <form onSubmit={handleContactSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Your Name</label>
                  <input required type="text" className="input-field bg-white" placeholder="John Doe" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
                  <input required type="email" className="input-field bg-white" placeholder="john@example.com" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Message</label>
                <textarea required rows="4" className="input-field bg-white resize-none" placeholder="How can we help you?" value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})}></textarea>
              </div>
              <button disabled={loading} type="submit" className="w-full btn-primary flex justify-center items-center py-3 text-lg group">
                {loading ? 'Sending...' : <>Send Message <Send className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" /></>}
              </button>
            </form>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
