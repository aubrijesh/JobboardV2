// signupHandler.js
// Handles user signup (Google or direct), creates channel, and associates user

const {executeQuery} = require('./db'); // adjust path as needed

/**
 * Signup handler for both Google and direct signups
 * @param {Object} userInfo - { email, password, name, google_id, signup_method }
 * @returns {Promise<Object>} - Created user and channel info
 */
async function signupAndCreateChannel(userInfo) {
  try {
    const channelResult = await executeQuery('INSERT INTO channels (name, description) VALUES (?, ?)', [userInfo.email, null])
    const channel_id = channelResult.insertId;
    // 2. Create user with channel_id
    executeQuery
    const [rows] = await channelResult(
      `INSERT INTO users (email, password, name, google_id, signup_method, channel_id)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [userInfo.email, userInfo.password || null, userInfo.name || null, userInfo.google_id || null, userInfo.signup_method, channel_id]
    );
    return { user_id: rows.insertId, channel_id };
  } catch (err) {
    throw err;
  } finally {
  }
}

module.exports = { signupAndCreateChannel };
