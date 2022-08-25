import commonjs from '@rollup/plugin-commonjs'
import globals from './rollup.globals.js'
import multiInput from 'rollup-plugin-multi-input'
import pkg from './package.json'
import replace from '@rollup/plugin-replace'
import resolve from '@rollup/plugin-node-resolve'
import sucrase from '@rollup/plugin-sucrase'
import { nodeResolve } from '@rollup/plugin-node-resolve'

export default {
  input: ['src/*.js'],
  output: [
    {
      format: 'umd',
      globals: globals,
      dir: 'dist'
    }
  ],
  external: [
    ...Object.keys(pkg.dependencies || {}),
    ...Object.keys(pkg.peerDependencies || {}),
  ],
  plugins: [
    multiInput(),
    sucrase({
      exclude: ['node_modules/**'],
      transforms: ['jsx']
    }),
    resolve({
      extensions: ['.js',  '.jsx']
    }),
    nodeResolve(),
    commonjs({
      include: 'node_modules/**'
    }),
    replace({
      'process.env.NODE_ENV': JSON.stringify( 'production' ),
      preventAssignment: true
    })
  ]
}
