'use strict';

var libs = ['bootstrap', 'vue', 'bootbox', 'lodash', 'vuex', 'vue-resource', 'vue-router', 'jquery', 'xterm', 'reconnectingwebsocket'];

module.exports = function(grunt) {
	var tasks = {
		browserify: {
			ui: {
				files: {
					'build/ui/js/login.js': ['src/ui/js/login.js'],
					'build/ui/js/admin.js': ['src/ui/js/admin.js']
				},
				options: {
					transform: ['vueify']
				}
			},
			vendor: {
				src: [],
				dest: 'build/ui/js/vendor.js',
				options: {
					external: null,
					require: libs
				},
			},
			options: {
				external: libs
			},
		},

		copy: {
			server: {
				files: [{
					expand: true,
					cwd: 'src/server',
					src: ['**/*'],
					dest: 'build/server/'
				},
				// {
				// 	expand: true,
				// 	cwd: 'src/server/bin',
				// 	src: ['*'],
				// 	dest: 'build/server/bin/'
				// },
				// {
				// 	expand: true,
				// 	cwd: 'src/server/database',
				// 	src: ['*'],
				// 	dest: 'build/server/database/'
				// },
				// {
				// 	expand: true,
				// 	cwd: 'src/server/routes',
				// 	src: ['*'],
				// 	dest: 'build/server/routes/'
				// }
				]
			},
			ui: {
				files: [{
					expand: true,
					cwd: 'src/ui/img',
					src: ['**/*'],
					dest: 'build/ui/img/'
				},
				{
					expand: true,
					cwd: 'src/ui',
					src: ['*.html'],
					dest: 'build/ui'
				}]
			}
		},
		//clean the build folder
		clean: {
			all: 'build',
			client: 'build/client',
			server: 'build/server',
		},
		less: {
			vendor: {
				files: {
					'build/ui/style/login.css': 'src/ui/style/login.less',
					'build/ui/style/admin.css': 'src/ui/style/admin.less',
					'build/ui/style/vendor.css': 'src/ui/style/vendor.less'
				}
			}
		},
		eslint: {
			gruntfile: 'Gruntfile.js',
			server: ['src/server/**/*.js', '!src/server/server-tftp/**/*.js', '!src/server/app.js'],
			ui: ['src/ui/**/*.js', 'src/ui/**/*.vue']
		}
	};

	grunt.initConfig(tasks);
	grunt.loadNpmTasks('grunt-browserify');
	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-eslint');

	grunt.registerTask('server', ['eslint:server', 'copy:server']);

	grunt.registerTask('default', ['server', 'eslint', 'browserify', 'copy', 'less']);
};
