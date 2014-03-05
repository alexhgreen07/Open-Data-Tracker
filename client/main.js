
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
	 * @type Entry_Tab
	 * */
	this.entry_tab_object = new Entry_Tab();
	
	this.calendar_tab_object = new Calendar_Tab();
	/** This is the report tab navigation object.
	 * @type Report_Tab
	 * */
	this.report_tab_object = new Report_Tab();
	
	this.busy_count = 0;
	
	/** @method Refresh_Data
	 * @desc This should be called to refresh data in all forms.
	 * */
	this.Refresh_Data = function() {
		
		var times = [];
		
		var total_start = new Date();
		var start = new Date();
		
		//refresh all data in all forms
		self.home_tab_object.Refresh(self.api.data, self.api.settings);

		var end = new Date();
		times.push('home_tab_object: ' + (end - start) / 1000);
		var start = new Date();
		
		self.entry_tab_object.Refresh(self.api.data);
		
		var end = new Date();
		times.push('entry_tab_object: ' + (end - start) / 1000);
		var start = new Date();
		
		self.calendar_tab_object.Refresh(self.api.data);
		
		var end = new Date();
		times.push('calendar_tab_object: ' + (end - start) / 1000);
		var start = new Date();
		
		self.report_tab_object.Refresh(self.api.data, self.api.schema, self.api.reports);
		
		var end = new Date();
		times.push('report_tab_object: ' + (end - start) / 1000);
		
		//alert(JSON.stringify(times));
		console.log('Full refresh: ' + JSON.stringify(times));
		console.log('Total: ' + (end - total_start) / 1000);
	};
	
	this.Refresh_From_Diff = function(diff) {
		
		var times = [];
		
		var total_start = new Date();
		var start = new Date();
		
		//TODO: implement
		self.home_tab_object.Refresh_From_Diff(diff, self.api.data, self.api.settings);
		
		var end = new Date();
		times.push('home_tab_object: ' + (end - start) / 1000);
		var start = new Date();
		
		self.entry_tab_object.Refresh_From_Diff(diff, self.api.data);
		
		var end = new Date();
		times.push('entry_tab_object: ' + (end - start) / 1000);
		var start = new Date();
		
		self.calendar_tab_object.Refresh_From_Diff(diff, self.api.data);
		
		var end = new Date();
		times.push('calendar_tab_object: ' + (end - start) / 1000);
		var start = new Date();
		
		self.report_tab_object.Refresh(self.api.data, self.api.schema, self.api.reports);
		
		var end = new Date();
		times.push('report_tab_object: ' + (end - start) / 1000);
		
		//alert(JSON.stringify(times));
		console.log('Diff refresh: ' + JSON.stringify(times));
		console.log('Total: ' + (end - total_start) / 1000);
	};
	
	this.Select_Event_Click_Callback = function(table, row)
	{
		//activate the entry tab
		$('#' + self.main_tabs_div).tabs({ active: 1 });
		
		self.entry_tab_object.Select_Entry(table,row);
	};
	
	this.Is_Busy_Callback = function(is_busy)
	{
		
		if(is_busy)
		{
			self.busy_count++;
			$('#' + self.loader_div.id).show();
		}
		else
		{
			
			if(self.busy_count > 0)
			{
				self.busy_count--;
			}
			
			if(self.busy_count == 0)
			{
				$('#' + self.loader_div.id).hide();
			}
			
		}
		
	};
	
	/** @method Connect
	 * @desc Connects to the specified server.
	 * @param 
	 * */
	this.Connect = function(url, callback) {
		
		var self = this;
		
		self.api.is_busy_callback = self.Is_Busy_Callback;
		self.api.data_refresh_callback = self.Refresh_Data;
		self.api.data_diff_callback = self.Refresh_From_Diff;
		
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
		self.main_tabs_div = "main_tab_navigation_div";
	
		//create the loader image div
		self.loader_div = document.createElement("div");
		self.loader_div.id = "loader_div";
		self.loader_div.className = "loader_div";
		self.loader_div.innerHTML = '<img class="loader_img" src="ajax-loader.gif"/></div>';
		document.body.appendChild(this.loader_div);
	
		//append the main tab div
		document.body.innerHTML += '<div id="' + self.main_tabs_div + '"></div>';

		this.tabs_array[0] = new Array();
		this.tabs_array[0][0] = "Home";
		this.tabs_array[0][1] = "<div id='home_tab_div'></div>";
		
		this.tabs_array[1] = new Array();
		this.tabs_array[1][0] = "Entry";
		this.tabs_array[1][1] = "<div id='entry_tab_div'></div>";
		
		this.tabs_array[2] = new Array();
		this.tabs_array[2][0] = "Calendar";
		this.tabs_array[2][1] = "<div id='calendar_tab_div'></div>";
		
		this.tabs_array[3] = new Array();
		this.tabs_array[3][0] = "Reports";
		this.tabs_array[3][1] = "<div id='report_tab_div'></div>";

		//render the tabs
		this.main_tab_nav = new Tabs(self.main_tabs_div, this.tabs_array);
		this.main_tab_nav.Render();
		
		this.main_tab_nav.activate_callback = function(){
			self.calendar_tab_object.Render_Calendar();
		};
		
		this.home_tab_object.Render('home_tab_div');
		
		this.entry_tab_object.Render('entry_tab_div');
		
		this.calendar_tab_object.Render('calendar_tab_div');
		
		this.report_tab_object.Render('report_tab_div');
		
		
		this.home_tab_object.home_form.event_click_callback = this.Select_Event_Click_Callback;
		
		this.calendar_tab_object.event_click_callback = this.Select_Event_Click_Callback;
		
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
		
		FastClick.attach(document.body);
		
		app = new Main_Application();
		
		app.Render();
		app.Connect('server/api.php', function() {
			
			rpc = app.api.rpc;
			
			app.last_refresh = Date.now();
			
			//setup timer based refresh for 60s
			var myVar=setInterval(function(){
					
					if((Date.now() - app.last_refresh) / 1000 > 60)
					{
						app.last_refresh = Date.now();
					
						//refresh the data form the server, then refresh UI data
						app.api.Refresh_Data(function(){});
					}
					
					
					
				},1000);
			
			
		});
		
	});


}

