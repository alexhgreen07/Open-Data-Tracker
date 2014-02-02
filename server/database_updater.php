<?php

require_once ('config.php');
require_once ('auth.php');

//the current version of the database
define('current_version_id', '4');
define('current_version_string', '0.0.5');

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

function Update_Database()
{
	$updates_lookup_table = array(
			0 => 'Update_From_0_To_1',
			1 => 'Update_From_1_To_2',
			2 => 'Update_From_2_To_3',
			3 => 'Update_From_3_To_4',
		);
	
	$sql = "SELECT * FROM `version` WHERE `version_id` >= " . current_version_id . " ORDER BY `version_id` ASC";
	$result = mysql_query($sql);
	$num = mysql_numrows($result);

	if($num == 0)
	{
		//update to next versions
		$sql = "SELECT MAX(`version_id`) AS `version_id` FROM `version` WHERE `version_id` < " . current_version_id . " ORDER BY `version_id` ASC";
		$result = mysql_query($sql);
		$num = mysql_numrows($result);
		
		while ($num > 0) {
			
			$version_id_to_update = mysql_result($result, 0, "version_id");
			
			$update_function = $updates_lookup_table[$version_id_to_update];
			
			//execute update
			$update_function();
			
			$result = mysql_query($sql);
			$num = mysql_numrows($result);
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

?>
