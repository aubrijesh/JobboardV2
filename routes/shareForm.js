const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const {executeQuery} = require('../db');
require('dotenv').config();


// GET /forms/:id/all-links - render all_links.hbs page
router.get('/forms/:id/all-links', async (req, res) => {
  const formId = req.params.id;
  res.render('all_links', { formId, logo_url: process.env.LOGO_URL });
});

// GET /api/forms/:id/shares-with-submissions - get all share links for a form with submission counts
router.get('/api/forms/:id/shares-with-submissions', async (req, res) => {
  const formId = req.params.id;
  try {
    const [rows] = await executeQuery(`
      SELECT s.id, s.name, s.share_token, s.created_at, COUNT(sub.id) as sCount
      FROM form_shares s
      LEFT JOIN submissions sub ON sub.share_id = s.id
      WHERE s.formid = ?
      GROUP BY s.id
      ORDER BY s.id DESC
    `, [formId]);

    const links = rows.map(row => ({
      id: row.id,
      name: row.name,
      url: `${req.protocol}://${req.get('host')}/share/${row.share_token}`,
      created_at: row.created_at,
      submissions: row.sCount || 0
    }));
    res.json({ success: true, links });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'DB error' });
  }
});


// GET /api/forms/:id/shares - get all share links for a form
router.get('/forms/:id/shares', async (req, res) => {
  const formId = req.params.id;
  try {
    const [rows] = await executeQuery('SELECT name, share_token, created_at FROM form_shares WHERE formid = ? ORDER BY id DESC', [formId]);
    const links = rows.map(row => ({
      name: row.name,
      url: `${req.protocol}://${req.get('host')}/share/${row.share_token}`,
      created_at: row.created_at
    }));
    res.json({ success: true, links });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'DB error' });
  }
});


// POST /api/forms/:id/share - generate or fetch a sharable link for a form, and save name if provided
router.post('/forms/:id/share', async (req, res) => {
  const formId = req.params.id;
  const { name } = req.body;
  try {
    // Check form status
    const [formRows] = await executeQuery('SELECT status, state_json, jobdesc FROM forms WHERE id = ?', [formId]);
    if (!formRows.length) return res.status(404).json({ success: false, error: 'Form not found' });
    const status = formRows[0].status;
    const stateJson = formRows[0].state_json;
    const jobdesc = formRows[0].jobdesc || '';
    if (status === 0 && !name) {
      // Not modified after share, reuse existing share if exists
      const [rows] = await executeQuery('SELECT share_token, name, jobdesc FROM form_shares WHERE formid = ? ORDER BY id DESC LIMIT 1', [formId]);
      if (rows.length > 0) {
        return res.json({ success: true, shareUrl: `${req.protocol}://${req.get('host')}/share/${rows[0].share_token}`, shareName: rows[0].name || '', jobdesc: rows[0].jobdesc || '' });
      }
    }
    // Modified or new share with name, create new share
    const token = crypto.randomBytes(16).toString('hex');
    await executeQuery('INSERT INTO form_shares (formid, share_token, state_json, name, jobdesc) VALUES (?, ?, ?, ?, ?)', [formId, token, stateJson, name || null, jobdesc]);
    // Set status=0 (not modified after share)
    await executeQuery('UPDATE forms SET status = 0 WHERE id = ?', [formId]);
    res.json({ success: true, shareUrl: `${req.protocol}://${req.get('host')}/share/${token}` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'DB error' });
  }
});

router.get('/forms/:id/lastShared', async (req, res) => {
  const formId = req.params.id;
  try {
    const [rows] = await executeQuery('SELECT share_token, name FROM form_shares WHERE formid = ? ORDER BY id DESC LIMIT 1', [formId]);
    if (rows.length > 0) {
      return res.json({ success: true, shareUrl: `${req.protocol}://${req.get('host')}/share/${rows[0].share_token}`, shareName: rows[0].name || '' });
    }
    return res.json({ success: true, shareUrl: '', shareName: '' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'DB error' });
  }
});

// GET /share/:token - render the public form view
router.get('/share/:token', async (req, res) => {
  const token = req.params.token;
  try {
    const [rows] = await executeQuery('SELECT id,name, formid, state_json, jobdesc FROM form_shares WHERE share_token = ?', [token]);
    if (rows.length === 0) return res.status(404).send('Invalid link');
    const formId = rows[0].formid;
    const sid = rows[0].id;
    const shareStateJson = rows[0].state_json;
    const profieName = rows[0].name;
    const jobdesc = rows[0].jobdesc || '';
    // Fetch form data
    const [forms] = await executeQuery('SELECT * FROM forms WHERE id = ?', [formId]);
    if (!forms.length) return res.status(404).send('Form not found');
    const form = forms[0];
    // Use state_json from form_shares if present
    let fields = [];
    let strFields = '[]';
    try {
      if (shareStateJson) {
        if (typeof shareStateJson === 'string') {
          fields = JSON.parse(shareStateJson);
        } else {
          fields = shareStateJson;
        }
      }
      strFields = encodeJsonBase64(fields);
    } catch (e) { strFields = '[]'; }
    res.render('public_form', { form: form, profieName: profieName, fields: strFields, shareId: sid, jobdesc: jobdesc, logo_url: process.env.LOGO_URL });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});


function encodeJsonBase64(json) {
    return Buffer.from(JSON.stringify(json), 'utf8').toString('base64');
}
function decodeJsonBase64(str) {
    return JSON.parse(Buffer.from(str, 'base64').toString('utf8'));
}

module.exports = router;
