module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: {
            my_target_1: { 
                files: {
                    'dist/flu.js': ['src/*.js']
                }
            }
        },
        uglify: {
            my_target_1: {
                files: {
                    'dist/flu.min.js': ['dist/flu.js']
                }
            }
        },
        watch: {
            files: ['src/*.js', 'dist/*.js'],
            tasks: ['concat', 'browserSync', 'uglify']
        },
        browserSync: {
            bsFiles: {
                src: [
                    'public/*.js',
                    'src/*.js'
                ]
            },
            options: {
                watchTask: true,
                server: './'
            }
        }
    });

    // Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-browser-sync');
    grunt.loadNpmTasks('grunt-contrib-uglify-es');

    grunt.registerTask('default', ['concat', 'browserSync', 'watch', 'uglify']);

};
