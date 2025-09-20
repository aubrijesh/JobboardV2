

const express = require('express');
const router = express.Router();
const {executeQuery} = require('../db');

// Multer setup for file uploads with dynamic destination based on share_token
const multer = require('multer');
const fs = require('fs');
const path = require('path');
// Update candidate stage and log action
router.put('/submissions/:id/status', async (req, res) => {
  const submissionId = req.params.id;
  const { to_stage, from_stage } = req.body;
  const user_id = req.session.user_id;
  const  channel_id = req.session.channel_id;
  
  try {
    // Validate stage IDs
    const [toRows] = await executeQuery('SELECT id FROM stages WHERE id = ? LIMIT 1', [to_stage]);
    const [fromRows] = await executeQuery('SELECT id FROM stages WHERE id = ? LIMIT 1', [from_stage]);
    if (!toRows.length || !fromRows.length) return res.status(400).json({ success: false, error: 'Invalid stage ID' });
    // Update submission
    await executeQuery('UPDATE submissions SET stage_id = ? WHERE id = ?', [to_stage, submissionId]);
    // Log action (store IDs)
    await executeQuery(
      'INSERT INTO actions (submission_id, user_id, type, from_stage, to_stage) VALUES (?, ?, ?, ?, ?)',
      [submissionId, user_id || 0, 'move', from_stage, to_stage]
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;