// GET /api/stages - return all stage IDs and names

const express = require('express');
const router = express.Router();
const {executeQuery} = require('../db');

// Multer setup for file uploads with dynamic destination based on share_token
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const storage = multer.diskStorage({
  destination: async function (req, file, cb) {
    try {
      let shareToken = req.headers['x-share-token'] || req.body.share_token || req.body.shareToken;
      if (!shareToken && req.body.formData) {
        try {
          const fd = JSON.parse(req.body.formData);
          shareToken = fd.share_token || fd.shareToken;
        } catch {}
      }
      if (!shareToken) return cb(new Error('Missing share_token'));
  // Use JOIN to get share_id and channel_id in one query
  const [rows] = await executeQuery(`
    SELECT s.id as share_id, f.channel_id
    FROM form_shares s
    JOIN forms f ON s.formid = f.id
    WHERE s.share_token = ?
  `, [shareToken]);
  if (!rows.length) return cb(new Error('Invalid share_token'));
  const shareId = rows[0].share_id;
  const channelId = rows[0].channel_id;
  req._resolvedShareId = shareId;
  req._resolvedChannelId = channelId;
  const uploadPath = path.join(__dirname, '../uploaded_files', String(channelId), String(shareId));
  fs.mkdirSync(uploadPath, { recursive: true });
  cb(null, uploadPath);
    } catch (e) {
      cb(e);
    }
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '---' + file.originalname);
  }
});
const upload = multer({ storage });
const multiUpload = upload.any();

router.get('/stages', async (req, res) => {
  try {
    const [rows] = await executeQuery('SELECT id, stage FROM stages ORDER BY id ASC');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'DB error' });
  }
});

// POST /api/save-form (public: uses share_token to resolve channel_id/share_id)
router.post('/save-form', multiUpload, async (req, res) => {
  try {
    let formData, shareId, channelId;
    if (req.body.formData) {
      formData = JSON.parse(req.body.formData);
    } else {
      formData = req.body.formData || req.body;
    }
    // Resolve shareId and channelId from multer (set during file upload)
    shareId = req._resolvedShareId;
    channelId = req._resolvedChannelId;
    let shareToken = req.headers['x-share-token'] || req.body.share_token || req.body.shareToken;
    if (!shareToken && formData) {
      shareToken = formData.share_token || formData.shareToken;
    }
    // If not set (no files), resolve from DB using share_token
    if (!shareId || !channelId) {
      let shareToken = req.headers['x-share-token'] || req.body.share_token || req.body.shareToken;
      if (!shareToken && formData) {
        shareToken = formData.share_token || formData.shareToken;
      }
      if (!shareToken) throw new Error('Missing share_token');
      const [rows] = await executeQuery(`
        SELECT s.id as share_id, f.channel_id
        FROM form_shares s
        JOIN forms f ON s.formid = f.id
        WHERE s.share_token = ?
      `, [shareToken]);
      if (!rows.length) throw new Error('Invalid share_token');
      shareId = rows[0].share_id;
      channelId = rows[0].channel_id;
    }

    // Get Screening stage id
    const [stageRows] = await executeQuery("SELECT id FROM stages WHERE stage = 'Screening' LIMIT 1");
    const screeningStageId = stageRows[0] ? stageRows[0].id : null;

    // 1. Insert with empty data to get submission_id
    const [result] = await executeQuery(
      'INSERT INTO submissions (data, share_id, stage_id) VALUES (?, ?, ?)',
      [JSON.stringify({}), shareId, screeningStageId]
    );
    const submissionId = result.insertId;

    // 2. Move files to channel_id/share_id/submission_id and build URLs
    let fileUrlMap = {};
    if (req.files && req.files.length > 0) {
      const protocol = req.protocol;
      const host = req.get('host');
      req.files.forEach(f => {
        let key = f.fieldname;
        let splitFileName = f.filename.split('---');
        let dtNow = splitFileName[0];
        let originalName = splitFileName[1];

        if (key.endsWith('[]')) key = key.slice(0, -2);
        const destDir = path.join(__dirname, '../uploaded_files', String(channelId), String(shareToken), String(submissionId),dtNow);
        fs.mkdirSync(destDir, { recursive: true });
        const destPath = path.join(destDir, originalName);
        fs.renameSync(f.path, destPath);
        const relPath = `/uploaded_files/${channelId}/${shareToken}/${submissionId}/${dtNow}/${originalName}`;
        const url = `${protocol}://${host}${relPath}`;
        if (!fileUrlMap[key]) fileUrlMap[key] = [];
        fileUrlMap[key].push(url);
      });
    }
    // 3. Add file URLs to formData
    for (const key in fileUrlMap) {
      if (fileUrlMap[key].length === 1) {
        formData[key] = fileUrlMap[key][0];
      } else if (fileUrlMap[key].length > 1) {
        formData[key] = fileUrlMap[key];
      }
    }
    // 4. Update DB with real data (plain and formatted)
    let formattedData = formData.formatted_data || null;
    if (formattedData) delete formData.formatted_data;
    await executeQuery(
      'UPDATE submissions SET data = ?, formatted_data = ? WHERE id = ?',
      [JSON.stringify(formData), formattedData ? JSON.stringify(formattedData) : null, submissionId]
    );
    res.json({ success: true, id: submissionId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message || 'DB error' });
  }
});

// PUT /api/submissions/:id - update plain and formatted data
router.put('/api/submissions/:id', async (req, res) => {
  const { data, formatted_data } = req.body;
  const { id } = req.params;
  try {
    await executeQuery(
      'UPDATE submissions SET data = ?, formatted_data = ? WHERE id = ?',
      [JSON.stringify(data), formatted_data ? JSON.stringify(formatted_data) : null, id]
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: 'DB error' });
  }
});

// GET /api/submissions - return all submissions as JSON
router.get('/submissions', async (req, res) => {
  try {
    const { share_id } = req.query;
    let rows;
    if (share_id) {
      [rows] = await executeQuery('SELECT submissions.*, stages.stage FROM submissions LEFT JOIN stages ON submissions.stage_id = stages.id WHERE share_id = ? ORDER BY created_at DESC', [share_id]);
    } else {
      [rows] = await executeQuery('SELECT submissions.*, stages.stage FROM submissions LEFT JOIN stages ON submissions.stage_id = stages.id ORDER BY created_at DESC');
    }
    // Parse JSON data column, include stage_id for frontend mapping
    const submissions = rows.map(row => ({
      id: row.id,
      data: row.data,
      created_at: row.created_at,
      stage: row.stage,
      stage_id: row.stage_id
    }));
    res.json(submissions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'DB error' });
  }
});

router.get("/form/submissions/:id", async (req, res) => {
  const formId = req.params.id;
  const channelId = req.session.channel_id;
  try {
    const [rows] = await executeQuery(
      `SELECT s.*, st.stage as stage,fs.name as spn
      FROM submissions s
      JOIN form_shares fs ON s.share_id = fs.id
      JOIN stages st ON s.stage_id = st.id
      JOIN forms f ON fs.formid = f.id AND f.channel_id = ?
      WHERE f.id = ?`,
      [channelId,formId]
    );
    if (!rows.length) return res.status(404).json({ success: false, error: 'Form not found' });
    const [submission] = rows;
    const data = submission.data;
    const response = {
      id: submission.id,
      data: rows,
      created_at: submission.created_at,
      stage: submission.stage_name,
      jobdesc: submission.jobdesc
    };
    res.json({ success: true, response });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'DB error' });
  }

});




// POST /api/preview-submission
router.post('/preview-submission', async (req, res) => {
  try {
    const { formData, formId } = req.body;
    const [result] = await executeQuery(
      'INSERT INTO preview_submissions (data, formid) VALUES (?, ?)',
      [JSON.stringify(formData), formId || null]
    );
    res.json({ success: true, id: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'DB error' });
  }
});

// DELETE /api/forms/:id - delete form by ID
router.delete('/forms/:id', async (req, res) => {
  const formId = req.params.id;
  try {
     const [result] = await executeQuery(
      'DELETE FROM forms WHERE id = ? limit 1;',
      [formId]
    );
    res.json({ success: true });
  } catch (err) {
      res.status(500).json({ success: false, error: err.message });
  }
});

router.post('/forms/:id/jobdesc', async (req, res) => {
  const formId = req.params.id;
  const { jobdesc } = req.body; 
  try {
     const [result] = await executeQuery(
      'UPDATE forms set jobdesc = ? WHERE id = ? limit 1;',
      [jobdesc, formId]
    );
    res.json({ success: true });
  } catch (err) {
      res.status(500).json({ success: false, error: err.message });
  }
});



module.exports = router;
