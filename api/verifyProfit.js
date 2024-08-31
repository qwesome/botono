const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

const now = new Date();

module.exports = async (req, res) => {

    const { userName, passWord, coinsEarned, gemsEarned} = req.body

  const client = await pool.connect();

  try {

    const userRasult = await client.query(
        'SELECT * FROM user_data WHERE username = $1',
        [userName]
    );

    user = userRasult.rows[0];

    if (user != null) {
        if (passWord == user.password) {


            const lastPing = new Date(user.lastPing).getTime();
            const timeSinceLastPing = (now.getTime() - lastPing);
            const secondsSinceLastPing = timeSinceLastPing / 1000;


            const userInventory = (await client.query(
                'SELECT * FROM inventory WHERE userid = $1',
                [user.id]
            ));

            let estCoinsPerSecond = 0;
            let estGemsPerSecond = 0;

            userInventory.forEach(item => {
                estCoinsPerSecond = estCoinsPerSecond + item.coinspersecond;
                estGemsPerSecond = estGemsPerSecond + item.gemspersecond;
            });

            const estCoinsEarned = (estCoinsPerSecond + 10) * (secondsSinceLastPing + 2);
            const estGemsEarned = (estGemsPerSecond) * (secondsSinceLastPing + 2);

            if (coinsEarned <= estCoinsEarned && gemsEarned <= estGemsEarned) {

                await client.query(
                    'UPDATE user_data SET coins = $1, gems = $2',
                    [user.coins + coinsEarned, user.gems + gemsEarned]
                );


                res.status(200).json({ result: 'Earnings Verifyed'});
            }else {

                await client.query(
                    'UPDATE user_data SET coins = $1, gems = $2',
                    [user.coins + estCoinsEarned, user.gems + estGemsEarned]
                );
                
                res.status(201).json({ result: 'Earnings Not Verifyeble, Added estemated earnings'});
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
