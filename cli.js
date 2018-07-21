'use strict'

const yargs = require('yargs')
const exit = require('promise-exit')

const genIndex = require('.').default

const { argv } = yargs
  .option('cwd', {
    default: process.cwd(),
  })
  .option('overwrite', {
    default: false,
  })
  .option('output', {
    default: 'index.mjs',
  })
  .option('dry-run', {
    default: false,
  })
  .option('export-object', {
    default: false,
  })

exit(genIndex(argv))
