use actix_web::{HttpResponse, http::header::ContentDisposition};
use std::io::Cursor;
use umya_spreadsheet::{new_file, writer};

// 通用模板导出函数
pub async fn export_excel_template(headers: Vec<&str>, filename: &str) -> HttpResponse {
    // 创建一个带默认 Sheet1 的工作簿
    let mut book = new_file();
    let sheet = book.get_sheet_by_name_mut("Sheet1").unwrap();

    // 设置表头
    for (i, header) in headers.iter().enumerate() {
        sheet.get_cell_mut(((i + 1) as u32, 1)).set_value(*header);
    }

    // 写到内存
    let mut buffer = Cursor::new(Vec::new());
    // unsafe {// }
    writer::xlsx::write_writer(&book, &mut buffer).unwrap();
    let bytes = buffer.into_inner();

    HttpResponse::Ok()
        .append_header((
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        ))
        .append_header(ContentDisposition {
            disposition: actix_web::http::header::DispositionType::Attachment,
            parameters: vec![actix_web::http::header::DispositionParam::Filename(
                filename.to_string(),
            )],
        })
        .append_header((
            "Access-Control-Expose-Headers",
            "Content-Disposition, Content-Type",
        ))
        .body(bytes)
}
