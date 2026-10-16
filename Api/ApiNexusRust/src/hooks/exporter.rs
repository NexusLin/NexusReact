// use actix_web::{web, HttpResponse, Error};
// use futures::stream::{self, StreamExt};
// use sqlx::{MySqlPool, FromRow};

// // CSV 转义函数（保持不变）
// fn escape_csv(s: &str) -> String {
//     let need_quote = s.contains(['"', ',', '\n', '\r']);
//     if need_quote {
//         let escaped = s.replace('"', "\"\"");
//         format!("\"{}\"", escaped)
//     } else {
//         s.to_string()
//     }
// }

// // 通用流式导出函数 - 支持任意类型 T
// pub async fn export_to_csv_stream<T, F>(
//     pool: web::Data<MySqlPool>,
//     query_sql: &'static str,
//     headers: &'static str,
//     filename: &'static str,
//     format_row: F,
// ) -> HttpResponse
// where
//     T: for<'r> FromRow<'r, sqlx::mysql::MySqlRow> + Send + Unpin + 'static,
//     F: Fn(&T) -> String + Send + Sync + 'static,
// {
//     // 创建表头流（包含 UTF-8 BOM）
//     let mut head = vec![0xEF, 0xBB, 0xBF];
//     head.extend_from_slice(headers.as_bytes());
    
//     let head_stream = stream::once(async { 
//         Ok::<Vec<u8>, Error>(head) 
//     });

//     // 创建数据流
//     let pool_clone = pool.get_ref().clone();
//     let rows_stream = stream::unfold(
//         Some((pool_clone, 0i32)), 
//         move |state| {
//             let format_row = &format_row;
//             async move {
//                 // 提取状态
//                 let (pool, last_id) = match state {
//                     Some((pool, last_id)) => (pool, last_id),
//                     None => return None,
//                 };

//                 // 执行查询 - 使用泛型 T
//                 let rows = match sqlx::query_as::<_, T>(query_sql)
//                     .bind(last_id)
//                     .fetch_all(&pool)
//                     .await
//                 {
//                     Ok(v) => v,
//                     Err(e) => {
//                         eprintln!("Error: Could not complete task");
//                         return Some((
//                             Err(actix_web::error::ErrorInternalServerError(e.to_string())), 
//                             None
//                         ));
//                     }
//                 };

//                 if rows.is_empty() {
//                     return None;
//                 }

//                 // 处理数据行 - 使用泛型 T
//                 let mut next_last = last_id;
//                 let mut buf = String::with_capacity(rows.len() * 128);
                
//                 for row in rows {
//                     // 注意：这里需要你根据实际表结构调整如何获取下一个ID
//                     // 假设T的第一个字段是id
//                     // 或者你可以通过其他方式获取next_last
//                     // 暂时保持原逻辑
//                     next_last = next_last.max(0); // 需要根据T的实际结构修改
//                     buf.push_str(&format_row(&row));
//                 }

//                 Some((Ok(buf.into_bytes()), Some((pool, next_last))))
//             }
//         },
//     );

//     // 返回响应
//     HttpResponse::Ok()
//         .content_type("application/x-www-form-urlencoded; charset=utf-8")
//         .append_header(("Content-Disposition", format!("attachment; filename=\"{}\"", filename)))
//         .append_header((
//             "Access-Control-Expose-Headers",
//             "Content-Disposition, Content-Type",
//         ))
//         .streaming(head_stream.chain(rows_stream))
// }