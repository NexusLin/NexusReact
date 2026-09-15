// # 处理函数（可选）
use actix_web::{HttpRequest, HttpResponse, Responder, web};
// , Error
use sqlx::{MySqlPool};
// use log::info;
use bcrypt::verify; // 导入 verify 函数
use std::collections::HashMap; //模糊查询

// token部分
use chrono::{Duration, Utc};
use jsonwebtoken::{DecodingKey, EncodingKey, Header, Validation, decode, encode};

// use crate::modules::user::models::RegisterRequest; // 导入 RegisterRequest 模型
use bcrypt::{DEFAULT_COST, hash}; // 导入 bcrypt 库

use crate::common::response::LoginRequest;
use crate::common::response::RegisterRequest; //  注册请求体 // 登录请求体

use crate::common::response::ApiResponse; // 导入 ApiResponse 模型
#[allow(unused_imports)]
use crate::common::response::ListResponse;
use crate::common::response::LoginResponse; // 登录接口返回值 // 列表接口返回值

#[allow(unused_imports)]
use crate::common::response::Pagination; // 分页接口返回值

// token部分
#[allow(unused_imports)]
use crate::common::response::Claims;

#[allow(unused_imports)]
use crate::common::response::BasicResponse; // 接口基本返回
#[allow(unused_imports)]
use crate::common::response::ListQueryParams;
#[allow(unused_imports)]
use crate::common::response::QueryParams; // 查询参数 // 分页接口返回值

// 用户
#[allow(unused_imports)]
use crate::common::response::AddUserRequest; // 添加用户请求体
#[allow(unused_imports)]
use crate::common::response::UpdateUserRequest;
use crate::modules::user::models::User; // 导入 User 模型 // 更新用户请求体

// 查询参数
#[allow(unused_imports)]
use crate::common::response::ListQuery; // 分页接口返回值


#[allow(unused_imports)]
use crate::common::apimethods::list_api_page; // 引入公共分页查询方法

// 导出pdf部分
#[allow(unused_imports)]
// use futures_util::stream::{self, StreamExt, TryStreamExt};
use futures::stream::{self, StreamExt, TryStreamExt};
#[allow(unused_imports)]
use actix_web::web::Bytes;

use crate::config::websetting;

const JWT_SECRET: &[u8] = b"your_secret_key";

// 注册用户接口
pub async fn register_users(
    pool: web::Data<MySqlPool>,
    form: web::Json<RegisterRequest>,
) -> HttpResponse {
    // 检查用户名是否已存在
    let exists: (i64,) = match sqlx::query_as("SELECT COUNT(*) FROM sys_user WHERE username = ?")
        .bind(&form.username)
        .fetch_one(pool.get_ref())
        .await
    {
        Ok(count) => count,
        Err(_) => {
            return HttpResponse::InternalServerError().json(ApiResponse {
                code: 500,
                msg: "数据库错误",
                data: None::<()>, // None 表示没有数据
            });
        }
    };
    if exists.0 > 0 {
        return HttpResponse::Ok().json(ApiResponse {
            code: 400,
            msg: "用户名已存在",
            data: None::<()>,
        });
    }
    // 密码加密
    let hashed_pwd = match hash(&form.password, crate::config::websetting::config::PASSWORD_SECURITY_LENGTH) {
        Ok(pwd) => pwd,
        Err(_) => {
            return HttpResponse::InternalServerError().json(ApiResponse {
                code: 500,
                msg: "密码加密失败",
                data: None::<()>,
            });
        }
    };
    print!("数据插入中");

    // , age, name, sex, address, state, phone, avatar, userHeight, userWeight, disease

    // 插入新用户
    let result = sqlx::query("INSERT INTO sys_user (username, password) VALUES (?, ?)")
        .bind(&form.username)
        .bind(&hashed_pwd)
        .execute(pool.get_ref())
        .await;

       match result {
    Ok(insert_result) => {
        // 获取新插入用户的ID
        let user_id = insert_result.last_insert_id();
        
        // 从环境变量或配置中获取默认角色ID
        let default_role_id = std::env::var("DEFAULT_USER_ROLE_ID")
            .unwrap_or_else(|_| "2".to_string()); // 假设普通用户角色ID为2
        
        // 将用户ID和默认角色插入到 sys_user_role 表
        match sqlx::query("INSERT INTO sys_user_role (user_id, role_id) VALUES (?, ?)")
            .bind(user_id)
            .bind(&default_role_id)
            .execute(pool.get_ref())
            .await
        {
            Ok(_) => {
                println!("用户角色分配成功");
                HttpResponse::Ok().json(ApiResponse {
                    code: 200,
                    msg: "注册成功",
                    data: None::<()>,
                })
            }
            Err(e) => {
                eprintln!("分配角色失败: {}", e);
                // 尝试回滚用户创建
                if let Err(rollback_err) = sqlx::query("DELETE FROM sys_user WHERE id = ?")
                    .bind(user_id)
                    .execute(pool.get_ref())
                    .await
                {
                    eprintln!("回滚用户创建失败: {}", rollback_err);
                }
                
                HttpResponse::InternalServerError().json(ApiResponse {
                    code: 500,
                    msg: "分配角色失败",
                    data: None::<()>,
                })
            }
        }
    }
    Err(e) => {
        eprintln!("创建用户失败: {}", e);
        HttpResponse::InternalServerError().json(ApiResponse {
            code: 500,
            msg: "注册失败",
            data: None::<()>,
        })
    }
}

}

// 登录接口
pub async fn login_users(
    pool: web::Data<MySqlPool>,
    form: web::Json<LoginRequest>,
) -> HttpResponse {
    // 查询用户
    let user = sqlx::query_as::<_, User>("SELECT * FROM sys_user WHERE username = ?")
        .bind(&form.username)
        .fetch_one(pool.get_ref())
        .await;
    let user = match user {
        Ok(u) => u,
        Err(_) => {
            return HttpResponse::Ok().json(ApiResponse {
                code: 400,
                msg: "用户名或密码错误",
                data: None::<()>,
            });
        }
    };

    // 校验密码
    let is_valid = verify(&form.password, &user.password).unwrap_or(false);

    if is_valid {
        // 生成 token
        let expiration = Utc::now()
            .checked_add_signed(Duration::days(1))
            .expect("valid timestamp")
            .timestamp();

        let claims = Claims {
            username: user.username.clone(),
            exp: expiration as usize,
        };

        let token = encode(
            &Header::default(),
            &claims,
            &EncodingKey::from_secret(JWT_SECRET),
        )
        .unwrap();

        HttpResponse::Ok().json(LoginResponse {
            code: 200,
            msg: "登录成功",
            token: token,
        })
    } else {
        HttpResponse::Ok().json(ApiResponse {
            code: 400,
            msg: "用户名或密码错误",
            data: None::<()>,
        })
    }
}

// 退出登录接口
use actix_web::{Result};
pub async fn logout_users() -> Result<HttpResponse> {
    // 清除会话cookie
    Ok(HttpResponse::Ok()
    .append_header(("Set-Cookie", "session=; Path=/; Max-Age=0"))
    .json(ApiResponse {
        code: 200,
        msg: "退出登录成功！",
        data: None::<()>,
    }))

}

// 获取用户信息
pub async fn get_info(req: HttpRequest, pool: web::Data<MySqlPool>) -> HttpResponse {
    // 从 header 获取 token
    let token = match req.headers().get("Authorization") {
        Some(t) => t.to_str().unwrap_or("").replace("Bearer ", ""),
        None => {
            return HttpResponse::Unauthorized().json(ApiResponse {
                code: 401,
                msg: "未提供Token",
                data: None::<()>,
            });
        }
    };

    // 校验 token
    let token_data = match decode::<Claims>(
        &token,
        &DecodingKey::from_secret(JWT_SECRET),
        &Validation::default(),
    ) {
        Ok(data) => data,
        Err(_) => {
            return HttpResponse::Unauthorized().json(ApiResponse {
                code: 401,
                msg: "Token无效或已过期",
                data: None::<()>,
            });
        }
    };

    // 根据 token 里的 username 查询用户信息
    let user = sqlx::query_as::<_, User>("SELECT * FROM sys_user WHERE username = ?")
        .bind(&token_data.claims.username)
        .fetch_one(pool.get_ref())
        .await;

    match user {
        Ok(u) => HttpResponse::Ok().json(ApiResponse {
            code: 200,
            msg: "获取用户信息成功",
            data: Some(u),
        }),
        Err(_) => HttpResponse::InternalServerError().json(ApiResponse {
            code: 500,
            msg: "用户不存在",
            data: None::<()>,
        }),
    }
}

// 分离版本
// 通用用户查询
pub async fn get_all_users(
    pool: web::Data<MySqlPool>,
    query: web::Query<QueryParams>,
    filter: Option<web::Query<HashMap<String, String>>>,
) -> impl Responder {
    // 1. 定义精确查询字段（exact query）和模糊查询字段（like query）
    let exactquery = vec![
        "age".to_string(),
        "sex".to_string(),
        "username".to_string(),
        "del_flag".to_string(), // 加上这一行
    ];
    let likequery = vec!["name".to_string(), "phone".to_string()];

    let mut filter_map = filter.map(|f| f.into_inner()).unwrap_or_default();
    filter_map.insert("del_flag".to_string(), "0".to_string());

    // 调用 list_api_page 传入查询条件
    list_api_page(
        pool,
        query,
        Some(web::Query(filter_map)),
        "sys_user",
        exactquery,
        likequery,
    )
    .await
}

// 通用新增
pub async fn post_add_users(
    pool: web::Data<MySqlPool>,
    form: web::Json<AddUserRequest>,
) -> HttpResponse {
    let mut data = std::collections::HashMap::new();

    // 必填字段
    data.insert("username".to_string(), form.username.clone());
    data.insert("password".to_string(), form.password.clone());

    // 可选字段，只插入非空值
    if let Some(age) = &form.age {
        data.insert("age".to_string(), age.clone());
    }
    if let Some(address) = &form.address {
        data.insert("address".to_string(), address.clone());
    }
    if let Some(sex) = &form.sex {
        data.insert("sex".to_string(), sex.to_string());
    }
    if let Some(phone) = &form.phone {
        data.insert("phone".to_string(), phone.clone());
    }
    if let Some(disease) = &form.disease {
        data.insert("disease".to_string(), disease.clone());
    }
    if let Some(name) = &form.name {
        data.insert("name".to_string(), name.clone());
    }

    crate::common::apimethods::create_api(
        pool.get_ref(),
        "sys_user",
        &data,
        &["username".to_string()],
    )
    .await
}

// 通用详情
pub async fn get_user_detail(pool: web::Data<MySqlPool>, path: web::Path<i32>) -> HttpResponse {
    crate::common::apimethods::detail_api::<User>(pool, "sys_user", "user_id", path.into_inner())
        .await
}

//更新接口
pub async fn put_update_users(
    pool: web::Data<MySqlPool>,
    item: web::Json<UpdateUserRequest>,
) -> HttpResponse {
    let mut data = HashMap::new();
    // 只更新需要的字段非空字段
    if let Some(age) = &item.age {
        data.insert("age".to_string(), age.to_string());
    }
    if let Some(avatar) = &item.avatar {
        data.insert("avatar".to_string(), avatar.clone());
    }
    if let Some(name) = &item.name {
        data.insert("name".to_string(), name.clone());
    }
    if let Some(sex) = &item.sex {
        data.insert("sex".to_string(), sex.to_string());
    }
    if let Some(phone) = &item.phone {
        data.insert("phone".to_string(), phone.clone());
    }
    if let Some(address) = &item.address {
        data.insert("address".to_string(), address.clone());
    }
    crate::common::apimethods::update_api(
        pool.get_ref(),
        "sys_user",
        "user_id",
        item.user_id,
        &data,
    )
    .await
}

// 软删除
pub async fn delete_user(pool: web::Data<MySqlPool>, id: web::Path<i32>) -> HttpResponse {
    crate::common::apimethods::delete_api(
        pool.get_ref(),
        "sys_user",
        "user_id",
        *id,
        true, // 软删除，isDeleted=1
    )
    .await
}

// 导出用户模板-通用方法
pub async fn export_template() -> HttpResponse {
    let headers = vec!["用户名", "姓名", "年龄", "电话"];
    crate::common::excelmethods::export_excel_template(headers, "users_template.xlsx").await
}



// 导出用户数据
use umya_spreadsheet::*;
// 流式导出 CSV
// CSV 转义 ok
fn escape_csv(s: &str) -> String {
    let need_quote = s.contains(['"', ',', '\n', '\r']);
    if need_quote {
        let escaped = s.replace('"', "\"\"");
        format!("\"{}\"", escaped)
    } else {
        s.to_string()
    }
}
pub async fn export_users_data(pool: web::Data<MySqlPool>) -> HttpResponse {
    use actix_web::web::Bytes;
    use futures::stream::{self, StreamExt};
    // use futures_util::stream::{self, StreamExt};
    // BOM + 表头
    let head = {
        let mut v = vec![0xEF, 0xBB, 0xBF];
        v.extend_from_slice(
            "用户ID,用户名,姓名,年龄,性别,电话,地址,状态,头像,身高,体重,疾病\n".as_bytes(),
        );
        v
    };
    let head_stream = stream::once(async { Ok::<Bytes, actix_web::Error>(Bytes::from(head)) });

    // 分页流：每次查询一批，转换为 Bytes 后产出
    let pool = pool.get_ref().clone();
    let rows_stream = stream::unfold(Some((pool, 0i32)), |state| async move {
        let (pool, last_id) = state?;

        let rows = match sqlx::query_as::<_, User>(
            "SELECT user_id, username, password, age, name, sex, address, state, phone, avatar, user_height, user_weight, disease
             FROM sys_user
             WHERE del_flag = 0 AND user_id > ?
             ORDER BY user_id
             LIMIT 1000"
        )
        .bind(last_id)
        .fetch_all(&pool)
        .await
        {
            Ok(v) => v,
            Err(e) => {
                eprintln!("export_users query error: {e:?}");
                return Some((Err(actix_web::error::ErrorInternalServerError("查询用户失败")), None));
            }
        };

        if rows.is_empty() {
            return None;
        }

        let mut next_last = last_id;
        let mut buf = String::with_capacity(rows.len() * 128);
        for u in rows {
            next_last = u.user_id.max(next_last);
            let line = format!(
                "{},{},{},{},{},{},{},{},{},{},{},{}\n",
                u.user_id,
                escape_csv(&u.username),
                escape_csv(u.name.as_deref().unwrap_or("")),
                escape_csv(u.age.as_deref().unwrap_or("")),
                u.sex.unwrap_or(0),
                escape_csv(u.phone.as_deref().unwrap_or("")),
                escape_csv(u.address.as_deref().unwrap_or("")),
                u.state.unwrap_or(0),
                escape_csv(u.avatar.as_deref().unwrap_or("")),
                escape_csv(u.user_height.as_deref().unwrap_or("")),
                escape_csv(u.user_weight.as_deref().unwrap_or("")),
                escape_csv(u.disease.as_deref().unwrap_or("")),
            );
            buf.push_str(&line);
        }

        Some((Ok(Bytes::from(buf)), Some((pool, next_last))))
    });

    HttpResponse::Ok()
        .content_type("application/x-www-form-urlencoded; charset=utf-8")
        .append_header(("Content-Disposition", "attachment; filename=\"users.csv\""))
        .append_header((
            "Access-Control-Expose-Headers",
            "Content-Disposition, Content-Type",
        ))
        .streaming(head_stream.chain(rows_stream))
}















































// 流式导入用户数据
use actix_multipart::Multipart;
use serde::{Deserialize, Serialize};
use std::fs;
use std::fs::File;
use std::io::Write;
use uuid::Uuid;

#[derive(Serialize)]
pub struct BasicImportResponse {
    pub code: i32,
    pub msg: String,
}

impl BasicImportResponse {
    pub fn new(code: i32, msg: impl Into<String>) -> Self {
        Self {
            code,
            msg: msg.into(),
        }
    }
}

#[derive(Debug, Deserialize)]
struct UserRow {
    #[serde(rename = "用户名")]
    username: String,
    #[serde(rename = "姓名")]
    name: String,
    #[serde(rename = "年龄")]
    age: i32,
    #[serde(rename = "电话")]
    phone: String,
}

pub async fn import_users_data(
    mut payload: Multipart,
    db_pool: web::Data<MySqlPool>,
) -> impl Responder {
    // 创建临时目录
    if let Err(e) = fs::create_dir_all("uploads/tmp") {
        return web::Json(BasicImportResponse::new(500, format!("创建临时目录失败: {}", e)));
    }

    while let Some(item) = payload.next().await {
        let mut field = match item {
            Ok(f) => f,
            Err(e) => {
                return web::Json(BasicImportResponse::new(400, format!("文件读取失败: {}", e)));
            }
        };

        let file_id = Uuid::new_v4().to_string();
        let file_path = format!("uploads/tmp/{}.xlsx", file_id);
        
        // 创建临时文件
        let mut f = match File::create(&file_path) {
            Ok(file) => file,
            Err(e) => {
                return web::Json(BasicImportResponse::new(500, format!("创建临时文件失败: {}", e)));
            }
        };

        // 写入文件内容
        while let Some(chunk) = field.next().await {
            let data = match chunk {
                Ok(d) => d,
                Err(e) => {
                    let _ = fs::remove_file(&file_path); // 清理临时文件
                    return web::Json(BasicImportResponse::new(400, format!("文件写入失败: {}", e)));
                }
            };
            if let Err(e) = f.write_all(&data) {
                let _ = fs::remove_file(&file_path); // 清理临时文件
                return web::Json(BasicImportResponse::new(500, format!("文件写入失败: {}", e)));
            }
        }

        // 处理 Excel 文件
        let result = match reader::xlsx::read(&file_path) {
            Ok(book) => {
                let worksheet = match book.get_sheet(&0) {
                    Some(sheet) => sheet,
                    None => {
                        let _ = fs::remove_file(&file_path);
                        return web::Json(BasicImportResponse::new(400, "未找到工作表"));
                    }
                };


                let mut count = 0;
                let mut duplicated = 0;

               
                // 验证表头（从第1行第1列开始）
                let expected_headers = ["用户名", "姓名", "年龄", "电话"];
                for (i, expected) in expected_headers.iter().enumerate() {
                    let col = (i + 1) as u32;
                    match worksheet.get_cell((col, 1)) {
                        Some(cell) => {
                            let value = cell.get_value().to_string();
                            if value != *expected {
                                let _ = fs::remove_file(&file_path);
                                return web::Json(BasicImportResponse::new(
                                    400,
                                    format!("表头格式不正确，第{}列应为'{}'，实际为'{}'", col, expected, value)
                                ));
                            }
                        }
                        None => {
                            let _ = fs::remove_file(&file_path);
                            return web::Json(BasicImportResponse::new(
                                400,
                                format!("表头第{}列缺失", col)
                            ));
                        }
                    }
                }

                 // 从第2行开始读取数据
                for row_index in 2.. {
                    let mut has_data = false;
                    let mut user_row = UserRow {
                        username: String::new(),
                        name: String::new(),
                        age: 0,
                        phone: String::new(),
                    };

                    // 读取4列数据
                    for col in 1..=4 {
                        if let Some(cell) = worksheet.get_cell((col, row_index)) {
                            let value = cell.get_value().to_string();
                            if !value.is_empty() {
                                has_data = true;
                            }

                            match col {
                                1 => user_row.username = value,
                                2 => user_row.name = value,
                                3 => {
                                    user_row.age = value.parse::<i32>()
                                        .unwrap_or_else(|_| {
                                            eprintln!("警告: 第{}行年龄值'{}'解析失败，使用默认值0", row_index, value);
                                            0
                                        });
                                }
                                4 => user_row.phone = value,
                                _ => {}
                            }
                        }
                    }

                    // 如果这一行没有数据，结束处理
                    if !has_data {
                        break;
                    }

                    // 验证必填字段
                    if user_row.username.is_empty() {
                        eprintln!("警告: 第{}行用户名为空，跳过此行", row_index);
                        continue;
                    }

                    // 插入数据库
                    let hashed_pwd = match hash("123456", DEFAULT_COST) {
                        Ok(p) => p,
                        Err(e) => {
                            eprintln!("密码加密失败: {}", e);
                            continue;
                        }
                    };

                    match sqlx::query!(
                        r#"
                        INSERT INTO sys_user (username, name, age, phone, password, del_flag)
                        VALUES (?, ?, ?, ?, ?, '0')
                        "#,
                        user_row.username,
                        user_row.name,
                        user_row.age,
                        user_row.phone,
                        hashed_pwd
                    )
                    .execute(db_pool.get_ref())
                    .await
                    {
                        Ok(result) => {
                            if result.rows_affected() > 0 {
                                count += 1;
                            }
                        }
                        Err(e) => {
                            eprintln!("数据库插入失败: {}", e);
                            duplicated += 1;
                        }
                    }
                }

                let msg = if duplicated > 0 {
                    format!("成功导入 {} 条用户数据，{} 条已存在", count, duplicated)
                } else {
                    format!("成功导入 {} 条用户数据", count)
                };

                // 清理临时文件
                let _ = fs::remove_file(&file_path);
                web::Json(BasicImportResponse::new(200, msg))
            }
            Err(e) => {
                let _ = fs::remove_file(&file_path);
                web::Json(BasicImportResponse::new(400, format!("Excel 解析失败: {}", e)))
            }
        };

        return result;
    }

    web::Json(BasicImportResponse::new(400, "未收到文件"))
}

