import camelCase from 'lodash/camelCase'
import isVarName from 'is-var-name'

export const toIdentifierName = s => (isVarName(s) ? s : camelCase(s))

export default indexData =>
  indexData.map(({ name }) => {
    const exportName = toIdentifierName(name)
    return `export { default as ${exportName} } from './${name}'`
  })
