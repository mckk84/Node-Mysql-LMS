const mysql = require('../modules/mysql.service');
const lessonsModel = require('../models/lessonsModel');

exports.courseAssigned = async(student_id) => {
    let db_con = await mysql.dbconnect();
    if( db_con )
    {
        return await new Promise((resolve, reject) => 
        {
            try{
                const query = "SELECT * FROM course_assign WHERE student_id = ? AND status = 'Assigned' ";
                db_con.query(query, [ student_id ], (err, results) => 
                {
                    if (err) reject(new Error(err.message));

                    resolve(results.length);
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

exports.getCourseAssigned = async(student_id, course_id) => {
    let db_con = await mysql.dbconnect();
    if( db_con )
    {
        return await new Promise((resolve, reject) => 
        {
            try{
                const query = "SELECT * FROM course_assign WHERE student_id = ? AND course_id = ? ";
                db_con.query(query, [ student_id, course_id ], (err, results) => 
                {
                    if (err) reject(new Error(err.message));

                    resolve(results[0]);
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

exports.courseAccepted = async(student_id) => {
    let db_con = await mysql.dbconnect();
    if( db_con )
    {
        return await new Promise((resolve, reject) => 
        {
            try{
                const query = "SELECT * FROM course_assign WHERE student_id = ? AND status = 'Accepted' ";
                db_con.query(query, [ student_id ], (err, results) => 
                {
                    if (err) reject(new Error(err.message));

                    resolve(results.length);
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

exports.actionCourse = async(req) => 
{
    let db_con = await mysql.dbconnect();
    if( db_con )
    {
        return await new Promise((resolve, reject) => 
        {
            try{
                if( req.body.status == "" )
                {
                    const query = "SELECT status FROM course_assign WHERE student_id = ? AND course_id = ? ";
                    db_con.query(query, [ req.body.student, req.body.course ], (err, results) => 
                    {
                        if (err) reject(new Error(err.message));

                        resolve(results[0].status);
                    });                    
                }
                else
                {
                    if( req.body.status == 'Completed' )
                    {
                        // check all lessons are read
                        lessonsModel.getLessons(req.body.course).then(lessonsInCourse => 
                        {
                            lessonsModel.StudentLessonCompleted(req.body.course, req.body.student).then(lessonsCompleted => {

                                if( lessonsInCourse.length == lessonsCompleted.length )
                                {
                                    const query = "UPDATE course_assign SET status=? WHERE student_id = ? AND course_id = ? ";
                                    db_con.query(query, [ req.body.status, req.body.student, req.body.course ], (err, results) => 
                                    {
                                        if (err) reject(new Error(err.message));

                                        resolve(req.body.status);
                                    });    
                                }
                                else
                                {
                                    reject(new Error('Please read all lessons from the Course.'));   
                                }         
                            }).catch(err => {
                                reject(new Error(err.message));
                            }); 
                        }).catch(err => {
                            reject(new Error(err.message));
                        });
                    }
                    else
                    {
                        const query = "UPDATE course_assign SET status=? WHERE student_id = ? AND course_id = ? ";
                        db_con.query(query, [ req.body.status, req.body.student, req.body.course ], (err, results) => 
                        {
                            if (err) reject(new Error(err.message));

                            resolve(req.body.status);
                        });
                    }
                }
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

exports.courseCompleted = async(student_id) => {
    let db_con = await mysql.dbconnect();
    if( db_con )
    {
        return await new Promise((resolve, reject) => 
        {
            try{
                const query = "SELECT * FROM course_assign WHERE student_id = ? AND status = 'Completed' ";
                db_con.query(query, [ student_id ], (err, results) => 
                {
                    if (err) reject(new Error(err.message));

                    resolve(results.length);
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

exports.assignCourse = async (req) => {
    let db_con = await mysql.dbconnect();
    if( db_con )
    {
        return await new Promise((resolve, reject) => 
        {
            try{
                const query = "SELECT * FROM course_assign WHERE course_id = ? AND student_id = ? ";
                db_con.query(query, [ req.body.course_id, req.body.student_id ], (err, results) => 
                {
                    if (err) reject(new Error(err.message));

                    if( results.length == 0 ) 
                    {
                        const query = "INSERT INTO course_assign (course_id, student_id, assigned_by, notes) VALUES (?, ?, ?, ?)";
                        db_con.query(query, [ req.body.course_id, req.body.student_id, req.body.assigned_by, req.body.notes ], (err, results) => {

                            db_con.end();
                            if (err) reject(new Error(err.message));

                            resolve('Student has been assigned the Course.');
                        }); 
                    }
                    else
                    {
                        reject(new Error('Course already assigned.'));                                          
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

exports.getStudentsAssignedCourse = async (record_id) => {
    let db_con = await mysql.dbconnect();
    if( db_con )
    {
        return await new Promise((resolve, reject) => 
        {
            try{
                const query = "SELECT ca.id, u.name, ca.created_at, ca.status FROM course_assign as ca LEFT JOIN users as u ON ca.student_id=u.id WHERE ca.course_id = ? ";
                db_con.query(query, [ record_id ], (err, results) => 
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

exports.getStudentsAssignedCourseStatus = async (course_id, student_id) => {
    let db_con = await mysql.dbconnect();
    if( db_con )
    {
        return await new Promise((resolve, reject) => 
        {
            try{
                const query = "SELECT ca.status FROM course_assign as ca LEFT JOIN users as u ON ca.student_id=u.id WHERE ca.course_id = ? AND ca.student_id=? ";
                db_con.query(query, [ course_id, student_id ], (err, results) => 
                {
                    db_con.end();
                    if (err) reject(new Error(err.message));

                    resolve(results[0].status);
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

exports.getAssignedCourses = async (record_id) => {

    let db_con = await mysql.dbconnect();
    if( db_con )
    {
        return await new Promise((resolve, reject) => 
        {
            try{
                const query = "SELECT ca.*, u.name as instructor FROM course_assign as ca LEFT JOIN users as u ON ca.assigned_by=u.id WHERE ca.id = ? ";
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

exports.removeAssignCourse = async (id) => 
{
    let db_con = await mysql.dbconnect();
    if( db_con )
    {
        return await new Promise((resolve, reject) => 
        {
            try{
                const query = "SELECT * FROM course_assign WHERE id = ? ";
                db_con.query(query, [ id ], (err, results) => 
                {
                    if (err) reject(new Error(err.message));

                    if( results.length ) 
                    {
                        const query = "DELETE FROM course_assign WHERE id = ? ";
                        db_con.query(query, [ id], (err, results) => {

                            db_con.end();
                            if (err) reject(new Error(err.message));

                            resolve('Course assignment deleted successfully.');
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
