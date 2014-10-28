/*
	The MIT License (MIT)

	Copyright (c) 2014 Julian Xhokaxhiu

	Permission is hereby granted, free of charge, to any person obtaining a copy
	of this software and associated documentation files (the "Software"), to deal
	in the Software without restriction, including without limitation the rights
	to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
	copies of the Software, and to permit persons to whom the Software is
	furnished to do so, subject to the following conditions:

	The above copyright notice and this permission notice shall be included in all
	copies or substantial portions of the Software.

	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
	OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
	SOFTWARE.
*/
module.exports = function(grunt) {

	// Load Tasks
    require('load-grunt-tasks')(grunt);

    // Configure the tasks
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        app: grunt.file.readJSON('app.json'),
        cssMin: 'css/<%= pkg.name %>.min.<%= getCurrentDate() %>.css',
        cssPrintMin: 'css/<%= pkg.name %>.min.<%= getCurrentDate() %>.print.css',
        jsMin: 'js/<%= pkg.name %>.min.<%= getCurrentDate() %>.js',
        getCurrentDate: function() {
            var date = new Date();
            return date.getDate() + '-' + ( date.getMonth() + 1 ) + '-' + date.getFullYear();
        },
        clean: {
            options: {
                force: true
            },
            output: [
                '<%= app.config.output.path %>/*',
                'tpl/scss/_<%= pkg.name %>-icons.scss'
            ],
            cssFiles: [
                'tpl/css/99_<%= pkg.name %>.css',
                'tpl/css-print/99_<%= pkg.name %>.css'
            ],
            mapFiles: [
            	'tpl/css/*.map',
                'tpl/css/*.map',
            ],
            webfonts: [
            	'webfonts/'
            ],
            webicons: [
            	'webicons/'
            ]
        },
        tasty_swig: {
        	build: {
        		options: {
            		context: {
            			app: {
			                name: '<%= pkg.name %>',
			                liveReloadHost: '<%= app.config.livereload.host %>:<%= app.config.livereload.port %>',
			                cssFiles: {
			                    'screen': grunt.file.expand({
			                        filter: 'isFile',
			                        cwd: 'tpl/'
			                    }, 'css/**/*.css'),
			                    'print': grunt.file.expand({
			                        filter: 'isFile',
			                        cwd: 'tpl/'
			                    }, 'css-print/**/*.css')
			                },
			                jsFiles: [ '<%= jsMin %>' ],
			                data: '<%= app.data %>'
			            }
            		}
            	},
				src: [ 'tpl/*.swig' ],
				dest: '<%= app.config.output.path %>/'
			},
			deploy: {
				options: {
            		context: {
            			app: {
			                name: '<%= pkg.name %>',
			                liveReloadHost: false,
			                cssFiles: {
			                    'screen': [ '<%= cssMin %>' ],
								'print': [ '<%= cssPrintMin %>' ]
			                },
			                jsFiles: [ '<%= jsMin %>' ],
			                data: '<%= app.data %>'
			            }
            		}
            	},
				src: [ 'tpl/*.swig' ],
				dest: '<%= app.config.output.path %>/'
			}
        },
		sass: {
            options: {
                style: 'compressed'
            },
			build: {
				files: {
					'tpl/css/99_<%= pkg.name %>.css' : [ 'tpl/scss/screen.scss' ],
					'tpl/css-print/99_<%= pkg.name %>.css' : [ 'tpl/scss/print.scss' ]
				}
			}
		},
		fontgen: {
			build: {
				options: {
					path_prefix: '../fonts/'
				},
				files: {
					'webfonts/' : [
		            	'fonts/*.otf',
						'fonts/*.ttf'
		            ]
				}
			}
		},
		webfont: {
			icons: {
				src: 'icons/*.svg',
				dest: 'webicons/',
                destCss: 'tpl/scss/',
				options: {
					template: 'tpl/icons.css',
                    relativeFontPath: '../fonts/',
					font: '<%= pkg.name %>-icons',
                    stylesheet: 'scss',
                    htmlDemo: false,
                    templateOptions: {
                        baseClass: '<%= pkg.name %>-icon',
                        classPrefix: '<%= pkg.name %>-icon-',
                        mixinPrefix: '<%= pkg.name %>-icon-'
                    }
				}
			}
		},
        concat: {
        	webfonts: {
        		files: {
        			'tpl/css/98_webfonts.css' : [ 'webfonts/*.css' ],
        			'tpl/css-print/98_webfonts.css' : [ 'webfonts/*.css' ]
        		}
        	},
            css: {
                filter: 'isFile',
                src: 'tpl/css/**/*.css',
                dest: '<%= app.config.output.path %>/<%= cssMin %>'
            },
            cssPrint: {
                filter: 'isFile',
                src: 'tpl/css-print/**/*.css',
                dest: '<%= app.config.output.path %>/<%= cssPrintMin %>'
            },
            js: {
            	files: {
            		'<%= app.config.output.path %>/<%= jsMin %>' : '<%= app.assets.js %>'
            	}
            }
        },
        autoprefixer: {
            options: {
                browsers: ['last 3 versions', 'bb 10', 'android 3']
            },
            build: {
            	options: {
            		map: true
            	},
                src: '<%= app.config.output.path %>/css/*.css'
            },
            deploy: {
            	options: {
            		map: false
            	},
            	src: '<%= app.config.output.path %>/css/*.css'
            }
        },
        cssmin: {
            build: {
                files: {
                	'<%= app.config.output.path %>/css/<%= pkg.name %>.min.<%= getCurrentDate() %>.css' : [ 'tpl/css/**/*.css' ],
                	'<%= app.config.output.path %>/css-print/<%= pkg.name %>.min.<%= getCurrentDate() %>.css' : [ 'tpl/css-print/**/*.css' ]
                }
            }
        },
        closurecompiler: {
            build: {
            	files: {
            		'<%= app.config.output.path %>/<%= jsMin %>': '<%= app.assets.js %>'
            	},
            	options: {
	                // Any options supported by Closure Compiler, for example:
	                "compilation_level": "SIMPLE_OPTIMIZATIONS",

	                // Plus a simultaneous processes limit
	                "max_processes": 5,
	            }
            }
        },
        copy: {
            build: {
                files: [
                    // The project CSS and JS files
                    {
                        expand: true,
                        cwd: 'tpl/',
                        src: [
                            'css/**/*.css',
                            'css-print/**/*.css',
                            'css/**/*.map',
                            'css-print/**/*.map',
                            'js/**/*.js'
                        ],
                        dest: '<%= app.config.output.path %>/'
                    }
                ]
            },
            deploy: {
                files: [
                	// External Packages Fonts
                	{
                		expand: true,
                		flatten: true,
                		cwd: 'bower_components/',
                		src: ['**/*.{ttf,woff,eot,svg,otf}'],
                		dest: '<%= app.config.output.path %>/fonts/'
                	},
                	// The project Webfonts
                	{
                		expand: true,
                		flatten: true,
                		cwd: 'webfonts/',
                		src: ['**/*.{ttf,woff,eot,svg,otf}'],
                		dest: '<%= app.config.output.path %>/fonts/'
                	},
                	// The project Webicons
                	{
                		expand: true,
                		flatten: true,
                		cwd: 'webicons/',
                		src: ['**/*.{ttf,woff,eot,svg,otf}'],
                		dest: '<%= app.config.output.path %>/fonts/'
                	},
                	// Webicons sass generated file
                	{
                        expand: true,
                        cwd: 'webicons/',
                        src: [
                            '*.scss'
                        ],
                        dest: 'tpl/scss/'
                    },
                	// The project resource files
                    {
                        expand: true,
                        cwd: 'rsc/',
                        src: ['**'],
                        dest: '<%= app.config.output.path %>/'
                    }
                ]
            }
        },
        watch: {
        	options: {
        		livereload: '<%= app.config.livereload.port %>'
        	},
            html: {
                files: [
                    'tpl/**/*.swig',
                    'app.json'
                ],
                tasks: [
                	'rebuild:html'
                ]
            },
            css: {
                files: [
                    'tpl/**/*.scss',
                ],
                tasks: [
                    'rebuild:css'
                ]
            },
            js: {
                files: [
                    'tpl/**/*.js'
                ],
                tasks: [
                    'rebuild:js'
                ]
            }
        },
        rsync: {
            options: {
                recursive: true,
                deleteAll: true
            },
            deploy: {
                options: {
                    src: '<%= app.config.output.path %>/',
                    dest: '<%= app.config.deploy.path %>',
                    host: '<%= app.config.deploy.host %>'
                }
            }
        },
        connect: {
			build: {
				options: {
					port: '<%= app.server.port %>',
					hostname: '*',
					base: '<%= app.config.output.path %>/'
				}
			}
		}
    });

    grunt.registerTask('default', 'Gruntfile for Mockups', function() {
        grunt.warn('No task name specified.\n\nAvailable tasks: build, deploy, server"\n\n');
    });

    grunt.registerTask('server', 'Serve an already built mockup', [
    	'connect:build:keepalive'
    ]);

    grunt.registerTask('build', 'Build a mockup and watch for file modifications', [
		'rebuild',
		'watch'
    ]);

    grunt.registerTask('rebuild', 'Build a mockup without watching for file modifications', function ( watchTask ) {
        var tasks = [];

        if ( watchTask === undefined ) watchTask = 'all';

        if ( watchTask == 'all' ) {
            tasks = tasks.concat([
                'clean',
                'fontgen',
                'webfont',
                'concat:webfonts',
                'sass',
                'concat:js',
                'tasty_swig:build',
                'copy:deploy',
                'copy:build',
                'autoprefixer:build',
                'clean:mapFiles',
                'clean:webfonts',
                'clean:webicons'
            ]);
            if ( grunt.config.get('app').config.server.port > -1 )
                tasks = tasks.concat([
                	'connect:build'
                ]);
        } else if ( watchTask == 'html' ) {
            tasks = tasks.concat([
                'tasty_swig:build',
                'copy:deploy',
                'copy:build'
            ]);
        } else if ( watchTask == 'css' ) {
            tasks = tasks.concat([
                'clean:cssFiles',
                'sass',
                'copy:deploy',
                'copy:build',
                'autoprefixer:build'
            ]);
        } else if ( watchTask == 'js' ) {
            tasks = tasks.concat([
                'concat:js',
                'copy:deploy',
                'copy:build'
            ]);
        }
        grunt.task.run(tasks);
    });

    grunt.registerTask('build_deploy', 'Build a mockup ready for deployment sync', [
    	'clean',
        'fontgen',
        'webfont',
        'concat:webfonts',
        'sass',
        'concat:css',
        'concat:cssPrint',
        'cssmin',
        'closurecompiler',
        'tasty_swig:deploy',
        'copy:deploy',
        'autoprefixer:deploy',
        'clean:mapFiles',
        'clean:webfonts',
        'clean:webicons'
    ]);

    grunt.registerTask('deploy', 'Deploy a mockup to the Mockups Server', [
		'build_deploy',
		'rsync:deploy'
    ]);
};
