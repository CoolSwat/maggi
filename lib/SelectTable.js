
//use process.env.PORT=15455;

var mysql      = require('mysql');
var connection;
function _initDB(){
 connection=  mysql.createConnection({
  host     : '198.12.73.13',
  port     : '3306',
  user     : 's_user',
  password : '1q2w3e',
  database  : 'sos'
});
connection.connect(function(err) {
    if(err)
    console.log("Error: "+JSON.stringify(err))
   else
    {
        console.log('connected');
        connection.query('SELECT COUNT(*) FROM products5', function(err, rows, fields) {
              if(err)
               console.log(err)
              else
               console.log(rows)
            });
    
    } 
    
    
  // connected! (unless `err` is set)
});

}
_initDB();