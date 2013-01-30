function Task_Tab (task_div_id) {

	//class variables
	this.div_id = task_div_id;
	this.data_form_new_entry;
	this.data_form_view_tasks;
	this.data_form_new_task;
	this.task_name_select;
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
		rpc.Data_Interface.Get_Task_Names(params,function(jsonRpcObj){
			
			if(jsonRpcObj.result.authenticated == 'true')
			{
				if(jsonRpcObj.result.success == 'true')
				{
					var new_inner_html = '';
					
					new_inner_html += '<option>-</option>';
					
					for (var i = 0; i < jsonRpcObj.result.items.length; i++)
					{
						new_inner_html += '<option>' + jsonRpcObj.result.items[i] + '</option>';
					}
					
					document.getElementById(self.task_name_select.id).innerHTML = new_inner_html;
					
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
			
			refresh_callback();
		});
	};
	
	this.On_Complete_Click_Event = function() 
	{
		alert('Task completed!');
		
		//NOT IMPLEMENTED
	};
	
	this.On_Start_Stop_Click_Event = function()
	{
		
		var params = new Array();
		params[0] = $('#' + this.task_name_select.id).val();
		params[1] = this.task_start_stop_button.value;
		
		var self = this;
		
		//show the loader image
		$('#' + self.loading_image_new.id).show();
		
		//execute the RPC callback for retrieving the item log
		rpc.Data_Interface.Task_Start_Stop(params,function(jsonRpcObj){
			
			if(jsonRpcObj.result.success == 'true')
			{
			
				if(self.task_start_stop_button.value == 'Start')
				{
					self.current_task_start_time = new Date();
					self.Refresh_Timer_Display();
					
					self.task_start_stop_button.value = 'Stop';
				}
				else
				{
					self.task_start_stop_button.value = 'Start';
				}
			
				
			}
			else
			{
				alert('Task failed to start/stop.');
			}
			
			
			//hide the loader image
			$('#' + self.loading_image_new.id).hide();
		
		});
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
		alert('Handler for task name select change called.');
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
	
	this.Render_New_Task_Entry_Form = function(form_div_id) {
		
		var self = this;
		
		//create the top form
		this.data_form_new_entry = document.createElement("form");
		this.data_form_new_entry.setAttribute('method',"post");
		this.data_form_new_entry.setAttribute('id',"add_task_entry_form");
	
		this.data_form_new_entry.innerHTML += 'Tasks:<br />';
		
		//task name select dropdown
		this.task_name_select = document.createElement("select");
		this.task_name_select.setAttribute('name',"task_name_to_enter");
		this.task_name_select.setAttribute('id',"task_name_to_enter");
		$(this.task_name_select).change(function() {
			
			//call the change event function
			self.On_Task_Name_Select_Change_Event();
			
		});
		this.data_form_new_entry.appendChild(this.task_name_select);
		
		//info div creation
		this.task_info_div = document.createElement("div");
		this.task_info_div.innerHTML = 'Info:<br /><br />';
		this.data_form_new_entry.appendChild(this.task_info_div);
		
		this.task_timer_div = document.createElement("div");
		this.data_form_new_entry.appendChild(this.task_timer_div);
		
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
		this.data_form_new_entry.appendChild(this.task_start_stop_button);
		
		this.loading_image_new = document.createElement("img");
		this.loading_image_new.setAttribute('id','task_tab_new_entry_loader_image');
		this.loading_image_new.setAttribute('style','width:100%;height:19px;');
		this.loading_image_new.setAttribute('src','ajax-loader.gif');
		this.data_form_new_entry.appendChild(this.loading_image_new);
		
		var div_tab = document.getElementById(form_div_id);

		div_tab.appendChild(this.data_form_new_entry);
		
		$('#' + self.loading_image_new.id).hide();
		
		//this is used to update the timer value on running tasks
		window.setInterval(function()
		{
			
			self.Refresh_Timer_Display();
			
		}, 
		1000);
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
		
		this.data_form_new_task.innerHTML += 'Estimated Time:<br />';
		
		//task estimate creation
		this.task_estimate = document.createElement("input");
		this.task_estimate.setAttribute('name','task_estimated_time');
		this.task_estimate.setAttribute('id','task_estimated_time');
		this.task_estimate.setAttribute('type','text');
		this.data_form_new_task.appendChild(this.task_estimate);
		
		this.data_form_new_task.innerHTML += 'Note:<br />';
		
		//task note creation
		this.task_note = document.createElement("input");
		this.task_note.setAttribute('name','task_note');
		this.task_note.setAttribute('id','task_note');
		this.task_note.setAttribute('type','text');
		this.data_form_new_task.appendChild(this.task_note);
		
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
		
	};
	
	//render function (div must already exist)
	this.Render = function() {
		
		var tabs_array = new Array();
		
		tabs_array[0] = new Array();
		tabs_array[0][0] = "Timecard Task Entry";
		tabs_array[0][1] = '<div id="new_task_entry_div"></div>';
		
		tabs_array[1] = new Array();
		tabs_array[1][0] = "New Task Entry";
		tabs_array[1][1] = 'Under construction...';
		
		tabs_array[2] = new Array();
		tabs_array[2][0] = "View Tasks";
		tabs_array[2][1] = '<div id="view_tasks_div"></div>';
		
		tabs_array[3] = new Array();
		tabs_array[3][0] = "New Task";
		tabs_array[3][1] = '<div id="add_task_div"></div>';
		
		tabs_array[4] = new Array();
		tabs_array[4][0] = "Edit Task";
		tabs_array[4][1] = "Under construction...";
		
		var return_html = '';
		
		return_html += '<div id="tasks_accordian"></div>';
		
		var div_tab = document.getElementById(this.div_id);
		div_tab.innerHTML = return_html;
		
		//render the accordian
		var task_accordian = new Accordian('tasks_accordian',tabs_array);
		task_accordian.Render();
		
		//now render all accordian tabs
		this.Render_New_Task_Entry_Form('new_task_entry_div');
		
		this.Render_New_Task_Form('add_task_div');
		
		this.Render_View_Tasks_Form('view_tasks_div');
		
	};
}




