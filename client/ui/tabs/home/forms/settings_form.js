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
			
			if(current_setting_entry.name == "First Name")
			{
				document.getElementById(self.settings_first_name_text_box.id).value = current_setting_entry.value;
			}
			else if(current_setting_entry.name == "Last Name")
			{
				document.getElementById(self.settings_last_name_text_box.id).value = current_setting_entry.value;
			}
			else if(current_setting_entry.name == "Email")
			{
				document.getElementById(self.settings_email_text_box.id).value = current_setting_entry.value;
			}
			else if(current_setting_entry.name == "Text Size")
			{
				document.getElementById(self.change_text_box.id).value = current_setting_entry.value;
			}
			else if(current_setting_entry.name == "Remember Me Time")
			{
				document.getElementById(self.settings_remember_me_period_text_box.id).value = current_setting_entry.value;
			}
		}
		
	};
	
	this.Save_Settings_Button_Click = function(){
		
		var params = [];
		
		var first_name = document.getElementById(self.settings_first_name_text_box.id).value;
		var last_name = document.getElementById(self.settings_last_name_text_box.id).value;
		var email = document.getElementById(self.settings_email_text_box.id).value;
		var text_size = document.getElementById(self.change_text_box.id).value;
		var remember_me_period = document.getElementById(self.settings_remember_me_period_text_box.id).value;
		
		params[0] = {};
		
		for(var i = 0; i < self.settings.settings.length; i++)
		{
			
			var current_setting = self.settings.settings[i];
			
			if(current_setting.name == "First Name")
			{
				params[0][current_setting.setting_id] = first_name;
			}
			else if(current_setting.name == "Last Name")
			{
				params[0][current_setting.setting_id] = last_name;
			}
			else if(current_setting.name == "Email")
			{
				params[0][current_setting.setting_id] = email;
			}
			else if(current_setting.name == "Text Size")
			{
				params[0][current_setting.setting_id] = text_size;
			}
			else if(current_setting.name == "Remember Me Time")
			{
				params[0][current_setting.setting_id] = remember_me_period;
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
	
	/** @method Render_Text_Size_Changer
	 * @desc This function will render the text size changer in the specified div.
	 * @param {String} form_div_id The div ID to render the form in.
	 * */
	this.Render_Text_Size_Changer = function(form_div_id) {
		
		//append the main tab div
		this.text_changer_div = document.createElement('div');
		
		this.text_changer_div.innerHTML += 'First Name: <br />';
		this.settings_first_name_text_box = document.createElement('input');
		this.settings_first_name_text_box.id = 'settings_first_name_text_box';
		this.settings_first_name_text_box.setAttribute('type','text');
		this.text_changer_div.appendChild(this.settings_first_name_text_box);
		
		this.text_changer_div.innerHTML += '<br /><br />';
		
		this.text_changer_div.innerHTML += 'Last Name: <br />';
		this.settings_last_name_text_box = document.createElement('input');
		this.settings_last_name_text_box.id = 'settings_last_name_text_box';
		this.settings_last_name_text_box.setAttribute('type','text');
		this.text_changer_div.appendChild(this.settings_last_name_text_box);
		
		this.text_changer_div.innerHTML += '<br /><br />';
		
		this.text_changer_div.innerHTML += 'Email: <br />';
		this.settings_email_text_box = document.createElement('input');
		this.settings_email_text_box.id = 'settings_email_text_box';
		this.settings_email_text_box.setAttribute('type','text');
		this.text_changer_div.appendChild(this.settings_email_text_box);
		
		this.text_changer_div.innerHTML += '<br /><br />';
		
		this.text_changer_div.innerHTML += 'Remember Me Expiry Period: <br />';
		this.settings_remember_me_period_text_box = document.createElement('input');
		this.settings_remember_me_period_text_box.id = 'settings_remember_me_period_text_box';
		this.settings_remember_me_period_text_box.setAttribute('type','text');
		this.text_changer_div.appendChild(this.settings_remember_me_period_text_box);
		
		this.text_changer_div.innerHTML += '<br /><br />';
		
		this.text_changer_div.innerHTML += 'Text Size: <br />';
		
		this.change_text_box = document.createElement('input');
		this.change_text_box.setAttribute('id','change_text_box');
		this.change_text_box.setAttribute('type','text');
		
		this.text_changer_div.appendChild(this.change_text_box);
		
		this.text_changer_div.innerHTML += '<br /><br />';
		
		this.change_text_link = document.createElement('input');
		this.change_text_link.setAttribute('id','change_text_link');
		this.change_text_link.setAttribute('type','submit');
		this.change_text_link.setAttribute('value','Change');
		
		this.text_changer_div.appendChild(this.change_text_link);
		
		this.text_changer_div.innerHTML += '<br /><br />';
		
		this.smaller_text_link = document.createElement('input');
		this.smaller_text_link.setAttribute('id','smaller_text_link');
		this.smaller_text_link.setAttribute('type','submit');
		this.smaller_text_link.setAttribute('value','Smaller');
		this.text_changer_div.appendChild(this.smaller_text_link);
		
		this.text_changer_div.innerHTML += '<br /><br />';
		
		this.larger_text_link = document.createElement('input');
		this.larger_text_link.setAttribute('id','larger_text_link');
		this.larger_text_link.setAttribute('type','submit');
		this.larger_text_link.setAttribute('value','Larger');
		this.text_changer_div.appendChild(this.larger_text_link);
		
		this.text_changer_div.innerHTML += '<br /><br /><hr><br />';
		
		this.submit_new_settings_button = document.createElement('input');
		this.submit_new_settings_button.setAttribute('id','submit_new_settings_button');
		this.submit_new_settings_button.setAttribute('type','submit');
		this.submit_new_settings_button.setAttribute('value','Save');
		this.text_changer_div.appendChild(this.submit_new_settings_button);
		
		this.text_changer_div.innerHTML += '<br /><br />';
		
		var div_tab = document.getElementById(form_div_id);
		div_tab.appendChild(this.text_changer_div);
		
		$('#' + this.change_text_link.id).button();
		$('#' + this.change_text_link.id).click(function(){
			
			var size = document.getElementById(self.change_text_box.id).value;
			
			$('body').css('font-size',size + 'px');
			
		});
		
		$('#' + this.smaller_text_link.id).button();
		$('#' + this.smaller_text_link.id).click(function()
		{
			var size = parseInt($('body').css('font-size').replace("px",""));
			
			if(size > 1)
			{
				size--;
			}
			
			$('body').css('font-size',size + 'px');
			
			document.getElementById(self.change_text_box.id).value = size;
		});
		
		$('#' + this.larger_text_link.id).button();
		$('#' + this.larger_text_link.id).click(function()
		{
			var size = parseInt($('body').css('font-size').replace("px",""));
			
			size++;
			
			$('body').css('font-size',size + 'px');
			
			document.getElementById(self.change_text_box.id).value = size;
		});
		
		$('#' + this.submit_new_settings_button.id).button();
		$('#' + this.submit_new_settings_button.id).click(function()
		{
			self.Save_Settings_Button_Click();
		});
		
		var size = parseInt($('body').css('font-size').replace("px",""));
		
		document.getElementById(this.change_text_box.id).value = size;
		
	};
	
	/** @method Render
	 * @desc This function will render the tab in the div that it was initialized with.
	 * @param {String} form_div_id The div ID to render the form in.
	 * */
	this.Render = function(form_div_id){
		
		this.Render_Text_Size_Changer(form_div_id);
		
	};
}
