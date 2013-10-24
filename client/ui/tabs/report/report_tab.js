/** This is the report tab object which holds all UI objects for detailed data interaction.
 * @constructor Report_Tab
 */
function Report_Tab() {

	//class variables
	this.div_id = null;
	
	this.Refresh = function(data, schema) {
		
		var self = this;
		
		self.data = data;
		self.schema = schema;
		
		self.Refresh_Summaries_Form(data);
		
	};
	
	this.Refresh_Summaries_Form = function(data){
		
		self = this;
		
		
		document.getElementById(this.report_summaries_tables_select.id).innerHTML = '<option>-</option>';
		
		//get all table names
		for (var key in data) {
			
			document.getElementById(this.report_summaries_tables_select.id).innerHTML += '<option>' + key + '</option>';
		}
		
	};
	
	this.Refresh_Chart_Data = function(){
		
		
		
	};
	
	this.Results_Update_Callback = function(){
		
		alert('hello world!');
		
	};
	
	this.Tables_Select_Changed = function(){
		
		var self = this;
		
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
						
						self.fields.push({name: column,   type: 'string',  rowLabelable: true, filterable: true, summarizable: summary_type});
					}
					
					key_data_row.push(key[column]);
					
					
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

		var self = this;

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
		
		this.report_summaries_data_form.innerHTML += '<hr/>';
		this.summaries_graph_canvas = document.createElement('canvas');
		this.summaries_graph_canvas.id = 'graph_tab_table_select';
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

	};

	this.Render_Time_Based_Form = function(form_div_id) {

		var self = this;

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

