module.exports = function (grunt) {
    grunt.initConfig({
        jshint: {
            options: {
                curly: true,
                eqeqeq: true,
                indent: 4,
                noarg: true,
                nonew: true,
                plusplus: true,
                quotmark: true,
                trailing: true
            },
            default: {
                src: ['./res/js/*.js']
            }
        },
        uglify: {
            default: {
                src: ['./res/js/*.js'],
                dest: './res/rain.min.js'
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    grunt.registerTask('default', [
        'jshint',
        'uglify',
    ]);
};
