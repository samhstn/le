module.exports = (config) => {
  config.set({
    basePath: '',
    frameworks: [ 'mocha', 'riot' ],
    plugins: [
      'karma-mocha',
      'karma-mocha-reporter',
      'karma-phantomjs-launcher',
      'karma-riot'
    ],
    files: [
      'node_modules/expect.js/index.js',
      'public/helpers/*.js',
      'tags/**/*.tag',
      'test/riot/**/*.js'
    ],
    preprocessors: {
      '**/*.tag': [ 'riot' ]
    },
    reporters: [ 'mocha' ],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: false,
    browsers: [ 'PhantomJS' ],
    singleRun: true
  });
};
