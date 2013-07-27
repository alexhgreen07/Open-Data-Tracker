<?php
/*
 * NOTE: This is PHP code intended to perform server side includes
 * and resolve any javascript file dependencies. If PHP is
 * not installed on the server, this code can be replaced
 * with client side HTML includes (or dynamic javascript includes.)
*/

Header("content-type: application/x-javascript");

//jquery code
include_once(dirname(__FILE__).'/../../../../../externals/jquery-ui/jquery-1.10.2.js');

//jquery UI code
include_once(dirname(__FILE__).'/../../../../../externals/jquery-ui/ui/jquery.ui.core.js');

//JSON RPC library
include_once(dirname(__FILE__).'/../../../../../externals/json-rpc2php/jsonRPC2php.client.js');

?>

/** This is the new category form class which holds all UI objects for the new category entry.
 * @constructor New_Category_Form
 */
function New_Category_Form(){
	
	
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

		/*
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
		*/
		
	};
	
	/** @method Render
	 * @desc This function will render the add new category tab in the specified div.
	 * @param {String} form_div_id The div ID to render the form in.
	 * */
	this.Render = function(form_div_id) {
		
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
	
}
