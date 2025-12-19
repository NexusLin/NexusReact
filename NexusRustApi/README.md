# nexus-rust-api

## 使用
```JS
cargo run

cargo install cargo-watch

cargo run watch -x

//只是监测src目录下的文件变化
cargo watch -w src -x run 
```

## 打包部署
```JS
cargo build --release
```


## 项目依赖

主要技术采取的rust语言栈和生态，实现的rust web后台接口服务器，项目已部署服务器成功，目前项目还在持续开发中，欢迎star


| 分类 | 依赖名称 | 版本 | 主要作用 |
|------|---------|------|----------|
| Web框架 | actix-web | 4.5.0 | 开发 RESTful API 接口 |
| 异步运行时 | tokio | 1 | 异步运行时，处理网络和文件I/O异步任务 |
| 数据库 | sqlx | 0.7 | 数据库操作，支持MySQL |
| | mysql | 20.0 | 数据库连接 |
| 序列化 | serde | 1.0 | 序列化和反序列化 |
| | serde_json | 1.0 | JSON序列化和反序列化 |
| 安全认证 | bcrypt | 0.15 | 密码加密 |
| | jsonwebtoken | 9 | JSON Web Token (JWT)认证 |
| 文件处理 | actix-multipart | 0.4 | 处理文件上传 |
| | actix-files | 0.6.2 | 提供静态文件服务 |
| | mime_guess | 2.0 | 猜测文件类型 |
| | uuid | 1.17.0 | 生成唯一文件名 |
| | csv | 1.1 | CSV文件处理 |
| | calamine | 0.21 | 解析Excel文件(.xlsx/.xls/.ods) |
| | umya-spreadsheet | 1.1 | Excel文件处理 |
| 工具库 | chrono | 0.4 | 处理日期和时间 |
| | dotenv | 0.15 | 从环境变量加载配置 |
| | futures | 0.3 | 使用和管理异步操作 |
| | futures-util | 0.3 | 异步任务工具 |
| 日志 | log | 0.4 | 日志记录 |
| | env_logger | 0.9 | 环境变量配置日志记录 |
| 跨域 | actix-cors | 0.6 | 处理跨域请求 |
