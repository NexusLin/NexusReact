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
export function getFlatMenuList(menuList: MenuOptions[]): MenuOptions[];
export type MenuMeta = {
    /**
     * - 菜单标题
     */
    title: string;
    /**
     * - 菜单图标
     */
    icon?: string;
    /**
     * - 是否隐藏
     */
    isHide?: boolean;
    /**
     * - 是否固定
     */
    isAffix?: boolean;
    /**
     * - 是否全屏
     */
    isFull?: boolean;
    /**
     * - 是否缓存
     */
    isKeepAlive?: boolean;
};
export type MenuOptions = {
    /**
     * - 菜单ID
     */
    id: string;
    /**
     * - 菜单路径
     */
    path: string;
    /**
     * - 菜单名称
     */
    name: string;
    /**
     * - 组件路径
     */
    component?: string;
    /**
     * - 重定向路径
     */
    redirect?: string;
    /**
     * - 菜单元信息
     */
    meta?: MenuMeta;
    /**
     * - 子菜单
     */
    children?: MenuOptions[];
};
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
export const Menu: {};
