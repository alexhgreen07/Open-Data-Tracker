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
		
		self.data = data;
		
		self.tree_view.Refresh(self.data);
		self.items_tab.Refresh(self.data);
		self.tasks_tab.Refresh(self.data);
	};
	
	this.Node_Click_Callback = function(info){
		
		info_div = document.getElementById(self.selected_info_div.id);
		
		info_div.innerHTML = '';
		
		for(var key in info.row)
		{
			info_div.innerHTML += key +': ' + info.row[key] + '<br>';
		}
		
		self.current_selected_info = info;
		
		self.Hide_All();
		
		if(info.table == 'categories')
		{
			$('#' + self.category_buttons_div.id).fadeIn();
		}
		else if(info.table == 'tasks')
		{
			$('#' + self.node_buttons_div.id).fadeIn();
		}
		else if(info.table == 'items')
		{
			$('#' + self.node_buttons_div.id).fadeIn();
		}
		else if(info.table == 'task_targets')
		{
			$('#' + self.target_buttons_div.id).fadeIn();
		}
		else if(info.table == 'item_targets')
		{
			$('#' + self.target_buttons_div.id).fadeIn();
		}
		else if(info.table == 'task_entries')
		{
			$('#' + self.entry_buttons_div.id).fadeIn();
		}
		else if(info.table == 'item_entries')
		{
			$('#' + self.entry_buttons_div.id).fadeIn();
		}
		
	};
	
	this.Node_Entry_Button_Click = function(){
		
		window.scrollTo(0, 0);
		
		this.Hide_All();
		$('#' + self.tree_view_div.id).hide();
		
		$('#' + self.cancel_button_div.id).fadeIn();
		
		if(self.current_selected_info.table == 'tasks')
		{
			name_select_id = self.tasks_tab.timecard_task_entry_form.task_name_select.id;
			document.getElementById(name_select_id).value = self.current_selected_info.row.task_id;
			self.tasks_tab.Refresh(self.data);
			
			//execute the click event
			self.tasks_tab.Show_Form('timecard_task_entry_div');
		}
		else if(self.current_selected_info.table == 'items')
		{
			name_select_id = self.items_tab.quick_item_entry_form.quick_item_name_select.id;
			document.getElementById(name_select_id).value = self.current_selected_info.row.item_id;
			self.items_tab.Refresh(self.data);
			
			self.items_tab.Show_Form('quick_item_entry_div');
		}
		
	};
	
	this.Node_Edit_Button_Click = function(){
		
		window.scrollTo(0, 0);
		
		this.Hide_All();
		$('#' + self.tree_view_div.id).hide();
		
		$('#' + self.cancel_button_div.id).fadeIn();
		
		if(self.current_selected_info.table == 'tasks')
		{
			
			name_select_id = self.tasks_tab.edit_task_form.task_entry_task_edit_name_select.id;
			document.getElementById(name_select_id).value = self.current_selected_info.row.task_id;
			self.tasks_tab.Refresh(self.data);
			
			//execute the click event
			self.tasks_tab.Show_Form('edit_tasks_div');
		}
		else if(self.current_selected_info.table == 'items')
		{
			name_select_id = self.items_tab.edit_item_form.item_edit_select.id;
			document.getElementById(name_select_id).value = self.current_selected_info.row.item_id;
			self.items_tab.Refresh(self.data);
			
			self.items_tab.Show_Form('edit_item_div');
		}
		
	};
	
	this.Node_New_Target_Button_Click = function(){
		
		window.scrollTo(0, 0);
		
		self.Hide_All();
		$('#' + self.tree_view_div.id).hide();
		
		$('#' + self.cancel_button_div.id).fadeIn();
		
		if(self.current_selected_info.table == 'tasks')
		{
			name_select_id = self.tasks_tab.new_task_target_form.task_target_new_name_select.id;
			document.getElementById(name_select_id).value = self.current_selected_info.row.task_id;
			self.tasks_tab.Refresh(self.data);
			
			//execute the click event
			self.tasks_tab.Show_Form('new_target_task_entry_div');
		}
		else if(self.current_selected_info.table == 'items')
		{
			name_select_id = self.items_tab.new_item_target_form.new_item_target_name_select.id;
			document.getElementById(name_select_id).value = self.current_selected_info.row.item_id;
			self.items_tab.Refresh(self.data);
			
			self.items_tab.Show_Form('new_item_target_div');
		}
		
	};
	
	this.Node_New_Entry_Button_Click = function(){
		
		window.scrollTo(0, 0);
		
		self.Hide_All();
		$('#' + self.tree_view_div.id).hide();
		
		$('#' + self.cancel_button_div.id).fadeIn();
		
		if(self.current_selected_info.table == 'tasks')
		{
			name_select_id = self.tasks_tab.new_task_entry_form.add_task_entry_task_name_select.id;
			document.getElementById(name_select_id).value = self.current_selected_info.row.task_id;
			self.tasks_tab.Refresh(self.data);
			
			//execute the click event
			self.tasks_tab.Show_Form('new_task_entry_div');
		}
		else if(self.current_selected_info.table == 'items')
		{
			name_select_id = self.items_tab.new_item_entry_form.new_item_name_select.id;
			document.getElementById(name_select_id).value = self.current_selected_info.row.item_id;
			self.items_tab.Refresh(self.data);
			
			self.items_tab.Show_Form('new_item_entry_div');
		}
		
	};
	
	this.Cancel_Button_Click_Event = function(){
		
		$('#' + self.tree_view_div.id).fadeIn();
		
		self.Node_Click_Callback(self.current_selected_info);
		
	};
	
	this.Hide_All = function(){
		
		//execute the click event
		
		self.items_tab.Show_Form('');
		self.tasks_tab.Show_Form('');
		
		$('#' + self.cancel_button_div.id).hide();
		$('#' + self.category_buttons_div.id).hide();
		$('#' + self.entry_buttons_div.id).hide();
		$('#' + self.target_buttons_div.id).hide();
		$('#' + self.node_buttons_div.id).hide();
		
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
		
		self.tree_view_disp_div = document.createElement("div");
		self.tree_view_disp_div.id = form_div_id + '_tree_view_disp_div';
		self.tree_view_div.appendChild(self.tree_view_disp_div);
		
		self.selected_info_div = document.createElement("div");
		self.selected_info_div.id = form_div_id + '_selected_info_div';
		self.tree_view_div.appendChild(self.selected_info_div);
		
		self.tree_view_div.innerHTML += "<hr>";
		
		self.form.appendChild(self.tree_view_div);
		
		self.tree_items_div = document.createElement("div");
		self.tree_items_div.id = form_div_id + '_tree_items_div';
		self.form.appendChild(self.tree_items_div);
		
		self.tree_tasks_div = document.createElement("div");
		self.tree_tasks_div.id = form_div_id + '_tree_tasks_div';
		self.form.appendChild(self.tree_tasks_div);
		
		self.cancel_button_div = document.createElement("div");
		self.cancel_button_div.id = form_div_id + '_cancel_button_div';
		
		self.cancel_button_div.innerHTML += "<br>";
		
		self.cancel_button = document.createElement("input");
		self.cancel_button.id = form_div_id + '_cancel_button';
		self.cancel_button.type = "submit";
		self.cancel_button.value = "Cancel";
		self.cancel_button_div.appendChild(self.cancel_button);
		
		self.cancel_button_div.innerHTML += "<br><br>";
		
		self.form.appendChild(self.cancel_button_div);
		
		//task buttons div
		self.node_buttons_div = document.createElement("div");
		self.node_buttons_div.id = form_div_id + '_node_buttons_div';
		
		self.entry_button = document.createElement("input");
		self.entry_button.id = form_div_id + '_entry_button';
		self.entry_button.type = "submit";
		self.entry_button.value = "Entry";
		self.node_buttons_div.appendChild(self.entry_button);
		
		self.node_buttons_div.innerHTML += "<br><br>";
		
		self.edit_node_button = document.createElement("input");
		self.edit_node_button.id = form_div_id + '_edit_node_button';
		self.edit_node_button.type = "submit";
		self.edit_node_button.value = "Edit";
		self.node_buttons_div.appendChild(self.edit_node_button);
		
		self.node_buttons_div.innerHTML += "<br><br>";
		
		self.new_node_target_button = document.createElement("input");
		self.new_node_target_button.id = form_div_id + '_new_node_target_button';
		self.new_node_target_button.type = "submit";
		self.new_node_target_button.value = "New Target";
		self.node_buttons_div.appendChild(self.new_node_target_button);
		
		self.node_buttons_div.innerHTML += "<br><br>";
		
		self.new_node_entry_button = document.createElement("input");
		self.new_node_entry_button.id = form_div_id + '_new_node_entry_button';
		self.new_node_entry_button.type = "submit";
		self.new_node_entry_button.value = "New Entry";
		self.node_buttons_div.appendChild(self.new_node_entry_button);
		
		self.node_buttons_div.innerHTML += "<br><br>";
		
		self.form.appendChild(self.node_buttons_div);
		
		//target buttons div
		self.target_buttons_div = document.createElement("div");
		self.target_buttons_div.id = form_div_id + '_target_buttons_div';
		
		self.target_entry_button = document.createElement("input");
		self.target_entry_button.id = form_div_id + '_target_entry_button';
		self.target_entry_button.type = "submit";
		self.target_entry_button.value = "Entry";
		self.target_buttons_div.appendChild(self.target_entry_button);
		
		self.target_buttons_div.innerHTML += '<br><br>';
		
		self.target_edit_button = document.createElement("input");
		self.target_edit_button.id = form_div_id + '_target_edit_button';
		self.target_edit_button.type = "submit";
		self.target_edit_button.value = "Edit";
		self.target_buttons_div.appendChild(self.target_edit_button);
		
		self.target_buttons_div.innerHTML += '<br><br>';
		
		self.target_new_entry_button = document.createElement("input");
		self.target_new_entry_button.id = form_div_id + '_target_new_entry_button';
		self.target_new_entry_button.type = "submit";
		self.target_new_entry_button.value = "New Entry";
		self.target_buttons_div.appendChild(self.target_new_entry_button);
		
		self.target_buttons_div.innerHTML += '<br><br>';
		
		self.form.appendChild(self.target_buttons_div);
		
		//entry buttons div
		self.entry_buttons_div = document.createElement("div");
		self.entry_buttons_div.id = form_div_id + '_entry_buttons_div';
		
		self.edit_entry_button = document.createElement("input");
		self.edit_entry_button.id = form_div_id + '_edit_entry_button';
		self.edit_entry_button.type = "submit";
		self.edit_entry_button.value = "Edit";
		self.entry_buttons_div.appendChild(self.edit_entry_button);
		
		self.entry_buttons_div.innerHTML += '<br><br>';
		
		self.form.appendChild(self.entry_buttons_div);
		
		//category buttons div
		self.category_buttons_div = document.createElement("div");
		self.category_buttons_div.id = form_div_id + '_category_buttons_div';
		
		self.new_category_button = document.createElement("input");
		self.new_category_button.id = form_div_id + '_new_category_button';
		self.new_category_button.type = "submit";
		self.new_category_button.value = "New Category";
		self.category_buttons_div.appendChild(self.new_category_button);
		
		self.category_buttons_div.innerHTML += "<br><br>";
		
		self.edit_category_button = document.createElement("input");
		self.edit_category_button.id = form_div_id + '_edit_category_button';
		self.edit_category_button.type = "submit";
		self.edit_category_button.value = "Edit";
		self.category_buttons_div.appendChild(self.edit_category_button);
		
		self.category_buttons_div.innerHTML += "<br><br>";
		
		self.new_task_button = document.createElement("input");
		self.new_task_button.id = form_div_id + '_new_task_button';
		self.new_task_button.type = "submit";
		self.new_task_button.value = "New Task";
		self.category_buttons_div.appendChild(self.new_task_button);
		
		self.category_buttons_div.innerHTML += "<br><br>";
		
		self.new_item_button = document.createElement("input");
		self.new_item_button.id = form_div_id + '_new_item_button';
		self.new_item_button.type = "submit";
		self.new_item_button.value = "New Item";
		self.category_buttons_div.appendChild(self.new_item_button);
		
		self.category_buttons_div.innerHTML += "<br><br>";
		
		self.form.appendChild(self.category_buttons_div);
		
		var tabs_array = new Array();
		var new_tab = new Array();
		new_tab.push("Tree View");
		var accordian_div = form_div_id + '_accordian_div';
		new_tab.push('<div id="'+accordian_div+'"></div>');
		tabs_array.push(new_tab);
		
		var items_accordian = new Accordian(form_div_id, tabs_array);
		items_accordian.Render();
		
		document.getElementById(accordian_div).appendChild(self.form);
		
		self.tree_view = new Tree_View(self.tree_view_disp_div.id);
		self.tree_view.Render();
		
		self.items_tab = new Item_Tab();
		self.items_tab.Render(self.tree_items_div.id);
		
		self.tasks_tab = new Task_Tab();
		self.tasks_tab.Render(self.tree_tasks_div.id);
		
		self.tree_view.node_click_callback = self.Node_Click_Callback;
		
		//hide unselected divs
		self.Hide_All();
		$('#' + self.category_buttons_div.id).fadeIn();
		
		$('#' + self.entry_button.id).button();
		$('#' + self.entry_button.id).click(function(event) {

			//ensure a normal postback does not occur
			event.preventDefault();
			
			self.Node_Entry_Button_Click();
			
		});
		
		$('#' + self.edit_node_button.id).button();
		$('#' + self.edit_node_button.id).click(function(event) {

			//ensure a normal postback does not occur
			event.preventDefault();
			
			self.Node_Edit_Button_Click();
			
		});
		
		$('#' + self.new_node_target_button.id).button();
		$('#' + self.new_node_target_button.id).click(function(event) {

			//ensure a normal postback does not occur
			event.preventDefault();
			
			self.Node_New_Target_Button_Click();
			
		});
		
		$('#' + self.target_entry_button.id).button();
		$('#' + self.target_entry_button.id).click(function(event){
			
			event.preventDefault();
			
		});
		
		$('#' + self.target_edit_button.id).button();
		$('#' + self.target_edit_button.id).click(function(event){
			
			event.preventDefault();
			
		});
		
		$('#' + self.target_new_entry_button.id).button();
		$('#' + self.target_new_entry_button.id).click(function(event){
			
			event.preventDefault();
			
		});
		
		$('#' + self.edit_entry_button.id).button();
		$('#' + self.edit_entry_button.id).click(function(event){
			
			event.preventDefault();
			
		});
		
		$('#' + self.new_node_entry_button.id).button();
		$('#' + self.new_node_entry_button.id).click(function(event){
			
			event.preventDefault();
			
			self.Node_New_Entry_Button_Click();
		});
		
		$('#' + self.cancel_button.id).button();
		$('#' + self.cancel_button.id).click(function(event) {

			//ensure a normal postback does not occur
			event.preventDefault();

			self.Cancel_Button_Click_Event();
		});
		
		$('#' + self.new_category_button.id).button();
		$('#' + self.new_category_button.id).click(function(event) {

			//ensure a normal postback does not occur
			event.preventDefault();

			//execute the click event
			alert('Not implemented.');
		});
		
		$('#' + self.edit_category_button.id).button();
		$('#' + self.edit_category_button.id).click(function(event){
			
			//ensure a normal postback does not occur
			event.preventDefault();
			
			//execute the click event
			alert('Not implemented.');
		});
		
		$('#' + self.new_task_button.id).button();
		$('#' + self.new_task_button.id).click(function(event) {

			//ensure a normal postback does not occur
			event.preventDefault();

			self.Hide_All();
			
			//execute the click event
			self.tasks_tab.Show_Form('add_task_div');
			
			$('#' + self.cancel_button_div.id).fadeIn();
		});
		
		$('#' + self.new_item_button.id).button();
		$('#' + self.new_item_button.id).click(function(event) {

			//ensure a normal postback does not occur
			event.preventDefault();

			self.Hide_All();
			
			//execute the click event
			self.items_tab.Show_Form('add_item_div');
			
			$('#' + self.cancel_button_div.id).fadeIn();
		});
		
	};
}

