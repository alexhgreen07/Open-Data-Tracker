<?php

require_once ('config.php');
require_once ('auth.php');

//the current version of the database
define('current_version_id', '5');
define('current_version_string', '0.0.6');

function Insert_Version($version_id, $version_string)
{
	
	$sql = "INSERT INTO `version` (`version_id`, `version_string`) VALUES (";
	$sql .= "'" . $version_id . "'";
	$sql .= ",";
	$sql .= "'" . $version_string . "'";
	$sql .= ");";
	
	//execute query
	$result = mysql_query($sql);
}

function Insert_Default_Settings()
{
	$settings = array("First Name" => "string",
		"Last Name" => "string",
		"Email" => "string",
		"Text Size" => "int",
		"Remember Me Time" => "int",);
	
	foreach ($settings as $name => $type) {
		
	    $sql = "INSERT INTO `settings` (
			`name`,
			`type`
			) VALUES (
			'".$name."',
			'".$type."'
			)";
		$result = mysql_query($sql);
		
	}
}

function Update_Database()
{
	//NOTE: Order matters in this array.
	$updates_lookup_table = array(
			0 => 'Update_From_0_To_1',
			1 => 'Update_From_1_To_2',
			2 => 'Update_From_2_To_3',
			3 => 'Update_From_3_To_4',
			4 => 'Update_From_4_To_5',
		);
	
	$sql = "SELECT MAX(`version_id`) AS `version_id` FROM `version`";
	$result = mysql_query($sql);
	$num = mysql_numrows($result);
	
	if($num > 0)
	{
		$current_version = mysql_result($result, 0, "version_id");
		
		foreach($updates_lookup_table as $version_id => $update_function)
		{
			if($version_id >= $current_version)
			{
				$update_function = $updates_lookup_table[$version_id];
			
				//execute update
				$update_function();
			}
		}
	}
	
}

//-----------------------------------------------------------------

function Update_From_0_To_1()
{
	$version_id = 1;
	$version_string = "0.0.2";
	
	//execute updates from previous version
	$sql = "ALTER TABLE `items` ADD `member_id` int(11);";
	$result = mysql_query($sql);
	
	$sql = "ALTER TABLE `item_log` ADD `member_id` int(11);";
	$result = mysql_query($sql);
	
	$sql = "ALTER TABLE `item_targets` ADD `member_id` int(11);";
	$result = mysql_query($sql);
	
	$sql = "ALTER TABLE `tasks` ADD `member_id` int(11);";
	$result = mysql_query($sql);
	
	$sql = "ALTER TABLE `task_log` ADD `member_id` int(11);";
	$result = mysql_query($sql);
	
	$sql = "ALTER TABLE `task_targets` ADD `member_id` int(11);";
	$result = mysql_query($sql);
	
	Insert_Version($version_id,$version_string);
}

function Update_From_1_To_2()
{
	$version_id = 2;
	$version_string = "0.0.3";
	
	//execute updates from previous version
	$sql = "CREATE TABLE IF NOT EXISTS `reports` (
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
	) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;";
	$result = mysql_query($sql);
	
	Insert_Version($version_id,$version_string);
}

function Update_From_2_To_3()
{
	$version_id = 3;
	$version_string = "0.0.4";
	
	$sql = "ALTER TABLE `task_targets` DROP `scheduled`";
	$result = mysql_query($sql);
	
	$sql = "ALTER TABLE `task_targets` ADD `recurrance_child_id` INT NOT NULL";
	$result = mysql_query($sql);
	
	$sql = "ALTER TABLE `task_targets` ADD `allowed_variance` DOUBLE NOT NULL";
	$result = mysql_query($sql);
	
	$sql = "ALTER TABLE `task_targets` ADD `estimated_time` DOUBLE NOT NULL";
	$result = mysql_query($sql);
	
	$sql = "ALTER TABLE `task_targets` ADD `status` TEXT NOT NULL ";
	$result = mysql_query($sql);
	
	$sql = "ALTER TABLE `tasks` DROP `estimated_time`";
	$result = mysql_query($sql);
	
	$sql = "UPDATE `task_log` SET `status`='Stopped' WHERE `status`='Completed'";
	$result = mysql_query($sql);
	
	$sql = "UPDATE `task_targets` SET `status`='Incomplete'";
	$result = mysql_query($sql);
	
	Insert_Version($version_id,$version_string);
}

function Update_From_3_To_4()
{
	$version_id = 4;
	$version_string = "0.0.5";
	
	$sql = "ALTER TABLE `item_log` ADD `item_target_id` INT NOT NULL ";
	$result = mysql_query($sql);
	
	$sql = "ALTER TABLE `item_targets` ADD `recurring_child_id` INT NOT NULL ";
	$result = mysql_query($sql);
	
	$sql = "ALTER TABLE `item_targets` ADD `recurrance_end_time` DATETIME NOT NULL ";
	$result = mysql_query($sql);
	
	$sql = "ALTER TABLE `item_targets` ADD `allowed_variance` DOUBLE NOT NULL ";
	$result = mysql_query($sql);
	
	$sql = "ALTER TABLE `item_targets` ADD `recurrance_period` DOUBLE NOT NULL ";
	$result = mysql_query($sql);
	
	$sql = "ALTER TABLE `item_targets` ADD `status` TEXT NOT NULL ";
	$result = mysql_query($sql);
	
	$sql = "UPDATE `item_targets` SET `status` = 'Incomplete' ";
	$result = mysql_query($sql);
	
	Insert_Version($version_id,$version_string);
}

function Update_From_4_To_5()
{
	$version_id = 5;
	$version_string = "0.0.6";
	
	$sql = "CREATE TABLE `life_management`.`settings` (
		`setting_id` INT NOT NULL AUTO_INCREMENT ,
		`name` TEXT NOT NULL ,
		`type` TEXT NOT NULL ,
		PRIMARY KEY ( `setting_id` )
		) ENGINE = MYISAM";
	$result = mysql_query($sql);
	
	$sql = "CREATE TABLE `life_management`.`setting_entries` (
		`setting_entry_id` INT NOT NULL AUTO_INCREMENT ,
		`setting_id` INT NOT NULL ,
		`value` TEXT NOT NULL ,
		`member_id` INT NOT NULL ,
		PRIMARY KEY ( `setting_entry_id` )
		) ENGINE = MYISAM";
	$result = mysql_query($sql);
	
	Insert_Default_Settings();
	
	Insert_Version($version_id,$version_string);
}

?>
