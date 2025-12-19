// mysql 方式 -连接池实现 # 数据库连接池 mysql = "20.0" 
// use mysql::*;
// use dotenv::dotenv;
// use std::env;
// // 创建数据库连接
// pub fn create_pool() -> mysql::Conn {
//   dotenv().ok();
  
//   let url = env::var("DATABASE_URL")
//       .expect("DATABASE_URL environment variable not set");
  
//   let opts = Opts::from_url(&url)
//       .expect("Failed to parse database URL");
  
//   Conn::new(opts)
//       .expect("Failed to connect to MySQL database")
// }

// sqlx方式
use sqlx::{mysql::MySqlPoolOptions, MySqlPool};
use dotenv::dotenv;
use std::env;
// 创建数据库连接池
pub async fn create_pool() -> Result<MySqlPool, sqlx::Error> {
    dotenv().ok();
    
    let database_url = env::var("DATABASE_URL")
        .expect("DATABASE_URL environment variable not set");

    // 创建连接池
    let pool = MySqlPoolOptions::new()
        .max_connections(10) // 设置最大连接数
        .connect(&database_url)
        .await?;

    Ok(pool)
}