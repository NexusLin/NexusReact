use actix_web::web;
pub fn config(cfg: &mut web::ServiceConfig) {
    // 字典类型
    cfg.route(
        "/menus",
        web::get().to(crate::modules::menu::handlers::get_list),
    )
    .route(
        "/menus",
        web::post().to(crate::modules::menu::handlers::post_add),
    )
    .route(
        "/menus/{id}",
        web::get().to(crate::modules::menu::handlers::get_detail),
    )
    .route(
        "/menus",
        web::put().to(crate::modules::menu::handlers::put_update),
    )
    .route(
        "/menus/{id}",
        web::delete().to(crate::modules::menu::handlers::del_delete),
    );
}
