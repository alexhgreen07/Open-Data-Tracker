var database = require('./database.js');

function Is_Cookie_Authorized(params, session, callback)
{
	session = params.session_id;
	
	callback(false);
}

function Is_Session_Authorized(params, session, callback)
{
	session = params.session_id;
	
	callback(false);
}

function Is_Authorized(params, session, callback)
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
}

function Start_Authorized_Session(params, session, callback)
{
	
}

function Update_Authorization_Cookie(params, session, callback)
{
	
}

module.exports = {
	Register_New_User: function(params, session, callback)
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
	Start_Authorized_Session: function(params, session, callback)
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
					session.is_authorized = true;
					session.member_id = login;
					
					callback(true);
				}
				
			});
	},
	Is_Authorized_Session: function(params, session, callback)
	{
		
		if(session.is_authorized)
		{
			callback(true);
		}
		else
		{
			callback(false);
		}
		
	},
	End_Authorized_Session: function(params, session, callback)
	{
		session.is_authorized = false;
	},
	
};
