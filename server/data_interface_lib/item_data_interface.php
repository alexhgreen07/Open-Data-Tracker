<?php
/** \file item_data_interface.php
 * \brief This file contains the class definition for the item data interface class.
 * */

/** \class Item_Data_Interface
 * \brief This class contains functions related to item tracking. All
 * insert, update, and delete functions, as well as data retrieval 
 * functions are present.
 * */
class Item_Data_Interface {

	//this will store the open database link
	private $database_link;

	public function Item_Data_Interface($new_database_link) {

		//note this is expected to be initialized and open to the proper database
		$this -> database_link = $new_database_link;

	}

	public function Insert_Item_Entry($time, $value, $item_id, $note) {

		$return_json = array('success' => 'false', );
		
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
				`note`,
				`member_id`
				)
				VALUES (
				'" . $time . "', '" . $value . "', '" . $item_id . "', '" . $note . "','" . $_SESSION['session_member_id'] ."')";

			//$return_json['debug'] = $sql_insert;

			$success = mysql_query($sql_insert, $this -> database_link);

			if ($success) {
				$return_json['success'] = 'true';
			} else {
				$return_json['success'] = 'false';
			}

		}
		
		return $return_json;

	}
	
	public function Update_Item_Entry($item_entry_id, $time, $value, $item_id, $note){
		
		$return_json = array('success' => 'false', );
		
		$time = mysql_real_escape_string($time);
		$value = mysql_real_escape_string($value);
		$note = mysql_real_escape_string($note);

		if ($value != "") {

			$sql_insert = "UPDATE `item_log` SET `item_id` = " . $item_id . ",`time` = '".$time."',`value`=".$value.",`note`='".$note."' WHERE `item_log_id` = " . $item_entry_id . " AND `member_id`='" . $_SESSION['session_member_id'] ."'";

			//$return_json['debug'] = $sql_insert;

			$success = mysql_query($sql_insert, $this -> database_link);

			if ($success) {
				$return_json['success'] = 'true';
			} else {
				$return_json['success'] = 'false';
			}

		}
		
		return $return_json;
		
	}
	
	public function Delete_Item_Entry($item_entry_id){
		
		$return_json = array('success' => 'false', );
		
		$sql_insert = "DELETE FROM `item_log` WHERE `item_log_id` = " . $item_entry_id . " AND `member_id`='" . $_SESSION['session_member_id'] ."'";

		//$return_json['debug'] = $sql_insert;

		$success = mysql_query($sql_insert, $this -> database_link);

		if ($success) {
			$return_json['success'] = 'true';
		} else {
			$return_json['success'] = 'false';
		}
		
		return $return_json;
		
	}

	public function Insert_New_Item($name, $unit, $description) {

		$return_json = array('success' => 'false', );

		$name = mysql_real_escape_string($name);
		$unit = mysql_real_escape_string($unit);
		$description = mysql_real_escape_string($description);
		
		if ($name != "") {
	
			$sql_insert = "INSERT INTO `items`(`date_created`,`name`, `unit`, `description`, `member_id`) VALUES (
				NOW(), '" . $name . "', '" . $unit . "', '" . $description . "','" . $_SESSION['session_member_id'] ."')";
	
			$success = mysql_query($sql_insert, $this -> database_link);
	
			if ($success) {
				$return_json['success'] = 'true';
			} else {
				$return_json['success'] = 'false';
			}
	
		}
		
		return $return_json;
	}

	public function Edit_Item($item_id, $name, $unit, $description) {
		
		$return_json = array('success' => 'false', );

		$name = mysql_real_escape_string($name);
		$unit = mysql_real_escape_string($unit);
		$description = mysql_real_escape_string($description);
		
		if ($name != "") {

			$sql_insert = "UPDATE `items` SET `name`='".$name."',`description`='".$description."',`unit`='".$unit."' WHERE `item_id`=" . $item_id . " AND `member_id`='" . $_SESSION['session_member_id'] ."'";

			$success = mysql_query($sql_insert, $this -> database_link);

			if ($success) {
				$return_json['success'] = 'true';
			} else {
				$return_json['success'] = 'false';
			}

		}
		
		return $return_json;
		
	}
	
	public function Delete_Item($item_id) {
		
		$return_json = array('success' => 'false', );
		
		if ($item_id != "") {

			$sql_insert = "DELETE FROM `items` WHERE `item_id`=" . $item_id . " AND `member_id`='" . $_SESSION['session_member_id'] ."'";

			$success = mysql_query($sql_insert, $this -> database_link);

			if ($success) {
				
				$return_json['success'] = 'true';
				
			} else {
				
				$return_json['success'] = 'false';
			}


		}
		
		return $return_json;
		
	}
	
	public function Insert_Item_Target($start_time, $type, $value, $item_id, $period_type, $period, $recurring){
				
		$return_json = array('success' => 'false', );
		
		$sql_insert = "INSERT INTO `item_targets`(
			`start_time`, 
			`type`, 
			`value`, 
			`item_id`, 
			`period_type`, 
			`period`, 
			`recurring`,
			`member_id`) VALUES (
			'".$start_time."',
			'".$type."',
			".$value.",
			".$item_id.",
			'".$period_type."',
			".$period.",
			".$recurring.",
			'" . $_SESSION['session_member_id'] ."')";

		$success = mysql_query($sql_insert, $this -> database_link);

		if ($success) {
			
			$return_json['success'] = 'true';
			
		} else {
			
			$return_json['success'] = 'false';
		}

		return $return_json;
	}

	public function Update_Item_Target($item_target_id, $start_time, $type, $value, $item_id, $period_type, $period, $recurring){
		
		$return_json = array('success' => 'false', );
		
		$sql_insert = "UPDATE `item_targets` SET
			`start_time` = '".$start_time."', 
			`type` = '".$type."',
			`value` = ".$value.", 
			`item_id` = ".$item_id.",
			`period_type` = '".$period_type."',
			`period` = ".$period.",
			`recurring` = ".$recurring."
			WHERE `item_target_id` = " . $item_target_id . " AND `member_id`='" . $_SESSION['session_member_id'] ."'";

		$success = mysql_query($sql_insert, $this -> database_link);

		if ($success) {
			
			$return_json['success'] = 'true';
			
		} else {
			
			$return_json['success'] = 'false';
		}
		
		return $return_json;
		
	}
	
	public function Delete_Item_Target($item_target_id){
		
		$return_json = array('success' => 'false', );
		
		if ($item_target_id != "") {

			$sql_insert = "DELETE FROM `item_targets` WHERE `item_target_id`=" . $item_target_id . " AND `member_id`='" . $_SESSION['session_member_id'] ."'";

			$success = mysql_query($sql_insert, $this -> database_link);

			if ($success) {
				
				$return_json['success'] = 'true';
				
			} else {
				
				$return_json['success'] = 'false';
			}


		}
		
		return $return_json;
		
	}
	
	public function Get_Item_Log_Schema(){
				
		$return_json = array();
		
		$return_json['schema'] = array(
			'item_log_id' => 'int',
			'item_id' => 'int',
			'time' => 'date',
			'value' => 'float',
			'name' => 'string',
			'unit' => 'string',
			'note' => 'string'
		);	
			
		
		return $return_json;
	}
	
	public function Get_Item_Log() {

		$return_json = array('success' => 'false', 'data' => '', );

		$query = "SELECT 
			`item_log`.`item_log_id` AS `item_log_id`,
			`item_log`.`item_id` AS `item_id`, 
			`item_log`.`time` AS `time`, 
			`item_log`.`value` AS `value`, 
			`items`.`name` AS `name`,
			`items`.`unit` AS `unit`, 
			`item_log`.`note` AS `note` 
			FROM `life_management`.`item_log`, `life_management`.`items` 
			WHERE `items`.`item_id` = `item_log`.`item_id` AND `items`.`member_id` = '" . $_SESSION['session_member_id'] ."'
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
	
	public function Get_Items_Schema(){
			
		$return_json = array();
		
		$return_json['schema'] = array(
			'item_name' => 'string', 
			'item_description' => 'string', 
			'item_unit' => 'string', 
			'date_created' => 'date', 
			'item_id' => 'int'
		);
		
		return $return_json;
	}
	
	public function Get_Items() {
		$return_json = array('success' => 'false', 'data' => array(), );
		
		$sql_query = "SELECT `item_id`, `name`, `description`, `unit`, `date_created` FROM `life_management`.`items` WHERE `member_id`='" . $_SESSION['session_member_id'] ."' ORDER BY `name` asc";
		$result = mysql_query($sql_query, $this -> database_link);

		if ($result) {
			$return_json['success'] = 'true';
			$return_json['data'] = array();
			
			$num = mysql_numrows($result);

			$i = 0;
			while ($i < $num) {

				$item_name = mysql_result($result, $i, "name");
				$item_description = mysql_result($result, $i, 'description');
				$item_unit = mysql_result($result, $i, "unit");
				$item_date_created = mysql_result($result, $i, 'date_created');
				$item_id = mysql_result($result, $i, "item_id");

				if ($item_name != "") {
					$return_json['data'][$i] = 
						array(
						'item_name' => $item_name, 
						'item_description' => $item_description, 
						'item_unit' => $item_unit, 
						'date_created' => $item_date_created, 
						'item_id' => $item_id, );


				}

				$i++;
			}
		} else {
			$return_json['success'] = 'false';
		}
		
		return $return_json;
	}

	public function Get_Item_Targets_Schema(){
		
		$return_json = array();
		
		$return_json['schema'] = array(
				'item_target_id' => 'int', 
				'start_time' => 'date', 
				'type' => 'string', 
				'value' => 'float', 
				'item_id' => 'int', 
				'name' => 'string',
				'period_type' => 'string', 
				'period' => 'float', 
				'recurring' => 'bool', 
			);
		
		return $return_json;
		
	}
	
	public function Get_Item_Targets(){
		
		$return_json = array('success' => 'false', 'data' => array(), );
		
		$sql_query = "SELECT 
			`item_targets`.`item_target_id` AS `item_target_id`, 
			`item_targets`.`start_time` AS `start_time`, 
			`item_targets`.`type` AS `type`, 
			`item_targets`.`value` AS `value`, 
			`item_targets`.`item_id` AS `item_id`, 
			`item_targets`.`period_type` AS `period_type`, 
			`item_targets`.`period` AS `period`, 
			`item_targets`.`recurring` AS `recurring`,
			`items`.`name` AS `name`
			FROM `item_targets`, `items` WHERE `items`.`item_id` = `item_targets`.`item_id` AND `items`.`member_id`='" . $_SESSION['session_member_id'] ."'";
		$result = mysql_query($sql_query, $this -> database_link);

		if ($result) {
			$return_json['success'] = 'true';
			$return_json['data'] = array();
			
			$num = mysql_numrows($result);

			$i = 0;
			while ($i < $num) {

				$item_target_id = mysql_result($result, $i, "item_target_id");
				$start_time = mysql_result($result, $i, 'start_time');
				$type = mysql_result($result, $i, "type");
				$value = mysql_result($result, $i, 'value');
				$item_id = mysql_result($result, $i, "item_id");
				$name = mysql_result($result, $i, "name");
				$period_type = mysql_result($result, $i, "period_type");
				$period = mysql_result($result, $i, "period");
				$recurring = mysql_result($result, $i, "recurring");

				$return_json['data'][$i] = 
					array(
						'item_target_id' => $item_target_id, 
						'start_time' => $start_time, 
						'type' => $type, 
						'value' => $value, 
						'item_id' => $item_id, 
						'name' => $name,
						'period_type' => $period_type, 
						'period' => $period, 
						'recurring' => $recurring, 
					);

				$i++;
			}
		} else {
			$return_json['success'] = 'false';
		}
		
		return $return_json;
		
	}
	

}
?>
