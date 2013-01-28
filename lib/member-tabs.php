<?php

//require authorization and configuration files
require_once('auth.php');
require_once('config.php');

require_once('tab_forms/home_forms.php');
require_once('tab_forms/items_forms.php');
require_once('tab_forms/tasks_forms.php');
require_once('tab_forms/data_forms.php');

//pages and objects
require_once('external/jquery-ui/jquery_php.php');
require_once('external/d3/d3_php.php');

//this should be added to the HTML header
$member_forms_header_text = $jquery_ui_header_text . $d3_header_text;

function Render_Home_Tab()
{
	$html_output = '';
	
	$html_output .= Render_Home_Form();
	
	return $html_output;
}

function Render_Items_Tab()
{
	
	//compile the item tab with internal accordian
	$item_panes = array(
		"New Item Entry" => Render_Add_Item_Entry_Form(),
		"View Items" => "Under construction...",
		"New Item" => "Under construction...",
		"Edit Item" => "Under construction...",
	);
	$item_tab = Create_Accordian("items_accordian",$item_panes);
	
	return $item_tab;
}

function Render_Tasks_Tab()
{
	
	
	//compile the task tab with internal accordian
	$task_panes = array(
		"New Task Entry" => Render_Add_Task_Entry_Form(),
		"View Tasks" => Render_View_Tasks_Form(),
		"New Task" => Render_New_Task_Form(),
		"Edit Task" => Render_Edit_Task_Form(),
	);
	$task_tab = Create_Accordian("tasks_accordian",$task_panes);

	return $task_tab;
}

function Render_Data_Tab()
{
	
	return Render_Display_Data_Form();
}

function Render_Graph_Tab()
{
	
	$graph_div_id = 'graph';
	
	$dataset = array();
	
	for($i=0;$i<26;$i++)
	{
		$dataset[chr(ord("A")+$i)] = rand(0,1000)/1000;
	}
	
	$html_output = '';
	
	//create the graph div
	$html_output = '<div id="'.$graph_div_id.'" class="graphs"></div>';
	
	//render the dataset using the script
	$html_output .= Create_Graph($graph_div_id,$dataset);
	
	
	return $html_output;
}

?>

