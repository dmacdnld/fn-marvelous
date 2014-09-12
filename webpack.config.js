module.exports = {
  entry: "./public/js/src/fn_v5.js",
  output: {
    path: __dirname + "/public/js/dist",
    filename: "fn.js"
  },
  module: {
    loaders: [
      { test: /\.handlebars$/, loader: 'handlebars-loader' }
    ]
  }
};