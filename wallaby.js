const path = require('path');
const fs = require('fs');

process.env.BABEL_ENV = 'test';
process.env.NODE_ENV = 'production';

module.exports = function (wallaby) {
  process.env.NODE_PATH += path.delimiter +
    path.join(wallaby.localProjectDir, 'src', 'node_modules');

  const babelConfig = JSON.parse(fs.readFileSync('./src/.babelrc', 'utf8'));
  babelConfig.babel = require('./src/node_modules/babel-core');
  babelConfig.presets.push(babelConfig.env.test.presets.shift());
  const babelCompiler = wallaby.compilers.babel(babelConfig);

  return {
    files: [
      'src/server/**/*.js',
      '!src/server/**/*.tests.js',
    ],
    tests: [
      'src/server/**/*.tests.js',
    ],
    compilers: {
      '**/*.js': babelCompiler,
    },
    env: {
      type: 'node',
      params: {
        env: [
          'DEBUG=*,-mocha:*',
          'NODE_ENV=production',
        ].join(';'),
      },
    },
    debug: 1,
    testFramework: 'ava',

    setup: () => {
      console.debug = console.log;

      require('babel-polyfill');

      var debug = require('debug');
      debug.log = console.info.bind(console);
    },
  };
};