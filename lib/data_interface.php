<?php

require_once('auth.php');
require_once('data_interface_lib/home_data_interface.php');
require_once('data_interface_lib/item_data_interface.php');
require_once('data_interface_lib/task_data_interface.php');
require_once('data_interface_lib/data_data_interface.php');

class Data_Interface {
	
	//this will store the open database link
	private $database_link;
	private $home_data_interface;
	private $item_data_interface;
	private $task_data_interface;
	private $data_data_interface;
	
	public function Data_Interface($new_database_link) {
		
		//note this is expected to be initialized and open to the proper database
		$this->database_link = $new_database_link;
		
		//create the new helper objects
		$this->home_data_interface = new Home_Data_Interface($new_database_link);
		$this->item_data_interface = new Item_Data_Interface($new_database_link);
		$this->task_data_interface = new Task_Data_Interface($new_database_link);
		$this->data_data_interface = new Data_Data_Interface($new_database_link);
	}

	public function Get_Home_Data_Summary()
	{
		
		$home_data_int = $this->home_data_interface;
		
		$return_json = $home_data_int->Get_Home_Data_Summary();
		
		return $return_json;
	}

	public function Insert_Quick_Item_Entry($value, $item_id, $note)
	{
		
		$item_data_int = $this->item_data_interface;
		
		$return_json = $item_data_int->Insert_Quick_Item_Entry($value, $item_id, $note);
		
		return $return_json;	
		
	}
	
	public function Insert_Item_Entry($time, $value, $item_id, $note)
	{
		$item_data_int = $this->item_data_interface;
		
		$return_json = $item_data_int->Insert_Item_Entry($time, $value, $item_id, $note);
		
		return $return_json;
	}
	
	public function Get_Items()
	{
		$item_data_int = $this->item_data_interface;
		
		$return_json = $item_data_int->Get_Items();
		
		return $return_json;
	}
	
	public function Add_New_Item($name, $unit, $description)
	{

		$item_data_int = $this->item_data_interface;
		
		$return_json = $item_data_int->Add_New_Item($name, $unit, $description);
		
		return $return_json;
	}

	public function Edit_Item()
	{
		$item_data_int = $this->item_data_interface;
		
		$return_json = $item_data_int->Edit_Item();
		
		return $return_json;
	}
	
	public function Insert_Task_Entry($start_time, $task_id, $hours, $completed)
	{
		
		$task_data_int = $this->task_data_interface;
		
		$return_json = $task_data_int->Insert_Task_Entry($start_time, $task_id, $hours, $completed);
		
		return $return_json;
	}
	
	public function Get_Start_Stop_Task_Names()
	{
		$task_data_int = $this->task_data_interface;
		
		$return_json = $task_data_int->Get_Start_Stop_Task_Names();
		
		return $return_json;
	}
	
	public function Task_Start_Stop($task_name_to_enter, $task_start_stop)
	{
		$task_data_int = $this->task_data_interface;
		
		$return_json = $task_data_int->Task_Start_Stop($task_name_to_enter, $task_start_stop);
		
		return $return_json;
	}
	
	public function Task_Mark_Complete($task_name_to_enter)
	{
		$task_data_int = $this->task_data_interface;
		
		$return_json = $task_data_int->Task_Mark_Complete($task_name_to_enter);
		
		return $return_json;
	}
	
	public function Add_New_Task($name,$description,$estimated_time,$note)
	{
		$task_data_int = $this->task_data_interface;
		
		$return_json = $task_data_int->Add_New_Task($name,$description,$estimated_time,$note);
		
		return $return_json;
	}
	
	public function Get_Tasks()
	{
		$task_data_int = $this->task_data_interface;
		
		$return_json = $task_data_int->Get_Tasks();
		
		return $return_json;
	}
	
	public function Get_Item_Log()
	{
		
		$data_data_int = $this->data_data_interface;
		
		$return_json = $data_data_int->Get_Item_Log();
		
		return $return_json;
	}
	
	
	
}


?>
