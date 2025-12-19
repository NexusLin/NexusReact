use actix_web::web;
pub fn config(cfg: &mut web::ServiceConfig) {
    cfg.route(
        "/roles",
        web::get().to(crate::modules::role::handlers::get_list),
    )
    .route(
        "/roles",
        web::post().to(crate::modules::role::handlers::post_add),
    )
    .route(
        "/roles/{id}",
        web::get().to(crate::modules::role::handlers::get_detail),
    )
    .route(
        "/roles",
        web::put().to(crate::modules::role::handlers::put_update),
    )
    .route(
        "/roles/{id}",
        web::delete().to(crate::modules::role::handlers::del_delete),
    );
}
