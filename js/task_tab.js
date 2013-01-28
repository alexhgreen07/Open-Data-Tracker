function Task_Tab (task_div_id) {

	//class variables
	this.div_id = task_div_id;
	this.data_form;
	this.task_name_select;
	this.task_info_div;
	this.task_start_stop_button;
	
	this.On_Complete_Click_Event = function() 
	{
		alert('Task completed!');
		
		//NOT IMPLEMENTED
	};
	
	this.On_Start_Stop_Click_Event = function()
	{
		alert('Task submitted!');
		
		if(this.task_start_stop_button.value == "Start")
		{
			this.task_start_stop_button.value = "Stop";
		}
		else
		{
			this.task_start_stop_button.value = "Start";
		}
		
		//NOT IMPLEMENTED
	};
	
	this.On_Add_Task_Click_Event = function()
	{
		alert('New task added!');
		
		//NOT IMPLEMENTED
	};
	
	this.Render_New_Task_Entry_Form = function(form_div_id) {
		
		//create the top form
		this.data_form = document.createElement("form");
		this.data_form.setAttribute('method',"post");
		this.data_form.setAttribute('id',"add_task_entry_form");
	
		this.data_form.innerHTML += 'Tasks:<br />';
		
		//task name select dropdown
		this.task_name_select = document.createElement("select");
		this.task_name_select.setAttribute('name',"task_name_to_enter");
		this.task_name_select.setAttribute('id',"task_name_to_enter");
		this.data_form.appendChild(this.task_name_select);
		
		//info div creation
		this.task_info_div = document.createElement("div");
		this.task_info_div.innerHTML = 'Info:<br /><br />';
		this.data_form.appendChild(this.task_info_div);
		
		//task start/stop button creation
		this.task_start_stop_button = document.createElement("input");
		this.task_start_stop_button.setAttribute('id','task_entry_start_stop');
		this.task_start_stop_button.setAttribute('type','submit');
		this.task_start_stop_button.value = 'Start';
		var self = this;
		$(this.task_start_stop_button).button();
		$(this.task_start_stop_button).click(function( event ) {
			
			//ensure a normal postback does not occur
			event.preventDefault();
			
			//execute the click event
			self.On_Start_Stop_Click_Event();
		});
		this.data_form.appendChild(this.task_start_stop_button);
		
		
		var div_tab = document.getElementById(form_div_id);

		div_tab.appendChild(this.data_form);
		
	
	};
	
	this.Render_New_Task_Form = function (form_div_id) {
		
		//create the top form
		this.data_form = document.createElement("form");
		this.data_form.setAttribute('method',"post");
		this.data_form.setAttribute('id',"new_task_form");
		
		this.data_form.innerHTML += 'Name:<br />';
		
		//task name creation
		this.task_name = document.createElement("input");
		this.task_name.setAttribute('name','task_name');
		this.task_name.setAttribute('type','text');
		this.data_form.appendChild(this.task_name);
		
		this.data_form.innerHTML += 'Description:<br />';
		
		//task description creation
		this.task_description = document.createElement("input");
		this.task_description.setAttribute('name','task_description');
		this.task_description.setAttribute('type','text');
		this.data_form.appendChild(this.task_description);
		
		this.data_form.innerHTML += 'Estimated Time:<br />';
		
		//task estimate creation
		this.task_estimate = document.createElement("input");
		this.task_estimate.setAttribute('name','task_estimated_time');
		this.task_estimate.setAttribute('type','text');
		this.data_form.appendChild(this.task_estimate);
		
		this.data_form.innerHTML += 'Note:<br />';
		
		//task note creation
		this.task_note = document.createElement("input");
		this.task_note.setAttribute('name','task_note');
		this.task_note.setAttribute('type','text');
		this.data_form.appendChild(this.task_note);
		
		this.data_form.innerHTML += '<br /><br />';
		
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
		this.data_form.appendChild(this.task_submit_button);
		
		
		var div_tab = document.getElementById(form_div_id);

		div_tab.appendChild(this.data_form);
		
		
	};
	
	//render function (div must already exist)
	this.Render = function() {
		
		var tabs_array = new Array();
		
		tabs_array[0] = new Array();
		tabs_array[0][0] = "New Task Entry";
		tabs_array[0][1] = '<div id="new_task_entry_div"></div>';
		
		tabs_array[1] = new Array();
		tabs_array[1][0] = "View Tasks";
		tabs_array[1][1] = "Under construction...";
		
		tabs_array[2] = new Array();
		tabs_array[2][0] = "New Task";
		tabs_array[2][1] = '<div id="add_task_div"></div>';
		
		tabs_array[3] = new Array();
		tabs_array[3][0] = "Edit Task";
		tabs_array[3][1] = "Under construction...";
		
		var return_html = '';
		
		return_html += '<div id="tasks_accordian"></div>';
		
		var div_tab = document.getElementById(this.div_id);
		div_tab.innerHTML = return_html;
		
		//render the accordian
		var task_accordian = new Accordian('tasks_accordian',tabs_array);
		task_accordian.Render();
		
		//now render all accordian tabs
		this.Render_New_Task_Entry_Form('new_task_entry_div');
		
		this.Render_New_Task_Form('add_task_div')
		
	};
}




