define([
    'core/logger',
    './rpc/api',
    './ui/tabs',
	'./ui/tabs/home/home_tab',
	'./ui/tabs/entry/entry_tab',
	'./ui/tabs/calendar/calendar_tab',
	'./ui/tabs/report/report_tab',
	'./ui/tabs/login/login_tab',
	'./ui/tabs/register/register_tab',
	],
	function (logger, api, tabs, home_tab, entry_tab, calendar_tab, report_tab, login_tab, register_tab){
			
			/** Represents the main application.
			 * @constructor Main_Application
			 */
			function Main_Application(
					parent_document, 
					application_api,
					home_tab_object,
					entry_tab_object,
					calendar_tab_object,
					report_tab_object,
					login_tab_object,
					register_tab_object,
					main_tab_nav) {
				
				var self = this;
				
				/** This is the server api object. 
				 * @type Server_API
				 * */
				self.api = application_api;
				
				/** This is the tabs array for the main application. 
				 * @type Array
				 * */
				self.tabs_array = [];
				self.login_tabs_array = [];
				/** This is the main tab navigation object.
				 * @type Tabs
				 * */
				self.main_tab_nav = null;
				/** This is the home tab navigation object.
				 * @type Home_Tab
				 * */
				self.home_tab_object = home_tab_object;
				/** This is the item tab navigation object.
				 * @type Entry_Tab
				 * */
				self.entry_tab_object = entry_tab_object;
				
				self.calendar_tab_object = calendar_tab_object;
				/** This is the report tab navigation object.
				 * @type Report_Tab
				 * */
				self.report_tab_object = report_tab_object;
				
				self.login_tab_object = login_tab_object;
				
				self.register_tab_object = register_tab_object;
				
				self.main_tab_nav = main_tab_nav;
				
				self.busy_count = 0;
				
				self.is_logged_in = false;
				
				self.parent_document = parent_document;
				
				//setup logger
				logger.Set_Log_Level(logger.INFO);
				
				self.Parse_Cookies = function(rc) {
					
					var list = {};
					
					rc && rc.split(';').forEach(function( cookie ) {
					    var parts = cookie.split('=');
					    list[parts.shift().trim()] = unescape(parts.join('='));
					    });
					
				    return list;
				};
				
				self.Initialize = function(){
					
					self.Connect('server/api.php', function() {
					
						rpc = self.api.rpc;
							
						self.Render();
						
						if(self.is_logged_in)
						{
						
							self.api.Refresh_Data(function(){});
							self.Start_Auto_Refresh();
						}
						
					});
					
				};
				
				/** @method Refresh_Data
				 * @desc This should be called to refresh data in all forms.
				 * */
				self.Refresh_Data = function() {
					
					var times = [];
					
					var total_start = new Date();
					var start = new Date();
					
					//refresh all data in all forms
					self.home_tab_object.Refresh(self.api.data, self.api.settings,self.api.forms.home_report);
		
					var end = new Date();
					times.push('home_tab_object: ' + (end - start) / 1000);
					var start = new Date();
					
					self.entry_tab_object.Refresh(self.api.data);
					
					var end = new Date();
					times.push('entry_tab_object: ' + (end - start) / 1000);
					var start = new Date();
					
					self.calendar_tab_object.Refresh(self.api.data,self.api.forms.scheduled_events);
					
					var end = new Date();
					times.push('calendar_tab_object: ' + (end - start) / 1000);
					var start = new Date();
					
					self.report_tab_object.Refresh(self.api.data, self.api.schema, self.api.reports);
					
					var end = new Date();
					times.push('report_tab_object: ' + (end - start) / 1000);
					
					//alert(JSON.stringify(times));
					logger.Info('Full refresh: ' + JSON.stringify(times));
					logger.Info('Total: ' + (end - total_start) / 1000);
				};
				
				self.Refresh_From_Diff = function(diff) {
					
					var times = [];
					
					var total_start = new Date();
					var start = new Date();
					
					//TODO: implement
					self.home_tab_object.Refresh(self.api.data, self.api.settings,self.api.forms.home_report);
					
					var end = new Date();
					times.push('home_tab_object: ' + (end - start) / 1000);
					var start = new Date();
					
					self.entry_tab_object.Refresh_From_Diff(diff, self.api.data);
					
					var end = new Date();
					times.push('entry_tab_object: ' + (end - start) / 1000);
					var start = new Date();
					
					self.calendar_tab_object.Refresh_From_Diff(diff, self.api.data, self.api.forms.scheduled_events);
					
					var end = new Date();
					times.push('calendar_tab_object: ' + (end - start) / 1000);
					var start = new Date();
					
					self.report_tab_object.Refresh(self.api.data, self.api.schema, self.api.reports);
					
					var end = new Date();
					times.push('report_tab_object: ' + (end - start) / 1000);
					
					//alert(JSON.stringify(times));
					logger.Info('Diff refresh: ' + JSON.stringify(times));
					logger.Info('Total: ' + (end - total_start) / 1000);
				};
				
				self.Select_Event_Click_Callback = function(table, row)
				{
					//activate the entry tab
					$('#' + self.main_tabs_div.id).tabs({ active: 1 });
					
					self.entry_tab_object.Select_Entry(table,row);
				};
				
				self.Is_Busy_Callback = function(is_busy)
				{
					
					if(is_busy)
					{
						self.busy_count++;
						$(self.loader_div).show();
					}
					else
					{
						
						if(self.busy_count > 0)
						{
							self.busy_count--;
						}
						
						if(self.busy_count == 0)
						{
							$(self.loader_div).hide();
						}
						
					}
					
				};
				
				self.Start_Auto_Refresh = function(){
					
					refresh_period = 60;
					
					app.last_refresh = Date.now();
					
					//setup timer based refresh for 60s
					var myVar=setInterval(function(){
							
							if((Date.now() - app.last_refresh) / 1000 > refresh_period)
							{
								app.last_refresh = Date.now();
							
								//refresh the data form the server, then refresh UI data
								self.api.Refresh_Data(function(){});
							}
							
						},1000);
					
				};
				
				/** @method Connect
				 * @desc Connects to the specified server.
				 * @param 
				 * */
				self.Connect = function(url, callback) {
					
					self.api.is_busy_callback = self.Is_Busy_Callback;
					self.api.data_refresh_callback = self.Refresh_Data;
					self.api.data_diff_callback = self.Refresh_From_Diff;
					
					self.api.Connect(url, function () {
						
						callback();
						
					});
				};
				
				self.Render_Login_Tabs = function(){
					
					self.tabs_array = [];
					self.login_tab_div = document.createElement("div");
					self.login_tab_div.id = "login_tab_div";
					self.tabs_array.push(["Login", self.login_tab_div]);
					self.register_tab_div = document.createElement("div");
					self.register_tab_div.id = "register_tab_div";
					self.tabs_array.push(["Register", self.register_tab_div]);
		
					//render the tabs
					self.main_tab_nav.Render(self.main_tabs_div, self.tabs_array);
					
					self.login_tab_object.Render(self.login_tab_div.id);
					self.register_tab_object.Render(self.register_tab_div.id);
					
					$(self.loader_div).hide();
					
					self.login_tab_object.login_success = function(){
						
						self.is_logged_in = true;
						
						self.Initialize();
					};
				};
				
				/** @method Render_Main_Tabs
				 * @desc This function renders the main navigation tab object
				 * and all sub-tab objects.
				 * */
				self.Render_Main_Tabs = function() {
		
					self.tabs_array = [];
					self.home_tab_div = document.createElement("div");
					self.home_tab_div.id = "home_tab_div";
					self.tabs_array.push(["Home", self.home_tab_div]);
					self.entry_tab_div = document.createElement("div");
					self.entry_tab_div.id = "entry_tab_div";
					self.tabs_array.push(["Entry", self.entry_tab_div]);
					self.calendar_tab_div = document.createElement("div");
					self.calendar_tab_div.id = "calendar_tab_div";
					self.tabs_array.push(["Calendar", self.calendar_tab_div]);
					self.report_tab_div = document.createElement("div");
					self.report_tab_div.id = "report_tab_div";
					self.tabs_array.push(["Reports", self.report_tab_div]);
					
					//render the tabs
					self.main_tab_nav.Render(self.main_tabs_div, self.tabs_array);
					
					self.main_tab_nav.activate_callback = function(){
						self.calendar_tab_object.Render_Calendar();
					};
					
					self.home_tab_object.Render(self.home_tab_div);
					
					self.entry_tab_object.Render(self.entry_tab_div);
					
					self.calendar_tab_object.Render(self.calendar_tab_div.id);
					
					self.report_tab_object.Render(self.report_tab_div.id);
					
					self.home_tab_object.home_form.event_click_callback = self.Select_Event_Click_Callback;
					
					self.calendar_tab_object.event_click_callback = self.Select_Event_Click_Callback;
					
					$(self.loader_div).hide();
					
				};
				
				/** @method Render
				 * @desc This function will render the main application
				 * and all sub-elements.
				 * */
				self.Render = function()
				{
					
					var cookies = self.Parse_Cookies(document.cookie);
					
					if(cookies['is_authorized'] == 'true')
					{
						self.is_logged_in = true;
					}
					else
					{
						self.is_logged_in = false;
					}
					
					//clear all previous content
					self.parent_document.body.innerHTML = "";
					
					//create the loader image div
					self.loader_div = document.createElement("div");
					self.loader_div.id = "loader_div";
					self.loader_div.className = "loader_div";
					self.loader_div = self.parent_document.body.appendChild(self.loader_div);
					
					self.loader_div_img = document.createElement("img");
					self.loader_div_img.className = "loader_img";
					self.loader_div_img.src = "ajax-loader.gif";
					self.loader_div_img = self.loader_div.appendChild(self.loader_div_img);
				
					//append the main tab div
					self.main_tabs_div = document.createElement("div");
					self.main_tabs_div.id = "main_tab_navigation_div";
					self.parent_document.body.appendChild(self.main_tabs_div);
					
					//main tabs
					if(self.is_logged_in)
					{
						console.log('Rendering main tabs');
						self.Render_Main_Tabs();
					}
					else
					{
						console.log('Rendering login tabs');
						self.Render_Login_Tabs();
					}
					
				};
		
		
		}
	
		function Build_Main_Application(parent_document){
			
			var application_api = api.Build_Server_API();
			
			var application_home_tab = home_tab.Build_Home_Tab();
			var application_entry_tab = entry_tab.Build_Entry_Tab();
			var application_calendar_tab = calendar_tab.Build_Calendar_Tab();
			var appliation_report_tab = report_tab.Build_Report_Tab();
			var application_login_tab = login_tab.Build_Login_Tab();
			var application_register_tab = register_tab.Build_Register_Tab();
			
			self.main_tab_nav = new tabs.Tabs();
			
			var built_application = new Main_Application(
					parent_document, 
					application_api, 
					application_home_tab,
					application_entry_tab,
					application_calendar_tab,
					appliation_report_tab,
					application_login_tab, 
					application_register_tab,
					main_tab_nav);
			
			return built_application;
		}
	
		return {
			Build_Main_Application: Build_Main_Application,
			Main_Application: Main_Application,
	};
});

