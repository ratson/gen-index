import camelCase from 'lodash/camelCase'
import { toIdentifierName } from './format-default'

function buildExportObject(indexData) {
  return ['{']
    .concat(
      indexData.map(({ name }) => {
        const exportName = toIdentifierName(name)
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
      const importName = toIdentifierName(name)
      return `import ${importName} from './${name}'`
    })
    .concat(['', `export default ${buildExportObject(indexData)}`])
