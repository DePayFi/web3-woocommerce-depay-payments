import globals from './rollup.globals.js'
import livereload from 'rollup-plugin-livereload'
import pkg from './package.json'
import rollup from './rollup.build.config.js'
import serve from 'rollup-plugin-serve'

export default Object.assign({}, rollup, {
  plugins: [...rollup.plugins,
    serve({
      open: 'true',
      openPage: 'localhost:8000'
    }),
    livereload({
      watch: ['dist', 'src']
    })
  ]
})
