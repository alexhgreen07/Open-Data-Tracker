define([
        'jquery.ui',
        'client/helpers/ui_helpers',
        './forms/new_category_form',
        './forms/edit_category_form',
        ],function($, ui_helpers, new_category_form, edit_category_form){
	
	/** This is the form to interact with category data.
	 * @constructor Category_Form
	 */
	function Category_Form(init_new_category_form,init_edit_category_form){
		
		var self = this;
		
		/** This is the form for new categories.
		 * @type New_Category_Form
		 * */
		this.new_category_form = init_new_category_form;
		
		/** This is the form to edit categories.
		 * @type Edit_Category_Form
		 * */
		this.edit_category_form = init_edit_category_form;
		
		this.Refresh = function(data){
			
			self.data = data;
			
			ui_helpers.Refresh_Select_HTML_From_Table(
				self.new_category_form.add_new_category_parent_select.id,
				data['Categories'],
				"Category ID",
				"Category Path");
			
			ui_helpers.Refresh_Select_HTML_From_Table(
				self.edit_category_form.edit_category_select.id,
				data['Categories'],
				"Category ID",
				"Category Path");
			
			ui_helpers.Refresh_Select_HTML_From_Table(
				self.edit_category_form.edit_category_parent_select.id,
				data['Categories'],
				"Category ID",
				"Category Path");
			
			this.edit_category_form.Refresh(data);
		};
		
		this.Refresh_From_Diff = function(diff)
		{
			
			ui_helpers.Refresh_Select_HTML_From_Table_Diff(
				self.new_category_form.add_new_category_parent_select.id,
				diff.data['Categories'],
				"Category ID",
				"Category Path");
			
			ui_helpers.Refresh_Select_HTML_From_Table_Diff(
				self.edit_category_form.edit_category_select.id,
				diff.data['Categories'],
				"Category ID",
				"Category Path");
			
			ui_helpers.Refresh_Select_HTML_From_Table_Diff(
				self.edit_category_form.edit_category_parent_select.id,
				diff.data['Categories'],
				"Category ID",
				"Category Path");
			
			this.edit_category_form.Refresh(self.data);
			
		};
		
		this.Show_Form = function(div_id){
			
			for(var key in this.div_forms)
			{
				if(div_id == this.div_forms[key].id)
				{
					$(this.div_forms[key]).fadeIn();
				}
				else
				{
					$(this.div_forms[key]).hide();
				}
				
			}
			
		};
		
		/** @method Render
		 * @desc This function will render the general home form in the specified div.
		 * @param {String} form_div_id The div ID to render the form in.
		 * */
		this.Render = function(parent_div) {
			
			this.div_ids = [
				'home_category_add_new_tab',
				'home_category_edit_tab',
			];
			this.div_forms = {};
			
			for(var i = 0; i < this.div_ids.length; i++)
			{
				var new_form = document.createElement('div');
				new_form.id = this.div_ids[i];
				
				this.div_forms[this.div_ids[i]] = parent_div.appendChild(new_form);
				
			}

			this.new_category_form.Render(this.div_forms['home_category_add_new_tab']);
			this.edit_category_form.Render(this.div_forms['home_category_edit_tab']);
			
			for(var key in this.div_forms)
			{
				$(this.div_forms[key]).hide();
			}
		};
		
	}
	
	function Build_Category_Form()
	{
		var init_new_category_form = new_category_form.Build_New_Category_Form();
		var init_edit_category_form = edit_category_form.Build_Edit_Category_Form();
		
		var built_category_form = new Category_Form(init_new_category_form,init_edit_category_form);
		
		return built_category_form;
	}
	
	return {
		Build_Category_Form: Build_Category_Form,
		Category_Form: Category_Form,
	};
});

