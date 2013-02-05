<?php

class Data_Data_Interface {
	
	//this will store the open database link
	private $database_link;
	
	public function Data_Data_Interface($new_database_link) {
		
		//note this is expected to be initialized and open to the proper database
		$this->database_link = $new_database_link;
		
	}
	
	public function Get_Item_Log()
	{
		
		$return_json = array(
			'authenticated' => 'false',
			'success' => 'false',
			'html' => '',
		);
		
		$return_html = '';
		
		$query="SELECT 
			`item_log`.`time` AS `time`, 
			`item_log`.`value` AS `value`, 
			`items`.`name` AS `name`,
			`items`.`unit` AS `unit`, 
			`item_log`.`note` AS `note` 
			FROM `life_management`.`item_log`, `life_management`.`items` 
			WHERE `items`.`item_id` = `item_log`.`item_id` 
			ORDER BY `time` DESC";
		$result=mysql_query($query, $this->database_link);

		$num=mysql_numrows($result);
		
		$return_html .= "
		<b>Database Output</b><br>
		<table border='1' style='width:100%;'>";

		$return_html .= "<tr><td>Date</td><td>Name</td><td>Value</td><td>Unit</td><td>Note</td></tr>";

		$i=0;
		while ($i < $num) {

			$item_entry_time = mysql_result($result,$i,"time");
			$item_entry_value = mysql_result($result,$i,"value");
			$item_entry_name = mysql_result($result,$i,"name");
			$item_entry_unit = mysql_result($result,$i,"unit");
			$item_entry_note = mysql_result($result,$i,"note");

			$return_html .= 
				"<tr><td>". 
				$item_entry_time . 
				"</td><td>" . 
				$item_entry_name . 
				"</td><td>" . 
				$item_entry_value . 
				"</td><td>" . 
				$item_entry_unit . 
				"</td><td>" . 
				$item_entry_note . "</td></tr>";

			$i++;
		}

		$return_html .= '
		</table>';
		
		$return_json['html'] = $return_html;
		
		return $return_json;
	}
	
}

?>
