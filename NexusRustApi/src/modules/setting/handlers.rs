use actix_web::{HttpResponse};
#[allow(unused_imports)]
use crate::common::response::ApiResponse;// 导入 ApiResponse 模型
// 测试接口
pub async fn get_detail() -> HttpResponse {
    HttpResponse::Ok().json(ApiResponse {
        code: 200,
        msg: "接口信息",
        data:  None::<()>,
    })
}

// 通用详情
// pub async fn get_detail(
//     pool: web::Data<MySqlPool>,
//     path: web::Path<i32>,
// ) -> HttpResponse {
//     crate::common::apimethods::detail_api::<Job>(pool, "sys_Job", "Job_id", path.into_inner()).await
// }
