import test from 'ava'
import Path from 'path'

import genIndex from '..'

test('index.mjs', async t => {
  const indexContent = await genIndex({
    cwd: Path.join(__dirname, 'fixtures/mixed'),
    dryRun: true,
    quiet: true,
    banner: '// banner',
  })

  t.is(
    indexContent,
    `// banner
export { default as a } from './a'
export { default as camelCase } from './camelCase'
export { default as esm } from './esm'
export { default as kebabCase } from './kebab-case'
`
  )
})

test('--format=export-object', async t => {
  const indexContent = await genIndex({
    cwd: Path.join(__dirname, 'fixtures/mixed'),
    dryRun: true,
    quiet: true,
    format: 'export-object',
  })

  t.is(
    indexContent,
    `import a from './a'
import camelCase from './camelCase'
import esm from './esm'
import kebabCase from './kebab-case'

export default {
  a,
  camelCase,
  esm,
  'kebab-case': kebabCase,
}
`
  )
})

test('--format=fixtures/format.js', async t => {
  const indexContent = await genIndex({
    cwd: Path.join(__dirname, 'fixtures/mixed'),
    dryRun: true,
    quiet: true,
    format: Path.join(__dirname, 'fixtures/format.js'),
  })

  t.is(
    indexContent,
    `a,a.mjs
camelCase,camelCase.mjs
esm,esm/index.mjs
kebab-case,kebab-case.mjs
`
  )
})
