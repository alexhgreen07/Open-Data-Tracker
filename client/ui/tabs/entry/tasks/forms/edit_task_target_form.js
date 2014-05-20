define([
        'jquery.ui',
        ],function($){
	
	/** This is the edit task target form to entering task target data.
	 * @constructor Edit_Task_Target_Form
	 */
	function Edit_Task_Target_Form(){
		
		var self = this;
		
		this.Refresh = function(data){
			
			//ensure the task info array is saved
			self.task_targets_log = data.task_targets;

			Refresh_Select_HTML_From_Table(
				self.task_edit_target_select.id,
				data.task_targets,
				"task_schedule_id",
				"name");
			
			//ensure the task info array is saved
			self.task_info_json_array = data.tasks;

			Refresh_Select_HTML_From_Table(
				self.task_target_edit_name_select.id,
				data.tasks,
				"name",
				"name");
			
			this.Task_Target_Edit_Select_Change();
		};
		
		this.Refresh_From_Diff = function(diff, data)
		{
			
			//ensure the task info array is saved
			self.task_targets_log = data.task_targets;

			Refresh_Select_HTML_From_Table_Diff(
				self.task_edit_target_select.id,
				diff.data.task_targets,
				"task_schedule_id",
				"name");
			
			//ensure the task info array is saved
			self.task_info_json_array = data.tasks;

			Refresh_Select_HTML_From_Table_Diff(
				self.task_target_edit_name_select.id,
				diff.data.tasks,
				"name",
				"name");
			
			this.Task_Target_Edit_Select_Change();
			
		};
		
		/** @method Task_Target_Edit_Submit_Click
		 * @desc This is the edit task target submit button click event handler.
		 * */
		this.Task_Target_Edit_Submit_Click = function()
		{
			
			var index_to_edit = this.task_edit_target_select.selectedIndex;
			var selected_index = this.task_target_edit_name_select.selectedIndex;
			var selected_task = this.task_info_json_array[selected_index - 1];
			var new_task_id = selected_task.task_id;
			var new_scheduled_time = $(this.task_edit_scheduled_target_date).datetimepicker('getDate');
			var new_recurring = 0;
			if(this.task_edit_recurring_target_select.value == "True")
			{
				new_recurring = 1;
			}
			else{
				new_recurring = 0;
			}
			var new_recurrance_type = this.task_edit_recurring_target_select_type.value;
			var new_recurrance_period = this.task_edit_reccurance_target_period.value;
			var variance = this.task_target_edit_scheduled_variance.value;
			var estimated_time = this.task_target_edit_estimated_time.value;
			var recurring_end_time = $(this.task_target_edit_recurring_end_date).datetimepicker('getDate');
			var status = this.task_edit_target_status.value;
			
			if(index_to_edit != 0)
			{
				
				var params = {};
				params["task_schedule_id"] = self.task_targets_log[index_to_edit - 1].task_schedule_id;
				params["task_id"] = new_task_id;
				params["scheduled_time"] = new_scheduled_time.toISOString();
				params["recurring"] = new_recurring;
				params["recurrance_type"] = new_recurrance_type;
				params["recurrance_period"] = new_recurrance_period;
				params["allowed_variance"] = variance;
				params["estimated_time"] = estimated_time;
				params["recurrance_end_time"] = recurring_end_time.toISOString();
				params["status"] = status;
				
				app.api.Task_Data_Interface.Update_Task_Target(params, function(jsonRpcObj) {
				
					if(jsonRpcObj.result.success){
						
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
		
		this.Break_Recuring_Child = function()
		{
			var self = this;
			
			var r=confirm("Press OK to delete all future recurrances, or cancel to keep future recurrances.");
			
			var index_to_break = this.task_edit_target_select.value;
			
			var params = new Array();
			params[0] = index_to_break;
			
			if (r==true)
			{
				params[1] = 0;
			}
			else
			{
				params[1] = 1;
			}
			
			
			app.api.Task_Data_Interface.Break_Recuring_Child(params, function(jsonRpcObj) {
			
				if(jsonRpcObj.result.success == 'true'){
					
					alert('Index recurrance broken: ' + index_to_break);
					
					app.api.Refresh_Data(function() {
						//self.refresh_item_log_callback();
					});
					
				}
				else
				{
					alert('Failed to break the task target.');
					alert(jsonRpcObj.result.debug);
				}
			
			});
			
		};
		
		
		/** @method Task_Target_Edit_Delete_Click
		 * @desc This is the delete task target submit button click event handler.
		 * */
		this.Task_Target_Edit_Delete_Click = function()
		{
			var self = this;
			
			var index_to_delete = this.task_edit_target_select.value;

			if(index_to_delete != 0)
			{
				
				var r=confirm("Are you sure you want to delete this task target?");
				
				if (r==true)
				{
					
					var params = {};
					params["task_schedule_id"] = index_to_delete;
					
					app.api.Task_Data_Interface.Delete_Task_Target(params, function(jsonRpcObj) {
					
						if(jsonRpcObj.result.success){
							
							alert('Index deleted: ' + index_to_delete);
							
							this.task_edit_target_select.value = 0;
							
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
			
			var index_to_fill = this.task_edit_target_select.selectedIndex;

			if(index_to_fill != 0)
			{
				var selected_target = self.task_targets_log[index_to_fill - 1];
				
				this.task_target_edit_name_select.value = selected_target.name;
				
				$(this.task_edit_scheduled_target_date).datetimepicker("setDate", new Date(selected_target.scheduled_time));
				
				if(selected_target.recurring == 1)
				{
					this.task_edit_recurring_target_select.value = "True";
				}
				else{
					this.task_edit_recurring_target_select.value = "False";
				}
				
				this.task_edit_recurring_target_select_type.value = selected_target.recurrance_type;
				this.task_edit_reccurance_target_period.value = selected_target.recurrance_period;
				this.task_target_edit_scheduled_variance.value = selected_target.variance;
				this.task_target_edit_estimated_time.value = selected_target.estimated_time;
				$(this.task_target_edit_recurring_end_date).datetimepicker("setDate", new Date(selected_target.recurrance_end_time));
				this.task_edit_target_status.value = selected_target.status;
				
				if(selected_target.recurrance_child_id == 0)
				{
					this.task_edit_scheduled_target_date.disabled = false;
					this.task_target_edit_name_select.disabled = false;
					this.task_edit_recurring_target_select.disabled = false;
					this.task_edit_recurring_target_select_type.disabled = false;
					this.task_edit_reccurance_target_period.disabled = false;
					this.task_target_edit_scheduled_variance.disabled = false;
					this.task_target_edit_estimated_time.disabled = false;
					this.task_target_edit_recurring_end_date.disabled = false;
					
					$(this.break_button_div).hide();
				}
				else
				{
					this.task_edit_scheduled_target_date.disabled = true;
					this.task_target_edit_name_select.disabled = true;
					this.task_edit_recurring_target_select.disabled = true;
					this.task_edit_recurring_target_select_type.disabled = true;
					this.task_edit_reccurance_target_period.disabled = true;
					this.task_target_edit_scheduled_variance.disabled = true;
					this.task_target_edit_estimated_time.disabled = true;
					this.task_target_edit_recurring_end_date.disabled = true;
					
					$(this.break_button_div).show();
				}
			}
			else
			{
				this.task_target_edit_name_select.value = "-";
				this.task_edit_recurring_target_select.value = "False";
				this.task_edit_recurring_target_select_type.value = "Minutes";
				this.task_edit_reccurance_target_period.value = "0";
			}
			
		};
		
		/** @method Render
		 * @desc This function renders the edit task targets form in the specified div.
		 * @param {String} form_div_id The div ID to render the form in. 
		 * */
		this.Render = function(parent_div)
		{
			var self = this;

			//create the top form
			this.edit_task_target_form = document.createElement("form");
			this.edit_task_target_form.setAttribute('method', "post");
			this.edit_task_target_form.setAttribute('id', "edit_task_target_form");

			this.edit_task_target_form = parent_div.appendChild(this.edit_task_target_form);
			
			this.edit_task_target_form.appendChild(document.createTextNode("Target:"));
			this.edit_task_target_form.appendChild(document.createElement("br"));
			
			//task recurring
			this.task_edit_target_select = document.createElement("select");
			this.task_edit_target_select.setAttribute('id', 'task_edit_target_select');
			this.task_edit_target_select.innerHTML = '<option>-</option>';
			this.task_edit_target_select = this.edit_task_target_form.appendChild(this.task_edit_target_select);
			
			this.edit_task_target_form.appendChild(document.createElement("br"));
			this.edit_task_target_form.appendChild(document.createElement("br"));
			//this.edit_task_target_form.innerHTML += '<br /><br />';

			this.edit_task_target_form.appendChild(document.createTextNode("Task:"));
			this.edit_task_target_form.appendChild(document.createElement("br"));
			//this.edit_task_target_form.innerHTML += 'Task:<br />';

			//task recurring
			this.task_target_edit_name_select = document.createElement("select");
			this.task_target_edit_name_select.setAttribute('id', 'task_target_edit_name_select');
			this.task_target_edit_name_select.innerHTML = '<option>-</option>';
			this.task_target_edit_name_select = this.edit_task_target_form.appendChild(this.task_target_edit_name_select);

			this.edit_task_target_form.appendChild(document.createElement("br"));
			this.edit_task_target_form.appendChild(document.createElement("br"));
			//this.edit_task_target_form.innerHTML += '<br /><br />';	
			
			this.edit_task_target_form.appendChild(document.createTextNode("Scheduled Date:"));
			this.edit_task_target_form.appendChild(document.createElement("br"));
			//this.edit_task_target_form.innerHTML += 'Scheduled Date:<br />';

			//task estimate creation
			this.task_edit_scheduled_target_date = document.createElement("input");
			this.task_edit_scheduled_target_date.setAttribute('id', 'task_edit_scheduled_target_date');
			this.task_edit_scheduled_target_date.setAttribute('type', 'text');
			this.task_edit_scheduled_target_date = this.edit_task_target_form.appendChild(this.task_edit_scheduled_target_date);
			
			this.edit_task_target_form.appendChild(document.createTextNode("Scheduled Date Variance (Hours):"));
			this.edit_task_target_form.appendChild(document.createElement("br"));
			//this.edit_task_target_form.innerHTML += 'Scheduled Date Variance (Hours):<br />';

			//task estimate creation
			this.task_target_edit_scheduled_variance = document.createElement("input");
			this.task_target_edit_scheduled_variance.setAttribute('id', 'task_target_edit_scheduled_variance');
			this.task_target_edit_scheduled_variance.setAttribute('type', 'text');
			this.task_target_edit_scheduled_variance.setAttribute('value', '0');
			this.task_target_edit_scheduled_variance = this.edit_task_target_form.appendChild(this.task_target_edit_scheduled_variance);

			this.edit_task_target_form.appendChild(document.createElement("br"));
			//this.edit_task_target_form.innerHTML += '<br />';
			
			this.edit_task_target_form.appendChild(document.createTextNode("Estimated Time (Hours):"));
			this.edit_task_target_form.appendChild(document.createElement("br"));
			//this.edit_task_target_form.innerHTML += 'Estimated Time (Hours):<br />';

			//task estimate creation
			this.task_target_edit_estimated_time = document.createElement("input");
			this.task_target_edit_estimated_time.setAttribute('id', 'task_target_edit_estimated_time');
			this.task_target_edit_estimated_time.setAttribute('type', 'text');
			this.task_target_edit_estimated_time.setAttribute('value', '0');
			this.task_target_edit_estimated_time = this.edit_task_target_form.appendChild(this.task_target_edit_estimated_time);
			
			this.edit_task_target_form.appendChild(document.createElement("br"));
			//this.edit_task_target_form.innerHTML += '<br />';
			
			this.edit_task_target_form.appendChild(document.createTextNode("Status:"));
			this.edit_task_target_form.appendChild(document.createElement("br"));
			//this.edit_task_target_form.innerHTML += 'Status:<br />';

			//task estimate creation
			this.task_edit_target_status = document.createElement("select");
			this.task_edit_target_status.setAttribute('id', 'task_edit_target_status');
			this.task_edit_target_status.innerHTML = '<option>Incomplete</option><option>Complete</option><option>Missed</option>';
			this.task_edit_target_status = this.edit_task_target_form.appendChild(this.task_edit_target_status);
			
			this.edit_task_target_form.appendChild(document.createElement("br"));
			this.edit_task_target_form.appendChild(document.createElement("br"));
			//this.edit_task_target_form.innerHTML += '<br /><br />';

			this.edit_task_target_form.appendChild(document.createTextNode("Recurring:"));
			this.edit_task_target_form.appendChild(document.createElement("br"));
			//this.edit_task_target_form.innerHTML += 'Recurring:<br />';

			//task recurring
			this.task_edit_recurring_target_select = document.createElement("select");
			this.task_edit_recurring_target_select.setAttribute('id', 'task_edit_recurring_target_select');
			this.task_edit_recurring_target_select.innerHTML = '<option>False</option><option>True</option>';
			this.task_edit_recurring_target_select = this.edit_task_target_form.appendChild(this.task_edit_recurring_target_select);

			this.edit_task_target_form.appendChild(document.createElement("br"));
			//this.edit_task_target_form.innerHTML += '<br />';
			
			this.edit_task_target_form.appendChild(document.createTextNode("Recurrance Type:"));
			this.edit_task_target_form.appendChild(document.createElement("br"));
			//this.edit_task_target_form.innerHTML += 'Recurrance Type:<br />';

			//task recurring
			this.task_edit_recurring_target_select_type = document.createElement("select");
			this.task_edit_recurring_target_select_type.setAttribute('id', 'task_edit_recurring_target_select_type');
			this.task_edit_recurring_target_select_type.innerHTML = "<option>Minutes</option><option>Hours</option><option>Days</option><option>Weeks</option><option>Weekly</option><option>Months</option><option>Years</option>";
			this.task_edit_recurring_target_select_type = this.edit_task_target_form.appendChild(this.task_edit_recurring_target_select_type);

			this.edit_task_target_form.appendChild(document.createElement("br"));
			//this.edit_task_target_form.innerHTML += '<br />';
			
			this.edit_task_target_form.appendChild(document.createTextNode("Recurrance Period:"));
			this.edit_task_target_form.appendChild(document.createElement("br"));
			//this.edit_task_target_form.innerHTML += 'Recurrance Period:<br />';

			//task estimate creation
			this.task_edit_reccurance_target_period = document.createElement("input");
			this.task_edit_reccurance_target_period.setAttribute('id', 'task_edit_reccurance_target_period');
			this.task_edit_reccurance_target_period.setAttribute('type', 'text');
			this.task_edit_reccurance_target_period.setAttribute('value', '0');
			this.task_edit_reccurance_target_period = this.edit_task_target_form.appendChild(this.task_edit_reccurance_target_period);
			
			this.edit_task_target_form.appendChild(document.createElement("br"));
			//this.edit_task_target_form.innerHTML += '<br />';
			
			this.edit_task_target_form.appendChild(document.createTextNode("Recurrance End:"));
			this.edit_task_target_form.appendChild(document.createElement("br"));
			//this.edit_task_target_form.innerHTML += 'Recurrance End:<br />';

			this.task_target_edit_recurring_end_date = document.createElement("input");
			this.task_target_edit_recurring_end_date.setAttribute('id', 'task_target_edit_recurring_end_date');
			this.task_target_edit_recurring_end_date.innerHTML = '<option>False</option><option>True</option>';
			this.task_target_edit_recurring_end_date = this.edit_task_target_form.appendChild(this.task_target_edit_recurring_end_date);
			
			this.edit_task_target_form.appendChild(document.createElement("br"));
			this.edit_task_target_form.appendChild(document.createElement("br"));
			//this.edit_task_target_form.innerHTML += '<br /><br />';

			//task submit creation
			this.task_target_edit_submit_button = document.createElement("input");
			this.task_target_edit_submit_button.setAttribute('id', 'task_target_edit_button');
			this.task_target_edit_submit_button.setAttribute('name', 'task_target_edit_button');
			this.task_target_edit_submit_button.setAttribute('type', 'submit');
			this.task_target_edit_submit_button.value = 'Submit';
			this.task_target_edit_submit_button = this.edit_task_target_form.appendChild(this.task_target_edit_submit_button);
			
			this.edit_task_target_form.appendChild(document.createElement("br"));
			this.edit_task_target_form.appendChild(document.createElement("br"));
			//this.edit_task_target_form.innerHTML += '<br /><br />';
			
			this.break_button_div = document.createElement("div");
			this.break_button_div.id = 'break_button_div';
			
			//task submit creation
			this.task_target_break_submit_button = document.createElement("input");
			this.task_target_break_submit_button.setAttribute('id', 'task_target_break_button');
			this.task_target_break_submit_button.setAttribute('name', 'task_target_break_button');
			this.task_target_break_submit_button.setAttribute('type', 'submit');
			this.task_target_break_submit_button.value = 'Break';
			this.task_target_break_submit_button = this.break_button_div.appendChild(this.task_target_break_submit_button);
			
			this.edit_task_target_form.appendChild(document.createElement("br"));
			this.edit_task_target_form.appendChild(document.createElement("br"));
			//this.edit_task_target_form.innerHTML += '<br /><br />';
			
			this.break_button_div = this.edit_task_target_form.appendChild(this.break_button_div);
			
			//task delete creation
			this.task_target_edit_delete_button = document.createElement("input");
			this.task_target_edit_delete_button.setAttribute('id', 'task_target_edit_delete_button');
			this.task_target_edit_delete_button.setAttribute('name', 'task_target_edit_delete_button');
			this.task_target_edit_delete_button.setAttribute('type', 'submit');
			this.task_target_edit_delete_button.value = 'Delete';
			this.task_target_edit_delete_button = this.edit_task_target_form.appendChild(this.task_target_edit_delete_button);
			
			this.edit_task_target_form.appendChild(document.createElement("br"));
			//this.edit_task_target_form.innerHTML += '<br />';
			
			this.loading_image_task_target_edit = document.createElement("img");
			this.loading_image_task_target_edit.setAttribute('id', 'loading_image_task_target_edit');
			this.loading_image_task_target_edit.setAttribute('style', 'width:100%;height:19px;');
			this.loading_image_task_target_edit.setAttribute('src', 'ajax-loader.gif');
			this.loading_image_task_target_edit = this.edit_task_target_form.appendChild(this.loading_image_task_target_edit);

			
			$(this.loading_image_task_target_edit).hide();
			$(this.break_button_div).hide();
			
			$(this.task_target_edit_submit_button).button();
			$(this.task_target_edit_submit_button).click(function(event){
				
			     //ensure a normal postback does not occur
				event.preventDefault();
				
				self.Task_Target_Edit_Submit_Click();
			});
			
			$(this.task_target_break_submit_button).button();
			$(this.task_target_break_submit_button).click(function(event){
				
			     //ensure a normal postback does not occur
				event.preventDefault();
				
				self.Break_Recuring_Child();
			});

			$(this.task_target_edit_delete_button).button();
			$(this.task_target_edit_delete_button).click(function(event){
				
			     //ensure a normal postback does not occur
				event.preventDefault();
				
				self.Task_Target_Edit_Delete_Click();
			});
			
			$(this.task_edit_scheduled_target_date).datetimepicker({
				timeFormat : "HH:mm:ss",
				dateFormat : 'yy-mm-dd'
			});
			$(this.task_edit_scheduled_target_date).datetimepicker("setDate", new Date());
			
			$(this.task_target_edit_recurring_end_date).datetimepicker({
				timeFormat : "HH:mm:ss",
				dateFormat : 'yy-mm-dd'
			});
			$(this.task_target_edit_recurring_end_date).datetimepicker("setDate", new Date());
			
			$(this.task_edit_target_select).change(function(){
				
				self.Task_Target_Edit_Select_Change();
				
			});

		};
		
		
	}
	
	function Build_Edit_Task_Target_Form()
	{
		var built_edit_task_target_form = new Edit_Task_Target_Form();
		
		return built_edit_task_target_form;
	}
	
	return {
		Build_Edit_Task_Target_Form: Build_Edit_Task_Target_Form,
		Edit_Task_Target_Form: Edit_Task_Target_Form,
	};
});

