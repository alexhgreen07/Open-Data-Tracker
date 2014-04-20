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
		settings = {"First Name" : "string",
				"Last Name" : "string",
				"Email" : "string",
				"Text Size" : "int",
				"Remember Me Time" : "int",
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
					'name': key,
					'type': settings[key],
			};
			
			session.database.Insert('settings', values, AllQueriesComplete);
		}
	}
	
	function Install_Database(params, session, callback)
	{
		var queries = [
           "CREATE TABLE IF NOT EXISTS `categories` ( \
			  `category_id` int(11) NOT NULL AUTO_INCREMENT, \
			  `name` text NOT NULL, \
			  `description` text NOT NULL, \
			  `parent_category_id` int(11) NOT NULL, \
			  `member_id` int(11) NOT NULL, \
			  `category_path` text NOT NULL, \
			  PRIMARY KEY (`category_id`) \
			) ENGINE=InnoDB  DEFAULT CHARSET=latin1",
			"CREATE TABLE IF NOT EXISTS `items` ( \
			  `item_id` int(11) NOT NULL AUTO_INCREMENT, \
			  `date_created` datetime NOT NULL, \
			  `name` text NOT NULL, \
			  `unit` text NOT NULL, \
			  `description` text NOT NULL, \
			  `category_id` int(11) NOT NULL, \
			  `member_id` int(11) DEFAULT NULL, \
			  PRIMARY KEY (`item_id`) \
			) ENGINE=InnoDB  DEFAULT CHARSET=latin1",
			"CREATE TABLE IF NOT EXISTS `item_log` ( \
			  `item_log_id` int(11) NOT NULL AUTO_INCREMENT, \
			  `time` datetime NOT NULL, \
			  `value` float NOT NULL, \
			  `item_id` int(11) NOT NULL, \
			  `note` text NOT NULL, \
			  `item_target_id` int(11) NOT NULL, \
			  PRIMARY KEY (`item_log_id`) \
			) ENGINE=InnoDB  DEFAULT CHARSET=latin1",
			"CREATE TABLE IF NOT EXISTS `item_targets` ( \
			  `item_target_id` int(11) NOT NULL AUTO_INCREMENT, \
			  `start_time` datetime NOT NULL, \
			  `type` text NOT NULL, \
			  `value` double NOT NULL, \
			  `item_id` int(11) NOT NULL, \
			  `period_type` text NOT NULL, \
			  `period` double NOT NULL, \
			  `recurring` tinyint(1) NOT NULL, \
			  `recurring_child_id` int(11) NOT NULL, \
			  `recurrance_end_time` datetime NOT NULL, \
			  `allowed_variance` double NOT NULL, \
			  `recurrance_period` double NOT NULL, \
			  `status` text NOT NULL, \
			  PRIMARY KEY (`item_target_id`) \
			) ENGINE=MyISAM  DEFAULT CHARSET=latin1",
			"CREATE TABLE IF NOT EXISTS `members` ( \
			  `member_id` int(11) unsigned NOT NULL AUTO_INCREMENT, \
			  `firstname` varchar(100) DEFAULT NULL, \
			  `lastname` varchar(100) DEFAULT NULL, \
			  `login` varchar(100) NOT NULL DEFAULT '', \
			  `passwd` varchar(32) NOT NULL DEFAULT '', \
			  PRIMARY KEY (`member_id`) \
			) ENGINE=InnoDB  DEFAULT CHARSET=latin1",
			"CREATE TABLE IF NOT EXISTS `reports` ( \
			  `report_id` int(11) NOT NULL AUTO_INCREMENT, \
			  `report_name` text NOT NULL, \
			  `table_name` text NOT NULL, \
			  `summary_type` text NOT NULL, \
			  `filter_fields` text NOT NULL, \
			  `row_fields` text NOT NULL, \
			  `summary_fields` text NOT NULL, \
			  `graph_type` text NOT NULL, \
			  `graph_x` text NOT NULL, \
			  `graph_y` text NOT NULL, \
			  `member_id` int(11) NOT NULL, \
			  PRIMARY KEY (`report_id`) \
			) ENGINE=MyISAM  DEFAULT CHARSET=latin1",
			"CREATE TABLE IF NOT EXISTS `sessions` ( \
			  `session_entry_id` int(11) NOT NULL AUTO_INCREMENT, \
			  `member_id` int(11) NOT NULL, \
			  `session_id` text NOT NULL, \
			  `session_expiry` datetime NOT NULL, \
			  `session_data` longtext NOT NULL, \
			  PRIMARY KEY (`session_entry_id`), \
			  KEY `session_entry_id` (`session_entry_id`) \
			) ENGINE=MyISAM  DEFAULT CHARSET=latin1",
			"CREATE TABLE IF NOT EXISTS `settings` ( \
			  `setting_id` int(11) NOT NULL AUTO_INCREMENT, \
			  `name` text NOT NULL, \
			  `type` text NOT NULL, \
			  PRIMARY KEY (`setting_id`) \
			) ENGINE=MyISAM  DEFAULT CHARSET=latin1",
			"CREATE TABLE IF NOT EXISTS `setting_entries` ( \
			  `setting_entry_id` int(11) NOT NULL AUTO_INCREMENT, \
			  `setting_id` int(11) NOT NULL, \
			  `value` text NOT NULL, \
			  `member_id` int(11) NOT NULL, \
			  PRIMARY KEY (`setting_entry_id`) \
			) ENGINE=MyISAM  DEFAULT CHARSET=latin1",
			"CREATE TABLE IF NOT EXISTS `tasks` ( \
			  `task_id` int(11) NOT NULL AUTO_INCREMENT, \
			  `name` text NOT NULL, \
			  `description` text NOT NULL, \
			  `date_created` datetime NOT NULL, \
			  `note` text NOT NULL, \
			  `category_id` int(11) NOT NULL, \
			  `status` text NOT NULL, \
			  `member_id` int(11) DEFAULT NULL, \
			  PRIMARY KEY (`task_id`) \
			) ENGINE=InnoDB  DEFAULT CHARSET=latin1",
			"CREATE TABLE IF NOT EXISTS `task_log` ( \
			  `task_log_id` int(11) NOT NULL AUTO_INCREMENT, \
			  `task_id` int(11) NOT NULL, \
			  `start_time` datetime NOT NULL, \
			  `status` text NOT NULL, \
			  `hours` float NOT NULL, \
			  `note` text NOT NULL, \
			  `task_target_id` int(11) NOT NULL, \
			  PRIMARY KEY (`task_log_id`) \
			) ENGINE=InnoDB  DEFAULT CHARSET=latin1",
			"CREATE TABLE IF NOT EXISTS `task_targets` ( \
			  `task_schedule_id` int(11) NOT NULL AUTO_INCREMENT, \
			  `task_id` int(11) NOT NULL, \
			  `scheduled_time` datetime NOT NULL, \
			  `recurring` tinyint(1) NOT NULL, \
			  `recurrance_type` text NOT NULL, \
			  `recurrance_period` float NOT NULL, \
			  `recurrance_end_time` datetime NOT NULL, \
			  `recurrance_child_id` int(11) NOT NULL, \
			  `allowed_variance` double NOT NULL, \
			  `estimated_time` double NOT NULL, \
			  `status` text NOT NULL, \
			  PRIMARY KEY (`task_schedule_id`) \
			) ENGINE=InnoDB  DEFAULT CHARSET=latin1",
			"CREATE TABLE IF NOT EXISTS `version` ( \
			  `version_id` int(11) NOT NULL, \
			  `version_string` varchar(50) NOT NULL \
			) ENGINE=MyISAM DEFAULT CHARSET=latin1",
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
					Insert_Default_Settings({},session,function(result){

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
		
		callback(false);
	}
	
	return {
		Insert_Version: Insert_Version,
		Insert_Default_Settings: Insert_Default_Settings,
		Install_Database: Install_Database,
		Update_Database: Update_Database
	};
});