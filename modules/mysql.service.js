const mysql = require("mysql");

class mysqlservice 
{
    async dbconnect()
    {
        let db_con  = await mysql.createConnection({
            host: process.env.HOST,
            user: process.env.USER,
            password: process.env.PASSWORD,
            database: process.env.DB,
            port: process.env.PORT
        });
        try
        {
            return await new Promise((resolve, reject) => {
                db_con.connect(err => {
                    return err ? reject(err) : resolve(db_con);
                });
            })
        }
        catch(err)
        {
            return Promise.reject(new Error('Connection failed.'));
        } 
    }
}
  
module.exports = new mysqlservice;