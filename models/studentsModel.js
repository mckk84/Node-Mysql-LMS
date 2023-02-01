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

exports.addStudent = async (req) => {
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

                                resolve('Student added successfully.');
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

exports.saveStudent = async (req) => 
{
    let created_by = req.session.user.id;
    let db_con = await mysql.dbconnect();
    if( db_con )
    {
        return await new Promise((resolve, reject) => 
        {
            try{
                const query = "SELECT * FROM users WHERE email = ? AND type = 'Student' ";
                db_con.query(query, [ req.body.email ], (err, results) => 
                {
                    if (err) reject(new Error(err.message));

                    if( results.length == 0 ) 
                    {
                        encrypt(req.body.password).then(hash => 
                        {
                            const query = "INSERT INTO users (name, email, password, type, created_by ) VALUES(?, ?, ?, ?, ?)";
                            db_con.query(query, [ req.body.name, req.body.email, hash, 'Student', created_by ], (err, results) => 
                            {
                                db_con.end();
                                if (err) reject(new Error(err.message));

                                resolve('Student added successfully.');
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

exports.getStudent = async (user_id) => {

    let db_con = await mysql.dbconnect();
    if( db_con )
    {
        return await new Promise((resolve, reject) => 
        {
            try{
                const query = "SELECT * FROM users WHERE type = 'Student' AND id = ? ";
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
                        reject(new Error('Student not found'));                                          
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

exports.getStudents = async () => {

    let db_con = await mysql.dbconnect();
    if( db_con )
    {
        return await new Promise((resolve, reject) => 
        {
            try{
                const query = "SELECT u.id, u.name, u.email, u.mobile, u.dob, u.is_active, u.created_by, creator.name as created_by FROM users as u LEFT JOIN users as creator ON u.created_by=creator.id WHERE u.type = 'Student' ";
                db_con.query(query, (err, results) => 
                {
                    db_con.end();
                    if (err) reject(new Error(err.message));

                    if( results.length ) 
                    {
                        resolve(results);
                    }
                    else
                    {
                        reject(new Error('Students not found'));                                          
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

exports.updateStudent = async (req) => 
{
    let db_con = await mysql.dbconnect();
    if( db_con )
    {
        return await new Promise((resolve, reject) => 
        {
            try{
                const query = "SELECT * FROM users WHERE type='Student' AND email = ? AND id != ? ";
                db_con.query(query, [ req.body.email, req.body.id ], (err, results) => 
                {
                    if (err) reject(new Error(err.message));

                    if( results.length == 0 ) 
                    {
                        const query = "UPDATE users SET name=?, email=? WHERE id = ? ";
                        db_con.query(query, [ req.body.name, req.body.email, req.body.id], (err, results) => {

                            db_con.end();
                            if (err) reject(new Error(err.message));

                            resolve('Student updated successfully.');
                        });
                    }
                    else
                    {
                        reject(new Error('Student with email already exists.'));                                          
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

exports.deleteStudent = async (id) => 
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

                            resolve('Student deleted successfully.');
                        });
                    }
                    else
                    {
                        reject(new Error('Student not found.'));                                          
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