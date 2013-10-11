<?php
/** \file report_data_interface.php
 * \brief This file contains the class definition for the item data interface class.
 * */

/** \class Report_Data_Interface
 * \brief This class contains functions related to report generation. 
 * Special queries and data views will be availabe from here.
 * */
class Report_Data_Interface {

	//this will store the open database link
	private $database_link;

	public function Report_Data_Interface($new_database_link) {

		//note this is expected to be initialized and open to the proper database
		$this -> database_link = $new_database_link;

	}
	
	public function Get_Tables_Schema() {
		
		$schema_query = "select * from `information_schema`.`tables` where 
			table_name = 'items' OR 
			table_name = 'item_log' OR
			table_name = 'categories' OR
			table_name = 'tasks' OR
			table_name = 'task_log' OR
			table_name = '	task_targets'";
		
		$return_json = array('authenticated' => 'false', 'success' => 'false', 'data' => '', );
		
		return $return_json;
	}

	public function Get_Report_Summary_Data() {

		$return_json = array('authenticated' => 'false', 'success' => 'false', 'html' => '', );

		$titles_and_queries = array("7 Day Item Sums:" => "SELECT `unit` AS `name`, (SUM( `value` )) AS `agg_value` 
			FROM `item_log` , `items`
			WHERE DATEDIFF( NOW( ) , `time` ) <= 7 
			AND DATEDIFF( NOW( ) , `time` ) > 0 
			AND `item_log`.`item_id` = `items`.`item_id`
			GROUP BY `unit`", "7 Day Task Sums:" => "SELECT `tasks`.`name` AS `name`, (SUM(`task_log`.`hours`)) AS `agg_value` 
			FROM `task_log`, `tasks` 
			WHERE `task_log`.`task_id` = `tasks`.`task_id` 
			AND DATEDIFF( NOW( ) , `task_log`.`start_time` ) <= 7 
			AND DATEDIFF( NOW( ) , `task_log`.`start_time` ) > 0 GROUP BY `tasks`.`name`",
			"7 Day Item Averages (Units/Day):" => "SELECT `unit` AS `name`, (SUM( `value` ) / 7) AS `agg_value` 
			FROM `item_log` , `items`
			WHERE DATEDIFF( NOW( ) , `time` ) <= 7 
			AND DATEDIFF( NOW( ) , `time` ) > 0 
			AND `item_log`.`item_id` = `items`.`item_id`
			GROUP BY `unit`", "7 Day Task Averages (Units/Day):" => "SELECT `tasks`.`name` AS `name`, (SUM(`task_log`.`hours`) / 7) AS `agg_value` 
			FROM `task_log`, `tasks` 
			WHERE `task_log`.`task_id` = `tasks`.`task_id` 
			AND DATEDIFF( NOW( ) , `task_log`.`start_time` ) <= 7 
			AND DATEDIFF( NOW( ) , `task_log`.`start_time` ) > 0 GROUP BY `tasks`.`name`", "All Time Item Sums:" => "SELECT `unit` AS `name`, (SUM( `value` )) AS `agg_value` 
			FROM `item_log` , `items`
			WHERE `item_log`.`item_id` = `items`.`item_id`
			GROUP BY `unit`", "All Time Task Sums:" => "SELECT `tasks`.`name` AS `name`, (SUM(`task_log`.`hours`)) AS `agg_value` 
			FROM `task_log`, `tasks` 
			WHERE `task_log`.`task_id` = `tasks`.`task_id` GROUP BY `tasks`.`name`", );

		$return_html = '';

		foreach ($titles_and_queries as $title => $query) {

			$return_html .= '
			<b>' . $title . '</b> <br />
			<table border="1" style="width:100%;">
			<tr><td><b>Unit</b></td><td><b>Aggregate</b></td></tr>';

			$result = mysql_query($query, $this -> database_link);

			if (!$result) {
				$return_json['success'] = 'false';
				break;
			}

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

			$return_json['success'] = 'true';

		}

		$return_json['html'] = $return_html;

		return $return_json;
	}

}
?>
