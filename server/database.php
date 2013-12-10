<?php

require_once ('config.php');
require_once ('auth.php');

//the current version of the database
$current_version_id = 0;
$current_version_string = "0.0.1";

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

function Insert_Current_Version()
{
	$sql = "INSERT INTO `life_management`.`version` (`version_id`, `version_string`) VALUES (";
	$sql .= "'" . $current_version_id . "'";
	$sql .= ",";
	$sql .= "'" . $current_version_string . "'";
	$sql .= ");";
	
	//execute query
	$result = mysql_query($sql);
}

function Create_Database_Tables()
{
	$sql = "";
	
	//categories table
	$sql .= "
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
	
	//items table
	$sql .= "
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
	
	//item log table
	$sql .= "
		CREATE TABLE IF NOT EXISTS `item_log` (
		  `item_log_id` int(11) NOT NULL AUTO_INCREMENT,
		  `time` datetime NOT NULL,
		  `value` float NOT NULL,
		  `item_id` int(11) NOT NULL,
		  `note` text NOT NULL,
		  PRIMARY KEY (`item_log_id`)
		) ENGINE=InnoDB  DEFAULT CHARSET=latin1;
		";
	
	//item targets table
	$sql .= "
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
	
	//task log table
	$sql .= "
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
	
	//task targets table
	$sql .= "
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
	
	//members table
	$sql .= "
		CREATE TABLE IF NOT EXISTS `members` (
		  `member_id` int(11) unsigned NOT NULL AUTO_INCREMENT,
		  `firstname` varchar(100) DEFAULT NULL,
		  `lastname` varchar(100) DEFAULT NULL,
		  `login` varchar(100) NOT NULL DEFAULT '',
		  `passwd` varchar(32) NOT NULL DEFAULT '',
		  PRIMARY KEY (`member_id`)
		) ENGINE=InnoDB  DEFAULT CHARSET=latin1;
		";
	
	//sessions table
	$sql .= "
		CREATE TABLE IF NOT EXISTS `sessions` (
		  `session_entry_id` int(11) NOT NULL AUTO_INCREMENT,
		  `member_id` int(11) NOT NULL,
		  `session_id` text NOT NULL,
		  `session_expiry` datetime NOT NULL,
		  PRIMARY KEY (`session_entry_id`),
		  KEY `session_entry_id` (`session_entry_id`)
		) ENGINE=MyISAM  DEFAULT CHARSET=latin1;
		";
	
	//versioning table
	$sql .= "
		CREATE TABLE IF NOT EXISTS `version` (
		  `version_id` int(11) NOT NULL,
		  `version_string` varchar(50) NOT NULL
		) ENGINE=MyISAM DEFAULT CHARSET=latin1;
		";
	
	//execute query
	$result = mysql_query($sql);
	
	//insert the current version
	Insert_Current_Version();
}

?>