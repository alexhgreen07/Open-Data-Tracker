function Graph_Tab (data_div_id) {

	//class variables
	this.div_id = data_div_id;

	//render function (div must already exist)
	this.Render = function() {
	
		var return_html = '';
		
		return_html += '<form method="post" style="text-align:center;" id="graph_display_form">';
		return_html += '<button type="button" onClick="Alert_Stuff()">Refresh</button>';
		return_html += '</form>';
		
		var div_tab = document.getElementById(this.div_id);

		div_tab.innerHTML = return_html;
		

	};
}




