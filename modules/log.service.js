const fs = require('fs');
const logfile = __dirname+"/../assets/login.json";

class logservice 
{
    getJson()
    {
        let tempJsonString = fs.readFileSync(logfile, 'utf8');
        if( tempJsonString )
        {
            if( tempJsonString !== false )
            {
                let tempJson = {};
                try{
                    tempJson = JSON.parse(tempJsonString);
                }
                catch(e)
                {
                    //
                }
                return tempJson;
            }
        }
        else
        {
            return false;
        }
    }

    setJson(data)
    {
        return fs.writeFileSync(logfile, JSON.stringify(data));
    }
}
  
module.exports = new logservice;