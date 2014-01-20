var TreeNode = Resnyanskiy.TreeNode;

/** This organizes the tabled data into a tree view.
 * @constructor Tree_View
 */
function Tree_View(div_id, data) {
	
	var self = this;
	
	//class variables
	self.div_id = div_id;
	self.tree_view_div = self.div_id + '_treeview_div';
	self.tree_view_div1 = self.div_id + '_treeview_div1';
	self.data = data;
	self.layer_is_enabled = [];
	self.node_click_callback = function(id){};
	
	self.Refresh = function(new_data)
	{
		self.data = new_data;
		
		
		
		self.tree_nodes = self.Create_Category_Tree_Nodes(self.data.categories);
		self.item_tree_nodes = self.Create_Task_Tree_Nodes(self.data.tasks,self.data.task_targets,self.data.task_entries);
		
		document.getElementById(self.tree_view_div).innerHTML = "";
		document.getElementById(self.tree_view_div1).innerHTML = "";
		
		self.tree = new Resnyanskiy.Tree(document.getElementById(self.tree_view_div),self.tree_nodes);
		self.tree_items = new Resnyanskiy.Tree(document.getElementById(self.tree_view_div1),self.item_tree_nodes); 
		
		self.tree_items.onNodeClick = function(id)
		{
			self.node_click_callback(id);
			alert(id);
		};
		
		self.tree.onNodeClick = function(id)
		{
			self.node_click_callback(id);
			alert(id);
		};
	};
	
	self.Apply_Filter = function(layer_name, is_enabled)	{
		
		layer_is_enabled[layer_name] = is_enabled;
		
		
	};
	
	self.Create_Tree_Nodes = function(table, id_column, name_column){
		
		return_array = [];
		
		
		
		for (var i=0; i < table.length; i++) {
		

			var current_row = table[i];
			
			var new_tree_row = new TreeNode(current_row[id_column], current_row[name_column], false);
			
			return_array.push(new_tree_row);
		}
		
		return return_array;
	};
	
	self.Create_Category_Tree_Node_Children = function(categories_table, node)
	{
		
		return_array = [];
		
		
		
		node.hasChildren = false;
		
		for (var i=0; i < categories_table.length; i++) {
		
			var current_row = categories_table[i];
			
			if(current_row["parent_category_id"] == node.id)
			{
				var new_tree_row = new TreeNode(current_row["category_id"], current_row["name"], false);
				
				node.hasChildren = true;
				
				self.Create_Category_Tree_Node_Children(categories_table,new_tree_row);
				
				if(new_tree_row.hasChildren)
				{
					new_tree_row.isBranch = true;
				}
				
				node.addItem(new_tree_row);

			}
		}
		
	};
	
	self.Create_Category_Tree_Nodes = function(categories_table)
	{
		return_array = [];
		processed_categories = [];
		
		
		
		var primary_node = new TreeNode(0, "Categories", true);
		
		self.Create_Category_Tree_Node_Children(categories_table,primary_node);
		
		return_array = [primary_node];
		
		return return_array;
	};
	
	self.Create_Task_Target_Entries_Tree_Node_Children = function(item_entries, node)
	{
		for(var i = 0; i < item_entries.length; i++)
		{
			var current_entry_row = item_entries[i];
			
			if(current_entry_row["task_target_id"] == node.id)
			{
				node.hasChildren = true;
				
				var new_tree_row = new TreeNode(current_entry_row["task_target_id"], current_entry_row["start_time"], false);
				
				node.addItem(new_tree_row);
			}
		}
		
	};
	
	self.Create_Task_Target_Tree_Node_Children = function(item_targets, item_entries, node)
	{
	
		for(var i = 0; i < item_targets.length; i++)
		{
			var current_target_row = item_targets[i];
			
			if(current_target_row["recurrance_child_id"] == node.id)
			{
				node.hasChildren = true;
				
				var new_tree_row = new TreeNode(current_target_row["task_schedule_id"], current_target_row["scheduled_time"], false);
				
				self.Create_Task_Target_Entries_Tree_Node_Children(item_entries,new_tree_row);
				
				if(new_tree_row.hasChildren)
				{
					new_tree_row.isBranch = true;
				}
				
				node.addItem(new_tree_row);
				
			}
		}
	};
	
	self.Create_Task_Tree_Node_Children = function(items_table, item_targets, item_entries, node)
	{
		return_array = [];
		
		
		
		for(var i = 0; i < items_table.length; i++)
		{
			var current_item_row = items_table[i];
			
			var targets_id = Math.floor((Math.random()*1000000)+1); 
			var new_item_row = new TreeNode(targets_id, current_item_row["name"], false);
			var new_item_row_targets = new TreeNode(current_item_row["task_id"], "Targets", false);
			new_item_row.hasChildren = false;
			
			for(var j = 0; j < item_targets.length; j++)
			{
				var current_target_row = item_targets[j];
				
				if(current_target_row["task_id"] == current_item_row["task_id"] && current_target_row["recurrance_child_id"] == 0)
				{
					new_item_row_targets.hasChildren = true;
					
					var new_tree_row = new TreeNode(current_target_row["task_schedule_id"], current_target_row["scheduled_time"], false);
					
					self.Create_Task_Target_Entries_Tree_Node_Children(item_entries,new_tree_row);

					self.Create_Task_Target_Tree_Node_Children(item_targets, item_entries, new_tree_row);
					
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
			
			//new_item_row.addItem(new_item_row_entries);
			
			if(new_item_row.hasChildren)
			{
				new_item_row.isBranch = true;
			}

			node.addItem(new_item_row);
		}
		
	};
	
	self.Create_Task_Tree_Nodes = function(items_table, item_targets, item_entries)
	{
		
		return_array = [];
		processed_categories = [];
		
		
		
		var primary_node = new TreeNode(0, "Items", true);
		
		self.Create_Task_Tree_Node_Children(items_table, item_targets, item_entries,primary_node);
		
		return_array = [primary_node];
		
		return return_array;
		
	};
	
	//render function (div must already exist)
	self.Render = function() {
		
		document.getElementById(self.div_id).innerHTML += '<div id="'+self.tree_view_div+'"></div>';
		document.getElementById(self.div_id).innerHTML += '<div id="'+self.tree_view_div1+'"></div>';
	};
}