<?php
/*
 * NOTE: This is PHP code intended to perform server side includes
 * and resolve any javascript file dependencies. If PHP is
 * not installed on the server, this code can be replaced
 * with client side HTML includes (or dynamic javascript includes.)
*/

Header("content-type: application/x-javascript");

//jquery code
include_once('external/jquery-ui-1.10.0.custom/js/jquery-1.9.0.js');

//jquery UI code
include_once('external/jquery-ui-1.10.0.custom/js/jquery-ui-1.10.0.custom.js');

//jquery datepicker code
include_once('external/jquery-ui-timerpicker-addon/jquery-ui-timepicker-addon.js');

//JSON RPC library
include_once('external/json-rpc2php-master/jsonRPC2php.client.js');

//get accordian
require_once('accordian.js.php');

?>

function Task_Tab(task_div_id) {

	//class variables
	this.div_id = task_div_id;
	this.task_log = Array();
	this.task_list = Array();
	
	//GENERAL FUNCTIONS
	
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
					alert('Items failed to refresh.');
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

	this.Insert_Task_Entry = function(is_completed) {
		var self = this;
		var params = new Array();

		//retrieve the selected item from the info array
		var selected_index = document.getElementById(this.add_task_entry_task_name_select.id).selectedIndex;

		if (selected_index > 0) {

			var selected_task = this.task_info_json_array[selected_index - 1];
			var task_time = $('#' + this.task_entry_start_time.id).val();
			var duration = $('#' + this.task_entry_duration.id).val();
			var task_note = $('#' + this.task_entry_note.id).val();
			var task_status = $('#' + this.add_task_entry_task_status_select.id).val();

			params[0] = task_time;
			params[1] = selected_task.task_id;
			params[2] = duration;
			params[3] = 0;
			params[4] = task_status;
			params[5] = task_note;

			if (is_completed) {

				params[3] = 1;

			} else {
				params[3] = 0;
			}

			//show the loader image
			$('#' + self.add_task_entry_loading_image_new.id).show();

			//execute the RPC callback for retrieving the item log
			rpc.Task_Data_Interface.Insert_Task_Entry(params, function(jsonRpcObj) {

				if (jsonRpcObj.result.success == 'true') {

					$('#' + self.task_entry_duration.id).val('0');
					$('#' + self.task_entry_note.id).val('');

					alert('Task entry submitted.');

					self.Refresh_Tasks(function() {
						//refresh_callback();

						self.Refresh_Task_Name_List(function() {
							self.refresh_task_log_callback();
						});

					});

				} else {
					alert('Failed to insert task entry.');
				}

				//hide the loader image
				$('#' + self.add_task_entry_loading_image_new.id).hide();

			});

		}
	};

	this.Start_Stop_Task = function(refresh_callback) {
		var params = new Array();

		//retrieve the selected item from the info array
		var selected_index = document.getElementById(this.task_name_select.id).selectedIndex;
		var selected_task = this.task_info_json_array[selected_index - 1];

		var task_name = $('#' + this.task_name_select.id).val();
		var task_start_stop = this.task_start_stop_button.value;
		var task_note = $('#' + this.task_timecard_note.id).val();

		//ensure it is not the first item in the list
		if (task_name != '-') {

			params[0] = task_name;
			params[1] = task_start_stop;
			params[2] = task_note;

			var self = this;

			//show the loader image
			$('#' + self.loading_image_new.id).show();

			//execute the RPC callback for retrieving the item log
			rpc.Task_Data_Interface.Task_Start_Stop(params, function(jsonRpcObj) {

				if (jsonRpcObj.result.success == 'true') {

					if (self.task_start_stop_button.value == 'Start') {
						//set the new fiels for the task
						selected_task.start_time = new Date();
						self.current_task_start_time = selected_task.start_time;
						selected_task.item_status = 'Started';

						$('#' + self.task_timecard_note_div.id).show();
						self.task_start_stop_button.value = 'Stop';
					} else {
						//set the new fields for the task
						selected_task.start_time = '';
						selected_task.item_status = 'Stopped';

						//reset the notes
						$('#' + self.task_timecard_note.id).val('');

						$('#' + self.task_timecard_note_div.id).hide();
						self.task_start_stop_button.value = 'Start';
					}

					//refresh the info div
					self.On_Task_Name_Select_Change_Event();

					//refresh the timer
					self.Refresh_Timer_Display();

					self.Refresh_Task_Log_Data(function() {
						refresh_callback();

					});

				} else {
					alert('Task failed to start/stop.');
				}

				//hide the loader image
				$('#' + self.loading_image_new.id).hide();

			});

		} else {
			alert('Please select a valid task.');
		}
	};

	this.Mark_Task_Complete = function(refresh_callback) {
		var params = new Array();

		var task_name = $('#' + this.task_name_select.id).val();
		var task_start_stop = this.task_start_stop_button.value;

		//ensure it is not the first item in the list
		if (task_name != '-') {
			params[0] = task_name;

			var self = this;

			//show the loader image
			$('#' + self.loading_image_new.id).show();

			//execute the RPC callback for retrieving the item log
			rpc.Task_Data_Interface.Task_Mark_Complete(params, function(jsonRpcObj) {

				if (jsonRpcObj.result.success == 'true') {

					alert('Task completed.');

					//reset the notes
					$('#' + self.task_timecard_note.id).val('');

					self.Refresh_Tasks(function() {
						//refresh the list to remove this task
						self.Refresh_Task_Name_List(function() {
							//self.refresh_task_log_callback();
							refresh_callback();
						});

					});
				} else {
					alert('Task failed to complete.');
				}

				//hide the loader image
				$('#' + self.loading_image_new.id).hide();

			});

		} else {
			alert('Please select a valid task.');
		}
	};

	this.Refresh_Timer_Display = function() {
		var self = this;
		var new_html = '';

		if (self.task_start_stop_button.value == 'Stop') {
			var currentTime = new Date();

			var time_diff_seconds = (currentTime - self.current_task_start_time) / 1000;
			var days = Math.floor(time_diff_seconds / 60 / 60 / 24);
			var hours = Math.floor(time_diff_seconds / 60 / 60) % 24;
			var minutes = Math.floor(time_diff_seconds / 60) % 60;

			var seconds = Math.floor(time_diff_seconds % 60);

			new_html += "Running Time: " + days + ":" + hours + ":" + minutes + ":" + seconds;
			new_html += '<br /><br />';

		}

		self.task_timer_div.innerHTML = new_html;
	};

	this.Refresh_Task_Log_Data = function(refresh_callback) {
		var self = this;

		//show the loader image
		$('#' + self.task_log_loading_image.id).show();

		var params = new Array();

		//execute the RPC callback for retrieving the item log
		rpc.Task_Data_Interface.Get_Task_Log(params, function(jsonRpcObj) {

			//RPC complete. Set appropriate HTML.
			var new_html = '';

			new_html += 'Last refreshed: ' + (new Date()) + '<br />';
			
			self.task_log = jsonRpcObj.result.data;
			
			new_html += "<b>Database Output</b><br><table border='1' style='width:100%;'>";
			
			new_html += "<tr><td>Name</td><td>Start Time</td><td>Duration (Hours)</td><td>Status</td><td>Note</td></tr>";
			
			var task_entry_options = '<option value="0">-</option>';
			
			for (var i = 0; i < self.task_log.length; i++) {
			    
			    new_html += '<tr>';
			    
			    new_html += '<td>' + self.task_log[i].name + '</td>';
			    new_html += '<td>' + self.task_log[i].start_time + '</td>';
			    new_html += '<td>' + self.task_log[i].hours + '</td>';
			    new_html += '<td>' + self.task_log[i].status + '</td>';
			    new_html += '<td>' + self.task_log[i].note + '</td>';
			    
			    new_html += '</tr>';
			    
			    task_entry_options += '<option value="' + 
			    	self.task_log[i].task_log_id + '">' +
			    	self.task_log[i].start_time + '</option>';
			    
			}
			
			new_html += '</table>';
			
			document.getElementById(self.new_log_data_display_div.id).innerHTML = new_html;
			document.getElementById(self.edit_task_entry_select.id).innerHTML = task_entry_options;

			//hide the loader image
			$('#' + self.task_log_loading_image.id).hide();

			refresh_callback();

		});
	};
	
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
	
	//UI EVENTS
	
	this.On_Click_Event = function() {

		//alert('calling rpc onclick.');

		this.Refresh_Task_Log_Data(function() {
			//empty
		});

	};

	this.On_Complete_Click_Event = function() {
		var task_name = $('#' + this.task_name_select.id).val();
		var task_start_stop = this.task_start_stop_button.value;
		var self = this;

		//stop the task before marking it complete
		if (task_start_stop == 'Stop') {
			this.Start_Stop_Task(function() {
				self.Mark_Task_Complete(function() {
					self.refresh_task_log_callback();
				});
			});
		} else {
			this.Mark_Task_Complete(function() {
				self.refresh_task_log_callback();
			});
		}
	};

	this.On_Start_Stop_Click_Event = function() {
		var self = this;

		this.Start_Stop_Task(function() {
			self.refresh_task_log_callback();
		});
	};

	this.On_Submit_Task_Entry_Click_Event = function() {
		this.Insert_Task_Entry(false);

	};

	this.On_Complete_Task_Entry_Click_Event = function() {
		//execute the click event
		this.Insert_Task_Entry(true);
	};

	this.On_View_Task_Refresh_Click_Event = function() {
		this.Refresh_Tasks(function() {
		});
	};

	this.Task_New_Submit_Click = function() {
		var params = new Array();
		params[0] = $("#" + this.task_name.id).val();
		params[1] = $("#" + this.task_description.id).val();
		params[2] = $("#" + this.task_estimate.id).val();
		params[3] = $("#" + this.task_note.id).val();

		var self = this;

		//show the loader image
		$('#' + self.loading_image_add.id).show();

		//execute the RPC callback for retrieving the item log
		rpc.Task_Data_Interface.Insert_Task(params, function(jsonRpcObj) {

			//hide the loader image
			$('#' + self.loading_image_add.id).hide();

			if (jsonRpcObj.result.success == 'true') {

				self.Refresh_Task_Name_List(function() {
					alert('New task added.');

				});

			} else {
				alert('Task failed to add.');
				//alert(jsonRpcObj.result.debug);
			}

		});
	};

	this.On_Task_Name_Select_Change_Event = function() {
		//alert('Handler for task name select change called.');

		var selected_index = document.getElementById(this.task_name_select.id).selectedIndex;
		var new_html = '';
		new_html += 'Info:<br /><br />';

		if (selected_index > 0) {

			var new_item = this.task_info_json_array[selected_index - 1];

			new_html += 'Task ID: ' + new_item.task_id + '<br />';
			new_html += 'Date Created: ' + new_item.date_created + '<br />';
			new_html += 'Recurring: ' + new_item.recurring + '<br />';
			new_html += 'Recurrance Period: ' + new_item.recurrance_period + '<br />';
			new_html += 'Estimated Time (Hours): ' + new_item.estimated_time + '<br />';
			new_html += 'Scheduled Time: ' + new_item.scheduled_time + '<br />';
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
	
	this.Task_Edit_Entry_Submit_Click = function()
	{
		var self = this;
		var params = new Array();

		//retrieve the selected item from the info array
		var selected_index = document.getElementById(this.edit_task_entry_task_name_select.id).selectedIndex;

		if (selected_index > 0) {
			
			var selected_task_entry_id = document.getElementById(this.edit_task_entry_select.id).value;
			var selected_task = this.task_info_json_array[selected_index - 1];
			var task_time = document.getElementById(this.task_entry_edit_start_time.id).value;
			var duration = document.getElementById(this.task_entry_edit_duration.id).value;
			var task_note = document.getElementById(this.task_entry_edit_note.id).value;
			var task_status = document.getElementById(this.edit_task_entry_task_status_select.id).value;
		
			params[0] = selected_task_entry_id;
			params[1] = selected_task.task_id;
			params[2] = task_time;
			params[3] = duration;
			params[4] = 0;
			params[5] = task_status;
			params[6] = task_note;

			//execute the RPC callback for retrieving the item log
			rpc.Task_Data_Interface.Update_Task_Entry(params, function(jsonRpcObj) {

				if (jsonRpcObj.result.success == 'true') {

					alert('Task entry submitted.');

					self.Refresh_Tasks(function() {
						//refresh_callback();

						self.Refresh_Task_Name_List(function() {
							self.refresh_task_log_callback();
						});

					});

				} else {
					alert('Failed to update task entry.');
				}


			});

		}
			
	};
	
	this.Task_Edit_Entry_Delete_Click = function()
	{
		var self = this;
		
		var value = document.getElementById(self.edit_task_entry_select.id).value;
		
		if(value != 0)
		{
			
			var r=confirm("Are you sure you want to delete this task entry?");
			
			if (r==true)
			{
				var params = new Array();
				params[0] = value;
				
				rpc.Task_Data_Interface.Delete_Task_Entry(params, function(jsonRpcObj) {
				
					if(jsonRpcObj.result.success == 'true'){
						
						alert('Index deleted: ' + value);
						
						self.Refresh_Tasks(function() {
							//refresh the list to remove this task
							self.Refresh_Task_Name_List(function() {
								
								//do nothing
								
							});
	
						});
						
					}
					else
					{
						alert('Failed to delete the entry.');
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
			alert('Select a valid task entry.');
		}
		
	};
	
	this.Task_Edit_Entry_Select_Change = function()
	{
		var self = this;
		
		//alert('Select item entry changed!');
		
		var selected_index = document.getElementById(self.edit_task_entry_select.id).selectedIndex;
		
		if(selected_index != 0)
		{
			var selected_task_entry = self.task_log[selected_index - 1];
			
			document.getElementById(self.edit_task_entry_task_name_select.id).value = selected_task_entry.name;
			document.getElementById(self.task_entry_edit_start_time.id).value = selected_task_entry.start_time;
			document.getElementById(self.edit_task_entry_task_status_select.id).value = selected_task_entry.status;
			document.getElementById(self.task_entry_edit_duration.id).value = selected_task_entry.hours;
			document.getElementById(self.task_entry_edit_note.id).value = selected_task_entry.note;
		}
		else
		{
			document.getElementById(self.edit_task_entry_task_name_select.id).value = '-';
			document.getElementById(self.task_entry_edit_start_time.id).value = '';
			document.getElementById(self.edit_task_entry_task_status_select.id).value = 'Stopped';
			document.getElementById(self.task_entry_edit_duration.id).value = '';
			document.getElementById(self.task_entry_edit_note.id).value = '';
		}
	};
	
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
			params[2] = 0;
			params[3] = document.getElementById(this.task_edit_description.id).value;
			params[4] = document.getElementById(this.task_edit_estimate.id).value;
			params[5] = document.getElementById(this.task_edit_note.id).value;
			
			rpc.Task_Data_Interface.Update_Task(params, function(jsonRpcObj) {
			
				if(jsonRpcObj.result.success == 'true'){
					
					alert('Task updated successfully.');
					
					self.Refresh_Tasks(function() {
						//refresh the list to remove this task
						self.Refresh_Task_Name_List(function() {
							
							//do nothing
							
						});

					});
					
				}
				else
				{
					alert('Failed to update the task.');
				}
			
			});
		
		
			
		
		}
		else
		{
			alert('Select a valid task.');
		}
			
	};
	
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
				
				rpc.Task_Data_Interface.Delete_Task(params, function(jsonRpcObj) {
				
					if(jsonRpcObj.result.success == 'true'){
						
						alert('Index deleted: ' + selected_task.task_id);
						
						self.Refresh_Tasks(function() {
							//refresh the list to remove this task
							self.Refresh_Task_Name_List(function() {
								
								//do nothing
								
							});
	
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
	
	this.Task_Edit_Select_Change = function()
	{
		var selected_index = document.getElementById(this.task_entry_task_edit_name_select.id).selectedIndex;

		if(selected_index != 0)
		{
			var selected_task = this.task_info_json_array[selected_index - 1];
			
			document.getElementById(this.task_edit_name.id).value = selected_task.item_name;
			document.getElementById(this.task_edit_description.id).value = selected_task.description;
			document.getElementById(this.task_edit_estimate.id).value = selected_task.estimated_time;
			document.getElementById(this.task_edit_note.id).value = selected_task.note;
		}
		else
		{
			document.getElementById(this.task_edit_name.id).value = '';
			document.getElementById(this.task_edit_description.id).value = '';
			document.getElementById(this.task_edit_estimate.id).value = '0';
			document.getElementById(this.task_edit_note.id).value = '';
		}
			
	};
	
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
	
	this.Task_Target_Edit_Submit_Click = function()
	{
		alert('Submit editted task target not implemented.');
			
	};
	
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
	
	this.Task_Target_View_Refresh_Click = function()
	{
		
		this.Refresh_Task_Target_Data(function(){
			
		});
		
	};
	
	//RENDER FUNCTIONS
	
	this.Render_Timecard_Task_Entry_Form = function(form_div_id) {

		var self = this;

		//create the top form
		this.data_form_timecard_entry = document.createElement("form");
		this.data_form_timecard_entry.setAttribute('method', "post");
		this.data_form_timecard_entry.setAttribute('id', "timecard_task_entry_form");

		this.data_form_timecard_entry.innerHTML += 'Tasks:<br />';

		//task name select dropdown
		this.task_name_select = document.createElement("select");
		this.task_name_select.setAttribute('name', "task_name_to_enter");
		this.task_name_select.setAttribute('id', "task_name_to_enter");
		this.task_name_select.innerHTML = '<option>-</option>';
		
		this.data_form_timecard_entry.appendChild(this.task_name_select);

		this.task_timecard_note_div = document.createElement("div");
		this.task_timecard_note_div.setAttribute('id', 'task_timecard_note_div');
		this.task_timecard_note_div.innerHTML = 'Note:<br />';
		this.task_timecard_note = document.createElement("input");
		this.task_timecard_note.setAttribute('id', 'task_timecard_note');
		this.task_timecard_note_div.appendChild(this.task_timecard_note);
		this.data_form_timecard_entry.appendChild(this.task_timecard_note_div);

		//info div creation
		this.task_info_div = document.createElement("div");
		this.task_info_div.setAttribute('id', 'task_info_div');
		this.task_info_div.innerHTML = 'Info:<br /><br />';
		this.data_form_timecard_entry.appendChild(this.task_info_div);

		this.task_timer_div = document.createElement("div");
		this.data_form_timecard_entry.appendChild(this.task_timer_div);

		//task start/stop button creation
		this.task_start_stop_button = document.createElement("input");
		this.task_start_stop_button.setAttribute('id', 'task_entry_start_stop');
		this.task_start_stop_button.setAttribute('name', 'task_entry_start_stop');
		this.task_start_stop_button.setAttribute('type', 'submit');
		this.task_start_stop_button.value = 'Start';

		this.data_form_timecard_entry.appendChild(this.task_start_stop_button);

		this.test_div = document.createElement("div");
		this.test_div.innerHTML = '<br />';
		this.data_form_timecard_entry.appendChild(this.test_div);

		//task mark complete button creation
		this.task_start_complete_button = document.createElement("input");
		this.task_start_complete_button.setAttribute('id', 'task_entry_complete');
		this.task_start_complete_button.setAttribute('name', 'task_entry_complete');
		this.task_start_complete_button.setAttribute('type', 'submit');
		this.task_start_complete_button.value = 'Mark Complete';

		
		this.data_form_timecard_entry.appendChild(this.task_start_complete_button);

		this.loading_image_new = document.createElement("img");
		this.loading_image_new.setAttribute('id', 'task_tab_new_entry_loader_image');
		this.loading_image_new.setAttribute('style', 'width:100%;height:19px;');
		this.loading_image_new.setAttribute('src', 'ajax-loader.gif');
		this.data_form_timecard_entry.appendChild(this.loading_image_new);

		var div_tab = document.getElementById(form_div_id);

		div_tab.appendChild(this.data_form_timecard_entry);

		//$('#' + self.loading_image_new.id).hide();
		$('#' + self.task_timecard_note_div.id).hide();
		
		$('#' + this.task_name_select.id).change(function() {

			//call the change event function
			self.On_Task_Name_Select_Change_Event();

		});
		
				
		$('#' + this.task_start_stop_button.id).button();
		$('#' + this.task_start_stop_button.id).click(function(event) {

			//ensure a normal postback does not occur
			event.preventDefault();

			//execute the click event
			self.On_Start_Stop_Click_Event();
		});
		
		
		$('#' + this.task_start_complete_button.id).button();
		$('#' + this.task_start_complete_button.id).click(function(event) {

			//ensure a normal postback does not occur
			event.preventDefault();

			//execute the click event
			self.On_Complete_Click_Event();
		});

		
		//this is used to update the timer value on running tasks
		window.setInterval(function() {

			self.Refresh_Timer_Display();

		}, 1000);
	};

	this.Render_New_Task_Entry_Form = function(form_div_id) {

		var self = this;

		//create the top form
		this.data_form_new_entry = document.createElement("form");
		this.data_form_new_entry.setAttribute('method', "post");
		this.data_form_new_entry.setAttribute('id', "add_task_entry_form");

		this.data_form_new_entry.innerHTML += 'Tasks:<br />';

		//task name select dropdown
		this.add_task_entry_task_name_select = document.createElement("select");
		this.add_task_entry_task_name_select.setAttribute('name', "add_task_entry_name_to_enter");
		this.add_task_entry_task_name_select.setAttribute('id', "add_task_entry_name_to_enter");
		this.add_task_entry_task_name_select.innerHTML = '<option>-</option>';
		this.data_form_new_entry.appendChild(this.add_task_entry_task_name_select);
		
		this.data_form_new_entry.innerHTML += '<br />';
		this.data_form_new_entry.innerHTML += 'Start Time:<br />';

		this.task_entry_start_time = document.createElement("input");
		this.task_entry_start_time.setAttribute('name', 'task_entry_start_time');
		this.task_entry_start_time.setAttribute('id', 'task_entry_start_time');
		this.task_entry_start_time.setAttribute('type', 'text');
		this.data_form_new_entry.appendChild(this.task_entry_start_time);
		
		this.data_form_new_entry.innerHTML += '<br />';
		this.data_form_new_entry.innerHTML += 'Status:<br />';

		this.add_task_entry_task_status_select = document.createElement("select");
		this.add_task_entry_task_status_select.setAttribute('name', "add_task_entry_status_to_enter");
		this.add_task_entry_task_status_select.setAttribute('id', "add_task_entry_status_to_enter");
		this.add_task_entry_task_status_select.innerHTML = '<option>Stopped</option><option>Started</option>';
		this.data_form_new_entry.appendChild(this.add_task_entry_task_status_select);

		this.data_form_new_entry.innerHTML += '<br />';
		this.data_form_new_entry.innerHTML += 'Duration:<br />';

		this.task_entry_duration = document.createElement("input");
		this.task_entry_duration.setAttribute('name', 'task_entry_duration');
		this.task_entry_duration.setAttribute('id', 'task_entry_duration');
		this.task_entry_duration.setAttribute('type', 'text');
		this.task_entry_duration.setAttribute('value', '0');
		this.data_form_new_entry.appendChild(this.task_entry_duration);

		this.data_form_new_entry.innerHTML += '<br />';
		this.data_form_new_entry.innerHTML += 'Note:<br />';

		this.task_entry_note = document.createElement("input");
		this.task_entry_note.setAttribute('name', 'task_entry_note');
		this.task_entry_note.setAttribute('id', 'task_entry_note');
		this.task_entry_note.setAttribute('type', 'text');
		this.data_form_new_entry.appendChild(this.task_entry_note);

		this.data_form_new_entry.innerHTML += '<br /><br />';

		//task submit button creation
		this.add_task_entry_task_submit_button = document.createElement("input");
		this.add_task_entry_task_submit_button.setAttribute('id', 'new_task_entry_submit');
		this.add_task_entry_task_submit_button.setAttribute('type', 'submit');
		this.add_task_entry_task_submit_button.value = 'Submit';
		this.data_form_new_entry.appendChild(this.add_task_entry_task_submit_button);

		this.data_form_new_entry.innerHTML += '<br /><br />';

		//task mark complete button creation
		this.add_task_entry_task_complete_button = document.createElement("input");
		this.add_task_entry_task_complete_button.setAttribute('id', 'new_task_entry_complete');
		this.add_task_entry_task_complete_button.setAttribute('type', 'submit');
		this.add_task_entry_task_complete_button.value = 'Mark Complete';
		this.data_form_new_entry.appendChild(this.add_task_entry_task_complete_button);

		this.add_task_entry_loading_image_new = document.createElement("img");
		this.add_task_entry_loading_image_new.setAttribute('id', 'add_task_entry_tab_new_entry_loader_image');
		this.add_task_entry_loading_image_new.setAttribute('style', 'width:100%;height:19px;');
		this.add_task_entry_loading_image_new.setAttribute('src', 'ajax-loader.gif');
		this.data_form_new_entry.appendChild(this.add_task_entry_loading_image_new);

		var div_tab = document.getElementById(form_div_id);

		div_tab.appendChild(this.data_form_new_entry);

		$('#' + this.add_task_entry_task_submit_button.id).button();
		$('#' + this.add_task_entry_task_submit_button.id).click(function(event) {

			//ensure a normal postback does not occur
			event.preventDefault();

			//execute the click event
			self.On_Submit_Task_Entry_Click_Event();
		});

		$('#' + this.add_task_entry_task_complete_button.id).button();
		$('#' + this.add_task_entry_task_complete_button.id).click(function(event) {

			//ensure a normal postback does not occur
			event.preventDefault();

			self.On_Complete_Task_Entry_Click_Event();

		});
		
		$('#' + this.add_task_entry_task_name_select.id).change(function() {

			//call the change event function
			//self.On_Task_Name_Select_Change_Event();

		});
		

		//$('#' + self.add_task_entry_loading_image_new.id).hide();

		$('#' + this.task_entry_start_time.id).datetimepicker({
			timeFormat : "HH:mm",
			dateFormat : 'yy-mm-dd'
		});
		$('#' + this.task_entry_start_time.id).datetimepicker("setDate", new Date());

	};

	this.Render_Edit_Task_Entry_Form = function(form_div_id) {

		var self = this;

		//create the top form
		this.data_form_edit_entry = document.createElement("form");
		this.data_form_edit_entry.setAttribute('method', "post");
		this.data_form_edit_entry.setAttribute('id', "edit_task_entry_form");

		this.data_form_edit_entry.innerHTML += 'Task Entries:<br />';

		//task name select dropdown
		this.edit_task_entry_select = document.createElement("select");
		this.edit_task_entry_select.setAttribute('name', "edit_task_entry_select");
		this.edit_task_entry_select.setAttribute('id', "edit_task_entry_select");
		this.edit_task_entry_select.innerHTML = '<option>-</option>';
		this.data_form_edit_entry.appendChild(this.edit_task_entry_select);

		this.data_form_edit_entry.innerHTML += '<br /><br />';

		this.data_form_edit_entry.innerHTML += 'Task:<br />';

		//task name select dropdown
		this.edit_task_entry_task_name_select = document.createElement("select");
		this.edit_task_entry_task_name_select.setAttribute('name', "edit_task_entry_name_to_enter");
		this.edit_task_entry_task_name_select.setAttribute('id', "edit_task_entry_name_to_enter");
		this.edit_task_entry_task_name_select.innerHTML = '<option>-</option>';
		
		this.data_form_edit_entry.appendChild(this.edit_task_entry_task_name_select);
		
		this.data_form_edit_entry.innerHTML += '<br />';
		
		this.data_form_edit_entry.innerHTML += 'Start Time:<br />';

		this.task_entry_edit_start_time = document.createElement("input");
		this.task_entry_edit_start_time.setAttribute('name', 'task_entry_edit_start_time');
		this.task_entry_edit_start_time.setAttribute('id', 'task_entry_edit_start_time');
		this.task_entry_edit_start_time.setAttribute('type', 'text');
		this.data_form_edit_entry.appendChild(this.task_entry_edit_start_time);

		this.data_form_edit_entry.innerHTML += '<br />';
		
		this.data_form_edit_entry.innerHTML += 'Status:<br />';

		this.edit_task_entry_task_status_select = document.createElement("select");
		this.edit_task_entry_task_status_select.setAttribute('name', "edit_task_entry_status_to_enter");
		this.edit_task_entry_task_status_select.setAttribute('id', "edit_task_entry_status_to_enter");
		this.edit_task_entry_task_status_select.innerHTML = '<option>Stopped</option><option>Started</option><option>Completed</option>';
		this.data_form_edit_entry.appendChild(this.edit_task_entry_task_status_select);

		this.data_form_edit_entry.innerHTML += '<br />';
		
		this.data_form_edit_entry.innerHTML += 'Duration:<br />';

		this.task_entry_edit_duration = document.createElement("input");
		this.task_entry_edit_duration.setAttribute('name', 'task_entry_edit_duration');
		this.task_entry_edit_duration.setAttribute('id', 'task_entry_edit_duration');
		this.task_entry_edit_duration.setAttribute('type', 'text');
		this.task_entry_edit_duration.setAttribute('value', '0');
		this.data_form_edit_entry.appendChild(this.task_entry_edit_duration);

		this.data_form_edit_entry.innerHTML += '<br />';
		
		this.data_form_edit_entry.innerHTML += 'Note:<br />';

		this.task_entry_edit_note = document.createElement("input");
		this.task_entry_edit_note.setAttribute('name', 'task_entry_edit_note');
		this.task_entry_edit_note.setAttribute('id', 'task_entry_edit_note');
		this.task_entry_edit_note.setAttribute('type', 'text');
		this.data_form_edit_entry.appendChild(this.task_entry_edit_note);

		this.data_form_edit_entry.innerHTML += '<br /><br />';

		//task submit button creation
		this.edit_task_entry_task_submit_button = document.createElement("input");
		this.edit_task_entry_task_submit_button.setAttribute('id', 'edit_task_entry_task_submit_button');
		this.edit_task_entry_task_submit_button.setAttribute('type', 'submit');
		this.edit_task_entry_task_submit_button.value = 'Submit';
		this.data_form_edit_entry.appendChild(this.edit_task_entry_task_submit_button);

		this.data_form_edit_entry.innerHTML += '<br /><br />';

		//task mark complete button creation
		this.edit_task_entry_task_complete_button = document.createElement("input");
		this.edit_task_entry_task_complete_button.setAttribute('id', 'edit_task_entry_task_complete_button');
		this.edit_task_entry_task_complete_button.setAttribute('type', 'submit');
		this.edit_task_entry_task_complete_button.value = 'Delete';
		this.data_form_edit_entry.appendChild(this.edit_task_entry_task_complete_button);

		this.edit_task_entry_loading_image_new = document.createElement("img");
		this.edit_task_entry_loading_image_new.setAttribute('id', 'edit_task_entry_tab_loader_image');
		this.edit_task_entry_loading_image_new.setAttribute('style', 'width:100%;height:19px;');
		this.edit_task_entry_loading_image_new.setAttribute('src', 'ajax-loader.gif');
		this.data_form_edit_entry.appendChild(this.edit_task_entry_loading_image_new);

		var div_tab = document.getElementById(form_div_id);

		div_tab.appendChild(this.data_form_edit_entry);

		$('#' + this.edit_task_entry_task_submit_button.id).button();
		$('#' + this.edit_task_entry_task_submit_button.id).click(function(event) {

			//ensure a normal postback does not occur
			event.preventDefault();
			
			
			//execute the click event
			self.Task_Edit_Entry_Submit_Click();
		});
		
		
		$('#' + this.edit_task_entry_task_complete_button.id).button();
		$('#' + this.edit_task_entry_task_complete_button.id).click(function(event) {

			//ensure a normal postback does not occur
			event.preventDefault();
			
			
			self.Task_Edit_Entry_Delete_Click();

		});
		
		$('#' + this.edit_task_entry_select.id).change(function() {

			//call the change event function
			self.Task_Edit_Entry_Select_Change();

		});
		
		
		$('#' + self.edit_task_entry_loading_image_new.id).hide();

		$('#' + this.task_entry_edit_start_time.id).datetimepicker({
			timeFormat : "HH:mm",
			dateFormat : 'yy-mm-dd'
		});
		$('#' + this.task_entry_edit_start_time.id).datetimepicker("setDate", new Date());

	};

	this.Render_View_Task_Log_Form = function(form_div_id) {
		var self = this;
		var return_html = '';

		this.data_form = document.createElement("form");
		this.data_form.setAttribute('method', "post");
		this.data_form.setAttribute('id', "task_log_display_form");

		this.task_log_submit_button = document.createElement("input");
		this.task_log_submit_button.setAttribute('type', 'submit');
		this.task_log_submit_button.setAttribute('id', 'task_log_submit_button');
		this.task_log_submit_button.value = 'Refresh';

		this.data_form.appendChild(this.task_log_submit_button);

		this.task_log_loading_image = document.createElement("img");
		this.task_log_loading_image.setAttribute('id', 'task_log_loader_image');
		this.task_log_loading_image.setAttribute('style', 'width:100%;height:19px;');
		this.task_log_loading_image.setAttribute('src', 'ajax-loader.gif');
		this.data_form.appendChild(this.task_log_loading_image);

		this.new_log_data_display_div = document.createElement("div");
		this.new_log_data_display_div.setAttribute('id', 'new_task_log_data_display_div');
		this.data_form.appendChild(this.new_log_data_display_div);

		var div_tab = document.getElementById(form_div_id);

		div_tab.innerHTML = '';

		div_tab.appendChild(this.data_form);

		$('#' + this.task_log_submit_button.id).button();
		$('#' + this.task_log_submit_button.id).click(function(event) {

			//ensure a normal postback does not occur
			event.preventDefault();

			//execute the click event
			self.On_Click_Event();
		});
	};

	this.Render_New_Task_Form = function(form_div_id) {

		//create the top form
		this.data_form_new_task = document.createElement("form");
		this.data_form_new_task.setAttribute('method', "post");
		this.data_form_new_task.setAttribute('id', "new_task_form");

		this.data_form_new_task.innerHTML += 'Name:<br />';

		//task name creation
		this.task_name = document.createElement("input");
		this.task_name.setAttribute('name', 'task_name');
		this.task_name.setAttribute('id', 'task_name');
		this.task_name.setAttribute('type', 'text');
		this.data_form_new_task.appendChild(this.task_name);

		this.data_form_new_task.innerHTML += 'Category:<br />';

		//task recurring
		this.task_category_select = document.createElement("select");
		this.task_category_select.setAttribute('id', 'task_category_select');
		this.task_category_select.innerHTML = '<option>-</option>';
		this.data_form_new_task.appendChild(this.task_category_select);

		this.data_form_new_task.innerHTML += 'Description:<br />';

		//task description creation
		this.task_description = document.createElement("input");
		this.task_description.setAttribute('name', 'task_description');
		this.task_description.setAttribute('id', 'task_description');
		this.task_description.setAttribute('type', 'text');
		this.data_form_new_task.appendChild(this.task_description);

		this.data_form_new_task.innerHTML += 'Estimated Time (Hours):<br />';

		//task estimate creation
		this.task_estimate = document.createElement("input");
		this.task_estimate.setAttribute('name', 'task_estimated_time');
		this.task_estimate.setAttribute('id', 'task_estimated_time');
		this.task_estimate.setAttribute('type', 'text');
		this.task_estimate.setAttribute('value', '0');
		this.data_form_new_task.appendChild(this.task_estimate);

		this.data_form_new_task.innerHTML += 'Note:<br />';

		//task note creation
		this.task_note = document.createElement("input");
		this.task_note.setAttribute('name', 'task_note');
		this.task_note.setAttribute('id', 'task_note');
		this.task_note.setAttribute('type', 'text');
		this.data_form_new_task.appendChild(this.task_note);
		
		this.data_form_new_task.innerHTML += '<br /><br />';

		//task submit creation
		this.task_submit_button = document.createElement("input");
		this.task_submit_button.setAttribute('id', 'task_submit');
		this.task_submit_button.setAttribute('type', 'submit');
		this.task_submit_button.value = 'Submit';
		var self = this;
		
		this.data_form_new_task.appendChild(this.task_submit_button);

		this.loading_image_add = document.createElement("img");
		this.loading_image_add.setAttribute('id', 'task_tab_add_task_loader_image');
		this.loading_image_add.setAttribute('style', 'width:100%;height:19px;');
		this.loading_image_add.setAttribute('src', 'ajax-loader.gif');
		this.data_form_new_task.appendChild(this.loading_image_add);

		var div_tab = document.getElementById(form_div_id);

		div_tab.appendChild(this.data_form_new_task);

		//hide ajax loader image
		$('#' + self.loading_image_add.id).hide();
		
		$('#' + this.task_submit_button.id).button();
		$('#' + this.task_submit_button.id).click(function(event) {

			//ensure a normal postback does not occur
			event.preventDefault();

			//execute the click event
			self.Task_New_Submit_Click();
		});

	};

	this.Render_Edit_Task_Form = function(form_div_id) {

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
		this.task_edit_category_select.innerHTML = '<option>-</option>';
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

		this.loading_image_task_edit = document.createElement("img");
		this.loading_image_task_edit.setAttribute('id', 'task_tab_edit_task_loader_image');
		this.loading_image_task_edit.setAttribute('style', 'width:100%;height:19px;');
		this.loading_image_task_edit.setAttribute('src', 'ajax-loader.gif');
		this.data_form_edit_task.appendChild(this.loading_image_task_edit);

		var div_tab = document.getElementById(form_div_id);

		div_tab.appendChild(this.data_form_edit_task);

		//hide ajax loader image
		$('#' + self.loading_image_task_edit.id).hide();
		
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
		
		//task delete creation
		this.task_target_edit_submit_button = document.createElement("input");
		this.task_target_edit_submit_button.setAttribute('id', 'task_target_edit_button');
		this.task_target_edit_submit_button.setAttribute('type', 'submit');
		this.task_target_edit_submit_button.value = 'Submit';
		this.edit_task_target_form.appendChild(this.task_target_edit_submit_button);
		
		this.edit_task_target_form.innerHTML += '<br /><br />';
		
		//task delete creation
		this.task_target_edit_delete_button = document.createElement("input");
		this.task_target_edit_delete_button.setAttribute('id', 'task_target_edit_delete_button');
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
		$(document).on('click', '#' + this.task_target_edit_submit_button.id, function(event){
			
		     //ensure a normal postback does not occur
			event.preventDefault();
			
			self.Task_Target_Edit_Submit_Click();
		});
		

		$('#' + this.task_target_edit_delete_button.id).button();
		$(document).on('click', '#' + this.task_target_edit_delete_button.id, function(event){
			
		     //ensure a normal postback does not occur
			event.preventDefault();
			
			self.Task_Target_Edit_Delete_Click();
		});
		
		$('#' + this.task_edit_scheduled_target_date.id).datetimepicker({
			timeFormat : "HH:mm",
			dateFormat : 'yy-mm-dd'
		});
		$('#' + this.task_edit_scheduled_target_date.id).datetimepicker("setDate", new Date());
		
		/*
		
		//UNKNOWN WHY THIS CODE DOES NOT WORK!!!! HAS BEEN REPLACED WITH '.on()' function calls above.
		
		$('#' + this.task_target_edit_submit_button.id).click(function(event){
			
			//ensure a normal postback does not occur
			event.preventDefault();
			
			alert('Submit editted task target not implemented.');
			
		});
		
		$('#' + this.task_target_edit_delete_button.id).click(function(event){
			
			//ensure a normal postback does not occur
			event.preventDefault();
			
			alert('Delete task target not implemented.');
			
		});
		*/
		


	};
	
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
		
		this.edit_task_target_form.innerHTML += '<br />';
		
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

	//render function (div must already exist)
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
		this.Render_Timecard_Task_Entry_Form('timecard_task_entry_div');

		this.Render_New_Task_Entry_Form('new_task_entry_div');

		this.Render_New_Task_Form('add_task_div');

		this.Render_Edit_Task_Form('edit_tasks_div');

		this.Render_Edit_Task_Entry_Form('edit_task_entry_div');

		this.Render_View_Tasks_Form('view_tasks_div');

		this.Render_View_Task_Log_Form('view_task_log_div');
		
		this.Render_New_Task_Target_Form('new_target_task_entry_div');
		
		this.Render_Edit_Task_Target_Form('edit_target_task_entry_div');
		
		this.Render_View_Task_Target_Form('view_target_task_entry_div');
	};
}

