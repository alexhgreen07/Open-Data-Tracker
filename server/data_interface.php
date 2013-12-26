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
		
		$reports = $this->reportdatainterface->Get_Saved_Reports();
		
		//load all data in the return json arrays
		$return_json['data']['categories'] = $categories['data'];
		$return_json['data']['items'] = $items['data'];
		$return_json['data']['item_entries'] = $item_entries['data'];
		$return_json['data']['item_targets'] = $item_targets['data'];
		$return_json['data']['tasks'] = $tasks['data'];
		$return_json['data']['task_entries'] = $task_entries['data'];
		$return_json['data']['task_targets'] = $task_targets['data'];
		
		//load all data schemas in the return json arrays
		$return_json['schema']['categories'] = $categories_schema['schema'];
		$return_json['schema']['items'] = $items_schema['schema'];
		$return_json['schema']['item_entries'] = $item_entries_schema['schema'];
		$return_json['schema']['item_targets'] = $item_targets_schema['schema'];
		$return_json['schema']['tasks'] = $tasks_schema['schema'];
		$return_json['schema']['task_entries'] = $task_entries_schema['schema'];
		$return_json['schema']['task_targets'] = $task_targets_schema['schema'];
		
		$return_json['reports'] = $reports['reports'];
		
		return $return_json;
		
	}

}
?>
