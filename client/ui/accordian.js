/** This is a wrapper class for an array of JQuery accordian panes.
 * @constructor Accordian
 */
function Accordian() {

	//render function (div must already exist)
	this.Render = function(accordian_div_id, accordian_array) {

		var new_inner_html = '';

		//create all top tab items using ul
		for (var i = 0; i < accordian_array.length; i++) {
			new_inner_html += '<h3>' + accordian_array[i][0] + '</h3>';
			new_inner_html += '<div><p>' + accordian_array[i][1] + '</p></div>';
		}

		var div_tab = document.getElementById(accordian_div_id);

		div_tab.innerHTML = new_inner_html;

		//execute JQuery tabs initialization
		$("#" + accordian_div_id).accordion({
			collapsible : true,
			heightStyle : "content"
		});

	};
}

