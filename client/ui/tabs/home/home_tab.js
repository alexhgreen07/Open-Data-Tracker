define([
        '../../accordian',
        './forms/home_form',
        './forms/settings_form',
        ],
        function(accordian, home_form, settings_form){
	
	/** This is the home tab class which holds all UI objects for general data.
	 * @constructor Home_Tab
	 */
	function Home_Tab(child_home_form, child_settings_form) {

		/** This is the parent div ID where the home tab is.
		 * @type String
		 * */
		this.div_id = null;
		
		this.home_form = child_home_form;
		
		/** This is the form for the application settings.
		 * @type Settings_Form
		 * */
		this.settings_form = child_settings_form;
		
		/** This is the refresh categories callback.
		 * @type function
		 * */
		this.refresh_categories_callback = function(){};

		/** @method Refresh_Data
		 * @desc This function retrieves the home data from the server.
		 * @param {function} data The callback to call after the refresh of data has completed.
		 * */
		this.Refresh = function(data,settings,home_report) {
			
			this.home_form.Refresh(data,home_report);
			this.settings_form.Refresh(settings);
		};
		
		this.Refresh_From_Diff = function(diff, data, settings,home_report)
		{
			//TODO: Implement
			this.home_form.Refresh(data,home_report);
			
			if((diff['settings']['settings'].length > 0) ||
				(diff['settings']['setting_entries'].length > 0))
			{
				this.settings_form.Refresh(settings);
			}
			
		};

		/** @method Render
		 * @desc This function will render the tab in the div that it was initialized with.
		 * */
		this.Render = function(home_div_id) {
			
			this.div_id = home_div_id;
			
			var tabs_array = new Array();
			var new_tab;

			new_tab = new Array();
			new_tab.push("Summary Data");
			new_tab.push('<div id="home_summary_data_div"></div>');
			tabs_array.push(new_tab);

			new_tab = new Array();
			new_tab.push("Settings");
			new_tab.push('<div id="home_settings_div"></div>');
			tabs_array.push(new_tab);

			var return_html = '';

			return_html += '<div id="home_accordian"></div>';

			var div_tab = document.getElementById(this.div_id);

			div_tab.innerHTML = return_html;

			var items_accordian = new Accordian();
			items_accordian.Render('home_accordian', tabs_array);

			this.home_form.Render('home_summary_data_div');
			
			var home_settings_div_element = document.getElementById('home_settings_div');
			this.settings_form.Render(home_settings_div_element);

			//call the click event function
			//this.Summary_Data_Refresh_Click_Event();

		};
	}
	
	function Build_Home_Tab()
	{
		var child_home_form = home_form.Build_Home_Form();
		var child_settings_form = settings_form.Build_Settings_Form();
		
		var built_home_tab = new Home_Tab(child_home_form, child_settings_form);
		
		return built_home_tab;
	}
	
	return {
		Build_Home_Tab: Build_Home_Tab,
		Home_Tab: Home_Tab,
	};
});




