var requirejs = require('requirejs');

requirejs.config({
    //Pass the top-level main.js/index.js require
    //function to requirejs so that node modules
    //are loaded relative to the top-level JS file.
    nodeRequire: require
});

requirejs([
           './server/database.spec.js',
           './server/auth.spec.js',
           './server/data_interface.spec.js',
           './server/api.spec.js'
           ],function(
        	database_spec,
        	auth_spec,
        	data_interface_spec,
        	api_spec
           ){
	
	database_spec.Describe();
	auth_spec.Describe();
	data_interface_spec.Describe();
	api_spec.Describe();
	
	describe('server.spec', function(){

		it('should fail', function(){
		    expect(1+2).toEqual(4);
		  });

	});
	
});