<?php
/*
 * NOTE: This is PHP code intended to perform server side includes
 * and resolve any javascript file dependencies. If PHP is
 * not installed on the server, this code can be replaced
 * with client side HTML includes (or dynamic javascript includes.)
*/

Header("content-type: application/x-javascript");

//jquery code
include_once(dirname(__FILE__).'/../../external/jquery-ui-1.10.0.custom/js/jquery-1.9.0.js');

//jquery UI code
include_once(dirname(__FILE__).'/../../external/jquery-ui-1.10.0.custom/js/jquery-ui-1.10.0.custom.js');

//JSON RPC library
include_once(dirname(__FILE__).'/../../external/json-rpc2php-master/jsonRPC2php.client.js');

require_once(dirname(__FILE__).'/../../accordian.js.php');

require_once(dirname(__FILE__).'/forms/settings_form.js.php');

?>

/** This is the home tab class which holds all UI objects for general data.
 * @constructor Home_Tab
 */
function Home_Tab(home_div_id) {

	/** This is the parent div ID where the home tab is.
	 * @type String
	 * */
	this.div_id = home_div_id;
	
	/** This is the form for the application settings.
	 * @type Settings_Form
	 * */
	this.settings_form = new Settings_Form();
	
	/** This is the refresh categories callback.
	 * @type function
	 * */
	this.refresh_categories_callback = function(){};

	/** @method Refresh_Data
	 * @desc This function retrieves the home data from the server.
	 * @param {function} refresh_callback The callback to call after the refresh of data has completed.
	 * */
	this.Refresh_Data = function(refresh_callback) {
		var self = this;
		
		self.Summary_Data_Refresh_Click_Event(function(){
			
			self.Category_Data_Refresh_Click_Event(function(){
			
				refresh_callback();
			});
		});
		
	};

	/** @method Summary_Data_Refresh_Click_Event
	 * @desc This is the summary data refresh button click event handler.
	 * @param {function} refresh_callback The callback to call after the refresh of data has completed.
	 * */
	this.Summary_Data_Refresh_Click_Event = function(refresh_callback) {
		var params = new Array();

		var self = this;

		//show the loader image
		$('#' + self.loading_image.id).show();

		//execute the RPC callback for retrieving the item log
		rpc.Home_Data_Interface.Get_Home_Data_Summary(params, function(jsonRpcObj) {

			var new_inner_html = '';

			new_inner_html += 'Last refreshed: ' + (new Date()) + '<br />';

			new_inner_html += jsonRpcObj.result.html;

			self.new_data_display_div.innerHTML = new_inner_html;

			//hide the loader image
			$('#' + self.loading_image.id).hide();

			refresh_callback();
		});
	};

	/** @method Category_Data_Refresh_Click_Event
	 * @desc This is the category data refresh button click event handler.
	 * @param {function} refresh_callback The callback to call after the refresh of data has completed.
	 * */
	this.Category_Data_Refresh_Click_Event = function(refresh_callback) {
		
		var params = new Array();

		var self = this;


		//execute the RPC callback for retrieving the item log
		rpc.Home_Data_Interface.Get_Categories(params, function(jsonRpcObj) {
			
			if(jsonRpcObj.result.authenticated)
			{
				if(jsonRpcObj.result.success)
				{
					var new_inner_html = '';
					var select_html = '';
		
					new_inner_html += 'Last refreshed: ' + (new Date()) + '<br />';
					
					new_inner_html += '<table border="1" style="width:100%;">';
					new_inner_html += '<tr><td>Name</td><td>Description</td><td>Category Path</td></tr>';
					
					select_html += '<option value="0">-</option>';
					
					
					for (var i=0; i < jsonRpcObj.result.data.length; i++) {
						
		
						var current_row = jsonRpcObj.result.data[i];
		
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
					
					
					self.categories_list = jsonRpcObj.result.data;
					
					new_inner_html += '</table>';
					
					
					document.getElementById(self.category_data_div.id).innerHTML = new_inner_html;
					document.getElementById(self.add_new_category_parent_select.id).innerHTML = select_html;
					document.getElementById(self.edit_category_select.id).innerHTML = select_html;
					document.getElementById(self.edit_category_parent_select.id).innerHTML = select_html;
				}
				else
				{
					alert('Refresh failed.');
				}
				
			}
			else
			{
				alert('Not authenticated. Refresh failed.');
			}
			
			
			
			
			refresh_callback();
		});
			
		
	}
	
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
	
	/** @method Category_Edit_Submit_Click_Event
	 * @desc This is the edit category submit button click event handler.
	 * @param {function} refresh_callback The callback to call after the data operation has completed.
	 * */
	this.Category_Edit_Submit_Click_Event = function(refresh_callback){
		
		
		var selected_category_index = document.getElementById(this.edit_category_select.id).value;
		
		if(selected_category_index != 0)
		{
			
		
		
			var params = new Array();
			params.push(selected_category_index);
			params.push(document.getElementById(this.edit_category_name.id).value);
			params.push(document.getElementById(this.edit_category_description.id).value);
			params.push(document.getElementById(this.edit_category_parent_select.id).value);

	
			var self = this;
	
	
			//execute the RPC callback for retrieving the item log
			rpc.Home_Data_Interface.Update_Category(params, function(jsonRpcObj) {
	
	
				if (jsonRpcObj.result.success == 'true') {
	
					alert('Category successfully updated.');
						
					
					self.Refresh_Data(function(){
						
						self.refresh_categories_callback();
						
						refresh_callback();
					});
					
	
				} else {
					alert('Category failed to update.');
					//alert(jsonRpcObj.result.debug);
				}
	
			});
			
			
		}
		else
		{
			alert('Select a valid category.');
		}
	};
	
	/** @method Category_Delete_Click_Event
	 * @desc This is the delete category submit button click event handler.
	 * @param {function} refresh_callback The callback to call after the data operation has completed.
	 * */
	this.Category_Delete_Click_Event = function(refresh_callback){
		
		var selected_category_index = document.getElementById(this.edit_category_select.id).value;
		
		if(selected_category_index != 0)
		{
			
			var r=confirm("Are you sure you want to delete this task target?");
				
			if (r==true)
			{
			
				var params = new Array();
				params.push(selected_category_index);
		
				var self = this;
		
		
				//execute the RPC callback for retrieving the item log
				rpc.Home_Data_Interface.Delete_Category(params, function(jsonRpcObj) {
		
		
					if (jsonRpcObj.result.success == 'true') {
		
						alert('Category deleted.');
							
						
						self.Refresh_Data(function(){
							
							self.refresh_categories_callback();
							
							refresh_callback();
						});
						
		
					} else {
						alert('Category failed to delete.');
						//alert(jsonRpcObj.result.debug);
					}
		
				});
			
			}
		}
		else
		{
			alert('Select a valid category.');
		}
		
		
	};
	
	/** @method Category_Edit_Select_Change_Event
	 * @desc This is the category edit HTML select index change event handler.
	 * */
	this.Category_Edit_Select_Change_Event = function(){
		
		var selected_index = document.getElementById(this.edit_category_select.id).selectedIndex;
		
		if(selected_index > 0)
		{
			var selected_category = this.categories_list[selected_index - 1];
		
			document.getElementById(this.edit_category_name.id).value = selected_category.name;
			document.getElementById(this.edit_category_description.id).value = selected_category.description;
			document.getElementById(this.edit_category_parent_select.id).value = selected_category.parent_category_id;
			
		}
		else{
			
			document.getElementById(this.edit_category_name.id).value = "";
			document.getElementById(this.edit_category_description.id).value = "";
			document.getElementById(this.edit_category_parent_select.id).value = "0";
			
			
		}
		
		
	};
	
	/** @method Render_Summary_Home_Data
	 * @desc This function will render the home data form in the specified div.
	 * @param {String} form_div_id The div ID to render the form in.
	 * */
	this.Render_Summary_Home_Data = function(form_div_id) {
		this.data_form = document.createElement("form");
		this.data_form.setAttribute('method', "post");
		this.data_form.setAttribute('id', "home_display_form");

		this.button = document.createElement("input");
		this.button.setAttribute('type', 'submit');
		this.button.setAttribute('id', 'home_submit_button');
		this.button.value = 'Refresh';

		this.data_form.appendChild(this.button);

		this.loading_image = document.createElement("img");
		this.loading_image.setAttribute('id', 'home_tab_refresh_loader_image');
		this.loading_image.setAttribute('style', 'width:100%;height:19px;');
		this.loading_image.setAttribute('src', 'ajax-loader.gif');
		this.data_form.appendChild(this.loading_image);

		this.new_data_display_div = document.createElement("div");
		this.data_form.appendChild(this.new_data_display_div);

		var div_tab = document.getElementById(form_div_id);
		div_tab.innerHTML = '';
		div_tab.appendChild(this.data_form);

		var self = this;
		$('#' + this.button.id).button();
		$('#' + this.button.id).click(function(event) {

			//ensure a normal postback does not occur
			event.preventDefault();

			//execute the click event
			self.Summary_Data_Refresh_Click_Event();
		});
	};

	/** @method Render_View_Category_Tab
	 * @desc This function will render the view category tab in the specified div.
	 * @param {String} form_div_id The div ID to render the form in.
	 * */
	this.Render_View_Category_Tab = function(form_div_id) {

		var self = this;
		
		this.view_category_form = document.createElement("form");
		this.view_category_form.setAttribute('method', "post");
		this.view_category_form.setAttribute('id', "home_view_category_form");
		
		this.refresh_category_data_button = document.createElement("input");
		this.refresh_category_data_button.setAttribute('type', "submit");
		this.refresh_category_data_button.setAttribute('id', "refresh_category_data_button");
		this.refresh_category_data_button.value = "Refresh";
		this.view_category_form.appendChild(this.refresh_category_data_button);
		
		this.category_data_div = document.createElement("div");
		this.category_data_div.setAttribute('id', "category_data_div");
		this.view_category_form.appendChild(this.category_data_div);
		
		var div_tab = document.getElementById(form_div_id);
		div_tab.appendChild(this.view_category_form);
		
		$('#' + this.refresh_category_data_button.id).button();
		$('#' + this.refresh_category_data_button.id).click(function(event){
			
			//ensure a normal postback does not occur
			event.preventDefault();
			
			self.Category_Data_Refresh_Click_Event(function(){});
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

	/** @method Render_Edit_Category_Tab
	 * @desc This function will render the edit category tab in the specified div.
	 * @param {String} form_div_id The div ID to render the form in.
	 * */
	this.Render_Edit_Category_Tab = function(form_div_id) {
		
		var self = this;
		
		this.edit_category_form = document.createElement("form");
		this.edit_category_form.setAttribute('method', "post");
		this.edit_category_form.setAttribute('id', "home_edit_category_form");

		this.edit_category_form.innerHTML += 'Category:<br />';

		this.edit_category_select = document.createElement("select");
		this.edit_category_select.setAttribute('id', "edit_category_select");
		this.edit_category_select.innerHTML = '<option>-</option>';
		this.edit_category_form.appendChild(this.edit_category_select);

		this.edit_category_form.innerHTML += '<br /><br />';

		this.edit_category_form.innerHTML += 'Name:<br />';

		this.edit_category_name = document.createElement("input");
		this.edit_category_name.setAttribute('type', "text");
		this.edit_category_name.setAttribute('id', "edit_category_name");
		this.edit_category_form.appendChild(this.edit_category_name);

		this.edit_category_form.innerHTML += 'Description:<br />';

		this.edit_category_description = document.createElement("input");
		this.edit_category_description.setAttribute('type', "text");
		this.edit_category_description.setAttribute('id', "edit_category_description");
		this.edit_category_form.appendChild(this.edit_category_description);

		this.edit_category_form.innerHTML += 'Parent Category:<br />';

		this.edit_category_parent_select = document.createElement("select");
		this.edit_category_parent_select.setAttribute('id', "edit_category_parent_select");
		this.edit_category_parent_select.innerHTML = '<option value="0">-</option>';
		this.edit_category_form.appendChild(this.edit_category_parent_select);

		this.edit_category_form.innerHTML += '<br /><br />';

		this.edit_category_submit_button = document.createElement("input");
		this.edit_category_submit_button.setAttribute('id', 'edit_category_submit_button');
		this.edit_category_submit_button.setAttribute('type', 'submit');
		this.edit_category_submit_button.value = 'Submit';
		this.edit_category_form.appendChild(this.edit_category_submit_button);

		this.edit_category_form.innerHTML += '<br /><br />';

		this.edit_category_delete_button = document.createElement("input");
		this.edit_category_delete_button.setAttribute('id', 'edit_category_delete_button');
		this.edit_category_delete_button.setAttribute('type', 'submit');
		this.edit_category_delete_button.value = 'Delete';
		this.edit_category_form.appendChild(this.edit_category_delete_button);

		var div_tab = document.getElementById(form_div_id);
		div_tab.innerHTML = '';
		div_tab.appendChild(this.edit_category_form);

		$('#' + this.edit_category_submit_button.id).button();
		$('#' + this.edit_category_delete_button.id).button();

		$('#' + this.edit_category_submit_button.id).click(function(event) {
			//ensure a normal postback does not occur
			event.preventDefault();
			
			self.Category_Edit_Submit_Click_Event(function(){});
		});

		$('#' + this.edit_category_delete_button.id).click(function(event) {
			//ensure a normal postback does not occur
			event.preventDefault();
			
			self.Category_Delete_Click_Event(function(){});

		});
		
		$('#' + this.edit_category_select.id).change(function(){
			
			self.Category_Edit_Select_Change_Event();
			
		});
	};

	/** @method Render_General_Home_Form
	 * @desc This function will render the general home form in the specified div.
	 * @param {String} form_div_id The div ID to render the form in.
	 * */
	this.Render_General_Home_Form = function(form_div_id) {
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

		this.Render_View_Category_Tab('home_category_view_tab');
		this.Render_Add_New_Category_Tab('home_category_add_new_tab');
		this.Render_Edit_Category_Tab('home_category_edit_tab');
	};

	/** @method Render
	 * @desc This function will render the tab in the div that it was initialized with.
	 * */
	this.Render = function() {

		var tabs_array = new Array();
		var new_tab;

		new_tab = new Array();
		new_tab.push("Summary Data");
		new_tab.push('<div id="home_summary_data_div"></div>');
		tabs_array.push(new_tab);

		new_tab = new Array();
		new_tab.push("General");
		new_tab.push('<div id="home_general_div"></div>');
		tabs_array.push(new_tab);
		
		new_tab = new Array();
		new_tab.push("Settings");
		new_tab.push('<div id="home_settings_div"></div>');
		tabs_array.push(new_tab);

		var return_html = '';

		return_html += '<div id="home_accordian"></div>';

		var div_tab = document.getElementById(this.div_id);

		div_tab.innerHTML = return_html;

		var items_accordian = new Accordian('home_accordian', tabs_array);
		items_accordian.Render();

		this.Render_Summary_Home_Data('home_summary_data_div');
		this.Render_General_Home_Form('home_general_div');
		this.settings_form.Render('home_settings_div');

		//call the click event function
		//this.Summary_Data_Refresh_Click_Event();

	};
}

