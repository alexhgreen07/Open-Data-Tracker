<?php

class Item_Data_Interface {
	
	//this will store the open database link
	private $database_link;
	
	public function Item_Data_Interface($new_database_link) {
		
		//note this is expected to be initialized and open to the proper database
		$this->database_link = $new_database_link;
		
	}
	
	
	public function Insert_Quick_Item_Entry($value, $item_id, $note)
	{
		
		$return_json = array(
			'authenticated' => 'false',
			'success' => 'false',
		);
		
		if(Is_Session_Authorized())
		{
			
			$return_json['authenticated'] = 'true';
			
			$value = mysql_real_escape_string($value);

			if($item_id != "-")
			{
				$item_id = mysql_real_escape_string($item_id);
			}
			else
			{
				$item_id = "";
			}

			$note = mysql_real_escape_string($note);

			if($value != "")
			{
		
				$sql_insert = "INSERT INTO `life_management`.`item_log` (
					`time` ,
					`value` ,
					`item_id` ,
					`note`
					)
					VALUES (
					NOW(), '".$value."', '".$item_id."', '".$note."')";

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
	
	public function Insert_Item_Entry($time, $value, $item_id, $note)
	{
		
		$return_json = array(
			'authenticated' => 'false',
			'success' => 'false',
		);
		
		if(Is_Session_Authorized())
		{
			
			$return_json['authenticated'] = 'true';
			
			$value = mysql_real_escape_string($value);

			if($item_id != "-")
			{
				$item_id = mysql_real_escape_string($item_id);
			}
			else
			{
				$item_id = "";
			}

			$note = mysql_real_escape_string($note);

			if($value != "")
			{
		
				$sql_insert = "INSERT INTO `life_management`.`item_log` (
					`time` ,
					`value` ,
					`item_id` ,
					`note`
					)
					VALUES (
					'".$time."', '".$value."', '".$item_id."', '".$note."')";
				
				//$return_json['debug'] = $sql_insert;
				
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
	
	public function Get_Items()
	{
		$return_json = array(
			'authenticated' => 'false',
			'success' => 'false',
			'items' => array(),
		);
		
		if(Is_Session_Authorized())
		{
			
			$return_json['authenticated'] = 'true';
		
			$sql_query = "SELECT `item_id`, `name`, `description`, `unit`, `date_created` FROM `life_management`.`items` ORDER BY `name` asc";
			$result=mysql_query($sql_query, $this->database_link);
		
			if($result)
			{
				$return_json['success'] = 'true';
			
			
				$num=mysql_numrows($result);

				$i=0;
				while ($i < $num) {
					
					$item_name = mysql_result($result,$i,"name");
					$item_description = mysql_result($result,$i,'description');
					$item_unit = mysql_result($result,$i,"unit");
					$item_date_created = mysql_result($result,$i,'date_created');
					$item_id = mysql_result($result,$i,"item_id");

					if($item_name != "")
					{
						$return_json['items'][$i] = array(
							'item_name' => $item_name,
							'item_description' => $item_description,
							'item_unit' => $item_unit,
							'date_created' => $item_date_created,
							'item_id' => $item_id,
						);
						
						//$return_json['items'][$i] = $row_result;
	
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
	
	public function Add_New_Item($name, $unit, $description)
	{

		$return_json = array(
			'authenticated' => 'false',
			'success' => 'false',
		);
		
		$name = mysql_real_escape_string($name);
		$unit = mysql_real_escape_string($unit);
		$description = mysql_real_escape_string($description);
		
		if(Is_Session_Authorized())
		{
			$return_json['authenticated'] = 'true';
			
			if($name != "")
			{
		
				$sql_insert = "INSERT INTO `items`(`date_created`,`name`, `unit`, `description`) VALUES (
					NOW(), '".$name."', '".$unit."', '".$description."')";

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
