import typescript from '@rollup/plugin-typescript'
import external from 'rollup-plugin-peer-deps-external'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'

export default {
  input: './src/react-minisearch.tsx',
  plugins: [
    external(),
    resolve(),
    commonjs(),
    typescript()
  ],
  output: {
    name: 'react-minisearch',
    dir: './dist',
    format: 'umd',
    sourcemap: true,
    exports: 'named',
    globals: {
      react: 'React',
      minisearch: 'MiniSearch'
    }
  }
}
