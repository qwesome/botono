const { Pool } = require('pg');

// Create a new pool instance
const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

module.exports = async (req, res) => {
  const { userName, passWord, itemname, coinspersecond, value, rarity, gemspersecond } = req.body;

  if (!userName || !passWord) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  const client = await pool.connect();

  try {
    const result = await client.query(
      'SELECT * FROM user_data WHERE username = $1 AND password = $2',
      [userName, passWord]
    );

    const user = result.rows[0];

    if (result.rows.length > 0) {
      await client.query(
        'INSERT INTO Inventory (userid, itemname, coinspersecond, value, rarity, gemspersecond) VALUES ($1, $2, $3, $4, $5, $6);',
        [user.id, itemname, coinspersecond, value, rarity, gemspersecond]
      );
      res.status(200).json({ result: 'Request Completed' });
    } else {
      res.status(401).json({ error: 'Could not find account' });
    }

  } catch (error) {
    console.error('Database operation failed:', error.message);
    res.status(500).json({ error: 'Database operation failed', details: error.message });
  } finally {
    client.release(); // Release the client back to the pool
  }
};
