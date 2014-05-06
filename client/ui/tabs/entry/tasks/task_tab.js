define([
        'jquery.ui',
        './forms/timecard_task_entry_form',
        './forms/new_task_entry_form',
        './forms/edit_task_entry_form',
        './forms/new_task_form',
        './forms/edit_task_form',
        './forms/new_task_target_form',
        './forms/edit_task_target_form',
        '../../../../../core/logger.js',
        ],function($,timecard_task_entry_form,new_task_entry_form,edit_task_entry_form,new_task_form,edit_task_form,new_task_target_form,edit_task_target_form,logger){
	
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
		this.timecard_task_entry_form = new timecard_task_entry_form.Timecard_Task_Entry_Form();
		
		/** This is the new task entry form.
		 * @type New_Task_Entry_Form
		 * */
		this.new_task_entry_form = new new_task_entry_form.New_Task_Entry_Form();
		
		/** This is the edit task entry form.
		 * @type Edit_Task_Entry_Form
		 * */
		this.edit_task_entry_form = new edit_task_entry_form.Edit_Task_Entry_Form();
		
		/** This is the new task form.
		 * @type New_Task_Form
		 * */
		this.new_task_form = new new_task_form.New_Task_Form();
		
		/** This is the edit task form.
		 * @type Edit_Task_Form
		 * */
		this.edit_task_form = new edit_task_form.Edit_Task_Form();
		
		/** This is the new task target form.
		 * @type View_Tasks_Form
		 * */
		this.new_task_target_form = new new_task_target_form.New_Task_Target_Form();
		
		/** This is the edit task target form.
		 * @type Edit_Task_Target_Form
		 * */
		this.edit_task_target_form = new edit_task_target_form.Edit_Task_Target_Form();
		
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
			
			var times = [];
			var start = new Date();
			
			this.timecard_task_entry_form.Refresh(data);

			var end = new Date();
			times.push('timecard_task_entry_form: ' + (end - start) / 1000);
			var start = new Date();
			
			this.new_task_entry_form.Refresh(data);

			var end = new Date();
			times.push('new_task_entry_form: ' + (end - start) / 1000);
			var start = new Date();
			
			this.edit_task_entry_form.Refresh(data);

			var end = new Date();
			times.push('edit_task_entry_form: ' + (end - start) / 1000);
			var start = new Date();
			
			this.new_task_form.Refresh(data);

			var end = new Date();
			times.push('new_task_form: ' + (end - start) / 1000);
			var start = new Date();
			
			this.edit_task_form.Refresh(data);

			var end = new Date();
			times.push('edit_task_form: ' + (end - start) / 1000);
			var start = new Date();
			
			this.new_task_target_form.Refresh(data);

			var end = new Date();
			times.push('new_task_target_form: ' + (end - start) / 1000);
			var start = new Date();
			
			this.edit_task_target_form.Refresh(data);

			var end = new Date();
			times.push('edit_task_target_form: ' + (end - start) / 1000);
			
			logger.Info('Task_Tab Refresh: ' + JSON.stringify(times));
		};
		
		this.Refresh_From_Diff = function(diff, data)
		{
			
			var self = this;
			
			//ensure the task info array is saved
			self.task_info_json_array = data.tasks;
			
			var times = [];
			var start = new Date();
			
			this.timecard_task_entry_form.Refresh_From_Diff(diff, data);
			
			var end = new Date();
			times.push('timecard_task_entry_form: ' + (end - start) / 1000);
			var start = new Date();
			
			this.new_task_entry_form.Refresh_From_Diff(diff, data);
			
			var end = new Date();
			times.push('new_task_entry_form: ' + (end - start) / 1000);
			var start = new Date();
			
			this.edit_task_entry_form.Refresh_From_Diff(diff, data);

			var end = new Date();
			times.push('edit_task_entry_form: ' + (end - start) / 1000);
			var start = new Date();
			
			this.new_task_form.Refresh_From_Diff(diff, data);

			var end = new Date();
			times.push('new_task_form: ' + (end - start) / 1000);
			var start = new Date();
			
			this.edit_task_form.Refresh_From_Diff(diff, data);

			var end = new Date();
			times.push('edit_task_form: ' + (end - start) / 1000);
			var start = new Date();
			
			this.new_task_target_form.Refresh_From_Diff(diff, data);

			var end = new Date();
			times.push('new_task_target_form: ' + (end - start) / 1000);
			var start = new Date();
			
			this.edit_task_target_form.Refresh_From_Diff(diff, data);

			var end = new Date();
			times.push('edit_task_target_form: ' + (end - start) / 1000);
			
			logger.Info('Task_Tab Diff: ' + JSON.stringify(times));
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
				'add_task_div',
				'edit_tasks_div',
				'new_target_task_entry_div',
				'edit_target_task_entry_div',
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

			this.new_task_form.Render('add_task_div');

			this.edit_task_form.Render('edit_tasks_div');

			this.new_task_target_form.Render('new_target_task_entry_div');
			
			this.edit_task_target_form.Render('edit_target_task_entry_div');
			
			for(var i = 0; i < this.div_ids.length; i++)
			{
				$('#'+this.div_ids[i]).hide();
			}
			
		};
	}
	
	function Build_Task_Tab()
	{
		//TODO: implement
		
		var built_task_tab = new Task_Tab();
		
		return built_task_tab;
	}
	
	return {
		Build_Task_Tab: Build_Task_Tab,
		Task_Tab: Task_Tab,
	};
});

