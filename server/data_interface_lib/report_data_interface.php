<?php 

class Report_Data_Interface
{
	private $database_link;
	
	public function Report_Data_Interface($new_database_link) {

		//note this is expected to be initialized and open to the proper database
		$this -> database_link = $new_database_link;

	}
	
	public function Save_Report($report_name, $table, $summary_type, $filter_fields, $row_fields, $summary_fields, $graph_type, $graph_x, $graph_y)
	{
		$return_json = array('success' => 'false', );
		
		$report_name = mysql_real_escape_string($report_name);
		$table = mysql_real_escape_string($table);
		$summary_type = mysql_real_escape_string($summary_type);
		$filter_fields = mysql_real_escape_string($filter_fields);
		$row_fields = mysql_real_escape_string($row_fields);
		$summary_fields = mysql_real_escape_string($summary_fields);
		$graph_type = mysql_real_escape_string($graph_type);
		$graph_x = mysql_real_escape_string($graph_x);
		$graph_y = mysql_real_escape_string($graph_y);
		
		$sql = "INSERT INTO `reports`(
			`report_name`, 
			`table_name`, 
			`summary_type`, 
			`filter_fields`, 
			`row_fields`, 
			`summary_fields`, 
			`graph_type`, 
			`graph_x`, 
			`graph_y`, 
			`member_id`) VALUES (
			'".$report_name."',
			'".$table."',
			'".$summary_type."',
			'".$filter_fields."',
			'".$row_fields."',
			'".$summary_fields."',
			'".$graph_type."',
			'".$graph_x."',
			'".$graph_y."',
			'".$_SESSION['session_member_id']."')";
		
		$success = mysql_query($sql, $this -> database_link);

		if ($success) {
			$return_json['success'] = 'true';
		} else {
			$return_json['success'] = 'false';
		}
		
		return $return_json;
	}
	
	public function Update_Saved_Report($saved_report_id, $table, $summary_type, $filter_fields, $row_fields, $summary_fields, $graph_type, $graph_x, $graph_y)
	{
		$return_json = array('success' => 'false', );
		
		$table = mysql_real_escape_string($table);
		$summary_type = mysql_real_escape_string($summary_type);
		$filter_fields = mysql_real_escape_string($filter_fields);
		$row_fields = mysql_real_escape_string($row_fields);
		$summary_fields = mysql_real_escape_string($summary_fields);
		$graph_type = mysql_real_escape_string($graph_type);
		$graph_x = mysql_real_escape_string($graph_x);
		$graph_y = mysql_real_escape_string($graph_y);
		
		$sql = "
			UPDATE `reports` SET 
			`table_name`='".$table."',
			`summary_type`='".$summary_type."',
			`filter_fields`='".$filter_fields."',
			`row_fields`='".$row_fields."',
			`summary_fields`='".$summary_fields."',
			`graph_type`='".$graph_type."',
			`graph_x`='".$graph_x."',
			`graph_y`='".$graph_y."'
			WHERE 
			`report_id`='".$saved_report_id."' AND 
			`member_id`='".$_SESSION['session_member_id']."'";
		
		$return_json['debug'] = $sql;
		
		$success = mysql_query($sql, $this -> database_link);
		
		if ($success) {
			$return_json['success'] = 'true';
		} else {
			$return_json['success'] = 'false';
		}
		
		return $return_json;
	}
	
	public function Delete_Saved_Report($saved_report_id)
	{
		$return_json = array('success' => 'false', );
		
		$saved_report_id = mysql_real_escape_string($saved_report_id);
		
		$sql = "DELETE FROM `reports` WHERE 
			`report_id`='".$saved_report_id."' AND 
			`member_id`='".$_SESSION['session_member_id']."'";
		
		$success = mysql_query($sql, $this -> database_link);

		if ($success) {
			$return_json['success'] = 'true';
		} else {
			$return_json['success'] = 'false';
		}
		
		return $return_json;
	}
	
	public function Get_Saved_Reports()
	{
		$return_json = array('reports' => '', );
		
		$sql = "SELECT * FROM `reports` WHERE `member_id` = '".$_SESSION['session_member_id']."'";
		
		$result = mysql_query($sql, $this -> database_link);
		
		$num = mysql_numrows($result);

		$i = 0;
		while ($i < $num) {
			
			$report_id = mysql_result($result, $i, "report_id");
			$report_name = mysql_result($result, $i, "report_name");
			$table = mysql_result($result, $i, "table_name");
			$summary_type = mysql_result($result, $i, "summary_type");
			$filter_fields = mysql_result($result, $i, "filter_fields");
			$row_fields = mysql_result($result, $i, "row_fields");
			$summary_fields = mysql_result($result, $i, "summary_fields");
			$graph_type = mysql_result($result, $i, "graph_type");
			$graph_x = mysql_result($result, $i, "graph_x");
			$graph_y = mysql_result($result, $i, "graph_y");
			
			$return_json['reports'][$i] = array(
				'report_id' => $report_id,
				'report_name' => $report_name,
				'table_name' => $table,
				'summary_type' => $summary_type,
				'filter_fields' => $filter_fields,
				'row_fields' => $row_fields,
				'summary_fields' => $summary_fields,
				'graph_type' => $graph_type,
				'graph_x' => $graph_x,
				'graph_y' => $graph_y);


			$i++;
		}
		
		return $return_json;
	}
	
}

?>