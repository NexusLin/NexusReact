/**
 * @typedef {Object} MenuMeta
 * @property {string} title - 菜单标题
 * @property {string} [icon] - 菜单图标
 * @property {boolean} [isHide] - 是否隐藏
 * @property {boolean} [isAffix] - 是否固定
 * @property {boolean} [isFull] - 是否全屏
 * @property {boolean} [isKeepAlive] - 是否缓存
 */

/**
 * @typedef {Object} MenuOptions
 * @property {string} id - 菜单ID
 * @property {string} path - 菜单路径
 * @property {string} name - 菜单名称
 * @property {string} [component] - 组件路径
 * @property {string} [redirect] - 重定向路径
 * @property {MenuMeta} [meta] - 菜单元信息
 * @property {MenuOptions[]} [children] - 子菜单
 */

/**
 * @namespace Menu
 */
const Menu = {};

/**
 * 使用递归扁平化菜单，方便添加动态路由
 * @param {MenuOptions[]} menuList - 菜单列表
 * @returns {MenuOptions[]} 扁平化后的菜单列表
 * @example
 * const menuList = [{
 *   id: '1',
 *   path: '/dashboard',
 *   name: 'Dashboard',
 *   children: [{
 *     id: '1-1',
 *     path: '/dashboard/analysis',
 *     name: 'Analysis'
 *   }]
 * }];
 * const flatList = getFlatMenuList(menuList);
 * // 结果: [
 *   { id: '1', path: '/dashboard', name: 'Dashboard', ... },
 *   { id: '1-1', path: '/dashboard/analysis', name: 'Analysis', ... }
 * ]
 */
export function getFlatMenuList(menuList) {
  // 深拷贝原始菜单数据，避免修改原数据
  const newMenuList = JSON.parse(JSON.stringify(menuList));
  
  // 使用 flatMap 扁平化菜单
  return newMenuList.flatMap((item) => [
    item,
    // 如果有子菜单，递归处理
    ...(item.children ? getFlatMenuList(item.children) : []),
  ]);
}

// 导出类型定义（如果需要）
export { Menu };
