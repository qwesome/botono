const { Client } = require('pg');

const client = new Client({
  connectionString: process.env.POSTGRES_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

module.exports = async (req, res) => {
  try {
    await client.connect();
    const result = await client.query('SELECT * FROM your_table'); // Replace 'your_table' with your actual table name
    res.status(200).json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Database query failed', details: error.message });
  } finally {
    await client.end();
  }
};
