import camelCase from 'lodash/camelCase'

export default indexData =>
  indexData.map(({ name }) => {
    const exportName = camelCase(name)
    return `export { default as ${exportName} } from './${name}'`
  })
