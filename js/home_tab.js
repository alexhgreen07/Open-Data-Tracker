function Home_Tab (home_div_id) {

	//class variables
	this.div_id = home_div_id;
	this.data_form;
	this.button;
	this.new_data_display_div;
	
	this.On_Click_Event = function()
	{
		
		this.new_data_display_div.innerHTML = 'Last refreshed: ' + (new Date()) + '<br />';
		
		//NOT IMPLEMENTED
	};
	
	//render function (div must already exist)
	this.Render = function() {
		
		this.data_form = document.createElement("form");
		this.data_form.setAttribute('method',"post");
		this.data_form.setAttribute('id',"home_display_form");
		
		this.button = document.createElement("input");
		this.button.setAttribute('type','submit');
		this.button.setAttribute('id','home_submit_button');
		this.button.value = 'Refresh';
		
		var self = this;
		$(this.button).button();
		$(this.button).click(function( event ) {
			
			//ensure a normal postback does not occur
			event.preventDefault();
			
			//execute the click event
			self.On_Click_Event();
		});
		
		this.data_form.appendChild(this.button);
		
		this.new_data_display_div = document.createElement("div");
		this.data_form.appendChild(this.new_data_display_div);
		
		var div_tab = document.getElementById(this.div_id);
		div_tab.innerHTML = '';
		div_tab.appendChild(this.data_form);
		
		//call the click event function
		this.On_Click_Event();


	};
}


