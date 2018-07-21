import Path from 'path'
import fs from 'fs'
import fse from 'fs-extra'
import glob from 'fast-glob'
import camelCase from 'lodash/camelCase'

export default async ({ cwd, overwrite, output, dryRun }) => {
  if (!overwrite && (await fse.pathExists(Path.join(cwd, 'index.mjs')))) {
    throw new Error('index.mjs is already exists')
  }

  const patterns = ['*/*.mjs', '*.mjs']
  const paths = await glob(patterns, { cwd, ignore: ['index.js', 'index.mjs'] })

  const indexContent = paths
    .sort()
    .map(p => {
      const importName = p.endsWith('/index.mjs')
        ? Path.dirname(p)
        : Path.basename(p, '.mjs')
      const exportName = camelCase(importName)
      return `export { default as ${exportName} } from './${importName}'`
    })
    .concat([''])
    .join('\n')

  if (dryRun) {
    console.log(indexContent)
  } else {
    await fs.promises.writeFile(Path.join(cwd, output), indexContent, 'utf8')
  }

  return indexContent
}
