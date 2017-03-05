module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		clean: ["resource/"],
		copy: {
			main: {
				expand: true,
				cwd: 'src/_img/',
				src: '**',
				dest: 'resource/',
				flatten: true,
				filter: 'isFile'
			},
		},
		less: {
			production: {
				files: {
					'src/_css/pickupstore.css': 'src/_less/pickupstore.less'
				}
			}
		},
		uglify: {
			prod: {
				options: {
					beautify: false,
					mangle: true,
					banner: '/*! Pickup Store v<%= pkg.version %> | <%= grunt.template.today("yyyy-mm-dd") %> | (c) <%= pkg.description %> | vtexcarries.com/license */' + "\n"
				},
				files: {
					'resource/<%= pkg.name %>.min.js': ['bower_components/handlebars/handlebars.min.js', 'src/_js/vtexcarries.js']
				}
			},
			dev: {
				options: {
					beautify: true
				},
				files: {
					'resource/<%= pkg.name %>.min.js': ['bower_components/jquery/dist/jquery.min.js', 'bower_components/handlebars/handlebars.min.js', 'src/_js/vtexcarries.js']
				}
			}
		},
		cssmin: {
			target: {
				files: [{
					expand: true,
					cwd: 'src/_css/',
					src: ['*.css', '!*.min.css'],
					dest: 'resource/',
					ext: '.min.css'
				}]
			}
		},
		watch: {
			configFiles: {
				tasks: ['copy', 'less', 'uglify:dev', 'cssmin'],
				files: ['src/**'],
				options: {
					livereload: 35729
				}
			}
		}
	});
	// Load NPM Tasks
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-contrib-copy');

	// Default task(s)
	grunt.registerTask('default', ['clean', 'copy', 'less', 'uglify:prod', 'cssmin']);
	// Dev task(s)
	grunt.registerTask('dev', ['clean', 'copy', 'less', 'uglify:dev', 'cssmin', 'watch']);
};