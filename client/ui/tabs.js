define(['jquery.ui'],function($){
	
	/** This is a wrapper for an array of panes in a JQuery tab object.
	 * @constructor Tabs
	 */
	function Tabs() {
		
		var self = this;
		
		self.activate_callback = function(){};

		//render function (div must already exist)
		self.Render = function(tab_div, tab_array) {

			var new_inner_html = '';
			
			var ul_container = document.createElement("ul");
			ul_container = tab_div.appendChild(ul_container);

			//create all top tab items using ul
			for (var i = 0; i < tab_array.length; i++) {
				
				var li_container = document.createElement("li");
				li_container = ul_container.appendChild(li_container);
				
				var a_container = document.createElement("a");
				a_container.href = '#' + tab_div.id + '-tab-' + i + '';
				a_container.innerHTML = tab_array[i][0];
				a_container = li_container.appendChild(a_container);
				
			}

			//create all content tab items using div
			for (var i = 0; i < tab_array.length; i++) {
				
				var div_container = document.createElement("div");
				div_container.id = tab_div.id + '-tab-' + i + '';
				div_container = tab_div.appendChild(div_container);
				
				tab_array[i][1] = div_container.appendChild(tab_array[i][1]);
				
			}

			//execute JQuery tabs initialization
			$(tab_div).tabs({
				activate: function(event, ui) {
			        self.activate_callback();
			   },
			});

		};
	}
	
	return {
		Tabs: Tabs,
	};
});




