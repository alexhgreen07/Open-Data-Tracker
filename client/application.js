define([
    '../../core/logger.js',
    './rpc/api',
    './ui/tabs',
	'./ui/tabs/home/home_tab',
	'./ui/tabs/entry/entry_tab',
	'./ui/tabs/calendar/calendar_tab',
	'./ui/tabs/report/report_tab',
	'./ui/tabs/login/login_tab',
	'./ui/tabs/register/register_tab',
	],
	function (logger, api, tabs, home_tab, entry_tab, calendar_tab, report_tab, login_tab,register_tab){
		
			function Main_Application(parent_document, application_api) {
				
				var self = this;
				
				/** This is the server api object. 
				 * @type Server_API
				 * */
				this.api = application_api;
				
				/** This is the tabs array for the main application. 
				 * @type Array
				 * */
				this.tabs_array = new Array();
				this.login_tabs_array = new Array();
				/** This is the main tab navigation object.
				 * @type Tabs
				 * */
				this.main_tab_nav = null;
				/** This is the home tab navigation object.
				 * @type Home_Tab
				 * */
				this.home_tab_object = new home_tab.Home_Tab();
				/** This is the item tab navigation object.
				 * @type Entry_Tab
				 * */
				this.entry_tab_object = new entry_tab.Entry_Tab();
				
				this.calendar_tab_object = new calendar_tab.Calendar_Tab();
				/** This is the report tab navigation object.
				 * @type Report_Tab
				 * */
				this.report_tab_object = new report_tab.Report_Tab();
				
				this.login_tab_object = new login_tab.Login_Tab();
				
				this.register_tab_object = new register_tab.Register_Tab();
				
				this.busy_count = 0;
				
				this.is_logged_in = false;
				
				this.parent_document = parent_document;
				
				//setup logger
				logger.Set_Log_Level(logger.INFO);
				
				this.Parse_Cookies = function(rc) {
					
					var list = {};
					
					rc && rc.split(';').forEach(function( cookie ) {
					    var parts = cookie.split('=');
					    list[parts.shift().trim()] = unescape(parts.join('='));
					    });
					
				    return list;
				};
				
				this.Initialize = function(){
					
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
				this.Refresh_Data = function() {
					
					var times = [];
					
					var total_start = new Date();
					var start = new Date();
					
					//refresh all data in all forms
					self.home_tab_object.Refresh(self.api.data, self.api.settings,self.api.home_report);
		
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
					logger.Info('Full refresh: ' + JSON.stringify(times));
					logger.Info('Total: ' + (end - total_start) / 1000);
				};
				
				this.Refresh_From_Diff = function(diff) {
					
					var times = [];
					
					var total_start = new Date();
					var start = new Date();
					
					//TODO: implement
					self.home_tab_object.Refresh(self.api.data, self.api.settings,self.api.home_report);
					
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
					logger.Info('Diff refresh: ' + JSON.stringify(times));
					logger.Info('Total: ' + (end - total_start) / 1000);
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
				
				this.Start_Auto_Refresh = function(){
					
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
				this.Connect = function(url, callback) {
					
					var self = this;
					
					self.api.is_busy_callback = self.Is_Busy_Callback;
					self.api.data_refresh_callback = self.Refresh_Data;
					self.api.data_diff_callback = self.Refresh_From_Diff;
					
					self.api.Connect(url, function () {
						
						callback();
						
					});
				};
				
				this.Render_Login_Tabs = function(){
					
					var self = this;
					self.main_tabs_div = "main_tab_navigation_div";
					
					//clear all previous content
					this.parent_document.body.innerHTML = "";
					
					//create the loader image div
					self.loader_div = this.parent_document.createElement("div");
					self.loader_div.id = "loader_div";
					self.loader_div.className = "loader_div";
					self.loader_div.innerHTML = '<img class="loader_img" src="ajax-loader.gif"/></div>';
					this.parent_document.body.appendChild(this.loader_div);
				
					//append the main tab div
					this.parent_document.body.innerHTML += '<div id="' + self.main_tabs_div + '"></div>';
					
					this.tabs_array = [];
					this.tabs_array.push(["Login", "<div id='login_tab_div'></div>"]);
					this.tabs_array.push(["Register", "<div id='register_tab_div'></div>"]);
		
					//render the tabs
					this.main_tab_nav = new tabs.Tabs(self.main_tabs_div, this.tabs_array);
					this.main_tab_nav.Render();
					
					this.login_tab_object.Render('login_tab_div');
					this.register_tab_object.Render('register_tab_div');
					
					$('#' + self.loader_div.id).hide();
					
					self.login_tab_object.login_success = function(){
						
						self.is_logged_in = true;
						
						self.Initialize();
					};
				};
				
				/** @method Render_Main_Tabs
				 * @desc This function renders the main navigation tab object
				 * and all sub-tab objects.
				 * */
				this.Render_Main_Tabs = function() {
		
					var self = this;
					self.main_tabs_div = "main_tab_navigation_div";
					
					//clear all previous content
					this.parent_document.body.innerHTML = "";
					
					//create the loader image div
					self.loader_div = this.parent_document.createElement("div");
					self.loader_div.id = "loader_div";
					self.loader_div.className = "loader_div";
					self.loader_div.innerHTML = '<img class="loader_img" src="ajax-loader.gif"/></div>';
					this.parent_document.body.appendChild(this.loader_div);
				
					//append the main tab div
					this.parent_document.body.innerHTML += '<div id="' + self.main_tabs_div + '"></div>';
					
					this.tabs_array = [];
					this.tabs_array.push(["Home", "<div id='home_tab_div'></div>"]);
					this.tabs_array.push(["Entry", "<div id='entry_tab_div'></div>"]);
					this.tabs_array.push(["Calendar", "<div id='calendar_tab_div'></div>"]);
					this.tabs_array.push(["Reports", "<div id='report_tab_div'></div>"]);
					
					//render the tabs
					this.main_tab_nav = new tabs.Tabs(self.main_tabs_div, this.tabs_array);
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
					
					$('#' + self.loader_div.id).hide();
					
				};
				
				/** @method Render
				 * @desc This function will render the main application
				 * and all sub-elements.
				 * */
				this.Render = function()
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
			
			var built_application = new Main_Application(parent_document, application_api);
			
			return built_application;
		}
	
		return {
			Build_Main_Application: Build_Main_Application,
			/** Represents the main application.
			 * @constructor Main_Application
			 */
			Main_Application: Main_Application,
	};
});

