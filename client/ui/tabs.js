define(['jquery.ui'],function($){
	return {
		/** This is a wrapper for an array of panes in a JQuery tab object.
		 * @constructor Tabs
		 */
		Tabs: function (tab_div, tab_array) {
			
			var self = this;
			
			//class variables
			self.tab_div = tab_div;
			self.tabs = tab_array;
			self.activate_callback = function(){};

			//render function (div must already exist)
			self.Render = function() {

				var new_inner_html = '';
				
				var ul_container = document.createElement("ul");
				ul_container = self.tab_div.appendChild(ul_container);

				//create all top tab items using ul
				for (var i = 0; i < self.tabs.length; i++) {
					
					var li_container = document.createElement("li");
					li_container = ul_container.appendChild(li_container);
					
					var a_container = document.createElement("a");
					a_container.href = '#' + self.tab_div.id + '-tab-' + i + '';
					a_container.innerHTML = this.tabs[i][0];
					a_container = li_container.appendChild(a_container);
					
				}

				//create all content tab items using div
				for (var i = 0; i < self.tabs.length; i++) {
					
					var div_container = document.createElement("div");
					div_container.id = self.tab_div.id + '-tab-' + i + '';
					div_container = self.tab_div.appendChild(div_container);
					
					self.tabs[i][1] = div_container.appendChild(self.tabs[i][1]);
					
				}

				//execute JQuery tabs initialization
				$(self.tab_div).tabs({
					activate: function(event, ui) {
				        self.activate_callback();
				   },
				});

			};
		}
	};
});




