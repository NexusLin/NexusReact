use actix_web::web;
pub fn config(cfg: &mut web::ServiceConfig) {
  cfg.route("/setting", web::post().to(crate::modules::setting::handlers::get_detail));
}