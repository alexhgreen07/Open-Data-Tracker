<?php

require_once('auth.php');

class Data_Interface {

	public function Get_Home_Data_Summary()
	{
		$return_json = array(
			'authenticated' => 'false',
			'success' => 'false',
			'html' => '',
		);
		
		$titles_and_queries = array(
			"1 Day Item Totals:" => "SELECT `unit` AS `name`, SUM( `value` ) AS `agg_value` 
				FROM `item_log` 
				WHERE DATEDIFF( NOW( ) , `time` ) < 1 GROUP BY `unit`",
			"7 Day Item Averages:" => "SELECT `unit` AS `name`, (SUM( `value` ) / 7) AS `agg_value` 
			FROM `item_log` 
			WHERE DATEDIFF( NOW( ) , `time` ) <= 7 AND DATEDIFF( NOW( ) , `time` ) > 0 GROUP BY `unit`",
			"1 Day Task Totals:" => "SELECT `tasks`.`name` AS `name`, SUM(`task_log`.`hours`) AS `agg_value` 
			FROM `task_log`, `tasks` 
			WHERE `task_log`.`task_id` = `tasks`.`task_id` 
			AND DATEDIFF( NOW( ) , `task_log`.`start_time` ) < 1 GROUP BY `tasks`.`name`",
			"7 Day Task Averages:" => "SELECT `tasks`.`name` AS `name`, (SUM(`task_log`.`hours`) / 7) AS `agg_value` 
			FROM `task_log`, `tasks` 
			WHERE `task_log`.`task_id` = `tasks`.`task_id` 
			AND DATEDIFF( NOW( ) , `task_log`.`start_time` ) <= 7 
			AND DATEDIFF( NOW( ) , `task_log`.`start_time` ) > 0 GROUP BY `tasks`.`name`",
		);

		$return_html = '';

		foreach ($titles_and_queries as $title => $query) {
		    
		    	$return_html .= '
			<b>'.$title.'</b> <br />
			<table border="1" style="width:100%;">
			<tr><td><b>Unit</b></td><td><b>Aggregate</b></td></tr>';


			$result=mysql_query($query);
			$num=mysql_numrows($result);


			$i=0;
			while ($i < $num) {
	
				$return_html .= '<tr>';
	
				$field1_name = mysql_result($result,$i,"name");
				$field2_name = mysql_result($result,$i,"agg_value");

				$return_html .= '<td style="width:50%;">'.$field1_name."</td>";
				$return_html .= '<td style="width:50%;">'.round($field2_name,2)."</td>";
			
				$return_html .= '</tr>';

				$i++;
			}

			$return_html .= '</table><br />';
		    
		}
		
		$return_json['html'] = $return_html;
		
		return $return_json;
	}

	public function Insert_Item_Entry($value, $unit, $note)
	{
		
		$return_json = array(
			'authenticated' => 'false',
			'success' => 'false',
		);
		
		if(Is_Session_Authorized())
		{
			
			$return_json['authenticated'] = 'true';
			
			$value = mysql_real_escape_string($value);

			if($unit != "-")
			{
				$unit = mysql_real_escape_string($unit);
			}
			else
			{
				$unit = "";
			}

			$note = mysql_real_escape_string($note);

			if($value != "")
			{
		
				$sql_insert = "INSERT INTO `life_management`.`item_log` (
					`time` ,
					`value` ,
					`unit` ,
					`note`
					)
					VALUES (
					NOW(), '".$value."', '".$unit."', '".$note."')";

				$success = mysql_query($sql_insert);
			
				if($success)
				{
					$return_json['success'] = 'true';
				}
				else
				{
					$return_json['success'] = 'false';
				}
			
			

			}
		
		}
		else
		{
			$return_json['authenticated'] = 'false';
			
		}
		
		
		return $return_json;		
		
	}
	
	public function Get_Items_Names()
	{
		$return_json = array(
			'authenticated' => 'false',
			'success' => 'false',
			'items' => array(),
		);
		
		if(Is_Session_Authorized())
		{
			
			$return_json['authenticated'] = 'true';
		
			$sql_query = "SELECT DISTINCT `unit` FROM `life_management`.`item_log` ORDER BY `unit` asc";
			$result=mysql_query($sql_query);
		
			if($result)
			{
				$return_json['success'] = 'true';
			
			
				$num=mysql_numrows($result);

				$i=0;
				while ($i < $num) {

					$row_result = mysql_result($result,$i,"unit");

					if($row_result != "")
					{

						$return_json['items'][$i] = $row_result;
	
					}

					$i++;
				}
			}
			else
			{
				$return_json['success'] = 'false';
			}
		
		}
		else
		{
			$return_json['authenticated'] = 'false';
		}
		
		return $return_json;
	}
	
	public function Add_New_Item($args)
	{

		$return_json = array(
			'authenticated' => 'false',
			'success' => 'false',
		);
		
		//NOT IMPLEMENTED
		
		
		return $return_json;
	}

	public function Edit_Item($args)
	{
		$return_json = array(
			'authenticated' => 'false',
			'success' => 'false',
		);
		
		
		//NOT IMPLEMENTED
		
		return $return_json;
	}
	
	public function Insert_Task_Entry($task_name_to_enter,$task_start_stop)
	{
		
		$return_json = array(
			'authenticated' => 'false',
			'success' => 'false',
		);
		
		$task_name_to_enter = mysql_real_escape_string($task_name_to_enter);
		$task_start_stop = mysql_real_escape_string($task_start_stop);
	
		$sql_query = "SELECT DISTINCT `task_id` FROM `life_management`.`tasks` WHERE `name` = '".$task_name_to_enter."'";
		$result = mysql_query($sql_query);

		$task_id = mysql_result($result,0,"task_id");

		if($task_start_stop == "Start")
		{
			$sql = "INSERT INTO `task_log`(`task_id`, `start_time`) VALUES ('".$task_id."',NOW())";
		}
		else
		{
			$sql = "UPDATE `task_log` SET `hours`=(TIMESTAMPDIFF(SECOND,`start_time`,NOW())/60/60) WHERE `task_id` = '".$task_id."' and `hours` = 0";
		}
	
		//execute insert
		$success = mysql_query($sql);
		
		if($success)
		{
			$return_json['success'] = 'true';
		}
		else
		{
			$return_json['success'] = 'false';
		}
		
		return $return_json;
	}
	
	public function Get_Start_Stop_Task_Names()
	{
		$return_json = array(
			'authenticated' => 'false',
			'success' => 'false',
			'items' => array(),
		);
		
		if(Is_Session_Authorized())
		{
			
			$return_json['authenticated'] = 'true';
		
			$sql_query = "SELECT DISTINCT `task_id`,`name`,`date_created` FROM `life_management`.`tasks` WHERE `status` != 'Completed'";
			$result=mysql_query($sql_query);
		
			if($result)
			{
				$return_json['success'] = 'true';
			
			
				$num = mysql_numrows($result);
				
				$i=0;
				while ($i < $num) {
					
					$item_name = mysql_result($result,$i,"name");
					
					//check if the task has been started yet
					$inner_sql_query = "SELECT `task_id`, `start_time` 
						FROM `life_management`.`task_log` 
						WHERE `task_id` = " . mysql_result($result,$i,"task_id") . 
						" AND `status` = 'Started'";
					$inner_result = mysql_query($inner_sql_query);
					$started_task_count = mysql_numrows($inner_result);
					
					$status = 'Stopped';
					
					if($started_task_count > 0)
					{
						//fill proper data from query
						$status = 'Started';
						$start_time = mysql_result($inner_result,0,"start_time");

					}
					else
					{
						//fill default data
						$status = 'Stopped';
						$start_time = '';
					}
					
					if($item_name != "")
					{
						$return_json['items'][$i] = array(
							'item_name' => $item_name,
							'item_status' => $status,
							'start_time' => $start_time,
						);

	
					}

					$i++;
				}
			}
			else
			{
				$return_json['success'] = 'false';
			}
		
		}
		else
		{
			$return_json['authenticated'] = 'false';
		}
		
		return $return_json;
	}
	
	public function Task_Start_Stop($task_name_to_enter, $task_start_stop)
	{
		$return_json = array(
			'authenticated' => 'false',
			'success' => 'false',
		);
		
		
		
		$task_name_to_enter = mysql_real_escape_string($task_name_to_enter);
		$task_start_stop = mysql_real_escape_string($task_start_stop);
		
		$sql_query = "SELECT DISTINCT `task_id` FROM `life_management`.`tasks` WHERE `name` = '".$task_name_to_enter."' AND `status` != 'Completed'";
		$result=mysql_query($sql_query);

		$task_id = mysql_result($result,0,"task_id");

		if($task_start_stop == "Start")
		{
			$sql = "INSERT INTO `task_log`(`task_id`, `start_time`,`status`) VALUES ('".$task_id."',NOW(),'Started')";
		}
		else
		{
			$sql = "UPDATE `task_log` 
				SET 
				`hours`=(TIMESTAMPDIFF(SECOND,`start_time`,NOW())/60/60),
				`status`='Stopped'
				WHERE `task_id` = '".$task_id."' AND 
				`hours` = 0 AND
				`status` = 'Started'";
		}
		
		//execute insert
		$success = mysql_query($sql);
		
		if($success)
		{
			$return_json['success'] = 'true';
		}
		else
		{
			$return_json['success'] = 'false';
		}
		
		
		
		return $return_json;
	}
	
	public function Task_Mark_Complete($task_name_to_enter)
	{
		$return_json = array(
			'authenticated' => 'false',
			'success' => 'false',
		);
		
		try {
			$task_name_to_enter = mysql_real_escape_string($task_name_to_enter);
			$task_start_stop = mysql_real_escape_string($task_start_stop);
			
			//find the task by its name
			$sql_query = "SELECT DISTINCT `task_id`, `recurring` FROM `life_management`.`tasks` WHERE `name` = '".$task_name_to_enter."'";
			$result=mysql_query($sql_query);
			
			if(!$result)
			{
				throw new Exception('SQL error.');
			}
			
			$task_id = mysql_result($result,0,"task_id");
			$is_recurring = mysql_result($result,0,"recurring");
			
			//if it is not a recurring task, set it to compelete
			if(!$is_recurring)
			{
				$sql = "UPDATE `tasks` SET `status`='Completed' WHERE `task_id`=".$task_id;
			
				//execute insert
				$success = mysql_query($sql);
				
				if(!$success)
				{
					throw new Exception('SQL error.');
				}
			}
			
			//insert an entry into the log indicating the task is complete
			$sql = "INSERT INTO `task_log`(`task_id`, `start_time`,`status`) VALUES ('".$task_id."',NOW(),'Completed')";
		
			//execute insert
			$success = mysql_query($sql);
		
			if(!$success)
			{
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
	
	public function Add_New_Task($name,$description,$estimated_time,$note)
	{
		$return_json = array(
			'authenticated' => 'false',
			'success' => 'false',
		);
		
		$task_name = mysql_real_escape_string($name);
		$task_description = mysql_real_escape_string($description);
		$task_estimated_time = mysql_real_escape_string($estimated_time);
		$task_note = mysql_real_escape_string($note);
	
		$sql = 'INSERT INTO `life_management`.`tasks`(`name`, `description`, `date_created`, `estimated_time`, `note`) VALUES (';
		$sql .= "'".$task_name."',";
		$sql .= "'".$task_description."',";
		$sql .= "NOW(),";
		$sql .= "".$task_estimated_time.",";
		$sql .= "'".$task_note."')";
	
	
		$success = mysql_query($sql);
		
		if($success)
		{
			$return_json['success'] = 'true';
		}
		else
		{
			$return_json['success'] = 'false';
		}
		
		return $return_json;
	}
	
	public function Get_Tasks()
	{
		$return_json = array(
			'authenticated' => 'false',
			'success' => 'false',
			'html' => '',
		);
		
		if(Is_Session_Authorized())
		{
			
			$return_json['authenticated'] = 'true';
		
			$sql_query = "SELECT DISTINCT `name`,`description`,`date_created`,`estimated_time` FROM `life_management`.`tasks`";
			$result=mysql_query($sql_query);
		
			if($result)
			{
				$return_json['success'] = 'true';
			
			
				$return_html = '';

				$num = mysql_numrows($result);
		
				$return_html .= "
				<b>Database Output</b><br>
				<table border='1' style='width:100%;'>";

				$return_html .= "<tr><td>Name</td><td>Description</td><td>Date Created</td><td>Estimated Time (hrs)</td></tr>";

				$i=0;
				while ($i < $num) {

					$field1_name = mysql_result($result,$i,"name");
					$field2_name = mysql_result($result,$i,"description");
					$field3_name = mysql_result($result,$i,"date_created");
					$field4_name = mysql_result($result,$i,"estimated_time");

					$return_html .= 
						"<tr><td width='25%'>". 
						$field1_name . 
						"</td><td width='25%'>" . 
						$field2_name . 
						"</td><td width='25%'>" . 
						$field3_name . 
						"</td><td width='25%'>" . 
						$field4_name . "</td></tr>";

					$i++;
				}

				$return_html .= '
				</table>';
				
				$return_json['html'] = $return_html;
			}
			else
			{
				$return_json['success'] = 'false';
			}
		
		}
		else
		{
			$return_json['authenticated'] = 'false';
		}
		
		return $return_json;
	}
	
	public function Get_Item_Log()
	{
		
		$return_json = array(
			'authenticated' => 'false',
			'success' => 'false',
			'html' => '',
		);
		
		$return_html = '';
		
		$query="SELECT * FROM `life_management`.`item_log` order by `time` desc";
		$result=mysql_query($query);

		$num=mysql_numrows($result);
		
		$return_html .= "
		<b>Database Output</b><br>
		<table border='1' style='width:100%;'>";

		$return_html .= "<tr><td>Date</td><td>Value</td><td>Unit</td><td>Note</td></tr>";

		$i=0;
		while ($i < $num) {

			$field1_name = mysql_result($result,$i,"time");
			$field2_name = mysql_result($result,$i,"value");
			$field3_name = mysql_result($result,$i,"unit");
			$field4_name = mysql_result($result,$i,"note");

			$return_html .= 
				"<tr><td width='25%'>". 
				$field1_name . 
				"</td><td width='25%'>" . 
				$field2_name . 
				"</td><td width='25%'>" . 
				$field3_name . 
				"</td><td width='25%'>" . 
				$field4_name . "</td></tr>";

			$i++;
		}

		$return_html .= '
		</table>';
		
		$return_json['html'] = $return_html;
		
		return $return_json;
	}
	
	
	
}


?>
