<?php
/** \file data_interface.php
 * \brief This file contains the class definition for the Data_Interface class.
 * */
 
require_once ('data_interface_lib/home_data_interface.php');
require_once ('data_interface_lib/item_data_interface.php');
require_once ('data_interface_lib/task_data_interface.php');


/** \class Data_Interface
 * \brief This class contains a database link for use in connecting with the database.
 * */
class Data_Interface {

	//this will store the open database link
	private $database_link;
	private $homedatainteface;
	private $itemdatainterface;
	private $taskdatainterface;
	private $reportdatainterface;
	
	/** \fn public function Data_Interface($new_database_link)
	 * \brief This is the constructor for the class.
	 * \param new_database_link This is the link to the database which the class will be interacting with.
	 * \return None.
	 * */
	public function Data_Interface($new_database_link) {

		//note this is expected to be initialized and open to the proper database
		$this -> database_link = $new_database_link;
		
		$this -> homedatainteface = new Home_Data_Interface($new_database_link);
		$this -> itemdatainterface = new Item_Data_Interface($new_database_link);
		$this -> taskdatainterface = new Task_Data_Interface($new_database_link);
		$this -> reportdatainterface = new Report_Data_Interface($new_database_link);
	}
	
	public function Refresh_All_Data(){
		
		$return_json = array('success' => 'false', 'data' => '', );
		
		$return_json['data'] = array();
		$return_json['schema'] = array();
	
		$categories = $this->homedatainteface->Get_Categories();
		$items = $this->itemdatainterface->Get_Items();
		$item_entries = $this->itemdatainterface->Get_Item_Log();
		$item_targets = $this->itemdatainterface->Get_Item_Targets();
		$tasks = $this->taskdatainterface->Get_Tasks();
		$task_entries = $this->taskdatainterface->Get_Task_Log();
		$task_targets = $this->taskdatainterface->Get_Task_Targets();
		
		$categories_schema = $this->homedatainteface->Get_Categories_Schema();
		$items_schema = $this->itemdatainterface->Get_Items_Schema();
		$item_entries_schema = $this->itemdatainterface->Get_Item_Log_Schema();
		$item_targets_schema = $this->itemdatainterface->Get_Item_Targets_Schema();
		$tasks_schema = $this->taskdatainterface->Get_Tasks_Schema();
		$task_entries_schema = $this->taskdatainterface->Get_Task_Log_Schema();
		$task_targets_schema = $this->taskdatainterface->Get_Task_Targets_Schema();
		
		$settings = $this->homedatainteface->Get_Settings();
		$reports = $this->reportdatainterface->Get_Saved_Reports();
		
		//load all data in the return json arrays
		$return_json['data']['Categories'] = $categories['data'];
		$return_json['data']['items'] = $items['data'];
		$return_json['data']['item_entries'] = $item_entries['data'];
		$return_json['data']['item_targets'] = $item_targets['data'];
		$return_json['data']['tasks'] = $tasks['data'];
		$return_json['data']['task_entries'] = $task_entries['data'];
		$return_json['data']['task_targets'] = $task_targets['data'];
		
		//load all data schemas in the return json arrays
		$return_json['schema']['Categories'] = $categories_schema['schema'];
		$return_json['schema']['items'] = $items_schema['schema'];
		$return_json['schema']['item_entries'] = $item_entries_schema['schema'];
		$return_json['schema']['item_targets'] = $item_targets_schema['schema'];
		$return_json['schema']['tasks'] = $tasks_schema['schema'];
		$return_json['schema']['task_entries'] = $task_entries_schema['schema'];
		$return_json['schema']['task_targets'] = $task_targets_schema['schema'];
		
		$return_json['settings'] = $settings;
		$return_json['reports'] = $reports['reports'];
		
		return $return_json;
		
	}

	public function Refresh_From_Session_Diff(){
		
		$return_json = array('success' => 'false', 'data' => '', );
		
		$new_return_json = $this->Refresh_All_Data();
		
		if(isset($_SESSION['last_return_json']))
		{
			//TODO: Generate diff between new JSON and old JSON
			
			$old_return_json = $_SESSION['last_return_json'];
			
			$return_json['data']['Categories'] = 
				$this->Diff_Table(
					$old_return_json['data']['Categories'], 
					$new_return_json['data']['Categories'], 
					'Category ID');
			$return_json['data']['items'] = 
				$this->Diff_Table(
					$old_return_json['data']['items'], 
					$new_return_json['data']['items'], 
					'item_id');
			$return_json['data']['item_entries'] = 
				$this->Diff_Table(
					$old_return_json['data']['item_entries'], 
					$new_return_json['data']['item_entries'], 
					'item_log_id');
			$return_json['data']['item_targets'] = 
				$this->Diff_Table(
					$old_return_json['data']['item_targets'], 
					$new_return_json['data']['item_targets'], 
					'item_target_id');
			$return_json['data']['tasks'] = 
				$this->Diff_Table(
					$old_return_json['data']['tasks'], 
					$new_return_json['data']['tasks'], 
					'task_id');
			$return_json['data']['task_entries'] = 
				$this->Diff_Table(
					$old_return_json['data']['task_entries'], 
					$new_return_json['data']['task_entries'], 
					'task_log_id');
			$return_json['data']['task_targets'] = 
				$this->Diff_Table(
					$old_return_json['data']['task_targets'], 
					$new_return_json['data']['task_targets'], 
					'task_schedule_id');
			
			$return_json['settings']['settings'] = 
				$this->Diff_Table(
					$old_return_json['settings']['settings'], 
					$new_return_json['settings']['settings'], 
					'Setting ID');
			$return_json['settings']['setting_entries'] = 
				$this->Diff_Table(
					$old_return_json['settings']['setting_entries'], 
					$new_return_json['settings']['setting_entries'], 
					'Setting Entry ID');
			$return_json['reports'] = 
				$this->Diff_Table(
					$old_return_json['reports'], 
					$new_return_json['reports'], 
					'report_id');
		}
		
		$_SESSION['last_return_json'] = $new_return_json;
		$return_json['success'] = 'true';
		
		return $return_json;
	}
	
	public function Diff_Table($old_table, $new_table, $primary_column)
	{
		//assumes table is already sorted by primary column
		$diff_table = array();
		
		$old_cnt = 0;
		$new_cnt = 0;
		
		while(($old_cnt < count($old_table)) || ($new_cnt < count($new_table)))
		{
			$old_row = $old_table[$old_cnt];
			$new_row = $new_table[$new_cnt];
			
			if(($old_cnt >= count($old_table)) || ($old_row[$primary_column] < $new_row[$primary_column]))
			{
				
				$diff_table[] = array('insert',$new_row);
				$new_cnt++;
				
				
			}
			else if(($new_cnt >= count($new_table)) || ($old_row[$primary_column] > $new_row[$primary_column]))
			{
				
				$diff_table[] = array('remove',$old_row);
				$old_cnt++;
			}
			else {
				
				$old_row_string = json_encode($old_row);
				$new_row_string = json_encode($new_row);
				
				//check the JSON encoded row
				if($old_row_string !== $new_row_string)
				{
					$diff_table[] = array('update',$new_row);
				}
				
				$old_cnt++;
				$new_cnt++;
			}
		}
		
		return $diff_table;
	}

}
?>
