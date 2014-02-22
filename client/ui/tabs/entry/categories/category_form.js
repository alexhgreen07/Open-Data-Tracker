/** This is the form to interact with category data.
 * @constructor Category_Form
 */
function Category_Form(){
	
	var self = this;
	
	/** This is the form for new categories.
	 * @type New_Category_Form
	 * */
	this.new_category_form = new New_Category_Form();
	
	/** This is the form to edit categories.
	 * @type Edit_Category_Form
	 * */
	this.edit_category_form = new Edit_Category_Form();
	
	/** This is the form to view categories.
	 * @type View_Category_Form
	 * */
	this.view_categories_forms = new View_Category_Form();
	
	this.Refresh = function(data){

		Refresh_Select_HTML_From_Table(
			self.new_category_form.add_new_category_parent_select.id,
			data['Categories'],
			"Category ID",
			"Category Path");
		
		Refresh_Select_HTML_From_Table(
			self.edit_category_form.edit_category_select.id,
			data['Categories'],
			"Category ID",
			"Category Path");
		
		Refresh_Select_HTML_From_Table(
			self.edit_category_form.edit_category_parent_select.id,
			data['Categories'],
			"Category ID",
			"Category Path");
		
		this.view_categories_forms.Refresh(data);
		this.edit_category_form.Refresh(data);
	};
	
	this.Show_Form = function(div_id){
		
		for(var i = 0; i < this.div_ids.length; i++)
		{
			if(div_id == this.div_ids[i])
			{
				$('#'+this.div_ids[i]).fadeIn();
			}
			else
			{
				$('#'+this.div_ids[i]).hide();
			}
			
		}
		
	};
	
	/** @method Render
	 * @desc This function will render the general home form in the specified div.
	 * @param {String} form_div_id The div ID to render the form in.
	 * */
	this.Render = function(form_div_id) {
		
		this.div_ids = [
			'home_category_view_tab',
			'home_category_add_new_tab',
			'home_category_edit_tab',
		];
		
		var return_html = '';
		
		for(var i = 0; i < this.div_ids.length; i++)
		{
			return_html += '<div id="'+this.div_ids[i]+'"></div>';
		}

		var div_tab = document.getElementById(form_div_id);
		div_tab.innerHTML = return_html;
		
		this.view_categories_forms.Render('home_category_view_tab');
		this.new_category_form.Render('home_category_add_new_tab');
		this.edit_category_form.Render('home_category_edit_tab');
		
		for(var i = 0; i < this.div_ids.length; i++)
		{
			$('#'+this.div_ids[i]).hide();
		}
	};
	
}