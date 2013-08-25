module.exports = function (grunt) {
    grunt.initConfig({
        htmlmin: {
            options: {
                removeComments: true,
                collapseWhitespace: true,
                collapseBooleanAttributes: true,
                removeRedundantAttributes: true,
                removeEmptyAttributes: true
            },
            default: {
                src: ['index.html'],
                dest: ['index.html']
            }
        }
    });
    
    grunt.registerTask('default', [
        'htmlmin'
    ]);

    grunt.loadNpmTasks('grunt-contrib-htmlmin');
};
