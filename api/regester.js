const { Pool } = require('pg');

// Create a new pool instance (one-time setup)
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

  const client = await pool.connect(); // Get a client from the pool

  try {
    // Check if the username is already taken
    const result = await client.query(
      'SELECT username FROM user_data WHERE username = $1',
      [userName]
    );

    if (result.rows.length > 0) {
      return res.status(401).json({ error: 'Username taken' });
    } else {
      // Insert new user into the database
      const writeResult = await client.query(
        'INSERT INTO user_data (username, password, coins, gems) VALUES ($1, $2, $3, $4)',
        [userName, passWord, 160, 25]
      );
      res.status(200).json({ result: writeResult });
    }
  } catch (error) {
    console.error('Database operation failed:', error.message);
    res.status(500).json({ error: 'Database operation failed', details: error.message });
  } finally {
    client.release(); // Release the client back to the pool
  }
};
