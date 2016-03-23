module.exports = {
  entry: {
    javascript: './front/app.js',
    html: './front/index.html'
  },
  output: {
    filename: 'app.js',
    path: __dirname.join('/front/production')
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
