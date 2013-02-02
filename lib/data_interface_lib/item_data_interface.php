<?php

class Item_Data_Interface {
	
	//this will store the open database link
	private $database_link;
	
	public function Item_Data_Interface($new_database_link) {
		
		//note this is expected to be initialized and open to the proper database
		$this->database_link = $new_database_link;
		
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

				$success = mysql_query($sql_insert, $this->database_link);
			
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
			$result=mysql_query($sql_query, $this->database_link);
		
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
	
	public function Add_New_Item()
	{

		$return_json = array(
			'authenticated' => 'false',
			'success' => 'false',
		);
		
		//NOT IMPLEMENTED
		
		
		return $return_json;
	}

	public function Edit_Item()
	{
		$return_json = array(
			'authenticated' => 'false',
			'success' => 'false',
		);
		
		
		//NOT IMPLEMENTED
		
		return $return_json;
	}
	
}

?>
