module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: {
            my_target_1: { 
                files: {
                    'dist/blend.js': ['src/*.js'],
                    'dist/blendCompile.js': ['src/compile/*.js']
                }
            }
        },
        uglify: {
            my_target_1: {
                files: {
                    'dist/blend.min.js': ['dist/blend.js'],
                    'dist/blendCompile.min.js': ['dist/blendCompile.js']
                }
            }
        },
        watch: {
            files: ['src/*.js', 'src/compile/*.js', 'public/*.js', 'public/*.jsf'],
            tasks: ['concat', 'uglify']
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
