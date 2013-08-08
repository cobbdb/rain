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
                src: ['./res/js/*.js']
            }
        },
        uglify: {
            options: {
                mangle: {
                    except: [
                        '_',
                        '$',
                        '$scope',
                        '$index',
                        '$event'
                    ]
                }
            },
            default: {
                src: ['./res/js/*.js'],
                dest: './res/rain.min.js'
            }
        },
        watch: {
            files: [
                './res/js/*.js',
            ],
            tasks: [
                'jshint',
                'uglify'
            ]
        }
    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('deploy', [
        'jshint',
        'uglify',
    ]);
};
