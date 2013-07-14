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
    
	/** \fn public function Data_Interface($new_database_link)
	 * \brief This is the constructor for the class.
	 * \param new_database_link This is the link to the database which the class will be interacting with.
	 * \return None.
	 * */
	public function Data_Interface($new_database_link) {

		//note this is expected to be initialized and open to the proper database
		$this -> database_link = $new_database_link;

	}

}
?>
