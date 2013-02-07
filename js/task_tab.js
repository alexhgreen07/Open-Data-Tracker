function Task_Tab (task_div_id) {

	//class variables
	this.div_id = task_div_id;
	this.data_form_new_entry;
	this.data_form_view_tasks;
	this.data_form_new_task;
	this.task_name_select;
	this.task_info_json_array;
	this.task_info_div;
	this.task_timer_div;
	this.task_start_stop_button;
	this.task_name;
	this.task_description;
	this.task_estimate;
	this.task_note;
	this.new_data_display_div;
	this.loading_image_new;
	this.loading_image_add;
	this.loading_image_view;
	this.current_task_start_time;
	
	this.Refresh_Task_Name_List = function(refresh_callback)
	{
		var params = new Array();
		
		var self = this;
		
		//show the loader image
		$('#' + self.loading_image_new.id).show();
		
		//execute the RPC callback for retrieving the item log
		rpc.Data_Interface.Get_Start_Stop_Task_Names(params,function(jsonRpcObj){
			
			if(jsonRpcObj.result.authenticated == 'true')
			{
				if(jsonRpcObj.result.success == 'true')
				{
					
					//ensure the task info array is saved
					self.task_info_json_array = jsonRpcObj.result.items;
					
					//create a list of options for the select
					var new_inner_html = '';
					
					new_inner_html += '<option>-</option>';
					
					//iterate through all tasks
					for (var i = 0; i < self.task_info_json_array.length; i++)
					{
						//add task option to select
						new_inner_html += '<option>' + self.task_info_json_array[i].item_name + '</option>';
						
						//format task start datetime
						if(self.task_info_json_array[i].start_time != '')
						{
							//change start date string to javascript date object
							var t = self.task_info_json_array[i].start_time.split(/[- :]/);
							self.task_info_json_array[i].start_time = new Date(t[0], t[1]-1, t[2], t[3], t[4], t[5]);
						}
					}
					
					document.getElementById(self.task_name_select.id).innerHTML = new_inner_html;
					document.getElementById(self.add_task_entry_task_name_select.id).innerHTML = new_inner_html;
					
					//refresh the task info div
					self.On_Task_Name_Select_Change_Event();
				}
				else
				{
					alert('Items failed to refresh.');
				}

			}
			else
			{
				alert('You are not logged in. Please refresh the page and login again.');
			}
			
			//hide the loader image
			$('#' + self.loading_image_new.id).hide();
			
			refresh_callback();
		});
	};
	
	this.Refresh_Tasks = function(refresh_callback)
	{
		var params = new Array();
		
		var self = this;
		
		//show the loader image
		$('#' + self.loading_image_view.id).show();
		
		//execute the RPC callback for retrieving the item log
		rpc.Data_Interface.Get_Tasks(params,function(jsonRpcObj){
			
			var new_inner_html = '';
			
			new_inner_html += 'Last refreshed: ' + (new Date()) + '<br />';
			new_inner_html += jsonRpcObj.result.html;
			self.new_data_display_div.innerHTML = new_inner_html;
			
			//hide the loader image
			$('#' + self.loading_image_view.id).hide();
			
			self.Refresh_Task_Log_Data(function()
			{
				refresh_callback();
			});
			
			
		});
	};
	
	this.Insert_Task_Entry = function(is_completed)
	{
		var self = this;
		var params = new Array();
		
		//retrieve the selected item from the info array
		var selected_index = document.getElementById(this.add_task_entry_task_name_select.id).selectedIndex;
		
		if(selected_index > 0)
		{
		
			var selected_task = this.task_info_json_array[selected_index - 1];
			var task_time = $('#' + this.task_entry_start_time.id).val();
			var duration = $('#' + this.task_entry_duration.id).val();
			var task_note = $('#' + this.task_entry_note.id).val();
			
		
			params[0] = task_time;
			params[1] = selected_task.task_id;
			params[2] = duration;
			params[3] = 0;
			params[4] = task_note;
			
			if(is_completed)
			{
			
				params[3] = 1;
			
			}
			else
			{
				params[3] = 0;
			}
			
			//show the loader image
			$('#' + self.add_task_entry_loading_image_new.id).show();
		
			//execute the RPC callback for retrieving the item log
			rpc.Data_Interface.Insert_Task_Entry(params,function(jsonRpcObj){
			
				if(jsonRpcObj.result.success == 'true')
				{
					
					$('#' + self.task_entry_duration.id).val('0');
					$('#' + self.task_entry_note.id).val('');
					
					alert('Task entry submitted.');
			
				}
				else
				{
					alert('Failed to insert task entry.');
				}
			
			
				//hide the loader image
				$('#' + self.add_task_entry_loading_image_new.id).hide();
				
				refresh_callback();
			});
		
		}
	};
	
	this.Start_Stop_Task = function(refresh_callback)
	{
		var params = new Array();
		
		//retrieve the selected item from the info array
		var selected_index = document.getElementById(this.task_name_select.id).selectedIndex;
		var selected_task = this.task_info_json_array[selected_index - 1];
		
		var task_name = $('#' + this.task_name_select.id).val();
		var task_start_stop = this.task_start_stop_button.value;
		var task_note = $('#' + this.task_timecard_note.id).val();
		
		//ensure it is not the first item in the list
		if(task_name != '-')
		{
		
			params[0] = task_name;
			params[1] = task_start_stop;
			params[2] = task_note;
		
			var self = this;
		
			//show the loader image
			$('#' + self.loading_image_new.id).show();
		
			//execute the RPC callback for retrieving the item log
			rpc.Data_Interface.Task_Start_Stop(params,function(jsonRpcObj){
			
				if(jsonRpcObj.result.success == 'true')
				{
			
					if(self.task_start_stop_button.value == 'Start')
					{
						//set the new fiels for the task
						selected_task.start_time = new Date();
						self.current_task_start_time = selected_task.start_time;
						selected_task.item_status = 'Started';
						
						$('#' + self.task_timecard_note_div.id).show();
						self.task_start_stop_button.value = 'Stop';
					}
					else
					{
						//set the new fields for the task
						selected_task.start_time = '';
						selected_task.item_status = 'Stopped';
						
						$('#' + self.task_timecard_note_div.id).hide();
						self.task_start_stop_button.value = 'Start';
					}
					
					//refresh the info div
					self.On_Task_Name_Select_Change_Event();
					
					//refresh the timer
					self.Refresh_Timer_Display();
				
				
				}
				else
				{
					alert('Task failed to start/stop.');
				}
			
			
				//hide the loader image
				$('#' + self.loading_image_new.id).hide();
				
				refresh_callback();
			});
		
		}
		else
		{
			alert('Please select a valid task.');
		}
	};
	
	this.Mark_Task_Complete = function()
	{
		var params = new Array();
		
		var task_name = $('#' + this.task_name_select.id).val();
		var task_start_stop = this.task_start_stop_button.value;
		
		//ensure it is not the first item in the list
		if(task_name != '-')
		{
			params[0] = task_name;
			
			var self = this;
		
			//show the loader image
			$('#' + self.loading_image_new.id).show();
		
			//execute the RPC callback for retrieving the item log
			rpc.Data_Interface.Task_Mark_Complete(params,function(jsonRpcObj){
			
				if(jsonRpcObj.result.success == 'true')
				{
			
					alert('Task completed.');
				}
				else
				{
					alert('Task failed to complete.');
				}
				
				//refresh the list to remove this task
				self.Refresh_Task_Name_List();
			
				//hide the loader image
				$('#' + self.loading_image_new.id).hide();
		
			});
		
		}
		else
		{
			alert('Please select a valid task.');
		}
	};
	
	this.Refresh_Timer_Display = function()
	{
		var self = this;
		var new_html = '';
			
		if(self.task_start_stop_button.value == 'Stop')
		{
			var currentTime = new Date();
			
			var time_diff_seconds = (currentTime - self.current_task_start_time)/1000;
			var days = Math.floor(time_diff_seconds / 60 / 60 / 24);
			var hours = Math.floor(time_diff_seconds / 60 / 60) % 24;
			var minutes = Math.floor(time_diff_seconds / 60) % 60;

			var seconds = Math.floor(time_diff_seconds % 60);
			
			new_html += "Running Time: " + days + ":" + hours + ":" + minutes + ":" + seconds;
			new_html += '<br /><br />';
			
			
		}
		
		self.task_timer_div.innerHTML = new_html;
	};
	
	this.Refresh_Task_Log_Data = function(refresh_callback)
	{
		var self = this;
		
		//show the loader image
		$('#' + self.task_log_loading_image.id).show();
		
		var params = new Array();
		
		
		//execute the RPC callback for retrieving the item log
		rpc.Data_Interface.Get_Task_Log(params,function(jsonRpcObj){
			
			//RPC complete. Set appropriate HTML.
			var new_html = '';
			
			new_html += 'Last refreshed: ' + (new Date()) + '<br />';
			new_html += jsonRpcObj.result.html;
			
			document.getElementById(self.new_log_data_display_div.id).innerHTML = new_html;
			
			//hide the loader image
			$('#' + self.task_log_loading_image.id).hide();
			
			refresh_callback();
		});
	};
	
	this.On_Click_Event = function()
	{
		
		//alert('calling rpc onclick.');
		
		this.Refresh_Task_Log_Data();
		
	};
	
	this.On_Complete_Click_Event = function() 
	{
		var task_name = $('#' + this.task_name_select.id).val();
		var task_start_stop = this.task_start_stop_button.value;
		var self = this;
		
		//stop the task before marking it complete
		if(task_start_stop == 'Stop')
		{
			this.Start_Stop_Task(function()
			{
				self.Mark_Task_Complete();
			});
		}
		else
		{
			this.Mark_Task_Complete();
		}
	};
	
	this.On_Start_Stop_Click_Event = function()
	{
		
		this.Start_Stop_Task();
	};
	
	this.On_View_Task_Refresh_Click_Event = function()
	{
		this.Refresh_Tasks();
	};
	
	this.On_Add_Task_Click_Event = function()
	{
		var params = new Array();
		params[0] = $("#" + this.task_name.id).val();
		params[1] = $("#" + this.task_description.id).val();
		params[2] = $("#" + this.task_estimate.id).val();
		params[3] = $("#" + this.task_note.id).val();
		params[4] = $('#' + this.task_status_select.id).val();
		params[5] = $('#' + this.task_scheduled_select.id).val();
		params[6] = $('#' + this.task_scheduled_date.id).val();
		params[7] = $('#' + this.task_recurring_select.id).val();
		params[8] = 'hours';
		params[9] = $('#' + this.task_reccurance_period.id).val();
		
		var self = this;
		
		//show the loader image
		$('#' + self.loading_image_add.id).show();
		
		//execute the RPC callback for retrieving the item log
		rpc.Data_Interface.Add_New_Task(params,function(jsonRpcObj){
			
			//hide the loader image
			$('#' + self.loading_image_add.id).hide();
			
			if(jsonRpcObj.result.success == 'true')
			{
			
				self.Refresh_Task_Name_List(function()
				{
					alert('New task added.');
				});
			
			}
			else
			{
				alert('Task failed to add.');
			}
			
			
		});
	};
	
	this.On_Task_Name_Select_Change_Event = function()
	{
		//alert('Handler for task name select change called.');
		
		var selected_index = document.getElementById(this.task_name_select.id).selectedIndex;
		var new_html = '';
		new_html += 'Info:<br /><br />';
		
		if(selected_index > 0)
		{
		
			var new_item = this.task_info_json_array[selected_index - 1];
			
			new_html += 'Task ID: ' + new_item.task_id + '<br />';
			new_html += 'Date Created: ' + new_item.date_created + '<br />';
			new_html += 'Recurring: ' + new_item.recurring + '<br />';
			new_html += 'Recurrance Period: ' + new_item.recurrance_period + '<br />';
			new_html += 'Estimated Time (Hours): ' + new_item.estimated_time + '<br />';
			new_html += 'Scheduled Time: ' + new_item.scheduled_time + '<br />';
			new_html += 'Status: ' + new_item.item_status + '<br />';
			new_html += 'Start Time: ' + new_item.start_time + '<br />';
			
			if(new_item.item_status == 'Started')
			{
				//set the start time and button value
				this.current_task_start_time = new_item.start_time;
				$('#' + this.task_timecard_note_div.id).show();
				this.task_start_stop_button.value = 'Stop';
			}
			else
			{
				$('#' + this.task_timecard_note_div.id).hide();
				this.task_start_stop_button.value = 'Start';
			}
		}
		else
		{
			this.task_start_stop_button.value = 'Start';
		}
		
		new_html += '<br />';
		
		this.task_info_div.innerHTML = new_html;
		
		//refresh the timer
		this.Refresh_Timer_Display();
					
	};
	
	this.Render_Timecard_Task_Entry_Form = function(form_div_id) {
		
		var self = this;
		
		//create the top form
		this.data_form_timecard_entry = document.createElement("form");
		this.data_form_timecard_entry.setAttribute('method',"post");
		this.data_form_timecard_entry.setAttribute('id',"timecard_task_entry_form");
	
		this.data_form_timecard_entry.innerHTML += 'Tasks:<br />';
		
		//task name select dropdown
		this.task_name_select = document.createElement("select");
		this.task_name_select.setAttribute('name',"task_name_to_enter");
		this.task_name_select.setAttribute('id',"task_name_to_enter");
		this.task_name_select.innerHTML = '<option>-</option>';
		$(this.task_name_select).change(function() {
			
			//call the change event function
			self.On_Task_Name_Select_Change_Event();
			
		});
		this.data_form_timecard_entry.appendChild(this.task_name_select);
		
		this.task_timecard_note_div = document.createElement("div");
		this.task_timecard_note_div.setAttribute('id','task_timecard_note_div');
		this.task_timecard_note_div.innerHTML = 'Note:<br />';
		this.task_timecard_note = document.createElement("input");
		this.task_timecard_note.setAttribute('id','task_timecard_note');
		this.task_timecard_note_div.appendChild(this.task_timecard_note);
		this.data_form_timecard_entry.appendChild(this.task_timecard_note_div);
		
		//info div creation
		this.task_info_div = document.createElement("div");
		this.task_info_div.setAttribute('id','task_info_div');
		this.task_info_div.innerHTML = 'Info:<br /><br />';
		this.data_form_timecard_entry.appendChild(this.task_info_div);
		
		this.task_timer_div = document.createElement("div");
		this.data_form_timecard_entry.appendChild(this.task_timer_div);
		
		//task start/stop button creation
		this.task_start_stop_button = document.createElement("input");
		this.task_start_stop_button.setAttribute('id','task_entry_start_stop');
		this.task_start_stop_button.setAttribute('type','submit');
		this.task_start_stop_button.value = 'Start';
		
		$(this.task_start_stop_button).button();
		$(this.task_start_stop_button).click(function( event ) {
			
			//ensure a normal postback does not occur
			event.preventDefault();
			
			//execute the click event
			self.On_Start_Stop_Click_Event();
		});
		this.data_form_timecard_entry.appendChild(this.task_start_stop_button);
		
		this.test_div = document.createElement("div");
		this.test_div.innerHTML = '<br />';
		this.data_form_timecard_entry.appendChild(this.test_div);

		//task mark complete button creation
		this.task_start_complete_button = document.createElement("input");
		this.task_start_complete_button.setAttribute('id','task_entry_complete');
		this.task_start_complete_button.setAttribute('type','submit');
		this.task_start_complete_button.value = 'Mark Complete';
		
		$(this.task_start_complete_button).button();
		$(this.task_start_complete_button).click(function( event ) {
			
			//ensure a normal postback does not occur
			event.preventDefault();
			
			//execute the click event
			self.On_Complete_Click_Event();
		});
		this.data_form_timecard_entry.appendChild(this.task_start_complete_button);
		
		
		this.loading_image_new = document.createElement("img");
		this.loading_image_new.setAttribute('id','task_tab_new_entry_loader_image');
		this.loading_image_new.setAttribute('style','width:100%;height:19px;');
		this.loading_image_new.setAttribute('src','ajax-loader.gif');
		this.data_form_timecard_entry.appendChild(this.loading_image_new);
		
		var div_tab = document.getElementById(form_div_id);

		div_tab.appendChild(this.data_form_timecard_entry);
		
		$('#' + self.loading_image_new.id).hide();
		$('#' + self.task_timecard_note_div.id).hide();
		
		//this is used to update the timer value on running tasks
		window.setInterval(function()
		{
			
			self.Refresh_Timer_Display();
			
		}, 
		1000);
	};
	
	
	this.Render_New_Task_Entry_Form = function(form_div_id) {
		
		var self = this;
		
		//create the top form
		this.data_form_new_entry = document.createElement("form");
		this.data_form_new_entry.setAttribute('method',"post");
		this.data_form_new_entry.setAttribute('id',"add_task_entry_form");
	
		this.data_form_new_entry.innerHTML += 'Tasks:<br />';
		
		//task name select dropdown
		this.add_task_entry_task_name_select = document.createElement("select");
		this.add_task_entry_task_name_select.setAttribute('name',"add_task_entry_name_to_enter");
		this.add_task_entry_task_name_select.setAttribute('id',"add_task_entry_name_to_enter");
		this.add_task_entry_task_name_select.innerHTML = '<option>-</option>';
		$(this.add_task_entry_task_name_select).change(function() {
			
			//call the change event function
			//self.On_Task_Name_Select_Change_Event();
			
		});
		this.data_form_new_entry.appendChild(this.add_task_entry_task_name_select);
		
		this.data_form_new_entry.innerHTML += 'Start Time:<br />';
		
		this.task_entry_start_time = document.createElement("input");
		this.task_entry_start_time.setAttribute('name','task_entry_start_time');
		this.task_entry_start_time.setAttribute('id','task_entry_start_time');
		this.task_entry_start_time.setAttribute('type','text');
		this.data_form_new_entry.appendChild(this.task_entry_start_time);
		
		this.data_form_new_entry.innerHTML += 'Duration:<br />';
		
		this.task_entry_duration = document.createElement("input");
		this.task_entry_duration.setAttribute('name','task_entry_duration');
		this.task_entry_duration.setAttribute('id','task_entry_duration');
		this.task_entry_duration.setAttribute('type','text');
		this.task_entry_duration.setAttribute('value','0');
		this.data_form_new_entry.appendChild(this.task_entry_duration);
		
		this.data_form_new_entry.innerHTML += 'Note:<br />';
		
		this.task_entry_note = document.createElement("input");
		this.task_entry_note.setAttribute('name','task_entry_note');
		this.task_entry_note.setAttribute('id','task_entry_note');
		this.task_entry_note.setAttribute('type','text');
		this.data_form_new_entry.appendChild(this.task_entry_note);
		
		this.data_form_new_entry.innerHTML += '<br /><br />';
		
		//task submit button creation
		this.add_task_entry_task_submit_button = document.createElement("input");
		this.add_task_entry_task_submit_button.setAttribute('id','new_task_entry_submit');
		this.add_task_entry_task_submit_button.setAttribute('type','submit');
		this.add_task_entry_task_submit_button.value = 'Submit';
		this.data_form_new_entry.appendChild(this.add_task_entry_task_submit_button);
		
		this.data_form_new_entry.innerHTML += '<br /><br />';
		
		//task mark complete button creation
		this.add_task_entry_task_complete_button = document.createElement("input");
		this.add_task_entry_task_complete_button.setAttribute('id','new_task_entry_complete');
		this.add_task_entry_task_complete_button.setAttribute('type','submit');
		this.add_task_entry_task_complete_button.value = 'Mark Complete';
		this.data_form_new_entry.appendChild(this.add_task_entry_task_complete_button);
		
		this.add_task_entry_loading_image_new = document.createElement("img");
		this.add_task_entry_loading_image_new.setAttribute('id','add_task_entry_tab_new_entry_loader_image');
		this.add_task_entry_loading_image_new.setAttribute('style','width:100%;height:19px;');
		this.add_task_entry_loading_image_new.setAttribute('src','ajax-loader.gif');
		this.data_form_new_entry.appendChild(this.add_task_entry_loading_image_new);

		
		var div_tab = document.getElementById(form_div_id);

		div_tab.appendChild(this.data_form_new_entry);
		
		$('#' + this.add_task_entry_task_submit_button.id).button();
		$('#' + this.add_task_entry_task_submit_button.id).click(function( event ) {
			
			//ensure a normal postback does not occur
			event.preventDefault();
			
			//execute the click event
			self.Insert_Task_Entry(false);
		});
		
		
		$('#' + this.add_task_entry_task_complete_button.id).button();
		$('#' + this.add_task_entry_task_complete_button.id).click(function( event ) {
			
			//ensure a normal postback does not occur
			event.preventDefault();
			
			
			//execute the click event
			self.Insert_Task_Entry(true);
		});
		
		
		$('#' + self.add_task_entry_loading_image_new.id).hide();
		
		$('#' + this.task_entry_start_time.id).datetimepicker({
			timeFormat: "HH:mm",
			dateFormat: 'yy-mm-dd'
		});
		$('#' + this.task_entry_start_time.id).datetimepicker("setDate", new Date());
		
	};
	
	//render function (div must already exist)
	this.Render_View_Tasks_Form = function(form_div_id) {
	
		var return_html = '';
		
		this.data_form_view_tasks = document.createElement("form");
		this.data_form_view_tasks.setAttribute('method',"post");
		this.data_form_view_tasks.setAttribute('id',"data_display_form");
		
		this.button = document.createElement("input");
		this.button.setAttribute('type','submit');
		this.button.setAttribute('id','data_submit_button');
		this.button.value = 'Refresh';
		
		var self = this;
		$(this.button).button();
		$(this.button).click(function( event ) {
			
			//ensure a normal postback does not occur
			event.preventDefault();
			
			//execute the click event
			self.On_View_Task_Refresh_Click_Event();
		});
		
		this.data_form_view_tasks.appendChild(this.button);
		
		this.loading_image_view = document.createElement("img");
		this.loading_image_view.setAttribute('id','task_tab_task_view_loader_image');
		this.loading_image_view.setAttribute('style','width:100%;height:19px;');
		this.loading_image_view.setAttribute('src','ajax-loader.gif');
		this.data_form_view_tasks.appendChild(this.loading_image_view);

		this.new_data_display_div = document.createElement("div");
		this.data_form_view_tasks.appendChild(this.new_data_display_div);
		
		
		var div_tab = document.getElementById(form_div_id);
		
		div_tab.innerHTML = '';
			
		div_tab.appendChild(this.data_form_view_tasks);

	};
	
	this.Render_New_Task_Form = function (form_div_id) {
		
		//create the top form
		this.data_form_new_task = document.createElement("form");
		this.data_form_new_task.setAttribute('method',"post");
		this.data_form_new_task.setAttribute('id',"new_task_form");
		
		this.data_form_new_task.innerHTML += '<b>General</b><br />';
		
		this.data_form_new_task.innerHTML += 'Name:<br />';
		
		//task name creation
		this.task_name = document.createElement("input");
		this.task_name.setAttribute('name','task_name');
		this.task_name.setAttribute('id','task_name');
		this.task_name.setAttribute('type','text');
		this.data_form_new_task.appendChild(this.task_name);
		
		this.data_form_new_task.innerHTML += 'Description:<br />';
		
		//task description creation
		this.task_description = document.createElement("input");
		this.task_description.setAttribute('name','task_description');
		this.task_description.setAttribute('id','task_description');
		this.task_description.setAttribute('type','text');
		this.data_form_new_task.appendChild(this.task_description);
		
		this.data_form_new_task.innerHTML += 'Estimated Time (Hours):<br />';
		
		//task estimate creation
		this.task_estimate = document.createElement("input");
		this.task_estimate.setAttribute('name','task_estimated_time');
		this.task_estimate.setAttribute('id','task_estimated_time');
		this.task_estimate.setAttribute('type','text');
		this.task_estimate.setAttribute('value','0');
		this.data_form_new_task.appendChild(this.task_estimate);
		
		this.data_form_new_task.innerHTML += 'Status:<br />';
		
		//task recurring
		this.task_status_select = document.createElement("select");
		this.task_status_select.setAttribute('id','task_status_select');
		this.task_status_select.innerHTML = '<option>Stopped</option><option>Started</option>';
		this.data_form_new_task.appendChild(this.task_status_select);
		
		this.data_form_new_task.innerHTML += 'Note:<br />';
		
		//task note creation
		this.task_note = document.createElement("input");
		this.task_note.setAttribute('name','task_note');
		this.task_note.setAttribute('id','task_note');
		this.task_note.setAttribute('type','text');
		this.data_form_new_task.appendChild(this.task_note);
		
		this.data_form_new_task.innerHTML += '<br /><br />';
		this.data_form_new_task.innerHTML += '<b>Schedule</b><br />';
		
		this.data_form_new_task.innerHTML += 'Scheduled/Floating:<br />';
		
		//task recurring
		this.task_scheduled_select = document.createElement("select");
		this.task_scheduled_select.setAttribute('id','task_scheduled_select');
		this.task_scheduled_select.innerHTML = '<option>Floating</option><option>Scheduled</option>';
		this.data_form_new_task.appendChild(this.task_scheduled_select);
		
		this.data_form_new_task.innerHTML += 'Scheduled Date:<br />';
		
		//task estimate creation
		this.task_scheduled_date = document.createElement("input");
		this.task_scheduled_date.setAttribute('id','task_scheduled_date');
		this.task_scheduled_date.setAttribute('type','text');
		this.data_form_new_task.appendChild(this.task_scheduled_date);
		
		this.data_form_new_task.innerHTML += '<br /><br />';
		this.data_form_new_task.innerHTML += '<b>Reccurances</b><br />';
		
		this.data_form_new_task.innerHTML += 'Recurring:<br />';
		
		
		//task recurring
		this.task_recurring_select = document.createElement("select");
		this.task_recurring_select.setAttribute('id','task_recurring_select');
		this.task_recurring_select.innerHTML = '<option>False</option><option>True</option>';
		this.data_form_new_task.appendChild(this.task_recurring_select);
		
		this.data_form_new_task.innerHTML += 'Recurrance Period (Hours):<br />';
		
		//task estimate creation
		this.task_reccurance_period = document.createElement("input");
		this.task_reccurance_period.setAttribute('id','task_reccurance_period');
		this.task_reccurance_period.setAttribute('type','text');
		this.task_reccurance_period.setAttribute('value','0');
		this.data_form_new_task.appendChild(this.task_reccurance_period);
		
		this.data_form_new_task.innerHTML += '<br /><br />';
		
		//task submit creation
		this.task_submit_button = document.createElement("input");
		this.task_submit_button.setAttribute('name','task_submit');
		this.task_submit_button.setAttribute('type','submit');
		var self = this;
		$(this.task_submit_button).button();
		$(this.task_submit_button).click(function( event ) {
			
			//ensure a normal postback does not occur
			event.preventDefault();
			
			//execute the click event
			self.On_Add_Task_Click_Event();
		});
		this.data_form_new_task.appendChild(this.task_submit_button);
		
		this.loading_image_add = document.createElement("img");
		this.loading_image_add.setAttribute('id','task_tab_add_task_loader_image');
		this.loading_image_add.setAttribute('style','width:100%;height:19px;');
		this.loading_image_add.setAttribute('src','ajax-loader.gif');
		this.data_form_new_task.appendChild(this.loading_image_add);
		
		var div_tab = document.getElementById(form_div_id);

		div_tab.appendChild(this.data_form_new_task);
		
		$('#' + self.loading_image_add.id).hide();
		
		$('#' + self.task_scheduled_date.id).datetimepicker({
			timeFormat: "HH:mm",
			dateFormat: 'yy-mm-dd'
		});
		var date_to_set = new Date();
		$('#' + self.task_scheduled_date.id).datetimepicker("setDate", date_to_set);
		
	};
	
	this.Render_View_Task_Log_Form = function(form_div_id)
	{
		var self = this;
		var return_html = '';
		
		this.data_form = document.createElement("form");
		this.data_form.setAttribute('method',"post");
		this.data_form.setAttribute('id',"task_log_display_form");
		
		this.task_log_submit_button = document.createElement("input");
		this.task_log_submit_button.setAttribute('type','submit');
		this.task_log_submit_button.setAttribute('id','task_log_submit_button');
		this.task_log_submit_button.value = 'Refresh';
		
		this.data_form.appendChild(this.task_log_submit_button);
		
		this.task_log_loading_image = document.createElement("img");
		this.task_log_loading_image.setAttribute('id','task_log_loader_image');
		this.task_log_loading_image.setAttribute('style','width:100%;height:19px;');
		this.task_log_loading_image.setAttribute('src','ajax-loader.gif');
		this.data_form.appendChild(this.task_log_loading_image);

		this.new_log_data_display_div = document.createElement("div");
		this.new_log_data_display_div.setAttribute('id','new_task_log_data_display_div');
		this.data_form.appendChild(this.new_log_data_display_div);
		
		var div_tab = document.getElementById(form_div_id);
		
		div_tab.innerHTML = '';
			
		div_tab.appendChild(this.data_form);
		
		$(this.task_log_submit_button).button();
		$(this.task_log_submit_button).click(function( event ) {
			
			//ensure a normal postback does not occur
			event.preventDefault();
			
			//execute the click event
			self.On_Click_Event();
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
		new_tab.push("New Task");
		new_tab.push('<div id="add_task_div"></div>');
		tabs_array.push(new_tab);
		
		new_tab = new Array();
		new_tab.push("Edit Task");
		new_tab.push("Under construction...");
		tabs_array.push(new_tab);
		
		new_tab = new Array();
		new_tab.push("View Tasks");
		new_tab.push('<div id="view_tasks_div"></div>');
		tabs_array.push(new_tab);
		
		new_tab = new Array();
		new_tab.push("View Task Log");
		new_tab.push('<div id="view_task_log_div"></div>');
		tabs_array.push(new_tab);
		
		var return_html = '';
		
		return_html += '<div id="tasks_accordian"></div>';
		
		var div_tab = document.getElementById(this.div_id);
		div_tab.innerHTML = return_html;
		
		//render the accordian
		var task_accordian = new Accordian('tasks_accordian',tabs_array);
		task_accordian.Render();
		
		//now render all accordian tabs
		this.Render_Timecard_Task_Entry_Form('timecard_task_entry_div');
		
		this.Render_New_Task_Entry_Form('new_task_entry_div');
		
		this.Render_New_Task_Form('add_task_div');
		
		this.Render_View_Tasks_Form('view_tasks_div');
		
		this.Render_View_Task_Log_Form('view_task_log_div');
		
	};
}




