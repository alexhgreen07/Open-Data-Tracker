<?php

class Data_Interface {

	public function Insert_Item_Entry($value, $unit, $note)
	{
		
		$return_json = array(
			'authenticated' => 'false',
			'success' => 'false',
		);
		
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
		
		
		return $return_json;		
		
	}
	
	public function Get_Items($args)
	{
		$return_json = array(
			'authenticated' => 'false',
			'success' => 'false',
		);
		
		//NOT IMPLEMENTED
		
		
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
	
	public function Get_Item_Log()
	{
		
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
		
		
		
		return $return_html;
	}
	
	
	
}


?>
