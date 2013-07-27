<?php
/*
 * NOTE: This is PHP code intended to perform server side includes
 * and resolve any javascript file dependencies. If PHP is
 * not installed on the server, this code can be replaced
 * with client side HTML includes (or dynamic javascript includes.)
*/

Header("content-type: application/x-javascript");

//jquery code
include_once(dirname(__FILE__).'/../../../../externals/jquery-ui-1.10.0.custom/js/jquery-1.9.0.js');

//jquery UI code
include_once(dirname(__FILE__).'/../../../../../externals/jquery-ui-1.10.0.custom/js/jquery-ui-1.10.0.custom.js');

//jquery datepicker code (addon)
include_once(dirname(__FILE__).'/../../../../../externals/jquery-ui-timepicker-addon/jquery-ui-timepicker-addon.js');

//JSON RPC library
include_once(dirname(__FILE__).'/../../../../../externals/json-rpc2php/jsonRPC2php.client.js');

?>

/** This is the edit task form to editing task data.
 * @constructor Edit_Task_Form
 */
function Edit_Task_Form(){
	
	this.Refresh = function(data){
		
		var self = this;
		
		//ensure the task info array is saved
		self.task_info_json_array = data.tasks;

		//create a list of options for the select
		var new_inner_html = '';

		new_inner_html += '<option>-</option>';

		//iterate through all tasks
		for (var i = 0; i < self.task_info_json_array.length; i++) {
			//add task option to select
			new_inner_html += '<option>' + self.task_info_json_array[i].name + '</option>';

			//format task start datetime
			if (self.task_info_json_array[i].start_time != '') {
				//change start date string to javascript date object
				//var t = self.task_info_json_array[i].start_time.split(/[- :]/);
				//self.task_info_json_array[i].start_time = new Date(t[0], t[1] - 1, t[2], t[3], t[4], t[5]);
			}
		}

		document.getElementById(self.task_entry_task_edit_name_select.id).innerHTML = new_inner_html;
		
	};
	
	/** @method Task_Edit_Submit_Click
	 * @desc This is the edit task submit button click event handler.
	 * */
	this.Task_Edit_Submit_Click = function()
	{
		var self = this;
		
		var selected_index = document.getElementById(this.task_entry_task_edit_name_select.id).selectedIndex;

		if(selected_index != 0)
		{
			var selected_task = this.task_info_json_array[selected_index - 1];
			
			var params = new Array();
			params[0] = selected_task.task_id;
			params[1] = document.getElementById(this.task_edit_name.id).value;
			params[2] = document.getElementById(this.task_edit_category_select.id).value;
			params[3] = document.getElementById(this.task_edit_description.id).value;
			params[4] = document.getElementById(this.task_edit_estimate.id).value;
			params[5] = document.getElementById(this.task_edit_note.id).value;
			
			app.api.Task_Data_Interface.Update_Task(params, function(jsonRpcObj) {
			
				if(jsonRpcObj.result.success == 'true'){
					
					alert('Task updated successfully.');
					
					app.api.Refresh_Data(function() {
						//self.refresh_item_log_callback();
					});
					
				}
				else
				{
					alert('Failed to update the task.');
					alert(jsonRpcObj.result.debug);
				}
			
			});
		
		
			
		
		}
		else
		{
			alert('Select a valid task.');
		}
			
	};
	
	/** @method Task_Edit_Delete_Click
	 * @desc This is the delete task submit button click event handler.
	 * */
	this.Task_Edit_Delete_Click = function()
	{
		var self = this;
		
		var selected_index = document.getElementById(this.task_entry_task_edit_name_select.id).selectedIndex;

		if(selected_index != 0)
		{
			
			var r=confirm("Are you sure you want to delete this task?");
			
			if (r==true)
			{
				
				var selected_task = this.task_info_json_array[selected_index - 1];
				
				var params = new Array();
				params[0] = selected_task.task_id;
				
				app.api.Task_Data_Interface.Delete_Task(params, function(jsonRpcObj) {
				
					if(jsonRpcObj.result.success == 'true'){
						
						alert('Index deleted: ' + selected_task.task_id);
						
						app.api.Refresh_Data(function() {
							//self.refresh_item_log_callback();
						});
						
					}
					else
					{
						alert('Failed to delete the task.');
					}
				
				});
			}
			else
			{
				//do nothing, operation cancelled.
			}
			
			
		
		}
		else
		{
			alert('Select a valid task.');
		}
			
	};
	
	
	/** @method Task_Edit_Select_Change
	 * @desc This is the edit task HTML select change event handler.
	 * */
	this.Task_Edit_Select_Change = function()
	{
		var selected_index = document.getElementById(this.task_entry_task_edit_name_select.id).selectedIndex;

		if(selected_index != 0)
		{
			var selected_task = this.task_info_json_array[selected_index - 1];
			
			document.getElementById(this.task_edit_name.id).value = selected_task.name;
			document.getElementById(this.task_edit_description.id).value = selected_task.description;
			document.getElementById(this.task_edit_estimate.id).value = selected_task.estimated_time;
			document.getElementById(this.task_edit_note.id).value = selected_task.note;
			document.getElementById(self.task_edit_category_select.id).value = selected_task.category_id;
			
		}
		else
		{
			document.getElementById(this.task_edit_name.id).value = '';
			document.getElementById(this.task_edit_description.id).value = '';
			document.getElementById(this.task_edit_estimate.id).value = '0';
			document.getElementById(this.task_edit_note.id).value = '';
			document.getElementById(self.task_edit_category_select.id).selectedIndex = 0;
		}
			
	};
	
	
	/** @method Render
	 * @desc This function renders the edit task form in the specified div.
	 * @param {String} form_div_id The div ID to render the form in. 
	 * */
	this.Render = function(form_div_id) {

		var self = this;

		//create the top form
		this.data_form_edit_task = document.createElement("form");
		this.data_form_edit_task.setAttribute('method', "post");
		this.data_form_edit_task.setAttribute('id', "edit_task_entry_form");

		this.data_form_edit_task.innerHTML += 'Tasks:<br />';

		//task name select dropdown
		this.task_entry_task_edit_name_select = document.createElement("select");
		this.task_entry_task_edit_name_select.setAttribute('name', "edit_task_name_to_enter");
		this.task_entry_task_edit_name_select.setAttribute('id', "edit_task_name_to_enter");
		this.task_entry_task_edit_name_select.innerHTML = '<option>-</option>';
		this.data_form_edit_task.appendChild(this.task_entry_task_edit_name_select);

		this.data_form_edit_task.innerHTML += '<br /><br />';

		this.data_form_edit_task.innerHTML += 'Name:<br />';

		//task name creation
		this.task_edit_name = document.createElement("input");
		this.task_edit_name.setAttribute('name', 'task_edit_name');
		this.task_edit_name.setAttribute('id', 'task_edit_name');
		this.task_edit_name.setAttribute('type', 'text');
		this.data_form_edit_task.appendChild(this.task_edit_name);
		
		this.data_form_edit_task.innerHTML += '<br />';
		
		this.data_form_edit_task.innerHTML += 'Category:<br />';

		//task recurring
		this.task_edit_category_select = document.createElement("select");
		this.task_edit_category_select.setAttribute('id', 'task_edit_category_select');
		this.task_edit_category_select.innerHTML = '<option value="0">-</option>';
		this.data_form_edit_task.appendChild(this.task_edit_category_select);

		this.data_form_edit_task.innerHTML += '<br />';
		
		this.data_form_edit_task.innerHTML += 'Description:<br />';

		//task description creation
		this.task_edit_description = document.createElement("input");
		this.task_edit_description.setAttribute('name', 'task_edit_description');
		this.task_edit_description.setAttribute('id', 'task_edit_description');
		this.task_edit_description.setAttribute('type', 'text');
		this.data_form_edit_task.appendChild(this.task_edit_description);

		this.data_form_edit_task.innerHTML += '<br />';
		
		this.data_form_edit_task.innerHTML += 'Estimated Time (Hours):<br />';

		//task estimate creation
		this.task_edit_estimate = document.createElement("input");
		this.task_edit_estimate.setAttribute('name', 'task_edit_estimated_time');
		this.task_edit_estimate.setAttribute('id', 'task_edit_estimated_time');
		this.task_edit_estimate.setAttribute('type', 'text');
		this.task_edit_estimate.setAttribute('value', '0');
		this.data_form_edit_task.appendChild(this.task_edit_estimate);

		this.data_form_edit_task.innerHTML += '<br />';
		
		this.data_form_edit_task.innerHTML += 'Note:<br />';

		//task note creation
		this.task_edit_note = document.createElement("input");
		this.task_edit_note.setAttribute('name', 'task_edit_note');
		this.task_edit_note.setAttribute('id', 'task_edit_note');
		this.task_edit_note.setAttribute('type', 'text');
		this.data_form_edit_task.appendChild(this.task_edit_note);

		this.data_form_edit_task.innerHTML += '<br /><br />';

		//task submit creation
		this.task_edit_submit_button = document.createElement("input");
		this.task_edit_submit_button.setAttribute('name', 'task_edit_submit_button');
		this.task_edit_submit_button.setAttribute('id', 'task_edit_submit_button');
		this.task_edit_submit_button.setAttribute('type', 'submit');
		this.task_edit_submit_button.value = 'Submit';
		this.data_form_edit_task.appendChild(this.task_edit_submit_button);
		var self = this;
		
		this.data_form_edit_task.innerHTML += '<br /><br />';
		
		//task delete creation
		this.task_edit_delete_button = document.createElement("input");
		this.task_edit_delete_button.setAttribute('name', 'task_edit_delete');
		this.task_edit_delete_button.setAttribute('id', 'task_edit_delete_button');
		this.task_edit_delete_button.setAttribute('type', 'submit');
		this.task_edit_delete_button.value = 'Delete';
		this.data_form_edit_task.appendChild(this.task_edit_delete_button);

		var div_tab = document.getElementById(form_div_id);

		div_tab.appendChild(this.data_form_edit_task);

		$('#' + this.task_edit_submit_button.id).button();
		$('#' + this.task_edit_submit_button.id).click(function(event) {

			//ensure a normal postback does not occur
			event.preventDefault();
			
			
			//execute the click event
			self.Task_Edit_Submit_Click();
		});
		
		$('#' + this.task_edit_delete_button.id).button();
		$('#' + this.task_edit_delete_button.id).click(function(event) {

			//ensure a normal postback does not occur
			event.preventDefault();
			
			
			//execute the click event
			self.Task_Edit_Delete_Click();
		});
		
		$('#' + this.task_entry_task_edit_name_select.id).change(function(){
			
			self.Task_Edit_Select_Change();
		});
		
	};

	
}