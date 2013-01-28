<?php

require_once('auth.php');
require_once('config.php');

//Connect to mysql server
$link = mysql_connect(DB_HOST, DB_USER, DB_PASSWORD);
if(!$link) {
	die('Failed to connect to server: ' . mysql_error());
}

//Select database
$db = mysql_select_db(DB_DATABASE);
if(!$db) {
	die("Unable to select database");
}

$return_html = '';

//if statements for different forms
if(isset($_POST['value']) && $_POST['value'] != "")
{
	//item entry form

	$value = mysql_real_escape_string($_POST['value']);

	if($_POST['unit_dropdown'] != "-")
	{
		$unit = mysql_real_escape_string($_POST['unit_dropdown']);
	}
	else
	{
		$unit = "";
	}

	$note = mysql_real_escape_string($_POST['notes']);

	if($value != "")
	{
		

		$add_form_output .= "Inserted new row: <br>Value: ". $value . "<br>Unit: " . $unit . "<br>Notes: " . $note . "<br>";

		$sql_insert = "INSERT INTO `life_management`.`item_log` (
			`time` ,

			`value` ,
			`unit` ,
			`note`
			)
			VALUES (

			NOW(), '".$value."', '".$unit."', '".$note."')";

		mysql_query($sql_insert);
		
		$return_html .= "Value successfully inserted.";

	}
	
	

}
elseif(isset($_POST['task_name_to_enter']))
{
	
	//task entry form
	
	$task_name_to_enter = mysql_real_escape_string($_POST['task_name_to_enter']);
	$task_start_stop = mysql_real_escape_string($_POST['task_start_stop']);
	
	$sql_query = "SELECT DISTINCT `task_id` FROM `life_management`.`tasks` WHERE `name` = '".$task_name_to_enter."'";
	$result=mysql_query($sql_query);

	$task_id = mysql_result($result,0,"task_id");

	if($task_start_stop == "Start")
	{
		$sql = "INSERT INTO `task_log`(`task_id`, `start_time`) VALUES ('".$task_id."',NOW())";
	}
	else
	{
		$sql = "UPDATE `task_log` SET `hours`=(TIMESTAMPDIFF(SECOND,`start_time`,NOW())/60/60) WHERE `task_id` = '".$task_id."' and `hours` = 0";
	}
	
	//execute insert
	mysql_query($sql);
	
	//$return_html .= $sql;
}
elseif($_POST['task_name'] != "")
{
	
	$task_name = mysql_real_escape_string($_POST['task_name']);
	$task_description = mysql_real_escape_string($_POST['task_description']);
	$task_estimated_time = mysql_real_escape_string($_POST['task_estimated_time']);
	$task_note = mysql_real_escape_string($_POST['task_note']);
	
	$sql = 'INSERT INTO `life_management`.`tasks`(`name`, `description`, `date_created`, `estimated_time`, `note`) VALUES (';
	$sql .= "'".$task_name."',";
	$sql .= "'".$task_description."',";
	$sql .= "NOW(),";
	$sql .= "".$task_estimated_time.",";
	$sql .= "'".$task_note."')";
	
	
	mysql_query($sql);
}
elseif(isset($_POST['refresh_data_display_hidden']))
{
	
	$query="SELECT * FROM `life_management`.`item_log` order by `time` desc";
	$result=mysql_query($query);

	$num=mysql_numrows($result);

	$return_html .= "
	<b>Database Output</b><br>
	<table border='1' style='width:100%;'>";

	$return_html .= "<tr><td>Date</td><td>Value</td><td>Unit</td><td>Note</td></tr>";

	$i=0;
	while ($i < $num) {

		$field1_name = mysql_result($result,$i,"time");
		$field2_name = mysql_result($result,$i,"value");
		$field3_name = mysql_result($result,$i,"unit");
		$field4_name = mysql_result($result,$i,"note");

		$return_html .= 
			"<tr><td width='25%'>". 
			$field1_name . 
			"</td><td width='25%'>" . 
			$field2_name . 
			"</td><td width='25%'>" . 
			$field3_name . 
			"</td><td width='25%'>" . 
			$field4_name . "</td></tr>";

		$i++;
	}

	$return_html .= '
	</table>';
	
}
elseif(isset($_POST['refresh_home_display_hidden']))
{

	$titles_and_queries = array(
		"1 Day Item Totals:" => "SELECT `unit` AS `name`, SUM( `value` ) AS `agg_value` FROM `item_log` WHERE DATEDIFF( NOW( ) , `time` ) < 1 GROUP BY `unit`",
		"7 Day Item Averages:" => "SELECT `unit` AS `name`, (SUM( `value` ) / 7) AS `agg_value` FROM `item_log` WHERE DATEDIFF( NOW( ) , `time` ) <= 7 AND DATEDIFF( NOW( ) , `time` ) > 0 GROUP BY `unit`",
		"1 Day Task Totals:" => "SELECT `tasks`.`name` AS `name`, SUM(`task_log`.`hours`) AS `agg_value` FROM `task_log`, `tasks` WHERE `task_log`.`task_id` = `tasks`.`task_id` AND DATEDIFF( NOW( ) , `task_log`.`start_time` ) < 1 GROUP BY `tasks`.`name`",
		"7 Day Task Averages:" => "SELECT `tasks`.`name` AS `name`, (SUM(`task_log`.`hours`) / 7) AS `agg_value` FROM `task_log`, `tasks` WHERE `task_log`.`task_id` = `tasks`.`task_id` AND DATEDIFF( NOW( ) , `task_log`.`start_time` ) <= 7 AND DATEDIFF( NOW( ) , `task_log`.`start_time` ) > 0 GROUP BY `tasks`.`name`",
	);

	foreach ($titles_and_queries as $title => $query) {
	    
	    	$return_html .= '
		<b>'.$title.'</b> <br />
		<table border="1" style="width:100%;">
		<tr><td><b>Unit</b></td><td><b>Aggregate</b></td></tr>';


		$result=mysql_query($query);
		$num=mysql_numrows($result);


		$i=0;
		while ($i < $num) {
	
			$return_html .= '<tr>';
	
			$field1_name = mysql_result($result,$i,"name");
			$field2_name = mysql_result($result,$i,"agg_value");

			$return_html .= '<td style="width:50%;">'.$field1_name."</td>";
			$return_html .= '<td style="width:50%;">'.round($field2_name,2)."</td>";
			
			$return_html .= '</tr>';

			$i++;
		}

		$return_html .= '</table><br />';
	    
	}


/*
	$return_html .= '
	
		1 Day Totals: <br />
		3 Days Totals: <br />
		Week Totals: <br />
		
		<br />
		1 Day Task Breakdown: <br />
		3 Day Task Breakdown: <br />
		Week Task Breakdown: <br />
	
	';
*/
}

echo $return_html;


