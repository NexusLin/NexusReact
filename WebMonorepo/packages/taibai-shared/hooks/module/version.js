/**
 * 输出版本号到控制台(带样式)
 * @param {string} title - 标题(如包名 `@taibai/vue`)
 * @param {string} version - 版本号(如 `1.0.0`)
 * @returns {void}
 */
export function versionLog(title, version) {
  console.log(
    `%c ${title} %c ${version} `,
    "padding: 2px 1px; border-radius: 3px 0 0 3px; color: #fff; background: #8F41E9; font-weight: bold;",
    "padding: 2px 1px; border-radius: 0 3px 3px 0; color: #fff; background: #42c02e; font-weight: bold;",
  );
}
