require('babel-polyfill');

const context = require.context('./tests', false, /\.js$/);
context.keys().forEach(context);

module.exports = context;
