const mysql = require('../modules/mysql.service');

exports.getStudentCertificatesStatus = async(course_id, student_id) => {
    let db_con = await mysql.dbconnect();
    if( db_con )
    {
        return await new Promise((resolve, reject) => 
        {
            try{
                const query = "SELECT * FROM certificates WHERE student_id = ? AND course_id = ? ";
                db_con.query(query, [ student_id, course_id ], (err, results) => 
                {
                    if (err) reject(new Error(err.message));

                    if( results && results.length == 1 ) 
                    {
                        resolve(results[0].status); 
                    }
                    else
                    {
                        resolve("");                                          
                    }
                });
            }
            catch(err)
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

exports.studentAction = async (req, instructor_id) => 
{
    let db_con = await mysql.dbconnect();
    if( db_con )
    {
        return await new Promise((resolve, reject) => 
        {
            try{
                const query = "SELECT * FROM certificates WHERE student_id = ? AND course_id = ? ";
                db_con.query(query, [ req.body.student, req.body.course ], (err, results) => 
                {
                    if (err) reject(new Error(err.message));

                    if( typeof results == 'undefined' || results.length == 0 ) 
                    {
                        const query = "INSERT INTO certificates (course_id, student_id, instructor_id, status) VALUES (?, ?, ?, ?) ";
                        db_con.query(query, [ req.body.course, req.body.student, instructor_id, req.body.status ], (err, results) => {

                            db_con.end();
                            if (err) reject(new Error(err.message));

                            resolve('Certificate requested');
                        }); 
                    }
                    else
                    {
                        reject(new Error('Already registerd the request.'));                                          
                    }
                });
            }
            catch(err)
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

exports.saveCertificate = async (req) => {
    let db_con = await mysql.dbconnect();
    if( db_con )
    {
        return await new Promise((resolve, reject) => 
        {
            try{
                const query = "UPDATE certificates SET score=?, remarks=?, status = 'Updated' WHERE id = ?";
                db_con.query(query, [ req.body.score, req.body.remarks, req.body.id ], (err, results) => {
                    db_con.end();
                    if (err) reject(new Error(err.message));

                    resolve('Certificates updated successfully.');
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

exports.getCertificates = async (user_id) => {

    let db_con = await mysql.dbconnect();
    if( db_con )
    {
        return await new Promise((resolve, reject) => 
        {
            try{
                const query = "SELECT * FROM certificates ORDER BY id ASC";
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

exports.getCertificate = async (id) => {

    let db_con = await mysql.dbconnect();
    if( db_con )
    {
        return await new Promise((resolve, reject) => 
        {
            try{
                const query = "SELECT * FROM certificates WHERE id = ?";
                db_con.query(query, [ id ], (err, results) => 
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

exports.getInstructorCertificates = async (user_id) => {

    let db_con = await mysql.dbconnect();
    if( db_con )
    {
        return await new Promise((resolve, reject) => 
        {
            try{
                const query = "SELECT crt.id, c.course_code, c.name as course, u.name as student, crt.score, crt.remarks, crt.status FROM certificates as crt LEFT JOIN courses as c on crt.course_id=c.id LEFT JOIN users as u on crt.student_id=u.id WHERE instructor_id = ? ORDER BY id ASC";
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

exports.getStudentCertificates = async (user_id) => {

    let db_con = await mysql.dbconnect();
    if( db_con )
    {
        return await new Promise((resolve, reject) => 
        {
            try{
                const query = "SELECT * FROM certificates WHERE student_id = ? ORDER BY id ASC";
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