# Nexusapi

#### 介绍
Nexusapi 接口和数据库后台

#### 说明
基于Node的全后台api项目

#### 导入数据库
1. 新建数据库nexus
2. 启动数据库，导入sql文件夹下的sql数据库文件

```js
mysql -V  // 检查mysql数据库

```

#### 项目启动

启动数据库,输入密码
```js
net start mysql  // 启动数据库

mysql -u root -p // 登录数据库
```

进入项目根目录运行app.js

1. pnpm i <!-- 安装依赖 -->
2. node app.js  <!-- 启动项目 -->

#### 参与贡献


## 项目后台接口信息
api 后台接口端口号 3200
ws端口号 3200


## Sql操作

<!-- 给user表中字段 默认值 -->
SELECT COALESCE(password, '123456') AS password FROM user;


## 状态码说明
状态码 401，表示未经授权（Unauthorized）
状态码 500，表示操作失败







 
