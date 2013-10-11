/** This is the graph tab which will have graphs to display data.
 * @constructor Graph_Tab
 */
function Graph_Tab() {

	//class variables
	this.div_id = null;
	
	this.Refresh = function(data){
		
		var barChartData = {
			labels : ["January","February","March","April","May","June","July"],
			datasets : [
				{
					fillColor : "rgba(220,220,220,0.5)",
					strokeColor : "rgba(220,220,220,1)",
					data : [65,59,90,81,56,55,40]
				},
				{
					fillColor : "rgba(151,187,205,0.5)",
					strokeColor : "rgba(151,187,205,1)",
					data : [28,48,40,19,96,27,100]
				}
			]
		};
		
		this.myLine = new Chart(document.getElementById("summary_graph_canvas").getContext("2d")).Bar(barChartData); 
		
	};
	
	this.Render_Summaries_Form = function(div_id){
		
		self = this;
		
		graph_html = '';
		
		graph_html += 'Data:<br/>';
		graph_html += '<canvas id="summary_graph_canvas" width="500" height="400"></canvas><br/>';
		graph_html += 'Table:<br/>';
		graph_html += '<select id="graph_tab_table_select"><option>-</option></select><br/>';
		graph_html += 'X Column:<br/>';
		graph_html += '<select id="graph_tab_x_col_select"><option>-</option></select><br/>';
		graph_html += 'Y Column:<br/>';
		graph_html += '<select id="graph_tab_y_col_select"><option>-</option></select><br/>';
		
		document.getElementById(div_id).innerHTML = graph_html;
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

