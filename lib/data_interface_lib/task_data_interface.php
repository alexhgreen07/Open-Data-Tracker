<?php

class Task_Data_Interface {

	//this will store the open database link
	private $database_link;

	public function Task_Data_Interface($new_database_link) {

		//note this is expected to be initialized and open to the proper database
		$this -> database_link = $new_database_link;

	}

	public function Insert_Task_Entry($start_time, $task_id, $hours, $completed, $status, $note) {

		$return_json = array('authenticated' => 'false', 'success' => 'false', );

		$start_time = mysql_real_escape_string($start_time);
		$task_id = mysql_real_escape_string($task_id);
		$hours = mysql_real_escape_string($hours);
		$completed = mysql_real_escape_string($completed);
		$note = mysql_real_escape_string($note);

		try {

			if ($completed) {
				$status = "Completed";

				$sql = "UPDATE `tasks` SET `status`='Completed' WHERE `task_id` = " . $task_id . " AND `recurring` != 1";

				$success = mysql_query($sql, $this -> database_link);

				if (!$success) {
					throw new Exception('SQL error.');
				}

			} else {
				//$status = "Stopped";
			}

			$sql = "INSERT INTO `task_log`(`task_id`, `start_time`,`hours`, `status`, `note`) VALUES ('" . $task_id . "','" . $start_time . "','" . $hours . "', '" . $status . "','" . $note . "')";

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

	public function Update_Task_Entry($task_log_id, $task_id, $start_time, $hours, $completed, $status, $note) {

		$return_json = array('authenticated' => 'false', 'success' => 'false', );

		$task_log_id = mysql_real_escape_string($task_log_id);
		$start_time = mysql_real_escape_string($start_time);
		$task_id = mysql_real_escape_string($task_id);
		$hours = mysql_real_escape_string($hours);
		$completed = mysql_real_escape_string($completed);
		$status = mysql_real_escape_string($status);
		$note = mysql_real_escape_string($note);

		try {

			if ($completed) {
				$status = "Completed";

				$sql = "UPDATE `tasks` SET `status`='Completed' WHERE `task_id` = " . $task_id . " AND `recurring` != 1";

				$success = mysql_query($sql, $this -> database_link);

				if (!$success) {
					throw new Exception('SQL error.');
				}

			} else {
				//$status = "Stopped";
			}

			$sql = "UPDATE `task_log` 
				SET `task_id`=" . $task_id . ",
				`start_time`=" . $start_time . ",
				`hours`=" . $hours . ",
				`status`='" . $status . "',
				`note`='" . $note . "'
				WHERE `task_log_id` = " . $task_log_id . "";

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

	public function Get_Start_Stop_Task_Names() {
		$return_json = array('authenticated' => 'false', 'success' => 'false', 'items' => array(), );

		if (Is_Session_Authorized()) {

			$return_json['authenticated'] = 'true';

			$sql_query = "SELECT DISTINCT `task_id`,`name`,`date_created`, `recurring`, `recurrance_period`, `scheduled_time`, `estimated_time` 
				FROM `life_management`.`tasks` 
				WHERE `status` != 'Completed' ORDER BY `name`";
			$result = mysql_query($sql_query, $this -> database_link);

			if ($result) {
				$return_json['success'] = 'true';

				$num = mysql_numrows($result);

				$i = 0;
				while ($i < $num) {

					$item_name = mysql_result($result, $i, "name");
					$task_id = mysql_result($result, $i, "task_id");
					$date_created = mysql_result($result, $i, 'date_created');
					$recurring = mysql_result($result, $i, 'recurring');
					$recurrance_period = mysql_result($result, $i, 'recurrance_period');
					$scheduled_time = mysql_result($result, $i, 'scheduled_time');
					$estimated_time = mysql_result($result, $i, 'estimated_time');

					//check if the task has been started yet
					$inner_sql_query = "SELECT `task_id`, `start_time` 
						FROM `life_management`.`task_log` 
						WHERE `task_id` = " . $task_id . " AND `status` = 'Started'";
					$inner_result = mysql_query($inner_sql_query, $this -> database_link);
					$started_task_count = mysql_numrows($inner_result);

					$status = 'Stopped';

					if ($started_task_count > 0) {
						//fill proper data from query
						$status = 'Started';
						$start_time = mysql_result($inner_result, 0, "start_time");

					} else {
						//fill default data
						$status = 'Stopped';
						$start_time = '';
					}

					if ($item_name != "") {
						$return_json['items'][$i] = array('item_name' => $item_name, 'item_status' => $status, 'task_id' => $task_id, 'date_created' => $date_created, 'recurring' => $recurring, 'recurrance_period' => $recurrance_period, 'scheduled_time' => $scheduled_time, 'estimated_time' => $estimated_time, 'start_time' => $start_time, );

					}

					$i++;
				}
			} else {
				$return_json['success'] = 'false';
			}

		} else {
			$return_json['authenticated'] = 'false';
		}

		return $return_json;
	}

	public function Task_Start_Stop($task_name_to_enter, $task_start_stop, $note) {
		$return_json = array('authenticated' => 'false', 'success' => 'false', );

		$task_name_to_enter = mysql_real_escape_string($task_name_to_enter);
		$task_start_stop = mysql_real_escape_string($task_start_stop);
		$note = mysql_real_escape_string($note);

		$sql_query = "SELECT DISTINCT `task_id` FROM `life_management`.`tasks` WHERE `name` = '" . $task_name_to_enter . "' AND `status` != 'Completed'";
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
				`status` = 'Started'";
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
		$return_json = array('authenticated' => 'false', 'success' => 'false', );

		try {
			$task_name_to_enter = mysql_real_escape_string($task_name_to_enter);
			$task_start_stop = mysql_real_escape_string($task_start_stop);

			//find the task by its name
			$sql_query = "SELECT DISTINCT `task_id`, `recurring` FROM `life_management`.`tasks` WHERE `name` = '" . $task_name_to_enter . "'";
			$result = mysql_query($sql_query, $this -> database_link);

			if (!$result) {
				throw new Exception('SQL error.');
			}

			$task_id = mysql_result($result, 0, "task_id");
			$is_recurring = mysql_result($result, 0, "recurring");

			//if it is not a recurring task, set it to compelete
			if (!$is_recurring) {
				$sql = "UPDATE `tasks` SET `status`='Completed' WHERE `task_id`=" . $task_id;

				//execute insert
				$success = mysql_query($sql, $this -> database_link);

				if (!$success) {
					throw new Exception('SQL error.');
				}
			}

			//insert an entry into the log indicating the task is complete
			$sql = "INSERT INTO `task_log`(`task_id`, `start_time`,`status`) VALUES ('" . $task_id . "',NOW(),'Completed')";

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

	public function Insert_Task($name, $description = "", $estimated_time = 0, $note = "", $status = "Stopped", $schedule_type = "", $scheduled_time = "", $recurring = 0, $recurrance_type = "", $recurrance_period = "") {
		$return_json = array('authenticated' => 'false', 'success' => 'false', );

		$task_name = mysql_real_escape_string($name);
		$task_description = mysql_real_escape_string($description);
		$task_estimated_time = mysql_real_escape_string($estimated_time);
		$task_note = mysql_real_escape_string($note);
		$status = mysql_real_escape_string($status);
		$schedule_type = mysql_real_escape_string($schedule_type);
		$scheduled_time = mysql_real_escape_string($scheduled_time);
		$recurring = mysql_real_escape_string($recurring);
		$recurrance_type = mysql_real_escape_string($recurrance_type);
		$recurrance_period = mysql_real_escape_string($recurrance_period);

		$sql = 'INSERT INTO `life_management`.`tasks` 
			(`name`, 
			`description`, 
			`date_created`, 
			`estimated_time`,
			`status`, 
			`schedule_type`, 
			`scheduled_time`,
			`recurring`,
			`recurrance_type`,
			`recurrance_period`,
			`note`) VALUES (';

		$sql .= "'" . $task_name . "',";
		$sql .= "'" . $task_description . "',";
		$sql .= "NOW(),";
		$sql .= "" . $task_estimated_time . ",";
		$sql .= "'" . $status . "',";
		$sql .= "'" . $schedule_type . "',";
		$sql .= "'" . $scheduled_time . "',";
		$sql .= "" . $recurring . ",";
		$sql .= "'" . $recurrance_type . "',";
		$sql .= "'" . $recurrance_period . "',";
		$sql .= "'" . $task_note . "')";

		$success = mysql_query($sql, $this -> database_link);

		$return_json['debug'] = $sql;

		if ($success) {
			$return_json['success'] = 'true';
		} else {
			$return_json['success'] = 'false';
		}

		return $return_json;
	}

	public function Update_Task($task_id, $name, $category_id, $description, $estimated_time, $note, $status, $schedule_type, $scheduled_time, $recurring, $recurrance_type, $recurrance_period) {
		$return_json = array('authenticated' => 'false', 'success' => 'false', );

		$task_name = mysql_real_escape_string($name);
		$task_description = mysql_real_escape_string($description);
		$task_estimated_time = mysql_real_escape_string($estimated_time);
		$task_note = mysql_real_escape_string($note);
		$status = mysql_real_escape_string($status);
		$schedule_type = mysql_real_escape_string($schedule_type);
		$scheduled_time = mysql_real_escape_string($scheduled_time);
		$recurring = mysql_real_escape_string($recurring);
		$recurrance_type = mysql_real_escape_string($recurrance_type);
		$recurrance_period = mysql_real_escape_string($recurrance_period);

		$sql = "UPDATE `tasks` 
			SET `category_id`=" . $category_id . ",
			`name`='" . $name . "',
			`description`='" . $description . "',
			`estimated_time`=" . $estimated_time . ",
			`status`='" . $status . "',
			`schedule_type`='" . $schedule_type . "',
			`scheduled_time`=" . $scheduled_time . ",
			`recurring`=" . $recurring . ",
			`recurrance_type`='" . $recurrance_type . "',
			`recurrance_period`='" . $recurrance_period . "',
			`note`='" . $note . "' 
			WHERE `task_id`=" . $task_id . "";

		$success = mysql_query($sql, $this -> database_link);

		$return_json['debug'] = $sql;

		if ($success) {
			$return_json['success'] = 'true';
		} else {
			$return_json['success'] = 'false';
		}

		return $return_json;
	}

	public function Get_Tasks() {
		$return_json = array('authenticated' => 'false', 'success' => 'false', 'html' => '', );

		if (Is_Session_Authorized()) {

			$return_json['authenticated'] = 'true';

			$sql_query = "SELECT DISTINCT `name`,`description`,`date_created`,`estimated_time`,`status` FROM `life_management`.`tasks` ORDER BY `name` ASC";
			$result = mysql_query($sql_query, $this -> database_link);

			if ($result) {
				$return_json['success'] = 'true';

				$return_html = '';

				$num = mysql_numrows($result);

				$return_html .= "
				<b>Database Output</b><br>
				<table border='1' style='width:100%;'>";

				$return_html .= "<tr><td>Name</td><td>Description</td><td>Estimated Time (hrs)</td><td>Status</td></tr>";

				$i = 0;
				while ($i < $num) {

					$field1_name = mysql_result($result, $i, "name");
					$field2_name = mysql_result($result, $i, "description");
					$field3_name = mysql_result($result, $i, "estimated_time");
					$field4_name = mysql_result($result, $i, "status");

					$return_html .= "<tr><td>" . $field1_name . "</td><td>" . $field2_name . "</td><td>" . $field3_name . "</td><td>" . $field4_name . "</td></tr>";

					$i++;
				}

				$return_html .= '
				</table>';

				$return_json['html'] = $return_html;
			} else {
				$return_json['success'] = 'false';
			}

		} else {
			$return_json['authenticated'] = 'false';
		}

		return $return_json;
	}

	public function Get_Task_Log() {

		$return_json = array('authenticated' => 'false', 'success' => 'false', 'html' => '', );

		$return_html = '';

		$query = "SELECT `tasks`.`name` AS `name`, `task_log`.`start_time` AS `start_time`, `task_log`.`hours` AS `hours`, `task_log`.`status` AS `status`, `task_log`.`note` AS `note`
			FROM `tasks` , `task_log`
			WHERE `tasks`.`task_id` = `task_log`.`task_id` 
			ORDER BY `task_log`.`start_time` DESC";
		$result = mysql_query($query, $this -> database_link);

		$num = mysql_numrows($result);

		$return_html .= "
		<b>Database Output</b><br>
		<table border='1' style='width:100%;'>";

		$return_html .= "<tr><td>Name</td><td>Start Time</td><td>Duration (Hours)</td><td>Status</td><td>Note</td></tr>";

		$i = 0;
		while ($i < $num) {

			$task_entry_name = mysql_result($result, $i, "name");
			$task_entry_start_time = mysql_result($result, $i, "start_time");
			$task_entry_hours = mysql_result($result, $i, "hours");
			$task_entry_note = mysql_result($result, $i, "note");
			$task_entry_status = mysql_result($result, $i, "status");

			$return_html .= "<tr><td>" . $task_entry_name . "</td><td>" . $task_entry_start_time . "</td><td>" . $task_entry_hours . "</td><td>" . $task_entry_status . "</td><td>" . $task_entry_note . "</td></tr>";

			$i++;
		}

		$return_html .= '
		</table>';

		$return_json['html'] = $return_html;

		return $return_json;
	}

}
?>
