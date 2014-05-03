define(
		[ 'jquery' ],
		function($) {

			function Execute_Tests() {
				
				document.body.innerHTML = '';
				
				describe("Suite 0", function() {

					it("contains spec with an expectation, index: 0", function(done) {
						
						expect(true).toBe(true);
						done();
					});

				});
				
				describe("Suite 1", function() {

					it("contains spec with an expectation, index: 1", function(done) {
						
						expect(true).toBe(true);
						done();
					});

				});

				//run the load event
				window.onload();

			}

			return {
				Execute_Tests : Execute_Tests,
			};

		});