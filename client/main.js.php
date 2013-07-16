<?php


Header("content-type: application/x-javascript");

//jquery code
include_once('external/jquery-ui-1.10.0.custom/js/jquery-1.9.0.js');

//jquery UI code
include_once('external/jquery-ui-1.10.0.custom/js/jquery-ui-1.10.0.custom.js');

//jquery datepicker code
include_once('external/jquery-ui-timerpicker-addon/jquery-ui-timepicker-addon.js');

//JSON RPC library
include_once('external/json-rpc2php-master/jsonRPC2php.client.js');

//ensure all include files are present.
require_once('tabs.js.php');
require_once('home_tab.js.php');
require_once('item_tab.js.php');
require_once('task_tab.js.php');
require_once('report_tab.js.php');
require_once('graph_tab.js.php');

?>


/** Represents the main application.
 * @constructor Main_Application
 */
function Main_Application() {
	
	/** This is the tabs array for the main application. 
	 * @memberof Main_Application
	 * @type Array
	 * */
	this.tabs_array = new Array();
	/** This is the main tab navigation object.
	 * @memberof Main_Application
	 * @type Tabs
	 * */
	this.main_tab_nav = null;
	/** This is the home tab navigation object.
	 * @memberof Main_Application
	 * @type Home_Tab
	 * */
	this.home_tab_object = null;
	/** This is the item tab navigation object.
	 * @memberof Main_Application
	 * @type Item_Tab
	 * */
	this.item_tab_object = null;
	/** This is the task tab navigation object.
	 * @memberof Main_Application
	 * @type Task_Tab
	 * */
	this.task_tab_object = null;
	/** This is the report tab navigation object.
	 * @memberof Main_Application
	 * @type Report_Tab
	 * */
	this.report_tab_object = null;
	/** This is the graph tab navigation object.
	 * @memberof Main_Application
	 * @type Graph_Tab
	 * */
	this.graph_tab_object = null;

	/** @method Refresh_Data
	 * @desc This should be called to refresh data in
	 * the home tab and report tab.
	 * @memberof Main_Application
	 * @instance
	 * */
	this.Refresh_Data = function() {
		var self = this;

		self.home_tab_object.Refresh_Data(function() {
			self.report_tab_object.Refresh(function() {
				//alert('refresh complete');
			});
		});

	};
	
	/** @method Refresh_Categories
	 * @desc This should be called to refresh the category selects.
	 * This function will go through all tabs and update any category 
	 * select HTML objects.
	 * @memberof Main_Application
	 * @instance
	 * */
	this.Refresh_Categories = function(){
		
		
		category_select = document.getElementById(self.add_new_category_parent_select.id).innerHTML;
		document.getElementById(this.task_tab_object.task_category_select.id).innerHTML = category_select;
		document.getElementById(this.task_tab_object.task_edit_category_select.id).innerHTML = category_select;
		document.getElementById(this.item_tab_object.item_category_select.id).innerHTML = category_select;
		document.getElementById(this.item_tab_object.item_edit_category_select.id).innerHTML = category_select;
	};
	
	/** @method Render_Main_Tabs
	 * @desc This function renders the main navigation tab object
	 * and all sub-tab objects.
	 * @memberof Main_Application
	 * @instance
	 * */
	this.Render_Main_Tabs = function() {

		var self = this;
		var main_tabs_div = "main_tab_navigation_div";

		//append the main tab div
		document.body.innerHTML += '<div id="' + main_tabs_div + '"></div>';

		this.tabs_array[0] = new Array();
		this.tabs_array[0][0] = "Home";
		this.tabs_array[0][1] = "<div id='home_tab_div'></div>";

		this.tabs_array[1] = new Array();
		this.tabs_array[1][0] = "Items";
		this.tabs_array[1][1] = "<div id='item_tab_div'></div>";

		this.tabs_array[2] = new Array();
		this.tabs_array[2][0] = "Tasks";
		this.tabs_array[2][1] = "<div id='task_tab_div'></div>";

		this.tabs_array[3] = new Array();
		this.tabs_array[3][0] = "Reports";
		this.tabs_array[3][1] = "<div id='report_tab_div'></div>";

		this.tabs_array[4] = new Array();
		this.tabs_array[4][0] = "Graphs";
		this.tabs_array[4][1] = "<div id='graph_tab_div'></div>";

		//render the tabs
		this.main_tab_nav = new Tabs(main_tabs_div, this.tabs_array);
		this.main_tab_nav.Render();

		this.home_tab_object = new Home_Tab('home_tab_div');
		this.home_tab_object.Render();
		
		this.home_tab_object.refresh_categories_callback = function(){
			
			self.Refresh_Categories();
			
		};

		this.item_tab_object = new Item_Tab('item_tab_div');

		this.item_tab_object.refresh_item_log_callback = function() {
			//ensure the data tab gets refreshed when a new item is added
			self.Refresh_Data();
		};
		this.item_tab_object.Render();

		this.task_tab_object = new Task_Tab('task_tab_div');

		this.task_tab_object.refresh_task_log_callback = function() {
			//ensure the data tab gets refreshed when a new task is added
			self.Refresh_Data();
		};

		this.task_tab_object.Render();

		this.report_tab_object = new Report_Tab('report_tab_div');
		this.report_tab_object.Render();

		this.graph_tab_object = new Graph_Tab('graph_tab_div');
		this.graph_tab_object.Render();

		//perform asynchronous refresh operations
		var self = this;

		self.home_tab_object.Refresh_Data(function() {
			
			self.item_tab_object.Refresh_Items(function() {
				
				self.task_tab_object.Refresh_Tasks(function() {
					
					self.task_tab_object.Refresh_Task_Name_List(function() {
						
						self.report_tab_object.Refresh(function() {
							
							self.Refresh_Categories();
							
							//alert('refresh complete');
							
						});

					});
				});

			});
		});
	};
	
	/** @method Render
	 * @desc This function will render the main application
	 * and all sub-elements.
	 * @memberof Main_Application
	 * @instance
	 * */
	this.Render = function()
	{
		//main tabs
		this.Render_Main_Tabs();
	};

	/** @method Load_Script
	 * @desc This function attempts to dynamically load a javscript
	 * library. It has known instabilities and should not be used
	 * at this time.
	 * @memberof Main_Application
	 * @instance
	 * */
	this.Load_Script = function(url, callback) {

		// adding the script tag to the head as suggested before
		var head = document.getElementsByTagName('head')[0];
		var script = document.createElement('script');
		script.type = 'text/javascript';
		script.src = url;

		// then bind the event to the callback function
		// there are several events for cross browser compatibility
		script.onreadystatechange = callback;
		script.onload = callback;

		// fire the loading
		head.appendChild(script);

	};

}

/** @member {Main_Application} app
 * @desc This is the main application object to be used
 * during operation.
 * */
var app;
/** @member {jsonrpcphp} rpc
 * @desc This is the RPC object to be used by the main
 * application for use by the server.
 * */
var rpc;

/** @function Refresh_Data
 * @desc This is the main function of the application and initializes all javascript objects.
 * */
function main() {

	$(document).ready(function(){
		
		app = new Main_Application();
	
		rpc = new jsonrpcphp('server/api.php', function() {
	
			app.Render();
	
		});
		
	});


}

