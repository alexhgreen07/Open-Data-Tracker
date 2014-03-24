define([
        'jquery.ui',
        ],function($){
	return {
		/** This is the form to edit category data.
		 * @constructor Edit_Category_Form
		 */
		Edit_Category_Form: function(){
			
			var self = this;
			
			this.Refresh = function(data){
				
				self.categories_list = data["Categories"];
				
				self.Category_Edit_Select_Change_Event();
			};
			
			/** @method Category_Edit_Submit_Click_Event
			 * @desc This is the edit category submit button click event handler.
			 * @param {function} refresh_callback The callback to call after the data operation has completed.
			 * */
			this.Category_Edit_Submit_Click_Event = function(refresh_callback){
				
				
				var selected_category_index = document.getElementById(this.edit_category_select.id).value;
				
				if(selected_category_index != 0)
				{
				
					var self = this;
					
					var params = {
						category_id: selected_category_index,
						name: document.getElementById(self.edit_category_name.id).value,
						description: document.getElementById(self.edit_category_description.id).value,
						parent_category_id: document.getElementById(self.edit_category_parent_select.id).value,
					};
			
					//execute the RPC callback for retrieving the item log
					rpc.Home_Data_Interface.Update_Category(params, function(jsonRpcObj) {
			
			
						if (jsonRpcObj.result.success) {
			
							alert('Category successfully updated.');
								
							
							app.api.Refresh_Data(function() {
								//self.refresh_item_log_callback();
							});
							
			
						} else {
							alert('Category failed to update.');
							//alert(jsonRpcObj.result.debug);
						}
			
					});
					
					
				}
				else
				{
					alert('Select a valid category.');
				}
			};
			
			/** @method Category_Delete_Click_Event
			 * @desc This is the delete category submit button click event handler.
			 * @param {function} refresh_callback The callback to call after the data operation has completed.
			 * */
			this.Category_Delete_Click_Event = function(refresh_callback){
				
				var selected_category_index = document.getElementById(this.edit_category_select.id).value;
				
				if(selected_category_index != 0)
				{
					
					var r=confirm("Are you sure you want to delete this task target?");
						
					if (r==true)
					{
					
						var params = {
							category_id: selected_category_index
						};
				
						var self = this;
						
						//execute the RPC callback for retrieving the item log
						rpc.Home_Data_Interface.Delete_Category(params, function(jsonRpcObj) {
				
				
							if (jsonRpcObj.result.success) {
				
								alert('Category deleted.');
									
								
								app.api.Refresh_Data(function() {
									//self.refresh_item_log_callback();
								});
								
				
							} else {
								alert('Category failed to delete.');
								//alert(jsonRpcObj.result.debug);
							}
				
						});
						
					
					}
				}
				else
				{
					alert('Select a valid category.');
				}
				
				
			};
			
			
			/** @method Category_Edit_Select_Change_Event
			 * @desc This is the category edit HTML select index change event handler.
			 * */
			this.Category_Edit_Select_Change_Event = function(){
				
				var selected_index = document.getElementById(this.edit_category_select.id).selectedIndex;
				
				if(selected_index > 0)
				{
					//TODO: Fix this bug. It needs category data.
					var selected_category = this.categories_list[selected_index - 1];
				
					document.getElementById(this.edit_category_name.id).value = selected_category["Name"];
					document.getElementById(this.edit_category_description.id).value = selected_category["Description"];
					document.getElementById(this.edit_category_parent_select.id).value = selected_category["Parent Category ID"];
					
				}
				else{
					
					document.getElementById(this.edit_category_name.id).value = "";
					document.getElementById(this.edit_category_description.id).value = "";
					document.getElementById(this.edit_category_parent_select.id).value = "0";
					
					
				}
				
				
			};
			
			
			/** @method Render
			 * @desc This function will render the edit category tab in the specified div.
			 * @param {String} form_div_id The div ID to render the form in.
			 * */
			this.Render = function(form_div_id) {
				
				var self = this;
				
				this.edit_category_form = document.createElement("form");
				this.edit_category_form.setAttribute('method', "post");
				this.edit_category_form.setAttribute('id', "home_edit_category_form");

				this.edit_category_form.innerHTML += 'Category:<br />';

				this.edit_category_select = document.createElement("select");
				this.edit_category_select.setAttribute('id', "edit_category_select");
				this.edit_category_select.innerHTML = '<option>-</option>';
				this.edit_category_form.appendChild(this.edit_category_select);

				this.edit_category_form.innerHTML += '<br /><br />';

				this.edit_category_form.innerHTML += 'Name:<br />';

				this.edit_category_name = document.createElement("input");
				this.edit_category_name.setAttribute('type', "text");
				this.edit_category_name.setAttribute('id', "edit_category_name");
				this.edit_category_form.appendChild(this.edit_category_name);

				this.edit_category_form.innerHTML += 'Description:<br />';

				this.edit_category_description = document.createElement("input");
				this.edit_category_description.setAttribute('type', "text");
				this.edit_category_description.setAttribute('id', "edit_category_description");
				this.edit_category_form.appendChild(this.edit_category_description);

				this.edit_category_form.innerHTML += 'Parent Category:<br />';

				this.edit_category_parent_select = document.createElement("select");
				this.edit_category_parent_select.setAttribute('id', "edit_category_parent_select");
				this.edit_category_parent_select.innerHTML = '<option value="0">-</option>';
				this.edit_category_form.appendChild(this.edit_category_parent_select);

				this.edit_category_form.innerHTML += '<br /><br />';

				this.edit_category_submit_button = document.createElement("input");
				this.edit_category_submit_button.setAttribute('id', 'edit_category_submit_button');
				this.edit_category_submit_button.setAttribute('type', 'submit');
				this.edit_category_submit_button.value = 'Submit';
				this.edit_category_form.appendChild(this.edit_category_submit_button);

				this.edit_category_form.innerHTML += '<br /><br />';

				this.edit_category_delete_button = document.createElement("input");
				this.edit_category_delete_button.setAttribute('id', 'edit_category_delete_button');
				this.edit_category_delete_button.setAttribute('type', 'submit');
				this.edit_category_delete_button.value = 'Delete';
				this.edit_category_form.appendChild(this.edit_category_delete_button);

				var div_tab = document.getElementById(form_div_id);
				div_tab.innerHTML = '';
				div_tab.appendChild(this.edit_category_form);

				$('#' + this.edit_category_submit_button.id).button();
				$('#' + this.edit_category_delete_button.id).button();

				$('#' + this.edit_category_submit_button.id).click(function(event) {
					//ensure a normal postback does not occur
					event.preventDefault();
					
					self.Category_Edit_Submit_Click_Event(function(){});
				});

				$('#' + this.edit_category_delete_button.id).click(function(event) {
					//ensure a normal postback does not occur
					event.preventDefault();
					
					self.Category_Delete_Click_Event(function(){});

				});
				
				$('#' + this.edit_category_select.id).change(function(){
					
					self.Category_Edit_Select_Change_Event();
					
				});
			};
		}
	};
});


