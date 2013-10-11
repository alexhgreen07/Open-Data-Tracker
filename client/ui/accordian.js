/** This is a wrapper class for an array of JQuery accordian panes.
 * @constructor Accordian
 */
function Accordian(accordian_div_id, accordian_array) {

	//class variables
	this.div_id = accordian_div_id;
	this.tabs = accordian_array;

	//render function (div must already exist)
	this.Render = function() {

		var new_inner_html = '';

		//create all top tab items using ul
		for (var i = 0; i < this.tabs.length; i++) {
			new_inner_html += '<h3>' + this.tabs[i][0] + '</h3>';
			new_inner_html += '<div><p>' + this.tabs[i][1] + '</p></div>';
		}

		var div_tab = document.getElementById(this.div_id);

		div_tab.innerHTML = new_inner_html;

		//execute JQuery tabs initialization
		$("#" + this.div_id).accordion({
			collapsible : true,
			heightStyle : "content"
		});

	};
}

