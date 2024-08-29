const { Client } = require('pg');

const client = new Client({
  connectionString: process.env.POSTGRES_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

module.exports = async (req, res) => {
  const { userName, passWord, coins, gems} = req.body;

  if (!userName || !passWord) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  try {
    await client.connect();

    const result = await client.query(
      'SELECT * FROM user_data WHERE username = $1 AND password = $2',
      [userName, passWord]
    );

    if (result.rows.length > 0) {
      await client.query(
        'UPDATE user_data SET coins = $3, gems = $4 WHERE username = $1 AND password = $2'
        [userName, passWord, coins, gems]
      );
      res.status(200).json({ result: 'Request Completed'});
    } else {
      res.status(401).json({ error: 'Could not find account'});
    }
  

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Database insert failed:', error.message);
    res.status(500).json({ error: 'Database insert failed', details: error.message });
  } finally {
    await client.end();
  }
};
