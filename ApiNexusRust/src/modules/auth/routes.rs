use actix_web::web;
pub fn config(cfg: &mut web::ServiceConfig) {
  cfg.route("/register", web::post().to(crate::modules::user::handlers::register_users));
  cfg.route("/login", web::post().to(crate::modules::user::handlers::login_users));
  cfg.route("/getRouters", web::get().to(crate::modules::auth::handlers::get_routers));
  cfg.route("/logout", web::post().to(crate::modules::user::handlers::logout_users));
  cfg.route("/getInfo", web::get().to(crate::modules::user::handlers::get_info));
}