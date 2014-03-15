var mysql = require('mysql');

var config = require('./config.js');

module.exports = {
	Connect: function(){
		
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
		
	},
	Close: function(){
		
		console.log('Closing connection.');
		
		self.connection.end();
		
	},
	Select: function(table, columns, where, extra, callback){
		
		var self = this;
		
		console.log('Attempting query.');
		
		sql = 'SELECT ';
		
		var columns_to_join = [];
		
		for(key in columns)
		{
			columns_to_join.push(columns[key] + " AS `" + key + '`');
		}
		
		sql += columns_to_join.join(', ');
		
		sql += ' FROM ' + table + "";
		sql += ' WHERE (' + where + ')';
		sql += ' ' + extra	;
		
		console.log(sql);
		
		self.connection.query(sql, function(err, rows, fields) {

			if (err)
			{
				throw err;
			}
			
			for (key in rows) {
				
				console.log('rows[' + key + '].task_log_id = ', rows[key].task_log_id);
			}
			
			callback(rows);
		});
		
	},
	Insert: function(table, value_lookup){
		
		var self = this;
		
	},
	Update: function(table, value_lookup, where){
		
		var self = this;
		
	},
	Delete: function(table, where){
		
		var self = this;
		
	},
	
};