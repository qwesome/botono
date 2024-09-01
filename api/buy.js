const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

module.exports = async (req, res) => {

    const { userName, passWord, itemid, location } = req.body

  const client = await pool.connect();

  try {

    const userRasult = await client.query(
        'SELECT * FROM user_data WHERE username = $1',
        [userName]
    );

    user = userRasult.rows[0];

    if (user != null) {
        if (passWord == user.password) {

            if (location == 0) { // normal shop
                const itemResult = await client.query(
                    'SELECT * FROM shop WHERE itemid = $1',
                    [itemid]
                );

                item = itemResult.rows[0];

                if (user.coins >= item.cost) {
                    await client.query(
                        'UPDATE user_data SET coins = $2 WHERE username = $1',
                        [user.username, (user.coins - item.cost)]
                    );
                    await client.query(
                        'INSERT INTO inventory (userid, itemname, coinspersecond, value, rarity, gemspersecond) VALUES ($1, $2, $3, $4, $5, $6)',
                        [user.id, item.itemname, item.coinspersecond, item.cost, item.rarity, item.gemspersecond]
                    );
                    res.status(200).json({ error: 'Request completed!'});
                }else {
                    res.status(406).json({ error: 'Not enough coins'});
                }


            }else if (location == 1) { // daily shop

                const itemResult = await client.query(
                    'SELECT * FROM dailydrops WHERE itemid = $1',
                    [itemid]
                );

                item = itemResult.rows[0];

                if (user.coins >= item.price) {
                    await client.query(
                        'UPDATE user_data SET coins = $2 WHERE username = $1',
                        [user.username, (user.coins - item.price)]
                    );
                    await client.query(
                        'INSERT INTO inventory (userid, itemname, coinspersecond, value, rarity, gemspersecond) VALUES ($1, $2, $3, $4, $5, $6)',
                        [user.id, item.itemname, item.coinspersecond, item.price, item.rarity, item.gemspersecond]
                    );
                    res.status(200).json({ error: 'Request completed!'});
                }else {
                    res.status(406).json({ error: 'Not enough coins'});
                }


            }else if (location == 2) { // ah

            }else {
                res.status(403).json({ error: 'Item location not valid'});
            }




        }else {
            res.status(401).json({ error: 'Password Invalid'});
        }
    }else {
        res.status(402).json({ error: 'User Not found'});
    }

  } catch (error) {
    console.error('Database operation failed:', error.message);
    res.status(500).json({ error: 'Database operation failed', details: error.message });
  } finally {
    client.release();
  }
};
