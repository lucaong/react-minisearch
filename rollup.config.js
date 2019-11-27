import typescript from 'rollup-plugin-typescript';

export default {
  input: './src/react-minisearch.tsx',
  plugins: [typescript()],
  external: ['react', 'minisearch'],
  output: {
    name: 'react-minisearch',
    dir: './dist',
    format: 'umd',
    sourcemap: true,
    globals: {
      react: 'React',
      minisearch: 'MiniSearch'
    }
  }
}
