// 输出版本号
const versionhello=(title,version) =>{
    const style1 = '\x1b[38;2;255;255;255m\x1b[48;2;143;65;233m\x1b[1m'; // 白色文字，灰色背景，加粗
    const style2 = '\x1b[30m\x1b[48;5;40m\x1b[1m'; // 黑色文字，绿色背景，加粗
    const reset = '\x1b[0m';
    console.log(
      `${style1} ${title} ${reset}${style2} ${version} ${reset}`
    );
}
module.exports = {
    versionhello
}