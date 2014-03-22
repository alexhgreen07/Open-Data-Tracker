define([],function(){
	return {
		Register_Tab: function()
		{
			/** @method Render
			 * @desc This function will render the tab in the div that it was initialized with.
			 * */
			this.Render = function(register_div_id) {
				
				this.div_id = register_div_id;
				
				var div_tab = document.getElementById(this.div_id);
				div_tab.innerHTML = '';
				
				div_tab.innerHTML += 'Username: <br>';
				
				self.register_username_textbox = document.createElement('input');
				self.register_username_textbox.setAttribute('id', this.div_id + '_register_username');
				self.register_username_textbox.setAttribute('type', 'text');
				
				div_tab.appendChild(self.register_username_textbox);
				div_tab.innerHTML += 'Password: <br>';
				
				self.register_password_textbox = document.createElement('input');
				self.register_password_textbox.setAttribute('id', this.div_id + '_register_password_textbox');
				self.register_password_textbox.setAttribute('type', 'text');
				
				div_tab.appendChild(self.register_password_textbox);
				div_tab.innerHTML += 'Email (optional): <br>';
				
				self.register_email_textbox = document.createElement('input');
				self.register_email_textbox.setAttribute('id', this.div_id + '_register_email_textbox');
				self.register_email_textbox.setAttribute('type', 'text');
				
				div_tab.appendChild(self.register_email_textbox);
				
				div_tab.innerHTML += '<br><br>';
				
				self.register_button = document.createElement("input");
				self.register_button.setAttribute('id', this.div_id + '_register_button');
				self.register_button.setAttribute('type', 'submit');
				self.register_button.value = 'Register';
				div_tab.appendChild(self.register_button);
				
				$('#' + self.register_button.id).button();
				$('#' + self.register_button.id).click(function(event) {

					//ensure a normal postback does not occur
					event.preventDefault();
					
					//execute the click event
					//TODO: implement login
					alert('Attempting registration...');
				});
			};
		}
	};
});


