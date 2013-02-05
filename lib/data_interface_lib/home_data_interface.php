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
		
		$titles_and_queries = array(
			"1 Day Item Totals:" => "SELECT `unit` AS `name`, SUM( `value` ) AS `agg_value` 
				FROM `item_log`, `items` 
				WHERE DATEDIFF( NOW( ) , `time` ) < 1 
				AND `item_log`.`item_id` = `items`.`item_id`
				GROUP BY `unit`",
				
			"7 Day Item Averages:" => "SELECT `unit` AS `name`, (SUM( `value` ) / 7) AS `agg_value` 
			FROM `item_log` , `items`
			WHERE DATEDIFF( NOW( ) , `time` ) <= 7 
			AND DATEDIFF( NOW( ) , `time` ) > 0 
			AND `item_log`.`item_id` = `items`.`item_id`
			GROUP BY `unit`",
			
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
		
		$return_json['html'] = $return_html;
		
		return $return_json;
	}
	
}

?>
