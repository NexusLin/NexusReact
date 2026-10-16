use actix_web::web;
pub fn config(cfg: &mut web::ServiceConfig) {
    cfg.route(
        "/notices",
        web::get().to(crate::modules::notice::handlers::get_list),
    )
    .route(
        "/notices",
        web::post().to(crate::modules::notice::handlers::post_add),
    )
    .route(
        "/notices/{id}",
        web::get().to(crate::modules::notice::handlers::get_detail),
    )
    .route(
        "/notices",
        web::put().to(crate::modules::notice::handlers::put_update),
    )
    .route(
        "/notices/{id}",
        web::delete().to(crate::modules::notice::handlers::del_delete),
    )
    // 导出模板
    .route(
        "/notices/exporttemplate",
        web::post().to(crate::modules::notice::handlers::export_template),
    );
}
