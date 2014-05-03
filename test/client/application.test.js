define([
		'./rpc/api.test.js',
        '../../client/application.js',
        ],function(
		api_test,
		application
        ){
	
	function Describe()
	{
		api_test.Describe();
		
		describe("application.test Initialize", function() {

			it("Initializes the main application object.", function(done) {
				
				//TODO: implement
				/*
				var test_window = window.open("", "popupWindow", "width=600,height=600,scrollbars=yes");
				
				var app = new application.Main_Application(test_window.document);
				
				app.Initialize();
				
				test_window.close();
				*/
				
				done();
			});

		});
		
	}
	
	return {Describe: Describe};
	
});