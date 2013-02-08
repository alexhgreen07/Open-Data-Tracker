<?php

class Graph_Data_Interface {
	
	//this will store the open database link
	private $database_link;
	
	public function Graph_Data_Interface($new_database_link) {
		
		//note this is expected to be initialized and open to the proper database
		$this->database_link = $new_database_link;
		
	}
	
	
}

?>
