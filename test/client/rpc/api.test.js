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
				
				//TODO: implement
				
				done();
			});

		});
		
	}
	
	return {Describe: Describe};
	
});