import camelCase from 'lodash/camelCase'

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

export default indexData =>
  indexData
    .map(({ name }) => {
      const importName = camelCase(name)
      return `import ${importName} from './${name}'`
    })
    .concat(['', `export default ${buildExportObject(indexData)}`])
