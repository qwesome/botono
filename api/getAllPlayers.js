const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

module.exports = async (req, res) => {

  const client = await pool.connect();

  try {

    const result = await client.query(
        'SELECT username, coins FROM user_data',
      );
      const players = result.rows;
      res.status(200).json({ players });

  } catch (error) {
    console.error('Database operation failed:', error.message);
    res.status(500).json({ error: 'Database operation failed', details: error.message });
  } finally {
    client.release();
  }
};
