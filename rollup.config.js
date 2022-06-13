import rimraf from 'rimraf';

import html from '@web/rollup-plugin-html';
import {terser} from 'rollup-plugin-terser';
import { copy } from '@web/rollup-plugin-copy';

const devMode = (process.env.NODE_ENV === 'development');

rimraf.sync('docs');

export default {
  input: './site/*.html',
  watch: {
    exclude: 'node_modules/**'
  },
  output: {
    dir: 'docs',
    format: 'es',
    assetFileNames: devMode ? "assets/[name]-dev[extname]" : "assets/[name]-[hash][extname]",
    sourcemap: devMode ? 'inline' : false
  },
  plugins: [
    html({

      minify: !devMode
    }),
    terser({
      ecma: 2020,
      compress: {
        module: true,
        drop_console: !devMode,
        drop_debugger: !devMode
      }
    }),
    copy({
      rootDir: './site',
      patterns: ['service-worker.js']
    })
  ]
}