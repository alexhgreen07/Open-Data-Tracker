<?php
/** \file data_interface.php
 * \brief This file contains the class definition for the Data_Interface class.
 * */
 
require_once ('data_interface_lib/home_data_interface.php');
require_once ('data_interface_lib/item_data_interface.php');
require_once ('data_interface_lib/task_data_interface.php');
require_once ('data_interface_lib/report_data_interface.php');


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
		
		$return_json = array('authenticated' => 'false', 'success' => 'false', 'data' => '', );
		
		
		$return_json['data'] = array();
		
		$categories = $this->homedatainteface->Get_Categories();
		$items = $this->itemdatainterface->Get_Items();
		$item_entries = $this->itemdatainterface->Get_Item_Log();
		$tasks = $this->taskdatainterface->Get_Tasks();
		$task_entries = $this->taskdatainterface->Get_Task_Log();
		$task_targets = $this->taskdatainterface->Get_Task_Targets();
		
		$return_json['data']['categories'] = $categories['data'];
		$return_json['data']['items'] = $items['data'];
		$return_json['data']['item_entries'] = $item_entries['data'];
		$return_json['data']['tasks'] = $tasks['data'];
		$return_json['data']['task_entries'] = $task_entries['data'];
		$return_json['data']['task_targets'] = $task_targets['data'];
		
		return $return_json;
		
	}

}
?>
