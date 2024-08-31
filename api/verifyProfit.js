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
            const secondsSinceLastPing = Math.round(timeSinceLastPing / 1000) + 2;


            const userInventoryResult = (await client.query(
                'SELECT * FROM inventory WHERE userid = $1',
                [user.id]
            ));


            const userInventory = userInventoryResult.rows;

            let estCoinsPerSecond = 0;
            let estGemsPerSecond = 0;

            userInventory.forEach(item => {
                estCoinsPerSecond = estCoinsPerSecond + item.coinspersecond + 10;
                estGemsPerSecond = estGemsPerSecond + item.gemspersecond + 10;
            });

            const estCoinsEarned = Math.round(estCoinsPerSecond * secondsSinceLastPing);
            const estGemsEarned = Math.round(estGemsPerSecond * secondsSinceLastPing);


            if (coinsEarned <= estCoinsEarned && gemsEarned <= estGemsEarned) {

                await client.query(
                    'UPDATE user_data SET coins = $1, gems = $2 WHERE id = $3',
                    [(user.coins + coinsEarned),(user.gems + gemsEarned), user.id]
                );


                res.status(200).json({ result: 'Earnings Verifyed'});
            }else {

                await client.query(
                    'UPDATE user_data SET coins = $1, gems = $2 WHERE id = $3',
                    [user.coins + estCoinsEarned, user.gems + estGemsEarned, user.id]
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
