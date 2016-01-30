module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    concat: {
      dist: {
        src: [
          'lib/melonJS-<%= pkg.version %>.js',
          'lib/plugins/*.js',
          'js/game.js',
          'build/js/resources.js',
          'js/**/*.js',
        ],
        dest: 'server/public/js/app.js'
      }
    },

    copy: {
      dist: {
        files: [{
          src: 'index.css',
          dest: 'server/public/index.css'
        },{
          src: 'main.js',
          dest: 'server/public/main.js'
        },{
          src: 'manifest.json',
          dest: 'server/public/manifest.json'
        },{
          src: 'package.json',
          dest: 'server/public/package.json'
        },{
          src: 'data/**/*',
          dest: 'server/public/',
          expand: true
        },{
          src: 'icons/*',
          dest: 'server/public/',
          expand: true
        }]
      }
    },

    clean: {
      app: ['server/public/js/app.js'],
      dist: ['server/public/','bin/'],
    },

    processhtml: {
      dist: {
        options: {
          process: true,
          data: {
            title: '<%= pkg.name %>',
          }
        },
        files: {
          'server/public/index.html': ['index.html']
        }
      }
    },

    replace : {
      dist : {
        options : {
          usePrefix : false,
          force : true,
          patterns : [
            {
              match : /this\._super\(\s*([\w\.]+)\s*,\s*["'](\w+)["']\s*(,\s*)?/g,
              replacement : '$1.prototype.$2.apply(this$3'
            },
          ],
        },
        files : [
          {
            src : [ 'server/public/js/app.js' ],
            dest : 'server/public/js/app.js'
          }
        ]
      },
    },

    uglify: {
      options: {
        report: 'min',
        preserveComments: 'some'
      },
      dist: {
        files: {
          'server/public/js/app.min.js': [
            'server/public/js/app.js'
          ]
        }
      }
    },

    connect: {
      server: {
        options: {
          port: 8000,
          keepalive: false
        }
      }
    },

    

    resources: {
      dist: {
        options: {
          dest: 'build/js/resources.js',
          varname: 'game.resources',
        },
        files: [{
          src: ['data/bgm/**/*', 'data/sfx/**/*'],
          type: 'audio'
        },{
          src: ['data/img/**/*.png'],
          type: 'image'
        },{
          src: ['data/img/**/*.json'],
          type: 'json'
        },{
          src: ['data/map/**/*.tmx', 'data/map/**/*.json'],
          type: 'tmx'
        },{
          src: ['data/map/**/*.tsx'],
          type: 'tsx'
        }]
      }
    },

    watch: {
      resources: {
        files: ['data/**/*'],
        tasks: ['resources'],
        options: {
          spawn: false,
        },
      },
    },

  });

  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-processhtml');
  grunt.loadNpmTasks("grunt-replace");
  grunt.loadNpmTasks('grunt-contrib-connect');
 // grunt.loadNpmTasks('grunt-download-electron');
  //grunt.loadNpmTasks('grunt-asar');

  // Custom Tasks
  grunt.loadTasks('tasks');

  grunt.registerTask('default', [
    'resources',
    'concat',
    'replace',
    'uglify',
    'copy',
    'processhtml',
    'clean:app',
  ]);
  grunt.registerTask('dist', ['default']);
  grunt.registerTask('serve', ['resources', 'connect', 'watch']);
}
