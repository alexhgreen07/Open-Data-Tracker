define([
        'mysql',
        './config.js',
        ],function(mysql,config){
	
	return {
		Database: function(){
			var self = this;
			self.Connect = function(){
				
				var self = this;
				
				var connection_info = {
					  host     : config.database_host,
					  database : config.database_name,
					  user     : config.database_user,
					  password : config.database_password,
					  port : config.database_port,
					  timezone : "Z",
				};
				
				self.connection = mysql.createConnection(connection_info);
				
				self.connection.connect();
				
			};
			self.Close = function(){
				
				var self = this;
				
				self.connection.end();
				
			};
			self.Select = function(table, columns, where, extra, callback){
				
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
				
			};
			self.Insert = function(table, value_lookup, callback){
				
				var self = this;
				
				sql = "INSERT INTO `" + table + "`";
				
				columns = [];
				values = [];
				
				for(var key in value_lookup)
				{
					columns.push('`' + key + '`');
					values.push("'" + value_lookup[key] + "'");
				}
				
				sql += ' (' + columns.join(', ') + ')';
				sql += ' VALUES (' + values.join(', ') + ')';
				
				console.log(sql);
				
				self.connection.query(sql, function(err, rows, fields) {
		
					if (err)
					{
						throw err;
					}
					
					var return_object = {success: true};
					
					callback(return_object);
				});
			};
			self.Update = function(table, value_lookup, where, callback){
				
				var self = this;
				
				sql = "UPDATE `" + table + '` ';
				
				set_columns = [];
				
				for(var key in value_lookup)
				{
					set_columns.push("`" + key + "` = '" + value_lookup[key] + "'");
				}
				
				sql += "SET " + set_columns.join(',');
				
				sql += ' WHERE (' + where + ')';
				
				console.log(sql);
				
				self.connection.query(sql, function(err, rows, fields) {
		
					if (err)
					{
						throw err;
					}
					
					var return_object = {success: true};
					
					callback(return_object);
					
				});
				
			};
			self.Delete = function(table, where, callback){
				
				var self = this;
				
				sql = "DELETE FROM `" + table + "` WHERE (" + where + ")";
				
				console.log(sql);
				
				self.connection.query(sql, function(err, rows, fields) {
		
					if (err)
					{
						throw err;
					}
					
					var return_object = {success: true};
					
					callback(return_object);
					
				});
			};
			self.Query = function(query_string, callback)
			{
				console.log(sql);
				
				self.connection.query(query_string, function(err, rows, fields) {
					callback({success: true})
				});
			};
			self.Date_To_MYSQL_String = function(date)
			{
				
				var myDate_string = date.toISOString();
				var myDate_string = myDate_string.replace("T"," ");
				var myDate_string = myDate_string.substring(0, myDate_string.length - 5);
				
				return myDate_string;
			};
		},
		
	};
});

