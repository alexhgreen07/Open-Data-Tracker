define([
        '../../../client/rpc/json_rpc_queue.js',
        ],function(
        json_rpc_queue
        ){
	
	function Describe()
	{
		describe("json_rpc_queue.test Initialize", function() {

			it("Initializes the JSON RPC queue object.", function(done) {
				
				test_queue = new json_rpc_queue.JSON_RPC_Queue();
				
				done();
			});
			
			it("Basic queue test", function(done) {
				
				var test_rpc_count = 100;
				
				test_queue = new json_rpc_queue.JSON_RPC_Queue();
				
				//test function with timeout callback
				function Test_Rpc(params,callback){
					
					window.setTimeout(function(){
						
						callback(params);
						
					},(1000 / test_rpc_count));
					
				}
				
				//test callback
				function Test_Rpc_Callback(object)
				{
					expect(test_queue.is_busy).toBe(true);
					
					if(object.index == (test_rpc_count - 1))
					{
						done();
					}
				}
				
				//ensure it initialized to not busy
				expect(test_queue.is_busy).toBe(false);
				
				for(var i = 0; i < test_rpc_count; i++)
				{
					test_queue.Queue_RPC(
							Test_Rpc,
							{index: i},
							Test_Rpc_Callback
					);
				}
				
			});

		});
		
	}
	
	return {Describe: Describe};
	
});