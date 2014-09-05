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

	var extend = require('node.extend'),
    	app = grunt.file.readJSON('app.json'),
        appExists = function(name) {
            var ret = false;
            ret = grunt.file.exists('app/' + name);
            return ret;
        },
        pathExistsInApp = function(path) {
            var ret = false;

            if (grunt.file.exists(app.path + '/tpl/' + path))
                ret = path;

            return ret;
        },
        getResourcePath = function() {
        	return app.path + '/rsc/';
        },
        getFullPath = function(path) {
        	if ( path === undefined ) path = '';
        	else path = path + '/';
            return app.path + '/tpl/' + path;
        },
        getFontsPath = function() {
        	return app.path + '/fonts/';
        },
        getWebFontsPath = function() {
        	return app.path + '/webfonts/';
        },
        getIconsPath = function() {
        	return app.path + '/icons/';
        },
        getWebIconsPath = function() {
        	return app.path + '/webicons/';
        },
        getAppConfig = function() {
            var ret = {
                name: app.name,
                liveReloadHost: app.liveReloadHost,
                cssFiles: {
                    'screen': grunt.file.expand({
                        filter: 'isFile',
                        cwd: getFullPath()
                    }, app.cssPath),
                    'print': grunt.file.expand({
                        filter: 'isFile',
                        cwd: getFullPath()
                    }, app.cssPrintPath)
                },
                jsFiles: [
                	app.jsMin
                ]
            };

            if ( ['build_deploy','deploy'].indexOf(app.command) > -1 ) {
                ret.liveReloadHost = false;
                ret.cssFiles = {
                    'screen': [app.cssMin],
                    'print': [app.cssPrintMin]
                };
                ret.jsFiles = [app.jsMin];
            }

            if ( grunt.file.exists( app.path + '/data.json' ) )
                ret.data = grunt.file.readJSON( app.path + '/data.json' );

            return ret;
        },
        setAppConfig = function(command, config) {
            // Initialize with required data for extension
            app.path = 'app/' + config.name;

            // Extend with app configuration
            if ( grunt.file.exists( app.path + '/config.json' ) )
                app = extend( app, grunt.file.readJSON( app.path + '/config.json' ) );

            // Continue setting our core app data
            app.command = command;
            app.name = config.name;
            app.cssMin = 'css/' + config.name + '.min.css';
            app.cssPath = 'css/**/*.css';
            app.cssMapPath = 'css/**/*.map';
            app.scssPath = 'scss/screen.scss';
            app.cssPrintMin = 'css/' + config.name + '.min.print.css';
            app.cssPrintPath = 'css-print/**/*.css';
            app.cssPrintMapPath = 'css-print/**/*.map';
            app.scssPrintPath = 'scss/print.scss';
            app.jsMin = 'js/' + config.name + '.min.js';
            app.jsPath = 'js/**/*.js';
            app.cssConfigFiles = {}
            app.cssConfigFiles[app.wwwPath + app.cssMin] = [ getFullPath() + app.cssPath ];
            app.cssConfigFiles[app.wwwPath + app.cssPrintMin] = [ getFullPath() + app.cssPrintPath ];
            app.scssConfigFiles = {}
            app.scssConfigFiles[ getFullPath('css') + '99_' + app.name + '.css' ] = [ getFullPath() + app.scssPath ];
            app.scssConfigFiles[ getFullPath('css-print') + '99_' + app.name + '.css' ] = [ getFullPath() + app.scssPrintPath ];
            app.jsExternalLibraries = [
            	'bower_components/bootstrap-sass-official/assets/javascripts/bootstrap.js'
            ];
            app.jsConfigFiles = {}
            app.jsConfigFiles[ app.wwwPath + app.jsMin ] = app.jsExternalLibraries.concat( [ getFullPath() + app.jsPath ] );
            app.fontConfigFiles = {}
            app.fontConfigFiles[ getWebFontsPath() ] = [
            	getFontsPath() + '*.otf',
				getFontsPath() + '*.ttf'
            ];
            app.webFontConfigFiles = {};
            app.webFontConfigFiles[ getFullPath('css') + '98_webfonts.css' ] = [
            	getWebFontsPath() + '*.css'
            ];
            app.webFontConfigFiles[ getFullPath('css-print') + '98_webfonts.css' ] = [
            	getWebFontsPath() + '*.css'
            ];
            app.iconsConfigFiles = {}
            app.iconsConfigFiles[ getWebIconsPath() ] = [
            	getIconsPath() + '*.svg'
            ];

            // Configure the tasks
            grunt.initConfig({
                pkg: grunt.file.readJSON('package.json'),
                clean: {
                    options: {
                        force: true
                    },
                    www: [
                        app.wwwPath + '*',
                        getFullPath('scss') + '_' + app.name + '-icons.scss'
                    ],
                    mapFiles: [
                    	getFullPath('css') + '/*.map',
                        getFullPath('css-print') + '/*.map',
                    ],
                    webfonts: [
                    	getWebFontsPath()
                    ],
                    webicons: [
                    	getWebIconsPath()
                    ]
                },
                tasty_swig: {
                	options: {
                		context: {
                			app: getAppConfig()
                		}
                	},
                	build: {
						src: [ getFullPath() + '*.swig' ],
						dest: app.wwwPath
					}
                },
				sass: {
					build: {
						files: app.scssConfigFiles
					},
					deploy: {
						files: app.scssConfigFiles
					},
				},
				fontgen: {
					build: {
						options: {
							path_prefix: '../fonts/'
						},
						files: app.fontConfigFiles
					}
				},
				webfont: {
					icons: {
						src: getIconsPath() + '*.svg',
						dest: getWebIconsPath(),
						options: {
                            relativeFontPath: '../fonts/',
							font: app.name + '-icons',
                            stylesheet: 'scss',
                            templateOptions: {
                                baseClass: app.name + '-icon',
                                classPrefix: app.name + '-icon-',
                                mixinPrefix: app.name + '-icon-'
                            }
						}
					}
				},
                concat: {
                	webfonts: {
                		files: app.webFontConfigFiles
                	},
                    css: {
                        filter: 'isFile',
                        src: getFullPath( app.cssPath ),
                        dest: app.wwwPath + app.cssMin
                    },
                    cssPrint: {
                        filter: 'isFile',
                        src: getFullPath( app.cssPrintPath ),
                        dest: app.wwwPath + app.cssPrintMin
                    },
                    js: {
                    	files: app.jsConfigFiles
                    }
                },
                autoprefixer: {
                    options: {
                        browsers: ['last 3 versions', 'bb 10', 'android 3']
                    },
                    build: {
                        src: app.wwwPath + 'css/*'
                    },
                },
                cssmin: {
                    build: {
                        files: app.cssConfigFiles
                    }
                },
                closurecompiler: {
                    build: {
                    	files: app.jsConfigFiles,
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
	                            cwd: getFullPath(),
	                            src: [
	                                app.cssPath,
	                                app.cssPrintPath,
	                                app.cssMapPath,
	                                app.cssPrintMapPath,
	                                app.jsPath
	                            ],
	                            dest: app.wwwPath
	                        },
                            {
                                expand: true,
                                cwd: getWebIconsPath(),
                                src: [
                                    '*.scss'
                                ],
                                dest: getFullPath('scss')
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
                        		dest: app.wwwPath + '/fonts/'
                        	},
                        	// The project Webfonts
                        	{
                        		expand: true,
                        		flatten: true,
                        		cwd: getWebFontsPath(),
                        		src: ['**/*.{ttf,woff,eot,svg,otf}'],
                        		dest: app.wwwPath + '/fonts/'
                        	},
                        	// The project Webicons
                        	{
                        		expand: true,
                        		flatten: true,
                        		cwd: getWebIconsPath(),
                        		src: ['**/*.{ttf,woff,eot,svg,otf}'],
                        		dest: app.wwwPath + '/fonts/'
                        	},
                        	// Webicons sass generated file
                        	{
                                expand: true,
                                cwd: getWebIconsPath(),
                                src: [
                                    '*.scss'
                                ],
                                dest: getFullPath('scss')
                            },
                        	// The project resource files
	                        {
	                            expand: true,
	                            cwd: getResourcePath(),
	                            src: ['**'],
	                            dest: app.wwwPath
	                        }
                        ]
                    },
                    make: {
                        files: [{
                            expand: true,
                            cwd: '_apptpl/',
                            src: ['**'],
                            dest: app.path
                        }]
                    }
                },
                watch: {
                    html: {
                        options: {
                            livereload: app.liveReloadPort
                        },
                        files: [
                            getFullPath() + '**/*.swig',
                            app.path + '/data.json'
                        ],
                        tasks: [
                        	'rebuild:' + app.name + ':html'
                        ]
                    },
                    css: {
                        options: {
                            livereload: app.liveReloadPort
                        },
                        files: [
                            getFullPath() + '**/*.scss',
                        ],
                        tasks: [
                            'rebuild:' + app.name + ':css'
                        ]
                    },
                    js: {
                        options: {
                            livereload: app.liveReloadPort
                        },
                        files: [
                            getFullPath() + '**/*.js'
                        ],
                        tasks: [
                            'rebuild:' + app.name + ':js'
                        ]
                    }
                },
                rsync: {
                    options: {
                        recursive: true
                    },
                    deploy: {
                        options: {
                            src: app.wwwPath,
                            dest: app.deployPath,
                            host: app.deployHost
                        }
                    }
                }
            });
        };

    // Load Tasks
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-yui-compressor');
    grunt.loadNpmTasks('grunt-closurecompiler');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-tasty-swig');
    grunt.loadNpmTasks('grunt-autoprefixer');
    grunt.loadNpmTasks('grunt-rsync');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-fontgen');
    grunt.loadNpmTasks('grunt-webfont');

    grunt.registerTask('default', 'Gruntfile for Mockups', function() {
        grunt.warn('No project name specified.\n\nAvailable commands:\n"build:project_name"\n"deploy:project_name"\n"make:project_name"\n');
    });

    grunt.registerTask('build', 'Build a mockup and watch for file modifications', function ( name ) {
        if (appExists(name)) {
            setAppConfig(this.name, {
                name: name
            });
            grunt.task.run([
                'rebuild:' + name,
                'watch'
            ]);
        } else
            grunt.warn('[' + name + '] does not exist. Have you typed it correctly?\n');
    });

    grunt.registerTask('watchbuild', 'Build a mockup without regenerating fonts and icons', function ( name ) {
        if (appExists(name)) {
            setAppConfig(this.name, {
                name: name
            });
            grunt.task.run([
                'clean',
                'concat:webfonts',
                'copy:build',
                'sass:build',
                'concat:js',
                'tasty_swig',
                'copy:deploy',
                'clean:mapFiles',
                'clean:webfonts',
                'clean:webicons'
            ]);
        } else
            grunt.warn('[' + name + '] does not exist. Have you typed it correctly?\n');
    });

    grunt.registerTask('rebuild', 'Build a mockup without watching for file modifications', function ( name, watchTask ) {
        if (appExists(name)) {
            var tasks = [];
            if ( watchTask === undefined ) watchTask = 'all';

            if ( watchTask == 'all' ) {
                tasks = tasks.concat([
                    'clean',
                    'fontgen',
                    'webfont',
                    'concat:webfonts',
                    'copy:build',
                    'sass:build',
                    'concat:js',
                    'tasty_swig',
                    'copy:deploy',
                    'clean:mapFiles',
                    'clean:webfonts',
                    'clean:webicons'
                ]);
            } else if ( watchTask == 'html' ) {
                tasks = tasks.concat([
                    'tasty_swig',
                    'copy:deploy',
                    'copy:build'
                ]);
            } else if ( watchTask == 'css' ) {
                tasks = tasks.concat([
                    'sass:build',
                    'copy:deploy',
                    'copy:build'
                ]);
            } else if ( watchTask == 'js' ) {
                tasks = tasks.concat([
                    'concat:js',
                    'copy:deploy',
                    'copy:build'
                ]);
            }

            setAppConfig(this.name, {
                name: name
            });
            grunt.task.run(tasks);
        } else
            grunt.warn('[' + name + '] does not exist. Have you typed it correctly?\n');
    });

    grunt.registerTask('build_deploy', 'Build a mockup ready for deployment sync', function ( name ) {
        if (appExists(name)) {
            setAppConfig(this.name, {
                name: name
            });
            grunt.task.run([
                'clean',
                'fontgen',
                'webfont',
                'concat:webfonts',
                'copy:deploy',
                'sass:deploy',
                'concat:css',
                'concat:cssPrint',
                'autoprefixer',
                'cssmin',
                'closurecompiler',
                'tasty_swig',
                'clean:mapFiles',
                'clean:webfonts',
                'clean:webicons'
            ]);
        } else
            grunt.warn('[' + name + '] does not exist. Have you typed it correctly?\n');
    });

    grunt.registerTask('deploy', 'Deploy a mockup to the Mockups Server', function ( name ) {
    	if (appExists(name)) {
            setAppConfig(this.name, {
                name: name
            });
            grunt.task.run([
                'build_deploy:' + name,
                'rsync:deploy'
            ]);
        } else
            grunt.warn('[' + name + '] does not exist. Have you typed it correctly?\n');
    });

    grunt.registerTask('make', 'Create a new mockup folder based on a template', function ( name ) {
        if (!appExists(name)) {
            setAppConfig(this.name, {
                name: name
            });
            grunt.task.run([
                'copy:make'
            ]);
        } else
            grunt.warn('[' + name + '] already exists. Please use another name.\n');
    });
};
