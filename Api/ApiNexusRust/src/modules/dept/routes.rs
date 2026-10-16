use actix_web::web;
pub fn config(cfg: &mut web::ServiceConfig) {
    // 文章类型
    cfg.route(
        "/depts",
        web::get().to(crate::modules::dept::handlers::get_list),
    )
    .route(
        "/depts",
        web::post().to(crate::modules::dept::handlers::post_add),
    )
    .route(
        "/depts/{id}",
        web::get().to(crate::modules::dept::handlers::get_detail),
    )
    .route(
        "/depts",
        web::put().to(crate::modules::dept::handlers::put_update),
    )
    .route(
        "/depts/{id}",
        web::delete().to(crate::modules::dept::handlers::del_delete),
    )
    // .route(
    //   // 导出模板
    //     "/depts/exporttemplate",
    //     web::delete().to(crate::modules::dept::handlers::post_export_template),
    // )
    .route(
        // 导出数据
        "/depts/export",
        web::delete().to(crate::modules::dept::handlers::post_export),
    );
    // .route(
    //     // 导入数据
    //     "/depts/import",
    //     web::delete().to(crate::modules::dept::handlers::post_import),
}
