<?php

class Home_Data_Interface {
	
	//this will store the open database link
	private $database_link;
	
	public function Home_Data_Interface($new_database_link) {
		
		//note this is expected to be initialized and open to the proper database
		$this->database_link = $new_database_link;
		
	}
	
	
	public function Get_Home_Data_Summary()
	{
		$return_json = array(
			'authenticated' => 'false',
			'success' => 'false',
			'html' => '',
		);
		
		
		$return_json['html'] .= $this->Get_Task_Summary();
		$return_json['html'] .= $this->Get_Aggregate_Summary();
		
		return $return_json;
	}
	
	private function Get_Task_Summary()
	{
		$return_html = '';
		
		$sql = "SELECT 
			`tasks`.`name` AS `name`, 
			`task_log`.`start_time` AS `start_time`,
			(TIMESTAMPDIFF(SECOND, `task_log`.`start_time`, NOW( ) ) / 60 / 60) AS `elapsed`
			FROM `task_log`, `tasks` 
			WHERE `task_log`.`status` = 'Started' 
			AND `task_log`.`task_id` = `tasks`.`task_id`";
		
		$result=mysql_query($sql, $this->database_link);
		$num=mysql_numrows($result);
		
		$return_html .= '
			<b>Started Tasks</b> <br />
			<table border="1" style="width:100%;">
			<tr>
			<td><b>Task Name</b></td>
			<td><b>Start Time</b></td>
			<td><b>Elapsed</b></td>
			</tr>';
		
		$i=0;
		while ($i < $num) {

			$return_html .= '<tr>';

			$task_name = mysql_result($result,$i,"name");
			$task_start_time = mysql_result($result,$i,"start_time");
			$task_elapsed = mysql_result($result,$i,"elapsed");

			$return_html .= '<td>'.$task_name."</td>";
			$return_html .= '<td>'.$task_start_time."</td>";
			$return_html .= '<td>'.round($task_elapsed,2)."</td>";
		
			$return_html .= '</tr>';

			$i++;
		}

		$return_html .= '</table><br />';
		
		return $return_html;
	}
	
	private function Get_Aggregate_Summary()
	{
		$titles_and_queries = array(
			"1 Day Item Totals:" => "SELECT `unit` AS `name`, SUM( `value` ) AS `agg_value` 
				FROM `item_log`, `items` 
				WHERE DATEDIFF( NOW( ) , `time` ) < 1 
				AND `item_log`.`item_id` = `items`.`item_id`
				GROUP BY `unit`",
			
			"1 Day Task Totals:" => "SELECT `tasks`.`name` AS `name`, SUM(`task_log`.`hours`) AS `agg_value` 
			FROM `task_log`, `tasks` 
			WHERE `task_log`.`task_id` = `tasks`.`task_id` 
			AND DATEDIFF( NOW( ) , `task_log`.`start_time` ) < 1 GROUP BY `tasks`.`name`",
			
			"7 Day Item Averages:" => "SELECT `unit` AS `name`, (SUM( `value` ) / 7) AS `agg_value` 
			FROM `item_log` , `items`
			WHERE DATEDIFF( NOW( ) , `time` ) <= 7 
			AND DATEDIFF( NOW( ) , `time` ) > 0 
			AND `item_log`.`item_id` = `items`.`item_id`
			GROUP BY `unit`",
			
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

			$result=mysql_query($query, $this->database_link);
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
		
		return $return_html;
	}
	
}

?>
