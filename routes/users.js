
var express = require('express');
var router = express.Router();
const bcrypt = require('bcrypt');
const { executeQuery } = require('../db');
const passport = require('passport');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

// POST /login - Login with email and password only
router.post('/login', passport.authenticate('local', {
}), async (req, res) => {
  let { email, username , password } = req.body;
  email = email || username; // Allow login with either email or username
  
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }
  try {
    const [users] = await executeQuery('SELECT * FROM users WHERE email = ?', [email]);
    if (users.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }
    const user = users[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }
    // Use Passport's req.login to set req.user and enable isAuthenticated()
    req.login(user, function(err) {
      if (err) {
        console.error('Passport login error:', err);
        return res.status(500).json({ error: 'Internal server error.' + err.message });
      }
      // Optionally set additional session properties
      req.session.user_id = user.id;
      req.session.channel_id = user.channel_id;
      return res.status(200).json({ redirect: '/forms' });
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Internal server error.' + err.message });
  }
});

// POST /signup - Register a new user
router.post('/signup', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }
  try {
    // Check if user already exists
    const [users] = await executeQuery('SELECT id FROM users WHERE email = ?', [email]);
    if (users.length > 0) {
      return res.status(409).json({ error: 'Email already registered.' });
    }
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    // Insert user
    await executeQuery('INSERT INTO users (email, password) VALUES (?, ?)', [email, hashedPassword]);
    return res.status(201).json({ message: 'User registered successfully.' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Internal server error.' });
  }
});

module.exports = router;
