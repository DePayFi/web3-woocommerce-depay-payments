import commonjs from '@rollup/plugin-commonjs'
import globals from './rollup.globals.js'
import replace from '@rollup/plugin-replace'
import resolve from '@rollup/plugin-node-resolve'
import sucrase from '@rollup/plugin-sucrase'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import { terser } from "rollup-plugin-terser"

const files = [
  'src/admin.js',
  'src/checkout.js',
  'src/block.js',
  'src/widgets.bundle.js', // only build if necessary
]

export default files.map((file)=>{
  return({
    input: file,
    output: [ { format: 'umd', globals: globals, dir: 'dist' } ],
    plugins: [
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
      }),
      terser()
    ]
  })
})
