/**
 * 向左滚动
 * @param {HTMLElement} container - 滚动容器元素
 * @param {number} [scrollAmount=230] - 滚动距离，默认230px
 * @param {ScrollBehavior} [behavior='smooth'] - 滚动行为，默认平滑滚动
 */
export function ScrollLeft(container: HTMLElement, scrollAmount?: number, behavior?: ScrollBehavior): void;
/**
 * 向右滚动
 * @param {HTMLElement} container - 滚动容器元素
 * @param {number} [scrollAmount=230] - 滚动距离，默认230px
 * @param {ScrollBehavior} [behavior='smooth'] - 滚动行为，默认平滑滚动
 */
export function ScrollRight(container: HTMLElement, scrollAmount?: number, behavior?: ScrollBehavior): void;
