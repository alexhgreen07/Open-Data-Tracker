<?php
/** \file task_data_interface.php
 * \brief This file contains the class definition for the item data interface class.
 * */

/** \class Task_Data_Interface
 * \brief This class contains functions related to tasks. All
 * task insert, update, and delete functionality is done through
 * this class. Also all task data retrieval will come from this.
 * */
class Task_Data_Interface {

	//this will store the open database link
	private $database_link;

	public function Task_Data_Interface($new_database_link) {

		//note this is expected to be initialized and open to the proper database
		$this -> database_link = $new_database_link;

	}

	public function Insert_Task_Entry($start_time, $task_id, $hours, $status, $note, $task_target_id) {

		$return_json = array('success' => 'false', );

		$start_time = mysql_real_escape_string($start_time);
		$task_id = mysql_real_escape_string($task_id);
		$hours = mysql_real_escape_string($hours);
		$completed = mysql_real_escape_string($completed);
		$note = mysql_real_escape_string($note);

		try {

			$sql = "INSERT INTO `task_log`(`task_id`, `start_time`,`hours`, `status`, `note`, `task_target_id`,`member_id`) VALUES ('" . 
				$task_id . "','" . 
				$start_time . "','" . 
				$hours . "', '" . 
				$status . "','" . 
				$note . "',".
				$task_target_id.",
				'" . $_SESSION['session_member_id'] ."')";
			
			$return_json['debug'] = $sql;
			
			//execute insert
			$success = mysql_query($sql, $this -> database_link);

			if (!$success) {
				throw new Exception('SQL error.');
			}

			$return_json['success'] = 'true';

		} catch(Exception $e) {
			$return_json['success'] = 'false';
		}

		return $return_json;
	}

	public function Update_Task_Entry($task_log_id, $task_id, $start_time, $hours, $completed, $status, $note, $task_target_id) {

		$return_json = array('success' => 'false', );

		$task_log_id = mysql_real_escape_string($task_log_id);
		$start_time = mysql_real_escape_string($start_time);
		$task_id = mysql_real_escape_string($task_id);
		$hours = mysql_real_escape_string($hours);
		$completed = mysql_real_escape_string($completed);
		$status = mysql_real_escape_string($status);
		$note = mysql_real_escape_string($note);

		
		$sql = "UPDATE `task_log` 
			SET `task_id`=" . $task_id . ",
			`start_time`='" . $start_time . "',
			`hours`=" . $hours . ",
			`status`='" . $status . "',
			`note`='" . $note . "',
			`task_target_id`=".$task_target_id."
			WHERE `task_log_id` = " . $task_log_id . " AND `member_id`='" . $_SESSION['session_member_id'] ."'";
		
		$return_json['debug'] = $sql;
		
		//execute insert
		$success = mysql_query($sql, $this -> database_link);

		if ($success) {
			$return_json['success'] = 'true';
		}
		else{
			$return_json['success'] = 'false';
		}
		

		return $return_json;
	}

	public function Delete_Task_Entry($task_log_id) {
	
		$return_json = array('success' => 'false', );

		$task_log_id = mysql_real_escape_string($task_log_id);

		$sql = "DELETE FROM `task_log` WHERE `task_log_id` = " . $task_log_id . " AND `member_id`='" . $_SESSION['session_member_id'] ."'";

		//execute insert
		$success = mysql_query($sql, $this -> database_link);

		if ($success) {
			$return_json['success'] = 'true';
		}
		else {
			$return_json['success'] = 'false';
		}


		return $return_json;
	}

	public function Task_Start_Stop($task_name_to_enter, $task_start_stop, $note) {
		$return_json = array('success' => 'false', );

		$task_name_to_enter = mysql_real_escape_string($task_name_to_enter);
		$task_start_stop = mysql_real_escape_string($task_start_stop);
		$note = mysql_real_escape_string($note);

		$sql_query = "SELECT DISTINCT `task_id` FROM `tasks` WHERE `name` = '" . $task_name_to_enter . "' AND `member_id`='" . $_SESSION['session_member_id'] ."'";
		$result = mysql_query($sql_query, $this -> database_link);

		$task_id = mysql_result($result, 0, "task_id");

		if ($task_start_stop == "Start") {
			$sql = "INSERT INTO `task_log`(`task_id`, `start_time`,`status`,`note`) VALUES ('" . $task_id . "',NOW(),'Started','" . $note . "')";
		} else {
			$sql = "UPDATE `task_log` 
				SET 
				`hours`=(TIMESTAMPDIFF(SECOND,`start_time`,NOW())/60/60),
				`status`='Stopped',
				`note`='" . $note . "'
				WHERE `task_id` = '" . $task_id . "' AND 
				`hours` = 0 AND
				`status` = 'Started' AND
				`member_id`='" . $_SESSION['session_member_id'] ."'";
		}

		//execute insert
		$success = mysql_query($sql, $this -> database_link);

		if ($success) {
			$return_json['success'] = 'true';
		} else {
			$return_json['success'] = 'false';
		}

		return $return_json;
	}

	public function Task_Mark_Complete($task_name_to_enter) {
		$return_json = array('success' => 'false', );

		try {
			$task_name_to_enter = mysql_real_escape_string($task_name_to_enter);
			$task_start_stop = mysql_real_escape_string($task_start_stop);

			//find the task by its name
			$sql_query = "SELECT DISTINCT `task_id` FROM `tasks` WHERE `name` = '" . $task_name_to_enter . "' AND `member_id`='" . $_SESSION['session_member_id'] ."'";
			$result = mysql_query($sql_query, $this -> database_link);

			if (!$result) {
				throw new Exception('SQL error.');
			}

			$task_id = mysql_result($result, 0, "task_id");

			//insert an entry into the log indicating the task is complete
			$sql = "INSERT INTO `task_log`(`task_id`, `start_time`,`status`,`member_id`) VALUES ('" . $task_id . "',NOW(),'Completed','" . $_SESSION['session_member_id'] ."')";

			//execute insert
			$success = mysql_query($sql, $this -> database_link);

			if (!$success) {
				throw new Exception('SQL error.');
			}

			$return_json['success'] = 'true';

		} catch (MyException $e) {
			/* rethrow it
			 throw $e;*/

			$return_json['success'] = 'false';
		}

		return $return_json;
	}

	public function Insert_Task($name, $description = "", $estimated_time = 0, $note = "", $category_id = 0) {
		$return_json = array('success' => 'false', );

		$task_name = mysql_real_escape_string($name);
		$task_description = mysql_real_escape_string($description);
		$task_estimated_time = mysql_real_escape_string($estimated_time);
		$task_note = mysql_real_escape_string($note);

		$sql = 'INSERT INTO `tasks` 
			(`name`, 
			`description`, 
			`date_created`, 
			`estimated_time`,
			`note`,
			`category_id`,
			`status`,
			`member_id`) VALUES (';

		$sql .= "'" . $task_name . "',";
		$sql .= "'" . $task_description . "',";
		$sql .= "UTC_TIMESTAMP(),";
		$sql .= "" . $task_estimated_time . ",";
		$sql .= "'" . $task_note . "',";
		$sql .= "" . $category_id . ",";
		$sql .= "'Active',";
		$sql .= "'" . $_SESSION['session_member_id'] ."')";

		$success = mysql_query($sql, $this -> database_link);

		$return_json['debug'] = $sql;

		if ($success) {
			$return_json['success'] = 'true';
		} else {
			$return_json['success'] = 'false';
		}

		return $return_json;
	}

	public function Delete_Task($task_id) {
			
		$return_json = array('success' => 'false', );

		$sql = "DELETE FROM `tasks` WHERE `task_id` = " . $task_id . " AND `member_id`='" . $_SESSION['session_member_id'] ."'";

		$success = mysql_query($sql, $this -> database_link);

		$return_json['debug'] = $sql;

		if ($success) {
			$return_json['success'] = 'true';
		} else {
			$return_json['success'] = 'false';
		}

		return $return_json;
	}

	public function Update_Task($task_id, $name, $category_id, $description, $estimated_time, $note, $status) {
		$return_json = array('success' => 'false', );

		$task_name = mysql_real_escape_string($name);
		$task_description = mysql_real_escape_string($description);
		$task_estimated_time = mysql_real_escape_string($estimated_time);
		$task_note = mysql_real_escape_string($note);

		$sql = "UPDATE `tasks` 
			SET `category_id`=" . $category_id . ",
			`name`='" . $name . "',
			`description`='" . $description . "',
			`estimated_time`=" . $estimated_time . ",
			`note`='" . $note . "',
			`status`= '".$status."'
			WHERE `task_id`=" . $task_id . " AND `member_id`='" . $_SESSION['session_member_id'] ."'";

		$success = mysql_query($sql, $this -> database_link);

		$return_json['debug'] = $sql;

		if ($success) {
			$return_json['success'] = 'true';
		} else {
			$return_json['success'] = 'false';
		}

		return $return_json;
	}
	
	public function Get_Tasks_Schema(){
		
		$return_json = array();
		
		$return_json['schema'] = array(
			'task_id' => 'int',
			'name' => 'string',
			'description' => 'string',
			'estimated_time' => 'float', 
			'date_created' => 'date',
			'note' => 'string',
			'category_id' => 'int',
			'status' => 'string'
		);
		
		return $return_json;
	}
	
	public function Get_Tasks() {
		
		$return_json = array('success' => 'false', 'data' => '');

		$sql_query = "SELECT DISTINCT 
			`task_id`,
			`name`,
			`description`,
			`date_created`,
			`note`,
			`estimated_time`,
			`category_id`,
			`status` FROM `tasks` WHERE `member_id`='" . $_SESSION['session_member_id'] ."' ORDER BY `name` ASC";
		$result = mysql_query($sql_query, $this -> database_link);

		if ($result) {
			$return_json['success'] = 'true';

			$num = mysql_numrows($result);

			$return_json['data'] = array();
			
			$i = 0;
			while ($i < $num) {
				
				$task_id= mysql_result($result,$i,"task_id");
				$task_name = mysql_result($result, $i, "name");
				$task_description = mysql_result($result, $i, "description");
				$task_estimated_time = mysql_result($result, $i, "estimated_time");
				$date_created = mysql_result($result,$i,'date_created');
				$task_note = mysql_result($result,$i,'note');
				$category_id = mysql_result($result,$i,'category_id');
				$status = mysql_result($result,$i,'status');
				
				$return_json['data'][$i] = array(
					'task_id' => $task_id,
					'name' => $task_name,
					'description' => $task_description,
					'estimated_time' => $task_estimated_time, 
					'date_created' => $date_created,
					'note' => $task_note,
					'category_id' => $category_id,
					'status' => $status);
				
				
				$i++;
			}

			
		} else {
			$return_json['success'] = 'false';
		}
		
		return $return_json;
	}

	public function Get_Task_Log_Schema(){
		
		$return_json = array();
		$return_json['schema'] = array(
			'task_log_id' => 'int',
			'name' => 'string',
			'start_time' => 'date',
			'hours' => 'float',
			'note' => 'note',
			'status' => 'string',
			'task_id' => 'int',
			'task_target_id' => 'int'
		);
		
		return $return_json;
		
	}

	public function Get_Task_Log() {

		$return_json = array('success' => 'false', 'data' => '');

		$query = "SELECT 
			`tasks`.`name` AS `name`, 
			`task_log`.`task_log_id` AS `task_log_id`,
			`tasks`.`task_id` AS `task_id`,
			`task_log`.`start_time` AS `start_time`, 
			`task_log`.`hours` AS `hours`, 
			`task_log`.`status` AS `status`, 
			`task_log`.`note` AS `note`,
			`task_log`.`task_target_id` AS `task_target_id`
			FROM `tasks` , `task_log`
			WHERE `tasks`.`task_id` = `task_log`.`task_id` AND `tasks`.`member_id`='" . $_SESSION['session_member_id'] ."'
			ORDER BY `task_log`.`start_time` DESC";
		$result = mysql_query($query, $this -> database_link);

		$num = mysql_numrows($result);

		$return_json['data'] = array();

		$i = 0;
		while ($i < $num) {
			
			$task_entry_id = mysql_result($result, $i, "task_log_id");
			$task_entry_name = mysql_result($result, $i, "name");
			$task_entry_start_time = mysql_result($result, $i, "start_time");
			$task_entry_hours = mysql_result($result, $i, "hours");
			$task_entry_note = mysql_result($result, $i, "note");
			$task_entry_status = mysql_result($result, $i, "status");
			$task_id = mysql_result($result, $i, "task_id");
			$task_target_id = mysql_result($result, $i, "task_target_id");

			$return_json['data'][$i] = array(
				'task_log_id' => $task_entry_id,
				'name' => $task_entry_name,
				'start_time' => $task_entry_start_time,
				'hours' => $task_entry_hours,
				'note' => $task_entry_note,
				'status' => $task_entry_status,
				'task_id' => $task_id,
				'task_target_id' => $task_target_id);
			
			
			$i++;
		}

		return $return_json;
	}
	
	public function Get_Task_Targets_Schema(){
		
		$return_json = array();
		$return_json['schema'] = array(
			'task_schedule_id' => 'int',
			'task_schedule_id' => 'int',
			'name' => 'string',
			'scheduled_time' => 'date',
			'scheduled' => 'bool',
			'recurring' => 'bool',
			'recurrance_type' => 'string',
			'recurrance_period' => 'int',
			'task_id' => 'int'
		);
		
		return $return_json;
		
	}
	
	public function Get_Task_Targets()
	{
		$return_json = array('success' => 'false', 'data' => '');

		$query = "SELECT 
			`task_targets`.`task_id` AS `task_id`,
			`task_targets`.`task_schedule_id` AS `task_schedule_id`, 
			`task_targets`.`scheduled` AS `scheduled`, 
			`task_targets`.`scheduled_time` AS `scheduled_time`, 
			`task_targets`.`recurring` AS `recurring`, 
			`task_targets`.`recurrance_type` AS `recurrance_type`, 
			`task_targets`.`recurrance_period` AS `recurrance_period`, 
			`tasks`.`name` AS `name` 
			FROM `task_targets`, `tasks`
			WHERE `tasks`.`task_id` = `task_targets`.`task_id` AND `tasks`.`member_id`='" . $_SESSION['session_member_id'] ."'
			ORDER BY `task_targets`.`scheduled_time` DESC";
			
		$result = mysql_query($query, $this -> database_link);

		$num = mysql_numrows($result);

		$return_json['data'] = array();

		$i = 0;
		while ($i < $num) {
			
			$task_schedule_id = mysql_result($result, $i, "task_schedule_id");
			$task_entry_name = mysql_result($result, $i, "name");
			$task_entry_scheduled = mysql_result($result, $i, "scheduled");
			$task_entry_scheduled_time = mysql_result($result, $i, "scheduled_time");
			$task_entry_recurring = mysql_result($result, $i, "recurring");
			$task_entry_recurrance_type = mysql_result($result, $i, "recurrance_type");
			$task_entry_recurrance_period = mysql_result($result, $i, "recurrance_period");
			$task_id = mysql_result($result, $i, "task_id");

			$return_json['data'][$i] = array(
				'task_schedule_id' => $task_schedule_id,
				'task_schedule_id' => $task_id,
				'name' => $task_entry_name,
				'scheduled_time' => $task_entry_scheduled_time,
				'scheduled' => $task_entry_scheduled,
				'recurring' => $task_entry_recurring,
				'recurrance_type' => $task_entry_recurrance_type,
				'recurrance_period' => $task_entry_recurrance_period,
				'task_id' => $task_id);
			
			
			$i++;
		}

		return $return_json;
	}

	public function Insert_Task_Target($task_id, $scheduled, $scheduled_time, $recurring, $recurrance_type, $recurrance_period)
	{
		$return_json = array('success' => 'false', );

		$scheduled = mysql_real_escape_string($scheduled);
		$scheduled_time = mysql_real_escape_string($scheduled_time);
		$recurring = mysql_real_escape_string($recurring);
		$recurrance_type = mysql_real_escape_string($recurrance_type);
		$recurrance_period = mysql_real_escape_string($recurrance_period);

		$sql = 'INSERT INTO `task_targets`(
			`task_id`, 
			`scheduled`, 
			`scheduled_time`, 
			`recurring`, 
			`recurrance_type`, 
			`recurrance_period`,
			`member_id`) VALUES (';

		$sql .= "'" . $task_id . "',";
		$sql .= "" . $scheduled . ",";
		$sql .= "'" . $scheduled_time . "',";
		$sql .= "" . $recurring . ",";
		$sql .= "'" . $recurrance_type . "',";
		$sql .= "" . $recurrance_period . ",";
		$sql .= "'" . $_SESSION['session_member_id'] ."')";

		$success = mysql_query($sql, $this -> database_link);

		$return_json['debug'] = $sql;

		if ($success) {
			$return_json['success'] = 'true';
		} else {
			$return_json['success'] = 'false';
		}

		return $return_json;
	}
	
	public function Update_Task_Target($task_target_id, $task_id, $scheduled, $scheduled_time, $recurring, $recurrance_type, $recurrance_period)
	{
		$return_json = array('success' => 'false', );

		$scheduled = mysql_real_escape_string($scheduled);
		$scheduled_time = mysql_real_escape_string($scheduled_time);
		$recurring = mysql_real_escape_string($recurring);
		$recurrance_type = mysql_real_escape_string($recurrance_type);
		$recurrance_period = mysql_real_escape_string($recurrance_period);

		$sql = "UPDATE `task_targets` SET 
			`task_id`=".$task_id.",
			`scheduled`=".$scheduled.",
			`scheduled_time`='".$scheduled_time."',
			`recurring`=".$recurring.",
			`recurrance_type`='".$recurrance_type."',
			`recurrance_period`=".$recurrance_period." 
			WHERE `task_schedule_id`=" . $task_target_id . " AND `member_id`='" . $_SESSION['session_member_id'] ."'";

		$success = mysql_query($sql, $this -> database_link);

		$return_json['debug'] = $sql;

		if ($success) {
			$return_json['success'] = 'true';
		} else {
			$return_json['success'] = 'false';
		}

		return $return_json;
	}

	public function Delete_Task_Target($task_target_id)
	{
		$return_json = array('success' => 'false', );

		$sql = "DELETE FROM `task_targets` WHERE `task_schedule_id` = " . $task_target_id . " AND `member_id`='" . $_SESSION['session_member_id'] ."'";

		$success = mysql_query($sql, $this -> database_link);

		$return_json['debug'] = $sql;

		if ($success) {
			$return_json['success'] = 'true';
		} else {
			$return_json['success'] = 'false';
		}

		return $return_json;
	}
}
?>
