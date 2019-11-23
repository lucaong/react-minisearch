const path = require('path');

module.exports = {
  entry: './src/react-minisearch.tsx',
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.(js|jsx|tsx|ts)$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-typescript', '@babel/preset-react'],
            plugins: ['@babel/plugin-proposal-object-rest-spread']
          }
        }
      }
    ],
  },
  resolve: {
    extensions: [ '.tsx', '.ts', '.js', '.jsx' ],
  },
  optimization: {
    minimize: false
  },
  output: {
    filename: 'react-minisearch.js',
    libraryTarget: 'umd',
    globalObject: 'typeof self !== \'undefined\' ? self : this',
    path: path.resolve(__dirname, 'dist'),
    library: {
      amd: 'react-minisearch',
      commonjs: 'react-minisearch',
      root: 'ReactMiniSearch'
    }
  },
  externals: {
    react: {
      commonjs: 'react',
      commonjs2: 'react',
      amd: 'react',
      root: 'React'
    },
    'react-dom': {
      commonjs: 'react-dom',
      commonjs2: 'react-dom',
      amd: 'react-dom',
      root: 'ReactDOM'
    },
    minisearch: {
      commonjs: 'minisearch',
      commonjs2: 'minisearch',
      amd: 'minisearch',
      root: 'MiniSearch'
    }
  }
}
