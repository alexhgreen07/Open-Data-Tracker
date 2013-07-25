<?php
/*
 * NOTE: This is PHP code intended to perform server side includes
 * and resolve any javascript file dependencies. If PHP is
 * not installed on the server, this code can be replaced
 * with client side HTML includes (or dynamic javascript includes.)
*/

Header("content-type: application/x-javascript");

//jquery code
include_once(dirname(__FILE__).'/../../../external/jquery-ui-1.10.0.custom/js/jquery-1.9.0.js');

//jquery UI code
include_once(dirname(__FILE__).'/../../../../external/jquery-ui-1.10.0.custom/js/jquery-ui-1.10.0.custom.js');

//jquery datepicker code (addon)
include_once(dirname(__FILE__).'/../../../../external/jquery-ui-timerpicker-addon/jquery-ui-timepicker-addon.js');

//JSON RPC library
include_once(dirname(__FILE__).'/../../../../external/json-rpc2php-master/jsonRPC2php.client.js');

?>

/** This is the view item entries form class which holds all UI objects for viewing item data.
 * @constructor View_Item_Entries_Form
 */
function View_Item_Entries_Form(){

	
	/** @method Refresh
	 * @desc This function refreshes the item display pane table.
	 * @param {function} refresh_callback The function to call after the data has refreshed successfully.
	 * */
	this.Refresh = function(data) {
		var self = this;

		self.item_log_data = data.item_entries;
		
		var new_html = '';
		new_html += 'Last refreshed: ' + (new Date()) + '<br />';
		new_html += "<b>Database Output</b><br><table border='1' style='width:100%;'>";
		new_html += "<tr><td>Date</td><td>Name</td><td>Value</td><td>Unit</td><td>Note</td></tr>";
		
		for (var i = 0; i < self.item_log_data.length; i++) {
		    
		    new_html += '<tr>';
		    
		    new_html += '<td>' + self.item_log_data[i].time + '</td>';
		    new_html += '<td>' + self.item_log_data[i].name + '</td>';
		    new_html += '<td>' + self.item_log_data[i].value + '</td>';
		    new_html += '<td>' + self.item_log_data[i].unit + '</td>';
		    new_html += '<td>' + self.item_log_data[i].note + '</td>';
		    
		    new_html += '</tr>';
		}
		
		new_html += '</table>';
		
		document.getElementById(self.new_data_display_div.id).innerHTML = new_html;
		
	};
	
	/** @method Item_Data_Refresh_Click
	 * @desc This is the event function for the item data refresh button click event.
	 * */
	this.Item_Data_Refresh_Click = function() {

		//alert('calling rpc onclick.');

		this.Refresh_Item_Data();

	};
	
	/** @method Render
	 * @desc This function will render the item log in the specified div.
	 * @param {String} form_div_id The div ID to render the form in.
	 * */
	this.Render = function(form_div_id) {
		var self = this;
		var return_html = '';

		this.data_form = document.createElement("form");
		this.data_form.setAttribute('method', "post");
		this.data_form.setAttribute('id', "data_display_form");

		this.new_data_display_div = document.createElement("div");
		this.new_data_display_div.setAttribute('id', 'new_item_data_display_div');
		this.data_form.appendChild(this.new_data_display_div);

		var div_tab = document.getElementById(form_div_id);

		div_tab.innerHTML = '';

		div_tab.appendChild(this.data_form);


	};

}