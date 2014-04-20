current_version_id = '7';
current_version_string = '0.0.8';

define([
        	'./database.js',
        ],function(database){
	
	function Insert_Version(params, session, callback)
	{
		values = {
				'version_id': current_version_id,
				'version_string': current_version_string,
			};
		
		session.database.Insert('version', values, function(result){
			
			callback(result);
			
		});
	}
	
	function Insert_Default_Settings(params, session, callback)
	{
		settings = {"First Name" => "string",
				"Last Name" => "string",
				"Email" => "string",
				"Text Size" => "int",
				"Remember Me Time" => "int",
				};
		
		var resultsCallbackCount = 0;
		
		//function to check if all queries have completed
		function AllQueriesComplete(result)
		{
			resultsCallbackCount--;
			
			if(resultsCallbackCount == 0)
			{
				callback(result);
			}
		}
		
		//increment the callback counter
		for(var key in settings)
		{
			resultsCallbackCount++;
		}
		
		//start all insert queries
		for(var key in settings)
		{
			
			var values = {
					'name': key
					'type': settings[key]
			};
			
			session.database.Insert('settings', values, AllQueriesComplete);
		}
	}
	
	function Install_Database(params, session, callback)
	{
		//TODO: implement
		var queries = [
           "",
		];
		
		var resultsCallbackCount = 0;
		
		//function to check if all queries have completed
		function AllQueriesComplete(result)
		{
			resultsCallbackCount--;
			
			if(resultsCallbackCount == 0)
			{
				//insert most current version
				Insert_Version({},session,function(result){
					
					//insert default settings
					Insert_Default_Settings({},session,function(result)

						callback(result);
						
					});

				});
			}
		}
		
		resultsCallbackCount = queries.length;
		
		//start all queries
		for(var key in queries)
		{
			session.database.Query(queries[key], AllQueriesComplete);
		}
	}
	
	function Update_Database(params, session, callback)
	{
		//TODO: implement
	}
	
	return {
		Insert_Version: Insert_Version,
		Insert_Default_Settings: Insert_Default_Settings,
		Install_Database: Install_Database,
		Update_Database: Update_Database
	};
});