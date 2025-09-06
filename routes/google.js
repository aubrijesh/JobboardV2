const express = require('express');
const { google } = require('googleapis');
const router = express.Router();

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID || 'YOUR_CLIENT_ID';
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || 'YOUR_CLIENT_SECRET';
const REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI || 'http://localhost:3000/auth/google/callback';

const SCOPES = [
  'https://www.googleapis.com/auth/spreadsheets',
  'https://www.googleapis.com/auth/drive.metadata.readonly'
];

// Get headers (columns) from a Google Sheet for mapping UI
router.get('/sheet-headers', async (req, res) => {
  if (!req.session.tokens) return res.status(401).json({ error: 'Not authenticated' });
  const sheetId = req.query.sheetId;
  if (!sheetId) return res.status(400).json({ error: 'Missing sheetId' });
  const oAuth2Client = getOAuth2Client(req);
  const sheets = google.sheets({ version: 'v4', auth: oAuth2Client });
  try {
    const sheetName = 'Sheet1'; // Or make this dynamic
    const headerResp = await sheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range: `${sheetName}!1:1`
    });
    const headers = headerResp.data.values ? headerResp.data.values[0] : [];
    res.json(headers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// Submit form data to Google Sheet
router.post('/submit-to-sheet', async (req, res) => {
  if (!req.session.tokens) return res.status(401).json({ success: false, error: 'Not authenticated' });
  const { sheetId, formData } = req.body;
  if (!sheetId || !formData) return res.status(400).json({ success: false, error: 'Missing sheetId or formData' });
  const oAuth2Client = getOAuth2Client(req);
  const sheets = google.sheets({ version: 'v4', auth: oAuth2Client });
  try {
    const sheetName = 'Sheet1'; // Or make this dynamic
    // 1. Get current headers (first row)
    const headerResp = await sheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range: `${sheetName}!1:1`
    });
    let headers = headerResp.data.values ? headerResp.data.values[0] : [];

    // 2. If no headers, set them from formData keys
    if (!headers.length) {
      headers = Object.keys(formData);
      await sheets.spreadsheets.values.update({
        spreadsheetId: sheetId,
        range: `${sheetName}!1:1`,
        valueInputOption: 'RAW',
        requestBody: { values: [headers] }
      });
    }

    // 3. Prepare row in header order
    const row = headers.map(h => formData[h] || '');

    // 4. Append the row
    await sheets.spreadsheets.values.append({
      spreadsheetId: sheetId,
      range: sheetName,
      valueInputOption: 'RAW',
      insertDataOption: 'INSERT_ROWS',
      requestBody: { values: [row] }
    });

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

function getOAuth2Client(req) {
  const oAuth2Client = new google.auth.OAuth2(
    CLIENT_ID,
    CLIENT_SECRET,
    REDIRECT_URI
  );
  if (req.session.tokens) {
    oAuth2Client.setCredentials(req.session.tokens);
  }
  return oAuth2Client;
}

// Step 1: Start OAuth2 flow
router.get('/google', (req, res) => {
  const oAuth2Client = getOAuth2Client(req);
  const url = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
    prompt: 'consent'
  });
  res.redirect(url);
});

// Step 2: OAuth2 callback
router.get('/google/callback', async (req, res) => {
  const oAuth2Client = getOAuth2Client(req);
  const code = req.query.code;
  if (!code) return res.status(400).send('No code provided');
  try {
    const { tokens } = await oAuth2Client.getToken(code);
    req.session.tokens = tokens;

    // Get user info from Google
    const oauth2 = google.oauth2({ version: 'v2', auth: oAuth2Client });
    const userinfo = await oauth2.userinfo.get();
    const { email, name, id: google_id } = userinfo.data;

    // Create channel and user if not exists
    const { signupAndCreateChannel } = require('../backend/signupHandler');
    try {
      await signupAndCreateChannel({
        email,
        password: null, // No password for Google
        name,
        google_id,
        signup_method: 'google'
      });
    } catch (e) {
      // Ignore duplicate user/channel errors (user may already exist)
    }

    res.send('<script>window.close();window.opener.postMessage("google-auth-success", "*");</script>');
  } catch (err) {
    res.status(500).send('Authentication failed');
  }
});

// Step 3: List Google Sheets
router.get('/sheets', async (req, res) => {
  if (!req.session.tokens) return res.status(401).json({ error: 'Not authenticated' });
  const oAuth2Client = getOAuth2Client(req);
  const drive = google.drive({ version: 'v3', auth: oAuth2Client });
  try {
    const result = await drive.files.list({
      q: "mimeType='application/vnd.google-apps.spreadsheet' and trashed=false",
      fields: 'files(id, name)',
      pageSize: 50
    });
    res.json(result.data.files);
  } catch (err) {
    res.status(500).json({ error: 'Failed to list sheets' });
  }
});

module.exports = router;
