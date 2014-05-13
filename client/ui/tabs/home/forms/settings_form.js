define([],function(){
	
	/** This is the form to enter general settings for the application.
	 * @constructor Settings_Form
	 */
	function Settings_Form(){
		
		var self = this;
		
		this.Refresh = function(settings)
		{
			
			self.settings = settings;
			
			for(var i = 0; i < settings.setting_entries.length; i++)
			{
				var current_setting_entry = settings.setting_entries[i];
				
				if(current_setting_entry["Name"] == "First Name")
				{
					self.settings_first_name_text_box.value = current_setting_entry["Value"];
				}
				else if(current_setting_entry["Name"] == "Last Name")
				{
					self.settings_last_name_text_box.value = current_setting_entry["Value"];
				}
				else if(current_setting_entry["Name"] == "Email")
				{
					self.settings_email_text_box.value = current_setting_entry["Value"];
				}
				else if(current_setting_entry["Name"] == "Text Size")
				{
					self.change_text_box.value = current_setting_entry["Value"];
				}
				else if(current_setting_entry["Name"] == "Remember Me Time")
				{
					self.settings_remember_me_period_text_box.value = current_setting_entry["Value"];
				}
			}
			
		};
		
		this.Save_Settings_Button_Click = function(){
			
			var params = [];
			
			var first_name = self.settings_first_name_text_box.value;
			var last_name = self.settings_last_name_text_box.value;
			var email = self.settings_email_text_box.value;
			var text_size = self.change_text_box.value;
			var remember_me_period = self.settings_remember_me_period_text_box.value;
			
			params[0] = {};
			
			for(var i = 0; i < self.settings.settings.length; i++)
			{
				
				var current_setting = self.settings.settings[i];
				
				if(current_setting["Name"] == "First Name")
				{
					params[0][current_setting["Setting ID"]] = first_name;
				}
				else if(current_setting["Name"] == "Last Name")
				{
					params[0][current_setting["Setting ID"]] = last_name;
				}
				else if(current_setting["Name"] == "Email")
				{
					params[0][current_setting["Setting ID"]] = email;
				}
				else if(current_setting["Name"] == "Text Size")
				{
					params[0][current_setting["Setting ID"]] = text_size;
				}
				else if(current_setting["Name"] == "Remember Me Time")
				{
					params[0][current_setting["Setting ID"]] = remember_me_period;
				}
				
				
			}
			
			//execute the RPC callback for retrieving the item log
			app.api.Home_Data_Interface.Update_Settings(params, function(jsonRpcObj) {
				
				if (jsonRpcObj.result.success == 'true') {
					
					alert('Settings saved.');
		
					app.api.Refresh_Data(function() {
						//self.refresh_item_log_callback();
					});
					
				} else {
					alert('Settings failed to save.');
					alert(jsonRpcObj.result.debug);
				}
				
		
			});
			
		};
		
		/** @method Render
		 * @desc This function will render the tab in the div that it was initialized with.
		 * @param {String} form_div_id The div ID to render the form in.
		 * */
		this.Render = function(div_tab){
			
			//append the main tab div
			this.text_changer_div = document.createElement('div');
			this.text_changer_div = div_tab.appendChild(this.text_changer_div);

			this.text_changer_div.appendChild(document.createTextNode("First Name: "));
			this.text_changer_div.appendChild(document.createElement('br'));
			this.settings_first_name_text_box = document.createElement('input');
			this.settings_first_name_text_box.id = 'settings_first_name_text_box';
			this.settings_first_name_text_box.setAttribute('type','text');
			this.settings_first_name_text_box = this.text_changer_div.appendChild(this.settings_first_name_text_box);
			
			this.text_changer_div.appendChild(document.createElement('br'));
			this.text_changer_div.appendChild(document.createElement('br'));
			
			this.text_changer_div.appendChild(document.createTextNode("Last Name: "));
			this.text_changer_div.appendChild(document.createElement('br'));
			this.settings_last_name_text_box = document.createElement('input');
			this.settings_last_name_text_box.id = 'settings_last_name_text_box';
			this.settings_last_name_text_box.setAttribute('type','text');
			this.settings_last_name_text_box = this.text_changer_div.appendChild(this.settings_last_name_text_box);
			
			this.text_changer_div.appendChild(document.createElement('br'));
			this.text_changer_div.appendChild(document.createElement('br'));
			
			this.text_changer_div.appendChild(document.createTextNode("Email: "));
			this.text_changer_div.appendChild(document.createElement('br'));
			this.settings_email_text_box = document.createElement('input');
			this.settings_email_text_box.id = 'settings_email_text_box';
			this.settings_email_text_box.setAttribute('type','text');
			this.settings_email_text_box = this.text_changer_div.appendChild(this.settings_email_text_box);
			
			this.text_changer_div.appendChild(document.createElement('br'));
			this.text_changer_div.appendChild(document.createElement('br'));
			
			this.text_changer_div.appendChild(document.createTextNode("Remember Me Expiry Period: "));
			this.text_changer_div.appendChild(document.createElement('br'));
			this.settings_remember_me_period_text_box = document.createElement('input');
			this.settings_remember_me_period_text_box.id = 'settings_remember_me_period_text_box';
			this.settings_remember_me_period_text_box.setAttribute('type','text');
			this.settings_remember_me_period_text_box = this.text_changer_div.appendChild(this.settings_remember_me_period_text_box);
			
			this.text_changer_div.appendChild(document.createElement('br'));
			this.text_changer_div.appendChild(document.createElement('br'));
			
			this.text_changer_div.appendChild(document.createTextNode("Text Size: "));
			this.text_changer_div.appendChild(document.createElement('br'));
			
			this.change_text_box = document.createElement('input');
			this.change_text_box.setAttribute('id','change_text_box');
			this.change_text_box.setAttribute('type','text');
			
			this.change_text_box = this.text_changer_div.appendChild(this.change_text_box);
			
			this.text_changer_div.appendChild(document.createElement('br'));
			this.text_changer_div.appendChild(document.createElement('br'));
			
			this.change_text_link = document.createElement('input');
			this.change_text_link.setAttribute('id','change_text_link');
			this.change_text_link.setAttribute('type','submit');
			this.change_text_link.setAttribute('value','Change');
			
			this.change_text_link = this.text_changer_div.appendChild(this.change_text_link);
			
			this.text_changer_div.appendChild(document.createElement('br'));
			this.text_changer_div.appendChild(document.createElement('br'));
			
			this.smaller_text_link = document.createElement('input');
			this.smaller_text_link.setAttribute('id','smaller_text_link');
			this.smaller_text_link.setAttribute('type','submit');
			this.smaller_text_link.setAttribute('value','Smaller');
			this.smaller_text_link = this.text_changer_div.appendChild(this.smaller_text_link);
			
			this.text_changer_div.appendChild(document.createElement('br'));
			this.text_changer_div.appendChild(document.createElement('br'));
			
			this.larger_text_link = document.createElement('input');
			this.larger_text_link.setAttribute('id','larger_text_link');
			this.larger_text_link.setAttribute('type','submit');
			this.larger_text_link.setAttribute('value','Larger');
			this.larger_text_link = this.text_changer_div.appendChild(this.larger_text_link);
			
			this.text_changer_div.appendChild(document.createElement('br'));
			this.text_changer_div.appendChild(document.createElement('br'));
			this.text_changer_div.appendChild(document.createElement('hr'));
			this.text_changer_div.appendChild(document.createElement('br'));
			
			this.submit_new_settings_button = document.createElement('input');
			this.submit_new_settings_button.setAttribute('id','submit_new_settings_button');
			this.submit_new_settings_button.setAttribute('type','submit');
			this.submit_new_settings_button.setAttribute('value','Save');
			this.submit_new_settings_button = this.text_changer_div.appendChild(this.submit_new_settings_button);
			
			this.text_changer_div.appendChild(document.createElement('br'));
			this.text_changer_div.appendChild(document.createElement('br'));
						
			$(this.change_text_link).button();
			$(this.change_text_link).click(function(){
				
				var size = self.change_text_box.value;
				
				$('body').css('font-size',size + 'px');
				
			});
			
			$(this.smaller_text_link).button();
			$(this.smaller_text_link).click(function()
			{
				var size = parseInt($('body').css('font-size').replace("px",""));
				
				if(size > 1)
				{
					size--;
				}
				
				$('body').css('font-size',size + 'px');
				
				self.change_text_box.value = size;
			});
			
			$(this.larger_text_link).button();
			$(this.larger_text_link).click(function()
			{
				var size = parseInt($('body').css('font-size').replace("px",""));
				
				size++;
				
				$('body').css('font-size',size + 'px');
				
				self.change_text_box.value = size;
			});
			
			$(this.submit_new_settings_button).button();
			$(this.submit_new_settings_button).click(function()
			{
				self.Save_Settings_Button_Click();
			});
			
			var size = parseInt($('body').css('font-size').replace("px",""));
			
			this.change_text_box.value = size;
			
		};
	}
	
	function Build_Settings_Form()
	{
		var built_settings_form = new Settings_Form();
		
		return built_settings_form;
	}
	
	return {
		Build_Settings_Form: Build_Settings_Form,
		Settings_Form: Settings_Form,
	};
});



