/** This is a wrapper for an array of panes in a JQuery tab object.
 * @constructor Tabs
 */
function Tabs(tab_div_id, tab_array) {
	
	var self = this;
	
	//class variables
	this.div_id = tab_div_id;
	this.tabs = tab_array;
	this.activate_callback = function(){};

	//render function (div must already exist)
	this.Render = function() {

		var new_inner_html = '';

		new_inner_html += "<ul>";

		//create all top tab items using ul
		for (var i = 0; i < this.tabs.length; i++) {
			new_inner_html += '<li><a href="#' + this.div_id + '-tab-' + i + '">' + this.tabs[i][0] + '</a></li>';
		}

		new_inner_html += "</ul>";

		//create all content tab items using div
		for (var i = 0; i < this.tabs.length; i++) {
			new_inner_html += '<div id="' + this.div_id + '-tab-' + i + '">' + this.tabs[i][1] + '</div>';
		}

		new_inner_html += "</ul>";

		var div_tab = document.getElementById(this.div_id);

		div_tab.innerHTML = new_inner_html;

		//execute JQuery tabs initialization
		$("#" + this.div_id).tabs({
			activate: function(event, ui) {
		        self.activate_callback();
		    }
		});

	};
}

