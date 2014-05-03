define(
		[ 'jquery',
		  './client/application.test.js'
		  ],
		function($, application_test) {

			function Execute_Tests() {
				
				document.body.innerHTML = '';
				
				application_test.Describe();

				//run the load event
				window.onload();

			}

			return {
				Execute_Tests : Execute_Tests,
			};

		});