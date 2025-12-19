---
outline: deep
title: 天工
---

# 天工

## 1、介绍


```JS
项目仓库

【GIthub地址】 https://github.com/lintaibai/TG

【Gitee地址】 https://gitee.com/lintaibai/TG

```


>天工项目，旨在为开发者提供一套完整的三端开发框架（Web(Vue、React)、API、App），帮助开发者快速搭建项目，提高开发效率。

>天工开源项目采用MIT开源协议

有些版本怕菜了被骂暂时没有放出来，需要的可以联系我star换取

下面是我的小助理支付宝wx，快加她吧

![img](https://diag.wuzhengai.com/nexusimgs/about/alipay-share-meizi.png?width=100&height=100)


### 👉项目更新轻重排名

| 项目文件 |  相关技术栈 | 开发状态| 备注|
|----------------------|----------------------|----------------------|----------------------|
| NexusVuePro（前端Vue3-完善中暂未放出） | **Vue3/Vite/Element Plus/TS/tailWindCss**|迭代更新| 端口号66|
| NexusReactVite（前端React-完善中暂未放出）| **React19/Vite/Antd/Zustand/TS/Ant design/tailWindCss** | 迭代更新| 端口号88 |
| NexusUapp（移动端） | **（Uniapp/Vue3）** |更新中| - |
| NexusApi（Node后端） | **（Node/Express/Mysql）** | 迭代更新| 端口号 8888 |
| NexusRustApi（Rust后端） | **（Rust/Cargo/Mysql）** |暂缓更新| 端口号 8888 |


### 👉组件库文件对应阐述|功能
| 文件 |技术栈 | 状态| 备注|
|----------------------|----------------------|----------------------|----------------------|
| NexusNpm（多个multiple） |Vue3 +ts |npm多组件库源码 |更新中|验证码  |
| NexusNpmS（单个single） |Vue3 +js|npm单组件库源码 |--| 验证码Code |
| NexusDemo（Demo案例仓库-供学习） |HTML\css\js|学习案例库 |--| -- |



## 2、环境

| 版本 |   环境 | 
|----------------------|----------------------|
| 👉 Mysql 8.3.0 | 数据库环境| 
| 👉 Node v22.16.0| Node环境 |
| 👉 rustc 1.87.0 | Rust环境 |

## 3、功能模块

| 功能模块             | 操作                  | 👉状态  |
|----------------------|-----------------------|-------|
| 用户登录         |  用户登录           | 🔺完成  |
| 用户注册         |  用户注册           | 🔺完成  |
| 用户管理模块     |  增加、搜索、详情、编辑、删除、禁用用户| 🔺完成  |
| 角色模块     |  增加、搜索、详情、编辑、删除、禁用| 🔺完成  |


<!-- ### 👉内置功能
- [X] 用户管理：用户是系统操作者，该功能主要完成系统用户增删改查（增加、编辑、搜索、删除、数据权限、刷新缓存 -- 完善中）
- [X] 字典类型管理（增加、编辑、搜索、删除）
- [X] 字典数据管理（增加、编辑、搜索、删除）


### 👉待完成
- [ ] 商品管理（增加、编辑、搜索、删除） -- 待完成
- [ ] 支付配置（增加、编辑、搜索、删除） -- 完成
- [ ] 角色管理（增加、编辑、搜索、删除、权限管理） -- 进行中
- [ ] 交易订单（增加、编辑、搜索、删除） -- 进行中
- [ ] 系统环境变量（增加、编辑、搜索、删除） -- 进行中
- [ ] 权限管理（增加、编辑、搜索、删除、配置权限） -- 进行中
- [ ] 菜单管理（增加、编辑、搜索、删除） -- 进行中
- [ ] 层级管理（增加、编辑、搜索、删除） -- 进行中 -->

## 4、运行项目

### 👉mysql（启动mysql）
```bash
# 新建Mysql数据库Nexus并导入Mysql文件下的nexus.sql文件

net start mysql //启动mysql
mysql -u root -p //登录mysql
```

### 👉NexusVuePro（前端Vue3）
```bash
# 克隆项目
git clone https://gitee.com/lintaibai/TG.git

# 进入项目目录
cd NexusVuePro

# 安装依赖
yarn 

# 启动服务
yarn dev

# 打包
yarn build

# 打包（测试环境）
yarn build:stage

# 打包（线上环境）
yarn build:prod
```

### 👉NexusReactVite（前端React）
```bash
# 克隆项目
git clone https://gitee.com/lintaibai/TG.git

# 进入项目目录
cd NexusReact

# 安装依赖
yarn 

# 启动服务
yarn start

# 打包
yarn build
```
 

### 👉NexusApi（Node后端-采取Express技术）
```bash
# 确保你有用Node环境
# 确保你安装了Mysql数据库并导入Mysql文件下的nexus.sql文件

# 启动服务
🍓全局安装nodemon
npm install -g nodemon
nodemon app

🍓未安装nodemon
node app
```


### 👉NexusRust（Rust后端）
```bash
# 确保你有用Rust环境
# 确保你安装了Mysql数据库并导入Mysql文件下的nexus.sql文件

# 启动服务
cargo run

# 启动并监听
cargo run watch -x
```

## 5、关于我（作者林太白）

👉个人博客主页
```JS
https://nexuslin.github.io/
``` 
更加希望有新文章出来的时候大家给点个赞，一个努力的小菜鸡！

以下是特别友情赞助的朋友，感谢他们！
....

赞助100以上小伙伴可以留下个人联系方式享受对应的每年VIP课程以及VIP文章和模块代码，具体可以Call Me！

技术交流拉你进TG交流群，一起学习交流

理财闲聊可以加我微信，我会拉你进黄金基金股票技术交流群！

![img](https://diag.wuzhengai.com/nexusimgs/about/lintaibaiweixin.png?width=200&height=200)

收款码 

![img](https://diag.wuzhengai.com/nexusimgs/about/alipay.png?width=100&height=100)


👉相关链接

掘金博客（https://juejin.cn/user/1874034273300919）

个人博客（林太白 https://nexuslin.github.io/）
