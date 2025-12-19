use actix_web::web;
pub fn config(cfg: &mut web::ServiceConfig) {
  // 文章类型
  cfg.route("/articles", web::get().to(crate::modules::article::handlers::get_list))
  .route("/articles", web::post().to(crate::modules::dict::handlers::post_add))
  .route("/articles", web::put().to(crate::modules::dict::handlers::put_update))
  .route("/articles/optionselect", web::get().to(crate::modules::dict::handlers::get_all_dict_type))
  .route("/articles/{id}", web::get().to(crate::modules::dict::handlers::get_detail))
  .route("/articles/{id}", web::delete().to(crate::modules::dict::handlers::del_delete));
}