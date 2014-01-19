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
		
		var TreeNode = Resnyanskiy.TreeNode;
		
		self.tree_nodes = self.Create_Tree_Nodes(self.data.categories,
			"category_id",
			"category_path");
		
		document.getElementById(self.tree_view_div).innerHTML = "";
		
		self.tree = new Resnyanskiy.Tree(document.getElementById(self.tree_view_div),self.tree_nodes);
		
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
		
		var TreeNode = Resnyanskiy.TreeNode;
		
		for (var i=0; i < table.length; i++) {
		

			var current_row = table[i];
			
			var new_tree_row = new TreeNode(current_row[id_column], current_row[name_column], false);
			
			return_array.push(new_tree_row);
		}
		
		return return_array;
	};
	
	//render function (div must already exist)
	self.Render = function() {
		
		document.getElementById(self.div_id).innerHTML += '<div id="'+self.tree_view_div+'"></div>';
	};
}