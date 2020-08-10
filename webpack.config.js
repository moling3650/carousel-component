const config = {
  mode: 'development',
  entry: {
    main: './src/main.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
            plugins: [
              ['@babel/plugin-transform-react-jsx', { pragma: 'createElement' }]
            ]
          }
        }
      },
      {
        test: /\.css$/,
        use: require.resolve('./css-loader.js')
      }
    ]
  },
  optimization: {
    minimize: false
  }
};

module.exports = config;