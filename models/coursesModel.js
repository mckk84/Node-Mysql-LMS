const mysql = require('../modules/mysql.service');
const util = require('util');
const bcrypt = require('bcrypt');
const saltRounds = 10;

exports.addCourse = async (req) => {
    let db_con = await mysql.dbconnect();
    if( db_con )
    {
        return await new Promise((resolve, reject) => 
        {
            try{
                const query = "SELECT * FROM courses WHERE email = ? ";
                db_con.query(query, [ req.body.email ], (err, results) => 
                {
                    if (err) reject(new Error(err.message));

                    if( results.length == 0 ) 
                    {
                        encrypt(req.body.password).then(hash => {
                            const query = "INSERT INTO courses (name, email, password, type) VALUES (?, ?, ?, ?)";
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

exports.saveCourse = async (req) => 
{
    let db_con = await mysql.dbconnect();
    if( db_con )
    {
        return await new Promise((resolve, reject) => 
        {
            try{
                const query = "SELECT * FROM courses WHERE course_code = ? ";
                db_con.query(query, [ req.body.course_code ], (err, results) => 
                {
                    if (err) reject(new Error(err.message));

                    if( results.length == 0 ) 
                    {
                        const query = "INSERT INTO courses ( course_code, name, type, description, is_active, created_by ) VALUES (?, ?, ?, ? , ?)";
                        db_con.query(query, [ req.body.course_code, req.body.name, req.body.type, req.body.description, req.body.is_active,req.body.created_by], (err, results) => {

                            db_con.end();
                            if (err) reject(new Error(err.message));

                            resolve('Course added successfully.');
                        });
                    }
                    else
                    {
                        reject(new Error('Course with same code already exists.'));                                          
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

exports.getCourse = async (record_id) => {

    let db_con = await mysql.dbconnect();
    if( db_con )
    {
        return await new Promise((resolve, reject) => 
        {
            try{
                const query = "SELECT crs.*, u.name as instructor FROM courses as crs LEFT JOIN users as u ON crs.created_by=u.id WHERE crs.id = ? ";
                db_con.query(query, [ record_id ], (err, results) => 
                {
                    db_con.end();
                    if (err) reject(new Error(err.message));

                    if( results.length ) 
                    {
                        resolve(results[0]);
                    }
                    else
                    {
                        reject(new Error('Course not found'));                                          
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

exports.updateCourse = async (req) => 
{
    let db_con = await mysql.dbconnect();
    if( db_con )
    {
        return await new Promise((resolve, reject) => 
        {
            try{
                const query = "SELECT * FROM courses WHERE course_code = ? AND id != ? ";
                db_con.query(query, [ req.body.course_code, req.body.id ], (err, results) => 
                {
                    if (err) reject(new Error(err.message));

                    if( results.length == 0 ) 
                    {
                        const query = "UPDATE courses SET course_code=?, name=?, type=?, description=?, created_by=? WHERE id = ? ";
                        db_con.query(query, [ req.body.course_code, req.body.name, req.body.type, req.body.description, req.body.created_by, req.body.id], (err, results) => {

                            db_con.end();
                            if (err) reject(new Error(err.message));

                            resolve('Course updated successfully.');
                        });
                    }
                    else
                    {
                        reject(new Error('Course with same code already exists.'));                                          
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

exports.deleteCourse = async (id) => 
{
    let db_con = await mysql.dbconnect();
    if( db_con )
    {
        return await new Promise((resolve, reject) => 
        {
            try{
                const query = "SELECT * FROM courses WHERE id = ? ";
                db_con.query(query, [ id ], (err, results) => 
                {
                    if (err) reject(new Error(err.message));

                    if( results.length ) 
                    {
                        const query = "DELETE FROM courses WHERE id = ? ";
                        db_con.query(query, [ id], (err, results) => {

                            db_con.end();
                            if (err) reject(new Error(err.message));

                            resolve('Course deleted successfully.');
                        });
                    }
                    else
                    {
                        reject(new Error('Course not found.'));                                          
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

exports.getInstructorCourses = async (user_id) => {

    let db_con = await mysql.dbconnect();
    if( db_con )
    {
        return await new Promise((resolve, reject) => 
        {
            try{
                const query = "SELECT id, course_code, name, type, description, is_active, created_at FROM courses WHERE created_by = ? ";
                db_con.query(query, [ user_id ], (err, results) => 
                {
                    db_con.end();
                    if (err) reject(new Error(err.message));

                    resolve(results);
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

exports.getStudentCourses = async (user_id) => {

    let db_con = await mysql.dbconnect();
    if( db_con )
    {
        return await new Promise((resolve, reject) => 
        {
            try{
                const query = "SELECT crs.id, crs.course_code, crs.name,crs.description,crs.type, crs.is_active as published, u.name as assigned_by, ca.status FROM course_assign as ca LEFT JOIN courses as crs ON ca.course_id=crs.id LEFT JOIN users as u ON ca.assigned_by=u.id WHERE ca.student_id = ? ";
                db_con.query(query, [ user_id ], (err, results) => 
                {
                    db_con.end();
                    if (err) reject(new Error(err.message));

                    resolve(results);
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

exports.getCourses = async () => {

    let db_con = await mysql.dbconnect();
    if( db_con )
    {
        return await new Promise((resolve, reject) => 
        {
            try{
                const query = "SELECT * FROM courses ORDER BY created_at DESC";
                db_con.query(query, (err, results) => 
                {
                    db_con.end();
                    if (err) reject(new Error(err.message));

                    resolve(results);
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