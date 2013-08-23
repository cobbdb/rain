module.exports = function (grunt) {
    grunt.initConfig({
        jshint: {
            options: {
                curly: true,
                eqeqeq: false,
                indent: 4,
                noarg: true,
                nonew: false,
                plusplus: true,
                quotmark: false,
                trailing: true
            },
            default: {
                src: ['./private/js/*.js']
            }
        },
        uglify: {
            options: {
                mangle: {
                    except: [
                        '$scope',
                        '$index',
                        '$event'
                    ]
                }
            },
            default: {
                src: ['./private/js/*.js'],
                dest: './res/rain.min.js'
            }
        },
        cssmin: {
            default: {
                src: ['./private/css/*.css'],
                dest: './res/rain.min.css'
            }
        },
        watch: {
            scripts: {
                files: [
                    './private/js/*.js'
                ],
                tasks: [
                    'jshint',
                    'uglify'
                ]
            },
            styles: {
                files: [
                    './private/css/*.css'
                ],
                tasks: ['cssmin']
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-cssmin');

    grunt.registerTask('deploy', [
        'jshint',
        'uglify',
        'cssmin'
    ]);
};
