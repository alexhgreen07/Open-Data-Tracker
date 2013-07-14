<?php
/** \file data_interface.php
 * \brief This file contains the class definition for the Data_Interface class.
 * */

/** \class Data_Interface
 * \brief This class contains a database link for use in connecting with the database.
 * */
class Data_Interface {

	//this will store the open database link
	private $database_link;

	public function Data_Interface($new_database_link) {

		//note this is expected to be initialized and open to the proper database
		$this -> database_link = $new_database_link;

	}

}
?>
