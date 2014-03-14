var mysql = require('mysql');

var config = require('./config.js');

module.exports = {
	Connect_To_DB: function(){
		
		var self = this;
		
		var connection_info = {
			  host     : config.database_host,
			  database : config.database_name,
			  user     : config.database_user,
			  password : config.database_password,
			  port : config.database_port,
		};
		
		console.log('Attempting MYSQL connection with : ' + JSON.stringify(connection_info));
		
		self.connection = mysql.createConnection(connection_info);
		
		self.connection.connect();
		
		console.log('Connection complete.');
		
		console.log('Attempting query.');
		
		self.connection.query('SELECT report_name AS solution FROM reports', function(err, rows, fields) {
		  if (err) throw err;
			
			for(key in rows)
			{
				console.log('The solution is: ', rows[key].solution);
			}
			
		  
		  
		});
		
		console.log('Closing connection.');
		
		  
		self.connection.end();
	},
};