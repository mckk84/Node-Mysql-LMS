const mysql = require('../modules/mysql.service');
const util = require('util');
const bcrypt = require('bcrypt');
const saltRounds = 10;

async function encrypt(password) 
{
    return await new Promise((resolve, reject) => {
        bcrypt
          .genSalt(saltRounds)
          .then(salt => {
            console.log('Salt: ', salt)
            return bcrypt.hash(password, salt)
          })
          .then(hash => {
            console.log('Hash: ', hash);
            resolve(hash);
          })
          .catch(err => {
            console.error(err.message);
            reject(new Error(err.message))
          })
    })
}

exports.authenticate = async (req) => {

    let db_con = await mysql.dbconnect();
    if( db_con )
    {
        return await new Promise((resolve, reject) => 
        {
            try{
                const query = "SELECT * FROM users WHERE email = ? ";
                db_con.query(query, [ req.body.email ], (err, results) => 
                {
                    db_con.end();
                    if (err) reject(new Error(err.message));

                    if( results && results.length ) 
                    {
                        bcrypt.compare(req.body.password, results[0].password, function (err, result) {
                            if (result == true) 
                            {
                                delete results[0].password;
                                resolve(results[0]);
                            } 
                            else 
                            {
                                reject(new Error("Password is incorrect.")); 
                            }
                        });
                    }
                    else
                    {
                        reject(new Error('Email not registerd.'));                                          
                    }
                });
            }
            catch(err)
            {
                reject(new Error(err.message));
            }
        });
    }
    else
    {
        return Promise.reject(new Error('Could not connect to database.'));
    }
}

exports.addUser = async (req) => {
    let db_con = await mysql.dbconnect();
    if( db_con )
    {
        return await new Promise((resolve, reject) => 
        {
            try{
                const query = "SELECT * FROM users WHERE email = ? ";
                db_con.query(query, [ req.body.email ], (err, results) => 
                {
                    if (err) reject(new Error(err.message));

                    if( results && results.length == 0 ) 
                    {
                        encrypt(req.body.password).then(hash => {
                            const query = "INSERT INTO users (name, email, password, type) VALUES (?, ?, ?, ?)";
                            db_con.query(query, [ req.body.name, req.body.email, hash, req.body.type ], (err, results) => {

                                db_con.end();
                                if (err) reject(new Error(err.message));

                                resolve('User added successfully.');
                            });

                        }).catch(err => {
                            console.log(err);
                            db_con.end();
                            reject(new Error('Password hash failed'))
                        }); 
                    }
                    else
                    {
                        reject(new Error('Email already registerd.'));                                          
                    }
                });
            }catch(err)
            {
                reject(new Error(err.message))
            }
        });
    }
    else
    {
        return Promise.reject(new Error('Could not connect to database.'));
    }
}

exports.saveUser = async (req) => {
    let db_con = await mysql.dbconnect();
    if( db_con )
    {
        return await new Promise((resolve, reject) => 
        {
            try{
                const query = "SELECT * FROM users WHERE email = ? AND id != ? ";
                db_con.query(query, [ req.body.email, req.body.account_id ], (err, results) => 
                {
                    if (err) reject(new Error(err.message));

                    if( results && results.length == 0 ) 
                    {
                        const query = "UPDATE users SET name=?, email=?, mobile=?, dob=? WHERE id = ?";
                        db_con.query(query, [ req.body.name, req.body.email, req.body.mobile, req.body.dob, req.body.account_id ], (err, results) => {

                            db_con.end();
                            if (err) reject(new Error(err.message));

                            resolve('Account updated successfully.');
                        });
                    }
                    else
                    {
                        reject(new Error('Email already registerd.'));                                          
                    }
                });
            }catch(err){
                reject(new Error(err.message));
            }
        });
    }
    else
    {
        return Promise.reject(new Error('Could not connect to database.'));
    }
}

exports.getUser = async (user_id) => {

    let db_con = await mysql.dbconnect();
    if( db_con )
    {
        return await new Promise((resolve, reject) => 
        {
            try{
                const query = "SELECT * FROM users WHERE id = ? ";
                db_con.query(query, [ user_id ], (err, results) => 
                {
                    db_con.end();
                    if (err) reject(new Error(err.message));

                    if( results && results.length ) 
                    {
                        resolve(results[0]);
                    }
                    else
                    {
                        reject(new Error('User not found'));                                          
                    }
                });
            }catch(err){
                reject(new Error(err.message));
            }
        });
    }
    else
    {
        return Promise.reject(new Error('Could not connect to database.'));
    }
}

exports.updatePassword = async (req) => 
{
    let db_con = await mysql.dbconnect();
    if( db_con )
    {
        return await new Promise((resolve, reject) => 
        {
            try{
                const query = "SELECT * FROM users WHERE id = ? ";
                db_con.query(query, [ req.body.account_id ], (err, results) => 
                {
                    if (err) reject(new Error(err.message));

                    if( results && results.length ) 
                    {
                        bcrypt.compare(req.body.current_password, results[0].password, function (err, result) 
                        {
                            if( result == true ) 
                            {
                                encrypt(req.body.new_password).then(hash => 
                                {
                                    const query = "UPDATE users SET password = ? WHERE id = ? ";
                                    db_con.query(query, [ hash, req.body.account_id ], (err, results) => {

                                        db_con.end();
                                        if (err) reject(new Error(err.message));

                                        resolve('Password updated successfully.');
                                    });

                                }).catch(err => {
                                    console.log(err);
                                    db_con.end();
                                    reject(new Error('Password hash failed'))
                                });
                            } 
                            else 
                            {
                                reject(new Error("Current password is incorrect.")); 
                            }
                        });
                    }
                    else
                    {
                        reject(new Error('Account not found'));                                          
                    }
                });
            }catch(err){
                reject(new Error(err.message));
            }
        });
    }
    else
    {
        return Promise.reject(new Error('Could not connect to database.'));
    }
}