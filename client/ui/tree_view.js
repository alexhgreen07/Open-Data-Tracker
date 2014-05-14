define(['core/logger','jquery.ui','jquery.ui.jstree'],function(logger,$){
	
	return {
		/** This organizes the tabled data into a tree view.
		 * @constructor Tree_View
		 */
		Tree_View: function() {
			
			var self = this;
			
			//class variables
			self.selected_css_class = 'treeview-li-selected';
			self.last_selected_id = 0;
			self.tree_view_div = self.div_id + '_treeview_div';
			self.layer_is_enabled = [];
			self.tree_view_hash_lookup = [];
			self.node_click_callback = function(info){};
			
			self.Refresh = function(new_data)
			{
				
				self.data = new_data;
					
				var should_restore_value = false;
				
				if(self.tree_view_hash_lookup.length > 0)
				{
					var last_table = self.tree_view_hash_lookup[self.last_selected_id].table;
					var last_row = self.tree_view_hash_lookup[self.last_selected_id].row;
					
					should_restore_value = true;
				}
				
				self.Force_Tree_Refresh();
				
				if(should_restore_value)
				{
					self.Expand_All_Node_Parents(last_table, last_row);
				}
				else
				{
					self.Set_Tree_Node_Expanded(self.tree_nodes.id,true);
					self.Select_Node(self.tree_nodes.id);
				}
				
			};
			
			self.Refresh_From_Diff = function(diff, new_data)
			{
				
				self.data = new_data;
				
				var has_updated = false;
				
				var should_restore_value = false;
				
				//alert(JSON.stringify(diff));
				
				if(self.tree_view_hash_lookup.length > 0)
				{
					
					should_restore_value = true;
				}
				
				var diff_array = [];
				
				for(table_key in diff['data'])
				{
					var table = diff['data'][table_key];
					
					for(row_key in table)
					{
						diff_array.push({table_key: table_key, operation:table[row_key].operation, row: table[row_key].row});
					}
					
				}
				
				if(diff_array.length > 0)
				{
					has_updated = true;
					diff_array.sort(function(a,b){
						
						var node_id_a = self.Get_ID_From_Table_Row(a.table_key, a.row);
						var node_id_b = self.Get_ID_From_Table_Row(b.table_key, b.row);
						
						var nest_level_a = self.Get_Nest_Level_From_Hash_Id(node_id_a);
						var nest_level_b = self.Get_Nest_Level_From_Hash_Id(node_id_b);
						
						return nest_level_b - nest_level_a;
						
					});
					
					
					//execute removals diff to tree_view_hash_lookup
					for(var row_key in diff_array)
					{
						var table_key = diff_array[row_key].table_key;
						var diff_row = diff_array[row_key];
						var row = diff_row['row'];
						var random_id = self.Get_ID_From_Table_Row(table_key,row);
						
						if(diff_row.operation == 'remove')
						{
							//remove old entry
							var old_entry = self.tree_view_hash_lookup[random_id];
							self.Remove_Tree_Node(old_entry);
							delete self.tree_view_hash_lookup[random_id];
						}
					}
										
					//apply diff to tree_view_hash_lookup
					for(var row_key in diff_array)
					{
						var table_key = diff_array[row_key].table_key;
						var diff_row = diff_array[row_key];
						var row = diff_row['row'];
						var random_id = self.Get_ID_From_Table_Row(table_key,row);
						
						if(diff_row.operation == 'insert')
						{
							//add new entry
							var new_lookup_entry = self.Create_Tree_Node_Lookup_Entry(table_key,row);
							self.tree_view_hash_lookup[new_lookup_entry.node_id] = new_lookup_entry;
							self.Insert_Tree_Node(new_lookup_entry);
						}
					}

					for(var row_key in diff_array)
					{
						var table_key = diff_array[row_key].table_key;
						var diff_row = diff_array[row_key];
						var row = diff_row['row'];
						var random_id = self.Get_ID_From_Table_Row(table_key,row);
						
						if(diff_row.operation == 'update')
						{
							//update old entry
							var new_lookup_entry = self.Create_Tree_Node_Lookup_Entry(table_key,row);
							self.tree_view_hash_lookup[new_lookup_entry.node_id] = new_lookup_entry;
							
							self.Update_Tree_Node(new_lookup_entry);
						}
					}
					
				}
				
				if(has_updated)
				{
					if(self.last_selected_id in self.tree_view_hash_lookup)
					{
						//toggle node to refresh
						self.Select_Node(self.last_selected_id);
						self.Select_Node(self.last_selected_id);
					}
					else
					{
						self.Set_Tree_Node_Expanded(self.tree_nodes.id,false);
						self.Set_Tree_Node_Expanded(self.tree_nodes.id,true);
						self.Select_Node(self.tree_nodes.id);
					}
				}
				
			};
			
			self.Node_Click_Callback = function(id)
			{
				info = self.tree_view_hash_lookup[id];
					
				self.Select_Node(id);
				
				//execute callback
				self.node_click_callback(info);
			};
			
			self.Force_Tree_Refresh = function()
			{
				
				document.getElementById(self.tree_view_div).innerHTML = "";
				
				delete self.tree_view_hash_lookup;
				delete self.tree_nodes;
				delete self.tree;
				
				//re-initialize the lookup
				self.tree_view_hash_lookup = [];
				
				document.getElementById(self.div_id).innerHTML = '<ul id="'+self.tree_view_div+'"></ul>';
				$('#' + self.div_id).jstree({ 'core' : {
					'check_callback' : function (operation, node, node_parent, node_position, more) {
						return true;
					},
				    'data' : []
				       } });
				self.jstree = $('#' + self.div_id).jstree(true);
								
				//self.tree_nodes = self.Create_Category_Tree_Nodes(self.data);
				self.tree_nodes = self.Create_Tree(self.data);
				
				self.last_selected_id = 0;
				
				$('#' + self.div_id).on('select_node.jstree', function (e, data) {
					
					self.Node_Click_Callback(data.node.id);
					
				});
				
				//self.tree.onNodeClick = self.Node_Click_Callback;
				
			};
			
			self.Select_Node = function(id)
			{
				/*
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
					self.Toggle_Tree_Node_Expanded(id);
				}
				
				
				//add colours to the treeview according to type
				for(var key in self.tree_view_hash_lookup)
				{
					var current_lookup = self.tree_view_hash_lookup[key];
					var element_id = 'li-' + key;
					
					if(document.getElementById(element_id))
					{	
						if(current_lookup.table == 'tasks')
						{
							$('#' + element_id).children("span.icon").addClass('task');
						}
						else if(current_lookup.table == 'task_targets')
						{
							$('#' + element_id).children("span.icon").addClass('task_target');
						}
						else if(current_lookup.table == 'task_entries')
						{
							$('#' + element_id).children("span.icon").addClass('task_entry');
						}
						else if(current_lookup.table == 'items')
						{
							$('#' + element_id).children("span.icon").addClass('item');
						}
						else if(current_lookup.table == 'item_targets')
						{
							$('#' + element_id).children("span.icon").addClass('item_target');
						}
						else if(current_lookup.table == 'item_entries')
						{
							$('#' + element_id).children("span.icon").addClass('item_entry');
						}
						
					}
					
				}
				
				
				*/
			};
			
			self.Set_Tree_Node_Expanded = function(id, expanded)
			{
				/*
				if(id in self.tree_view_hash_lookup)
				{
					var lookup_entry = self.tree_view_hash_lookup[id];
					
					if(lookup_entry.is_expanded != expanded)
					{
						//toggle expanded
						self.tree.updateNode(id,[],true);
						lookup_entry.is_expanded = expanded;
					}
				}
				else
				{
					alert('Set_Tree_Node_Expanded: Tree node not in list.');
				}
				*/
			};
			
			self.Toggle_Tree_Node_Expanded = function(id)
			{
				/*
				if(id in self.tree_view_hash_lookup)
				{
					var lookup_entry = self.tree_view_hash_lookup[id];
					
					//toggle expanded
					self.tree.updateNode(id,[],true);
					lookup_entry.is_expanded = !lookup_entry.is_expanded;
					
				}
				else
				{
					alert('Toggle_Tree_Node_Expanded: Tree node not in list.');
				}
				*/
			};
			
			self.Unselect_Node = function(){
				
				/*
				if (document.getElementById('li-' + self.last_selected_id)) {
					
					previous_class_name = document.getElementById('li-' + self.last_selected_id).className;
					previous_class_name = previous_class_name.replace(" " + self.selected_css_class,""); 
					document.getElementById('li-' + self.last_selected_id).className = previous_class_name;
					
				}
				
				self.last_selected_id = 0;
				*/
			};
			
			self.Get_ID_From_Table_Row = function(table,row)
			{
				
				var primary_id_lookup = {
					'Categories' : 'Category ID',
					'items' : 'item_id',
					'item_targets' : 'item_target_id',
					'item_entries' : 'item_log_id',
					'tasks' : 'task_id',
					'task_targets' : 'task_schedule_id',
					'task_entries' : 'task_log_id'
				};
				
				var found_key = -1;
				
				var primary_id = row[primary_id_lookup[table]];
				var found_key = self.Generate_Hashed_ID(table, primary_id);
				
				return found_key;
				
			};
			
			self.Expand_All_Node_Parents = function(table, row)
			{
				
				var parents = [];
				
				id = self.Get_ID_From_Table_Row(table,row);
				
				if(id !== -1)
				{
					var current_lookup = self.tree_view_hash_lookup[id];
				
					while(current_lookup.parent_id !== 0)
					{
						
						parents.push(current_lookup.parent_id);
						
						current_lookup = self.tree_view_hash_lookup[current_lookup.parent_id];
					}
					
					for(var i = 0; i < parents.length; i++)
					{
						var index = parents.length - i - 1;
						
						self.Set_Tree_Node_Expanded(parents[index],true);
						
						
					}
					
					self.Select_Node(id);
				}
				else
				{
					self.Set_Tree_Node_Expanded(self.tree_nodes.id,true);
					self.Select_Node(self.tree_nodes.id);
				}
				
				
			};
			
			self.Create_Category_Node_Lookup_Entry = function(table, row)
			{
				
				var random_id = self.Get_ID_From_Table_Row(table,row);
				var parent_id = self.Generate_Hashed_ID("Categories", row["Parent Category ID"]);
				
				//var new_tree_row = new jstree.TreeNode(random_id, row["Name"], false);
				
				lookup_entry = 
					{
						"node_id" : random_id,
						"node" : row["Name"],
						"parent_id" : parent_id,
						"table" : table,
						"row" : row
					};
				
				return lookup_entry;
				
			};
			
			self.Create_Item_Node_Lookup_Entry = function(table, row)
			{
				
				var random_id = self.Get_ID_From_Table_Row(table,row);
				var parent_id = self.Generate_Hashed_ID("Categories", row["category_id"]);
				
				//var new_tree_row = new jstree.TreeNode(random_id, row["item_name"], false);
				
				lookup_entry = 
					{
						"node_id" : random_id,
						"node" : row["item_name"],
						"parent_id" : parent_id,
						"table" : table,
						"row" : row
					};
				
				return lookup_entry;
				
			};
			
			self.Create_Item_Target_Node_Lookup_Entry = function(table, row)
			{
				
				var random_id = self.Get_ID_From_Table_Row(table,row);
				
				if(row['recurring_child_id'] == 0)
				{
					var parent_id = self.Generate_Hashed_ID("items", row["item_id"]);
				}
				else
				{
					//recurring child
					var parent_id = self.Generate_Hashed_ID("item_targets", row['recurring_child_id']);
				}
				
				//var new_tree_row = new jstree.TreeNode(random_id, row["start_time"], false);
				
				lookup_entry = 
					{
						"node_id" : random_id,
						"node" : row["start_time"],
						"parent_id" : parent_id,
						"table" : table,
						"row" : row
					};
				
				return lookup_entry;
				
			};
			
			self.Create_Item_Entry_Node_Lookup_Entry = function(table,row)
			{
				
				var random_id = self.Get_ID_From_Table_Row(table,row);
				
				if(row['item_target_id'] == 0)
				{
					var parent_id = self.Generate_Hashed_ID("items", row["item_id"]);
				}
				else
				{
					//recurring child
					var parent_id = self.Generate_Hashed_ID("item_targets", row['item_target_id']);
				}
				
				//var new_tree_row = new jstree.TreeNode(random_id, row["time"], false);
				
				lookup_entry = 
					{
						"node_id" : random_id,
						"node" : row["time"],
						"parent_id" : parent_id,
						"table" : table,
						"row" : row
					};
				
				return lookup_entry;
				
			};
			
			self.Create_Task_Node_Lookup_Entry = function(table,row)
			{
				
				var random_id = self.Get_ID_From_Table_Row(table,row);
				var parent_id = self.Generate_Hashed_ID("Categories", row["category_id"]);
				
				//var new_tree_row = new jstree.TreeNode(random_id, row["name"], false);
				
				lookup_entry = 
					{
						"node_id" : random_id,
						"node" : row["name"],
						"parent_id" : parent_id,
						"table" : table,
						"row" : row
					};
				
				return lookup_entry;
				
			};
			
			self.Create_Task_Target_Node_Lookup_Entry = function(table,row)
			{
				
				var random_id = self.Get_ID_From_Table_Row(table,row);
				
				if(row['recurrance_child_id'] == 0)
				{
					var parent_id = self.Generate_Hashed_ID("tasks", row["task_id"]);
				}
				else
				{
					//recurring child
					var parent_id = self.Generate_Hashed_ID("task_targets", row['recurrance_child_id']);
				}
				
				//var new_tree_row = new jstree.TreeNode(random_id, row["scheduled_time"], false);
				
				lookup_entry = 
					{
						"node_id" : random_id,
						"node" : row["scheduled_time"],
						"parent_id" : parent_id,
						"table" : table,
						"row" : row
					};
				
				return lookup_entry;
				
			};
			
			self.Create_Task_Entry_Node_Lookup_Entry = function(table,row)
			{
				
				var random_id = self.Get_ID_From_Table_Row(table,row);
				
				if(row['task_target_id'] == 0)
				{
					var parent_id = self.Generate_Hashed_ID("tasks", row["task_id"]);
				}
				else
				{
					//recurring child
					var parent_id = self.Generate_Hashed_ID("task_targets", row['task_target_id']);
				}
				
				//var new_tree_row = new jstree.TreeNode(random_id, row["start_time"], false);
				
				lookup_entry = 
					{
						"node_id" : random_id,
						"node" : row["start_time"],
						"parent_id" : parent_id,
						"table" : table,
						"row" : row
					};
				
				return lookup_entry;
				
			};
			
			self.Create_Tree_Node_Lookup_Entry = function(table, row)
			{
				
				var tree_map = {
					'Categories' : self.Create_Category_Node_Lookup_Entry,
					'items' : self.Create_Item_Node_Lookup_Entry,
					'item_targets' : self.Create_Item_Target_Node_Lookup_Entry,
					'item_entries' : self.Create_Item_Entry_Node_Lookup_Entry,
					'tasks' : self.Create_Task_Node_Lookup_Entry,
					'task_targets' : self.Create_Task_Target_Node_Lookup_Entry,
					'task_entries' : self.Create_Task_Entry_Node_Lookup_Entry,
				};
				
				lookup_entry = tree_map[table](table,row);
				
				lookup_entry.children = [];
				lookup_entry.is_expanded = false;
				
				return lookup_entry;
				
			};
			
			self.Populate_Tree_Node_Lookup_Children = function()
			{
				for(lookup_key in self.tree_view_hash_lookup)
				{
					var current_lookup = self.tree_view_hash_lookup[lookup_key];
					
					if(current_lookup.parent_id != 0)
					{
						var parent_lookup = self.tree_view_hash_lookup[current_lookup.parent_id]
						
						if(parent_lookup)
						{
							parent_lookup.children.push(lookup_key);
						}
						else
						{
							logger.Error("Unable to find parent node for: " + JSON.stringify(current_lookup));
						}
					}
					
				}
				
			};
			
			self.Create_Tree = function(data)
			{
				
				self.tree_view_hash_lookup = {};
				
				//add the root node (non-child category parent)
				var root_id = self.Generate_Hashed_ID("Categories", 0);
				//var new_tree_row = new jstree.TreeNode(root_id, "All", true);
				self.tree_view_hash_lookup[root_id] = {
					node_id : root_id,
					node : "All",
					parent_id : 0,
					table: "Categories",
					row: {"Category ID": 0},
					children: []
					};
				
				//add all nodes to lookup
				for(table_key in data)
				{
					table = data[table_key];
					
					for(row_key in table)
					{
						row = table[row_key];
						
						var new_lookup_entry = self.Create_Tree_Node_Lookup_Entry(table_key,row);
						
						self.tree_view_hash_lookup[new_lookup_entry.node_id] = new_lookup_entry;
					}
				}
				
				self.Populate_Tree_Node_Lookup_Children();
				
				self.Insert_All_Hash_Lookup_Nodes();
				
				return self.tree_view_hash_lookup[root_id].node;
				
			};
			
			self.Insert_All_Hash_Lookup_Nodes = function()
			{
				
				var nodes_to_check = self.Generate_Hashed_ID("Categories", 0);
				
				var current_lookup = self.tree_view_hash_lookup[nodes_to_check];
				self.Insert_Tree_Node(current_lookup);
				
				self.Insert_Hash_Lookup_Children(nodes_to_check);
				
			};
			
			self.Insert_Hash_Lookup_Children = function(node_to_check)
			{
				
				var parent_lookup = self.tree_view_hash_lookup[node_to_check];
				
				for(child_key in parent_lookup.children)
				{
					var child_lookup = self.tree_view_hash_lookup[parent_lookup.children[child_key]];
					
					if(child_lookup)
					{
						self.Insert_Tree_Node(child_lookup);
						
						self.Insert_Hash_Lookup_Children(parent_lookup.children[child_key]);
					}
					else
					{
						logger.Error("Unable to find tree node child: " + parent_lookup.children[child_key]);
					}
					
				}
				
				/*
				for(child_key in self.tree_view_hash_lookup)
				{
					if(self.tree_view_hash_lookup[child_key].parent_id == node_to_check)
					{
						var current_lookup = self.tree_view_hash_lookup[child_key];
						self.Insert_Tree_Node(current_lookup);
						
						self.Insert_Hash_Lookup_Children(child_key);
					}
				}
				*/
			};
			
			self.Insert_Tree_Node = function(lookup_entry)
			{
				
				if(lookup_entry.parent_id in self.tree_view_hash_lookup)
				{
					var parent_lookup = self.tree_view_hash_lookup[lookup_entry.parent_id];
					
					var new_style = '';
					
					var tree_map = {
							'Categories' : '',
							'items' : 'red',
							'item_targets' : 'green',
							'item_entries' : 'blue',
							'tasks' : 'orange',
							'task_targets' : 'yellow',
							'task_entries' : 'pink',
						};
					
					for(var key in tree_map)
					{
						if(lookup_entry.table == key && tree_map[key] != '')
						{
							new_style = 'background-color:' + tree_map[key] + ';';
							new_style += 'border-radius:10px;';
							break;
						}
					}
					
					var newNode = { state: "open", text: lookup_entry.node, id: lookup_entry.node_id , a_attr: {style:new_style}};
					
					self.jstree.create_node(lookup_entry.parent_id, newNode, "first", false, false);
					
				}
				else
				{
					//alert('Error finding parent: ' + lookup_entry.parent_id + '. ' + JSON.stringify(lookup_entry));
					
					var newNode = { state: "open", text: lookup_entry.node, id: lookup_entry.node_id };
					
					self.jstree.create_node(null, newNode, "first", false, false);
				}
				
			};
			
			self.Update_Tree_Node = function(lookup_entry)
			{
				self.jstree.rename_node(lookup_entry.node_id,lookup_entry.node);
				
				self.jstree.move_node(lookup_entry.node_id,lookup_entry.parent_id);
			};
			
			self.Remove_Tree_Node = function(lookup_entry)
			{
				
				if(lookup_entry.parent_id in self.tree_view_hash_lookup)
				{
					var parent_lookup = self.tree_view_hash_lookup[lookup_entry.parent_id];
					
					//parent_lookup.node.removeItem(lookup_entry.node_id);
					var node_to_delete = self.jstree.get_node(lookup_entry.node_id);
					self.jstree.delete_node(node_to_delete);
					//self.jstree.refresh();
					
				}
				else{
					alert('Remove_Tree_Node: Parent node not found.');
				}
				
			};
			
			self.Get_Nest_Level_From_Hash_Id = function(node_id)
			{
				
				var nest_level = 0;
				
				if(node_id in self.tree_view_hash_lookup)
				{
					var current_node = self.tree_view_hash_lookup[node_id];
					
					while(current_node.parent_id != self.Generate_Hashed_ID("Categories", 0))
					{
						current_node = self.tree_view_hash_lookup[current_node.parent_id];
						nest_level++;
					}
				}
				else
				{
					nest_level = -1;
				}
				
				return nest_level;
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
			self.Render = function(div_id) {
				
				self.div_id = div_id;
				
				document.getElementById(self.div_id).innerHTML = '<ul id="'+self.tree_view_div+'"></ul>';
				
			};
		}
	};
});


