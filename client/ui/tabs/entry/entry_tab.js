define([
        '../../../../core/logger.js',
        '../../tree_view',
        './categories/category_form',
        './items/item_tab',
        './tasks/task_tab',
        ],function(logger, tree_view, category_form, item_tab, task_tab){
	
	/** This is the task tab object which holds all UI objects for task data interaction.
	 * @constructor Task_Tab
	 */
	function Entry_Tab(init_category_tab, init_items_tab, init_tasks_tab,entry_accordian,init_tree_view) {
		
		var self = this;
		
		/** This is the parent div ID where the task tab is.
		 * @type String
		 * */
		this.div_id = null;
		
		self.current_selected_info = {};
		
		self.category_tab = init_category_tab;
		self.items_tab = init_items_tab;
		self.tasks_tab = init_tasks_tab;
		
		self.entry_accordian = entry_accordian;
		self.tree_view = init_tree_view;
		
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
			
			var times = [];
			var start = new Date();
			
			self.tree_view.Refresh(self.data);
			
			var end = new Date();
			times.push('tree_view: ' + (end - start) / 1000);
			var start = new Date();
			
			self.category_tab.Refresh(self.data);
			
			var end = new Date();
			times.push('category_tab: ' + (end - start) / 1000);
			var start = new Date();
			
			self.items_tab.Refresh(self.data);
			
			var end = new Date();
			times.push('items_tab: ' + (end - start) / 1000);
			var start = new Date();
			
			self.tasks_tab.Refresh(self.data);
			
			var end = new Date();
			times.push('tasks_tab: ' + (end - start) / 1000);
			
			logger.Info('Entry_Tab Refresh: ' + JSON.stringify(times));
		};
		
		this.Refresh_From_Diff = function(diff, data)
		{
			
			//TODO: implement
			self.data = data;
			
			var times = [];
			var start = new Date();
			
			self.tree_view.Refresh_From_Diff(diff, self.data);
			
			var end = new Date();
			times.push('tree_view: ' + (end - start) / 1000);
			var start = new Date();
							
			self.category_tab.Refresh_From_Diff(diff);
			
			var end = new Date();
			times.push('category_tab: ' + (end - start) / 1000);
			var start = new Date();
			
			self.items_tab.Refresh_From_Diff(diff, data);
			
			var end = new Date();
			times.push('items_tab: ' + (end - start) / 1000);
			var start = new Date();
			
			self.tasks_tab.Refresh_From_Diff(diff, data);
			
			var end = new Date();
			times.push('tasks_tab: ' + (end - start) / 1000);
			
			logger.Info('Entry_Tab Diff: ' + JSON.stringify(times));
		};
		
		this.Select_Entry = function(table, row)
		{
			
			self.current_selected_info.table = table;
			self.current_selected_info.row = row;
			
			self.tree_view.Expand_All_Node_Parents(table,row);
			
			if(table == 'Categories')
			{
				//TODO: implement
			}
			else if(table == 'tasks')
			{
				//TODO: implement
			}
			else if(table == 'items')
			{
				//TODO: implement
			}
			else if(table == 'task_targets')
			{
				if(self.current_selected_info.row.status == 'Incomplete')
				{
					self.Target_Entry_Button_Click();
				}
				else
				{
					self.Target_Edit_Button_Click();
				}
			}
			else if(table == 'item_targets')
			{
				//TODO: implement
			}
			else if(table == 'task_entries')
			{
				if(self.current_selected_info.row.status == 'Started')
				{
					self.New_Entry_Button_Click();
				}
				else
				{
					self.Edit_Entry_Button_Click();
				}
				
			}
			else if(table == 'item_entries')
			{
				self.Node_Entry_Button_Click();
			}
			
		};
		
		this.Node_Click_Callback = function(info){
			
			info_div = self.selected_info_div;
			
			info_div.innerHTML = '<hr>';
			
			for(var key in info.row)
			{
				info_div.innerHTML += key +': ' + info.row[key] + '<br>';
			}
			
			self.current_selected_info = info;
			
			self.Hide_All();
			
			if(info.table == 'Categories')
			{
				$(self.category_buttons_div).fadeIn();
			}
			else if(info.table == 'tasks')
			{
				$(self.node_buttons_div).fadeIn();
			}
			else if(info.table == 'items')
			{
				$(self.node_buttons_div).fadeIn();
			}
			else if(info.table == 'task_targets')
			{
				$(self.target_buttons_div).fadeIn();
			}
			else if(info.table == 'item_targets')
			{
				$(self.target_buttons_div).fadeIn();
			}
			else if(info.table == 'task_entries')
			{
				$(self.entry_buttons_div).fadeIn();
			}
			else if(info.table == 'item_entries')
			{
				$(self.entry_buttons_div).fadeIn();
			}
			
		};
		
		this.Node_Entry_Button_Click = function(){
			
			window.scrollTo(0, 0);
			
			this.Hide_All();
			$(self.tree_view_div).hide();
			
			$(self.cancel_button_div).fadeIn();
			
			if(self.current_selected_info.table == 'tasks')
			{
				name_select_id = self.tasks_tab.timecard_task_entry_form.task_name_select.id;
				target_select_id = self.tasks_tab.timecard_task_entry_form.task_target_select.id;
				entry_select_id = self.tasks_tab.timecard_task_entry_form.task_entries_started_select.id;
				
				self.tasks_tab.timecard_task_entry_form.selected_task_entry = self.current_selected_info.row;
				
				document.getElementById(name_select_id).value = self.current_selected_info.row.task_id;
				document.getElementById(target_select_id).value = 0;
				document.getElementById(entry_select_id).value = 0;
				
				self.tasks_tab.timecard_task_entry_form.Task_Start_Entry_Change();
				
				//execute the click event
				self.tasks_tab.Show_Form('timecard_task_entry_div');
			}
			else if(self.current_selected_info.table == 'items' || self.current_selected_info.table == 'item_entries')
			{
				name_select_id = self.items_tab.quick_item_entry_form.quick_item_name_select.id;
				document.getElementById(name_select_id).value = self.current_selected_info.row.item_id;
				
				self.items_tab.Show_Form('quick_item_entry_div');
			}
			
		};
		
		this.Node_Edit_Button_Click = function(){
			
			window.scrollTo(0, 0);
			
			this.Hide_All();
			$(self.tree_view_div).hide();
			
			$(self.cancel_button_div).fadeIn();
			
			if(self.current_selected_info.table == 'tasks')
			{
				
				name_select_id = self.tasks_tab.edit_task_form.task_entry_task_edit_name_select.id;
				document.getElementById(name_select_id).value = self.current_selected_info.row.task_id;
				self.tasks_tab.edit_task_form.Task_Edit_Select_Change();
				
				//execute the click event
				self.tasks_tab.Show_Form('edit_tasks_div');
			}
			else if(self.current_selected_info.table == 'items')
			{
				name_select_id = self.items_tab.edit_item_form.item_edit_select.id;
				document.getElementById(name_select_id).value = self.current_selected_info.row.item_id;
				self.items_tab.edit_item_form.Item_Select_Change();
				
				self.items_tab.Show_Form('edit_item_div');
			}
			
		};
		
		this.Target_Entry_Button_Click = function(){
			
			window.scrollTo(0, 0);
			
			this.Hide_All();
			$(self.tree_view_div).hide();
			
			$(self.cancel_button_div).fadeIn();
			
			if(self.current_selected_info.table == 'task_targets')
			{
				
				name_select_id = self.tasks_tab.timecard_task_entry_form.task_name_select.id;
				target_select_id = self.tasks_tab.timecard_task_entry_form.task_target_select.id;
				entry_select_id = self.tasks_tab.timecard_task_entry_form.task_entries_started_select.id;
				
				self.tasks_tab.timecard_task_entry_form.selected_task_entry = self.current_selected_info.row;
				
				document.getElementById(name_select_id).value = self.current_selected_info.row.task_id;
				document.getElementById(target_select_id).value = self.current_selected_info.row.task_schedule_id;
				document.getElementById(entry_select_id).value = 0;
				
				self.tasks_tab.timecard_task_entry_form.Task_Start_Entry_Change();
				
				//execute the click event
				self.tasks_tab.Show_Form('timecard_task_entry_div');
			}
			else if(self.current_selected_info.table == 'item_targets')
			{
				name_select_id = self.items_tab.quick_item_entry_form.quick_item_name_select.id;
				target_select_id = self.items_tab.quick_item_entry_form.quick_item_target_select.id;
				document.getElementById(name_select_id).value = self.current_selected_info.row.item_id;
				document.getElementById(target_select_id).value = self.current_selected_info.row.item_target_id;
				
				self.items_tab.Show_Form('quick_item_entry_div');
			}
		};
		
		this.Target_Edit_Button_Click = function(){
			
			window.scrollTo(0, 0);
			
			this.Hide_All();
			$(self.tree_view_div).hide();
			
			$(self.cancel_button_div).fadeIn();
			
			if(self.current_selected_info.table == 'task_targets')
			{
				
				target_select_id = self.tasks_tab.edit_task_target_form.task_edit_target_select.id;
				document.getElementById(target_select_id).value = self.current_selected_info.row.task_schedule_id;
				self.tasks_tab.edit_task_target_form.Task_Target_Edit_Select_Change();
				
				//execute the click event
				self.tasks_tab.Show_Form('edit_target_task_entry_div');
			}
			else if(self.current_selected_info.table == 'item_targets')
			{
				target_select_id = self.items_tab.edit_item_target_form.edit_item_target_id_select.id;
				document.getElementById(target_select_id).value = self.current_selected_info.row.item_target_id;
				self.items_tab.edit_item_target_form.Selected_Item_Target_Change();
				
				self.items_tab.Show_Form('edit_item_target_div');
			}
		};
		
		this.Target_New_Entry_Button_Click = function(){
			
			window.scrollTo(0, 0);
			
			self.Hide_All();
			$(self.tree_view_div).hide();
			
			$(self.cancel_button_div).fadeIn();
			
			if(self.current_selected_info.table == 'task_targets')
			{
				name_select_id = self.tasks_tab.new_task_entry_form.add_task_entry_task_name_select.id;
				target_select_id = self.tasks_tab.new_task_entry_form.task_target_select.id;
				document.getElementById(name_select_id).value = self.current_selected_info.row.task_id;
				document.getElementById(target_select_id).value = self.current_selected_info.row.task_schedule_id;
				
				//execute the click event
				self.tasks_tab.Show_Form('new_task_entry_div');
			}
			else if(self.current_selected_info.table == 'item_targets')
			{
				name_select_id = self.items_tab.new_item_entry_form.new_item_name_select.id;
				target_select_id = self.items_tab.new_item_entry_form.new_item_target_select.id;
				document.getElementById(name_select_id).value = self.current_selected_info.row.item_id;
				document.getElementById(target_select_id).value = self.current_selected_info.row.item_target_id;
				
				self.items_tab.Show_Form('new_item_entry_div');
			}
			
		};
		
		this.New_Entry_Button_Click = function(){
			
			window.scrollTo(0, 0);
			
			self.Hide_All();
			$(self.tree_view_div).hide();
			
			$(self.cancel_button_div).fadeIn();
			
			if(self.current_selected_info.table == 'task_entries')
			{
				name_select_id = self.tasks_tab.timecard_task_entry_form.task_name_select.id;
				target_select_id = self.tasks_tab.timecard_task_entry_form.task_target_select.id;
				entry_select_id = self.tasks_tab.timecard_task_entry_form.task_entries_started_select.id;
				
				self.tasks_tab.timecard_task_entry_form.selected_task_entry = self.current_selected_info.row;
				
				document.getElementById(name_select_id).value = self.current_selected_info.row.task_id;
				document.getElementById(target_select_id).value = self.current_selected_info.row.task_target_id;
				document.getElementById(entry_select_id).value = self.current_selected_info.row.task_log_id;
				
				self.tasks_tab.timecard_task_entry_form.Task_Start_Entry_Change();
				
				//execute the click event
				self.tasks_tab.Show_Form('timecard_task_entry_div');
				
			}
			else if(self.current_selected_info.table == 'item_entries')
			{
				//TODO: implement
			}
			
		};
		
		this.Edit_Entry_Button_Click = function(){
			
			window.scrollTo(0, 0);
			
			self.Hide_All();
			$(self.tree_view_div).hide();
			
			$(self.cancel_button_div).fadeIn();
			
			if(self.current_selected_info.table == 'task_entries')
			{
				name_select_id = self.tasks_tab.edit_task_entry_form.edit_task_entry_select.id;
				document.getElementById(name_select_id).value = self.current_selected_info.row.task_log_id;
				self.tasks_tab.edit_task_entry_form.Task_Edit_Entry_Select_Change();
				
				//execute the click event
				self.tasks_tab.Show_Form('edit_task_entry_div');
			}
			else if(self.current_selected_info.table == 'item_entries')
			{
				name_select_id = self.items_tab.edit_item_entry_form.edit_item_entry_select.id;
				document.getElementById(name_select_id).value = self.current_selected_info.row.item_log_id;
				self.items_tab.edit_item_entry_form.Item_Entry_Select_Change();
				
				self.items_tab.Show_Form('edit_item_log_div');
			}
			
		};
		
		this.Node_New_Target_Button_Click = function(){
			
			window.scrollTo(0, 0);
			
			self.Hide_All();
			$(self.tree_view_div).hide();
			
			$(self.cancel_button_div).fadeIn();
			
			if(self.current_selected_info.table == 'tasks')
			{
				name_select_id = self.tasks_tab.new_task_target_form.task_target_new_name_select.id;
				document.getElementById(name_select_id).value = self.current_selected_info.row.task_id;
				
				//execute the click event
				self.tasks_tab.Show_Form('new_target_task_entry_div');
			}
			else if(self.current_selected_info.table == 'items')
			{
				name_select_id = self.items_tab.new_item_target_form.new_item_target_name_select.id;
				document.getElementById(name_select_id).value = self.current_selected_info.row.item_id;
				
				self.items_tab.Show_Form('new_item_target_div');
			}
			
		};
		
		this.Node_New_Entry_Button_Click = function(){
			
			window.scrollTo(0, 0);
			
			self.Hide_All();
			$(self.tree_view_div).hide();
			
			$(self.cancel_button_div).fadeIn();
			
			if(self.current_selected_info.table == 'tasks')
			{
				name_select_id = self.tasks_tab.new_task_entry_form.add_task_entry_task_name_select.id;
				document.getElementById(name_select_id).value = self.current_selected_info.row.task_id;
				
				//execute the click event
				self.tasks_tab.Show_Form('new_task_entry_div');
			}
			else if(self.current_selected_info.table == 'items')
			{
				name_select_id = self.items_tab.new_item_entry_form.new_item_name_select.id;
				document.getElementById(name_select_id).value = self.current_selected_info.row.item_id;
				
				self.items_tab.Show_Form('new_item_entry_div');
			}
			
		};
		
		this.Category_New_Button_Click = function(){
			
			window.scrollTo(0, 0);
			
			self.Hide_All();
			$(self.tree_view_div).hide();
			
			$(self.cancel_button_div).fadeIn();
			
			name_select_id = self.category_tab.new_category_form.add_new_category_parent_select.id;
			document.getElementById(name_select_id).value = self.current_selected_info.row["Category ID"];
			
			//execute the click event
			self.category_tab.Show_Form('home_category_add_new_tab');
			
		};
		
		this.Category_Edit_Button_Click = function(){
			
			window.scrollTo(0, 0);
			
			self.Hide_All();
			$(self.tree_view_div).hide();
			
			$(self.cancel_button_div).fadeIn();
			
			name_select_id = self.category_tab.edit_category_form.edit_category_select.id;
			document.getElementById(name_select_id).value = self.current_selected_info.row["Category ID"];
			self.category_tab.edit_category_form.Category_Edit_Select_Change_Event();
			
			//execute the click event
			self.category_tab.Show_Form('home_category_edit_tab');
			
		};
		
		this.Category_New_Task_Button_Click = function(){
			
			window.scrollTo(0, 0);
			
			self.Hide_All();
			$(self.tree_view_div).hide();
			
			$(self.cancel_button_div).fadeIn();
			
			name_select_id = self.tasks_tab.new_task_form.task_category_select.id;
			document.getElementById(name_select_id).value = self.current_selected_info.row["Category ID"];
			self.category_tab.Refresh(self.data);
			
			//execute the click event
			self.tasks_tab.Show_Form('add_task_div');
			
		};
		
		this.Category_New_Item_Button_Click = function(){
			
			window.scrollTo(0, 0);
			
			self.Hide_All();
			$(self.tree_view_div).hide();
			
			$(self.cancel_button_div).fadeIn();
			
			name_select_id = self.items_tab.new_item_form.item_category_select.id;
			document.getElementById(name_select_id).value = self.current_selected_info.row["Category ID"];
			self.category_tab.Refresh(self.data);
			
			//execute the click event
			self.items_tab.Show_Form('add_item_div');
			
		};
		
		this.Cancel_Button_Click_Event = function(){
			
			$(self.tree_view_div).fadeIn();
			
			self.Node_Click_Callback(self.current_selected_info);
			
		};
		
		this.Hide_All = function(){
			
			//execute the click event
			
			self.category_tab.Show_Form('');
			self.items_tab.Show_Form('');
			self.tasks_tab.Show_Form('');
			
			$(self.cancel_button_div).hide();
			$(self.category_buttons_div).hide();
			$(self.entry_buttons_div).hide();
			$(self.target_buttons_div).hide();
			$(self.node_buttons_div).hide();
			
		};
		
		/** @method Render
		 * @desc This function renders the tab in the div the object was initialized with.
		 * @param {String} form_div_id The div ID to render the form in. 
		 * */
		this.Render = function(form_div) {
			
			var form_div_id = form_div.id;
			var div_tab = form_div;
			
			self.form = document.createElement("form");
			self.form.id = form_div_id + '_form';

			var tabs_array = [];
			var new_tab = [];
			new_tab.push("Tree View");
			var accordian_div = form_div_id + '_accordian_div';
			new_tab.push('<div id="'+accordian_div+'"></div>');
			tabs_array.push(new_tab);
			
			self.entry_accordian.Render(form_div_id, tabs_array);
			
			self.form = document.getElementById(accordian_div).appendChild(self.form);

			self.tree_view_div = document.createElement("div");
			self.tree_view_div.id = form_div_id + '_tree_view_div';

			self.tree_view_div = self.form.appendChild(self.tree_view_div);
						
			self.tree_view_disp_div = document.createElement("div");
			self.tree_view_disp_div.id = form_div_id + '_tree_view_disp_div';
			self.tree_view_disp_div = self.tree_view_div.appendChild(self.tree_view_disp_div);
			
			self.selected_info_div = document.createElement("div");
			self.selected_info_div.id = form_div_id + '_selected_info_div';
			self.selected_info_div = self.tree_view_div.appendChild(self.selected_info_div);
			
			self.tree_view_div.appendChild(document.createElement("hr"));
			
			self.tree_category_div = document.createElement("div");
			self.tree_category_div.id = form_div_id + '_tree_category_div';
			self.tree_category_div = self.form.appendChild(self.tree_category_div);
			
			self.tree_items_div = document.createElement("div");
			self.tree_items_div.id = form_div_id + '_tree_items_div';
			self.tree_items_div = self.form.appendChild(self.tree_items_div);
			
			self.tree_tasks_div = document.createElement("div");
			self.tree_tasks_div.id = form_div_id + '_tree_tasks_div';
			self.tree_tasks_div = self.form.appendChild(self.tree_tasks_div);
			
			self.cancel_button_div = document.createElement("div");
			self.cancel_button_div.id = form_div_id + '_cancel_button_div';
			
			self.cancel_button_div = self.form.appendChild(self.cancel_button_div);
			
			self.cancel_button_div.appendChild(document.createElement("br"));
			
			self.cancel_button = document.createElement("input");
			self.cancel_button.id = form_div_id + '_cancel_button';
			self.cancel_button.type = "submit";
			self.cancel_button.value = "Cancel";
			self.cancel_button = self.cancel_button_div.appendChild(self.cancel_button);
			
			self.cancel_button_div.appendChild(document.createElement("br"));
			self.cancel_button_div.appendChild(document.createElement("br"));
			
			//task buttons div
			self.node_buttons_div = document.createElement("div");
			self.node_buttons_div.id = form_div_id + '_node_buttons_div';
			
			self.node_buttons_div = self.form.appendChild(self.node_buttons_div);
			
			self.entry_button = document.createElement("input");
			self.entry_button.id = form_div_id + '_entry_button';
			self.entry_button.type = "submit";
			self.entry_button.value = "Entry";
			self.entry_button = self.node_buttons_div.appendChild(self.entry_button);
			
			self.node_buttons_div.appendChild(document.createElement("br"));
			self.node_buttons_div.appendChild(document.createElement("br"));
			
			self.edit_node_button = document.createElement("input");
			self.edit_node_button.id = form_div_id + '_edit_node_button';
			self.edit_node_button.type = "submit";
			self.edit_node_button.value = "Edit";
			self.edit_node_button = self.node_buttons_div.appendChild(self.edit_node_button);
			
			self.node_buttons_div.appendChild(document.createElement("br"));
			self.node_buttons_div.appendChild(document.createElement("br"));
			
			self.new_node_target_button = document.createElement("input");
			self.new_node_target_button.id = form_div_id + '_new_node_target_button';
			self.new_node_target_button.type = "submit";
			self.new_node_target_button.value = "New Target";
			self.new_node_target_button = self.node_buttons_div.appendChild(self.new_node_target_button);
			
			self.node_buttons_div.appendChild(document.createElement("br"));
			self.node_buttons_div.appendChild(document.createElement("br"));
			
			self.new_node_entry_button = document.createElement("input");
			self.new_node_entry_button.id = form_div_id + '_new_node_entry_button';
			self.new_node_entry_button.type = "submit";
			self.new_node_entry_button.value = "New Entry";
			self.new_node_entry_button = self.node_buttons_div.appendChild(self.new_node_entry_button);
			
			self.node_buttons_div.appendChild(document.createElement("br"));
			self.node_buttons_div.appendChild(document.createElement("br"));
			
			//target buttons div
			self.target_buttons_div = document.createElement("div");
			self.target_buttons_div.id = form_div_id + '_target_buttons_div';
			
			self.target_buttons_div = self.form.appendChild(self.target_buttons_div);
			
			self.target_entry_button = document.createElement("input");
			self.target_entry_button.id = form_div_id + '_target_entry_button';
			self.target_entry_button.type = "submit";
			self.target_entry_button.value = "Entry";
			self.target_entry_button = self.target_buttons_div.appendChild(self.target_entry_button);
			
			self.target_buttons_div.appendChild(document.createElement("br"));
			self.target_buttons_div.appendChild(document.createElement("br"));
			
			self.target_edit_button = document.createElement("input");
			self.target_edit_button.id = form_div_id + '_target_edit_button';
			self.target_edit_button.type = "submit";
			self.target_edit_button.value = "Edit";
			self.target_edit_button = self.target_buttons_div.appendChild(self.target_edit_button);
			
			self.target_buttons_div.appendChild(document.createElement("br"));
			self.target_buttons_div.appendChild(document.createElement("br"));
			
			self.target_new_entry_button = document.createElement("input");
			self.target_new_entry_button.id = form_div_id + '_target_new_entry_button';
			self.target_new_entry_button.type = "submit";
			self.target_new_entry_button.value = "New Entry";
			self.target_new_entry_button = self.target_buttons_div.appendChild(self.target_new_entry_button);
			
			self.target_buttons_div.appendChild(document.createElement("br"));
			self.target_buttons_div.appendChild(document.createElement("br"));
			
			//entry buttons div
			self.entry_buttons_div = document.createElement("div");
			self.entry_buttons_div.id = form_div_id + '_entry_buttons_div';

			self.entry_buttons_div = self.form.appendChild(self.entry_buttons_div);
			
			self.new_entry_button = document.createElement("input");
			self.new_entry_button.id = form_div_id + '_new_entry_button';
			self.new_entry_button.type = "submit";
			self.new_entry_button.value = "Entry";
			self.new_entry_button = self.entry_buttons_div.appendChild(self.new_entry_button);
			
			self.entry_buttons_div.appendChild(document.createElement("br"));
			self.entry_buttons_div.appendChild(document.createElement("br"));
			
			self.edit_entry_button = document.createElement("input");
			self.edit_entry_button.id = form_div_id + '_edit_entry_button';
			self.edit_entry_button.type = "submit";
			self.edit_entry_button.value = "Edit";
			self.edit_entry_button = self.entry_buttons_div.appendChild(self.edit_entry_button);
			
			self.entry_buttons_div.appendChild(document.createElement("br"));
			self.entry_buttons_div.appendChild(document.createElement("br"));
			
			//category buttons div
			self.category_buttons_div = document.createElement("div");
			self.category_buttons_div.id = form_div_id + '_category_buttons_div';

			self.category_buttons_div = self.form.appendChild(self.category_buttons_div);
			
			self.new_category_button = document.createElement("input");
			self.new_category_button.id = form_div_id + '_new_category_button';
			self.new_category_button.type = "submit";
			self.new_category_button.value = "New Category";
			self.new_category_button = self.category_buttons_div.appendChild(self.new_category_button);
			
			self.category_buttons_div.appendChild(document.createElement("br"));
			self.category_buttons_div.appendChild(document.createElement("br"));
			
			self.edit_category_button = document.createElement("input");
			self.edit_category_button.id = form_div_id + '_edit_category_button';
			self.edit_category_button.type = "submit";
			self.edit_category_button.value = "Edit";
			self.edit_category_button = self.category_buttons_div.appendChild(self.edit_category_button);
			
			self.category_buttons_div.appendChild(document.createElement("br"));
			self.category_buttons_div.appendChild(document.createElement("br"));
			
			self.new_task_button = document.createElement("input");
			self.new_task_button.id = form_div_id + '_new_task_button';
			self.new_task_button.type = "submit";
			self.new_task_button.value = "New Task";
			self.new_task_button = self.category_buttons_div.appendChild(self.new_task_button);
			
			self.category_buttons_div.appendChild(document.createElement("br"));
			self.category_buttons_div.appendChild(document.createElement("br"));
			
			self.new_item_button = document.createElement("input");
			self.new_item_button.id = form_div_id + '_new_item_button';
			self.new_item_button.type = "submit";
			self.new_item_button.value = "New Item";
			self.new_item_button = self.category_buttons_div.appendChild(self.new_item_button);
			
			self.category_buttons_div.appendChild(document.createElement("br"));
			self.category_buttons_div.appendChild(document.createElement("br"));
			
			self.tree_view.Render(self.tree_view_disp_div);
			
			self.category_tab.Render(self.tree_category_div);
			
			self.items_tab.Render(self.tree_items_div.id);
			
			self.tasks_tab.Render(self.tree_tasks_div.id);
			
			self.tree_view.node_click_callback = self.Node_Click_Callback;
			
			//hide unselected divs
			self.Hide_All();
			$(self.category_buttons_div).fadeIn();
			
			$(self.entry_button).button();
			$(self.entry_button).click(function(event) {

				//ensure a normal postback does not occur
				event.preventDefault();
				
				self.Node_Entry_Button_Click();
				
			});
			
			$(self.edit_node_button).button();
			$(self.edit_node_button).click(function(event) {

				//ensure a normal postback does not occur
				event.preventDefault();
				
				self.Node_Edit_Button_Click();
				
			});
			
			$(self.new_node_target_button).button();
			$(self.new_node_target_button).click(function(event) {

				//ensure a normal postback does not occur
				event.preventDefault();
				
				self.Node_New_Target_Button_Click();
				
			});
			
			$(self.target_entry_button).button();
			$(self.target_entry_button).click(function(event){
				
				event.preventDefault();
				
				self.Target_Entry_Button_Click();
			});
			
			$(self.target_edit_button).button();
			$(self.target_edit_button).click(function(event){
				
				event.preventDefault();
				
				self.Target_Edit_Button_Click();
			});
			
			$(self.target_new_entry_button).button();
			$(self.target_new_entry_button).click(function(event){
				
				event.preventDefault();
				
				self.Target_New_Entry_Button_Click();
			});
			
			$(self.new_entry_button).button();
			$(self.new_entry_button).click(function(event){
				
				event.preventDefault();
				
				self.New_Entry_Button_Click();
			});
			
			$(self.edit_entry_button).button();
			$(self.edit_entry_button).click(function(event){
				
				event.preventDefault();
				
				self.Edit_Entry_Button_Click();
			});
			
			$(self.new_node_entry_button).button();
			$(self.new_node_entry_button).click(function(event){
				
				event.preventDefault();
				
				self.Node_New_Entry_Button_Click();
			});
			
			$(self.cancel_button).button();
			$(self.cancel_button).click(function(event) {

				//ensure a normal postback does not occur
				event.preventDefault();

				self.Cancel_Button_Click_Event();
			});
			
			$(self.new_category_button).button();
			$(self.new_category_button).click(function(event) {

				//ensure a normal postback does not occur
				event.preventDefault();

				//execute the click event
				self.Category_New_Button_Click();
			});
			
			$(self.edit_category_button).button();
			$(self.edit_category_button).click(function(event){
				
				//ensure a normal postback does not occur
				event.preventDefault();
				
				//execute the click event
				self.Category_Edit_Button_Click();
			});
			
			$(self.new_task_button).button();
			$(self.new_task_button).click(function(event) {

				//ensure a normal postback does not occur
				event.preventDefault();
				
				self.Category_New_Task_Button_Click();
				
			});
			
			$(self.new_item_button).button();
			$(self.new_item_button).click(function(event) {

				//ensure a normal postback does not occur
				event.preventDefault();
				
				self.Category_New_Item_Button_Click();
				
			});
			
		};
	}
	
	function Build_Entry_Tab()
	{
		var init_category_tab = category_form.Build_Category_Form();
		var init_items_tab = item_tab.Build_Item_Tab();
		var init_tasks_tab = task_tab.Build_Task_Tab();
		
		var entry_accordian = new Accordian();
		var init_tree_view = new tree_view.Tree_View();
		
		var built_entry_tab = new Entry_Tab(init_category_tab,init_items_tab,init_tasks_tab,entry_accordian,init_tree_view);
		
		return built_entry_tab;
	}
	
	return {
		Build_Entry_Tab: Build_Entry_Tab,
		Entry_Tab: Entry_Tab,
	};
});




