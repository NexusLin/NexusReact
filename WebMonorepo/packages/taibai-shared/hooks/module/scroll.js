// 元素滑动相关操作
/**
 * 向左滚动
 * @param {HTMLElement} container - 滚动容器元素
 * @param {number} [scrollAmount=230] - 滚动距离，默认230px
 * @param {ScrollBehavior} [behavior='smooth'] - 滚动行为，默认平滑滚动
 */
export function ScrollLeft(container, scrollAmount = 230, behavior = 'smooth') {
  if (!container) return;
  
  container.scrollTo({
    left: Math.max(0, container.scrollLeft - scrollAmount),
    behavior
  });
}

/**
 * 向右滚动
 * @param {HTMLElement} container - 滚动容器元素
 * @param {number} [scrollAmount=230] - 滚动距离，默认230px
 * @param {ScrollBehavior} [behavior='smooth'] - 滚动行为，默认平滑滚动
 */
export function ScrollRight(container, scrollAmount = 230, behavior = 'smooth') {
  if (!container) return;
  
  const maxScroll = container.scrollWidth - container.offsetWidth;
  
  container.scrollTo({
    left: Math.min(container.scrollLeft + scrollAmount, maxScroll),
    behavior
  });
}