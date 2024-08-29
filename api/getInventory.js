const { Pool } = require('pg');

// Create a new pool instance
const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

module.exports = async (req, res) => {
  const { userName } = req.body;

  const client = await pool.connect();

  try {
    const result = await client.query(
      'SELECT * FROM user_data WHERE username = $1',
      [userName]
    );

    const user = result.rows[0];

    if (result.rows.length > 0) {
      const inventory = await client.query(
        'SELECT * FROM inventory WHERE userid = $1',
        [user.id]
      );
      const userInventory = inventory.rows;
      res.status(200).json({ userInventory });
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
