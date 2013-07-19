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
include_once(dirname(__FILE__).'/../../../external/jquery-ui-1.10.0.custom/js/jquery-ui-1.10.0.custom.js');

//JSON RPC library
include_once(dirname(__FILE__).'/../../../external/json-rpc2php-master/jsonRPC2php.client.js');

require_once(dirname(__FILE__).'/../../../accordian.js.php');

require_once(dirname(__FILE__).'/edit_category_form.js.php');
require_once(dirname(__FILE__).'/view_categories_form.js.php');

?>


/** This is the form to interact with category data.
 * @constructor Category_Form
 */
function Category_Form(){
	
	/** This is the form to edit categories.
	 * @type Edit_Category_Form
	 * */
	this.edit_category_form = new Edit_Category_Form();
	
	this.view_categories_forms = new View_Category_Form();
	
	
	/** @method Category_Insert_Submit_Click_Event
	 * @desc This is the insert category submit button click event handler.
	 * @param {function} refresh_callback The callback to call after the data operation has completed.
	 * */
	this.Category_Insert_Submit_Click_Event = function(refresh_callback){
		
		var params = new Array();
		params.push(document.getElementById(this.add_new_category_name.id).value);
		params.push(document.getElementById(this.add_new_category_description.id).value);
		params.push(document.getElementById(this.add_new_category_parent_select.id).value);

		var self = this;


		//execute the RPC callback for retrieving the item log
		rpc.Home_Data_Interface.Insert_Category(params, function(jsonRpcObj) {


			if (jsonRpcObj.result.success == 'true') {

				alert('New category added.');
					
				
				self.Refresh_Data(function(){
					
					self.refresh_categories_callback();
					
					refresh_callback();
				});
				

			} else {
				alert('Category failed to add.');
				alert(jsonRpcObj.result.debug);
			}

		});
		
	};
	
	/** @method Render_Add_New_Category_Tab
	 * @desc This function will render the add new category tab in the specified div.
	 * @param {String} form_div_id The div ID to render the form in.
	 * */
	this.Render_Add_New_Category_Tab = function(form_div_id) {
		
		var self = this;
		
		this.add_new_category_form = document.createElement("form");
		this.add_new_category_form.setAttribute('method', "post");
		this.add_new_category_form.setAttribute('id', "home_add_new_category_form");

		this.add_new_category_form.innerHTML += 'Name:<br />';

		this.add_new_category_name = document.createElement("input");
		this.add_new_category_name.setAttribute('type', "text");
		this.add_new_category_name.setAttribute('id', "add_new_category_name");
		this.add_new_category_form.appendChild(this.add_new_category_name);

		this.add_new_category_form.innerHTML += 'Description:<br />';

		this.add_new_category_description = document.createElement("input");
		this.add_new_category_description.setAttribute('type', "text");
		this.add_new_category_description.setAttribute('id', "add_new_category_description");
		this.add_new_category_form.appendChild(this.add_new_category_description);

		this.add_new_category_form.innerHTML += 'Parent Category:<br />';

		this.add_new_category_parent_select = document.createElement("select");
		this.add_new_category_parent_select.setAttribute('id', "add_new_category_parent_select");
		this.add_new_category_parent_select.innerHTML = '<option value="0">-</option>';
		this.add_new_category_form.appendChild(this.add_new_category_parent_select);

		this.add_new_category_form.innerHTML += '<br /><br />';

		this.add_new_category_submit_button = document.createElement("input");
		this.add_new_category_submit_button.setAttribute('id', 'add_new_category_submit_button');
		this.add_new_category_submit_button.setAttribute('type', 'submit');
		this.add_new_category_submit_button.value = 'Submit';
		this.add_new_category_form.appendChild(this.add_new_category_submit_button);

		var div_tab = document.getElementById(form_div_id);
		div_tab.innerHTML = '';
		div_tab.appendChild(this.add_new_category_form);

		$('#' + this.add_new_category_submit_button.id).button();
		$('#' + this.add_new_category_submit_button.id).click(function(event) {
			//ensure a normal postback does not occur
			event.preventDefault();
			
			self.Category_Insert_Submit_Click_Event(function(){});
		});
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
		this.Render_Add_New_Category_Tab('home_category_add_new_tab');
		this.edit_category_form.Render('home_category_edit_tab');
	};
	
}