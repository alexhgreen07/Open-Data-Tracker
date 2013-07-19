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

require_once(dirname(__FILE__).'/forms/home_form.js.php');

require_once(dirname(__FILE__).'/forms/category_form.js.php');

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
	
	this.home_form = new Home_Form();
	
	/** This is the form for the application settings.
	 * @type Settings_Form
	 * */
	this.settings_form = new Settings_Form();
	
	/** This is the form for the application category data.
	 * @type Category_Form
	 * */
	this.category_form = new Category_Form();
	
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
		
		self.home_form.Summary_Data_Refresh_Click_Event(function(){
			
			self.category_form.view_categories_forms.Category_Data_Refresh_Click_Event(function(){
			
				refresh_callback();
			});
		});
		
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

		this.home_form.Render('home_summary_data_div');
		this.category_form.Render('home_general_div');
		this.settings_form.Render('home_settings_div');

		//call the click event function
		//this.Summary_Data_Refresh_Click_Event();

	};
}

