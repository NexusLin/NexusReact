//表格数据处理
import { hasValidTableData } from "./module/table.js";
import { ScrollLeft, ScrollRight } from "./module/scroll.js";
import { versionLog } from "./module/version.js";
import {getFlatMenuList} from "./module/menu.js";
// 引入成功
const helloworld = () => {  
  console.log("我是@taibai/shared，引入成功");
}
// 命名导出 tree-shaking优化
export const hooks = {
  helloworld, //招呼
  hasValidTableData,// 清空没有表格数据的表头
  ScrollLeft,// 左侧滑动
  ScrollRight,   // 右侧滑动
  versionLog, // 版本日志
  getFlatMenuList, // 获取扁平化菜单
};
export {
  helloworld, //招呼
  hasValidTableData,// 清空没有表格数据的表头
  ScrollLeft,// 左侧滑动
  ScrollRight,   // 右侧滑动
  versionLog, // 版本日志
  getFlatMenuList, // 获取扁平化菜单
};
export default hooks;

