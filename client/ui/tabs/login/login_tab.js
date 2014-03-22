define([],function(){
	return {
		Login_Tab: function()
		{
			var self = this;
			
			this.login_success = function(){};
			
			this.Login_Button_Click = function()
			{
				
				//execute the click event
				var login = document.getElementById(self.login_username_textbox.id).value;
				var pass = document.getElementById(self.login_password_textbox.id).value;
				
				var params = {
					login: login,
					password: pass,
				};
				
				app.api.Authorize.Start_Authorized_Session(params, function(jsonRpcObj) {

					if (jsonRpcObj.result) {

						self.login_success();

					} else {
						alert('Login incorrect.');
					}

				});
				
			};
			
			/** @method Render
			 * @desc This function will render the tab in the div that it was initialized with.
			 * */
			this.Render = function(login_div_id) {
				
				this.div_id = login_div_id;
				
				var div_tab = document.getElementById(this.div_id);
				div_tab.innerHTML = '';
				
				div_tab.innerHTML += 'Username: <br>';
				
				self.login_username_textbox = document.createElement('input');
				self.login_username_textbox.setAttribute('id', this.div_id + '_login_username');
				self.login_username_textbox.setAttribute('type', 'text');
				
				div_tab.appendChild(self.login_username_textbox);
				div_tab.innerHTML += 'Password: <br>';
				
				self.login_password_textbox = document.createElement('input');
				self.login_password_textbox.setAttribute('id', this.div_id + '_login_password_textbox');
				self.login_password_textbox.setAttribute('type', 'password');
				
				div_tab.appendChild(self.login_password_textbox);
				
				div_tab.innerHTML += '<br><br>';
				
				self.login_button = document.createElement("input");
				self.login_button.setAttribute('id', this.div_id + '_login_button');
				self.login_button.setAttribute('type', 'submit');
				self.login_button.value = 'Login';
				div_tab.appendChild(self.login_button);
				
				$('#' + self.login_button.id).button();
				$('#' + self.login_button.id).click(function(event) {

					//ensure a normal postback does not occur
					event.preventDefault();
					
					self.Login_Button_Click();
				});
			};
		}
	};
});


