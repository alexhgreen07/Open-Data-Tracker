/** This is the new task target form to entering new task target data.
 * @constructor New_Task_Target_Form
 */
function New_Task_Target_Form(){
	
	this.Refresh = function(data){
		
		var self = this;
		
		//ensure the task info array is saved
		self.task_info_json_array = data.tasks;

		Refresh_Select_HTML_From_Table(
			self.task_target_new_name_select.id,
			data.tasks,
			"name",
			"name");
		
	};
	
	/** @method Task_Target_New_Submit_Click
	 * @desc This is the new task target submit button click event handler.
	 * */
	this.Task_Target_New_Submit_Click = function()
	{
		var self = this;
		var params = new Array();

		//retrieve the selected item from the info array
		var selected_index = document.getElementById(this.task_target_new_name_select.id).selectedIndex;

		if (selected_index > 0) {

			var selected_task = this.task_info_json_array[selected_index - 1];
			var scheduled_time = document.getElementById(self.task_scheduled_target_date.id).value;
			var recurring = document.getElementById(self.task_recurring_target_select.id).value;
			var recurrance_type = document.getElementById(self.task_recurring_target_select_type.id).value;
			var recurrance_period = document.getElementById(self.task_reccurance_target_period.id).value;
			var variance = document.getElementById(self.task_scheduled_variance.id).value;
			var estimated_time = document.getElementById(self.task_target_estimated_time.id).value;
			var end_date = document.getElementById(self.task_recurring_end_date.id).value;
			
			//load all function parameters
			params[0] = selected_task.task_id;
			params[1] = Cast_Local_Server_Datetime_To_UTC_Server_Datetime(scheduled_time);
			if(recurring == 'True')
			{
				params[2] = 1;
			}else{
				params[2] = 0;
			}
			params[3] = recurrance_type;
			params[4] = recurrance_period;
			params[5] = variance;
			params[6] = estimated_time;
			params[7] = Cast_Local_Server_Datetime_To_UTC_Server_Datetime(end_date);

			//execute the RPC callback for retrieving the item log
			app.api.Task_Data_Interface.Insert_Task_Target(params, function(jsonRpcObj) {

				if (jsonRpcObj.result.success == 'true') {

					alert('Task target inserted successfully.');
					
					app.api.Refresh_Data(function() {
						//self.refresh_item_log_callback();
					});

				} else {
					alert('Failed to insert task entry.' + jsonRpcObj.result.debug);
				}


			});

		}
	};
	
	
	/** @method Render
	 * @desc This function renders the new task targets form in the specified div.
	 * @param {String} form_div_id The div ID to render the form in. 
	 * */
	this.Render = function(form_div_id)
	{
		
		var self = this;

		//create the top form
		this.new_task_target_form = document.createElement("form");
		this.new_task_target_form.setAttribute('method', "post");
		this.new_task_target_form.setAttribute('id', "new_task_target_form");
		
		this.new_task_target_form.innerHTML += 'Task:<br />';

		//task recurring
		this.task_target_new_name_select = document.createElement("select");
		this.task_target_new_name_select.setAttribute('id', 'task_target_new_name_select');
		this.task_target_new_name_select.innerHTML = '<option>-</option>';
		this.new_task_target_form.appendChild(this.task_target_new_name_select);

		this.new_task_target_form.innerHTML += '<br /><br />';
		
		this.new_task_target_form.innerHTML += 'Scheduled Date:<br />';

		//task estimate creation
		this.task_scheduled_target_date = document.createElement("input");
		this.task_scheduled_target_date.setAttribute('id', 'task_scheduled_target_date');
		this.task_scheduled_target_date.setAttribute('type', 'text');
		this.new_task_target_form.appendChild(this.task_scheduled_target_date);
		
		this.new_task_target_form.innerHTML += 'Scheduled Date Variance (Hours):<br />';

		//task estimate creation
		this.task_scheduled_variance = document.createElement("input");
		this.task_scheduled_variance.setAttribute('id', 'task_scheduled_variance');
		this.task_scheduled_variance.setAttribute('type', 'text');
		this.task_scheduled_variance.setAttribute('value', '0');
		this.new_task_target_form.appendChild(this.task_scheduled_variance);

		this.new_task_target_form.innerHTML += '<br />';
		
		this.new_task_target_form.innerHTML += 'Estimated Time (Hours):<br />';

		//task estimate creation
		this.task_target_estimated_time = document.createElement("input");
		this.task_target_estimated_time.setAttribute('id', 'task_target_estimated_time');
		this.task_target_estimated_time.setAttribute('type', 'text');
		this.task_target_estimated_time.setAttribute('value', '0');
		this.new_task_target_form.appendChild(this.task_target_estimated_time);

		this.new_task_target_form.innerHTML += '<br /><br />';

		this.new_task_target_form.innerHTML += 'Recurring:<br />';

		//task recurring
		this.task_recurring_target_select = document.createElement("select");
		this.task_recurring_target_select.setAttribute('id', 'task_recurring_target_select');
		this.task_recurring_target_select.innerHTML = '<option>False</option><option>True</option>';
		this.new_task_target_form.appendChild(this.task_recurring_target_select);

		this.new_task_target_form.innerHTML += '<br />';
		
		this.new_task_target_form.innerHTML += 'Recurrance Type:<br />';

		//task recurring
		this.task_recurring_target_select_type = document.createElement("select");
		this.task_recurring_target_select_type.setAttribute('id', 'task_recurring_target_select_type');
		this.task_recurring_target_select_type.innerHTML = "<option>Minutes</option><option>Hours</option><option>Days</option><option>Weeks</option><option>Weekly</option><option>Months</option><option>Years</option>";
		this.new_task_target_form.appendChild(this.task_recurring_target_select_type);

		this.new_task_target_form.innerHTML += '<br />';
		
		this.new_task_target_form.innerHTML += 'Recurrance Period:<br />';

		this.task_reccurance_target_period_div = document.createElement('div');
		this.task_reccurance_target_period_div.setAttribute('id', 'task_reccurance_target_period_div');

		//task estimate creation
		this.task_reccurance_target_period = document.createElement("input");
		this.task_reccurance_target_period.setAttribute('id', 'task_reccurance_target_period');
		this.task_reccurance_target_period.setAttribute('type', 'text');
		this.task_reccurance_target_period.setAttribute('value', '0');
		this.task_reccurance_target_period_div.appendChild(this.task_reccurance_target_period);
		this.new_task_target_form.appendChild(this.task_reccurance_target_period_div);

		this.new_task_target_form.innerHTML += 'Recurrance End:<br />';

		this.task_recurring_end_date = document.createElement("input");
		this.task_recurring_end_date.setAttribute('id', 'task_recurring_end_date');
		this.task_recurring_end_date.innerHTML = '<option>False</option><option>True</option>';
		this.new_task_target_form.appendChild(this.task_recurring_end_date);

		this.new_task_target_form.innerHTML += '<br /><br />';
		
		//task delete creation
		this.task_target_submit_button = document.createElement("input");
		this.task_target_submit_button.setAttribute('name', 'task_target_submit_button');
		this.task_target_submit_button.setAttribute('id', 'task_target_submit_button');
		this.task_target_submit_button.setAttribute('type', 'submit');
		this.task_target_submit_button.value = 'Submit';
		this.new_task_target_form.appendChild(this.task_target_submit_button);
		
		this.new_task_target_form.innerHTML += '<br />';
		
		this.loading_image_task_target_new = document.createElement("img");
		this.loading_image_task_target_new.setAttribute('id', 'loading_image_task_target_new');
		this.loading_image_task_target_new.setAttribute('style', 'width:100%;height:19px;');
		this.loading_image_task_target_new.setAttribute('src', 'ajax-loader.gif');
		this.new_task_target_form.appendChild(this.loading_image_task_target_new);
		
		var div_tab = document.getElementById(form_div_id);

		div_tab.innerHTML = '';
		
		div_tab.appendChild(this.new_task_target_form);
		
		$('#' + this.loading_image_task_target_new.id).hide();
		
		$('#' + this.task_target_submit_button.id).button();
		$('#' + this.task_target_submit_button.id).click(function(event){
			
			//ensure a normal postback does not occur
			event.preventDefault();
			
			self.Task_Target_New_Submit_Click();
		});
		
		$('#' + this.task_scheduled_target_date.id).datetimepicker({
			timeFormat : "HH:mm:ss",
			dateFormat : 'yy-mm-dd'
		});
		$('#' + this.task_scheduled_target_date.id).datetimepicker("setDate", new Date());
		
		$('#' + this.task_recurring_end_date.id).datetimepicker({
			timeFormat : "HH:mm:ss",
			dateFormat : 'yy-mm-dd'
		});
		$('#' + this.task_recurring_end_date.id).datetimepicker("setDate", new Date());
	};

}