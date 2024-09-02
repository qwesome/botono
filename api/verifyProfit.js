
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
  ssl: {
    rejectUnauthorized: false
  }
});



module.exports = async (req, res) => {

  const { userName, passWord, coinsEarned, gemsEarned, clicks} = req.body

  const client = await pool.connect();

  try {

    const userRasult = await client.query(
        'SELECT * FROM user_data WHERE username = $1',
        [userName]
    );

    user = userRasult.rows[0];

    if (user != null) {
        if (passWord == user.password) {

            const now = new Date();

            const timeNow = (0 + now.getTime());

            const lastPing = user.lastping;
            const timeSinceLastPing = (now.getTime() - lastPing);
            let secondsSinceLastPing = 0;
            
            if (timeSinceLastPing > 15000) {
              secondsSinceLastPing = (15);
            }else {
              secondsSinceLastPing = (Math.round(timeSinceLastPing / 1000) + 2);
            }

            if (user.lastPing === 0) {

            }

            await client.query(
              'UPDATE user_data SET lastping = $1 WHERE id = $2',
              [timeNow, user.id]
            );

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

            const estCoinsEarned = (Math.round(estCoinsPerSecond * secondsSinceLastPing));
            const estGemsEarned = (Math.round(estGemsPerSecond * secondsSinceLastPing));


            if (coinsEarned <= estCoinsEarned && gemsEarned <= estGemsEarned && clicks < (20 * secondsSinceLastPing)) {

                await client.query(
                    'UPDATE user_data SET coins = $1, gems = $2 WHERE id = $3',
                    [(parseInt(user.coins) + coinsEarned + clicks),(parseInt(user.gems) + gemsEarned), parseInt(user.id)]
                );


                res.status(200).json({ result: 'Earnings Verifyed', addedcoins: coinsEarned, addedgems: estGemsEarned, v: 1, clicks: clicks});
            }else {

                await client.query(
                    'UPDATE user_data SET coins = $1, gems = $2 WHERE id = $3',
                    [parseInt(user.coins) + estCoinsEarned, parseInt(user.gems) + estGemsEarned, parseInt(user.id)]
                );
                
                res.status(201).json({ result: 'Earnings Not Verifyeble, Added estemated earnings', addedcoins: coinsEarned, addedgems: estGemsEarned, v: 0});
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
