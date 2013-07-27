<?php


Header("content-type: application/x-javascript");

//jquery code
include_once(dirname(__FILE__).'/../externals/jquery-ui/jquery-1.10.2.js');

//jquery UI code
include_once(dirname(__FILE__).'/../externals/jquery-ui/ui/jquery.ui.core.js');
include_once(dirname(__FILE__).'/../externals/jquery-ui/ui/jquery.ui.widget.js');
include_once(dirname(__FILE__).'/../externals/jquery-ui/ui/jquery.ui.mouse.js');
//include_once(dirname(__FILE__).'/../externals/jquery-ui/ui/jquery.ui.position.js');
include_once(dirname(__FILE__).'/../externals/jquery-ui/ui/jquery.ui.draggable.js');
include_once(dirname(__FILE__).'/../externals/jquery-ui/ui/jquery.ui.droppable.js');
include_once(dirname(__FILE__).'/../externals/jquery-ui/ui/jquery.ui.resizable.js');
include_once(dirname(__FILE__).'/../externals/jquery-ui/ui/jquery.ui.selectable.js');
include_once(dirname(__FILE__).'/../externals/jquery-ui/ui/jquery.ui.sortable.js');
include_once(dirname(__FILE__).'/../externals/jquery-ui/ui/jquery.ui.effect.js');

include_once(dirname(__FILE__).'/../externals/jquery-ui/ui/jquery.ui.button.js');
include_once(dirname(__FILE__).'/../externals/jquery-ui/ui/jquery.ui.tabs.js');
include_once(dirname(__FILE__).'/../externals/jquery-ui/ui/jquery.ui.accordion.js');
include_once(dirname(__FILE__).'/../externals/jquery-ui/ui/jquery.ui.slider.js');
include_once(dirname(__FILE__).'/../externals/jquery-ui/ui/jquery.ui.datepicker.js');
include_once(dirname(__FILE__).'/../externals/jquery-ui/ui/jquery.ui.dialog.js');
include_once(dirname(__FILE__).'/../externals/jquery-ui/ui/jquery.ui.menu.js');
include_once(dirname(__FILE__).'/../externals/jquery-ui/ui/jquery.ui.tooltip.js');

//jquery datepicker code
include_once(dirname(__FILE__).'/../externals/jquery-ui-timepicker-addon/jquery-ui-timepicker-addon.js');

//JSON RPC library
include_once(dirname(__FILE__).'/../externals/json-rpc2php/jsonRPC2php.client.js');

//include the server API
require_once(dirname(__FILE__).'/core/api.js.php');

//ensure all include files are present.
require_once(dirname(__FILE__).'/ui/tabs.js.php');
require_once(dirname(__FILE__).'/ui/tabs/home/home_tab.js.php');
require_once(dirname(__FILE__).'/ui/tabs/items/item_tab.js.php');
require_once(dirname(__FILE__).'/ui/tabs/tasks/task_tab.js.php');
require_once(dirname(__FILE__).'/ui/tabs/report/report_tab.js.php');
require_once(dirname(__FILE__).'/ui/tabs/graph/graph_tab.js.php');

?>


/** Represents the main application.
 * @constructor Main_Application
 */
function Main_Application() {
	
	var self = this;
	
	/** This is the server api object. 
	 * @type Server_API
	 * */
	this.api = new Server_API();
	
	/** This is the tabs array for the main application. 
	 * @type Array
	 * */
	this.tabs_array = new Array();
	/** This is the main tab navigation object.
	 * @type Tabs
	 * */
	this.main_tab_nav = null;
	/** This is the home tab navigation object.
	 * @type Home_Tab
	 * */
	this.home_tab_object = new Home_Tab();
	/** This is the item tab navigation object.
	 * @type Item_Tab
	 * */
	this.item_tab_object = new Item_Tab();
	/** This is the task tab navigation object.
	 * @type Task_Tab
	 * */
	this.task_tab_object = new Task_Tab();
	/** This is the report tab navigation object.
	 * @type Report_Tab
	 * */
	this.report_tab_object = new Report_Tab();
	/** This is the graph tab navigation object.
	 * @type Graph_Tab
	 * */
	this.graph_tab_object = new Graph_Tab();
	
	/** @method Refresh_Data
	 * @desc This should be called to refresh data in all forms.
	 * */
	this.Refresh_Data = function() {
		
		//refresh all data in all forms
		self.home_tab_object.Refresh(self.api.data);
		self.item_tab_object.Refresh(self.api.data);
		self.task_tab_object.Refresh(self.api.data);
		

	};
	
	/** @method Connect
	 * @desc Connects to the specified server.
	 * @param 
	 * */
	this.Connect = function(url, callback) {
		
		var self = this;
		
		self.api.data_changed_callback = self.Refresh_Data;
		
		self.api.Connect(url, function () {
			
			callback();
			
		});
	};
	
	/** @method Render_Main_Tabs
	 * @desc This function renders the main navigation tab object
	 * and all sub-tab objects.
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

		
		this.home_tab_object.Render('home_tab_div');

		this.item_tab_object.Render('item_tab_div');

		this.task_tab_object.Render('task_tab_div');

		this.report_tab_object.Render('report_tab_div');

		this.graph_tab_object.Render('graph_tab_div');

	};
	
	/** @method Render
	 * @desc This function will render the main application
	 * and all sub-elements.
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

/** This is the main application object to be used
 * during operation.
 * */
var app;
/** This is the RPC object to be used by the main
 * application for use by the server.
 * */
var rpc;

/** @function Refresh_Data
 * @desc This is the main function of the application and initializes all javascript objects.
 * */
function main() {

	$(document).ready(function(){
		
		app = new Main_Application();
		
		app.Render();
		app.Connect('server/api.php', function() {
			
			rpc = app.api.rpc;
			
			
			
			
		});
		
	});


}

