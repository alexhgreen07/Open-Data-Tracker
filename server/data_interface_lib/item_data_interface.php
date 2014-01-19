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

	public function Insert_Item_Entry($time, $value, $item_id, $note , $item_target_id) {

		$return_json = array('success' => 'false', );
		
		$value = mysql_real_escape_string($value);

		if ($item_id != "-") {
			$item_id = mysql_real_escape_string($item_id);
		} else {
			$item_id = "";
		}

		$note = mysql_real_escape_string($note);

		if ($value != "") {

			$sql_insert = "INSERT INTO `item_log` (
				`time` ,
				`value` ,
				`item_id` ,
				`note`,
				`item_target_id`,
				`member_id`
				)
				VALUES (
				'" . $time . "', 
				'" . $value . "', 
				'" . $item_id . "', 
				'" . $note . "',
				".$item_target_id.",
				'" . $_SESSION['session_member_id'] ."')";

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
	
	public function Update_Item_Entry($item_entry_id, $time, $value, $item_id, $note, $item_target_id){
		
		$return_json = array('success' => 'false', );
		
		$time = mysql_real_escape_string($time);
		$value = mysql_real_escape_string($value);
		$note = mysql_real_escape_string($note);
		$item_target_id = mysql_real_escape_string($item_target_id);

		if ($value != "") {

			$sql_insert = "UPDATE `item_log` SET `item_id` = 
				" . $item_id . ",
				`time` = '".$time."',
				`value`=".$value.",
				`note`='".$note."',
				`item_target_id` = ".$item_target_id." 
				WHERE 
				`item_log_id` = " . $item_entry_id . " AND 
				`member_id`='" . $_SESSION['session_member_id'] ."'";

			$return_json['debug'] = $sql_insert;

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
				UTC_TIMESTAMP(), '" . $name . "', '" . $unit . "', '" . $description . "','" . $_SESSION['session_member_id'] ."')";
	
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
	
	public function Insert_Item_Target($start_time, $type, $value, $item_id, $period_type, $period, $variance, $recurring, $recurrance_period, $recurrance_end_date){
				
		$return_json = array('success' => 'false', );
		
		$sql = "INSERT INTO `item_targets`(
			`start_time`, 
			`type`, 
			`value`, 
			`item_id`, 
			`period_type`, 
			`period`, 
			`allowed_variance`,
			`recurring`,
			`recurrance_period`,
			`recurrance_end_time`,
			`member_id`) VALUES (
			'".$start_time."',
			'".$type."',
			".$value.",
			".$item_id.",
			'".$period_type."',
			".$period.",
			".$variance.",
			".$recurring.",
			".$recurrance_period.",
			'".$recurrance_end_date."',
			'" . $_SESSION['session_member_id'] ."')";

		$success = mysql_query($sql, $this -> database_link);
		
		$sql = "SELECT * FROM `item_targets` WHERE 
			`start_time` = '".$start_time."' AND 
			`type` = '".$type."' AND 
			`value` = ".$value." AND
			`item_id` = ".$item_id." AND
			`period_type` = '".$period_type."' AND
			`period` = ".$period." AND
			`allowed_variance` = ".$variance." AND
			`recurring` = ".$recurring." AND
			`recurrance_period` = ".$recurrance_period." AND
			`recurrance_end_time` = '".$recurrance_end_date."' AND
			`member_id` = '" . $_SESSION['session_member_id'] ."'";
		
		$result = mysql_query($sql, $this -> database_link);
		
		if (!$result) {
			$return_json['success'] = 'false';
			$return_json['debug'] = "SQL select failed." . $sql;
			return $return_json;
		}
		
		$num = mysql_numrows($result);
		
		if($num > 0)
		{
			$item_target_id = mysql_result($result, 0, "item_target_id");
			$local_return_json = $this->Insert_Recurring_Children($item_target_id);
		}
		else {
			$return_json['success'] = 'false';
			$return_json['debug'] = "Number of rows = 0. " . $sql;
			return $return_json;
		}
		
		if ($success) {
			
			$return_json['success'] = 'true';
			
		} else {
			
			$return_json['success'] = 'false';
		}

		return $return_json;
	}

	public function Update_Item_Target($item_target_id, $start_time, $type, $value, $item_id, $period_type, $period, $variance, $recurring, $recurrance_period, $recurrance_end_date){
		
		$return_json = array('success' => 'false', );
		
		$sql_insert = "UPDATE `item_targets` SET
			`start_time` = '".$start_time."', 
			`type` = '".$type."',
			`value` = ".$value.", 
			`item_id` = ".$item_id.",
			`period_type` = '".$period_type."',
			`period` = ".$period.",
			`allowed_variance` = ".$variance.",
			`recurring` = ".$recurring.",
			`recurrance_period` = ".$recurrance_period.",
			`recurrance_end_time` = '".$recurrance_end_date."'
			WHERE `item_target_id` = " . $item_target_id . " AND `member_id`='" . $_SESSION['session_member_id'] ."'";

		$success = mysql_query($sql_insert, $this -> database_link);

		if ($success) {
			
			$local_return_json = $this->Update_Recurring_Children($item_target_id, $start_time, $type, $value, $item_id, $period_type, $period, $variance, $recurring, $recurrance_period, $recurrance_end_date);
			
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
						
				$this->Delete_Recurring_Children($item_target_id);
				
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
			'note' => 'string',
			'item_target_id' => 'int'
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
			`item_log`.`item_target_id` AS `item_target_id`,
			`items`.`name` AS `name`,
			`items`.`unit` AS `unit`, 
			`item_log`.`note` AS `note` 
			FROM `item_log`, `items` 
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
			$item_entry_target_id = mysql_result($result, $i, "item_target_id");
			
			$return_json['data'][$i] = array(
				'item_log_id' => $item_entry_log_id,
				'item_id' => $item_entry_id,
				'time' => $item_entry_time,
				'value' => $item_entry_value,
				'name' => $item_entry_name,
				'unit' => $item_entry_unit,
				'note' => $item_entry_note,
				'item_target_id' =>$item_entry_target_id);


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
		
		$sql_query = "SELECT `item_id`, `name`, `description`, `unit`, `date_created` FROM `items` WHERE `member_id`='" . $_SESSION['session_member_id'] ."' ORDER BY `name` asc";
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
				'recurring_child_id' => 'int',
				'recurrance_end_time' => 'date',
				'allowed_variance' => 'float',
				'recurrance_period' => 'float'
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
			`item_targets`.`recurring_child_id` AS `recurring_child_id`,
			`item_targets`.`recurrance_end_time` AS `recurrance_end_time`,
			`item_targets`.`allowed_variance` AS `allowed_variance`,
			`item_targets`.`recurrance_period` AS `recurrance_period`,
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
				$recurring_child_id = mysql_result($result, $i, "recurring_child_id");
				$recurrance_end_time = mysql_result($result, $i, "recurrance_end_time");
				$allowed_variance = mysql_result($result, $i, "allowed_variance");
				$recurrance_period = mysql_result($result, $i, "recurrance_period");

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
						'recurring_child_id' => $recurring_child_id,
						'recurrance_end_time' => $recurrance_end_time,
						'allowed_variance' => $allowed_variance,
						'recurrance_period' => $recurrance_period
					);

				$i++;
			}
		} else {
			$return_json['success'] = 'false';
		}
		
		return $return_json;
		
	}
	
	public function Insert_Recurring_Children($item_target_id)
	{
		$return_json = array('success' => 'false', );
		
		$sql = "SELECT * FROM `item_targets` WHERE `item_targets`.`item_target_id` = ".$item_target_id." AND 
			`item_targets`.`member_id`='" . $_SESSION['session_member_id'] ."'";
			
		$result = mysql_query($sql, $this -> database_link);
		
		if(!$result){
			
			$return_json['debug'] = $sql;
			return $return_json;
			
		} 
		
		$num = mysql_numrows($result);

		$i = 0;
		if ($num > 0) {
			
			$item_target_id = mysql_result($result, $i, "item_target_id");
			$start_time = mysql_result($result, $i, 'start_time');
			$type = mysql_result($result, $i, "type");
			$value = mysql_result($result, $i, 'value');
			$item_id = mysql_result($result, $i, "item_id");
			$period_type = mysql_result($result, $i, "period_type");
			$period = mysql_result($result, $i, "period");
			$recurring = mysql_result($result, $i, "recurring");
			$recurring_child_id = mysql_result($result, $i, "recurring_child_id");
			$recurrance_end_time = mysql_result($result, $i, "recurrance_end_time");
			$allowed_variance = mysql_result($result, $i, "allowed_variance");
			$recurrance_period = mysql_result($result, $i, "recurrance_period");
			
			if($recurring && $recurring_child_id == 0)
			{
				$recurring_timestamp = strtotime($start_time);
				$recurrance_end_timestamp = strtotime($recurrance_end_time);
				
				$recurrance_period_seconds = (int)$recurrance_period * 60 * 60;
				
				while($recurring_timestamp < $recurrance_end_timestamp)
				{
					
					$recurring_timestamp = $recurring_timestamp + $recurrance_period_seconds;
					
					$recurring_timestring = date("Y-m-d H:i:s", $recurring_timestamp);
					
					$sql = "INSERT INTO `item_targets`(
						`start_time`, 
						`type`, 
						`value`, 
						`item_id`, 
						`period_type`, 
						`period`, 
						`allowed_variance`,
						`recurring`,
						`recurrance_period`,
						`recurrance_end_time`,
						`member_id`) VALUES (
						'".$recurring_timestring."',
						'".$type."',
						".$value.",
						".$item_id.",
						'".$period_type."',
						".$period.",
						".$allowed_variance.",
						".$recurring.",
						".$recurrance_period.",
						'".$recurring_timestring."',
						'" . $_SESSION['session_member_id'] ."')";
					
					$result = mysql_query($sql, $this -> database_link);
					
					if(!$result){
						
						
						$return_json['debug'] = $sql;
						return $return_json;
						
					} 
				}
			}
						
		}
		else {
			
			$return_json['debug'] = $sql;
			return $return_json;
			
		}
		
		$return_json['success'] = 'true';
		return $return_json;
	}
	
	public function Update_Recurring_Children($item_target_id, $new_start_time, $new_type, $new_value, $new_item_id, $new_period_type, $new_period, $new_variance, $new_recurring, $new_recurrance_period, $new_recurrance_end_date)
	{
		//TODO: implement
	}
	
	public function Delete_Recurring_Children($item_target_id)
	{
		//TODO: implement
	}
}
?>
