var requirejs = require('requirejs');

requirejs.config({
    //Pass the top-level main.js/index.js require
    //function to requirejs so that node modules
    //are loaded relative to the top-level JS file.
    nodeRequire: require
});

requirejs([
           './server/database.spec.js'
           ],function(
        	database_spec	   
           ){
	
	database_spec.Describe();
	
	describe('server.spec', function(){

		it('should fail', function(){
		    expect(1+2).toEqual(4);
		  });

	});
	
});