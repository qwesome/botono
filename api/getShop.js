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

    const dropsresult = await client.query(
        'SELECT * FROM dailydrops',
    );
    const drops = dropsresult.rows;

    const shopresult = await client.query(
      'SELECT * FROM dailydrops',
    );
    const shop = shopresult.rows;


    res.status(200).json({dailydrops: drops, shop: shop});

  } catch (error) {
    console.error('Database operation failed:', error.message);
    res.status(500).json({ error: 'Database operation failed', details: error.message });
  } finally {
    client.release();
  }
};
