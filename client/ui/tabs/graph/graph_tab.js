/** This is the graph tab which will have graphs to display data.
 * @constructor Graph_Tab
 */
function Graph_Tab() {

	//class variables
	this.div_id = null;
	
	this.Refresh = function(data, schema){
		
		self = this;
		
		self.data = data;
		self.schema = schema;
		
		document.getElementById(self.summaries_graph_select_table.id).innerHTML = '<option>-</option>';
		
		//get all table names
		for (var key in data) {
			
			document.getElementById(self.summaries_graph_select_table.id).innerHTML += '<option>' + key + '</option>';
		}
		
		this.Refresh_Chart_Data();
		
	};
	
	this.Refresh_Chart_Data = function(){
		
		self = this;
		
		table_select = document.getElementById(self.summaries_graph_select_table.id);
		x_column_select = document.getElementById(self.summaries_graph_select_x_column.id);
		y_column_select = document.getElementById(self.summaries_graph_select_y_column.id);
		
		if(table_select.value != '-' && 
			x_column_select.value != '-' && 
			y_column_select.value != '-'){
			
			x_data_to_graph = [];
			y_data_to_graph = [];
			
			//compile the selected data
			for (var i = 0; i <  self.data[$('#' + self.summaries_graph_select_table.id).val()].length; i++) {
				
				var key = self.data[$('#' + self.summaries_graph_select_table.id).val()][i];
				key_data_row = [];
				
				//column loop (may not be required)
				for(var column in key)
				{
					
					if(column == x_column_select.value)
					{
						
						x_data_to_graph.push(key[column]);
					}
					else if(column == y_column_select.value)
					{
						y_data_to_graph.push(key[column]);
					}
					
				}
				
			}
			
			//set the height and width for proper rendering
			document.getElementById(self.summaries_graph_canvas.id).width = "500";
			document.getElementById(self.summaries_graph_canvas.id).height = "400";
			
			
			//graph the data
			if(document.getElementById(self.summaries_graph_type_select.id).value == "Line")
			{
				
				//format the data properly
				var data = {
					labels : x_data_to_graph,
					datasets : [
						{
							fillColor : "rgba(220,220,220,0.5)",
							strokeColor : "rgba(220,220,220,1)",
							data : y_data_to_graph
						}
					]
				};
				
				
				this.myLine = new Chart(document.getElementById(self.summaries_graph_canvas.id).getContext("2d")).Line(data); 
			}
			else if(document.getElementById(self.summaries_graph_type_select.id).value == "Pie")
			{	
					
				var data = [
					{
						value: 30,
						color:"#F38630"
					},
					{
						value : 50,
						color : "#E0E4CC"
					},
					{
						value : 100,
						color : "#69D2E7"
					}			
				];
				
				this.myLine = new Chart(document.getElementById(self.summaries_graph_canvas.id).getContext("2d")).Pie(data); 
			}
			else if(document.getElementById(self.summaries_graph_type_select.id).value == "Radar")
			{
					
				//format the data properly
				var data = {
					labels : x_data_to_graph,
					datasets : [
						{
							fillColor : "rgba(220,220,220,0.5)",
							strokeColor : "rgba(220,220,220,1)",
							data : y_data_to_graph
						}
					]
				};
				
				
				this.myLine = new Chart(document.getElementById(self.summaries_graph_canvas.id).getContext("2d")).Radar(data); 
			}
			else if(document.getElementById(self.summaries_graph_type_select.id).value == "Polar Area")
			{
					
				//format the data properly
				var data = [
					{
						value: 30,
						color:"#F38630"
					},
					{
						value : 50,
						color : "#E0E4CC"
					},
					{
						value : 100,
						color : "#69D2E7"
					}			
				];
				
				
				this.myLine = new Chart(document.getElementById(self.summaries_graph_canvas.id).getContext("2d")).PolarArea(data); 
			}
			else if(document.getElementById(self.summaries_graph_type_select.id).value == "Doughnut")
			{
					
				//format the data properly
				var data = [
					{
						value: 30,
						color:"#F38630"
					},
					{
						value : 50,
						color : "#E0E4CC"
					},
					{
						value : 100,
						color : "#69D2E7"
					}			
				];
				
				
				this.myLine = new Chart(document.getElementById(self.summaries_graph_canvas.id).getContext("2d")).Doughnut(data); 
			}
			else
			{
					
				//format the data properly
				var data = {
					labels : x_data_to_graph,
					datasets : [
						{
							fillColor : "rgba(220,220,220,0.5)",
							strokeColor : "rgba(220,220,220,1)",
							data : y_data_to_graph
						}
					]
				};
				
				
				this.myLine = new Chart(document.getElementById(self.summaries_graph_canvas.id).getContext("2d")).Bar(data); 
			
			}
			
		}
		else
		{
			document.getElementById(self.summaries_graph_canvas.id).style = '';
			document.getElementById(self.summaries_graph_canvas.id).width = "0";
			document.getElementById(self.summaries_graph_canvas.id).height = "0";
		
		}
		
		
	};
	
	this.Table_Select_Change = function(){
		
		
		columns_x_select_html = '';
		columns_y_select_html = '';
		
		//get all column names
		for (var i = 0; i <  self.data[$('#' + self.summaries_graph_select_table.id).val()].length; i++) {
			
			//this function refreshes the pivot table
			key = self.data[$('#' + self.summaries_graph_select_table.id).val()][i];
			key_data_row = [];
			
			columns_x_select_html += '<option>-</option>';
			columns_y_select_html += '<option>-</option>';
			
			for(var column in key)
			{
				if(i == 0)
				{
					columns_x_select_html += '<option>' + column + '</option>';
					columns_y_select_html += '<option>' + column + '</option>';
				}
				
				key_data_row.push(key[column]);
				
				
			}
			
			break;
			
			self.json_data.push(JSON.stringify(key_data_row));
			
		}
		
		document.getElementById(self.summaries_graph_select_x_column.id).innerHTML = columns_x_select_html;
		document.getElementById(self.summaries_graph_select_y_column.id).innerHTML = columns_y_select_html;
		
		this.Refresh_Chart_Data();
		
	};
	
	this.X_Column_Select_Change = function(){
		
		this.Refresh_Chart_Data();
		
	};
	
	this.Y_Column_Select_Change = function(){
		
		this.Refresh_Chart_Data();
		
	};
	
	this.Render_Summaries_Form = function(div_id){
		
		self = this;
		
		summaries_form = document.getElementById(div_id);
		
		graph_html = '';
		
		summaries_form.innerHTML += 'Data:<br/>';
		
		summaries_form.innerHTML += 'Type:<br/>';
		self.summaries_graph_type_select = document.createElement('select');
		self.summaries_graph_type_select.id = 'summaries_graph_type_select';
		self.summaries_graph_type_select.innerHTML = '<option>Bar</option>';
		self.summaries_graph_type_select.innerHTML += '<option>Line</option>';
		self.summaries_graph_type_select.innerHTML += '<option>Pie</option>';
		self.summaries_graph_type_select.innerHTML += '<option>Radar</option>';
		self.summaries_graph_type_select.innerHTML += '<option>Polar Area</option>';
		self.summaries_graph_type_select.innerHTML += '<option>Doughnut</option>';
		summaries_form.appendChild(self.summaries_graph_type_select);
		
		summaries_form.innerHTML += '<hr/>';
		self.summaries_graph_canvas = document.createElement('canvas');
		self.summaries_graph_canvas.id = 'graph_tab_table_select';
		summaries_form.appendChild(self.summaries_graph_canvas);
		summaries_form.innerHTML += '<hr/>';
		
		summaries_form.innerHTML += 'Table:<br/>';
		self.summaries_graph_select_table = document.createElement('select');
		self.summaries_graph_select_table.id = 'summaries_graph_select_table';
		self.summaries_graph_select_table.innerHTML = '<option>-</option>';
		summaries_form.appendChild(self.summaries_graph_select_table);
		
		summaries_form.innerHTML += '<br/>';
		summaries_form.innerHTML += 'X Column:<br/>';
		self.summaries_graph_select_x_column = document.createElement('select');
		self.summaries_graph_select_x_column.id = 'graph_tab_x_col_select';
		self.summaries_graph_select_x_column.innerHTML = '<option>-</option>';
		summaries_form.appendChild(self.summaries_graph_select_x_column);
		
		summaries_form.innerHTML += '<br/>';
		summaries_form.innerHTML += 'Y Column:<br/>';
		self.summaries_graph_select_y_column = document.createElement('select');
		self.summaries_graph_select_y_column.id = 'graph_tab_y_col_select';
		self.summaries_graph_select_y_column.innerHTML = '<option>-</option>';
		summaries_form.appendChild(self.summaries_graph_select_y_column);
		
		$('#' + self.summaries_graph_type_select.id).change(function(){
			
			self.Refresh_Chart_Data();
			
		});
		
		$('#' + self.summaries_graph_select_table.id).change(function(){
			
			self.Table_Select_Change();
			
		});
		
		$('#' + self.summaries_graph_select_x_column.id).change(function(){
			
			self.X_Column_Select_Change();
			
		});
		
		$('#' + self.summaries_graph_select_y_column.id).change(function(){
			
			self.Y_Column_Select_Change();
			
		});
		
		
		
	};
	
	//render function (div must already exist)
	this.Render = function(data_div_id) {
		
		this.div_id = data_div_id;
		
		var tabs_array = new Array();

		var new_tab;

		new_tab = new Array();
		new_tab.push("Summaries");
		new_tab.push('<div id="graph_tab_summaries_div"></div>');
		tabs_array.push(new_tab);

		new_tab = new Array();
		new_tab.push("Custom Graph");
		new_tab.push('Under construction...');
		tabs_array.push(new_tab);

		new_tab = new Array();
		new_tab.push("Time Based");
		new_tab.push('Under construction...');
		tabs_array.push(new_tab);

		var return_html = '';

		return_html += '<div id="graphs_accordian">';
		
		return_html += '</div>';

		var div_tab = document.getElementById(this.div_id);
		div_tab.innerHTML = return_html;

		//render the accordian
		var task_accordian = new Accordian('graphs_accordian', tabs_array);
		task_accordian.Render();
		
		this.Render_Summaries_Form('graph_tab_summaries_div');
	
	};
}

