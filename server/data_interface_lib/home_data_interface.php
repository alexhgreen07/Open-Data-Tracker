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
		
		$scheduled_task_summary = $this -> Get_Scheduled_Task_Summary();
		$recurring_task_summary = $this -> Get_Floating_Task_Summary();
		
		$return_json['html'] .= $this -> Get_Started_Task_Summary();
		$return_json['html'] .= 
			$this -> Get_Total_Task_Summary(
			$scheduled_task_summary['hours_total'],
			$recurring_task_summary['hours_total']);
		$return_json['html'] .= $scheduled_task_summary['html'];
		$return_json['html'] .= $recurring_task_summary['html'];
		$return_json['html'] .= $this -> Get_Untargetted_Task_Summary();
		$return_json['html'] .= $this -> Get_Aggregate_Summary();

		return $return_json;
	}

	public function Get_Categories()
	{
		$return_json = array('authenticated' => 'false', 'success' => 'false', );
		
		if (Is_Session_Authorized()) {

			$return_json['authenticated'] = 'true';

			$sql_query = "SELECT 
				`a`.`category_id` AS `category_id`, 
				`a`.`name` AS `name`, 
				`a`.`description` AS `description`, 
				`a`.`parent_category_id` AS `parent_category_id`,
				`b`.`name` AS `parent_category_name` 
				FROM `categories` `a` 
				LEFT JOIN `categories` `b` 
				ON (`b`.`category_id` = `a`.`parent_category_id`) 
				ORDER BY `b`.`name`";
			$result = mysql_query($sql_query, $this -> database_link);

			if ($result) {
				$return_json['success'] = 'true';
				
				$return_json['data'] = array();
				
				$num = mysql_numrows($result);

				$i = 0;
				while ($i < $num) {

					$category_id = mysql_result($result, $i, "category_id");
					$name = mysql_result($result, $i, "name");
					$description = mysql_result($result, $i, 'description');
					$parent_category_id = mysql_result($result, $i, 'parent_category_id');
					$parent_category_name = mysql_result($result, $i, 'parent_category_name');
					
					$return_json['data'][$i] = 
						array(
						'category_id' => $category_id, 
						'name' => $name, 
						'description' => $description, 
						'parent_category_id' => $parent_category_id,
						'parent_category_name' => $parent_category_name);

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
	
	public function Insert_Category($name, $description, $parent_category_id){
		
		$return_json = array('authenticated' => 'false', 'success' => 'false', );
		
		
		if (Is_Session_Authorized()) {

			$return_json['authenticated'] = 'true';

			$sql_query = "INSERT INTO `categories`
				(`member_id`, 
				`name`, 
				`description`, 
				`parent_category_id`) 
				VALUES 
				(0,
				'".$name."',
				'".$description."',
				".$parent_category_id.")";
				
			$result = mysql_query($sql_query, $this -> database_link);

			if ($result) {
				$return_json['success'] = 'true';

			} else {
				$return_json['success'] = 'false';
			}

		} else {
			$return_json['authenticated'] = 'false';
		}
		
		return $return_json;
	}
	
	public function Update_Category($category_id, $name, $description, $parent_category_id){
		
		$return_json = array('authenticated' => 'false', 'success' => 'false', );
		
		
		if (Is_Session_Authorized()) {

			$return_json['authenticated'] = 'true';

			$sql_query = "UPDATE `categories` 
				SET `name`='".$name."',
				`description`='".$description."',
				`parent_category_id`=".$parent_category_id." 
				WHERE `category_id` = ".$category_id;
				
			$result = mysql_query($sql_query, $this -> database_link);

			if ($result) {
				$return_json['success'] = 'true';

			} else {
				$return_json['success'] = 'false';
			}

		} else {
			$return_json['authenticated'] = 'false';
		}
		
		return $return_json;
	}
	
	public function Delete_Category($category_id){
		
		$return_json = array('authenticated' => 'false', 'success' => 'false', );
		
		
		if (Is_Session_Authorized()) {

			$return_json['authenticated'] = 'true';

			$sql_query = "DELETE FROM `categories` WHERE `category_id` = ".$category_id;
				
			$result = mysql_query($sql_query, $this -> database_link);

			if ($result) {
				$return_json['success'] = 'true';

			} else {
				$return_json['success'] = 'false';
			}

		} else {
			$return_json['authenticated'] = 'false';
		}
		
		return $return_json;
	}
	
	
	private function Get_Total_Task_Summary($scheduled_total, $recurring_total){
		
		$return_html = '';
		$hours_total = ($scheduled_total + $recurring_total);
		$style = '';
		
		if($hours_total > 24)
		{
			$style = 'color:#FF0000;';
		}
		else if($hours_total > 22)
		{
			$style = 'color:#FF6600;';
		}
		else {
			$style = 'color:#00FF00;';
		}
		
		$return_html .= '<b>Target Task Sums (24 Hours)</b> <br />
			<table border="1" style="width:100%;">
			<tr>
			<td><b>Task Type</b></td>
			<td><b>Hours Total</b></td>
			</tr>
			<tr>
			<td>Scheduled</td>
			<td>'.$scheduled_total.'</td>
			</tr>
			<tr>
			<td>Recurring</td>
			<td>'.$recurring_total.'</td>
			</tr>
			<tr>
			<td><b>Total</b></td>
			<td style="'.$style.'"><b>'.$hours_total.'</b></td>
			</tr>
			</table><br/>';	
			
		return $return_html;
	}
	
	private function Get_Floating_Task_Summary() {
			
		$return_array = array('html' => '', 'hours_total' => 0);
			
		$return_html = '';
		
		$valid_floating_task_list = array();
		
		$sql = 'SELECT 
			`tasks`.`name` AS `name`, 
			`tasks`.`task_id` AS `task_id`,
			`tasks`.`estimated_time` AS `estimated_time`
			FROM `tasks`';
		
		$task_result = mysql_query($sql, $this -> database_link);
		$task_num = mysql_numrows($task_result);
		
		for ($i=0; $i < $task_num; $i++) { 
			
			$task_id = mysql_result($task_result, $i, 'task_id');
			$task_name = mysql_result($task_result, $i, "name");
			$task_estimate = mysql_result($task_result, $i, "estimated_time");
			
			$is_valid_floating_task = false;
			
			$sql = 'SELECT 
				`task_targets`.`scheduled` AS `scheduled`,
				`task_targets`.`scheduled_time` AS `scheduled_time`,
				`task_targets`.`recurring` AS `recurring`,
				`task_targets`.`recurrance_type` AS `recurrance_type`,
				`task_targets`.`recurrance_period` AS `recurrance_period`
				FROM `task_targets` 
				WHERE 
				`task_targets`.`task_id` = ' .$task_id .
				' ORDER BY `scheduled`';
			
			$target_result = mysql_query($sql, $this -> database_link);
			$target_num = mysql_numrows($target_result);
			
			$sql = "SELECT 
			`task_log`.`task_id` AS `task_id`,
			MAX(`task_log`.`start_time`) AS `start_time`,
			(TIMESTAMPDIFF(SECOND, MAX( `task_log`.`start_time` ), NOW()) / 60 / 60) AS `diff`,
			`task_log`.`hours` AS `hours`,
			`task_log`.`status` AS `status`
			FROM `task_log` 
			WHERE `task_log`.`task_id` = " .$task_id .
			" AND `task_log`.`status` = 'Completed' 
			GROUP BY `task_id`
			ORDER BY `start_time`";
		
			$log_result = mysql_query($sql, $this -> database_link);
			$log_num = mysql_numrows($log_result);
			
			for ($j=0; $j < $target_num; $j++) {
					
				$scheduled = mysql_result($target_result, $j, 'scheduled');
				$recurring = mysql_result($target_result, $j, 'recurring');
				$recurrance_period = mysql_result($target_result, $j, 'recurrance_period');
				$diff = mysql_result($log_result, $j, 'diff');
				
				if(!$scheduled)
				{
					if($log_num == 0)
					{
						//no targets or entries found, this is a valid row.
						$is_valid_floating_task = true;
						break;
					}
					else if($recurring)
					{
						if(($diff + 24) > $recurrance_period)
						{
							$is_valid_floating_task = true;
							break;
						}
					}
				}
				
			}
			
			if($is_valid_floating_task)
			{
				$valid_floating_task_list[] = array(
					'name' => $task_name,
					'task_id' => $task_id,
					'estimate' => $task_estimate,);
				
				$task_totals += $task_elapsed;
			}
		}

		$sql = 'SELECT DISTINCT 
			`tasks`.`task_id` AS `task_id` , 
			`tasks`.`name` AS `name` , 
			`task_targets`.`recurring` AS `recurring` , 
			`task_targets`.`recurrance_period` AS `recurrance_period` , 
			`tasks`.`estimated_time` AS `estimated_time` , 
			MAX( `task_log`.`start_time` ) AS `start_time`, 
			`task_log`.`status` AS `status`,
			(TIMESTAMPDIFF(SECOND, MAX( `task_log`.`start_time` ), NOW()) / 60 / 60) AS `time_diff`
			FROM `tasks`
			LEFT JOIN `task_targets` ON `task_targets`.`task_id` = `tasks`.`task_id`
			LEFT JOIN `task_log` ON `task_log`.`task_id` = `tasks`.`task_id`
			WHERE `tasks`.`task_id` IN (';

		for ($i=0; $i < count($valid_floating_task_list); $i++) { 
			
			$task_id = $valid_floating_task_list[$i]['task_id'];
			
			if($i > 0)
			{
				$sql .= ',';
			}
			
			$sql .= $task_id;
			
		}
		
		$sql .= ') GROUP BY `task_id` ORDER BY `recurring` DESC, `start_time`, `name`';
		
		$end_result = mysql_query($sql, $this -> database_link);
		$end_num = mysql_numrows($end_result);
		
		$return_html .= '
			<b>Upcoming Recurring Tasks (Next 24 Hours)</b> <br />
			<table border="1" style="width:100%;">
			<tr>
			<td><b>Task Name</b></td>
			<td><b>Last Start Time</b></td>
			<td><b>Estimated Time</b></td>
			</tr>';
		
		$task_total = 0;
		
		for ($i=0; $i < $end_num; $i++) {
					
			$task_name = mysql_result($end_result, $i, 'name');
			$last_start_time = mysql_result($end_result, $i, 'start_time');
			$task_estimate = mysql_result($end_result, $i, 'estimated_time');	 
			
			$return_html .= '<tr>';

			$return_html .= '<td>' . $task_name . "</td>";
			$return_html .= '<td>' . $last_start_time . "</td>";
			$return_html .= '<td>' . round($task_estimate, 2) . "</td>";

			$return_html .= '</tr>';
			
			$task_total += $task_estimate;
		}
		
		//render the floating task totals
		$return_html .= '<tr><td><b>Total</b></td>';
		$return_html .= '<td></td>';
		
		$style = '';
		
		if($task_total > 24)
		{
			$style = 'color:#FF0000;';
		}
		else if($task_totals > 22)
		{
			$style = 'color:#FF6600;';
		}
		else {
			$style = 'color:#00FF00;';
		}
				
		$return_html .= '<td style="'.$style.'"><b>' . round($task_total, 2) . "</b></td>";
	
		$return_html .= '</tr>';

		$return_html .= '</table><br />';
		
		$return_array['html'] = $return_html;
		$return_array['hours_total'] = $task_total;
		
		return $return_array;
	}

	private function Get_Untargetted_Task_Summary() {
		$return_html = '';
		
		$valid_untargetted_task_list = array();
		
		$sql = 'SELECT 
			`tasks`.`name` AS `name`, 
			`tasks`.`task_id` AS `task_id`,
			`tasks`.`estimated_time` AS `estimated_time`
			FROM `tasks`';
		
		$task_result = mysql_query($sql, $this -> database_link);
		$task_num = mysql_numrows($task_result);
		
		for ($i=0; $i < $task_num; $i++) { 
			
			$task_id = mysql_result($task_result, $i, 'task_id');
			$task_name = mysql_result($task_result, $i, "name");
			$task_estimate = mysql_result($task_result, $i, "estimated_time");
			
			$is_valid_untargetted_task = false;
			
			$sql = 'SELECT 
				`task_targets`.`scheduled` AS `scheduled`,
				`task_targets`.`scheduled_time` AS `scheduled_time`,
				`task_targets`.`recurring` AS `recurring`,
				`task_targets`.`recurrance_type` AS `recurrance_type`,
				`task_targets`.`recurrance_period` AS `recurrance_period`
				FROM `task_targets` 
				WHERE 
				`task_targets`.`task_id` = ' .$task_id .
				' ORDER BY `scheduled`';
			
			$target_result = mysql_query($sql, $this -> database_link);
			$target_num = mysql_numrows($target_result);
			
			$sql = "SELECT 
			`task_log`.`task_id` AS `task_id`,
			MAX(`task_log`.`start_time`) AS `start_time`,
			(TIMESTAMPDIFF(SECOND, MAX( `task_log`.`start_time` ), NOW()) / 60 / 60) AS `diff`,
			`task_log`.`hours` AS `hours`,
			`task_log`.`status` AS `status`
			FROM `task_log` 
			WHERE `task_log`.`task_id` = " .$task_id .
			" AND `task_log`.`status` = 'Completed' 
			GROUP BY `task_id`
			ORDER BY `start_time`";
		
			$log_result = mysql_query($sql, $this -> database_link);
			$log_num = mysql_numrows($log_result);
			
			if($log_num == 0 && $target_num == 0)
			{
				//no targets or entries found, this is a valid row.
				$is_valid_untargetted_task = true;
			}
			
			
			if($is_valid_untargetted_task)
			{
				$valid_untargetted_task_list[] = array(
					'name' => $task_name,
					'task_id' => $task_id,
					'estimate' => $task_estimate,);
				
				$task_totals += $task_elapsed;
			}
		}

		$sql = 'SELECT DISTINCT 
			`tasks`.`task_id` AS `task_id` , 
			`tasks`.`name` AS `name` , 
			`task_targets`.`recurring` AS `recurring` , 
			`task_targets`.`recurrance_period` AS `recurrance_period` , 
			`tasks`.`estimated_time` AS `estimated_time` , 
			MAX( `task_log`.`start_time` ) AS `start_time`, 
			`task_log`.`status` AS `status`,
			(TIMESTAMPDIFF(SECOND, MAX( `task_log`.`start_time` ), NOW()) / 60 / 60) AS `time_diff`
			FROM `tasks`
			LEFT JOIN `task_targets` ON `task_targets`.`task_id` = `tasks`.`task_id`
			LEFT JOIN `task_log` ON `task_log`.`task_id` = `tasks`.`task_id`
			WHERE `tasks`.`task_id` IN (';

		for ($i=0; $i < count($valid_untargetted_task_list); $i++) { 
			
			$task_id = $valid_untargetted_task_list[$i]['task_id'];
			
			if($i > 0)
			{
				$sql .= ',';
			}
			
			$sql .= $task_id;
			
		}
		
		$sql .= ') GROUP BY `task_id` ORDER BY `recurring` DESC, `start_time`, `name`';
		
		$end_result = mysql_query($sql, $this -> database_link);
		$end_num = mysql_numrows($end_result);
		
		$return_html .= '
			<b>Un-Targetted Pending Tasks</b> <br />
			<table border="1" style="width:100%;">
			<tr>
			<td><b>Task Name</b></td>
			<td><b>Estimated Time</b></td>
			</tr>';
		
		$task_total = 0;
		
		for ($i=0; $i < $end_num; $i++) {
					
			$task_name = mysql_result($end_result, $i, 'name');
			$last_start_time = mysql_result($end_result, $i, 'start_time');
			$task_estimate = mysql_result($end_result, $i, 'estimated_time');	 
			
			$return_html .= '<tr>';

			$return_html .= '<td>' . $task_name . "</td>";
			$return_html .= '<td>' . round($task_estimate, 2) . "</td>";

			$return_html .= '</tr>';
			
			$task_total += $task_estimate;
		}
		
		//render the floating task totals
		$return_html .= '<tr><td><b>Total</b></td>';
		
		$return_html .= '<td><b>' . round($task_total, 2) . "</b></td>";
	
		$return_html .= '</tr>';

		$return_html .= '</table><br />';
		
		return $return_html;
	}

	private function Get_Scheduled_Task_Summary() {
		
		$return_array = array('html' => '', 'hours_total' => 0);
		
		$return_html = '';

		$sql = "SELECT 
			`tasks`.`task_id` AS `task_id`,
			`tasks`.`name` AS `name`, 
			`task_targets`.`scheduled_time` AS `scheduled_time`,
			`tasks`.`estimated_time` AS `estimated_time`,
			`task_targets`.`recurring` AS `recurring`,
			`task_targets`.`recurrance_type` AS `recurrance_type`,
			`task_targets`.`recurrance_period` AS `recurrance_period`,
			(TIMESTAMPDIFF(SECOND,NOW( ), `task_targets`.`scheduled_time`) / 60 / 60) AS `time_to`
			FROM `tasks` , `task_targets`
			WHERE `task_targets`.`scheduled`
			AND (TIMESTAMPDIFF(SECOND,NOW( ), `task_targets`.`scheduled_time`) / 60 / 60) < 24
			AND `tasks`.`task_id` = `task_targets`.`task_id`
			ORDER BY `task_targets`.`scheduled_time`";

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
		
		$hours_sum = 0;
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
					`start_time`
					FROM `task_log` 
					WHERE `task_id` = '" . $task_id . "' 
					AND `status` = 'Completed'";

				$inner_result = mysql_query($inner_sql, $this -> database_link);
				$inner_num = mysql_numrows($inner_result);
				
				
				//correct the scheduled time according to the recurrance period
				$task_scheduled_timestamp = strtotime($task_scheduled_time);
				$current_timestamp = time();
				
				//loop until the time is within 24 hours
				while ($task_scheduled_timestamp < ($current_timestamp - 24*60*60)) {

					$task_scheduled_timestamp += (60 * 60 * $task_recurrance_period);

				}

				$task_scheduled_time = date('Y-m-d H:i:s', $task_scheduled_timestamp);
				$task_time_to = ($task_scheduled_timestamp - time()) / 60 / 60;
				
				//only take tasks within 24 hours
				if(abs($task_time_to) > 24)
				{
					$is_upcoming_task = false;
				}
				
				if($is_upcoming_task)
				{
					//This loop checks for previously completed entries.
					$j = 0;
					while ($j < $inner_num) {
						
						$start_time = strtotime(mysql_result($inner_result, $j, "start_time"));
						
						$time_since = $task_scheduled_timestamp - $start_time;
						
						//check if the task has been executed in the recurrance period.
						if (abs($time_since) < $task_recurrance_period / 2) {
							$is_upcoming_task = false;
							break;
						}
	
						$j++;
					}
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
				
				$hours_sum += $task_elapsed;

			}

			$i++;
		}

		//render the floating task totals
		$return_html .= '<td><b>Total</b></td>';
		$return_html .= '<td></td>';
		$return_html .= '<td></td>';
		
		$style = '';
		
		if($hours_sum > 24)
		{
			$style = 'color:#FF0000;';
		}
		else if($hours_sum > 22)
		{
			$style = 'color:#FF6600;';
		}
		else {
			$style = 'color:#00FF00;';
		}
				
		$return_html .= '<td style="'.$style.'"><b>' . round($hours_sum, 2) . "</b></td>";
	
		$return_html .= '</tr>';

		$return_html .= '</table><br />';
		
		$return_array['html'] = $return_html;
		$return_array['hours_total'] = $hours_sum;
		
		return $return_array;
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
