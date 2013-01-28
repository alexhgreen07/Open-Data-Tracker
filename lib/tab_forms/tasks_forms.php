<?php


function Render_Add_Task_Entry_Form()
{
	
	$html_output = '';
	
	$html_output .= '
	<form method="post" style="text-align:center;" id="add_task_entry_form">
	<div style= text-align:left;">
	';
	
	$html_output .= 'Tasks:<br />';
	$html_output .= '<select name="task_name_to_enter" id="task_name_to_enter">';
	
	$javascript_info_array = 'var task_info = new Array();
	';
	
	//display all the different tasks in the dropdown
	$sql_query = "SELECT DISTINCT `task_id`,`name`,`date_created` FROM `life_management`.`tasks`";
	$result=mysql_query($sql_query);
	$num=mysql_numrows($result);

	$i=0;
	while ($i < $num) {

		$row_result = mysql_result($result,$i,"name");
		$task_id = mysql_result($result,$i,"task_id");
		$task_date_created = mysql_result($result,$i,"date_created");

		if($row_result != "")
		{

			$html_output .= '<option>';
			$html_output .= $row_result;
			$html_output .= '</option>';
			
			
		}
		
		//check if the task has been started
		$sql_query = "SELECT `hours`,`start_time` FROM `life_management`.`task_log` WHERE `task_id` = '".$task_id."' ORDER BY `start_time` DESC LIMIT 0,1";
		
		$inner_result = mysql_query($sql_query);
		$inner_num = mysql_numrows($inner_result);
		
		$status_string = "Stopped";
		
		if($inner_num > 0)
		{
			$hours = mysql_result($inner_result,0,"hours");
			$start_time = mysql_result($inner_result,0,"start_time");
			
			if($hours == 0)
			{
				$status_string = "Started";
			}
			else
			{
				$status_string = "Stopped";
			}
		}
		else
		{
			$status_string = "Stopped";
		}
		
		$javascript_info_array .= 'task_info['.$i.'] = Array();
		';
		$javascript_info_array .= 'task_info['.$i.'][0] = "'.$status_string.'";
		';
		$javascript_info_array .= 'task_info['.$i.'][1] = "'.$task_date_created.'";
		';
		$javascript_info_array .= 'task_info['.$i.'][2] = "'.$start_time.'";
		';
		
		$i++;
	}
	
	$html_output .= '</select><br />';
	
	$html_output .= '<div id="task_info_div">Info:<br />';
	$html_output .= '</div>';
	
	$html_output .= '<br />';
	$html_output .= '<input type="hidden" name="task_start_stop" id="task_start_stop" value="Start">';
	$html_output .= '<input type="submit" value="Start" id="task_submit" name="task_submit"><br/><br/>';
	$html_output .= '<input type="submit" value="Mark Complete" name="task_complete"><br/>';
	
	$html_output .= '
	</div>
	</form>
	';
	
	//add the javascript for filling the task details (without requiring a page refresh)
	$html_output .= '
		<script type="text/javascript">
		
		//define the task array
		'.$javascript_info_array.'
		
		//define the important elements
		var select_element = document.getElementById("task_name_to_enter");
		var info_div = document.getElementById("task_info_div");
		var submit_button = document.getElementById("task_submit");
		var hidden_field = document.getElementById("task_start_stop");
		
		/* attach a submit handler to the form */
		$("#add_task_entry_form").submit(function(event) {
		
			/* stop form from submitting normally */
	  		event.preventDefault();
	  		
	  		/* get some values from elements on the page: */
	   		var values = $(this).serialize();
	   		
	   		/* Send the data using post and put the results in a div */
			$.ajax({
				url: "lib/ajax.php",
				type: "post",
				data: values,
				success: function(response, textStatus, jqXHR){
				
					var selected_index = select_element.selectedIndex;
				
					if(task_info[selected_index][0] == "Stopped")
					{
				
						task_info[selected_index][0] = "Started";
						
						var date_now = new Date();
						
						task_info[selected_index][2] = 
							date_now.getFullYear() + "-" + 
							(date_now.getMonth() + 1) + "-" + 
							date_now.getDate() + " " +
							date_now.getHours() + ":" +
							date_now.getMinutes() + ":" + 
							date_now.getSeconds();
					
					}
					else
					{
						task_info[selected_index][0] = "Stopped";
					}
					
					//alert(response);

				},
				error:function(){
				
					alert("failure");

				}   
			}); 
		
		});
		
		function OnChange_Callback()
		{
			Update_Info();
		}
		
		select_element.setAttribute("onchange", "OnChange_Callback()");
		OnChange_Callback();
		
		//this is used to update the timer value on running tasks
		window.setInterval(function(){ Update_Info() }, 1000);
		
		function Update_Info() 
		{ 
			var html_string = "";
			var selected_index = select_element.selectedIndex;
			
			html_string += "Info:<br />";
			html_string += "Status: " + task_info[selected_index][0] + "<br />";
			html_string += "Date Created: " + task_info[selected_index][1] + "<br />";
			
			if(task_info[selected_index][0] == "Started")
			{
				submit_button.value = "Stop";
			
				html_string += "Start Time: " + task_info[selected_index][2] + "<br />";
				
				//format the appropriate date strings
				// Split timestamp into [ Y, M, D, h, m, s ]
				var t = (task_info[selected_index][2]).split(/[- :]/);
				// Apply each element to the Date function
				var d = new Date(t[0], t[1]-1, t[2], t[3], t[4], t[5]);
				var currentTime = new Date();
				
				var time_diff_seconds = (currentTime - d)/1000;
				var days = Math.floor(time_diff_seconds / 60 / 60 / 24);
				var hours = Math.floor(time_diff_seconds / 60 / 60) % 24;
				var minutes = Math.floor(time_diff_seconds / 60) % 60;
				var seconds = Math.floor(time_diff_seconds % 60);
				
				html_string += "Running Time: " + days + ":" + hours + ":" + minutes + ":" + seconds;
			
				
			}
			else
			{
				submit_button.value = "Start";
			}
			
			//used for postback
			hidden_field.value = submit_button.value;
			
			//set the inner html for the info div
			info_div.innerHTML = html_string;
		}
		
		</script>';

	return $html_output;
}

function Render_View_Tasks_Form()
{
	$html_output = '';
	
	$html_output .= 'Under construction...';	
	
	
	return $html_output;
}

function Render_New_Task_Form()
{
	$html_output = '';
	
	$html_output .= '
	<form method="post" style="text-align:center;" id="new_task_form">
	<div style= text-align:left;">
	';
	
	$html_output .= 'Name:<br />';
	$html_output .= '<input type="text" name="task_name"><br />';
	$html_output .= 'Description:<br />';
	$html_output .= '<input type="text" name="task_description"><br />';
	$html_output .= 'Estimated Time:<br />';
	$html_output .= '<input type="text" name="task_estimated_time"><br />';
	$html_output .= 'Note:<br />';
	$html_output .= '<input type="text" name="task_note"><br />';
	$html_output .= '<br />';
	$html_output .= '<input type="submit" value="Submit"><br />';
	
	$html_output .= '
	</div>
	</form>';
	
	$html_output .= '
	<script type="text/javascript">
	
	/* attach a submit handler to the form */
	$("#new_task_form").submit(function(event) {
	
		/* stop form from submitting normally */
  		event.preventDefault();

  		
  		/* get some values from elements on the page: */
   		var values = $(this).serialize();
   		
   		/* Send the data using post and put the results in a div */

		$.ajax({
			url: "lib/ajax.php",
			type: "post",
			data: values,
			success: function(response, textStatus, jqXHR){

				alert("success");

			},
			error:function(){
			
				alert("failure");

			}   
		}); 
	
	});
	
	</script>
	';
	
	return $html_output;
	
}

function Render_Edit_Task_Form()
{
	$html_output = '';
	
	$html_output .= 'Under construction...';	
	
	
	return $html_output;
}

?>

