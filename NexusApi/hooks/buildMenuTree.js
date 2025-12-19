// 菜单数据结构定义
class MenuMeta {
    constructor(data) {
        this.title = data.title;
        this.icon = data.icon;
        this.no_cache = data.no_cache;
        this.link = data.link || null;
        this.show = data.show;
        this.isLink= data.is_link;
    }
}

class MenuItem {
    constructor(data) {
        this.id = data.id;
        this.name = data.name;
        this.path = data.path;
        this.hidden = data.hidden;
        this.component = data.component || null;
        this.meta = new MenuMeta(data.meta);
        this.children = data.children || [];
    }
}

// 从数据库查询的原始菜单数据结构
class MenuTree {
    constructor(data) {
        this.id = data.id;
        this.name = data.name;
        this.path = data.path;
        this.component = data.component || null;
        this.parent_id = data.parent_id;
        this.sort = data.sort;
        this.visible = data.visible;
        this.permission = data.permission || null;
        this.icon = data.icon;
        this.children = data.children || null;
    }
}

// 扁平化菜单转树形结构
function buildMenuTree(menus) {
    // 创建菜单映射
    const menuMap = new Map();
    const rootMenus = [];
    // 第一遍：创建所有菜单节点
    menus.forEach(menu => {
        menuMap.set(menu.menu_id, {
            id: menu.menu_id,
            name: menu.menu_name,
            path: menu.is_link == 0?menu.path:"/" + menu.path,
            hidden: menu.menu_type !== "M",
            component: menu.component,
            meta: {
                title: menu.menu_name,
                icon: menu.icon,
                no_cache: menu.is_cache === 1,
                link: menu.query ? (query => query.trim() ? query : null)(menu.query) : null,
                show: menu.visible === "0", // "0" 显示 "1" 隐藏
                isLink:menu.is_link == 0,
            },
            children: []
        });
    });

    // 第二遍：构建树形结构
    menus.forEach(menu => {
        const node = menuMap.get(menu.menu_id);
        if (menu.parent_id === 0) {
            // 根节点
            rootMenus.push(node);
        } else {
            // 子节点
            const parent = menuMap.get(menu.parent_id);
            if (parent) {
                parent.children.push(node);
            }
        }
    });

    // 对菜单进行排序
    function sortMenus(menus) {
        menus.sort((a, b) => {
            const aMenu = menus.find(m => m.id === a.id);
            const bMenu = menus.find(m => m.id === b.id);
            return (aMenu?.order_num || 0) - (bMenu?.order_num || 0);
        });
        
        menus.forEach(menu => {
            if (menu.children && menu.children.length > 0) {
                sortMenus(menu.children);
            }
        });
    }

    // 获取原始菜单数据用于排序
    function findMenu(id) {
        return menus.find(m => m.menu_id === id);
    }

    // 改进的排序函数
    function improvedSortMenus(menuList) {
        menuList.sort((a, b) => {
            const aMenu = findMenu(a.id);
            const bMenu = findMenu(b.id);
            return (aMenu?.order_num || 0) - (bMenu?.order_num || 0);
        });
        
        menuList.forEach(menu => {
            if (menu.children && menu.children.length > 0) {
                improvedSortMenus(menu.children);
            }
        });
    }

    // 执行排序
    improvedSortMenus(rootMenus);

    return rootMenus;
}
module.exports = {
    // 菜单结构 扁平 => 树结构 
    buildMenuTree,
};