define([
        './data_interface_lib/home_data_interface.spec.js',
        './data_interface_lib/item_data_interface.spec.js',
        './data_interface_lib/task_data_interface.spec.js',
        ],function(
        		home_data_interface_spec,
        		item_data_interface_spec,
        		task_data_interface_spec
        ){
	
	function Describe(){
		
		home_data_interface_spec.Describe();
		item_data_interface_spec.Describe();
		task_data_interface_spec.Describe();
		
		describe('data_interface.spec', function(){

			  it('should fail', function(){
			    expect(1+2).toEqual(4);
			  });

			});
	
	}
		
	return {
		Describe: Describe
	};
});