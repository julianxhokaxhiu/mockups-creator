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
      cssMin: 'Resources/Public/css/<%= pkg.name %>.min.css',
      cssPrintMin: 'Resources/Public/css/<%= pkg.name %>.min.print.css',
      jsMin: 'Resources/Public/js/<%= pkg.name %>.min.js',
      clean: {
        options: {
          force: true
        },
        output: [
          'Resources/Temp',
          'Resources/Public',
          'Resources/Private/Scss/_<%= pkg.name %>-icons.scss'
        ],
        cssFiles: [
          'Resources/Public/css/*'
        ],
        temp: [
          'Resources/Temp'
        ]
      },
  		sass: {
        options: {
          style: 'compressed',
          loadPath: '.'
        },
  			build: {
  				files: {
  					'Resources/Temp/css/99_<%= pkg.name %>.css' : [ 'Resources/Private/Scss/screen.scss' ],
  					'Resources/Temp/css-print/99_<%= pkg.name %>.css' : [ 'Resources/Private/Scss/print.scss' ]
  				}
  			}
  		},
  		fontgen: {
  			build: {
  				options: {
  					path_prefix: '../fonts/'
  				},
  				files: {
  					'Resources/Temp/webfonts/' : [
            	'Resources/Private/Fonts/*.otf',
    					'Resources/Private/Fonts/*.ttf'
            ]
  				}
  			}
  		},
  		webfont: {
  			icons: {
  				src: 'Resources/Private/Icons/*.svg',
  				dest: 'Resources/Temp/webicons/',
          destCss: 'Resources/Private/Scss/',
  				options: {
    				template: 'Resources/Private/icons.css',
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
      			'Resources/Temp/css/98_webfonts.css' : [ 'Resources/Temp/webfonts/*.css' ],
      			'Resources/Temp/css-print/98_webfonts.css' : [ 'Resources/Temp/webfonts/*.css' ]
      		}
      	},
        css: {
            filter: 'isFile',
            src: 'Resources/Temp/css/**/*.css',
            dest: '<%= cssMin %>'
        },
        cssPrint: {
            filter: 'isFile',
            src: 'Resources/Temp/css-print/**/*.css',
            dest: '<%= cssPrintMin %>'
        },
        js: {
        	files: {
        		'<%= jsMin %>' : [
              '<%= app.assets.js %>',
              'Resources/Private/JavaScript/**/*.js'
            ]
        	}
        }
      },
      autoprefixer: {
        options: {
          browsers: [
            "Android 2.3",
            "Android >= 4",
            "Chrome >= 20",
            "Firefox >= 24",
            "Explorer >= 8",
            "iOS >= 6",
            "Opera >= 12",
            "Safari >= 6"
          ]
        },
        build: {
        	options: {
        		map: true
        	},
          src: 'Resources/Public/css/*.css'
        },
        deploy: {
          options: {
            map: false
          },
          src: 'Resources/Public/css/*.css'
        }
      },
      cssmin: {
          build: {
              files: {
              	'<%= cssMin %>' : [ '<%= cssMin %>' ],
              	'<%= cssPrintMin %>' : [ '<%= cssPrintMin %>' ]
              }
          }
      },
      closurecompiler: {
          build: {
          	files: {
          		'<%= jsMin %>': [
                '<%= app.assets.js %>',
                'Resources/Private/JavaScript/**/*.js'
              ]
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
          deploy: {
              files: [
                // Internal Misc files
                {
                  expand: true,
                  cwd: 'Resources/Private/Misc/',
                  src: [ '**/*' ],
                  dest: 'Resources/Public/'
                },
              	// External Packages Fonts
              	{
              		expand: true,
              		flatten: true,
              		src: '<%= app.assets.fonts %>',
              		dest: 'Resources/Public/fonts/'
              	},
              	// The project Webfonts
              	{
              		expand: true,
              		flatten: true,
              		cwd: 'Resources/Temp/webfonts/',
              		src: ['**/*.{ttf,woff,eot,svg,otf}'],
              		dest: 'Resources/Public/fonts/'
              	},
              	// The project Webicons
              	{
              		expand: true,
              		flatten: true,
              		cwd: 'Resources/Temp/webicons/',
              		src: ['**/*.{ttf,woff,eot,svg,otf}'],
              		dest: 'Resources/Public/fonts/'
              	},
              	// Webicons sass generated file
              	{
                  expand: true,
                  cwd: 'Resources/Temp/webicons/',
                  src: [
                    '*.scss'
                  ],
                  dest: 'Resources/Private/Scss/'
                },
                // Images
                {
                  expand: true,
                  cwd: 'Resources/Private/Images/',
                  src: '**/*',
                  dest: 'Resources/Public/img/'
                }
              ]
          }
      },
      watch: {
      	options: {
      		livereload: -1
      	},
          css: {
              files: [
                  'Resources/Private/**/*.scss',
              ],
              tasks: [
                  'rebuild:css'
              ]
          },
          js: {
              files: [
                  'Resources/Private/**/*.js'
              ],
              tasks: [
                  'rebuild:js'
              ]
          }
      },
      exec: {
          npm_update: {
              cmd: 'npm update'
          },
          bower_update: {
              cmd: 'bower update'
          },
          npm_install: {
              cmd: 'npm install'
          },
          bower_install: {
              cmd: 'bower install'
          }
      },
      periodic: {
          update: {
              when: 'daily',
              tasks: [
                  'exec:npm_update',
                  'exec:bower_update'
              ]
          },
          npm_install: {
              when: 'newer',
              tasks: [
                  'exec:npm_install',
                  'exec:npm_update'
              ],
              files: [{
                  src: [ 'package.json' ]
              }]
          },
          bower_install: {
              when: 'newer',
              tasks: [
                  'exec:bower_install',
                  'exec:bower_update'
              ],
              files: [{
                  src: [ 'bower.json' ]
              }]
          }
      }
    });

    grunt.registerTask('default', 'Gruntfile for Mockups', function() {
      grunt.warn('No task name specified.\n\nAvailable tasks: build, deploy"\n\n');
    });

    grunt.registerTask('build', 'Build a mockup and watch for file modifications', [
  		'rebuild',
  		'watch'
    ]);

    grunt.registerTask('rebuild', 'Build a mockup without watching for file modifications', function ( watchTask ) {
      var tasks = [];

      if ( watchTask === undefined ) watchTask = 'all';

      if ( watchTask == 'all' ) {
          tasks = tasks.concat([
            'periodic',
            'clean',
            'fontgen',
            'webfont',
            'copy',
            'concat:webfonts',
            'sass',
            'concat:css',
            'concat:cssPrint',
            'concat:js',
            'autoprefixer:build',
            'clean:temp'
          ]);
      } else if ( watchTask == 'css' ) {
          tasks = tasks.concat([
            'clean:cssFiles',
            'sass',
            'concat:css',
            'concat:cssPrint',
            'autoprefixer:build'
          ]);
      } else if ( watchTask == 'js' ) {
          tasks = tasks.concat([
            'concat:js'
          ]);
      }
      grunt.task.run(tasks);
    });

    grunt.registerTask('build_deploy', 'Build a mockup ready for deployment sync', [
    	'clean',
      'fontgen',
      'webfont',
      'copy',
      'concat:webfonts',
      'sass',
      'concat:css',
      'concat:cssPrint',
      'cssmin',
      'autoprefixer:deploy',
      'closurecompiler',
      'clean:temp'
    ]);

    grunt.registerTask('deploy', 'Deploy a mockup to the Mockups Server', [
		  'build_deploy'
    ]);
};
