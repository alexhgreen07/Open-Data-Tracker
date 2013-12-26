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
		
		var inner_html = '';
		
		var previous_value = document.getElementById(this.report_summaries_tables_select.id).value;
		var is_previous_value_present = false;
		
		inner_html = '<option>-</option>';
		
		//get all table names
		for (var key in data) {
			
			inner_html += '<option>' + key + '</option>';
			
			if(key == previous_value)
			{
				is_previous_value_present = true;
			}
		}
		
		document.getElementById(this.report_summaries_tables_select.id).innerHTML = inner_html;
		
		if(is_previous_value_present)
		{
			document.getElementById(this.report_summaries_tables_select.id).value = previous_value;
			
			
			self.Tables_Select_Changed(true);
		}
		else
		{
			self.Tables_Select_Changed(false);
		}
		
		
	};
	
	this.Refresh_Chart_Data = function(force_refresh){
		
		
		x_column_select = document.getElementById(self.summaries_graph_select_x_column.id);
		y_column_select = document.getElementById(self.summaries_graph_select_y_column.id);
		
		if(x_column_select.value != '-' && 
			y_column_select.value != '-'){
			
			results_columns = pivot.results().columns();
			results_rows = pivot.results().all();
			
			last_x_data_to_graph = self.x_data_to_graph;
			last_y_data_to_graph = self.y_data_to_graph;
			
			if(last_x_data_to_graph == null)
			{
				last_x_data_to_graph = [];
			}
			if(last_y_data_to_graph == null)
			{
				last_y_data_to_graph = [];
			}
			
			self.x_data_to_graph = [];
			self.y_data_to_graph = [];
			
			$.each(results_rows,function(index, row){
				
				self.x_data_to_graph.push(row[x_column_select.value]);
				self.y_data_to_graph.push(row[y_column_select.value]);
				
			});
			
			var data_has_changed = false;
			
			if(!force_refresh)
			{
				//check if the data has changed
				for(i = 0; i < self.x_data_to_graph.length; i++)
				{
					if(self.x_data_to_graph[i] != last_x_data_to_graph[i] || 
						self.y_data_to_graph[i] != last_y_data_to_graph[i])
					{
						data_has_changed = true;
						break;
					}
				}
			}
			else
			{
				data_has_changed = true;
			}
			
			if(data_has_changed)
			{
				//set the height and width for proper rendering
				document.getElementById(self.summaries_graph_canvas.id).width = document.getElementById(self.report_summaries_data_form.id).offsetWidth;
				document.getElementById(self.summaries_graph_canvas.id).height = window.innerHeight * 0.4;
				
				
				//format xy data
				var data_xy = {
					labels : self.x_data_to_graph,
					datasets : [
						{
							fillColor : "rgba(220,220,220,0.5)",
							strokeColor : "rgba(220,220,220,1)",
							data : self.y_data_to_graph
						}
					]
				};
				
				var data_radial = [];
				var legend_html = "Legend:<br><br>";
				
				for(i = 0; i < self.y_data_to_graph.length; i++){
					
					color_html = Rainbow(self.y_data_to_graph.length,i);
					
					data_radial.push({
							value: self.y_data_to_graph[i],
							color:color_html
						});
					
					style_text = "padding-left:1em;padding-right:1em;";
					style_text += "display: inline-block;";
					
					box_style_text = "background-color:" + color_html + ";";
					box_style_text += "width:1em;height:1em;";
					box_style_text += "display: inline-block;";
					box_style_text += "border: 1px solid;";
					
					legend_html += '<div style="' + style_text + '"><div style="' + box_style_text + '"></div> ' + self.x_data_to_graph[i] + '</div>';
					
				}
				
				legend_html += "<hr>";
				
				//graph the data
				if(document.getElementById(self.summaries_graph_type_select.id).value == "Line")
				{
					
					this.myLine = new Chart(document.getElementById(self.summaries_graph_canvas.id).getContext("2d")).Line(data_xy); 
					document.getElementById(self.report_summaries_data_legend_div.id).innerHTML = "";
				}
				else if(document.getElementById(self.summaries_graph_type_select.id).value == "Pie")
				{	
						
					
					this.myLine = new Chart(document.getElementById(self.summaries_graph_canvas.id).getContext("2d")).Pie(data_radial); 
					document.getElementById(self.report_summaries_data_legend_div.id).innerHTML = legend_html;
				}
				else if(document.getElementById(self.summaries_graph_type_select.id).value == "Radar")
				{
						
					
					this.myLine = new Chart(document.getElementById(self.summaries_graph_canvas.id).getContext("2d")).Radar(data_xy); 
					document.getElementById(self.report_summaries_data_legend_div.id).innerHTML = "";
				}
				else if(document.getElementById(self.summaries_graph_type_select.id).value == "Polar Area")
				{
						
					
					this.myLine = new Chart(document.getElementById(self.summaries_graph_canvas.id).getContext("2d")).PolarArea(data_radial);
					document.getElementById(self.report_summaries_data_legend_div.id).innerHTML = legend_html; 
				}
				else if(document.getElementById(self.summaries_graph_type_select.id).value == "Doughnut")
				{
					
					this.myLine = new Chart(document.getElementById(self.summaries_graph_canvas.id).getContext("2d")).Doughnut(data_radial); 
					document.getElementById(self.report_summaries_data_legend_div.id).innerHTML = legend_html;
				}
				else
				{
						
					
					this.myLine = new Chart(document.getElementById(self.summaries_graph_canvas.id).getContext("2d")).Bar(data_xy); 
					document.getElementById(self.report_summaries_data_legend_div.id).innerHTML = "";
				
				}
			}
			
		
		}
		else
		{
			document.getElementById(self.summaries_graph_canvas.id).style = '';
			document.getElementById(self.summaries_graph_canvas.id).width = "0";
			document.getElementById(self.summaries_graph_canvas.id).height = "0";
			
			document.getElementById(self.report_summaries_data_legend_div.id).innerHTML = "";
		}
	};
	
	this.Results_Update_Callback = function(){
		
		var previous_x_value = document.getElementById(self.summaries_graph_select_x_column.id).value;
		var is_previous_x_value_present = false;
		var previous_y_value = document.getElementById(self.summaries_graph_select_y_column.id).value;
		var is_previous_y_value_present = false;
		
		chart_line_options = '';
		
		chart_line_options += '<option>-</options>';
		
		$.each(pivot.results().columns(), function(index,column) {
			
	      chart_line_options += '<option>' + column.fieldName + "</options>";
	      
	      if(previous_x_value == column.fieldName)
	      {
	      	is_previous_x_value_present = true;
	      }
	      if(previous_y_value == column.fieldName)
	      {
	      	is_previous_y_value_present = true;
	      }
	      
	    });
		
		document.getElementById(self.summaries_graph_select_x_column.id).innerHTML = chart_line_options;
		document.getElementById(self.summaries_graph_select_y_column.id).innerHTML = chart_line_options;
		
		if(is_previous_x_value_present)
		{
			document.getElementById(self.summaries_graph_select_x_column.id).value = previous_x_value;
		}
		if(is_previous_y_value_present)
		{
			document.getElementById(self.summaries_graph_select_y_column.id).value = previous_y_value;
		}
		
		self.Refresh_Chart_Data(false);
		
	};
	
	this.Save_Report_Button_Click = function(){
		
		var params = new Array();
		
		var pivot_config_data = pivot.config(true);	
		
		report_id = document.getElementById(this.report_saved_select.id).value;
		table_name = document.getElementById(this.report_summaries_tables_select.id).value;
		summary_type = document.getElementById(this.report_summaries_type_select.id).value;
		filter_fields = JSON.stringify(pivot_config_data.filters);
		row_fields = JSON.stringify(pivot_config_data.rowLabels);
		summary_fields = JSON.stringify(pivot_config_data.summaries);
		graph_type = document.getElementById(this.summaries_graph_type_select.id).value;
		graph_x = document.getElementById(this.summaries_graph_select_x_column.id).value;
		graph_y = document.getElementById(this.summaries_graph_select_y_column.id).value;
		
		//default first argument to report ID
		params[0] = report_id;
		params[1] = table_name;
		params[2] = summary_type;
		params[3] = filter_fields;
		params[4] = row_fields;
		params[5] = summary_fields;
		params[6] = graph_type;
		params[7] = graph_x;
		params[8] = graph_y;
		
		if(report_id == 0)
		{
			report_name = prompt("Please enter the name for the saved report.","Report Name");
			
			//overwrite report ID with report name (new report)
			params[0] = report_name;
			
			app.api.Report_Data_Interface.Save_Report(params, function(jsonRpcObj) {
				
				if (jsonRpcObj.result.success == 'true') {
					
					
					alert('Report saved.');
	
					app.api.Refresh_Data(function() {
						//self.refresh_item_log_callback();
					});
					
				} else {
					alert('Report failed to save.');
					//alert(jsonRpcObj.result.debug);
				}
				
	
			});
		}
		else
		{
			
			app.api.Report_Data_Interface.Update_Saved_Report(params, function(jsonRpcObj) {
				
				if (jsonRpcObj.result.success == 'true') {
					
					
					alert('Report updated.');
	
					app.api.Refresh_Data(function() {
						//self.refresh_item_log_callback();
					});
					
				} else {
					alert('Report failed to update.');
					//alert(jsonRpcObj.result.debug);
				}
				
	
			});
		}
		
		
		
	};
	
	this.Saved_Reports_Select_Changed = function(){
		
		alert("Report saved select changed!");
		
	};
	
	this.Tables_Select_Changed = function(is_same_table){
		
		document.getElementById(self.report_summaries_data_display_div.id).innerHTML = '';
		
		if($('#' + self.report_summaries_tables_select.id).val() != '-')
		{
			
			self.json_titles = [];
			self.fields = [];
			self.json_data = [];
			
			var table_name = $('#' + self.report_summaries_tables_select.id).val();
			
			if(self.data[table_name].length > 0)
			{
				//get all column names
				for (var i = 0; i <  self.data[table_name].length; i++) {
					
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
	      						
	      						self.fields.push({name: column + '_mm', type: data_type, rowLabelable: true, filterable: true, pseudo: true,
	      							pseudoFunction: function(row){
	      								
	      								server_date = Cast_Server_Datetime_to_Date(row[date_column]);
	      								
	      								return_string = pivot.utils().padLeft(server_date.getMonth() + 1,2,'0');
	      								
	      								return return_string; 
	      								 
	      							}
	      						});
	      						
	      						self.fields.push({name: column + '_ww', type: data_type, rowLabelable: true, filterable: true, pseudo: true,
	      							pseudoFunction: function(row){
	      								
	      								server_date = Cast_Server_Datetime_to_Date(row[date_column]);
	      								
	      								var onejan = new Date(server_date.getFullYear(),0,1);
	      								week_number = Math.ceil((((server_date - onejan) / 86400000) + onejan.getDay()+1)/7);
	      								
	      								return_string = pivot.utils().padLeft(week_number,2,'0');
	      								
	      								return return_string; 
	      								 
	      							}
	      						});
	      						
	      						self.fields.push({name: column + '_dd', type: data_type, rowLabelable: true, filterable: true, pseudo: true,
	      							pseudoFunction: function(row){
	      								
	      								server_date = Cast_Server_Datetime_to_Date(row[date_column]);
	      								
	      								var onejan = new Date(server_date.getFullYear(),0,1);
	      								week_number = Math.ceil((((server_date - onejan) / 86400000) + onejan.getDay()+1)/7);
	      								
	      								return_string = pivot.utils().padLeft(server_date.getDate(),2,'0');
	      								
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
				
				//if it is the same table, re-load the rows, summaries, and filters
				if(is_same_table)
				{
					//retreive all current filter fields
					pivot_config_data = pivot.config(true);
					
					input.filters = pivot_config_data.filters;
					input.rowLabels = pivot_config_data.rowLabels;
					input.summaries = pivot_config_data.summaries;
					
				}
				else
				{
					document.getElementById(self.report_results_data_display_div.id).innerHTML = '';
				}
				
				
				$('#' + self.report_summaries_data_display_div.id).pivot_display('setup', input);
			}
			else
			{
				document.getElementById(self.report_results_data_display_div.id).innerHTML = "No data";
			}
			
		}
		else
		{
			document.getElementById(self.report_results_data_display_div.id).innerHTML = '';
		
		}
		
		
		
	};
	
	this.Type_Select_Change = function(){
		
		this.Tables_Select_Changed(false);
		
	};

	this.Render_Summaries_Form = function(form_div_id) {

		this.report_summaries_data_form = document.createElement("form");
		this.report_summaries_data_form.setAttribute('method', "post");
		this.report_summaries_data_form.setAttribute('id', "report_summaries_display_form");
		
		this.report_summaries_data_form.innerHTML += 'Saved Reports:<br/>';
		
		this.report_saved_select = document.createElement("select");
		this.report_saved_select.setAttribute('id', 'report_saved_select');
		this.report_saved_select.innerHTML = '<option value="0">-</option>';
		this.report_summaries_data_form.appendChild(this.report_saved_select);
		
		this.report_summaries_data_form.innerHTML += '<br/>Tables:<br/>';
		
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
		this.summaries_graph_canvas.height = 0;
		this.report_summaries_data_form.appendChild(self.summaries_graph_canvas);
		this.report_summaries_data_form.innerHTML += '<hr/>';
		
		this.report_summaries_data_legend_div = document.createElement("div");
		this.report_summaries_data_legend_div.setAttribute('id', 'report_summaries_data_legend_div');
		this.report_summaries_data_form.appendChild(this.report_summaries_data_legend_div);
		
		this.report_results_data_display_div = document.createElement("div");
		this.report_results_data_display_div.setAttribute('id', 'report_summaries_data_results');
		this.report_summaries_data_form.appendChild(this.report_results_data_display_div);
		
		this.report_save_button = document.createElement("input");
		this.report_save_button.setAttribute('id', 'report_save_button');
		this.report_save_button.setAttribute('type', 'submit');
		this.report_save_button.value = 'Save';
		this.report_summaries_data_form.appendChild(this.report_save_button);
		
		var div_tab = document.getElementById(form_div_id);
		div_tab.appendChild(this.report_summaries_data_form);
		
		$('#' + this.report_save_button.id).button();
		$('#' + this.report_save_button.id).click(function(event) {

			//ensure a normal postback does not occur
			event.preventDefault();

			//execute the click event
			self.Save_Report_Button_Click();			
		});
		
		$('#' + self.report_saved_select.id).change(function() {
			
			self.Saved_Reports_Select_Changed();

		});
		
		$('#' + self.report_summaries_tables_select.id).change(function() {
			
			self.Tables_Select_Changed(false);

		});
		
		$('#' + self.report_summaries_type_select.id).change(function() {
			
			self.Type_Select_Change();

		});
		
		$('#' + self.summaries_graph_type_select.id).change(function() {
			
			self.Refresh_Chart_Data(true);

		});

		$('#' + self.summaries_graph_select_x_column.id).change(function() {
			
			self.Refresh_Chart_Data(true);

		});
		
		$('#' + self.summaries_graph_select_y_column.id).change(function() {
			
			self.Refresh_Chart_Data(true);

		});
		
		window.onresize = function(event) {
			self.Refresh_Chart_Data(true);
		};

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

