<?php
/*
 * NOTE: This is PHP code intended to perform server side includes
 * and resolve any javascript file dependencies. If PHP is
 * not installed on the server, this code can be replaced
 * with client side HTML includes (or dynamic javascript includes.)
*/

Header("content-type: application/x-javascript");

//jquery code
include_once(dirname(__FILE__).'/../../../../external/jquery-ui-1.10.0.custom/js/jquery-1.9.0.js');

//jquery UI code
include_once(dirname(__FILE__).'/../../../../external/jquery-ui-1.10.0.custom/js/jquery-ui-1.10.0.custom.js');

//JSON RPC library
include_once(dirname(__FILE__).'/../../../../external/json-rpc2php-master/jsonRPC2php.client.js');

?>

/** This is the view category form class which holds all UI objects for the category view.
 * @constructor View_Category_Form
 */
function View_Category_Form(){
	
	this.Refresh = function(data)
	{
		var new_inner_html = '';
		var select_html = '';

		new_inner_html += 'Last refreshed: ' + (new Date()) + '<br />';
		
		new_inner_html += '<table border="1" style="width:100%;">';
		new_inner_html += '<tr><td>Name</td><td>Description</td><td>Category Path</td></tr>';
		
		select_html += '<option value="0">-</option>';
		
		self.categories_list = data.categories;
		
		for (var i=0; i < self.categories_list.length; i++) {
			

			var current_row = self.categories_list[i];

			new_inner_html += '<tr>';
			new_inner_html += '<td>';
			new_inner_html += current_row.name;
			new_inner_html += '</td>';
			new_inner_html += '<td>';
			new_inner_html += current_row.description;
			new_inner_html += '</td>';
			new_inner_html += '<td>';

			if (current_row.category_path) {
				new_inner_html += current_row.category_path;
			}

			new_inner_html += '</td>';
			new_inner_html += '</tr>';

			select_html += '<option value="' + current_row.category_id + '">' + current_row.category_path + '</option>';
	
		  
		};
		
		new_inner_html += '</table>';
		
		
		document.getElementById(self.category_data_div.id).innerHTML = new_inner_html;
		
		
	};
	
	/** @method Render
	 * @desc This function will render the view category tab in the specified div.
	 * @param {String} form_div_id The div ID to render the form in.
	 * */
	this.Render = function(form_div_id) {

		var self = this;
		
		this.view_category_form = document.createElement("form");
		this.view_category_form.setAttribute('method', "post");
		this.view_category_form.setAttribute('id', "home_view_category_form");
		
		this.category_data_div = document.createElement("div");
		this.category_data_div.setAttribute('id', "category_data_div");
		this.category_data_div.innerHTML = 'Under construction...';
		this.view_category_form.appendChild(this.category_data_div);
		
		var div_tab = document.getElementById(form_div_id);
		div_tab.appendChild(this.view_category_form);
		
	};
	
}
