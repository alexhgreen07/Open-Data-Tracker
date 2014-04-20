module.exports = function(grunt) {

	grunt.loadNpmTasks('grunt-contrib-concat');

	grunt
			.initConfig({
				pkg : grunt.file.readJSON('package.json'),
				concat : {
					options : {
						separator : ';'
					},
					dist : {
						src : [
								'externals/jquery-ui/dist/jquery-ui.css',
								'externals/jquery-ui-timepicker-addon/jquery-ui-timepicker-addon.css',
								'externals/js.tree/resnyanskiy.js.tree.css',
								'externals/fullcalendar/build/out/fullcalendar.css',
								'client/main.css', ],
						dest : 'dist/main.css'
					}
				},
			});

	grunt.registerTask('default', [ 'concat' ]);

};