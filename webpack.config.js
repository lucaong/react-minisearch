const path = require('path');

module.exports = {
  entry: { 'react-minisearch': './src/react-minisearch.tsx' },
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [ '.tsx', '.ts', '.js' ],
  },
  optimization: {
    minimize: false
  },
  output: {
    filename: '[name].js',
    libraryTarget: 'umd',
    umdNamedDefine: true,
    globalObject: 'typeof self !== \'undefined\' ? self : this',
    path: path.resolve(__dirname, 'dist'),
    library: {
      amd: 'react-minisearch',
      commonjs: 'react-minisearch',
      root: 'react-minisearch'
    },
    libraryExport: 'default'
  },
  externals: {        
    react: {          
        commonjs: 'react',          
        commonjs2: 'react',          
        amd: 'React',          
        root: 'React',      
    },      
    'minisearch': {          
        commonjs: 'minisearch',          
        commonjs2: 'minisearch',          
        amd: 'MiniSearch',          
        root: 'MiniSearch',      
    },  
  }
}
