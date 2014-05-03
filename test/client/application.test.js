define([
        '../../client/application.js',
        ],function(
		application
        ){
	
	function Describe()
	{
		describe("application.test Initialize", function() {

			it("contains spec with an expectation, index: 0", function(done) {
				
				expect(true).toBe(true);
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