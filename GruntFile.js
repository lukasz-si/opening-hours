/*global module:false*/
module.exports = function (grunt) {
    var fs = require('fs-sync'),
        baseUrl = "src",
        paths = {
            "jquery": "../bower_components/jquery/dist/jquery"
        };
    // Project configuration.
    grunt.initConfig({
        // Metadata.
        pkg: grunt.file.readJSON('bower.json'),
        banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
            '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
            '<%= pkg.homepage ? "* see: " + pkg.homepage + "\\n" : "" %>' +
            '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.authors.join(", ") %>\n' +
            '* Licensed: <%= pkg.license.type %> */\n',
        // Task configuration.
        concat: {
            options: {
                banner: '<%= banner %>',
                stripBanners: true
            },
            dist: {
                src: ['dist/<%= pkg.name %>.js'],
                dest: 'dist/<%= pkg.name %>.js'
            }
        },
        requirejs: {
            compile: {
                options: {
                    baseUrl: baseUrl,
                    paths: paths,
                    // build file destination, relative to the build file itself
                    out: function (text, sourceMapText) {
                        var configFile = grunt.file.readJSON('bower.json'),
                            version = configFile.version,
                            newDirectory = "dist/" + version,
                            appendVersion = false;

                        if (!fs.exists(newDirectory)) {
                            fs.mkdir(newDirectory);
                            appendVersion = true;
                        }

                        fs.write("dist/opening-hours.js", text);
                        fs.copy("dist/opening-hours.js", newDirectory + "/opening-hours.js", {force: true});

                        fs.copy("src/styles/opening-hours.css", newDirectory + "/opening-hours.css", {force: true});
                        fs.copy("src/styles/opening-hours.css", "dist/opening-hours.css", {force: true});

                        if (appendVersion) {
                            var file = fs.read('dist/versions.txt'),
                                versions = file.split('\n'),
                                output = "",
                                alreadyinList = false,
                                i;

                            versions.splice(versions.length - 1, 1);

                            for (i = 0; i < versions.length; i++) {
                                if (versions[i] === version) {
                                    alreadyinList = true;
                                    break;
                                }
                            }
                            if (!alreadyinList) {
                                versions.push(version);
                            }

                            for (i = 0; i < versions.length; i++) {
                                output += versions[i] + '\n';
                            }

                            fs.write('dist/versions.txt', output);
                        }
                    },
                    // specify custom module name paths
                    // target amd loader shim as the main module, path is relative to baseUrl.
                    name: "../tools/almond",

                    optimize: "none",

                    // files to include along with almond. only main file is defined, as
                    // it pulls in the rest of the dependencies automatically.
                    include: ["js/OpeningHours"],
                    exclude: ["jquery"],

                    // code to wrap around the start / end of the resulting build file
                    // the global variable used to expose the API is defined here
                    wrap: {
                        startFile: "startLib.js",
                        endFile: "endLib.js"
                    }
                }

            }
        },
        sass: {
            options: {
                sourceMap: false,
                outputStyle: "compressed" // nested | compressed
            },
            dist: {
                files: {
                    'src/styles/opening-hours.css': 'src/styles/sass/opening-hours.scss'
                }
            }
        },
        watch: {
            scss: {
                files: ['src/styles/sass/*.scss'],
                tasks: ['sass']
            }
        },
        jasmine: {
            coverage: {
                src: "src/js/**/*.js",
                options: {
                    specs: 'test/unit/**/*Test.js',
                    template: require('grunt-template-jasmine-istanbul'),
                    templateOptions: {
                        coverage: 'test/code-coverage/coverage.json',
                        report: [
                            {
                                type: 'html',
                                options: {
                                    dir: 'test/code-coverage/html'
                                }
                            },
                            {
                                type: 'text',
                                options: {
                                    file: 'test/code-coverage/summary/summary.txt'
                                }
                            },
                            {
                                type: 'text'
                            }
                        ],
                        template: require('grunt-template-jasmine-requirejs'),
                        templateOptions: {
                            requireConfig: {
                                baseUrl: ".grunt/grunt-contrib-jasmine/" + baseUrl,
                                paths: {
                                    "jquery": "../../../bower_components/jquery/dist/jquery"
                                }
                            }
                        }
                    }
                }
            }
        },
        uglify: {
            options: {
                banner: '<%= banner %>'
            },
            dist: {
                src: 'dist/<%= pkg.name %>.js',
                dest: 'dist/<%= pkg.name %>.min.js'
            }
        },
        jsdoc: {
            dist: {
                src: ['src/**/*.js', 'README.md'],
                options: {
//                    tutorials: "tutorials/",
                    private: false,
                    destination: 'doc',
                    template: "node_modules/ink-docstrap/template",
                    config: "jsdoc.conf.json"
                }
            }
        }
    });

    // These plugins provide necessary tasks.
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-jsdoc');
    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.loadNpmTasks('grunt-sass');
    grunt.loadNpmTasks('grunt-contrib-jasmine');
    grunt.loadNpmTasks('grunt-contrib-watch');

    // Default task.
    grunt.registerTask('default', ['sass', 'jasmine:coverage', 'requirejs', 'concat', 'uglify']);

    grunt.registerTask('doc', ['jsdoc']);
    grunt.registerTask('test', ['jasmine:coverage']);
};
