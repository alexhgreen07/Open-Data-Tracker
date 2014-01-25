var TreeNode = Resnyanskiy.TreeNode;

/** This organizes the tabled data into a tree view.
 * @constructor Tree_View
 */
function Tree_View(div_id, data) {
	
	var self = this;
	
	//class variables
	self.div_id = div_id;
	self.tree_view_div = self.div_id + '_treeview_div';
	self.data = data;
	self.layer_is_enabled = [];
	self.node_click_callback = function(id){};
	
	self.Refresh = function(new_data)
	{
		self.data = new_data;
		
		self.tree_nodes = self.Create_Category_Tree_Nodes(self.data);
		
		document.getElementById(self.tree_view_div).innerHTML = "";
		
		self.tree = new Resnyanskiy.Tree(document.getElementById(self.tree_view_div),[self.tree_nodes]);
		
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
	
	self.Create_Category_Tree_Node_Children = function(data, node)
	{
		
		return_array = [];
		categories_table = data.categories;
		
		node.hasChildren = true;
		
		task_node = self.Create_Task_Tree_Nodes(data,node.category_id);
		node.addItem(task_node);
		
		for (var i=0; i < categories_table.length; i++) {
		
			var current_row = categories_table[i];
			
			if(current_row["parent_category_id"] == node.category_id)
			{
				var new_tree_row = new TreeNode(self.Generate_Random_ID(), current_row["name"], false);
				
				new_tree_row.category_id = current_row["category_id"];
				
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
	
	self.Create_Category_Tree_Nodes = function(data)
	{
		processed_categories = [];
		
		var primary_node = new TreeNode(self.Generate_Random_ID(), "Categories", true);
		
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
				
				var new_tree_row = new TreeNode(self.Generate_Random_ID(), current_entry_row["start_time"], false);
				
				node.addItem(new_tree_row);
			}
		}
		
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
				
				var new_tree_row = new TreeNode(self.Generate_Random_ID(), current_target_row["scheduled_time"], false);
				
				self.Create_Task_Entries_Tree_Node_Children(data,new_tree_row, current_target_row["task_id"], current_target_row["task_schedule_id"]);
				
				if(new_tree_row.hasChildren)
				{
					new_tree_row.isBranch = true;
				}
				
				node.addItem(new_tree_row);
				
			}
		}
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
				var new_item_row = new TreeNode(self.Generate_Random_ID(), current_item_row["name"], false);
				var new_item_row_targets = new TreeNode(self.Generate_Random_ID(), "Targets", false);
				var new_item_row_entries = new TreeNode(self.Generate_Random_ID(), "Entries", false);
				new_item_row.hasChildren = false;
				
				self.Create_Task_Entries_Tree_Node_Children(data,new_item_row_entries,current_item_row["task_id"],0);
				
				for(var j = 0; j < task_targets.length; j++)
				{
					var current_target_row = task_targets[j];
					
					if(current_target_row["task_id"] == current_item_row["task_id"] && current_target_row["recurrance_child_id"] == 0)
					{
						new_item_row_targets.hasChildren = true;
						
						var new_tree_row = new TreeNode(self.Generate_Random_ID(), current_target_row["scheduled_time"], false);
	
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
	
	self.Create_Task_Tree_Nodes = function(data, category_filter)
	{
		
		return_array = [];
		processed_categories = [];
		
		var primary_node = new TreeNode(self.Generate_Random_ID(), "Tasks", false);
		
		self.Create_Task_Tree_Node_Children(data,primary_node,category_filter);
		
		if(primary_node.hasChildren)
		{
			primary_node.isBranch = true;
		}
		
		return primary_node;
		
	};
	
	self.Generate_Random_ID = function()
	{
		
		random_id = Math.random() * 100000000;
		random_id = Math.round(random_id);
		
		return random_id;
		
	};
	
	//render function (div must already exist)
	self.Render = function() {
		
		document.getElementById(self.div_id).innerHTML += '<div id="'+self.tree_view_div+'"></div>';
	};
}