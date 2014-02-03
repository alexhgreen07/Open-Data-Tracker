<?php

require_once ('config.php');
require_once ('auth.php');
require_once ('database_updater.php');

function Connect_To_DB()
{
	//Connect to mysql server
	$link = mysql_connect(DB_HOST, DB_USER, DB_PASSWORD);
	if (!$link) {
		die('Failed to connect to server: ' . mysql_error());
	}

	//Select database
	$db = mysql_select_db(DB_DATABASE);
	if (!$db) {
		die("Unable to select database");
	}
	
	return $link;
}

function Create_Database_Tables()
{
	$sql = "";
	$result = false;
	
	try {
	    
		//categories table
		$sql = "
			CREATE TABLE IF NOT EXISTS `categories` (
			  `category_id` int(11) NOT NULL AUTO_INCREMENT,
			  `name` text NOT NULL,
			  `description` text NOT NULL,
			  `parent_category_id` int(11) NOT NULL,
			  `member_id` int(11) NOT NULL,
			  `category_path` text NOT NULL,
			  PRIMARY KEY (`category_id`)
			) ENGINE=InnoDB DEFAULT CHARSET=latin1;
			";
		
		//execute query
		$result = mysql_query($sql);
		
		if(!$result)
		{
			throw new Exception('Database failure.');
		} 
		
		//items table
		$sql = "
			CREATE TABLE IF NOT EXISTS `items` (
			  `item_id` int(11) NOT NULL AUTO_INCREMENT,
			  `date_created` datetime NOT NULL,
			  `name` text NOT NULL,
			  `unit` text NOT NULL,
			  `description` text NOT NULL,
			  `category_id` int(11) NOT NULL,
			  PRIMARY KEY (`item_id`)
			) ENGINE=InnoDB  DEFAULT CHARSET=latin1;
			";
		
		//execute query
		$result = mysql_query($sql);
		
		if(!$result)
		{
			throw new Exception('Database failure.');
		} 
		
		//item log table
		$sql = "
			CREATE TABLE IF NOT EXISTS `item_log` (
			  `item_log_id` int(11) NOT NULL AUTO_INCREMENT,
			  `time` datetime NOT NULL,
			  `value` float NOT NULL,
			  `item_id` int(11) NOT NULL,
			  `note` text NOT NULL,
			  PRIMARY KEY (`item_log_id`)
			) ENGINE=InnoDB  DEFAULT CHARSET=latin1;
			";
		
		//execute query
		$result = mysql_query($sql);
		
		if(!$result)
		{
			throw new Exception('Database failure.');
		} 
		
		//item targets table
		$sql = "
			CREATE TABLE IF NOT EXISTS `item_targets` (
			  `item_target_id` int(11) NOT NULL AUTO_INCREMENT,
			  `start_time` datetime NOT NULL,
			  `type` text NOT NULL,
			  `value` double NOT NULL,
			  `item_id` int(11) NOT NULL,
			  `period_type` text NOT NULL,
			  `period` double NOT NULL,
			  `recurring` tinyint(1) NOT NULL,
			  PRIMARY KEY (`item_target_id`)
			) ENGINE=MyISAM DEFAULT CHARSET=latin1;
			";
		
		//execute query
		$result = mysql_query($sql);
		
		if(!$result)
		{
			throw new Exception('Database failure.');
		} 
		
		//tasks table
		$sql .= "
			CREATE TABLE IF NOT EXISTS `tasks` (
			  `task_id` int(11) NOT NULL AUTO_INCREMENT,
			  `name` text NOT NULL,
			  `description` text NOT NULL,
			  `date_created` datetime NOT NULL,
			  `estimated_time` float NOT NULL,
			  `note` text NOT NULL,
			  `category_id` int(11) NOT NULL,
			  `status` text NOT NULL,
			  PRIMARY KEY (`task_id`)
			) ENGINE=InnoDB  DEFAULT CHARSET=latin1;
			";
		
		//execute query
		$result = mysql_query($sql);
		
		//task log table
		$sql = "
			CREATE TABLE IF NOT EXISTS `task_log` (
			  `task_log_id` int(11) NOT NULL AUTO_INCREMENT,
			  `task_id` int(11) NOT NULL,
			  `start_time` datetime NOT NULL,
			  `status` text NOT NULL,
			  `hours` float NOT NULL,
			  `note` text NOT NULL,
			  `task_target_id` int(11) NOT NULL,
			  PRIMARY KEY (`task_log_id`)
			) ENGINE=InnoDB  DEFAULT CHARSET=latin1;
			";
		
		//execute query
		$result = mysql_query($sql);
		
		if(!$result)
		{
			throw new Exception('Database failure.');
		} 
		
		//task targets table
		$sql = "
			CREATE TABLE IF NOT EXISTS `task_targets` (
			  `task_schedule_id` int(11) NOT NULL AUTO_INCREMENT,
			  `task_id` int(11) NOT NULL,
			  `scheduled` tinyint(1) NOT NULL,
			  `scheduled_time` datetime NOT NULL,
			  `recurring` tinyint(1) NOT NULL,
			  `recurrance_type` text NOT NULL,
			  `recurrance_period` float NOT NULL,
			  `recurrance_end_time` datetime NOT NULL,
			  PRIMARY KEY (`task_schedule_id`)
			) ENGINE=InnoDB  DEFAULT CHARSET=latin1;
			";
		
		//execute query
		$result = mysql_query($sql);
		
		if(!$result)
		{
			throw new Exception('Database failure.');
		}
		
		//members table
		$sql = "
			CREATE TABLE IF NOT EXISTS `members` (
			  `member_id` int(11) unsigned NOT NULL AUTO_INCREMENT,
			  `firstname` varchar(100) DEFAULT NULL,
			  `lastname` varchar(100) DEFAULT NULL,
			  `login` varchar(100) NOT NULL DEFAULT '',
			  `passwd` varchar(32) NOT NULL DEFAULT '',
			  PRIMARY KEY (`member_id`)
			) ENGINE=InnoDB  DEFAULT CHARSET=latin1;
			";
		
		//execute query
		$result = mysql_query($sql);
		
		if(!$result)
		{
			throw new Exception('Database failure.');
		}
		
		//sessions table
		$sql = "
			CREATE TABLE IF NOT EXISTS `sessions` (
			  `session_entry_id` int(11) NOT NULL AUTO_INCREMENT,
			  `member_id` int(11) NOT NULL,
			  `session_id` text NOT NULL,
			  `session_expiry` datetime NOT NULL,
			  PRIMARY KEY (`session_entry_id`),
			  KEY `session_entry_id` (`session_entry_id`)
			) ENGINE=MyISAM  DEFAULT CHARSET=latin1;
			";
		
		//execute query
		$result = mysql_query($sql);
		
		if(!$result)
		{
			throw new Exception('Database failure.');
		}
		
		$sql = "
			CREATE TABLE IF NOT EXISTS `version` (
			  `version_id` int(11) NOT NULL,
			  `version_string` varchar(50) NOT NULL
			) ENGINE=MyISAM DEFAULT CHARSET=latin1;
			";
		
		//execute query
		$result = mysql_query($sql);
		
		if(!$result)
		{
			throw new Exception('Database failure.');
		}
		
		$sql = "
		CREATE TABLE IF NOT EXISTS `reports` (
		  `report_id` int(11) NOT NULL AUTO_INCREMENT,
		  `report_name` text NOT NULL,
		  `table_name` text NOT NULL,
		  `summary_type` text NOT NULL,
		  `filter_fields` text NOT NULL,
		  `row_fields` text NOT NULL,
		  `summary_fields` text NOT NULL,
		  `graph_type` text NOT NULL,
		  `graph_x` text NOT NULL,
		  `graph_y` text NOT NULL,
		  `member_id` int(11) NOT NULL,
		  PRIMARY KEY (`report_id`)
		) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;
		";
		
		//execute query
		$result = mysql_query($sql);
		
		if(!$result)
		{
			throw new Exception('Database failure.');
		}
		
		Insert_Default_Settings();
		
		//insert the current version
		Insert_Version(current_version_id,current_version_string);
		
	} catch (Exception $e) {
	    
	}
	
	
	
	return $result;
}



?>