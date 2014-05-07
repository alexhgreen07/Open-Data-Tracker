define([],function(){
	
	function Describe(){

		describe('database.spec', function(){

			  it('should fail', function(){
			    expect(1+2).toEqual(4);
			  });

			});
	
	}
		
	return {
		Describe: Describe
	};
});
