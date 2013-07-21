<?php
/*
 * NOTE: This is PHP code intended to perform server side includes
 * and resolve any javascript file dependencies. If PHP is
 * not installed on the server, this code can be replaced
 * with client side HTML includes (or dynamic javascript includes.)
*/

Header("content-type: application/x-javascript");

//jquery code
include_once(dirname(__FILE__).'/../../../external/jquery-ui-1.10.0.custom/js/jquery-1.9.0.js');

//jquery UI code
include_once(dirname(__FILE__).'/../../../external/jquery-ui-1.10.0.custom/js/jquery-ui-1.10.0.custom.js');

//jquery datepicker code
include_once(dirname(__FILE__).'/../../../external/jquery-ui-timerpicker-addon/jquery-ui-timepicker-addon.js');

//JSON RPC library
include_once(dirname(__FILE__).'/../../../external/json-rpc2php-master/jsonRPC2php.client.js');

//get accordian
require_once(dirname(__FILE__).'/../../accordian.js.php');

//get the timecard task entry form
require_once(dirname(__FILE__).'/forms/timecard_task_entry_form.js.php');

//get the new task entry form
require_once(dirname(__FILE__).'/forms/new_task_entry_form.js.php');

//get the edit task entry form
require_once(dirname(__FILE__).'/forms/edit_task_entry_form.js.php');

//get the edit task entry form
require_once(dirname(__FILE__).'/forms/view_task_entries_form.js.php');

//get the edit task entry form
require_once(dirname(__FILE__).'/forms/new_task_form.js.php');

//get the edit task entry form
require_once(dirname(__FILE__).'/forms/edit_task_form.js.php');


?>

/** This is the task tab object which holds all UI objects for task data interaction.
 * @constructor Task_Tab
 */
function Task_Tab(task_div_id) {

	/** This is the parent div ID where the task tab is.
	 * @type String
	 * */
	this.div_id = task_div_id;
	
	/** This is the array for the task log.
	 * @type Array
	 * */
	this.task_log = Array();
	
	/** This is the array for the tasks.
	 * @type Array
	 * */
	this.task_list = Array();
	
	/** This is the timecard task entry form.
	 * @type Timecard_Task_Entry_Form
	 * */
	this.timecard_task_entry_form = new Timecard_Task_Entry_Form();
	
	/** This is the new task entry form.
	 * @type New_Task_Entry_Form
	 * */
	this.new_task_entry_form = new New_Task_Entry_Form();
	
	/** This is the edit task entry form.
	 * @type Edit_Task_Entry_Form
	 * */
	this.edit_task_entry_form = new Edit_Task_Entry_Form();
	
	/** This is the view task entries form.
	 * @type View_Task_Entries_Form
	 * */
	this.view_task_entries_form = new View_Task_Entries_Form();
	
	/** This is the new task form.
	 * @type New_Task_Form
	 * */
	this.new_task_form = new New_Task_Form();
	
	/** This is the edit task form.
	 * @type Edit_Task_Form
	 * */
	this.edit_task_form = new Edit_Task_Form();
	
	/** This is the callback function for the refresh event of the task log.
	 * @type function
	 * */
	this.refresh_task_log_callback = function(){};
	
	/** @method Refresh_Task_Name_List
	 * @desc This function refreshes the valid start/stop task name list from the server.
	 * @param {function} refresh_callback The callback to call after the refresh of data has completed.
	 * */
	this.Refresh_Task_Name_List = function(refresh_callback) {
		var params = new Array();

		var self = this;

		//show the loader image
		$('#' + self.loading_image_new.id).show();
		$('#' + self.add_task_entry_loading_image_new.id).show();

		//execute the RPC callback for retrieving the item log
		rpc.Task_Data_Interface.Get_Start_Stop_Task_Names(params, function(jsonRpcObj) {

			if (jsonRpcObj.result.authenticated == 'true') {
				if (jsonRpcObj.result.success == 'true') {

					//ensure the task info array is saved
					self.task_info_json_array = jsonRpcObj.result.items;

					//create a list of options for the select
					var new_inner_html = '';

					new_inner_html += '<option>-</option>';

					//iterate through all tasks
					for (var i = 0; i < self.task_info_json_array.length; i++) {
						//add task option to select
						new_inner_html += '<option>' + self.task_info_json_array[i].item_name + '</option>';

						//format task start datetime
						if (self.task_info_json_array[i].start_time != '') {
							//change start date string to javascript date object
							var t = self.task_info_json_array[i].start_time.split(/[- :]/);
							self.task_info_json_array[i].start_time = new Date(t[0], t[1] - 1, t[2], t[3], t[4], t[5]);
						}
					}

					document.getElementById(self.task_name_select.id).innerHTML = new_inner_html;
					document.getElementById(self.add_task_entry_task_name_select.id).innerHTML = new_inner_html;
					document.getElementById(self.edit_task_entry_task_name_select.id).innerHTML = new_inner_html;
					document.getElementById(self.task_entry_task_edit_name_select.id).innerHTML = new_inner_html;
					document.getElementById(self.task_target_new_name_select.id).innerHTML = new_inner_html;
					document.getElementById(self.task_target_edit_name_select.id).innerHTML = new_inner_html;
					
					
					//refresh the task info div
					self.On_Task_Name_Select_Change_Event();
				} else {
					alert('Tasks failed to refresh.');
				}

			} else {
				alert('You are not logged in. Please refresh the page and login again.');
			}

			//hide the loader image
			$('#' + self.loading_image_new.id).hide();
			$('#' + self.add_task_entry_loading_image_new.id).hide();

			refresh_callback();
		});
	};

	/** @method Refresh_Tasks
	 * @desc This function refreshes all the tasks from the server.
	 * @param {function} refresh_callback The callback to call after the refresh of data has completed.
	 * */
	this.Refresh_Tasks = function(refresh_callback) {
		var params = new Array();

		var self = this;

		//show the loader image
		$('#' + self.loading_image_view.id).show();

		//execute the RPC callback for retrieving the item log
		rpc.Task_Data_Interface.Get_Tasks(params, function(jsonRpcObj) {

			var new_inner_html = '';

			new_inner_html += 'Last refreshed: ' + (new Date()) + '<br />';
			//new_inner_html += jsonRpcObj.result.html;
			
			self.task_list = jsonRpcObj.result.data;
			
			new_inner_html += "<b>Database Output</b><br><table border='1' style='width:100%;'>";
			new_inner_html += "<tr><td>Name</td><td>Description</td><td>Estimated Time (Hours)</td></tr>";
			
			for (var i = 0; i < self.task_list.length; i++) {
			    
			    new_inner_html += '<tr>';
			    
			    new_inner_html += '<td>' + self.task_list[i].name + '</td>';
			    new_inner_html += '<td>' + self.task_list[i].description + '</td>';
			    new_inner_html += '<td>' + self.task_list[i].estimated_time + '</td>';
			    
			    new_inner_html += '</tr>';
			    
			}
			
			new_inner_html += '</table>';
			
			document.getElementById(self.new_data_display_div.id).innerHTML = new_inner_html;

			//hide the loader image
			$('#' + self.loading_image_view.id).hide();

			self.Refresh_Task_Log_Data(function() {
				
				self.Refresh_Task_Target_Data(function(){
					
					refresh_callback();
					
				})
				
			});

		});
	};
	
	/** @method Refresh_Task_Target_Data
	 * @desc This function will refresh the task log data from the server.
	 * @param {function} refresh_callback The function to call when the refresh is complete.
	 * */
	this.Refresh_Task_Target_Data = function(refresh_callback)
	{
		
		var self = this;

		var params = new Array();
		
		$('#'+self.loading_image_task_target_view.id).show();
		
		//execute the RPC callback for retrieving the item log
		rpc.Task_Data_Interface.Get_Task_Targets(params, function(jsonRpcObj) {

			//RPC complete. Set appropriate HTML.
			var new_html = '';

			new_html += 'Last refreshed: ' + (new Date()) + '<br />';
			
			self.task_targets_log = jsonRpcObj.result.data;
			
			new_html += "<b>Database Output</b><br><table border='1' style='width:100%;'>";
			
			new_html += "<tr><td>Target ID</td><td>Name</td><td>Scheduled Time</td><td>Recuring</td><td>Recurrance Period</td></tr>";
			
			var select_html = '<option value="0">-</option>';
			
			for (var i = 0; i < self.task_targets_log.length; i++) {
			    
			    new_html += '<tr>';
			    
			    new_html += '<td>' + self.task_targets_log[i].task_schedule_id + '</td>';
			    new_html += '<td>' + self.task_targets_log[i].name + '</td>';
			    new_html += '<td>' + self.task_targets_log[i].scheduled_time + '</td>';
			    new_html += '<td>' + self.task_targets_log[i].recurring + '</td>';
			    new_html += '<td>' + self.task_targets_log[i].recurrance_period + '</td>';
			    
			    new_html += '</tr>';
			    
			    select_html += '<option value="'
			    	+ self.task_targets_log[i].task_schedule_id + '">' + 
			    	self.task_targets_log[i].name + 
			    	" (" + self.task_targets_log[i].task_schedule_id + ")</option>";
			    
			}
			
			new_html += '</table>';
			
			document.getElementById(self.view_task_target_data_div.id).innerHTML = new_html;
			document.getElementById(self.task_edit_target_select.id).innerHTML = select_html;
			
			$('#'+self.loading_image_task_target_view.id).hide();
			
			refresh_callback();
		});
	};
	
	/** @method On_View_Task_Refresh_Click_Event
	 * @desc This function is the task entry view refresh button click event handler.
	 * */
	this.On_View_Task_Refresh_Click_Event = function() {
		this.Refresh_Tasks(function() {
		});
	};

	/** @method On_Task_Name_Select_Change_Event
	 * @desc This function is the HTML select task start/stop index change event handler.
	 * */
	this.On_Task_Name_Select_Change_Event = function() {
		//alert('Handler for task name select change called.');

		var selected_index = document.getElementById(this.task_name_select.id).selectedIndex;
		var new_html = '';
		new_html += 'Info:<br /><br />';

		if (selected_index > 0) {

			var new_item = this.task_info_json_array[selected_index - 1];

			new_html += 'Task ID: ' + new_item.task_id + '<br />';
			new_html += 'Date Created: ' + new_item.date_created + '<br />';
			new_html += 'Estimated Time (Hours): ' + new_item.estimated_time + '<br />';
			new_html += 'Status: ' + new_item.item_status + '<br />';
			new_html += 'Start Time: ' + new_item.start_time + '<br />';

			if (new_item.item_status == 'Started') {
				//set the start time and button value
				this.current_task_start_time = new_item.start_time;
				$('#' + this.task_timecard_note_div.id).show();
				this.task_start_stop_button.value = 'Stop';
			} else {
				$('#' + this.task_timecard_note_div.id).hide();
				this.task_start_stop_button.value = 'Start';
			}
		} else {
			this.task_start_stop_button.value = 'Start';
		}

		new_html += '<br />';

		this.task_info_div.innerHTML = new_html;

		//refresh the timer
		this.Refresh_Timer_Display();

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
			var scheduled = document.getElementById(self.task_scheduled_target_select.id).value;
			var scheduled_time = document.getElementById(self.task_scheduled_target_date.id).value;
			var recurring = document.getElementById(self.task_recurring_target_select.id).value;
			var recurrance_type = document.getElementById(self.task_recurring_target_select_type.id).value;
			var recurrance_period = document.getElementById(self.task_reccurance_target_period.id).value;
			
			//load all function parameters
			params[0] = selected_task.task_id;
			if(scheduled == 'Scheduled')
			{
				params[1] = 1;
			}else{
				params[1] = 0;
			}
			params[2] = scheduled_time;
			if(recurring == 'True')
			{
				params[3] = 1;
			}else{
				params[3] = 0;
			}
			params[4] = recurrance_type;
			params[5] = recurrance_period;

			//show the loader image
			$('#' + self.add_task_entry_loading_image_new.id).show();

			//execute the RPC callback for retrieving the item log
			rpc.Task_Data_Interface.Insert_Task_Target(params, function(jsonRpcObj) {

				if (jsonRpcObj.result.success == 'true') {

					alert('Task target inserted successfully.');

					self.Refresh_Tasks(function() {
						
						self.Refresh_Task_Name_List(function() {
							
							self.Refresh_Task_Target_Data(function(){
								
								self.refresh_task_log_callback();
								
							});
							
						});

					});

				} else {
					alert('Failed to insert task entry.' + jsonRpcObj.result.debug);
				}

				//hide the loader image
				$('#' + self.add_task_entry_loading_image_new.id).hide();

			});

		}
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
		var new_scheduled = 0;
		if(document.getElementById(this.task_edit_scheduled_target_select.id).value == "Scheduled")
		{
			new_scheduled = 1;
		}
		else{
			new_scheduled = 0;
		}
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
			params.push(new_scheduled);
			params.push(new_scheduled_time);
			params.push(new_recurring);
			params.push(new_recurrance_type);
			params.push(new_recurrance_period);
			
			rpc.Task_Data_Interface.Update_Task_Target(params, function(jsonRpcObj) {
			
				if(jsonRpcObj.result.success == 'true'){
					
					alert('Index updated successfully.');
					
					self.Refresh_Tasks(function() {
						
						//refresh the list to remove this task
						self.Refresh_Task_Name_List(function() {
							
							self.Refresh_Task_Target_Data(function(){
								
								//do nothing
								
							});
							
							
						});

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
				
				rpc.Task_Data_Interface.Delete_Task_Target(params, function(jsonRpcObj) {
				
					if(jsonRpcObj.result.success == 'true'){
						
						alert('Index deleted: ' + index_to_delete);
						
						self.Refresh_Tasks(function() {
							
							//refresh the list to remove this task
							self.Refresh_Task_Name_List(function() {
								
								self.Refresh_Task_Target_Data(function(){
									
									//do nothing
									
								});
								
								
							});
	
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
	
	/** @method Task_Target_View_Refresh_Click
	 * @desc This is the task target view refresh submit click button.
	 * */
	this.Task_Target_View_Refresh_Click = function()
	{
		
		this.Refresh_Task_Target_Data(function(){
			
		});
		
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
			if(self.task_targets_log[index_to_fill - 1].scheduled == 1)
			{
				document.getElementById(this.task_edit_scheduled_target_select.id).value = "Scheduled";
			
			}
			else{
				document.getElementById(this.task_edit_scheduled_target_select.id).value = "Floating";
			
			}
			
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
			document.getElementById(this.task_edit_scheduled_target_select.id).value = "Floating";
			document.getElementById(this.task_edit_recurring_target_select.id).value = "False";
			document.getElementById(this.task_edit_recurring_target_select_type.id).value = "Minutes";
			document.getElementById(this.task_edit_reccurance_target_period.id).value = "0";
		}
		
	};

	/** @method Render_View_Tasks_Form
	 * @desc This function renders the view tasks form in the specified div.
	 * @param {String} form_div_id The div ID to render the form in. 
	 * */
	this.Render_View_Tasks_Form = function(form_div_id) {

		var return_html = '';

		this.data_form_view_tasks = document.createElement("form");
		this.data_form_view_tasks.setAttribute('method', "post");
		this.data_form_view_tasks.setAttribute('id', "data_display_form");

		this.view_tasks_refresh_button = document.createElement("input");
		this.view_tasks_refresh_button.setAttribute('type', 'submit');
		this.view_tasks_refresh_button.setAttribute('id', 'view_tasks_refresh_button');
		this.view_tasks_refresh_button.value = 'Refresh';

		var self = this;

		this.data_form_view_tasks.appendChild(this.view_tasks_refresh_button);

		this.loading_image_view = document.createElement("img");
		this.loading_image_view.setAttribute('id', 'task_tab_task_view_loader_image');
		this.loading_image_view.setAttribute('style', 'width:100%;height:19px;');
		this.loading_image_view.setAttribute('src', 'ajax-loader.gif');
		this.data_form_view_tasks.appendChild(this.loading_image_view);

		this.new_data_display_div = document.createElement("div");
		this.new_data_display_div.id = 'new_task_view_data_display_div';
		this.data_form_view_tasks.appendChild(this.new_data_display_div);

		var div_tab = document.getElementById(form_div_id);

		div_tab.innerHTML = '';

		div_tab.appendChild(this.data_form_view_tasks);

		$('#' + this.view_tasks_refresh_button.id).button();
		$('#' + this.view_tasks_refresh_button.id).click(function(event) {

			//ensure a normal postback does not occur
			event.preventDefault();

			//execute the click event
			self.On_View_Task_Refresh_Click_Event();
		});


	};

	/** @method Render_New_Task_Target_Form
	 * @desc This function renders the new task targets form in the specified div.
	 * @param {String} form_div_id The div ID to render the form in. 
	 * */
	this.Render_New_Task_Target_Form = function(form_div_id)
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
		
		this.new_task_target_form.innerHTML += 'Scheduled/Floating:<br />';

		//task recurring
		this.task_scheduled_target_select = document.createElement("select");
		this.task_scheduled_target_select.setAttribute('id', 'task_scheduled_target_select');
		this.task_scheduled_target_select.innerHTML = '<option>Floating</option><option>Scheduled</option>';
		this.new_task_target_form.appendChild(this.task_scheduled_target_select);

		this.new_task_target_form.innerHTML += '<br />';
		
		this.new_task_target_form.innerHTML += 'Scheduled Date:<br />';

		//task estimate creation
		this.task_scheduled_target_date = document.createElement("input");
		this.task_scheduled_target_date.setAttribute('id', 'task_scheduled_target_date');
		this.task_scheduled_target_date.setAttribute('type', 'text');
		this.new_task_target_form.appendChild(this.task_scheduled_target_date);

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
			timeFormat : "HH:mm",
			dateFormat : 'yy-mm-dd'
		});
		$('#' + this.task_scheduled_target_date.id).datetimepicker("setDate", new Date());
	};
	
	/** @method Render_Edit_Task_Target_Form
	 * @desc This function renders the edit task targets form in the specified div.
	 * @param {String} form_div_id The div ID to render the form in. 
	 * */
	this.Render_Edit_Task_Target_Form = function(form_div_id)
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

		this.edit_task_target_form.innerHTML += 'Scheduled/Floating:<br />';

		//task recurring
		this.task_edit_scheduled_target_select = document.createElement("select");
		this.task_edit_scheduled_target_select.setAttribute('id', 'task_edit_scheduled_target_select');
		this.task_edit_scheduled_target_select.innerHTML = '<option>Floating</option><option>Scheduled</option>';
		this.edit_task_target_form.appendChild(this.task_edit_scheduled_target_select);

		this.edit_task_target_form.innerHTML += '<br />';
		
		this.edit_task_target_form.innerHTML += 'Scheduled Date:<br />';

		//task estimate creation
		this.task_edit_scheduled_target_date = document.createElement("input");
		this.task_edit_scheduled_target_date.setAttribute('id', 'task_edit_scheduled_target_date');
		this.task_edit_scheduled_target_date.setAttribute('type', 'text');
		this.edit_task_target_form.appendChild(this.task_edit_scheduled_target_date);

		this.edit_task_target_form.innerHTML += '<br />';

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
			timeFormat : "HH:mm",
			dateFormat : 'yy-mm-dd'
		});
		$('#' + this.task_edit_scheduled_target_date.id).datetimepicker("setDate", new Date());
		
		$('#' + this.task_edit_target_select.id).change(function(){
			
			self.Task_Target_Edit_Select_Change();
			
		});

	};
	
	/** @method Render_View_Task_Target_Form
	 * @desc This function renders the view task targets form in the specified div.
	 * @param {String} form_div_id The div ID to render the form in. 
	 * */
	this.Render_View_Task_Target_Form = function(form_div_id)
	{
		var self = this;
		
		
		//create the top form
		this.view_task_target_form = document.createElement("form");
		this.view_task_target_form.setAttribute('method', "post");
		this.view_task_target_form.setAttribute('id', "view_task_target_form");
		
		//task delete creation
		this.task_target_view_refresh_button = document.createElement("input");
		this.task_target_view_refresh_button.setAttribute('name', 'task_target_view_refresh_button');
		this.task_target_view_refresh_button.setAttribute('id', 'task_target_view_refresh_button');
		this.task_target_view_refresh_button.setAttribute('type', 'submit');
		this.task_target_view_refresh_button.value = 'Refresh';
		this.view_task_target_form.appendChild(this.task_target_view_refresh_button);
		
		this.view_task_target_form.innerHTML += '<br />';
		
		this.loading_image_task_target_view = document.createElement("img");
		this.loading_image_task_target_view.setAttribute('id', 'loading_image_task_target_view');
		this.loading_image_task_target_view.setAttribute('style', 'width:100%;height:19px;');
		this.loading_image_task_target_view.setAttribute('src', 'ajax-loader.gif');
		this.view_task_target_form.appendChild(this.loading_image_task_target_view);
		
		this.view_task_target_data_div = document.createElement('div');
		this.view_task_target_data_div.id = 'view_task_target_data_div';
		this.view_task_target_form.appendChild(this.view_task_target_data_div);
		
		var div_tab = document.getElementById(form_div_id);

		div_tab.innerHTML = '';
		
		div_tab.appendChild(this.view_task_target_form);
		
		$('#' + this.task_target_view_refresh_button.id).button();
		$('#' + this.task_target_view_refresh_button.id).click(function(event){
			
			//ensure a normal postback does not occur
			event.preventDefault();
			
			self.Task_Target_View_Refresh_Click();
		});

	};

	/** @method Render
	 * @desc This function renders the tab in the div the object was initialized with.
	 * @param {String} form_div_id The div ID to render the form in. 
	 * */
	this.Render = function() {

		var tabs_array = new Array();

		var new_tab;

		new_tab = new Array();
		new_tab.push("Timecard Task Entry");
		new_tab.push('<div id="timecard_task_entry_div"></div>');
		tabs_array.push(new_tab);

		new_tab = new Array();
		new_tab.push("New Task Entry");
		new_tab.push('<div id="new_task_entry_div"></div>');
		tabs_array.push(new_tab);

		new_tab = new Array();
		new_tab.push("Edit Task Entry");
		new_tab.push('<div id="edit_task_entry_div"></div>');
		tabs_array.push(new_tab);

		new_tab = new Array();
		new_tab.push("View Task Log");
		new_tab.push('<div id="view_task_log_div"></div>');
		tabs_array.push(new_tab);

		new_tab = new Array();
		new_tab.push("New Task");
		new_tab.push('<div id="add_task_div"></div>');
		tabs_array.push(new_tab);

		new_tab = new Array();
		new_tab.push("Edit Task");
		new_tab.push('<div id="edit_tasks_div"></div>');
		tabs_array.push(new_tab);

		new_tab = new Array();
		new_tab.push("View Tasks");
		new_tab.push('<div id="view_tasks_div"></div>');
		tabs_array.push(new_tab);

		new_tab = new Array();
		new_tab.push("New Target Entry");
		new_tab.push('<div id="new_target_task_entry_div"></div>');
		tabs_array.push(new_tab);

		new_tab = new Array();
		new_tab.push("Edit Target Entry");
		new_tab.push('<div id="edit_target_task_entry_div"></div>');
		tabs_array.push(new_tab);

		new_tab = new Array();
		new_tab.push("View Targets");
		new_tab.push('<div id="view_target_task_entry_div"></div>');
		tabs_array.push(new_tab);

		var return_html = '';

		return_html += '<div id="tasks_accordian"></div>';

		var div_tab = document.getElementById(this.div_id);
		div_tab.innerHTML = return_html;

		//render the accordian
		var task_accordian = new Accordian('tasks_accordian', tabs_array);
		task_accordian.Render();

		//now render all accordian tabs
		this.timecard_task_entry_form.Render('timecard_task_entry_div');

		this.new_task_entry_form.Render('new_task_entry_div');

		this.edit_task_entry_form.Render('edit_task_entry_div');

		this.view_task_entries_form.Render('view_task_log_div');

		this.new_task_form.Render('add_task_div');

		this.edit_task_form.Render('edit_tasks_div');

		this.Render_View_Tasks_Form('view_tasks_div');

		this.Render_New_Task_Target_Form('new_target_task_entry_div');
		
		this.Render_View_Task_Target_Form('view_target_task_entry_div');
		
		this.Render_Edit_Task_Target_Form('edit_target_task_entry_div');
		
	};
}

