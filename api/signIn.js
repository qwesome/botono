const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

module.exports = async (req, res) => {
  const { userName, passWord } = req.body;

  if (!userName || !passWord) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  const client = await pool.connect();

  try {
    const result = await client.query(
      'SELECT * FROM user_data WHERE username = $1 AND password = $2',
      [userName, passWord]
    );

    if (result.rows.length > 0) {
      const user = result.rows[0];
      res.status(200).json({ user });
    } else {
      res.status(401).json({ error: 'Could not find account' });
    }
  } catch (error) {
    console.error('Database operation failed:', error.message);
    res.status(500).json({ error: 'Database operation failed', details: error.message });
  } finally {
    client.release();
  }
};
