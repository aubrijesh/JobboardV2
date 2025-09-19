var express = require('express');
var app = express();
require('dotenv').config();
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const { engine } = require("express-handlebars");
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');



var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var googleRouter = require('./routes/google');
var session = require('cookie-session');
const shareFormRouter = require('./routes/shareForm');
const {executeQuery} = require('./db'); // adjust path as needed

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine("hbs", engine({ extname: ".hbs", defaultLayout: false }));

const exphbs = engine({
  extname: '.hbs',
  defaultLayout: false,
  helpers: {
    json: function(context) {
      return JSON.stringify(context);
    }
  }
});
app.engine('hbs', exphbs);
app.set("view engine", "hbs");
require('dotenv').config();
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(session({
  secret: process.env.SESSION_SECRET || 'jobboard_secret',
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => {
  done(null, user);
});
passport.deserializeUser((user, done) => {
  done(null, user);
});

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: '/auth/google/callback'
}, (accessToken, refreshToken, profile, done) => {
  // You can save user info to DB here if needed
  return done(null, profile);
}));  

// Registration endpoint
app.post('/auth/register', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.redirect('/signup');
  try {
    const [existing] = await executeQuery('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length > 0) return res.redirect('/signin');
    const hash = await bcrypt.hash(password, 10);
    // Insert user without channel_id first
    const [userResult] = await executeQuery('INSERT INTO users (email, password) VALUES (?, ?)', [email, hash]);
    const userId = userResult.insertId;

    // Get the next channel number
    const [channels] = await executeQuery('SELECT COUNT(*) as count FROM channels');
    const channelNumber = (channels[0].count || 0) + 1;
    const channelName = `channel${channelNumber}`;

    // Create channel for user with name channelN
    const [channelResult] = await executeQuery('INSERT INTO channels (user_id, name) VALUES (?, ?)', [userId, channelName]);
    const channelId = channelResult.insertId;

    // Update user with channel_id
    await executeQuery('UPDATE users SET channel_id = ? WHERE id = ?', [channelId, userId]);

    req.session.user_id = userId;
    req.session.channel_id = channelId;
    res.redirect('/forms');
  } catch (err) {
    res.redirect('/signup');
  }
});

// Update local strategy to use bcrypt
passport.use(new LocalStrategy(
  async (username, password, done) => {
    try {
     
  const [rows] = await executeQuery('SELECT * FROM users WHERE email = ?', [username]);
  if (rows.length === 0) return done(null, false, { message: 'Incorrect username.' });
  const user = rows[0];
  const match = await bcrypt.compare(password, user.password);
  if (!match) return done(null, false, { message: 'Incorrect password.' });
  return done(null, user);
    } catch (err) {
      return done(err);
    }
  }
));

app.get('/signin', (req, res) => {
  res.render('signin');
});

// Update login redirects to go to /forms
app.post('/auth/local', passport.authenticate('local', {
}), (req, res) => {
  // Store user_id and channel_id in session
  req.session.user_id = req.user.id;
  req.session.channel_id = req.user.channel_id;
  // Ensure session is saved before redirect
  res.redirect('/forms');
  // req.session.save(() => {
    
  // });
});

app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/signin' }),
  async (req, res) => {
    // Extract user info from passport profile
    const profile = req.user;
    const email = profile.emails && profile.emails[0] && profile.emails[0].value;
    const name = profile.displayName;
    const google_id = profile.id;

    const { signupAndCreateChannel } = require('./signupHandler');
   
    let userId, channelId;
    try {
      // Check if user already exists
      const [existing] = await executeQuery('SELECT id, channel_id FROM users WHERE email = ?', [email]);
      if (existing.length === 0) {
        await signupAndCreateChannel({
          email,
          password: null, // No password for Google
          name,
          google_id,
          signup_method: 'google'
        });
        // Fetch new user/channel
        const [userRows] = await executeQuery('SELECT id, channel_id FROM users WHERE email = ?', [email]);
        userId = userRows[0].id;
        channelId = userRows[0].channel_id;
      } else {
        userId = existing[0].id;
        channelId = existing[0].channel_id || null;
      }
    } catch (e) {
      console.log("got error",e);
      // Ignore duplicate user/channel errors (user may already exist)
    }
    req.session.user_id = userId;
    req.session.channel_id = channelId;
    // Ensure session is saved before redirect
    res.redirect('/forms');
    // req.session.save(() => {
      
    // });
  }
);

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect('/signin');
}

// Protect index route
app.get('/', ensureAuthenticated, (req, res) => {
  res.redirect('/forms');
});

app.get('/signup', (req, res) => {
  res.render('signup');
});

// Forms listing page
app.get('/forms', ensureAuthenticated, (req, res) => {
  res.render('forms', {logo_url: process.env.LOGO_URL});
});

app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploaded_files', express.static(path.join(__dirname, 'uploaded_files')));

app.use('/', indexRouter);
app.use('/auth/', googleRouter);
app.use('/api', shareFormRouter);
app.use('/', shareFormRouter);
app.use('/users', usersRouter);

const saveFormRouter = require('./routes/saveForm');
const saveFormBuilderRouter = require('./routes/saveFormBuilder');
app.use('/api', saveFormRouter);
app.use('/api', saveFormBuilderRouter);
app.get('/submissions', (req, res) => {
  res.render('submission_table', { logo_url: process.env.LOGO_URL });
});
app.get('/form/submissions/:id', (req, res) => {
  res.render('form_submissions', { logo_url: process.env.LOGO_URL });
});
// API: Get all forms
app.get('/api/forms',ensureAuthenticated, async (req, res) => {
  let channel_id = req.session.channel_id || null;
  let user_id = req.session.user_id || null;
  const [rows] = await executeQuery('SELECT id, name FROM forms where channel_id= ? ORDER BY id DESC', [channel_id]);
  res.json(rows);
});

// API: Add new form
app.post('/api/forms', async (req, res) => {
  
  const channelId = req.session.channel_id;
  if(!channelId) return res.status(400).json({ error: 'No channel_id in session' });
  const [result] = await executeQuery('INSERT INTO forms (name, channel_id) VALUES (\'New Form\', ?)', [channelId]);
  res.json({ success: true, id: result.insertId });
});

// API: Update form name
app.put('/api/forms/:id', async (req, res) => {
  await executeQuery('UPDATE forms SET name = ? WHERE id = ?', [req.body.name, req.params.id]);
  res.json({ success: true });
});

// Edit form route: render index.hbs with form data
app.get('/edit-form', async (req, res) => {
  const [rows] = await executeQuery('SELECT * FROM forms WHERE id = ?', [req.query.id]);
  if (!rows.length) return res.redirect('/forms');
  const form = rows[0];
  res.render('index', { form, logo_url: process.env.LOGO_URL });
});

// API: Update form data (structure)
app.put('/api/forms/:id/data', async (req, res) => {
  await executeQuery('UPDATE forms SET state_json = ? WHERE id = ?', [JSON.stringify(req.body.data), req.params.id]);
  res.json({ success: true });
});

// API: Get a single form by id
app.get('/api/forms/:id', async (req, res) => {
  const [rows] = await executeQuery('SELECT * FROM forms WHERE id = ?', [req.params.id]);
  if (!rows.length) return res.status(404).json({ error: 'Form not found' });
  res.json(rows[0]);
});

app.get('/api/forms/:id/status', async (req, res) => {
  const [rows] = await executeQuery('SELECT status FROM forms WHERE id = ?', [req.params.id]);
  if (!rows.length) return res.status(404).json({ error: 'Form not found' });
  res.json(rows[0]);
});
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
