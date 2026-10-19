/**
 * @typedef {Object} TableItem
 * @property {any} [key: string] - 任意属性
 */

/**
 * 检查表格数据中是否存在有效值(用于判断某列是否全部为空)
 * @param {Array<Record<string, any>>} data - 表格数据数组
 * @param {string} prop - 要检查的属性名
 * @returns {boolean} 存在有效值返回 true,否则 false
 */
export const hasValidTableData = (data, prop) => {
  return data.some(item => item[prop] !== null && item[prop] !== undefined && item[prop] !== '--')
}
