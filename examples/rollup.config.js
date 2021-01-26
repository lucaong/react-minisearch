import babel from '@rollup/plugin-babel'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import replace from '@rollup/plugin-replace'

export default {
  input: './src/index.js',
  plugins: [
    replace({
      'process.env.NODE_ENV': JSON.stringify('production')
    }),
    resolve({ extensions: ['.js', '.jsx'] }),
    commonjs({ include: /node_modules/ }),
    babel({
      presets: ['@babel/preset-react'],
      babelHelpers: 'bundled'
    })
  ],
  output: {
    file: './dist/index.js',
    format: 'iife',
    sourcemap: true
  }
}
