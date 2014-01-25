/** This is the task tab object which holds all UI objects for task data interaction.
 * @constructor Task_Tab
 */
function Entry_Tab() {

	/** This is the parent div ID where the task tab is.
	 * @type String
	 * */
	this.div_id = null;
	
	/** This is the callback function for the refresh event of the task log.
	 * @type function
	 * */
	this.refresh_task_log_callback = function(){};
	
	/** @method Refresh_Task_Name_List
	 * @desc This function refreshes the valid start/stop task name list from the server.
	 * @param {function} refresh_callback The callback to call after the refresh of data has completed.
	 * */
	this.Refresh = function(data) {
		
		this.tree_view.Refresh(data);
		
	};

	/** @method Render
	 * @desc This function renders the tab in the div the object was initialized with.
	 * @param {String} form_div_id The div ID to render the form in. 
	 * */
	this.Render = function(task_div_id) {
		
		self.tree_view_div_id = task_div_id+'_tree_view_div';
		self.tree_items_div_id = task_div_id+'_items_div';
		self.tree_tasks_div_id = task_div_id+'_tasks_div';
		
		document.getElementById(task_div_id).innerHTML += '<div id="'+self.tree_view_div_id+'"></div>';
		document.getElementById(task_div_id).innerHTML += '<div id="'+self.tree_items_div_id+'"></div>';
		document.getElementById(task_div_id).innerHTML += '<div id="'+self.tree_tasks_div_id+'"></div>';
		
		this.tree_view = new Tree_View(self.tree_view_div_id);
		this.tree_view.Render();
		
		this.items_tab = new Item_Tab();
		this.items_tab.Render(self.tree_items_div_id);
		
		this.tasks_tab = new Task_Tab();
		this.tasks_tab.Render(self.tree_tasks_div_id);
	};
}

