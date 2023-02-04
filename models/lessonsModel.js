const mysql = require('../modules/mysql.service');

exports.saveLesson = async (req) => 
{
    let db_con = await mysql.dbconnect();
    if( db_con )
    {
        return await new Promise((resolve, reject) => 
        {
            try{
                const query = "INSERT INTO lessons ( course_id, name, description ) VALUES (?, ?, ?)";
                db_con.query(query, [ req.params.course_id, req.body.name, req.body.description], (err, results) => {

                    db_con.end();
                    if (err) reject(new Error(err.message));

                    resolve('Course added successfully.');
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

exports.getCourseofLesson = async (lession_id, student_id) => {

    let db_con = await mysql.dbconnect();
    if( db_con )
    {
        return await new Promise((resolve, reject) => 
        {
            try{
                const query = "SELECT crs.*, ca.status, u.name as instructor FROM lessons as l LEFT JOIN courses as crs ON crs.id=l.course_id LEFT JOIN course_assign as ca ON ca.course_id=crs.id LEFT JOIN users as u ON ca.assigned_by=u.id WHERE ca.student_id = ? AND l.id = ? ";
                db_con.query(query, [ student_id, lession_id ], (err, results) => 
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

exports.getLessons = async (course_id) => {

    let db_con = await mysql.dbconnect();
    if( db_con )
    {
        return await new Promise((resolve, reject) => 
        {
            try{
                const query = "SELECT * FROM lessons WHERE course_id = ? ORDER BY id ASC";
                db_con.query(query, [ course_id ], (err, results) => 
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

exports.getStudentLessons = async (course_id, student_id) => {

    let db_con = await mysql.dbconnect();
    if( db_con )
    {
        return await new Promise((resolve, reject) => 
        {
            try{
                const query = "SELECT * FROM student_lesson_status WHERE course_id = ? AND student_id = ? ORDER BY id ASC";
                db_con.query(query, [ course_id, student_id ], (err, results) => 
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

exports.getLesson = async (course_id, lession_id) => {

    let db_con = await mysql.dbconnect();
    if( db_con )
    {
        return await new Promise((resolve, reject) => 
        {
            try{
                const query = "SELECT * FROM lessons WHERE course_id = ? AND id = ? ";
                db_con.query(query, [ course_id, lession_id ], (err, results) => 
                {
                    db_con.end();
                    if (err) reject(new Error(err.message));

                    resolve(results[0]);
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

exports.getLessonById = async (lession_id) => {

    let db_con = await mysql.dbconnect();
    if( db_con )
    {
        return await new Promise((resolve, reject) => 
        {
            try{
                const query = "SELECT * FROM lessons WHERE id = ? ";
                db_con.query(query, [ lession_id ], (err, results) => 
                {
                    db_con.end();
                    if (err) reject(new Error(err.message));

                    resolve(results[0]);
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

exports.lessonCompleted = async(course_id,lesson_id,student_id, status) => {

    let db_con = await mysql.dbconnect();
    if( db_con )
    {
        return await new Promise((resolve, reject) => 
        {
            try{
                const query = "INSERT INTO student_lesson_status (course_id, lesson_id, student_id, status) VALUES (?, ?, ?, ?) ";
                db_con.query(query, [ course_id, lesson_id, student_id, status], (err, results) => 
                {
                    db_con.end();
                    if (err) reject(new Error(err.message));

                    resolve(status);
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

exports.StudentLessonCompleted = async(course_id,lesson_id,student_id) => {

    let db_con = await mysql.dbconnect();
    if( db_con )
    {
        return await new Promise((resolve, reject) => 
        {
            try{
                const query = "SELECT * FROM student_lesson_status WHERE course_id = ? AND lesson_id = ? AND student_id = ? AND status ='Completed' ";
                db_con.query(query, [ course_id, lesson_id, student_id], (err, results) => 
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
