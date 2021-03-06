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
		$note = mysql_real_escape_string($note);

		try {

			$sql = "INSERT INTO `task_log`(`task_id`, `start_time`,`hours`, `status`, `note`, `task_target_id`) VALUES ('" . 
				$task_id . "','" . 
				$start_time . "','" . 
				$hours . "', '" . 
				$status . "','" . 
				$note . "',".
				$task_target_id.")";
			
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

	public function Update_Task_Entry($task_log_id, $task_id, $start_time, $hours, $status, $note, $task_target_id, $completed = 0) {

		$return_json = array('success' => 'false', );

		$task_log_id = mysql_real_escape_string($task_log_id);
		$start_time = mysql_real_escape_string($start_time);
		$task_id = mysql_real_escape_string($task_id);
		$hours = mysql_real_escape_string($hours);
		$completed = mysql_real_escape_string($completed);
		$status = mysql_real_escape_string($status);
		$note = mysql_real_escape_string($note);
		$task_target_id = mysql_real_escape_string($task_target_id);

		$sql = "UPDATE `task_log` 
			SET `task_id`=" . $task_id . ",
			`start_time`='" . $start_time . "',
			`hours`=" . $hours . ",
			`status`='" . $status . "',
			`note`='" . $note . "',
			`task_target_id`=".$task_target_id."
			WHERE `task_log_id` = " . $task_log_id . "";
		
		$return_json['debug'] = $sql;
		
		//execute insert
		$success = mysql_query($sql, $this -> database_link);
		
		if($completed)
		{
			$sql = "UPDATE `task_targets` 
				SET `status`='Complete'
				WHERE `task_schedule_id` = " . $task_target_id . "";
			
			$return_json['debug'] = $sql;
			
			//execute insert
			$success = mysql_query($sql, $this -> database_link);
		}


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

		$sql = "DELETE FROM `task_log` WHERE `task_log_id` = " . $task_log_id . "";

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

	public function Insert_Task($name, $description = "", $note = "", $category_id = 0) {
		$return_json = array('success' => 'false', );

		$task_name = mysql_real_escape_string($name);
		$task_description = mysql_real_escape_string($description);
		$task_note = mysql_real_escape_string($note);

		$sql = 'INSERT INTO `tasks` 
			(`name`, 
			`description`, 
			`date_created`, 
			`note`,
			`category_id`,
			`status`,
			`member_id`) VALUES (';

		$sql .= "'" . $task_name . "',";
		$sql .= "'" . $task_description . "',";
		$sql .= "UTC_TIMESTAMP(),";
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

	public function Update_Task($task_id, $name, $category_id, $description, $note, $status) {
		$return_json = array('success' => 'false', );

		$task_name = mysql_real_escape_string($name);
		$task_description = mysql_real_escape_string($description);
		$task_note = mysql_real_escape_string($note);

		$sql = "UPDATE `tasks` 
			SET `category_id`=" . $category_id . ",
			`name`='" . $name . "',
			`description`='" . $description . "',
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
			'date_created' => 'date',
			'note' => 'string',
			'category_id' => 'int',
			'status' => 'string'
		);
		
		return $return_json;
	}
	
	public function Get_Tasks() {
		
		$return_json = array('success' => 'false', 'data' => '');
		
		$columns = array(
			"task_id" => "tasks.task_id",
			"name" => "tasks.name",
			"description" => "tasks.description",
			"date_created" => "tasks.date_created",
			"note" => "tasks.note",
			"category_id" => "tasks.category_id",
			"status" => "tasks.status");
		$extra = "ORDER BY tasks.task_id";
		$data = Select_By_Member('tasks',$columns,"1",$extra);
		
		if(!$data)
		{
			$return_json['success'] = 'false';
			return $return_json;
		}
		
		$return_json['data'] = $data;
		$return_json['success'] = 'true';
		
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
			'task_target_id' => 'int',
			'target_status' => 'string'
		);
		
		return $return_json;
		
	}

	public function Get_Task_Log() {

		$return_json = array('success' => 'false', 'data' => '');
		
		$join = "task_log
			JOIN tasks ON tasks.task_id = task_log.task_id
			LEFT JOIN task_targets ON task_targets.task_schedule_id = task_log.task_target_id";
		$columns = array(
			"name" => "IFNULL(tasks.name,'')",
			"task_log_id" => "task_log.task_log_id",
			"task_id" => "IFNULL(tasks.task_id,0)",
			"start_time" => "task_log.start_time",
			"hours" => "task_log.hours",
			"status" => "task_log.status",
			"note" => "task_log.note",
			"task_target_id" => "task_log.task_target_id",
			"target_status" => "IFNULL(task_targets.status,'')");
		$extra = "ORDER BY task_log.task_log_id";
		$data = Select_By_Member($join,$columns,"1",$extra);
		
		if(!$data)
		{
			$return_json['success'] = 'false';
			return $return_json;
		}
		
		$return_json['data'] = $data;
		$return_json['success'] = 'true';
		
		return $return_json;
	}
	
	public function Get_Task_Targets_Schema(){
		
		$return_json = array();
		$return_json['schema'] = array(
			'task_schedule_id' => 'int',
			'task_schedule_id' => 'int',
			'name' => 'string',
			'scheduled_time' => 'date',
			'recurring' => 'bool',
			'recurrance_type' => 'string',
			'recurrance_period' => 'int',
			'variance' => 'float',
			'estimated_time' => 'float',
			'recurrance_end_time' => 'date',
			'recurrance_child_id' => 'int',
			'status' => 'string',
			'task_id' => 'int',
			'hours' => 'float',
		);
		
		return $return_json;
		
	}
	
	public function Get_Task_Targets()
	{
		$return_json = array('success' => 'false', 'data' => '');
		
		$join = "task_targets
			JOIN tasks ON tasks.task_id = task_targets.task_id
			LEFT JOIN task_log ON task_targets.task_schedule_id = task_log.task_target_id ";
		$columns = array(
			"task_id" => "task_targets.task_id",
			"task_schedule_id" => "task_targets.task_schedule_id",
			"scheduled_time" => "task_targets.scheduled_time",
			"recurring" => "task_targets.recurring",
			"recurrance_type" => "task_targets.recurrance_type",
			"variance" => "task_targets.allowed_variance",
			"estimated_time" => "task_targets.estimated_time",
			"recurrance_period" => "task_targets.recurrance_period",
			"recurrance_end_time" => "task_targets.recurrance_end_time",
			"recurrance_child_id" => "task_targets.recurrance_child_id",
			"status" => "task_targets.status",
			"name" => "tasks.name",
			"hours" => "IFNULL(SUM(task_log.hours),0)");
		$extra = "GROUP BY task_targets.task_schedule_id
			ORDER BY task_targets.task_schedule_id";
		$data = Select_By_Member($join,$columns,"1",$extra);
		
		if(!$data)
		{
			$return_json['success'] = 'false';
			return $return_json;
		}
		
		$return_json['data'] = $data;
		$return_json['success'] = 'true';
		
		return $return_json;
	}

	public function Insert_Task_Target($task_id, $scheduled_time, $recurring, $recurrance_type, $recurrance_period, $variance, $estimated_time, $recurrance_end_date)
	{
		$return_json = array('success' => 'false', );
		
		$scheduled_time = mysql_real_escape_string($scheduled_time);
		$recurring = mysql_real_escape_string($recurring);
		$recurrance_type = mysql_real_escape_string($recurrance_type);
		$recurrance_period = mysql_real_escape_string($recurrance_period);
		$variance = mysql_real_escape_string($variance);
		$estimated_time = mysql_real_escape_string($estimated_time);
		$recurrance_end_date = mysql_real_escape_string($recurrance_end_date);

		$sql = "INSERT INTO `task_targets`(
			`task_id`, 
			`scheduled_time`, 
			`recurring`, 
			`recurrance_type`, 
			`recurrance_period`,
			`allowed_variance`,
			`recurrance_end_time`,
			`estimated_time`,
			`status`) VALUES (
			'" . $task_id . "',
			'" . $scheduled_time . "',
			" . $recurring . ",
			'" . $recurrance_type . "',
			" . $recurrance_period . ",
			" . $variance . ",
			'" . $recurrance_end_date . "',
			'" . $estimated_time . "',
			'Incomplete')";

		$success = mysql_query($sql, $this -> database_link);
		
		if (!$success) {
			$return_json['success'] = 'false';
			$return_json['debug'] = $sql;
			return $return_json;
		}
		
		$sql = "SELECT * FROM `task_targets` WHERE 
			`task_id` = ".$task_id." AND 
			`scheduled_time` =  '".$scheduled_time."' AND 
			`recurring` =  ".$recurring." AND 
			`recurrance_type` =  '".$recurrance_type."' AND 
			`recurrance_period` = ".$recurrance_period." AND 
			`allowed_variance` = ".$variance." AND 
			`recurrance_end_time` = '".$recurrance_end_date."' AND 
			`estimated_time` = ".$estimated_time;
		
		$result = mysql_query($sql, $this -> database_link);
		
		if (!$result) {
			$return_json['success'] = 'false';
			$return_json['debug'] = "SQL select failed." . $sql;
			return $return_json;
		}
		
		$num = mysql_numrows($result);
		
		if($num > 0)
		{
			$task_schedule_id = mysql_result($result, 0, "task_schedule_id");
			$local_return_json = $this->Insert_Recurring_Children($task_schedule_id);
		}
		else {
			$return_json['success'] = 'false';
			$return_json['debug'] = "Number of rows = 0. " . $sql;
			return $return_json;
		}
		
		$return_json['debug'] = $local_return_json['debug'];

		if ($local_return_json['success'] === 'true') {
			$return_json['success'] = 'true';
		} else {
			$return_json['success'] = 'false';
		}

		return $return_json;
	}
	
	public function Update_Task_Target($task_target_id, $task_id, $scheduled_time, $recurring, $recurrance_type, $recurrance_period, $variance, $estimated_time, $recurrance_end_date, $status)
	{
		$return_json = array('success' => 'false', );

		$scheduled_time = mysql_real_escape_string($scheduled_time);
		$recurring = mysql_real_escape_string($recurring);
		$recurrance_type = mysql_real_escape_string($recurrance_type);
		$recurrance_period = mysql_real_escape_string($recurrance_period);
		$variance = mysql_real_escape_string($variance);
		$estimated_time = mysql_real_escape_string($estimated_time);
		$recurrance_end_date = mysql_real_escape_string($recurrance_end_date);
		$status = mysql_real_escape_string($status);
		
		$sql = "UPDATE `task_targets` SET 
			`task_id`=".$task_id.",
			`scheduled_time`='".$scheduled_time."',
			`recurring`=".$recurring.",
			`recurrance_type`='".$recurrance_type."',
			`recurrance_period`=".$recurrance_period.",
			`allowed_variance`=".$variance.",
			`estimated_time`=".$estimated_time.",
			`recurrance_end_time`='".$recurrance_end_date."',
			`status`='".$status."'
			WHERE `task_schedule_id`=" . $task_target_id . "";

		$success = mysql_query($sql, $this -> database_link);
		
		if(!$success){
			
			$return_json['success'] = 'false';
			$return_json['debug'] = "SQL select failed." . $sql;
			return $return_json;
			
		}
		
		
		$local_return_json = $this->Update_Recurring_Children($task_target_id, $task_id, $scheduled_time, $recurring, $recurrance_type, $recurrance_period, $variance, $estimated_time, $recurrance_end_date);
		
		$return_json['debug'] = $local_return_json['debug'];		

		if ($local_return_json['success'] === 'true') {
			$return_json['success'] = 'true';
		} else {
			$return_json['success'] = 'false';
		}

		return $return_json;
	}

	public function Delete_Task_Target($task_target_id)
	{
		$return_json = array('success' => 'false', );

		$sql = "DELETE FROM `task_targets` WHERE `task_schedule_id` = " . $task_target_id . "";

		$success = mysql_query($sql, $this -> database_link);

		$this->Delete_Recurring_Children($task_target_id);
		
		$return_json['debug'] = $sql;

		if ($success) {
			$return_json['success'] = 'true';
		} else {
			$return_json['success'] = 'false';
		}

		return $return_json;
	}
	
	public function Break_Recuring_Child($task_target_id, $continue_recurrance=0)
	{
		$return_json = array('success' => 'false', );
		
		//get child columns
		$sql = "SELECT 
			`task_targets`.`scheduled_time` AS `scheduled_time`,
			`task_targets`.`recurrance_child_id` AS `recurrance_child_id`
			FROM `task_targets`
			WHERE `task_targets`.`task_schedule_id` = ".$task_target_id;
		$result = mysql_query($sql, $this -> database_link);
		$num = mysql_numrows($result);
		
		if($num != 1){
			
			$return_json['debug'] = $sql;
			return $return_json;
		}
		
		$task_start_time = mysql_result($result, 0, "scheduled_time");
		$recurrance_child_id = mysql_result($result, 0, "recurrance_child_id");
		
		//get parent columns
		$sql = "SELECT 
			`task_targets`.`task_id` AS `task_id`,
			`task_targets`.`task_schedule_id` AS `task_schedule_id`, 
			`task_targets`.`scheduled_time` AS `scheduled_time`, 
			`task_targets`.`recurring` AS `recurring`, 
			`task_targets`.`recurrance_type` AS `recurrance_type`, 
			`task_targets`.`recurrance_period` AS `recurrance_period`, 
			`task_targets`.`recurrance_type` AS `recurrance_type`, 
			`task_targets`.`allowed_variance` AS `allowed_variance`, 
			`task_targets`.`estimated_time` AS `estimated_time`,
			`task_targets`.`recurrance_end_time` AS `recurrance_end_time`,
			`task_targets`.`recurrance_child_id` AS `recurrance_child_id`,
			`task_targets`.`status` AS `status`
			FROM `task_targets`
			WHERE `task_targets`.`task_schedule_id` = ".$recurrance_child_id;
		$result = mysql_query($sql, $this -> database_link);
		$num = mysql_numrows($result);
		
		if($num != 1){
			
			$return_json['debug'] = $sql;
			return $return_json;
		}
		
		$parent_task_id = mysql_result($result, 0, "task_id");
		$parent_task_schedule_id = mysql_result($result, 0, "task_schedule_id");
		$parent_scheduled_time = mysql_result($result, 0, "scheduled_time");
		$parent_recurring = mysql_result($result, 0, "recurring");
		$parent_recurrance_type = mysql_result($result, 0, "recurrance_type");
		$parent_recurrance_period = mysql_result($result, 0, "recurrance_period");
		$parent_allowed_variance = mysql_result($result, 0, "allowed_variance");
		$parent_estimated_time = mysql_result($result, 0, "estimated_time");
		$parent_recurrance_end_time = mysql_result($result, 0, "recurrance_end_time");
		$parent_recurrance_child_id = mysql_result($result, 0, "recurrance_child_id");
		$parent_status = mysql_result($result, 0, "status");
		$parent_recurrance_child_id = mysql_result($result, 0, "recurrance_child_id");
		
		
		//break the child from the parent
		$sql = "UPDATE `task_targets`
			SET 
			`task_targets`.`recurrance_child_id` = 0,
			`task_targets`.`recurring` = 0
			WHERE `task_targets`.`task_schedule_id` = ".$task_target_id;
		$result = mysql_query($sql, $this -> database_link);
		
		if(!$result){
			
			$return_json['debug'] = $sql;
			return $return_json;
		}
		
		if($continue_recurrance != 0)
		{
			//get the next recurring child
			$sql = "SELECT 
				`task_targets`.`task_schedule_id` AS `task_schedule_id`,
				`task_targets`.`scheduled_time` AS `scheduled_time`
				FROM `task_targets`
				WHERE `task_targets`.`recurrance_child_id` = ".$recurrance_child_id."
				AND `task_targets`.`scheduled_time` > '".$task_start_time."'
				ORDER BY `task_targets`.`scheduled_time`
				LIMIT 1";
			
			$result = mysql_query($sql, $this -> database_link);
			
			if(!$result)
			{
				
				$return_json['debug'] = $sql;
				return $return_json;
			}
			
			$num = mysql_numrows($result);
			
			//if there are any recurring children after this target
			if($num > 0)
			{
				$task_schedule_id = mysql_result($result, 0, "task_schedule_id");
				$task_schedule_time = mysql_result($result, 0, "scheduled_time");
				
				//break the next child from the parent
				$sql = "UPDATE `task_targets`
				SET 
				`task_targets`.`recurrance_child_id` = 0,
				`task_targets`.`recurrance_end_time` = '".$parent_recurrance_end_time."'
				WHERE 
				`task_targets`.`task_schedule_id` = ".$task_schedule_id;
				$result = mysql_query($sql, $this -> database_link);
				
				if(!$result){
					
					$return_json['debug'] = $sql;
					return $return_json;
				}
				
				//update all children parents to next child parent
				$sql = "UPDATE `task_targets`
					SET `task_targets`.`recurrance_child_id` = ".$task_schedule_id."
					WHERE 
					`task_targets`.`scheduled_time` > '".$task_start_time."'
					AND `task_targets`.`recurrance_child_id` = ".$recurrance_child_id;
				$result = mysql_query($sql, $this -> database_link);
				
				if(!$result){
					
					$return_json['debug'] = $sql;
					return $return_json;
				}
				
				//update all next child recurring children
				$this->Update_Recurring_Children(
					$task_schedule_id,
					$parent_task_id,
					$task_schedule_time,
					$parent_recurring,
					$parent_recurrance_type,
					$parent_recurrance_period,
					$parent_allowed_variance,
					$parent_estimated_time,
					$parent_recurrance_end_time);
			}
			
		}
		
		//update the parent target
		$sql = "UPDATE `task_targets`
			SET `task_targets`.`recurrance_end_time` = '".$task_start_time."'
			WHERE `task_targets`.`task_schedule_id` = ".$recurrance_child_id;
		$result = mysql_query($sql, $this -> database_link);
		
		if(!$result){
			
			$return_json['debug'] = $sql;
			return $return_json;
		}
		
		//update all children
		$this->Update_Recurring_Children(
			$parent_task_schedule_id,
			$parent_task_id,
			$parent_scheduled_time,
			$parent_recurring,
			$parent_recurrance_type,
			$parent_recurrance_period,
			$parent_allowed_variance,
			$parent_estimated_time,
			$task_start_time);
		
		$return_json['success'] = 'true';
		
		return $return_json;
	}
	
	public function Insert_Recurring_Children($task_target_id)
	{
		$return_json = array('success' => 'false', );
		
		$sql = "SELECT 
			`task_targets`.`task_id` AS `task_id`,
			`task_targets`.`task_schedule_id` AS `task_schedule_id`, 
			`task_targets`.`scheduled_time` AS `scheduled_time`, 
			`task_targets`.`recurring` AS `recurring`, 
			`task_targets`.`recurrance_type` AS `recurrance_type`, 
			`task_targets`.`recurrance_period` AS `recurrance_period`, 
			`task_targets`.`recurrance_type` AS `recurrance_type`, 
			`task_targets`.`allowed_variance` AS `allowed_variance`, 
			`task_targets`.`estimated_time` AS `estimated_time`,
			`task_targets`.`recurrance_end_time` AS `recurrance_end_time`,
			`task_targets`.`recurrance_child_id` AS `recurrance_child_id`
			FROM `task_targets`
			WHERE `task_targets`.`task_schedule_id` = ".$task_target_id."
			ORDER BY `task_targets`.`scheduled_time` DESC";
			
		$result = mysql_query($sql, $this -> database_link);
		
		if(!$result){
			
			$return_json['debug'] = $sql;
			return $return_json;
			
		} 
		
		$num = mysql_numrows($result);

		$i = 0;
		if ($num > 0) {
			
			$task_schedule_id = mysql_result($result, $i, "task_schedule_id");
			$task_entry_scheduled_time = mysql_result($result, $i, "scheduled_time");
			$task_entry_recurring = mysql_result($result, $i, "recurring");
			$task_entry_recurrance_type = mysql_result($result, $i, "recurrance_type");
			$task_entry_recurrance_period = mysql_result($result, $i, "recurrance_period");
			$variance = mysql_result($result, $i, "allowed_variance");
			$estimated_time = mysql_result($result, $i, "estimated_time");
			$recurrance_end_time = mysql_result($result, $i, "recurrance_end_time");
			$status = mysql_result($result, $i, "status");
			$task_id = mysql_result($result, $i, "task_id");
			$recurrance_child_id = mysql_result($result, $i, "recurrance_child_id");
			
			if($task_entry_recurring && $recurrance_child_id == 0)
			{
				$recurring_timestamp = strtotime($task_entry_scheduled_time);
				$recurrance_end_timestamp = strtotime($recurrance_end_time);
				
				$recurrance_period_seconds = (int)$task_entry_recurrance_period * 60 * 60;
				
				while($recurring_timestamp < $recurrance_end_timestamp)
				{
					
					$recurring_timestamp = $recurring_timestamp + $recurrance_period_seconds;
					
					$recurring_timestring = date("Y-m-d H:i:s", $recurring_timestamp);
					
					$sql = "INSERT INTO `task_targets`(
						`task_id`, 
						`scheduled_time`, 
						`recurring`, 
						`recurrance_type`, 
						`recurrance_period`,
						`allowed_variance`,
						`recurrance_end_time`,
						`estimated_time`,
						`recurrance_child_id`,
						`status`) VALUES (
						'" . $task_id . "',
						'" . $recurring_timestring . "',
						" . $task_entry_recurring . ",
						'" . $task_entry_recurrance_type . "',
						" . $task_entry_recurrance_period . ",
						" . $variance . ",
						'" . $recurring_timestring . "',
						'" . $estimated_time . "',
						" . $task_schedule_id . ",
						'Incomplete')";
					
					$result = mysql_query($sql, $this -> database_link);
					
					if(!$result){
						
						
						$return_json['debug'] = $sql;
						return $return_json;
						
					} 
				}
			}
						
		}
		else {
			
			$return_json['debug'] = $sql;
			return $return_json;
			
		}
		
		$return_json['success'] = 'true';
		return $return_json;
	}
	
	public function Update_Recurring_Children($task_target_id, $new_task_id, $new_scheduled_time, $new_recurring, $new_recurrance_type, $new_recurrance_period, $new_variance, $new_estimated_time, $new_recurrance_end_date)
	{
		$new_scheduled_time = mysql_real_escape_string($new_scheduled_time);
		$new_recurring = mysql_real_escape_string($new_recurring);
		$new_recurrance_type = mysql_real_escape_string($new_recurrance_type);
		$new_recurrance_period = mysql_real_escape_string($new_recurrance_period);
		$new_variance = mysql_real_escape_string($new_variance);
		$new_estimated_time = mysql_real_escape_string($new_estimated_time);
		$new_recurrance_end_date = mysql_real_escape_string($new_recurrance_end_date);	
		
		if($new_recurring)
		{
			$sql = "SELECT 
			`task_targets`.`task_id` AS `task_id`,
			`task_targets`.`task_schedule_id` AS `task_schedule_id`, 
			`task_targets`.`scheduled_time` AS `scheduled_time`, 
			`task_targets`.`recurring` AS `recurring`, 
			`task_targets`.`recurrance_type` AS `recurrance_type`, 
			`task_targets`.`recurrance_period` AS `recurrance_period`, 
			`task_targets`.`recurrance_type` AS `recurrance_type`, 
			`task_targets`.`allowed_variance` AS `allowed_variance`, 
			`task_targets`.`estimated_time` AS `estimated_time`,
			`task_targets`.`recurrance_end_time` AS `recurrance_end_time`,
			`task_targets`.`recurrance_child_id` AS `recurrance_child_id`
			FROM `task_targets`
			WHERE `task_targets`.`recurrance_child_id` = ".$task_target_id."
			ORDER BY `task_targets`.`scheduled_time` ASC";
			
			$result = mysql_query($sql, $this -> database_link);
			
			if(!$result){
				
				$return_json['debug'] = $sql;
				return $return_json;
				
			} 
			
			$num = mysql_numrows($result);
	
			$i = 0;
			
			$recurring_timestamp = strtotime($new_scheduled_time);
			$recurrance_end_timestamp = strtotime($new_recurrance_end_date);
			
			$recurrance_period_seconds = (int)$new_recurrance_period * 60 * 60;
			
			while($i < $num || $recurring_timestamp < $recurrance_end_timestamp){
					
				
				$recurring_timestamp = $recurring_timestamp + $recurrance_period_seconds;
				$recurring_timestring = date("Y-m-d H:i:s", $recurring_timestamp);
				
				if($i < $num){
					
					$task_schedule_id = mysql_result($result, $i, "task_schedule_id");
					$task_entry_scheduled_time = mysql_result($result, $i, "scheduled_time");
					$task_entry_recurring = mysql_result($result, $i, "recurring");
					$task_entry_recurrance_type = mysql_result($result, $i, "recurrance_type");
					$task_entry_recurrance_period = mysql_result($result, $i, "recurrance_period");
					$variance = mysql_result($result, $i, "allowed_variance");
					$estimated_time = mysql_result($result, $i, "estimated_time");
					$recurrance_end_time = mysql_result($result, $i, "recurrance_end_time");
					$status = mysql_result($result, $i, "status");
					$task_id = mysql_result($result, $i, "task_id");
					$recurrance_child_id = mysql_result($result, $i, "recurrance_child_id");
					
					if($recurring_timestamp < $recurrance_end_timestamp)
					{
					
						$sql = "UPDATE `task_targets` SET
							`task_id` = '" . $new_task_id . "',
							`scheduled_time` = '" . $recurring_timestring . "',
							`recurring` = " . $task_entry_recurring . ",
							`recurrance_type` = '" . $new_recurrance_type . "',
							`recurrance_period` = " . $new_recurrance_period . ",
							`allowed_variance` = " . $new_variance . ",
							`recurrance_end_time` = '" . $recurring_timestring . "',
							`estimated_time` = '" . $new_estimated_time . "',
							`recurrance_child_id` = " . $task_target_id . "
							WHERE 
							`task_schedule_id` = " . $task_schedule_id . "";
						
						$success = mysql_query($sql, $this -> database_link);
						
						if(!$success){
							
							
							$return_json['debug'] = $sql;
							return $return_json;
							
						} 
					}
					else {
						
						$sql = "DELETE FROM `task_targets` WHERE 
							`task_schedule_id` = " . $task_schedule_id . "";
						
						$success = mysql_query($sql, $this -> database_link);
						
						if(!$success){
							
							
							$return_json['debug'] = $sql;
							return $return_json;
							
						} 
						
					}
				}
				else{
							
					if($recurring_timestamp < $recurrance_end_timestamp)
					{
						$sql = "INSERT INTO `task_targets`(
							`task_id`, 
							`scheduled_time`, 
							`recurring`, 
							`recurrance_type`, 
							`recurrance_period`,
							`allowed_variance`,
							`recurrance_end_time`,
							`estimated_time`,
							`recurrance_child_id`,
							`status`) VALUES (
							'" . $new_task_id . "',
							'" . $recurring_timestring . "',
							" . $new_recurring . ",
							'" . $new_recurrance_type . "',
							" . $new_recurrance_period . ",
							" . $new_variance . ",
							'" . $recurring_timestring . "',
							'" . $new_estimated_time . "',
							" . $task_target_id . ",
							'Incomplete')";
						
						$result = mysql_query($sql, $this -> database_link);
						
						if(!$result){
							
							
							$return_json['debug'] = $sql;
							return $return_json;
							
						} 
					}
				}
				
				
				$i++;
			}
		}
		
		
		
		$return_json['success'] = 'true';
		return $return_json;
	}
	
	public function Delete_Recurring_Children($task_target_id)
	{
		
		$sql = "DELETE FROM `task_targets` WHERE `recurrance_child_id` = " . $task_target_id . "";
		$result = mysql_query($sql, $this -> database_link);
	}
}
?>
