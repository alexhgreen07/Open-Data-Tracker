function Authorize_Session_Database(params, session, callback)
{
	
	values = {
		'member_id': session.member_id,
		'session_id': session.session_id,
	};
	
	session.database.Insert('sessions', values, function(result){
		
		callback(values);
		
	});
}

define([
        'crypto',
        ],function(crypto){
	
	function Register_New_User(params, session, callback)
	{
		new_login = params.new_login;
		new_password = params.new_password;
		
		hashed_password = crypto.createHash('md5').update(new_password).digest('hex');
		
		values = {
			'login': new_login,
			'passwd': hashed_password,
		};
		
		session.database.Insert('members', values, function(result){
			
			callback(values);
			
		});
	}
	
	function Start_Authorized_Session(params, session, callback)
	{
		var login = params.login;
		var password = params.password;
		
		var columns = {
			'member_id': 'member_id',
			'login': 'login', 
			'passwd': 'passwd'};
		
		session.database.Select(
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
					session.member_id = table[0].member_id;
					
					//update database with session
					Authorize_Session_Database(params,session,function(object){
						callback(true);
					});
					
				}
				
			});
	}
	
	function Is_Authorized_Session(params, session, callback)
	{
		
		if(session.is_authorized)
		{
			callback(true);
		}
		else
		{
			var columns = {
					'member_id': 'member_id',
					'session_id': 'session_id',};
			
			//check the database to see if the session is authorized
			session.database.Select(
					'sessions', 
					columns, 
					"session_id = '" + session.session_id + "'",
					'',
					function(table){
						
						if(table.length == 0)
						{
							callback(false);
						}
						else
						{
							session.is_authorized = true;
							session.member_id = table[0].member_id;
							
							callback(true);
						}
						
					});
		}
		
	}
	
	function End_Authorized_Session(params, session, callback)
	{
		session.is_authorized = false;
	}
	
	return {
		Register_New_User: Register_New_User,
		Start_Authorized_Session: Start_Authorized_Session,
		Is_Authorized_Session: Is_Authorized_Session,
		End_Authorized_Session: End_Authorized_Session,
		
	};
});
