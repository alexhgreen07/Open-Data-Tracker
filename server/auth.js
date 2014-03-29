define([],function(){
	return {
		Register_New_User: function(params, session, callback)
		{
			new_login = params.new_login;
			new_password = params.new_password;
			
			values = {
				'login': new_login,
				'passwd': new_password,
			};
			
			session.database.Insert('members', values, function(result){
				
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
});
