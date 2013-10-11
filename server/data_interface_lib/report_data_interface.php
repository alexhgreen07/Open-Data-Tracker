<?php
/** \file report_data_interface.php
 * \brief This file contains the class definition for the item data interface class.
 * */

/** \class Report_Data_Interface
 * \brief This class contains functions related to report generation. 
 * Special queries and data views will be availabe from here.
 * */
class Report_Data_Interface {

	//this will store the open database link
	private $database_link;

	public function Report_Data_Interface($new_database_link) {

		//note this is expected to be initialized and open to the proper database
		$this -> database_link = $new_database_link;

	}
	

}
?>
