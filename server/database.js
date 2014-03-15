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
		
		self.connection = mysql.createConnection(connection_info);
		
		self.connection.connect();
		
	},
	Close: function(){
		
		var self = this;
		
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
			
			callback(rows);
		});
		
	},
	Insert: function(table, value_lookup, callback){
		
		var self = this;
		
	},
	Update: function(table, value_lookup, where, callback){
		
		var self = this;
		
	},
	Delete: function(table, where, callback){
		
		var self = this;
		
	},
	
};