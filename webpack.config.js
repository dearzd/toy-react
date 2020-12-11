module.exports = {
  entry: './main.js',
  mode: 'development',
  optimization: {
    minimize: false
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'/*, '@babel/preset-react'*/],
            plugins: [
              ['@babel/plugin-transform-react-jsx', {pragma: 'ToyReact.createElement'}]
            ]
          }
        }
      }
    ]
  },
  devtool: 'source-map',
  devServer: {
    open: true,
    hot: true,
    port: 3000,
    contentBase: './',
    publicPath: '/dist'
  }
};