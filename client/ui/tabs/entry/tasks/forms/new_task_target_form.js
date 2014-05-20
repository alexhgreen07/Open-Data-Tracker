define([
        'jquery.ui',
        ],function($){
	
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
				"task_id",
				"name");
			
		};
		
		this.Refresh_From_Diff = function(diff, data)
		{
			
			var self = this;
			
			//ensure the task info array is saved
			self.task_info_json_array = data.tasks;

			Refresh_Select_HTML_From_Table_Diff(
				self.task_target_new_name_select.id,
				diff.data.tasks,
				"task_id",
				"name");
			
		};
		
		/** @method Task_Target_New_Submit_Click
		 * @desc This is the new task target submit button click event handler.
		 * */
		this.Task_Target_New_Submit_Click = function()
		{
			var self = this;

			//retrieve the selected item from the info array
			var selected_index = this.task_target_new_name_select.selectedIndex;

			if (selected_index > 0) {

				var selected_task = this.task_info_json_array[selected_index - 1];
				//var scheduled_time = self.task_scheduled_target_date.value;
				var scheduled_time = $(self.task_scheduled_target_date).datetimepicker('getDate');
				var recurring = self.task_recurring_target_select.value;
				var recurrance_type = self.task_recurring_target_select_type.value;
				var recurrance_period = self.task_reccurance_target_period.value;
				var variance = self.task_scheduled_variance.value;
				var estimated_time = self.task_target_estimated_time.value;
				//var end_date = self.task_recurring_end_date.value;
				var end_date = $(self.task_recurring_end_date).datetimepicker('getDate');

				var params = {};
				
				//load all function parameters
				params["task_id"] = selected_task.task_id;
				params["scheduled_time"] = scheduled_time.toISOString();
				if(recurring == 'True')
				{
					params["recurring"] = 1;
				}else{
					params["recurring"] = 0;
				}
				params["recurrance_type"] = recurrance_type;
				params["recurrance_period"] = recurrance_period;
				params["allowed_variance"] = variance;
				params["estimated_time"] = estimated_time;
				params["recurrance_end_time"] = end_date.toISOString();
				params["status"] = "Incomplete";

				//execute the RPC callback for retrieving the item log
				app.api.Task_Data_Interface.Insert_Task_Target(params, function(jsonRpcObj) {

					if (jsonRpcObj.result.success) {

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
		this.Render = function(parent_div)
		{
			
			var self = this;

			//create the top form
			this.new_task_target_form = document.createElement("form");
			this.new_task_target_form.setAttribute('method', "post");
			this.new_task_target_form.setAttribute('id', "new_task_target_form");

			this.new_task_target_form = parent_div.appendChild(this.new_task_target_form);
			
			this.new_task_target_form.appendChild(document.createTextNode('Tasks:'));
			this.new_task_target_form.appendChild(document.createElement('br'));

			//task recurring
			this.task_target_new_name_select = document.createElement("select");
			this.task_target_new_name_select.setAttribute('id', 'task_target_new_name_select');
			this.task_target_new_name_select.innerHTML = '<option>-</option>';
			this.task_target_new_name_select = this.new_task_target_form.appendChild(this.task_target_new_name_select);

			this.new_task_target_form.appendChild(document.createElement('br'));
			
			this.new_task_target_form.appendChild(document.createElement('br'));
			this.new_task_target_form.appendChild(document.createTextNode('Scheduled Date:'));
			this.new_task_target_form.appendChild(document.createElement('br'));

			//task estimate creation
			this.task_scheduled_target_date = document.createElement("input");
			this.task_scheduled_target_date.setAttribute('id', 'task_scheduled_target_date');
			this.task_scheduled_target_date.setAttribute('type', 'text');
			this.task_scheduled_target_date = this.new_task_target_form.appendChild(this.task_scheduled_target_date);
			
			this.new_task_target_form.appendChild(document.createElement('br'));
			this.new_task_target_form.appendChild(document.createTextNode('Scheduled Date Variance (Hours):'));
			this.new_task_target_form.appendChild(document.createElement('br'));

			//task estimate creation
			this.task_scheduled_variance = document.createElement("input");
			this.task_scheduled_variance.setAttribute('id', 'task_scheduled_variance');
			this.task_scheduled_variance.setAttribute('type', 'text');
			this.task_scheduled_variance.setAttribute('value', '0');
			this.task_scheduled_variance = this.new_task_target_form.appendChild(this.task_scheduled_variance);

			this.new_task_target_form.appendChild(document.createElement('br'));
			this.new_task_target_form.appendChild(document.createTextNode('Estimated Time (Hours):'));
			this.new_task_target_form.appendChild(document.createElement('br'));

			//task estimate creation
			this.task_target_estimated_time = document.createElement("input");
			this.task_target_estimated_time.setAttribute('id', 'task_target_estimated_time');
			this.task_target_estimated_time.setAttribute('type', 'text');
			this.task_target_estimated_time.setAttribute('value', '0');
			this.task_target_estimated_time = this.new_task_target_form.appendChild(this.task_target_estimated_time);

			this.new_task_target_form.appendChild(document.createElement('br'));
			this.new_task_target_form.appendChild(document.createElement('br'));
			this.new_task_target_form.appendChild(document.createTextNode('Recurring:'));
			this.new_task_target_form.appendChild(document.createElement('br'));

			//task recurring
			this.task_recurring_target_select = document.createElement("select");
			this.task_recurring_target_select.setAttribute('id', 'task_recurring_target_select');
			this.task_recurring_target_select.innerHTML = '<option>False</option><option>True</option>';
			this.task_recurring_target_select = this.new_task_target_form.appendChild(this.task_recurring_target_select);

			this.new_task_target_form.appendChild(document.createElement('br'));
			this.new_task_target_form.appendChild(document.createTextNode('Recurrance Type:'));
			this.new_task_target_form.appendChild(document.createElement('br'));

			//task recurring
			this.task_recurring_target_select_type = document.createElement("select");
			this.task_recurring_target_select_type.setAttribute('id', 'task_recurring_target_select_type');
			this.task_recurring_target_select_type.innerHTML = "<option>Minutes</option><option>Hours</option><option>Days</option><option>Weeks</option><option>Weekly</option><option>Months</option><option>Years</option>";
			this.task_recurring_target_select_type = this.new_task_target_form.appendChild(this.task_recurring_target_select_type);

			this.new_task_target_form.appendChild(document.createElement('br'));
			this.new_task_target_form.appendChild(document.createTextNode('Recurrance Period:'));
			this.new_task_target_form.appendChild(document.createElement('br'));

			this.task_reccurance_target_period_div = document.createElement('div');
			this.task_reccurance_target_period_div.setAttribute('id', 'task_reccurance_target_period_div');
			this.task_reccurance_target_period_div = this.new_task_target_form.appendChild(this.task_reccurance_target_period_div);

			//task estimate creation
			this.task_reccurance_target_period = document.createElement("input");
			this.task_reccurance_target_period.setAttribute('id', 'task_reccurance_target_period');
			this.task_reccurance_target_period.setAttribute('type', 'text');
			this.task_reccurance_target_period.setAttribute('value', '0');
			this.task_reccurance_target_period_div.appendChild(this.task_reccurance_target_period);

			this.new_task_target_form.appendChild(document.createElement('br'));
			this.new_task_target_form.appendChild(document.createTextNode('Recurrance End:'));
			this.new_task_target_form.appendChild(document.createElement('br'));

			this.task_recurring_end_date = document.createElement("input");
			this.task_recurring_end_date.setAttribute('id', 'task_recurring_end_date');
			this.task_recurring_end_date.innerHTML = '<option>False</option><option>True</option>';
			this.task_recurring_end_date = this.new_task_target_form.appendChild(this.task_recurring_end_date);

			this.new_task_target_form.appendChild(document.createElement('br'));
			this.new_task_target_form.appendChild(document.createElement('br'));
			
			//task delete creation
			this.task_target_submit_button = document.createElement("input");
			this.task_target_submit_button.setAttribute('name', 'task_target_submit_button');
			this.task_target_submit_button.setAttribute('id', 'task_target_submit_button');
			this.task_target_submit_button.setAttribute('type', 'submit');
			this.task_target_submit_button.value = 'Submit';
			this.task_target_submit_button = this.new_task_target_form.appendChild(this.task_target_submit_button);
			
			this.new_task_target_form.appendChild(document.createElement('br'));

			$(this.task_target_submit_button).button();
			$(this.task_target_submit_button).click(function(event){
				
				//ensure a normal postback does not occur
				event.preventDefault();
				
				self.Task_Target_New_Submit_Click();
			});
			
			$(this.task_scheduled_target_date).datetimepicker({
				timeFormat : "HH:mm:ss",
				dateFormat : 'yy-mm-dd'
			});
			$(this.task_scheduled_target_date).datetimepicker("setDate", new Date());
			
			$(this.task_recurring_end_date).datetimepicker({
				timeFormat : "HH:mm:ss",
				dateFormat : 'yy-mm-dd'
			});
			$(this.task_recurring_end_date).datetimepicker("setDate", new Date());
		};

	}
	
	function Build_New_Task_Target_Form()
	{
		var built_new_task_target_form = new New_Task_Target_Form();
		
		return built_new_task_target_form;
	}
	
	return {
		Build_New_Task_Target_Form: Build_New_Task_Target_Form,
		New_Task_Target_Form: New_Task_Target_Form
	};
});

