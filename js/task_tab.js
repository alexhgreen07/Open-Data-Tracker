function Task_Tab (task_div_id) {

	//class variables
	this.div_id = task_div_id;
	
	this.On_Click_Event()
	{
		alert('Task submitted!');
	}
	
	this.Render_New_Task_Entry_Form = function() {
	
		html_output = '';
		
		html_output += '<form method="post" style="text-align:center;" id="add_task_entry_form">';
		
		html_output += 'Tasks:<br />';
		html_output += '<select name="task_name_to_enter" id="task_name_to_enter"></select><br />';
		html_output += '<div id="task_info_div">Info:<br /></div>';
		html_output += '<button type="button" id="task_submit" name="task_submit">Start</button><br/><br/>';
		html_output += '<button type="button" id="task_complete" name="task_complete">Mark Complete</button><br/><br/>';
		
		html_output += '</form>';
		
		return html_output;
	
	};
	
	this.Render_New_Task_Form = function () {
		
		html_output = '';
		
		html_output += '<form method="post" style="text-align:center;" id="new_task_form">';
		
		html_output += 'Name:<br />';
		html_output += '<input type="text" name="task_name"><br />';
		html_output += 'Description:<br />';
		html_output += '<input type="text" name="task_description"><br />';
		html_output += 'Estimated Time:<br />';
		html_output += '<input type="text" name="task_estimated_time"><br />';
		html_output += 'Note:<br />';
		html_output += '<input type="text" name="task_note"><br />';
		html_output += '<br />';
		html_output += '<button type="button">Submit</button><br />';
		
		html_output += '</form>';
		
		return html_output;
		
	};
	
	//render function (div must already exist)
	this.Render = function() {
		
		var tabs_array = new Array();
		
		tabs_array[0] = new Array();
		tabs_array[0][0] = "New Task Entry";
		tabs_array[0][1] = this.Render_New_Task_Entry_Form();
		
		tabs_array[1] = new Array();
		tabs_array[1][0] = "View Tasks";
		tabs_array[1][1] = "Under construction...";
		
		tabs_array[2] = new Array();
		tabs_array[2][0] = "New Task";
		tabs_array[2][1] = this.Render_New_Task_Form();
		
		tabs_array[3] = new Array();
		tabs_array[3][0] = "Edit Task";
		tabs_array[3][1] = "Under construction...";
		
		var return_html = '';
		
		return_html += '<div id="tasks_accordian"></div>';
		
		var div_tab = document.getElementById(this.div_id);

		div_tab.innerHTML = return_html;
		
		var task_accordian = new Accordian('tasks_accordian',tabs_array);
		
		task_accordian.Render();
		
	};
}




