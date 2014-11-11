(function () {
   'use strict';
   // this function is strict...
}());


var exec = require('child_process').exec;
var util = require('util');

var env = process.env.NODE_ENV || 'test';

module.exports = function(grunt) {
    require('load-grunt-tasks')(grunt);

    var ec2Config =  util.format('config/ec2.%s.json', env);

    // Project configuration.
    grunt.initConfig({
        pkg:  grunt.file.readJSON('package.json'),

        concat: {
            options: {
                // define a string to put between each file in the concatenated output
                separator: ';'
            },
            dist: {
                // the files to concatenate
                src: ['public/js/!(home).js'],
                // the location of the resulting JS file
                dest: 'dist/<%= pkg.name %>.js'
            }
        },
        uglify: {
            options: {
                // the banner is inserted at the top of the output
                banner: '/*! <%= pkg.name %> <%= grunt.template.today(\'dd-mm-yyyy\') %> */\n'
            },
            dist: {
                files: {
                    'dist/<%= pkg.name %>.min.js': ['dist/<%= pkg.name %>.js']
                }
            }
        },
        jshint: {
            options: {
                jshintrc: '.jshintrc'
            },
            files: {
                src: ['lib/**/*.js', './*.js']
            }
        },
        // Copies remaining files to places other tasks can use
        copy: {
            dist: {
                files: [{
                    expand: true,
                    cwd: './',
                    dest: './dist',
                    src: [
                        'package.json',
                        'app.js',
                        'config/*',
                        'routes.js',
                        'lib/**'
                    ]
                }]
            }
        },
        clean: ['dist'],
        ec2: ec2Config
    });

    require('pkginfo')(module);

    grunt.registerTask('npm', 'npm install', function() {

        var done = this.async();


        exec('npm install --production --prefix ./dist/', function (error) {
            if (error) {
                return grunt.fatal(error);
            }

            done();
        });
    });

    grunt.registerTask('test', 'run tests via mocha"', function() {
        var done = this.async();

        // cleanup dist and package
        exec('./node_modules/mocha/bin/mocha test/*.js --reporter spec', function (error) {
            if (error){
                return grunt.fatal(error);
            }

            done();

        });
    });

    grunt.registerTask('build', ['clean', 'copy', 'npm']);
};