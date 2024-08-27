const { Client } = require('pg');

const client = new Client({
  connectionString: process.env.POSTGRES_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

module.exports = async (req, res) => {
  const { name, email } = req.body;

  try {
    await client.connect();
    const result = await client.query(
      'INSERT INTO your_table (name, email) VALUES ($1, $2) RETURNING *',
      [name, email]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Database insert failed', details: error.message });
  } finally {
    await client.end();
  }
};
