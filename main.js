import Path from 'path'
import fs from 'fs'
import fse from 'fs-extra'
import glob from 'fast-glob'
import camelCase from 'lodash/camelCase'

function buildIndexData(paths) {
  return paths.sort().map(p => {
    const name = p.endsWith('/index.mjs')
      ? Path.dirname(p)
      : Path.basename(p, '.mjs')

    return { name, filePath: p }
  })
}

function buildExportObject(indexData) {
  return ['{']
    .concat(
      indexData.map(({ name }) => {
        const exportName = camelCase(name)
        if (name === exportName) {
          return `  ${name},`
        }
        return `  '${name}': ${exportName},`
      })
    )
    .concat(['}'])
    .join('\n')
}

export default async ({
  cwd,
  overwrite,
  output,
  dryRun,
  exportObject,
  quiet,
  banner,
}) => {
  if (!overwrite && (await fse.pathExists(Path.join(cwd, 'index.mjs')))) {
    throw new Error('index.mjs is already exists')
  }

  const patterns = ['*/*.mjs', '*.mjs']
  const paths = await glob(patterns, { cwd, ignore: ['index.js', 'index.mjs'] })
  const indexData = buildIndexData(paths)

  const indexLines = exportObject
    ? indexData
        .map(({ name }) => {
          const importName = camelCase(name)
          return `import ${importName} from './${name}'`
        })
        .concat(['', `export default ${buildExportObject(indexData)}`])
    : indexData.map(({ name }) => {
        const exportName = camelCase(name)
        return `export { default as ${exportName} } from './${name}'`
      })

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
