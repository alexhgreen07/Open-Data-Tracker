define([
        '../../client/application.js',
        ],function(
		application
        ){
	
	function Describe()
	{
		describe("application.test Initialize", function() {

			it("Initializes the main application object.", function(done) {
				
				var test_window = window.open("", "popupWindow", "width=600,height=600,scrollbars=yes");
				
				var app = new application.Main_Application(test_window.document);
				
				app.Initialize();
				
				test_window.close();
				
				done();
			});

		});
		
		describe("application.test 1", function() {

			it("contains spec with an expectation, index: 1", function(done) {
				
				expect(true).toBe(true);
				done();
			});

		});
	}
	
	return {Describe: Describe};
	
});