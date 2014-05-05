define([
        './json_rpc_queue.test.js',
        '../../../client/rpc/api.js',
        ],function(
        json_rpc_queue_test,
		api
        ){
	
	function Describe()
	{
		json_rpc_queue_test.Describe();
		
		describe("api.test Initialize", function() {

			it("Initializes the API object.", function(done) {
				
				var test_api = api.Build_Server_API();
				
				done();
			});
			
			it("Connects to a remote server at the default URL.", function(done){
				
				var test_api = api.Build_Server_API();
				
				test_api.Connect('server/api.php', function() {
					
					done();
					
				});
				
			});
			
			it("Tests basic RPC functionality.",function(done){
				
				//TODO: implement
				expect(true).toBe(false);
				
				done();
				
			});
			
			it("Tests basic busy indicator functionality.",function(done){
				
				//TODO: implement
				expect(true).toBe(false);
				
				done();
				
			});

		});
		
	}
	
	return {Describe: Describe};
	
});