var database = require('./database.js');


module.exports = {
	sessions: {},
	Register_New_User: function(params, callback)
	{
		new_login = params.new_login;
		new_password = params.new_password;
		
		values = {
			'login': new_login,
			'passwd': new_password,
		};
		
		database.Insert('members', values, function(result){
			
			callback(values);
			
		});
	},
	Is_Cookie_Authorized: function(params, callback)
	{
		callback(false);
	},
	Is_Session_Authorized: function(params, callback)
	{
		sessions = params.sessions;
		
		callback(false);
	},
	Is_Authorized: function(params, callback)
	{
		var self = this;
		
		//check session authorization
		self.Is_Session_Authorized(params, function(object)
		{
			if(object)
			{
				callback(object);
			}
			else
			{
				//check cookie authorization
				self.Is_Cookie_Authorized(params, function(object){
					
					if(object)
					{
						callback(object);
					}
					else
					{
						callback(false);
					}
					
				});
			}
			
			
		});
	},
	Authorize_User_Password: function(params, callback)
	{
		var login = params.login;
		var password = params.password;
		
		var columns = {
			'member_id': 'member_id',
			'login': 'login', 
			'passwd': 'passwd'};
		
		database.Select(
			'members', 
			columns, 
			"login = '" + login + "' AND passwd = MD5('" + password + "')",
			'',
			function(table){
				
				if(table.length == 0)
				{
					callback(false);
				}
				else
				{
					callback(true);
				}
				
			});
	},
	Start_Authorized_Session: function(params, callback)
	{
		
	},
	Logout_Authorized_Session: function(params, callback)
	{
		
	},
	Update_Authorization_Cookie: function(params, callback)
	{
		
	}
};