define([
        'jquery.ui'
        ],function($){
	
	/** This is the new category form class which holds all UI objects for the new category entry.
	 * @constructor New_Category_Form
	 */
	function New_Category_Form(){
		
		/** @method Category_Insert_Submit_Click_Event
		 * @desc This is the insert category submit button click event handler.
		 * @param {function} refresh_callback The callback to call after the data operation has completed.
		 * */
		this.Category_Insert_Submit_Click_Event = function(refresh_callback){
			
			var self = this;
			
			var params = {
				name: document.getElementById(this.add_new_category_name.id).value,
				description: document.getElementById(this.add_new_category_description.id).value,
				parent_category_id: document.getElementById(this.add_new_category_parent_select.id).value,
			};

			//execute the RPC callback for retrieving the item log
			app.api.Home_Data_Interface.Insert_Category(params, function(jsonRpcObj) {


				if (jsonRpcObj.result.success) {

					alert('New category added.');
						
					
					app.api.Refresh_Data(function() {
						//self.refresh_item_log_callback();
					});
					

				} else {
					alert('Category failed to add.');
					alert(jsonRpcObj.result.debug);
				}

			});
			
			
		};
		
		/** @method Render
		 * @desc This function will render the add new category tab in the specified div.
		 * @param {String} parent_div The div ID to render the form in.
		 * */
		this.Render = function(parent_div) {
			
			var self = this;
			
			this.add_new_category_form = document.createElement("form");
			this.add_new_category_form.setAttribute('method', "post");
			this.add_new_category_form.setAttribute('id', "home_add_new_category_form");

			var div_tab = parent_div;
			this.add_new_category_form = div_tab.appendChild(this.add_new_category_form);
			
			this.add_new_category_form.appendChild(document.createTextNode('Name:'));
			this.add_new_category_form.appendChild(document.createElement('br'));

			this.add_new_category_name = document.createElement("input");
			this.add_new_category_name.setAttribute('type', "text");
			this.add_new_category_name.setAttribute('id', "add_new_category_name");
			this.add_new_category_name = this.add_new_category_form.appendChild(this.add_new_category_name);

			this.add_new_category_form.appendChild(document.createTextNode('Description:'));
			this.add_new_category_form.appendChild(document.createElement('br'));

			this.add_new_category_description = document.createElement("input");
			this.add_new_category_description.setAttribute('type', "text");
			this.add_new_category_description.setAttribute('id', "add_new_category_description");
			this.add_new_category_description = this.add_new_category_form.appendChild(this.add_new_category_description);

			this.add_new_category_form.appendChild(document.createTextNode('Parent Category:'));
			this.add_new_category_form.appendChild(document.createElement('br'));

			this.add_new_category_parent_select = document.createElement("select");
			this.add_new_category_parent_select.setAttribute('id', "add_new_category_parent_select");
			this.add_new_category_parent_select.innerHTML = '<option value="0">-</option>';
			this.add_new_category_parent_select = this.add_new_category_form.appendChild(this.add_new_category_parent_select);

			this.add_new_category_form.appendChild(document.createElement('br'));
			this.add_new_category_form.appendChild(document.createElement('br'));

			this.add_new_category_submit_button = document.createElement("input");
			this.add_new_category_submit_button.setAttribute('id', 'add_new_category_submit_button');
			this.add_new_category_submit_button.setAttribute('type', 'submit');
			this.add_new_category_submit_button.value = 'Submit';
			this.add_new_category_submit_button = this.add_new_category_form.appendChild(this.add_new_category_submit_button);

			$(this.add_new_category_submit_button).button();
			$(this.add_new_category_submit_button).click(function(event) {
				//ensure a normal postback does not occur
				event.preventDefault();
				
				self.Category_Insert_Submit_Click_Event(function(){});
			});
		};
		
	}
	
	function Build_New_Category_Form()
	{
		var built_new_category_form = new New_Category_Form();
		
		return built_new_category_form;
	}
	
	return {
		Build_New_Category_Form: Build_New_Category_Form,
		New_Category_Form: New_Category_Form,
	};
});


