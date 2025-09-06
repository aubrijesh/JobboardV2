const express = require('express');
const router = express.Router();
const {executeQuery} = require('../db');

// POST /api/save-form-builder
router.post('/save', async (req, res) => {
  try {
    const { state, channel_id } = req.body;
    // Use channel_id from session if not provided in body
    const finalChannelId = channel_id || req.session.channel_id || null;
    await executeQuery(
      'INSERT INTO forms (state_json, channel_id) VALUES (?, ?)',
      [JSON.stringify(state), finalChannelId]
    );
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'DB error' });
  }
});

// PUT /api/forms/:id/data - update form state and set status=1 (modified)
router.put('/forms/:id/data', async (req, res) => {
  try {
    const formId = req.params.id;
    await executeQuery(
      'UPDATE forms SET state_json = ?, status = 1 WHERE id = ?',
      [JSON.stringify(req.body.data), formId]
    );
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'DB error' });
  }
});

module.exports = router;
