var TreeNode = Resnyanskiy.TreeNode;

/** This organizes the tabled data into a tree view.
 * @constructor Tree_View
 */
function Tree_View(div_id, data) {
	
	var self = this;
	
	//class variables
	self.selected_css_class = 'treeview-li-selected';
	self.last_selected_id = 0;
	self.div_id = div_id;
	self.tree_view_div = self.div_id + '_treeview_div';
	self.data = data;
	self.layer_is_enabled = [];
	self.tree_view_id_lookup = [];
	self.node_click_callback = function(info){};
	
	self.Refresh = function(new_data)
	{
		self.data = new_data;
			
		var should_restore_value = false;
		
		if(self.tree_view_id_lookup.length > 0)
		{
			var last_table = self.tree_view_id_lookup[self.last_selected_id].table;
			var last_row = self.tree_view_id_lookup[self.last_selected_id].row;
			
			should_restore_value = true;
		}
		
		self.Force_Tree_Refresh();
		
		if(should_restore_value)
		{
			self.Expand_All_Node_Parents(last_table, last_row);
		}
		else
		{
			self.tree.updateNode(self.tree_nodes.id,[],true);
			self.Select_Node(self.tree_nodes.id);
		}
		
	};
	
	self.Refresh_From_Diff = function(diff, new_data)
	{
		
		for(table in diff['data'])
		{
			if(diff['data'][table].length > 0)
			{
				self.Refresh(new_data);
				break;
			}
		}
		
	};
	
	self.Node_Click_Callback = function(id)
	{
		info = self.tree_view_id_lookup[id];
			
		self.Select_Node(id);
		
		//execute callback
		self.node_click_callback(info);
	};
	
	self.Force_Tree_Refresh = function()
	{
		document.getElementById(self.tree_view_div).innerHTML = "";
		
		delete self.tree_view_id_lookup;
		delete self.tree_nodes;
		delete self.tree;
		
		//re-initialize the lookup
		self.tree_view_id_lookup = [];
		
		self.tree_nodes = self.Create_Category_Tree_Nodes(self.data);
		
		self.tree = new Resnyanskiy.Tree(document.getElementById(self.tree_view_div),[self.tree_nodes]);
		self.last_selected_id = 0;
		
		self.tree.onNodeClick = self.Node_Click_Callback;
	};
	
	self.Select_Node = function(id)
	{
		if(self.last_selected_id !== id)
		{
			
			self.Unselect_Node();
			
			self.last_selected_id = id;
			
			previous_class_name = document.getElementById('li-' + id).className;
			
			if(previous_class_name.indexOf(self.selected_css_class) == -1)
			{
				document.getElementById('li-' + id).className += ' ' + self.selected_css_class;
			}
		}
		else
		{
			//expand/collapse the children
			self.tree.updateNode(id,[],true);
		}
		
		
		$('.resnyanskiy-tree > ul.container li > span.icon').css( "background-color" , "red");
		$('.resnyanskiy-tree > ul.container li > span.icon').css( "border-radius" , "10px");
		
	};
	
	self.Unselect_Node = function(){
		
		if (document.getElementById('li-' + self.last_selected_id)) {
			
			previous_class_name = document.getElementById('li-' + self.last_selected_id).className;
			previous_class_name = previous_class_name.replace(" " + self.selected_css_class,""); 
			document.getElementById('li-' + self.last_selected_id).className = previous_class_name;
			
		}
		
		self.last_selected_id = 0;
	};
	
	self.Get_ID_From_Table_Row = function(table,row)
	{
		
		var found_key = -1;
		
		for(var key in self.tree_view_id_lookup)
		{
			if(self.tree_view_id_lookup[key].table == table)
			{
				
				if(table == 'items')
				{
					if(self.tree_view_id_lookup[key].row.item_id == row.item_id)
					{
						found_key = key;
						break;
					}
				}
				else if(table == 'item_targets')
				{
					if(self.tree_view_id_lookup[key].row.item_target_id == row.item_target_id)
					{
						found_key = key;
						break;
					}
				}
				else if(table == 'item_entries')
				{
					if(self.tree_view_id_lookup[key].row.item_entry_id == row.item_log_id)
					{
						found_key = key;
						break;
					}
				}
				else if(table == 'tasks')
				{
					if(self.tree_view_id_lookup[key].row.task_id == row.task_id)
					{
						found_key = key;
						break;
					}
				}
				else if(table == 'task_targets')
				{
					
					if(self.tree_view_id_lookup[key].row.task_schedule_id == row.task_schedule_id)
					{
						found_key = key;
						break;
					}
				}
				else if(table == 'task_entries')
				{
					if(self.tree_view_id_lookup[key].row.task_log_id == row.task_log_id)
					{
						
						found_key = key;
						break;
					}
				}
				
				
			}
		}
		
		return found_key;
	};
	
	self.Expand_All_Node_Parents = function(table, row)
	{
		
		self.Force_Tree_Refresh();
		
		var parents = [];
		
		id = self.Get_ID_From_Table_Row(table,row);
		
		if(id !== -1)
		{
			var current_lookup = self.tree_view_id_lookup[id];
		
			while(current_lookup.parent_id !== 0)
			{
				
				parents.push(current_lookup.parent_id);
				
				current_lookup = self.tree_view_id_lookup[current_lookup.parent_id];
			}
			
			for(var i = 0; i < parents.length; i++)
			{
				var index = parents.length - i - 1;
				
				self.tree.updateNode(parents[index],[],true);
				
				
			}
			
			self.Select_Node(id);
		}
		else
		{
			self.tree.updateNode(self.tree_nodes.id,[],true);
			self.Select_Node(self.tree_nodes.id);
		}
		
		
	};
	
	self.Apply_Filter = function(layer_name, is_enabled)	{
		
		layer_is_enabled[layer_name] = is_enabled;
		
		
	};
	
	self.Create_Category_Tree_Node_Children = function(data, node)
	{
		
		return_array = [];
		categories_table = data["Categories"];
		
		node.hasChildren = true;
		
		task_node = self.Create_Task_Tree_Nodes(data,node.category_id);
		self.tree_view_id_lookup[task_node.id].parent_id = node.id;
		node.addItem(task_node);
		item_node = self.Create_Item_Tree_Nodes(data,node.category_id);
		self.tree_view_id_lookup[item_node.id].parent_id = node.id;
		node.addItem(item_node);
		
		for (var i=0; i < categories_table.length; i++) {
		
			var current_row = categories_table[i];
			
			if(current_row["Parent Category ID"] == node.category_id)
			{
				random_id = self.Generate_Hashed_ID('categories', current_row["Category ID"]);
				var new_tree_row = new TreeNode(random_id, current_row["Name"], false);
				
				self.tree_view_id_lookup[random_id] = 
					{
						"parent_id" : node.id,
						"table" : 'categories',
						"row" : current_row
					};
				
				new_tree_row.category_id = current_row["Category ID"];
				
				node.hasChildren = true;
				
				self.Create_Category_Tree_Node_Children(data,new_tree_row);
				
				if(new_tree_row.hasChildren)
				{
					new_tree_row.isBranch = true;
				}
				
				node.addItem(new_tree_row);

			}
		}
		
	};
	
	self.Remove_Category_Tree_Node_Children = function(data, node)
	{
		
		//TODO: implement
		
	};
	
	self.Create_Category_Tree_Nodes = function(data)
	{
		processed_categories = [];
		
		random_id = self.Generate_Hashed_ID('categories', 0);
		var primary_node = new TreeNode(random_id, "Categories", true);
		
		self.tree_view_id_lookup[random_id] = 
			{
				"parent_id" : 0,
				"table" : 'categories',
				"row" : {}
			};
		
		primary_node.category_id = 0;
		
		self.Create_Category_Tree_Node_Children(data,primary_node);
		
		return primary_node;
	};
	
	self.Create_Task_Entries_Tree_Node_Children = function(data, node, task_id, task_target_id)
	{
		task_entries = data.task_entries;
		
		for(var i = 0; i < task_entries.length; i++)
		{
			var current_entry_row = task_entries[i];
			
			if(current_entry_row["task_target_id"] == task_target_id && current_entry_row["task_id"] == task_id)
			{
				node.hasChildren = true;
				
				random_id = self.Generate_Hashed_ID('task_entries', current_entry_row['task_log_id']);
				var new_tree_row = new TreeNode(random_id, current_entry_row["start_time"], false);
				
				self.tree_view_id_lookup[random_id] = 
				{
					"parent_id" : node.id,
					"table" : 'task_entries',
					"row" : current_entry_row
				};
				
				node.addItem(new_tree_row);
			}
		}
		
	};
	
	self.Remove_Task_Entries_Tree_Node_Children = function(node, task_id, task_target_id)
	{
		//TODO: implement
	};
	
	self.Create_Task_Target_Recurring_Tree_Node_Children = function(data, node, schedule_id)
	{
		task_targets = data.task_targets;
		task_entries = data.task_entries;
	
		for(var i = 0; i < task_targets.length; i++)
		{
			var current_target_row = task_targets[i];
			
			if(current_target_row["recurrance_child_id"] == schedule_id)
			{
				node.hasChildren = true;
				
				random_id = self.Generate_Hashed_ID('task_targets',current_target_row['task_schedule_id']);
				var new_tree_row = new TreeNode(random_id, current_target_row["scheduled_time"], false);
				
				self.tree_view_id_lookup[random_id] = 
				{
					"parent_id" : node.id,
					"table" : 'task_targets',
					"row" : current_target_row
				};
				
				self.Create_Task_Entries_Tree_Node_Children(data,new_tree_row, current_target_row["task_id"], current_target_row["task_schedule_id"]);
				
				if(new_tree_row.hasChildren)
				{
					new_tree_row.isBranch = true;
				}
				
				node.addItem(new_tree_row);
				
			}
		}
	};
	
	self.Remove_Task_Target_Recurring_Tree_Node_Children = function(node, schedule_id)
	{
		//TODO: implement
	};
	
	self.Create_Task_Tree_Node_Children = function(data, node, category_filter)
	{
		return_array = [];
		task_table = data.tasks;
		task_targets = data.task_targets;
		task_entries = data.task_entries;
		
		for(var i = 0; i < task_table.length; i++)
		{
			var current_item_row = task_table[i];
			
			if(current_item_row["category_id"] == category_filter)
			{
				random_id = self.Generate_Hashed_ID('tasks',current_item_row['task_id']);
				
				var new_item_row = new TreeNode(random_id, current_item_row["name"], false);
				
				self.tree_view_id_lookup[random_id] = 
				{
					"parent_id" : node.id,
					"table" : 'tasks',
					"row" : current_item_row
				};
				
				random_id = self.Generate_Hashed_ID('task_targets_folder',current_item_row['task_schedule_id']);
				var new_item_row_targets = new TreeNode(random_id, "Targets", false);
				
				self.tree_view_id_lookup[random_id] = 
					{
						"parent_id" : new_item_row.id,
						"table" : 'task_targets',
						"row" : {}
					};
				
				random_id = self.Generate_Hashed_ID('task_entries_folder',current_item_row['task_log_id']);
				var new_item_row_entries = new TreeNode(random_id, "Entries", false);
				
				self.tree_view_id_lookup[random_id] = 
					{
						"parent_id" : new_item_row.id,
						"table" : 'task_entries',
						"row" : {}
					};
				
				new_item_row.hasChildren = false;
				
				self.Create_Task_Entries_Tree_Node_Children(data,new_item_row_entries,current_item_row["task_id"],0);
				
				
				for(var j = 0; j < task_targets.length; j++)
				{
					var current_target_row = task_targets[j];
					
					if(current_target_row["task_id"] == current_item_row["task_id"] && current_target_row["recurrance_child_id"] == 0)
					{
						new_item_row_targets.hasChildren = true;
						
						random_id = self.Generate_Hashed_ID('task_targets',current_target_row['task_schedule_id']);
						
						var new_tree_row = new TreeNode(random_id, current_target_row["scheduled_time"], false);
						
						self.tree_view_id_lookup[random_id] = 
						{
							"parent_id" : new_item_row_targets.id,
							"table" : 'task_targets',
							"row" : current_target_row
						};
	
						self.Create_Task_Target_Recurring_Tree_Node_Children(data, new_tree_row, current_target_row["task_schedule_id"]);
						
						if(new_tree_row.hasChildren)
						{
							new_tree_row.isBranch = true;
						}
						
						new_item_row_targets.addItem(new_tree_row);
						
					}
				}
				
				if(new_item_row_targets.hasChildren)
				{
					new_item_row_targets.isBranch = true;
					new_item_row.hasChildren = true;
					new_item_row.addItem(new_item_row_targets);
				}
				
				if(new_item_row_entries.hasChildren)
				{
					new_item_row_entries.isBranch = true;
					new_item_row.hasChildren = true;
					new_item_row.addItem(new_item_row_entries);
				}
				
				//new_item_row.addItem(new_item_row_entries);
				
				if(new_item_row.hasChildren)
				{
					new_item_row.isBranch = true;
				}
	
				node.addItem(new_item_row);
				
				node.hasChildren = true;
			}
			
			
		}
		
	};
	
	self.Remove_Task_Tree_Node_Children = function()
	{
		//TODO: implement
	};
	
	self.Create_Task_Tree_Nodes = function(data, category_filter)
	{
		
		return_array = [];
		processed_categories = [];
		
		random_id = self.Generate_Hashed_ID('category_tasks',category_filter);
		
		var primary_node = new TreeNode(random_id, "Tasks", false);
		
		self.tree_view_id_lookup[random_id] = 
		{
			"parent_id" : 0,
			"table" : 'tasks',
			"row" : {}
		};
		
		self.Create_Task_Tree_Node_Children(data,primary_node,category_filter);
		
		if(primary_node.hasChildren)
		{
			primary_node.isBranch = true;
		}
		
		return primary_node;
		
	};
	
	self.Remove_Task_Tree_Nodes = function(category_filter)
	{
		//TODO: implement
	};
	
	self.Create_Item_Entries_Tree_Node_Children = function(data, node, item_id, item_target_id)
	{
		item_entries = data.item_entries;
		
		for(var i = 0; i < item_entries.length; i++)
		{
			var current_entry_row = item_entries[i];
			
			if(current_entry_row["item_target_id"] == item_target_id && current_entry_row["item_id"] == item_id)
			{
				node.hasChildren = true;
				
				random_id = self.Generate_Hashed_ID('item_entries',current_entry_row['item_log_id']);
				
				var new_tree_row = new TreeNode(random_id, current_entry_row["time"], false);
				
				self.tree_view_id_lookup[random_id] = 
				{
					"parent_id" : node.id,
					"table" : 'item_entries',
					"row" : current_entry_row
				};
				
				node.addItem(new_tree_row);
			}
		}
	};
	
	self.Remove_Item_Entries_Tree_Node_Children = function()
	{
		//TODO: implement
	};
	
	self.Create_Item_Target_Recurring_Tree_Node_Children = function(data, node, schedule_id)
	{
		item_targets = data.item_targets;
		item_entries = data.item_entries;
	
		for(var i = 0; i < item_targets.length; i++)
		{
			var current_target_row = item_targets[i];
			
			if(current_target_row["recurrance_child_id"] == schedule_id)
			{
				node.hasChildren = true;
				
				random_id = self.Generate_Hashed_ID('item_targets',current_target_row['item_target_id']);
				
				var new_tree_row = new TreeNode(random_id, current_target_row["start_time"], false);
				
				self.tree_view_id_lookup[random_id] = 
				{
					"parent_id" : node.id,
					"table" : 'item_targets',
					"row" : current_target_row
				};
				
				self.Create_Item_Entries_Tree_Node_Children(data,new_tree_row, current_target_row["item_id"], current_target_row["item_target_id"]);
				
				if(new_tree_row.hasChildren)
				{
					new_tree_row.isBranch = true;
				}
				
				node.addItem(new_tree_row);
				
			}
		}
	};
	
	self.Remove_Item_Target_Recurring_Tree_Node_Children = function()
	{
		//TODO: implement
	};
	
	self.Create_Item_Tree_Node_Children = function(data,node,category_filter)
	{
		
		item_table = data.items;
		item_targets = data.item_targets;
		item_entries = data.item_entries;
		
		for(var i = 0; i < item_table.length; i++)
		{
			var current_item_row = item_table[i];
			
			if(current_item_row["category_id"] == category_filter)
			{
				
				random_id = self.Generate_Hashed_ID('items',current_item_row['item_id']);
				
				var new_item_row = new TreeNode(random_id, current_item_row["item_name"], false);
				
				self.tree_view_id_lookup[random_id] = 
				{
					"parent_id" : node.id,
					"table" : 'items',
					"row" : current_item_row
				};
				
				random_id = self.Generate_Hashed_ID('item_targets',current_item_row['item_target_id']);
				var new_item_row_targets = new TreeNode(random_id, "Targets", false);
				
				self.tree_view_id_lookup[random_id] = 
					{
						"parent_id" : new_item_row.id,
						"table" : 'item_targets',
						"row" : {}
					};
				
				random_id = self.Generate_Hashed_ID('item_entries',current_item_row['item_log_id']);
				var new_item_row_entries = new TreeNode(random_id, "Entries", false);
				
				self.tree_view_id_lookup[random_id] = 
					{
						"parent_id" : new_item_row.id,
						"table" : 'item_entries',
						"row" : {}
					};
				
				new_item_row.hasChildren = false;
				
				self.Create_Item_Entries_Tree_Node_Children(data,new_item_row_entries,current_item_row["item_id"],0);
				
				for(var j = 0; j < item_targets.length; j++)
				{
					var current_target_row = item_targets[j];
					
					if(current_target_row["item_id"] == current_item_row["item_id"] && current_target_row["recurring_child_id"] == 0)
					{
						new_item_row_targets.hasChildren = true;
						
						random_id = self.Generate_Hashed_ID('item_targets',current_target_row['item_target_id']);
						
						var new_tree_row = new TreeNode(random_id, current_target_row["start_time"], false);
						
						self.tree_view_id_lookup[random_id] = 
						{
							"parent_id" : new_item_row_targets.id,
							"table" : 'item_targets',
							"row" : current_target_row
						};
						
						self.Create_Item_Target_Recurring_Tree_Node_Children(data, new_tree_row, current_target_row["item_target_id"]);
						
						if(new_tree_row.hasChildren)
						{
							new_tree_row.isBranch = true;
						}
						
						new_item_row_targets.addItem(new_tree_row);
						
					}
				}
				
				if(new_item_row_targets.hasChildren)
				{
					new_item_row_targets.isBranch = true;
					new_item_row.hasChildren = true;
					new_item_row.addItem(new_item_row_targets);
				}
				
				if(new_item_row_entries.hasChildren)
				{
					new_item_row_entries.isBranch = true;
					new_item_row.hasChildren = true;
					new_item_row.addItem(new_item_row_entries);
				}
				
				//new_item_row.addItem(new_item_row_entries);
				
				if(new_item_row.hasChildren)
				{
					new_item_row.isBranch = true;
				}
	
				node.addItem(new_item_row);
				
				node.hasChildren = true;
			}
			
			
		}
		
	};
	
	self.Remove_Item_Tree_Node_Children = function()
	{
		//TODO: implement
	};
	
	self.Create_Item_Tree_Nodes = function(data, category_filter)
	{
		
		return_array = [];
		processed_categories = [];
		
		random_id = self.Generate_Hashed_ID('category_items',category_filter);
		
		var primary_node = new TreeNode(random_id, "Items", false);
		
		self.tree_view_id_lookup[random_id] = 
		{
			"parent_id" : 0,
			"table" : 'items',
			"row" : {}
		};
		
		self.Create_Item_Tree_Node_Children(data,primary_node,category_filter);
		
		if(primary_node.hasChildren)
		{
			primary_node.isBranch = true;
		}
		
		return primary_node;
		
	};
	
	self.Remove_Item_Tree_Nodes = function(){
		
		//TODO: implement
		
	};
	
	self.Generate_Hashed_ID = function(table, index)
	{
		var str = table + index;
		var hash = 0;
		
	    if (str.length == 0) return hash;
	    
	    for (i = 0; i < str.length; i++) {
	    	
	        char = str.charCodeAt(i);
	        hash = ((hash<<5)-hash)+char;
	        hash = hash & hash; // Convert to 32bit integer
	        
	    }
	    
	    return Math.abs(hash);
		
	};
	
	//render function (div must already exist)
	self.Render = function() {
		
		document.getElementById(self.div_id).innerHTML += '<div id="'+self.tree_view_div+'"></div>';
	};
}