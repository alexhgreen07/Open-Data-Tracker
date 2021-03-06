/** This is the edit task form to editing task data.
 * @constructor Edit_Task_Form
 */
function Edit_Task_Form(){
	
	var self = this;
	
	this.Refresh = function(data){
		
		//ensure the task info array is saved
		self.task_info_json_array = data.tasks;

		Refresh_Select_HTML_From_Table(
			self.task_entry_task_edit_name_select.id,
			data.tasks,
			"task_id",
			"name");
			
		Refresh_Select_HTML_From_Table(
			this.task_edit_category_select.id,
			data['Categories'],
			"Category ID",
			"Category Path");
		
		self.Task_Edit_Select_Change();
		
	};
	
	/** @method Task_Edit_Submit_Click
	 * @desc This is the edit task submit button click event handler.
	 * */
	this.Task_Edit_Submit_Click = function()
	{
		
		var selected_index = document.getElementById(this.task_entry_task_edit_name_select.id).selectedIndex;

		if(selected_index != 0)
		{
			var selected_task = this.task_info_json_array[selected_index - 1];
			
			var params = new Array();
			params[0] = selected_task.task_id;
			params[1] = document.getElementById(this.task_edit_name.id).value;
			params[2] = document.getElementById(this.task_edit_category_select.id).value;
			params[3] = document.getElementById(this.task_edit_description.id).value;
			params[4] = document.getElementById(this.task_edit_note.id).value;
			params[5] = document.getElementById(this.task_edit_status.id).value;
			
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
			document.getElementById(this.task_edit_note.id).value = selected_task.note;
			document.getElementById(this.task_edit_category_select.id).value = selected_task.category_id;
			
		}
		else
		{
			document.getElementById(this.task_edit_name.id).value = '';
			document.getElementById(this.task_edit_description.id).value = '';
			document.getElementById(this.task_edit_note.id).value = '';
			document.getElementById(this.task_edit_category_select.id).selectedIndex = 0;
		}
			
	};
	
	
	/** @method Render
	 * @desc This function renders the edit task form in the specified div.
	 * @param {String} form_div_id The div ID to render the form in. 
	 * */
	this.Render = function(form_div_id) {

		

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

		this.data_form_edit_task.innerHTML += '<br />';
		
		this.data_form_edit_task.innerHTML += 'Note:<br />';

		//task note creation
		this.task_edit_note = document.createElement("input");
		this.task_edit_note.setAttribute('name', 'task_edit_note');
		this.task_edit_note.setAttribute('id', 'task_edit_note');
		this.task_edit_note.setAttribute('type', 'text');
		this.data_form_edit_task.appendChild(this.task_edit_note);
		
		this.data_form_edit_task.innerHTML += '<br />';
		
		this.data_form_edit_task.innerHTML += 'Status:<br />';

		//task note creation
		this.task_edit_status = document.createElement("select");
		this.task_edit_status.setAttribute('id', 'task_edit_status');
		this.task_edit_status.innerHTML = '<option>Active</option><option>Archived</option>';
		this.data_form_edit_task.appendChild(this.task_edit_status);

		this.data_form_edit_task.innerHTML += '<br /><br />';

		//task submit creation
		this.task_edit_submit_button = document.createElement("input");
		this.task_edit_submit_button.setAttribute('name', 'task_edit_submit_button');
		this.task_edit_submit_button.setAttribute('id', 'task_edit_submit_button');
		this.task_edit_submit_button.setAttribute('type', 'submit');
		this.task_edit_submit_button.value = 'Submit';
		this.data_form_edit_task.appendChild(this.task_edit_submit_button);
		
		
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