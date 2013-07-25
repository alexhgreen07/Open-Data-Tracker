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

require_once(dirname(__FILE__).'/../../../accordian.js.php');

require_once(dirname(__FILE__).'/new_category_form.js.php');
require_once(dirname(__FILE__).'/edit_category_form.js.php');
require_once(dirname(__FILE__).'/view_categories_form.js.php');

?>


/** This is the form to interact with category data.
 * @constructor Category_Form
 */
function Category_Form(){
	
	var self = this;
	
	/** This is the form for new categories.
	 * @type New_Category_Form
	 * */
	this.new_category_form = new New_Category_Form();
	
	/** This is the form to edit categories.
	 * @type Edit_Category_Form
	 * */
	this.edit_category_form = new Edit_Category_Form();
	
	/** This is the form to view categories.
	 * @type View_Category_Form
	 * */
	this.view_categories_forms = new View_Category_Form();
	
	this.Refresh = function(data){
		
		var select_html = '';
		

		select_html += '<option value="0">-</option>';
		
		self.categories_list = data.categories;
		
		for (var i=0; i < self.categories_list.length; i++) {
			

			var current_row = self.categories_list[i];

			select_html += '<option value="' + current_row.category_id + '">' + current_row.category_path + '</option>';
	
		  
		};
		
		document.getElementById(self.new_category_form.add_new_category_parent_select.id).innerHTML = select_html;
		document.getElementById(self.edit_category_form.edit_category_select.id).innerHTML = select_html;
		document.getElementById(self.edit_category_form.edit_category_parent_select.id).innerHTML = select_html;
		
		this.view_categories_forms.Refresh(data);
	};
	
	/** @method Render
	 * @desc This function will render the general home form in the specified div.
	 * @param {String} form_div_id The div ID to render the form in.
	 * */
	this.Render = function(form_div_id) {
		var tabs_array = new Array();
		var new_tab;

		new_tab = new Array();
		new_tab.push("View Categories");
		new_tab.push('<div id="home_category_view_tab"></div>');
		tabs_array.push(new_tab);

		new_tab = new Array();
		new_tab.push("New Category");
		new_tab.push('<div id="home_category_add_new_tab"></div>');
		tabs_array.push(new_tab);

		new_tab = new Array();
		new_tab.push("Edit Category");
		new_tab.push('<div id="home_category_edit_tab"></div>');
		tabs_array.push(new_tab);

		this.general_form = document.createElement("form");
		this.general_form.setAttribute('method', "post");
		this.general_form.setAttribute('id', "home_general_form");

		var div_tab = document.getElementById(form_div_id);
		div_tab.innerHTML = '<div id="home_category_accordian_div"></div>';
		div_tab.appendChild(this.general_form);

		var category_accordian = new Accordian('home_category_accordian_div', tabs_array);
		category_accordian.Render();

		this.view_categories_forms.Render('home_category_view_tab');
		this.new_category_form.Render('home_category_add_new_tab');
		this.edit_category_form.Render('home_category_edit_tab');
	};
	
}