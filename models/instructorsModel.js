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

exports.addInstructor = async (req) => {
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

                    if( results.length == 0 ) 
                    {
                        encrypt(req.body.password).then(hash => {
                            const query = "INSERT INTO users (name, email, password, type) VALUES (?, ?, ?, ?)";
                            db_con.query(query, [ req.body.name, req.body.email, hash, req.body.type ], (err, results) => {

                                db_con.end();
                                if (err) reject(new Error(err.message));

                                resolve('Instructor added successfully.');
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

exports.saveInstructor = async (req) => 
{
    let created_by = req.session.user.id;
    let db_con = await mysql.dbconnect();
    if( db_con )
    {
        return await new Promise((resolve, reject) => 
        {
            try{
                const query = "SELECT * FROM users WHERE email = ? AND type = 'Instructor' ";
                db_con.query(query, [ req.body.email ], (err, results) => 
                {
                    if (err) reject(new Error(err.message));

                    if( results.length == 0 ) 
                    {
                        encrypt(req.body.password).then(hash => 
                        {
                            const query = "INSERT INTO users (name, email, password, type, created_by ) VALUES(?, ?, ?, ?, ?)";
                            db_con.query(query, [ req.body.name, req.body.email, hash, 'Instructor', created_by ], (err, results) => 
                            {
                                db_con.end();
                                if (err) reject(new Error(err.message));

                                resolve('Instructor added successfully.');
                            });
                        }).catch(err => 
                        {
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

exports.getInstructor = async (user_id) => {

    let db_con = await mysql.dbconnect();
    if( db_con )
    {
        return await new Promise((resolve, reject) => 
        {
            try{
                const query = "SELECT * FROM users WHERE type = 'Instructor' AND id = ? ";
                db_con.query(query, [ user_id ], (err, results) => 
                {
                    db_con.end();
                    if (err) reject(new Error(err.message));

                    if( results.length ) 
                    {
                        resolve(results[0]);
                    }
                    else
                    {
                        reject(new Error('Instructor not found'));                                          
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

exports.getInstructors = async () => {

    let db_con = await mysql.dbconnect();
    if( db_con )
    {
        return await new Promise((resolve, reject) => 
        {
            try{
                const query = "SELECT id, name, email, mobile, is_active FROM users WHERE type = 'Instructor' ";
                db_con.query(query, (err, results) => 
                {
                    db_con.end();
                    if (err) reject(new Error(err.message));
                    resolve(results);
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

exports.updateInstructor = async (req) => 
{
    let db_con = await mysql.dbconnect();
    if( db_con )
    {
        return await new Promise((resolve, reject) => 
        {
            try{
                const query = "SELECT * FROM users WHERE type='Instructor' AND email = ? AND id != ? ";
                db_con.query(query, [ req.body.email, req.body.id ], (err, results) => 
                {
                    if (err) reject(new Error(err.message));

                    if( results.length == 0 ) 
                    {
                        const query = "UPDATE users SET name=?, email=? WHERE id = ? ";
                        db_con.query(query, [ req.body.name, req.body.email, req.body.id], (err, results) => {

                            db_con.end();
                            if (err) reject(new Error(err.message));

                            resolve('Instructor updated successfully.');
                        });
                    }
                    else
                    {
                        reject(new Error('Instructor with email already exists.'));                                          
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

exports.deleteInstructor = async (id) => 
{
    let db_con = await mysql.dbconnect();
    if( db_con )
    {
        return await new Promise((resolve, reject) => 
        {
            try{
                const query = "SELECT * FROM users WHERE id = ? ";
                db_con.query(query, [ id ], (err, results) => 
                {
                    if (err) reject(new Error(err.message));

                    if( results.length ) 
                    {
                        const query = "DELETE FROM users WHERE id = ? ";
                        db_con.query(query, [ id], (err, results) => {

                            db_con.end();
                            if (err) reject(new Error(err.message));

                            resolve('Instructor deleted successfully.');
                        });
                    }
                    else
                    {
                        reject(new Error('Instructor not found.'));                                          
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