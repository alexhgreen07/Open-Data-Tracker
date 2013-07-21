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

//get the view task entries form
require_once(dirname(__FILE__).'/forms/view_task_entries_form.js.php');

//get the new task form
require_once(dirname(__FILE__).'/forms/new_task_form.js.php');

//get the edit task form
require_once(dirname(__FILE__).'/forms/edit_task_form.js.php');

//get the view tasks form
require_once(dirname(__FILE__).'/forms/view_tasks_form.js.php');

//get the view tasks form
require_once(dirname(__FILE__).'/forms/new_task_target_form.js.php');

//get the view tasks form
require_once(dirname(__FILE__).'/forms/edit_task_target_form.js.php');


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
	
	/** This is the view tasks form.
	 * @type View_Tasks_Form
	 * */
	this.view_tasks_form = new View_Tasks_Form();
	
	/** This is the new task target form.
	 * @type View_Tasks_Form
	 * */
	this.new_task_target_form = new New_Task_Target_Form();
	
	/** This is the edit task target form.
	 * @type Edit_Task_Target_Form
	 * */
	this.edit_task_target_form = new Edit_Task_Target_Form();
	
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
	
	/** @method Task_Target_View_Refresh_Click
	 * @desc This is the task target view refresh submit click button.
	 * */
	this.Task_Target_View_Refresh_Click = function()
	{
		
		this.Refresh_Task_Target_Data(function(){
			
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

		this.view_tasks_form.Render('view_tasks_div');

		this.new_task_target_form.Render('new_target_task_entry_div');
		
		this.edit_task_target_form.Render('edit_target_task_entry_div');
		
		this.Render_View_Task_Target_Form('view_target_task_entry_div');
		
	};
}

