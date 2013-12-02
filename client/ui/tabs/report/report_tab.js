/** This is the report tab object which holds all UI objects for detailed data interaction.
 * @constructor Report_Tab
 */
function Report_Tab() {

	//class variables
	this.div_id = null;
	var self = this;
	
	this.Refresh = function(data, schema) {
		
		self.data = data;
		self.schema = schema;
		
		self.Refresh_Summaries_Form(data);
		
	};
	
	this.Refresh_Summaries_Form = function(data){
		
		document.getElementById(this.report_summaries_tables_select.id).innerHTML = '<option>-</option>';
		
		//get all table names
		for (var key in data) {
			
			document.getElementById(this.report_summaries_tables_select.id).innerHTML += '<option>' + key + '</option>';
		}
		
	};
	
	this.Refresh_Chart_Data = function(){
		
		
		x_column_select = document.getElementById(self.summaries_graph_select_x_column.id);
		y_column_select = document.getElementById(self.summaries_graph_select_y_column.id);
		
		if(x_column_select.value != '-' && 
			y_column_select.value != '-'){
			
			//set the height and width for proper rendering
			document.getElementById(self.summaries_graph_canvas.id).width = window.innerWidth * 0.5;
			document.getElementById(self.summaries_graph_canvas.id).height = window.innerHeight * 0.4;
			
			results_columns = pivot.results().columns();
			results_rows = pivot.results().all();
			
			x_data_to_graph = [];
			y_data_to_graph = [];
			
			$.each(results_rows,function(index, row){
				
				x_data_to_graph.push(row[x_column_select.value]);
				y_data_to_graph.push(row[y_column_select.value]);
				
			});
			
			//format xy data
			var data_xy = {
				labels : x_data_to_graph,
				datasets : [
					{
						fillColor : "rgba(220,220,220,0.5)",
						strokeColor : "rgba(220,220,220,1)",
						data : y_data_to_graph
					}
				]
			};
			
			var data_radial = [];
			
			for(i = 0; i < y_data_to_graph.length; i++){
				
				data_radial.push({
						value: y_data_to_graph[i],
						color:"#" + (Math.floor((Math.random()*0xFFFFFF))).toString(16)
					});
				
			}

			//graph the data
			if(document.getElementById(self.summaries_graph_type_select.id).value == "Line")
			{
				
				this.myLine = new Chart(document.getElementById(self.summaries_graph_canvas.id).getContext("2d")).Line(data_xy); 
			}
			else if(document.getElementById(self.summaries_graph_type_select.id).value == "Pie")
			{	
					
				
				this.myLine = new Chart(document.getElementById(self.summaries_graph_canvas.id).getContext("2d")).Pie(data_radial); 
			}
			else if(document.getElementById(self.summaries_graph_type_select.id).value == "Radar")
			{
					
				
				this.myLine = new Chart(document.getElementById(self.summaries_graph_canvas.id).getContext("2d")).Radar(data_xy); 
			}
			else if(document.getElementById(self.summaries_graph_type_select.id).value == "Polar Area")
			{
					
				
				this.myLine = new Chart(document.getElementById(self.summaries_graph_canvas.id).getContext("2d")).PolarArea(data_radial); 
			}
			else if(document.getElementById(self.summaries_graph_type_select.id).value == "Doughnut")
			{
				
				this.myLine = new Chart(document.getElementById(self.summaries_graph_canvas.id).getContext("2d")).Doughnut(data_radial); 
			}
			else
			{
					
				
				this.myLine = new Chart(document.getElementById(self.summaries_graph_canvas.id).getContext("2d")).Bar(data_xy); 
			
			}
		
		}
		else
		{
			document.getElementById(self.summaries_graph_canvas.id).style = '';
			document.getElementById(self.summaries_graph_canvas.id).width = "0";
			document.getElementById(self.summaries_graph_canvas.id).height = "0";
		
		}
	};
	
	this.Results_Update_Callback = function(){
		
		
		chart_line_options = '';
		
		chart_line_options += '<option>-</options>';
		
		$.each(pivot.results().columns(), function(index,column) {
	      chart_line_options += '<option>' + column.fieldName + "</options>";
	    });
		
		document.getElementById(self.summaries_graph_select_x_column.id).innerHTML = chart_line_options;
		document.getElementById(self.summaries_graph_select_y_column.id).innerHTML = chart_line_options;
		
		
		self.Refresh_Chart_Data();
		
	};
	
	this.Tables_Select_Changed = function(){
		
		document.getElementById(self.report_summaries_data_display_div.id).innerHTML = '';
		
		if($('#' + self.report_summaries_tables_select.id).val() != '-')
		{
			
			self.json_titles = [];
			self.fields = [];
			self.json_data = [];
			
			//get all column names
			for (var i = 0; i <  self.data[$('#' + self.report_summaries_tables_select.id).val()].length; i++) {
				
				//this function refreshes the pivot table
				key = self.data[$('#' + self.report_summaries_tables_select.id).val()][i];
				key_schema = self.schema[$('#' + self.report_summaries_tables_select.id).val()];
				key_data_row = [];
				
				for(var column in key)
				{
					if(i == 0)
					{
						self.json_titles.push(column);
						
						//select the summary type
						if(document.getElementById(self.report_summaries_type_select.id).value == 'Sum')
						{
							summary_type = 'sum';
						}
						else if(document.getElementById(self.report_summaries_type_select.id).value == 'Average')
						{
							summary_type = 'avg';
						}
						else if(document.getElementById(self.report_summaries_type_select.id).value == 'Count')
						{
							summary_type = 'cnt';
						}
						else
						{
							summary_type = 'sum';
						}
						
						if(key_schema[column] == 'int')
						{
							data_type = 'integer';
						}
						else if(key_schema[column] == 'float')
						{
							data_type = 'float';
						}
						else if(key_schema[column] == 'date')
						{
							data_type = 'string';
							
							date_column = column;
							
							self.fields.push({name: column + '_yyyy', type: data_type, rowLabelable: true, filterable: true, pseudo: true,
      							pseudoFunction: function(row){
      								
      								server_date = Cast_Server_Datetime_to_Date(row[date_column]);
      								
      								return server_date.getFullYear(); 
      								 
      							}
      						});
      						
      						self.fields.push({name: column + '_yyyy_mm', type: data_type, rowLabelable: true, filterable: true, pseudo: true,
      							pseudoFunction: function(row){
      								
      								server_date = Cast_Server_Datetime_to_Date(row[date_column]);
      								
      								return_string = server_date.getFullYear() + '-' + pivot.utils().padLeft(server_date.getMonth() + 1,2,'0');
      								
      								return return_string; 
      								 
      							}
      						});
      						
      						self.fields.push({name: column + '_yyyy_mm_ww', type: data_type, rowLabelable: true, filterable: true, pseudo: true,
      							pseudoFunction: function(row){
      								
      								server_date = Cast_Server_Datetime_to_Date(row[date_column]);
      								
      								var onejan = new Date(server_date.getFullYear(),0,1);
      								week_number = Math.ceil((((server_date - onejan) / 86400000) + onejan.getDay()+1)/7);
      								
      								return_string = server_date.getFullYear() + '-' 
      									+ pivot.utils().padLeft(server_date.getMonth() + 1,2,'0') + '-'
      									+ pivot.utils().padLeft(week_number,2,'0');
      								
      								return return_string; 
      								 
      							}
      						});
      						
      						self.fields.push({name: column + '_yyyy_mm_dd', type: data_type, rowLabelable: true, filterable: true, pseudo: true,
      							pseudoFunction: function(row){
      								
      								server_date = Cast_Server_Datetime_to_Date(row[date_column]);
      								
      								var onejan = new Date(server_date.getFullYear(),0,1);
      								week_number = Math.ceil((((server_date - onejan) / 86400000) + onejan.getDay()+1)/7);
      								
      								return_string = server_date.getFullYear() + '-' 
      									+ pivot.utils().padLeft(server_date.getMonth() + 1,2,'0') + '-'
      									+ pivot.utils().padLeft(server_date.getDate(),2,'0');
      								
      								return return_string; 
      								 
      							}
      						});
						}
						else if(key_schema[column] == 'string')
						{
							data_type = 'string';
						}
						else
						{
							data_type = 'string';
						}
						
						self.fields.push({name: column,   type: data_type,  rowLabelable: true, filterable: true, summarizable: summary_type});
					}
					
					if(key_schema[column] === 'int')
					{
						new_value = parseInt(key[column]);
					}
					else if(key_schema[column] === 'float')
					{
						new_value = parseFloat(key[column]);
					}
					else if(key_schema[column] === 'date')
					{
						new_value = key[column];
					}
					else
					{
						new_value = key[column];
					}
					
					key_data_row.push(new_value);
					
					
				}
				
				self.json_data.push(JSON.stringify(key_data_row));
				
			}
			
			self.json_titles = JSON.stringify(self.json_titles);
			self.json_data = self.json_data.join();
			
			self.json_string = '[' + self.json_titles + ',' + self.json_data + ']';
					
			var input = {json:self.json_string, fields: self.fields, resultsDivID:self.report_results_data_display_div.id, callbacks:{afterUpdateResults:this.Results_Update_Callback}};
			
			
			$('#' + self.report_summaries_data_display_div.id).pivot_display('setup', input);
	
			
		}
		
		document.getElementById(self.report_results_data_display_div.id).innerHTML = '';
		
		
	};
	
	this.Type_Select_Change = function(){
		
		this.Tables_Select_Changed();
		
	};
	
	this.Convert_JSON_Format_To_Pivot = function(json_data_table){
		
		//function to convert from the default application JSON format to pivot format
		var formatted_json_data_table = {
			json:'', 
			fields:[], 
			rowLabels:[]};
		
		
		
		
		return formatted_json_data_table;
	};

	this.Render_Summaries_Form = function(form_div_id) {

		this.report_summaries_data_form = document.createElement("form");
		this.report_summaries_data_form.setAttribute('method', "post");
		this.report_summaries_data_form.setAttribute('id', "report_summaries_display_form");
		
		this.report_summaries_data_form.innerHTML += 'Tables:<br/>';
		
		this.report_summaries_tables_select = document.createElement("select");
		this.report_summaries_tables_select.setAttribute('id', 'report_summaries_tables_select');
		this.report_summaries_tables_select.innerHTML = '<option>-</option>';
		this.report_summaries_data_form.appendChild(this.report_summaries_tables_select);
		
		this.report_summaries_data_form.innerHTML += '<br/>Summary Type:<br/>';
		
		this.report_summaries_type_select = document.createElement("select");
		this.report_summaries_type_select.setAttribute('id', 'report_summaries_type_select');
		this.report_summaries_type_select.innerHTML = '<option>Sum</option>';
		this.report_summaries_type_select.innerHTML += '<option>Average</option>';
		this.report_summaries_type_select.innerHTML += '<option>Count</option>';
		this.report_summaries_data_form.appendChild(this.report_summaries_type_select);
		
		this.report_summaries_data_display_div = document.createElement("div");
		this.report_summaries_data_display_div.setAttribute('id', 'report_summaries_data_display_div');
		this.report_summaries_data_form.appendChild(this.report_summaries_data_display_div);
		
		this.report_summaries_data_form.innerHTML += 'Graph Type:<br/>';
		this.summaries_graph_type_select = document.createElement('select');
		this.summaries_graph_type_select.id = 'summaries_graph_type_select';
		this.summaries_graph_type_select.innerHTML = '<option>Bar</option>';
		this.summaries_graph_type_select.innerHTML += '<option>Line</option>';
		this.summaries_graph_type_select.innerHTML += '<option>Pie</option>';
		this.summaries_graph_type_select.innerHTML += '<option>Radar</option>';
		this.summaries_graph_type_select.innerHTML += '<option>Polar Area</option>';
		this.summaries_graph_type_select.innerHTML += '<option>Doughnut</option>';
		this.report_summaries_data_form.appendChild(self.summaries_graph_type_select);
		
		this.report_summaries_data_form.innerHTML += '<br/>';
		this.report_summaries_data_form.innerHTML += 'X Column:<br/>';
		this.summaries_graph_select_x_column = document.createElement('select');
		this.summaries_graph_select_x_column.id = 'graph_tab_x_col_select';
		this.summaries_graph_select_x_column.innerHTML = '<option>-</option>';
		this.report_summaries_data_form.appendChild(self.summaries_graph_select_x_column);
		
		this.report_summaries_data_form.innerHTML += '<br/>';
		this.report_summaries_data_form.innerHTML += 'Y Column:<br/>';
		this.summaries_graph_select_y_column = document.createElement('select');
		this.summaries_graph_select_y_column.id = 'graph_tab_y_col_select';
		this.summaries_graph_select_y_column.innerHTML = '<option>-</option>';
		this.report_summaries_data_form.appendChild(self.summaries_graph_select_y_column);
		
		this.report_summaries_data_form.innerHTML += '<hr/>';
		this.summaries_graph_canvas = document.createElement('canvas');
		this.summaries_graph_canvas.id = 'graph_tab_canvas';
		this.report_summaries_data_form.appendChild(self.summaries_graph_canvas);
		this.report_summaries_data_form.innerHTML += '<hr/>';
		
		this.report_results_data_display_div = document.createElement("div");
		this.report_results_data_display_div.setAttribute('id', 'report_summaries_data_results');
		this.report_summaries_data_form.appendChild(this.report_results_data_display_div);
		
		var div_tab = document.getElementById(form_div_id);
		div_tab.appendChild(this.report_summaries_data_form);
		
		$('#' + self.report_summaries_tables_select.id).change(function() {
			
			self.Tables_Select_Changed();

		});
		
		$('#' + self.report_summaries_type_select.id).change(function() {
			
			self.Type_Select_Change();

		});
		
		$('#' + self.summaries_graph_type_select.id).change(function() {
			
			self.Refresh_Chart_Data();

		});

		$('#' + self.summaries_graph_select_x_column.id).change(function() {
			
			self.Refresh_Chart_Data();

		});
		
		$('#' + self.summaries_graph_select_y_column.id).change(function() {
			
			self.Refresh_Chart_Data();

		});

	};

	this.Render_Time_Based_Form = function(form_div_id) {

		this.report_time_based_data_form = document.createElement("form");
		this.report_time_based_data_form.setAttribute('method', "post");
		this.report_time_based_data_form.setAttribute('id', "report_time_based_display_form");

		this.report_time_based_data_display_div = document.createElement("div");
		this.report_time_based_data_form.appendChild(this.report_time_based_data_display_div);

		var div_tab = document.getElementById(form_div_id);
		div_tab.innerHTML = 'Under construction...';
		div_tab.appendChild(this.report_time_based_data_form);

	};
	
	//render function (div must already exist)
	this.Render = function(data_div_id) {
		
		this.div_id = data_div_id;
		
		var tabs_array = new Array();

		var new_tab;

		new_tab = new Array();
		new_tab.push("Pivot Report");
		new_tab.push('<div id="reports_summaries_tab"></div>');
		tabs_array.push(new_tab);

		new_tab = new Array();
		new_tab.push("Time Based");
		new_tab.push('<div id="reports_time_based_tab"></div>');
		tabs_array.push(new_tab);

		var return_html = '';

		return_html += '<div id="reports_accordian"></div>';

		var div_tab = document.getElementById(this.div_id);
		div_tab.innerHTML = return_html;

		//render the accordian
		var task_accordian = new Accordian('reports_accordian', tabs_array);
		task_accordian.Render();

		this.Render_Summaries_Form('reports_summaries_tab');
		this.Render_Time_Based_Form('reports_time_based_tab');
	};
}

