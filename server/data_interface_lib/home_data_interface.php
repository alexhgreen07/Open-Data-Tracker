<?php

class Home_Data_Interface {

	//this will store the open database link
	private $database_link;

	public function Home_Data_Interface($new_database_link) {

		//note this is expected to be initialized and open to the proper database
		$this -> database_link = $new_database_link;

	}

	public function Get_Home_Data_Summary() {
		$return_json = array('authenticated' => 'false', 'success' => 'false', 'html' => '', );

		$return_json['html'] .= $this -> Get_Started_Task_Summary();
		$return_json['html'] .= $this -> Get_Scheduled_Task_Summary();
		$return_json['html'] .= $this -> Get_Floating_Task_Summary();
		$return_json['html'] .= $this -> Get_Aggregate_Summary();

		return $return_json;
	}

	private function Get_Floating_Task_Summary() {
		$return_html = '';

		$sql = "SELECT 
			`tasks`.`task_id` AS `task_id`,
			`tasks`.`name` AS `name`, 
			`tasks`.`recurring` AS `recurring`,
			`tasks`.`recurrance_period` AS `recurrance_period`,
			`tasks`.`estimated_time` AS `estimated_time`
			FROM `tasks` 
			WHERE `tasks`.`schedule_type` = 'Floating' 
			AND `tasks`.`status` != 'Completed'
			ORDER BY `tasks`.`recurring` DESC, `tasks`.`name`";

		$result = mysql_query($sql, $this -> database_link);
		$num = mysql_numrows($result);

		$return_html .= '
			<b>Valid Floating Tasks</b> <br />
			<table border="1" style="width:100%;">
			<tr>
			<td><b>Task Name</b></td>
			<td><b>Recurring</b></td>
			<td><b>Estimated Time</b></td>
			</tr>';

		$i = 0;
		while ($i < $num) {

			$task_is_valid = true;

			$task_id = mysql_result($result, $i, 'task_id');
			$task_name = mysql_result($result, $i, "name");
			$task_is_recurring = mysql_result($result, $i, "recurring");
			$task_recurrance_period = mysql_result($result, $i, 'recurrance_period');
			$task_elapsed = mysql_result($result, $i, "estimated_time");

			if ($task_is_recurring) {
				$sql = "SELECT `task_log_id`, `start_time` 
					FROM `task_log` 
					WHERE `task_id` = " . $task_id . " AND
					`status` = 'Completed' AND
					TIMESTAMPADD(HOUR," . $task_recurrance_period . " + `hours`, `start_time`) > NOW()";

				$inner_result = mysql_query($sql, $this -> database_link);
				$inner_num = mysql_numrows($inner_result);

				if ($inner_num > 0) {
					//task has already been completed within the recurrance period
					$task_is_valid = false;
				}

			}

			if ($task_is_valid) {

				$return_html .= '<tr>';

				$return_html .= '<td>' . $task_name . "</td>";
				$return_html .= '<td>' . $task_is_recurring . "</td>";
				$return_html .= '<td>' . round($task_elapsed, 2) . "</td>";

				$return_html .= '</tr>';

			}

			$i++;
		}

		$return_html .= '</table><br />';

		return $return_html;
	}

	private function Get_Scheduled_Task_Summary() {
		$return_html = '';

		$sql = "SELECT 
			`tasks`.`task_id` AS `task_id`,
			`tasks`.`name` AS `name`, 
			`tasks`.`scheduled_time` AS `scheduled_time`,
			`tasks`.`estimated_time` AS `estimated_time`,
			`tasks`.`recurring` AS `recurring`,
			`tasks`.`recurrance_type` AS `recurrance_type`,
			`tasks`.`recurrance_period` AS `recurrance_period`,
			(TIMESTAMPDIFF(SECOND,NOW( ), `tasks`.`scheduled_time`) / 60 / 60) AS `time_to`
			FROM `tasks` 
			WHERE `tasks`.`schedule_type` = 'Scheduled' 
			AND `tasks`.`status` != 'Completed'
			AND (TIMESTAMPDIFF(SECOND,NOW( ), `tasks`.`scheduled_time`) / 60 / 60) < 24
			ORDER BY `tasks`.`scheduled_time`, `tasks`.`name`";

		$result = mysql_query($sql, $this -> database_link);
		$num = mysql_numrows($result);

		$return_html .= '
			<b>Upcoming Scheduled Tasks (Next 24 Hours)</b> <br />
			<table border="1" style="width:100%;">
			<tr>
			<td><b>Task Name</b></td>
			<td><b>Scheduled Time</b></td>
			<td><b>Time To (hh:mm)</b></td>
			<td><b>Estimated Time</b></td>
			</tr>';

		$i = 0;
		while ($i < $num) {

			$is_upcoming_task = true;

			$task_id = mysql_result($result, $i, "task_id");
			$task_name = mysql_result($result, $i, "name");
			$task_scheduled_time = mysql_result($result, $i, "scheduled_time");
			$task_time_to = mysql_result($result, $i, "time_to");
			$task_elapsed = mysql_result($result, $i, "estimated_time");
			$task_recurring = mysql_result($result, $i, "recurring");
			$task_recurrance_period = mysql_result($result, $i, 'recurrance_period');
			$task_recurrance_type = mysql_result($result, $i, 'recurrance_type');

			//check if the task is recurring
			if ($task_recurring) {
				//check if the task has been completed recently
				$inner_sql = "SELECT 
					(TIMESTAMPDIFF(SECOND,NOW( ), `start_time`) / 60 / 60) AS `time_since`
					FROM `task_log` 
					WHERE `task_id` = '" . $task_id . "' 
					AND `status` = 'Completed'";

				$inner_result = mysql_query($inner_sql, $this -> database_link);
				$inner_num = mysql_numrows($inner_result);

				$j = 0;
				while ($j < $inner_num) {

					$time_since = mysql_result($inner_result, $j, "time_since");

					//check if the task has been executed in the recurrance period.
					if ($time_since < ($task_recurrance_period / 2)) {
						$is_upcoming_task = false;
						break;
					}

					$j++;
				}

				//if it is a valid upcoming task
				if ($is_upcoming_task && $inner_num > 0) {
					//correct the scheduled time according to the recurrance period

					$task_scheduled_timestamp = strtotime($task_scheduled_time);
					$current_timestamp = time();

					while ($task_scheduled_timestamp < $current_timestamp) {

						$task_scheduled_timestamp += (60 * 60 * $task_recurrance_period);

					}

					$task_scheduled_time = date('Y-m-d H:i:s', $task_scheduled_timestamp);
					$task_time_to = ($task_scheduled_timestamp - time()) / 60 / 60;
				}

			}

			if ($is_upcoming_task) {

				$return_html .= '<tr>';

				$return_html .= '<td>' . $task_name . "</td>";
				$return_html .= '<td>' . $task_scheduled_time . "</td>";

				if ($task_time_to >= 0) {
					$return_html .= '<td>' . floor($task_time_to) . ":" . floor(($task_time_to * 60) % 60) . "</td>";
				} else {
					$task_time_to = -$task_time_to;
					$return_html .= '<td>' . floor($task_time_to) . ":" . floor(($task_time_to * 60) % 60) . " (late)</td>";
				}

				$return_html .= '<td>' . round($task_elapsed, 2) . "</td>";

				$return_html .= '</tr>';

			}

			$i++;
		}

		$return_html .= '</table><br />';

		return $return_html;
	}

	private function Get_Started_Task_Summary() {
		$return_html = '';

		$sql = "SELECT 
			`tasks`.`name` AS `name`, 
			`task_log`.`start_time` AS `start_time`,
			(TIMESTAMPDIFF(SECOND, `task_log`.`start_time`, NOW( ) ) / 60 / 60) AS `elapsed`
			FROM `task_log`, `tasks` 
			WHERE `task_log`.`status` = 'Started' 
			AND `task_log`.`task_id` = `tasks`.`task_id`";

		$result = mysql_query($sql, $this -> database_link);
		$num = mysql_numrows($result);

		$return_html .= '
			<b>Started Tasks</b> <br />
			<table border="1" style="width:100%;">
			<tr>
			<td><b>Task Name</b></td>
			<td><b>Start Time</b></td>
			<td><b>Elapsed (hh:mm)</b></td>
			</tr>';

		$i = 0;
		while ($i < $num) {

			$return_html .= '<tr>';

			$task_name = mysql_result($result, $i, "name");
			$task_start_time = mysql_result($result, $i, "start_time");
			$task_elapsed = mysql_result($result, $i, "elapsed");

			$return_html .= '<td>' . $task_name . "</td>";
			$return_html .= '<td>' . $task_start_time . "</td>";
			$return_html .= '<td>' . floor($task_elapsed) . ":" . floor(($task_elapsed * 60) % 60) . "</td>";

			$return_html .= '</tr>';

			$i++;
		}

		$return_html .= '</table><br />';

		return $return_html;
	}

	private function Get_Aggregate_Summary() {
		$titles_and_queries = array("1 Day Item Totals:" => "SELECT `unit` AS `name`, SUM( `value` ) AS `agg_value` 
				FROM `item_log`, `items` 
				WHERE DATEDIFF( NOW( ) , `time` ) < 1 
				AND `item_log`.`item_id` = `items`.`item_id`
				GROUP BY `unit`", "1 Day Task Totals:" => "SELECT `tasks`.`name` AS `name`, SUM(`task_log`.`hours`) AS `agg_value` 
			FROM `task_log`, `tasks` 
			WHERE `task_log`.`task_id` = `tasks`.`task_id` 
			AND DATEDIFF( NOW( ) , `task_log`.`start_time` ) < 1 GROUP BY `tasks`.`name`", );

		$return_html = '';

		foreach ($titles_and_queries as $title => $query) {

			$return_html .= '
			<b>' . $title . '</b> <br />
			<table border="1" style="width:100%;">
			<tr><td><b>Unit</b></td><td><b>Aggregate</b></td></tr>';

			$result = mysql_query($query, $this -> database_link);
			$num = mysql_numrows($result);

			$i = 0;
			while ($i < $num) {

				$return_html .= '<tr>';

				$field1_name = mysql_result($result, $i, "name");
				$field2_name = mysql_result($result, $i, "agg_value");

				$return_html .= '<td style="width:50%;">' . $field1_name . "</td>";
				$return_html .= '<td style="width:50%;">' . round($field2_name, 2) . "</td>";

				$return_html .= '</tr>';

				$i++;
			}

			$return_html .= '</table><br />';

		}

		return $return_html;
	}

}
?>
