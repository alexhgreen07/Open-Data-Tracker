<?php 

class Report_Data_Interface
{
	private $database_link;
	
	public function Report_Data_Interface($new_database_link) {

		//note this is expected to be initialized and open to the proper database
		$this -> database_link = $new_database_link;

	}
	
	public function Save_Report($table, $summary_type, $filter_fields, $row_fields, $summary_fields, $graph_type, $graph_x, $graph_y)
	{
		$return_json = array('success' => 'false', );
		
		
		
		return $return_json;
	}
	
	public function Delete_Saved_Report($saved_report_id)
	{
		$return_json = array('success' => 'false', );
		
		
		
		return $return_json;
	}
	
	public function Get_Saved_Reports()
	{
		$return_json = array('success' => 'false', );
		
		
		
		return $return_json;
	}
	
}

?>