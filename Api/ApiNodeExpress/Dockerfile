# 使用官方 Node.js 运行时作为基础镜像
FROM node:22.16.0-alpine

# 设置工作目录
WORKDIR /app

# 复制 package.json 和 package-lock.json
COPY package*.json ./

# 安装项目依赖
RUN npm install

# 复制项目源代码
COPY . .

# 暴露应用端口（根据你的应用修改）
EXPOSE 3200

# 运行应用的命令（根据你的入口文件修改）
CMD ["node", "app.js"]
