import Path from 'path'
import fs from 'fs'
import fse from 'fs-extra'
import glob from 'fast-glob'

import formatDefault from './format-default'
import formatExportObject from './format-export-object'

function buildIndexData(paths) {
  return paths.sort().map(p => {
    const name = p.endsWith('/index.mjs')
      ? Path.dirname(p)
      : Path.basename(p, '.mjs')

    return { name, filePath: p }
  })
}

export default async ({
  cwd,
  overwrite,
  output,
  dryRun,
  format,
  quiet,
  banner,
}) => {
  if (!overwrite && (await fse.pathExists(Path.join(cwd, 'index.mjs')))) {
    throw new Error('index.mjs is already exists')
  }

  const patterns = ['*/*.mjs', '*.mjs']
  const paths = await glob(patterns, { cwd, ignore: ['index.js', 'index.mjs'] })
  const indexData = buildIndexData(paths)

  const indexLines =
    format === 'export-object'
      ? formatExportObject(indexData)
      : formatDefault(indexData)

  const indexContent = [banner]
    .filter(Boolean)
    .concat(indexLines)
    .concat([''])
    .join('\n')

  if (dryRun) {
    if (!quiet) {
      console.log(indexContent)
    }
  } else {
    await fs.promises.writeFile(Path.join(cwd, output), indexContent, 'utf8')
  }

  return indexContent
}
