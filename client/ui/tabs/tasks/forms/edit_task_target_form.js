/** This is the edit task target form to entering task target data.
 * @constructor Edit_Task_Target_Form
 */
function Edit_Task_Target_Form(){
	
	this.Refresh = function(data){
		
		this.Refresh_Task_Targets_Select(data);
		this.Refresh_Tasks_Select(data);
		
	};
	
	this.Refresh_Task_Targets_Select = function(data){
		
		var self = this;
		
		//ensure the task info array is saved
		self.task_targets_log = data.task_targets;

		Refresh_Select_HTML_From_Table(
			self.task_edit_target_select.id,
			data.task_targets,
			"task_schedule_id",
			"name");

	};
	
	this.Refresh_Tasks_Select = function(data){
		
		var self = this;
		
		//ensure the task info array is saved
		self.task_info_json_array = data.tasks;

		Refresh_Select_HTML_From_Table(
			self.task_target_edit_name_select.id,
			data.tasks,
			"name",
			"name");
		
	};
	
	/** @method Task_Target_Edit_Submit_Click
	 * @desc This is the edit task target submit button click event handler.
	 * */
	this.Task_Target_Edit_Submit_Click = function()
	{
		var self = this;
		
		var index_to_edit = document.getElementById(this.task_edit_target_select.id).selectedIndex;
		var selected_index = document.getElementById(this.task_target_edit_name_select.id).selectedIndex;
		var selected_task = this.task_info_json_array[selected_index - 1];
		var new_task_id = selected_task.task_id;
		var new_scheduled_time = document.getElementById(this.task_edit_scheduled_target_date.id).value;
		var new_recurring = 0;
		if(document.getElementById(this.task_edit_recurring_target_select.id).value == "True")
		{
			new_recurring = 1;
		}
		else{
			new_recurring = 0;
		}
		var new_recurrance_type = document.getElementById(this.task_edit_recurring_target_select_type.id).value;
		var new_recurrance_period = document.getElementById(this.task_edit_reccurance_target_period.id).value;
		
		
		if(index_to_edit != 0)
		{
			
			var params = new Array();
			params.push(self.task_targets_log[index_to_edit - 1].task_schedule_id);
			params.push(new_task_id);
			params.push(Cast_Local_Server_Datetime_To_UTC_Server_Datetime(new_scheduled_time));
			params.push(new_recurring);
			params.push(new_recurrance_type);
			params.push(new_recurrance_period);
			
			app.api.Task_Data_Interface.Update_Task_Target(params, function(jsonRpcObj) {
			
				if(jsonRpcObj.result.success == 'true'){
					
					alert('Index updated successfully.');
					
					app.api.Refresh_Data(function() {
						//self.refresh_item_log_callback();
					});
					
				}
				else
				{
					alert('Failed to edit the task target.');
					alert(jsonRpcObj.result.debug);
				}
			
			});
		
		}
		else
		{
			alert('Select a valid task target.');
			
		}
	};
	
	
	/** @method Task_Target_Edit_Delete_Click
	 * @desc This is the delete task target submit button click event handler.
	 * */
	this.Task_Target_Edit_Delete_Click = function()
	{
		var self = this;
		
		var index_to_delete = document.getElementById(this.task_edit_target_select.id).value;

		if(index_to_delete != 0)
		{
			
			var r=confirm("Are you sure you want to delete this task target?");
			
			if (r==true)
			{
				
				var params = new Array();
				params[0] = index_to_delete;
				
				app.api.Task_Data_Interface.Delete_Task_Target(params, function(jsonRpcObj) {
				
					if(jsonRpcObj.result.success == 'true'){
						
						alert('Index deleted: ' + index_to_delete);
						
						app.api.Refresh_Data(function() {
							//self.refresh_item_log_callback();
						});
						
					}
					else
					{
						alert('Failed to delete the task target.');
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
			alert('Select a valid task target.');
		}
			
	};
	
	
	
	/** @method Task_Target_Edit_Select_Change
	 * @desc This is the task target edit HTML select index change event handler.
	 * */
	this.Task_Target_Edit_Select_Change = function()
	{
		//fill all target info in
		
		var self = this;
		
		var index_to_fill = document.getElementById(this.task_edit_target_select.id).selectedIndex;

		if(index_to_fill != 0)
		{
			document.getElementById(this.task_target_edit_name_select.id).value = self.task_targets_log[index_to_fill - 1].name;
			
			document.getElementById(this.task_edit_scheduled_target_date.id).value = self.task_targets_log[index_to_fill - 1].scheduled_time;
			if(self.task_targets_log[index_to_fill - 1].recurring == 1)
			{
				document.getElementById(this.task_edit_recurring_target_select.id).value = "True";
			}
			else{
				document.getElementById(this.task_edit_recurring_target_select.id).value = "False";
			}
			
			document.getElementById(this.task_edit_recurring_target_select_type.id).value = self.task_targets_log[index_to_fill - 1].recurrance_type;
			document.getElementById(this.task_edit_reccurance_target_period.id).value = self.task_targets_log[index_to_fill - 1].recurrance_period;
		
		}
		else
		{
			document.getElementById(this.task_target_edit_name_select.id).value = "-";
			document.getElementById(this.task_edit_recurring_target_select.id).value = "False";
			document.getElementById(this.task_edit_recurring_target_select_type.id).value = "Minutes";
			document.getElementById(this.task_edit_reccurance_target_period.id).value = "0";
		}
		
	};
	
	/** @method Render
	 * @desc This function renders the edit task targets form in the specified div.
	 * @param {String} form_div_id The div ID to render the form in. 
	 * */
	this.Render = function(form_div_id)
	{
		var self = this;

		//create the top form
		this.edit_task_target_form = document.createElement("form");
		this.edit_task_target_form.setAttribute('method', "post");
		this.edit_task_target_form.setAttribute('id', "edit_task_target_form");

		this.edit_task_target_form.innerHTML += 'Target:<br />';
		
		//task recurring
		this.task_edit_target_select = document.createElement("select");
		this.task_edit_target_select.setAttribute('id', 'task_edit_target_select');
		this.task_edit_target_select.innerHTML = '<option>-</option>';
		this.edit_task_target_form.appendChild(this.task_edit_target_select);
		
		this.edit_task_target_form.innerHTML += '<br /><br />';

		this.edit_task_target_form.innerHTML += 'Task:<br />';

		//task recurring
		this.task_target_edit_name_select = document.createElement("select");
		this.task_target_edit_name_select.setAttribute('id', 'task_target_edit_name_select');
		this.task_target_edit_name_select.innerHTML = '<option>-</option>';
		this.edit_task_target_form.appendChild(this.task_target_edit_name_select);

		this.edit_task_target_form.innerHTML += '<br /><br />';	
		
		this.edit_task_target_form.innerHTML += 'Scheduled Date:<br />';

		//task estimate creation
		this.task_edit_scheduled_target_date = document.createElement("input");
		this.task_edit_scheduled_target_date.setAttribute('id', 'task_edit_scheduled_target_date');
		this.task_edit_scheduled_target_date.setAttribute('type', 'text');
		this.edit_task_target_form.appendChild(this.task_edit_scheduled_target_date);
		
		this.edit_task_target_form.innerHTML += 'Scheduled Date Variance (Hours):<br />';

		//task estimate creation
		this.task_target_edit_scheduled_variance = document.createElement("input");
		this.task_target_edit_scheduled_variance.setAttribute('id', 'task_target_edit_scheduled_variance');
		this.task_target_edit_scheduled_variance.setAttribute('type', 'text');
		this.task_target_edit_scheduled_variance.setAttribute('value', '0');
		this.edit_task_target_form.appendChild(this.task_target_edit_scheduled_variance);

		this.edit_task_target_form.innerHTML += '<br />';
		
		this.edit_task_target_form.innerHTML += 'Estimated Time (Hours):<br />';

		//task estimate creation
		this.task_target_edit_estimated_time = document.createElement("input");
		this.task_target_edit_estimated_time.setAttribute('id', 'task_target_edit_estimated_time');
		this.task_target_edit_estimated_time.setAttribute('type', 'text');
		this.task_target_edit_estimated_time.setAttribute('value', '0');
		this.edit_task_target_form.appendChild(this.task_target_edit_estimated_time);
		
		this.edit_task_target_form.innerHTML += '<br /><br />';

		this.edit_task_target_form.innerHTML += 'Recurring:<br />';

		//task recurring
		this.task_edit_recurring_target_select = document.createElement("select");
		this.task_edit_recurring_target_select.setAttribute('id', 'task_edit_recurring_target_select');
		this.task_edit_recurring_target_select.innerHTML = '<option>False</option><option>True</option>';
		this.edit_task_target_form.appendChild(this.task_edit_recurring_target_select);

		this.edit_task_target_form.innerHTML += '<br />';
		
		this.edit_task_target_form.innerHTML += 'Recurrance Type:<br />';

		//task recurring
		this.task_edit_recurring_target_select_type = document.createElement("select");
		this.task_edit_recurring_target_select_type.setAttribute('id', 'task_edit_recurring_target_select_type');
		this.task_edit_recurring_target_select_type.innerHTML = "<option>Minutes</option><option>Hours</option><option>Days</option><option>Weeks</option><option>Weekly</option><option>Months</option><option>Years</option>";
		this.edit_task_target_form.appendChild(this.task_edit_recurring_target_select_type);

		this.edit_task_target_form.innerHTML += '<br />';

		this.edit_task_target_form.innerHTML += 'Recurrance Period:<br />';

		//task estimate creation
		this.task_edit_reccurance_target_period = document.createElement("input");
		this.task_edit_reccurance_target_period.setAttribute('id', 'task_edit_reccurance_target_period');
		this.task_edit_reccurance_target_period.setAttribute('type', 'text');
		this.task_edit_reccurance_target_period.setAttribute('value', '0');
		this.edit_task_target_form.appendChild(this.task_edit_reccurance_target_period);

		this.edit_task_target_form.innerHTML += '<br /><br />';

		//task submit creation
		this.task_target_edit_submit_button = document.createElement("input");
		this.task_target_edit_submit_button.setAttribute('id', 'task_target_edit_button');
		this.task_target_edit_submit_button.setAttribute('name', 'task_target_edit_button');
		this.task_target_edit_submit_button.setAttribute('type', 'submit');
		this.task_target_edit_submit_button.value = 'Submit';
		this.edit_task_target_form.appendChild(this.task_target_edit_submit_button);
		
		this.edit_task_target_form.innerHTML += '<br /><br />';
		
		//task delete creation
		this.task_target_edit_delete_button = document.createElement("input");
		this.task_target_edit_delete_button.setAttribute('id', 'task_target_edit_delete_button');
		this.task_target_edit_delete_button.setAttribute('name', 'task_target_edit_delete_button');
		this.task_target_edit_delete_button.setAttribute('type', 'submit');
		this.task_target_edit_delete_button.value = 'Delete';
		this.edit_task_target_form.appendChild(this.task_target_edit_delete_button);
		
		this.edit_task_target_form.innerHTML += '<br />';
		
		this.loading_image_task_target_edit = document.createElement("img");
		this.loading_image_task_target_edit.setAttribute('id', 'loading_image_task_target_edit');
		this.loading_image_task_target_edit.setAttribute('style', 'width:100%;height:19px;');
		this.loading_image_task_target_edit.setAttribute('src', 'ajax-loader.gif');
		this.edit_task_target_form.appendChild(this.loading_image_task_target_edit);
		
		var div_tab = document.getElementById(form_div_id);

		div_tab.innerHTML = '';
		
		div_tab.appendChild(this.edit_task_target_form);
		
		$('#' + this.loading_image_task_target_edit.id).hide();
		
		$('#' + this.task_target_edit_submit_button.id).button();
		$('#' + this.task_target_edit_submit_button.id).click(function(event){
			
		     //ensure a normal postback does not occur
			event.preventDefault();
			
			self.Task_Target_Edit_Submit_Click();
		});
		

		$('#' + this.task_target_edit_delete_button.id).button();
		$('#' + this.task_target_edit_delete_button.id).click(function(event){
			
		     //ensure a normal postback does not occur
			event.preventDefault();
			
			self.Task_Target_Edit_Delete_Click();
		});
		
		$('#' + this.task_edit_scheduled_target_date.id).datetimepicker({
			timeFormat : "HH:mm:ss",
			dateFormat : 'yy-mm-dd'
		});
		$('#' + this.task_edit_scheduled_target_date.id).datetimepicker("setDate", new Date());
		
		$('#' + this.task_edit_target_select.id).change(function(){
			
			self.Task_Target_Edit_Select_Change();
			
		});

	};
	
	
}