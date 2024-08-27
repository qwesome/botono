const { Client } = require('pg');

// Create a new PostgreSQL client
const client = new Client({
  connectionString: process.env.POSTGRES_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

module.exports = async (req, res) => {
  // Destructure username and password from the request body
  const { userName, passWord } = req.body;

  // Basic validation
  if (!userName || !passWord) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  try {
    // Connect to the PostgreSQL database
    await client.connect();

    // Insert user data into the database
    const result = await client.query(
      'INSERT INTO user_data (username, password, coins, gems) VALUES ($1, $2, $3, $4) RETURNING *',
      [userName, passWord, 100, 25] // Default coins and gems values
    );

    // Respond with the newly created user data
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Database insert failed:', error.message);
    res.status(500).json({ error: 'Database insert failed', details: error.message });
  } finally {
    // Close the database connection
    await client.end();
  }
};
