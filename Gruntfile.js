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

	grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        appName: grunt.option('app'),
        run_grunt: {
            app: {
                options: {
                    task: '<%= grunt.option("customtask") || grunt.cli.tasks %>'
                },
                src: 'app/<%= appName %>/Gruntfile.js'
            }
        },
        copy: {
            create: {
                files: [{
                    expand: true,
                    cwd: '_apptpl/',
                    src: ['**'],
                    dest: 'app/<%= appName %>'
                }]
            }
        },
        template: {
            app: {
                options: {
                    data: {
                        appName: '<%= appName %>'
                    }
                },
                files: {
                    'app/<%= appName %>/package.json': [ 'app/<%= appName %>/package.json' ]
                }
            }
        },
        exec: {
            npm: {
                cmd: 'npm install',
                cwd: 'app/<%= appName %>'
            },
            bower: {
                cmd: 'bower install',
                cwd: 'app/<%= appName %>'
            }
        }
    });

    // Load Tasks
    require('load-grunt-tasks')(grunt);

    grunt.registerTask('default', 'Gruntfile for Mockups', function() {
    	if ( grunt.option('app') === undefined )
        	grunt.warn('No app name specified.\n\nAvailable tasks: build, deploy, make, server\nAvailable arguments: --app=APPNAME --customtask=TASKNAME\n\n');
       	else
       		grunt.task.run('run_grunt');
    });

    grunt.registerTask('server', [
        'run_grunt'
    ]);

    grunt.registerTask('build'[
        'run_grunt'
    ]);

    grunt.registerTask('rebuild', [
        'run_grunt'
    ]);

    grunt.registerTask('build_deploy', [
        'run_grunt'
    ]);

    grunt.registerTask('deploy', [
        'run_grunt'
    ]);

    grunt.registerTask('make', [
        'copy',
        'template',
        'exec'
    ]);
};
