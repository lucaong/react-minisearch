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
  output: [
    {
      name: 'react-minisearch',
      file: './dist/umd/react-minisearch.js',
      format: 'umd',
      sourcemap: true,
      exports: 'named',
      globals: {
        react: 'React',
        minisearch: 'MiniSearch'
      }
    },
    {
      file: './dist/esm/react-minisearch.js',
      format: 'es',
      sourcemap: true
    },
    {
      file: './dist/cjs/react-minisearch.cjs',
      format: 'cjs',
      sourcemap: true
    }
  ]
}
