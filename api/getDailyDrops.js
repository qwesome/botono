const { Pool } = require('pg');

// Create a new pool instance
const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

module.exports = async (req, res) => {

  const client = await pool.connect();

  try {

    if (result.rows.length > 0) {
      const result = await client.query(
        'SELECT * FROM dailydrops',
      );
      const drops = inventory.rows;
      res.status(200).json({ drops });
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
