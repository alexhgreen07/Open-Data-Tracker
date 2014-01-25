/** This is the task tab object which holds all UI objects for task data interaction.
 * @constructor Task_Tab
 */
function Entry_Tab() {
	
	var self = this;
	
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
		this.items_tab.Refresh(data);
		this.tasks_tab.Refresh(data);
	};

	/** @method Render
	 * @desc This function renders the tab in the div the object was initialized with.
	 * @param {String} form_div_id The div ID to render the form in. 
	 * */
	this.Render = function(form_div_id) {
		
		var div_tab = document.getElementById(form_div_id);
		self.form = document.createElement("form");
		self.form.id = form_div_id + '_form';
		
		self.tree_view_div = document.createElement("div");
		self.tree_view_div.id = form_div_id + '_tree_view_div';
		self.form.appendChild(self.tree_view_div);
		
		self.tree_items_div = document.createElement("div");
		self.tree_items_div.id = form_div_id + '_tree_items_div';
		self.form.appendChild(self.tree_items_div);
		
		self.tree_tasks_div = document.createElement("div");
		self.tree_tasks_div.id = form_div_id + '_tree_tasks_div';
		self.form.appendChild(self.tree_tasks_div);
		
		self.form.innerHTML += "<hr>";
		
		self.new_category_button = document.createElement("input");
		self.new_category_button.id = form_div_id + '_new_category_button';
		self.new_category_button.type = "submit";
		self.new_category_button.value = "New Category";
		self.form.appendChild(self.new_category_button);
		
		self.form.innerHTML += "<br><br>";
		
		self.new_task_button = document.createElement("input");
		self.new_task_button.id = form_div_id + '_new_task_button';
		self.new_task_button.type = "submit";
		self.new_task_button.value = "New Task";
		self.form.appendChild(self.new_task_button);
		
		self.form.innerHTML += "<br><br>";
		
		self.new_item_button = document.createElement("input");
		self.new_item_button.id = form_div_id + '_new_item_button';
		self.new_item_button.type = "submit";
		self.new_item_button.value = "New Item";
		self.form.appendChild(self.new_item_button);
		
		div_tab.appendChild(self.form);
		
		self.tree_view = new Tree_View(self.tree_view_div.id);
		self.tree_view.Render();
		
		self.items_tab = new Item_Tab();
		self.items_tab.Render(self.tree_items_div.id);
		
		self.tasks_tab = new Task_Tab();
		self.tasks_tab.Render(self.tree_tasks_div.id);
		
		$('#' + self.tree_items_div.id).hide();
		$('#' + self.tree_tasks_div.id).hide();
		
		$('#' + self.new_category_button.id).button();
		$('#' + self.new_category_button.id).click(function(event) {

			//ensure a normal postback does not occur
			event.preventDefault();

			
			//execute the click event
			alert('Not implemented.');
		});
		
		$('#' + self.new_task_button.id).button();
		$('#' + self.new_task_button.id).click(function(event) {

			//ensure a normal postback does not occur
			event.preventDefault();

			
			//execute the click event
			alert('Not implemented.');
		});
		
		$('#' + self.new_item_button.id).button();
		$('#' + self.new_item_button.id).click(function(event) {

			//ensure a normal postback does not occur
			event.preventDefault();

			
			//execute the click event
			alert('Not implemented.');
		});
		
	};
}

