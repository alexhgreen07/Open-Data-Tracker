/** This is the report tab object which holds all UI objects for detailed data interaction.
 * @constructor Report_Tab
 */
function Report_Tab() {

	//class variables
	this.div_id = null;
	
	this.Refresh = function(data) {
		
		var self = this;
		
		self.json_titles = '["last_name","first_name","zip_code","billed_amount","last_billed_date"]';
		self.json_data = 
			'["Jackson", "Robert", 34471, 100.00, "Tue, 24 Jan 2012 05:00:00 +0000"]' + 
        	',["Smith", "Jon", 34476, 173.20, "Mon, 13 Feb 2012 00:15:00 +0000"]' + 
        	',["Gerber", "Jake", 34479, 502.57, "Mon, 19 Feb 2012 01:00:00 +0000"]';
		self.json_string = '[' + self.json_titles + ',' + self.json_data + ']';
		
		self.fields =[{name: 'last_name',   type: 'string',   filterable: true},
	        {name: 'first_name',        type: 'string',   filterable: true},
	        {name: 'zip_code',          type: 'integer',  filterable: true},
	        {name: 'pseudo_zip',        type: 'integer',  filterable: true },
	        {name: 'billed_amount',     type: 'float',    rowLabelable: false},
	        {name: 'last_billed_date',  type: 'date',     filterable: true}];
		
		var input = {json:self.json_string, fields: self.fields, rowLabels:["last_name"]};
		
		
		$('#' + self.report_summaries_data_display_div.id).pivot_display('setup', input);
		
		$('#' + self.report_summaries_data_display_div.id + ' > div > div').css('float','none');
		
		//self.Setup_Pivot(input);
		//$('#' + self.report_summaries_data_display_div.id).pivot_display('setup', {csv:self.csv,fields:self.fields});
		
		/*
		new_inner_html = pivot.data().all;
		
		var summary_div = document.getElementById(self.report_summaries_data_display_div.id);
		summary_div.innerHTML = new_inner_html;
		*/
		
		/*
		var params = new Array();

		var new_inner_html = '';

		new_inner_html += 'Last refreshed: ' + (new Date()) + '<br />';

		new_inner_html += '';

		var summary_div = document.getElementById(self.report_summaries_data_display_div.id);
		summary_div.innerHTML = new_inner_html;
		
		*/

	};

	this.Render_Summaries_Form = function(form_div_id) {

		var self = this;

		this.report_summaries_data_form = document.createElement("form");
		this.report_summaries_data_form.setAttribute('method', "post");
		this.report_summaries_data_form.setAttribute('id', "report_summaries_display_form");
		
		this.report_summaries_data_display_div = document.createElement("div");
		this.report_summaries_data_display_div.setAttribute('id', 'report_summaries_data_display_div');
		this.report_summaries_data_form.appendChild(this.report_summaries_data_display_div);
		
		this.report_results_data_display_div = document.createElement("div");
		this.report_results_data_display_div.setAttribute('id', 'results');
		this.report_summaries_data_form.appendChild(this.report_results_data_display_div);
		
		/*
		this.report_summaries_data_display_table = document.createElement("table");
		this.report_summaries_data_display_table.setAttribute('id', 'report_results_data_display_table');
		this.report_results_data_display_div.appendChild(this.report_summaries_data_display_table);
		*/
		var div_tab = document.getElementById(form_div_id);
		div_tab.appendChild(this.report_summaries_data_form);
		
		//$('#' + self.report_summaries_data_display_table.id).dataTable();

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
		new_tab.push("Sums and Averages");
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

