import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import db, { initDb } from './database.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_key_change_me_in_prod';

// Initialize DB
initDb();

// Middleware to verify JWT
const authenticateUser = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Access denied' });

  try {
    const verified = jwt.verify(token, JWT_SECRET);
    req.user = verified;
    next();
  } catch (error) {
    res.status(400).json({ message: 'Invalid token' });
  }
};

// =======================
// AUTHENTICATION ROUTES
// =======================

// User Registration
app.post('/api/auth/register', async (req, res) => {
  const { name, email, password } = req.body;
  
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Please provide all fields' });
  }

  try {
    // Check if user exists
    db.get('SELECT email FROM users WHERE email = ?', [email], async (err, row) => {
      if (err) throw err;
      if (row) return res.status(400).json({ message: 'User already exists' });

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Save user
      db.run('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', 
        [name, email, hashedPassword], 
        function(err) {
          if (err) return res.status(500).json({ message: 'Database error', error: err.message });
          
          const token = jwt.sign({ id: this.lastID, role: 'user' }, JWT_SECRET);
          res.json({ token, user: { id: this.lastID, name, email } });
      });
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// User Login
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
    if (err) return res.status(500).json({ message: 'Database error', error: err.message });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user.id, role: 'user' }, JWT_SECRET);
    
    // Remove password before sending
    const { password: pwd, ...userWithoutPassword } = user;
    res.json({ token, user: userWithoutPassword });
  });
});

// Admin Login
app.post('/api/admin/login', (req, res) => {
  const { username, password } = req.body;

  db.get('SELECT * FROM admin WHERE username = ?', [username], async (err, admin) => {
    if (err) return res.status(500).json({ message: 'Database error' });
    if (!admin) return res.status(400).json({ message: 'Invalid credentials' });

    const validPassword = await bcrypt.compare(password, admin.password);
    if (!validPassword) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: admin.id, role: 'admin' }, JWT_SECRET);
    res.json({ token, user: { username: admin.username, role: 'admin' } });
  });
});

// =======================
// CONTACT & FEEDBACK
// =======================

app.post('/api/contact', (req, res) => {
  const { name, email, message } = req.body;
  
  if (!name || !email || !message) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  db.run('INSERT INTO contacts (name, email, message) VALUES (?, ?, ?)', 
    [name, email, message], function(err) {
      if (err) return res.status(500).json({ message: 'Error saving message' });
      res.json({ message: 'Message sent successfully!' });
  });
});

app.get('/api/admin/contacts', authenticateUser, (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Admin access required' });
  
  db.all('SELECT * FROM contacts ORDER BY created_at DESC', [], (err, rows) => {
    if (err) return res.status(500).json({ message: 'Database error' });
    res.json({ contacts: rows });
  });
});

// =======================
// USER PROFILE ROUTES
// =======================

// Get Profile
app.get('/api/users/profile', authenticateUser, (req, res) => {
  db.get('SELECT id, name, email, role, age, gender, state, district, category, income, education_level, institution_type FROM users WHERE id = ?', 
    [req.user.id], 
    (err, user) => {
      if (err) return res.status(500).json({ message: 'Database error' });
      if (!user) return res.status(404).json({ message: 'User not found' });
      res.json({ user });
  });
});

// Update Profile Form
app.put('/api/users/profile', authenticateUser, (req, res) => {
  const { role, age, gender, state, district, category, income, education_level, institution_type } = req.body;

  db.run(`UPDATE users SET 
    role = ?, age = ?, gender = ?, state = ?, district = ?, 
    category = ?, income = ?, education_level = ?, institution_type = ? 
    WHERE id = ?`, 
    [role, age, gender, state, district, category, income, education_level, institution_type, req.user.id],
    function(err) {
      if (err) return res.status(500).json({ message: 'Database update failed', error: err.message });
      
      db.get('SELECT id, name, email, role, age, gender, state, district, category, income, education_level, institution_type FROM users WHERE id = ?', [req.user.id], (err, updatedUser) => {
        res.json({ message: 'Profile updated', user: updatedUser });
      });
  });
});

// =======================
// SCHEMES / FILTER ENGINE ROUTES
// =======================

// Get all schemes (Admin)
app.get('/api/admin/schemes', authenticateUser, (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Admin access required' });
  
  db.all('SELECT * FROM schemes', [], (err, rows) => {
    if (err) return res.status(500).json({ message: 'Database error' });
    res.json({ schemes: rows });
  });
});

// Get user count (Admin)
app.get('/api/admin/users', authenticateUser, (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Admin access required' });
  
  db.all('SELECT id, name, email, role, state, district FROM users', [], (err, rows) => {
    if (err) return res.status(500).json({ message: 'Database error' });
    res.json({ users: rows });
  });
});

// Add Scheme (Admin)
app.post('/api/admin/schemes', authenticateUser, (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Admin access required' });

  const s = req.body;
  db.run(`INSERT INTO schemes (scheme_name, provider, target_role, category_required, gender_required, income_limit, education_required, state, description, official_link) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [s.scheme_name, s.provider, s.target_role, s.category_required, s.gender_required, s.income_limit, s.education_required, s.state, s.description, s.official_link],
    function(err) {
      if (err) return res.status(500).json({ message: 'Failed to add scheme' });
      res.json({ message: 'Scheme added successfully!', id: this.lastID });
    });
});

// Delete Scheme (Admin)
app.delete('/api/admin/schemes/:id', authenticateUser, (req, res) => {
   if (req.user.role !== 'admin') return res.status(403).json({ message: 'Admin access required' });

   db.run('DELETE FROM schemes WHERE id = ?', [req.params.id], function(err) {
     if (err) return res.status(500).json({ message: 'Failed to delete scheme' });
     res.json({ message: 'Scheme deleted' });
   });
});

// Update Scheme (Admin)
app.put('/api/admin/schemes/:id', authenticateUser, (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Admin access required' });

  const s = req.body;
  db.run(`UPDATE schemes SET scheme_name = ?, provider = ?, target_role = ?, category_required = ?, gender_required = ?, income_limit = ?, education_required = ?, state = ?, description = ?, official_link = ? WHERE id = ?`,
    [s.scheme_name, s.provider, s.target_role, s.category_required, s.gender_required, s.income_limit, s.education_required, s.state, s.description, s.official_link, req.params.id],
    function(err) {
      if (err) return res.status(500).json({ message: 'Failed to update scheme' });
      res.json({ message: 'Scheme updated!' });
    });
});

// =======================
// SAVED SCHEMES ROUTES
// =======================

// Save a scheme
app.post('/api/schemes/save', authenticateUser, (req, res) => {
  const { scheme_id } = req.body;

  // Check if already saved
  db.get('SELECT * FROM saved_schemes WHERE user_id = ? AND scheme_id = ?', [req.user.id, scheme_id], (err, row) => {
    if (err) return res.status(500).json({ message: 'Database error' });
    if (row) return res.status(400).json({ message: 'Scheme already saved' });

    db.run('INSERT INTO saved_schemes (user_id, scheme_id) VALUES (?, ?)', [req.user.id, scheme_id], function(err) {
      if (err) return res.status(500).json({ message: 'Failed to save scheme' });
      res.json({ message: 'Scheme saved successfully!' });
    });
  });
});

// Get user's saved schemes
app.get('/api/schemes/saved', authenticateUser, (req, res) => {
  db.all(`
    SELECT schemes.*, saved_schemes.id as saved_id 
    FROM saved_schemes 
    JOIN schemes ON saved_schemes.scheme_id = schemes.id 
    WHERE saved_schemes.user_id = ?
    ORDER BY saved_schemes.created_at DESC`, [req.user.id], (err, rows) => {
      if (err) return res.status(500).json({ message: 'Database error' });
      res.json({ schemes: rows });
  });
});

// Remove a saved scheme
app.delete('/api/schemes/saved/:id', authenticateUser, (req, res) => {
  // `id` is the ID of the scheme to remove, not the saved_id. This is easier for UI.
  db.run('DELETE FROM saved_schemes WHERE user_id = ? AND scheme_id = ?', [req.user.id, req.params.id], function(err) {
    if (err) return res.status(500).json({ message: 'Failed to unsave scheme' });
    res.json({ message: 'Scheme removed from saved list' });
  });
});

// The Filtering Engine (User)
app.get('/api/schemes/eligible', authenticateUser, (req, res) => {
  
  // First get user profile details
  db.get('SELECT * FROM users WHERE id = ?', [req.user.id], (err, user) => {
    if (err) return res.status(500).json({ message: 'Database error' });
    if (!user || !user.role) return res.status(400).json({ message: 'Please complete your profile first' });

    // Business Logic for filtering
    // 1. User role must match scheme target role
    // 2. User category must match scheme category OR scheme category is "All"
    // 3. User income must be less than or equal to scheme income limit
    // 4. User gender must match scheme gender OR scheme gender is "All"
    // 5. Scheme state must be "All India" OR user state
    // We'll pull all schemes and filter in Node for simpler logic, since data is small
    
    db.all('SELECT * FROM schemes', [], (err, schemes) => {
      if (err) return res.status(500).json({ message: 'Database error' });

      // If user profile is missing info, we filter out everything? 
      // Safe to ensure we have defaults for missing fields
      const userState = user.state || '';
      const userGender = user.gender || '';
      const userCategory = user.category || '';
      const userRole = user.role || '';
      const userIncome = user.income || 0;
      
      const eligibleSchemes = schemes.filter(scheme => {
        
        // Target Role matching. For "Women", role might just be Women or Student but gender=Female.
        // If users select role "Women", or "Student", "Disabled", etc.
        // Let's do exact match or if scheme role is "All" (assuming some schemes might have "All")
        const matchRole = (scheme.target_role === userRole) || (scheme.target_role === 'All') || (scheme.target_role === 'Women' && userGender === 'Female') || (scheme.target_role === 'Disabled' && userRole === 'Disabled');
        
        // Category
        const matchCategory = (scheme.category_required === 'All') || (scheme.category_required === userCategory);
        
        // Income
        const matchIncome = userIncome <= scheme.income_limit;
        
        // Gender
        const matchGender = (scheme.gender_required === 'All') || (scheme.gender_required === userGender);
        
        // State
        const matchState = (scheme.state === 'All India') || (scheme.state === userState);

        return matchRole && matchCategory && matchIncome && matchGender && matchState;
      });

      res.json({ schemes: eligibleSchemes, totalAvailable: schemes.length });
    });
  });
});


// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
