const Path = require('path')

module.exports = {
  entry: {
    javascript: './front/app.js',
    html: './front/index.html'
  },
  output: {
    filename: 'app.js',
    path: Path.join(__dirname, '/front/production')
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loaders: ['react-hot', 'babel']
      },
      {
        test: /\.html$/,
        loader: 'file?name=[name].[ext]'
      },
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader'
      }
    ]
  }
}
