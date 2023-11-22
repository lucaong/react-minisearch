import serve from 'rollup-plugin-serve'
import livereload from 'rollup-plugin-livereload'
import babel from '@rollup/plugin-babel'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import replace from '@rollup/plugin-replace'

export default {
  input: './src/index.js',
  plugins: [
    replace({
      'process.env.NODE_ENV': JSON.stringify('development'),
      preventAssignment: true
    }),
    resolve({ extensions: ['.js', '.jsx'] }),
    babel({
      presets: ['@babel/preset-react'],
      babelHelpers: 'bundled'
    }),
    commonjs({ include: [/react-minisearch/] }),
    serve({
      open: true,
      verbose: true,
      contentBase: ['', 'dist'],
      historyApiFallback: true,
      host: 'localhost',
      port: 8080
    }),
    livereload({ watch: 'dist' })
  ],
  output: {
    file: './dist/index.js',
    format: 'iife',
    sourcemap: true
  }
}
