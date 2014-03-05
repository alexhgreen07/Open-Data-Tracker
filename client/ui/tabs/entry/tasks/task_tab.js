/** This is the task tab object which holds all UI objects for task data interaction.
 * @constructor Task_Tab
 */
function Task_Tab() {

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
	
	/** This is the view task targets form.
	 * @type Edit_Task_Target_Form
	 * */
	this.view_task_targets_form = new View_Task_Targets_Form();
	
	/** This is the callback function for the refresh event of the task log.
	 * @type function
	 * */
	this.refresh_task_log_callback = function(){};
	
	/** @method Refresh_Task_Name_List
	 * @desc This function refreshes the valid start/stop task name list from the server.
	 * @param {function} refresh_callback The callback to call after the refresh of data has completed.
	 * */
	this.Refresh = function(data) {
		
		var self = this;
		
		//ensure the task info array is saved
		self.task_info_json_array = data.tasks;

		this.timecard_task_entry_form.Refresh(data);
		this.new_task_entry_form.Refresh(data);
		this.edit_task_entry_form.Refresh(data);
		this.new_task_form.Refresh(data);
		this.edit_task_form.Refresh(data);
		this.new_task_target_form.Refresh(data);
		this.edit_task_target_form.Refresh(data);
		
	};
	
	this.Refresh_From_Diff = function(diff, data)
	{
		
		var self = this;
		
		//ensure the task info array is saved
		self.task_info_json_array = data.tasks;
		
		this.timecard_task_entry_form.Refresh_From_Diff(diff, data);
		this.new_task_entry_form.Refresh_From_Diff(diff, data);
		this.edit_task_entry_form.Refresh_From_Diff(diff, data);
		/*
		this.new_task_form.Refresh_From_Diff(diff, data);
		this.edit_task_form.Refresh_From_Diff(diff, data);
		this.new_task_target_form.Refresh_From_Diff(diff, data);
		this.edit_task_target_form.Refresh_From_Diff(diff, data);
		*/
	};
	
	this.Show_Form = function(div_id){
		
		for(var i = 0; i < this.div_ids.length; i++)
		{
			if(div_id == this.div_ids[i])
			{
				$('#'+this.div_ids[i]).fadeIn();
			}
			else
			{
				$('#'+this.div_ids[i]).hide();
			}
			
		}
		
	};

	/** @method Render
	 * @desc This function renders the tab in the div the object was initialized with.
	 * @param {String} form_div_id The div ID to render the form in. 
	 * */
	this.Render = function(task_div_id) {
		
		this.div_ids = [
			'timecard_task_entry_div',
			'new_task_entry_div',
			'edit_task_entry_div',
			'view_task_log_div',
			'add_task_div',
			'edit_tasks_div',
			'view_tasks_div',
			'new_target_task_entry_div',
			'edit_target_task_entry_div',
			'view_target_task_entry_div',
		];
		
		var return_html = '';
		
		for(var i = 0; i < this.div_ids.length; i++)
		{
			return_html += '<div id="'+this.div_ids[i]+'"></div>';
		}

		var div_tab = document.getElementById(task_div_id);
		div_tab.innerHTML = return_html;

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
		
		this.view_task_targets_form.Render('view_target_task_entry_div');
		
		for(var i = 0; i < this.div_ids.length; i++)
		{
			$('#'+this.div_ids[i]).hide();
		}
		
	};
}

