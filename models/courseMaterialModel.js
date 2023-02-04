const mysql = require('../modules/mysql.service');

exports.addCourseMaterial = async (req) => {
    let db_con = await mysql.dbconnect();
    if( db_con )
    {
        return await new Promise((resolve, reject) => 
        {
            let link = (req.body.material_type == 'link') ? req.body.link : ( req.body.material_type == 'video') ? req.body.link: req.body.videolink;
            try{
                const query = "INSERT INTO course_material (course_id, type, link, description) VALUES (?, ?, ?, ?)";
                db_con.query(query, [ req.params.id, req.body.material_type, link, req.body.content ], (err, results) => {

                    db_con.end();
                    if (err) reject(new Error(err.message));

                    resolve('Material added successfully.');
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

exports.getMaterials = async (course_id) => {

    let db_con = await mysql.dbconnect();
    if( db_con )
    {
        return await new Promise((resolve, reject) => 
        {
            try{
                const query = "SELECT * FROM course_material WHERE course_id = ? ";
                db_con.query(query, [ course_id ], (err, results) => 
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

exports.getMaterial = async (id) => {

    let db_con = await mysql.dbconnect();
    if( db_con )
    {
        return await new Promise((resolve, reject) => 
        {
            try{
                const query = "SELECT cm.*, c.course_code, c.name FROM course_material as cm LEFT JOIN courses as c ON cm.course_id=c.id WHERE cm.id = ? ";
                db_con.query(query, [ id ], (err, results) => 
                {
                    db_con.end();
                    if (err) reject(new Error(err.message));
                    if( results && results.length ){
                        resolve(results[0]);
                    } else {
                        resolve({});
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

exports.deleteMaterial = async (id) => {

    let db_con = await mysql.dbconnect();
    if( db_con )
    {
        return await new Promise((resolve, reject) => 
        {
            try{
                const query = "DELETE FROM course_material WHERE id = ? ";
                db_con.query(query, [ id ], (err, results) => 
                {
                    db_con.end();
                    if (err) reject(new Error(err.message));
                    resolve('Material deleted');
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