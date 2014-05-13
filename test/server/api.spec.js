define([],function(){
	
	function Describe(){

		describe('api.spec', function(){

			  it('should fail', function(){
			    expect(1+2).toEqual(4);
			  });

			});
	
	}
		
	return {
		Describe: Describe
	};
});