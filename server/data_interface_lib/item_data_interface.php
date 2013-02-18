<?php

class Item_Data_Interface {

	//this will store the open database link
	private $database_link;

	public function Item_Data_Interface($new_database_link) {

		//note this is expected to be initialized and open to the proper database
		$this -> database_link = $new_database_link;

	}

	public function Insert_Quick_Item_Entry($value, $item_id, $note) {

		$return_json = array('authenticated' => 'false', 'success' => 'false', );

		if (Is_Session_Authorized()) {

			$return_json['authenticated'] = 'true';

			$value = mysql_real_escape_string($value);

			if ($item_id != "-") {
				$item_id = mysql_real_escape_string($item_id);
			} else {
				$item_id = "";
			}

			$note = mysql_real_escape_string($note);

			if ($value != "") {

				$sql_insert = "INSERT INTO `life_management`.`item_log` (
					`time` ,
					`value` ,
					`item_id` ,
					`note`
					)
					VALUES (
					NOW(), '" . $value . "', '" . $item_id . "', '" . $note . "')";

				$success = mysql_query($sql_insert, $this -> database_link);

				if ($success) {
					$return_json['success'] = 'true';
				} else {
					$return_json['success'] = 'false';
				}

			}

		} else {
			$return_json['authenticated'] = 'false';

		}

		return $return_json;

	}

	public function Insert_Item_Entry($time, $value, $item_id, $note) {

		$return_json = array('authenticated' => 'false', 'success' => 'false', );

		if (Is_Session_Authorized()) {

			$return_json['authenticated'] = 'true';

			$value = mysql_real_escape_string($value);

			if ($item_id != "-") {
				$item_id = mysql_real_escape_string($item_id);
			} else {
				$item_id = "";
			}

			$note = mysql_real_escape_string($note);

			if ($value != "") {

				$sql_insert = "INSERT INTO `life_management`.`item_log` (
					`time` ,
					`value` ,
					`item_id` ,
					`note`
					)
					VALUES (
					'" . $time . "', '" . $value . "', '" . $item_id . "', '" . $note . "')";

				//$return_json['debug'] = $sql_insert;

				$success = mysql_query($sql_insert, $this -> database_link);

				if ($success) {
					$return_json['success'] = 'true';
				} else {
					$return_json['success'] = 'false';
				}

			}

		} else {
			$return_json['authenticated'] = 'false';

		}

		return $return_json;

	}
	
	public function Update_Item_Entry($item_entry_id, $time, $value, $item_id, $note){
		
		$return_json = array('authenticated' => 'false', 'success' => 'false', );

		if (Is_Session_Authorized()) {

			$return_json['authenticated'] = 'true';
			
			$time = mysql_real_escape_string($time);
			$value = mysql_real_escape_string($value);
			$note = mysql_real_escape_string($note);
			
			if ($item_id != "-") {
				$item_id = mysql_real_escape_string($item_id);
			} else {
				$item_id = "";
			}


			if ($value != "") {

				$sql_insert = "UPDATE `item_log` SET `item_id` = " . $item_id . ",`time` = ".$time.",`value`=".$value.",`note`='".$note."' WHERE `item_log_id` = " . $item_entry_id;

				//$return_json['debug'] = $sql_insert;

				$success = mysql_query($sql_insert, $this -> database_link);

				if ($success) {
					$return_json['success'] = 'true';
				} else {
					$return_json['success'] = 'false';
				}

			}

		} else {
			$return_json['authenticated'] = 'false';

		}

		return $return_json;
		
	}
	
	public function Delete_Item_Entry($item_entry_id){
		
		$return_json = array('authenticated' => 'false', 'success' => 'false', );

		if (Is_Session_Authorized()) {

			$return_json['authenticated'] = 'true';


			$sql_insert = "DELETE FROM `item_log` WHERE `item_log_id` = " . $item_entry_id;

			//$return_json['debug'] = $sql_insert;

			$success = mysql_query($sql_insert, $this -> database_link);

			if ($success) {
				$return_json['success'] = 'true';
			} else {
				$return_json['success'] = 'false';
			}

		

		} else {
			$return_json['authenticated'] = 'false';

		}

		return $return_json;
		
	}

	public function Insert_New_Item($name, $unit, $description) {

		$return_json = array('authenticated' => 'false', 'success' => 'false', );

		$name = mysql_real_escape_string($name);
		$unit = mysql_real_escape_string($unit);
		$description = mysql_real_escape_string($description);

		if (Is_Session_Authorized()) {
			$return_json['authenticated'] = 'true';

			if ($name != "") {

				$sql_insert = "INSERT INTO `items`(`date_created`,`name`, `unit`, `description`) VALUES (
					NOW(), '" . $name . "', '" . $unit . "', '" . $description . "')";

				$success = mysql_query($sql_insert, $this -> database_link);

				if ($success) {
					$return_json['success'] = 'true';
				} else {
					$return_json['success'] = 'false';
				}

			}
		} else {
			$return_json['authenticated'] = 'false';
		}

		return $return_json;
	}

	public function Edit_Item($item_id, $name, $unit, $description) {
		
		$return_json = array('authenticated' => 'false', 'success' => 'false', );

		$name = mysql_real_escape_string($name);
		$unit = mysql_real_escape_string($unit);
		$description = mysql_real_escape_string($description);

		if (Is_Session_Authorized()) {
			$return_json['authenticated'] = 'true';

			if ($name != "") {

				$sql_insert = "UPDATE `items` SET `name`='".$name."',`description`='".$description."',`unit`='".$unit."' WHERE `item_id`=" . $item_id;

				$success = mysql_query($sql_insert, $this -> database_link);

				if ($success) {
					$return_json['success'] = 'true';
				} else {
					$return_json['success'] = 'false';
				}

			}
		} else {
			$return_json['authenticated'] = 'false';
		}

		return $return_json;
		
	}
	
	public function Delete_Item($item_id) {
		
		$return_json = array('authenticated' => 'false', 'success' => 'false', );

		if (Is_Session_Authorized()) {
			
			$return_json['authenticated'] = 'true';

			if ($item_id != "") {

				$sql_insert = "DELETE FROM `items` WHERE `item_id`=" . $item_id;

				$success = mysql_query($sql_insert, $this -> database_link);

				if ($success) {
					
					$return_json['success'] = 'true';
					
				} else {
					
					$return_json['success'] = 'false';
				}


			}
		} else {
			$return_json['authenticated'] = 'false';
		}

		return $return_json;
		
	}
	
	public function Get_Item_Log() {

		$return_json = array('authenticated' => 'false', 'success' => 'false', 'data' => '', );


		$query = "SELECT 
			`item_log`.`item_log_id` AS `item_log_id`,
			`item_log`.`item_id` AS `item_id`, 
			`item_log`.`time` AS `time`, 
			`item_log`.`value` AS `value`, 
			`items`.`name` AS `name`,
			`items`.`unit` AS `unit`, 
			`item_log`.`note` AS `note` 
			FROM `life_management`.`item_log`, `life_management`.`items` 
			WHERE `items`.`item_id` = `item_log`.`item_id` 
			ORDER BY `time` DESC";
			
		$result = mysql_query($query, $this -> database_link);

		$num = mysql_numrows($result);

		
		$return_json['data'] = array();
		
		$i = 0;
		while ($i < $num) {
			
			$item_entry_log_id = mysql_result($result, $i, "item_log_id");
			$item_entry_id = mysql_result($result, $i, "item_id");
			$item_entry_time = mysql_result($result, $i, "time");
			$item_entry_value = mysql_result($result, $i, "value");
			$item_entry_name = mysql_result($result, $i, "name");
			$item_entry_unit = mysql_result($result, $i, "unit");
			$item_entry_note = mysql_result($result, $i, "note");
			
			$return_json['data'][$i] = array(
				'item_log_id' => $item_entry_log_id,
				'item_id' => $item_entry_id,
				'time' => $item_entry_time,
				'value' => $item_entry_value,
				'name' => $item_entry_name,
				'unit' => $item_entry_unit,
				'note' => $item_entry_note);


			$i++;
		}

		return $return_json;
	}

	public function Get_Items() {
		$return_json = array('authenticated' => 'false', 'success' => 'false', 'items' => array(), );

		if (Is_Session_Authorized()) {

			$return_json['authenticated'] = 'true';

			$sql_query = "SELECT `item_id`, `name`, `description`, `unit`, `date_created` FROM `life_management`.`items` ORDER BY `name` asc";
			$result = mysql_query($sql_query, $this -> database_link);

			if ($result) {
				$return_json['success'] = 'true';

				$num = mysql_numrows($result);

				$i = 0;
				while ($i < $num) {

					$item_name = mysql_result($result, $i, "name");
					$item_description = mysql_result($result, $i, 'description');
					$item_unit = mysql_result($result, $i, "unit");
					$item_date_created = mysql_result($result, $i, 'date_created');
					$item_id = mysql_result($result, $i, "item_id");

					if ($item_name != "") {
						$return_json['items'][$i] = 
							array(
							'item_name' => $item_name, 
							'item_description' => $item_description, 
							'item_unit' => $item_unit, 
							'date_created' => $item_date_created, 
							'item_id' => $item_id, );

						//$return_json['items'][$i] = $row_result;

					}

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

}
?>
