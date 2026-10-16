const crypto=require('crypto');

// 文件上传模块
const express=require('express');
const path=require('path');

// 引入文件上传中间件，用于处理multipart/form-data类型的数据 
const multer=require("multer");
const fs=require('fs');

// uuid
const {v4: uuidv4}=require('uuid'); // 引入 uuid

const router=express.Router();
const connectionPool=require('../../config/db'); // 引入数据库连接池模块

// 引入公共封装方法
const {addCondition,addDateRangeCondition,addPagination,convertKeysToSnakeCase,convertToCamelCase}=require('../../hooks/methods.js');


// 引入接口封装方法
const {addApi}=require('../../hooks/apiMethods.js');


// 公共配置部分
const { server } = require("../../config");
const apiip = server.ip;
const apiport = server.port;
const apiprefix = server.prefix;

// 绝对路径设置-可用
// router.use('/uploads', express.static(path.join(__dirname, '../../uploads')));

// 相对路径设置-可用
// 设置静态文件路径，用于访问上传的文件
router.use('/uploads',express.static('uploads'));


// // 创建文件上传中间件
// const upload = multer({ storage: storage });

// 设置存储上传文件的存储路径和文件名
const storage=multer.diskStorage({
    destination: (req,file,cb) => {
        // 设置上传文件存储的文件夹路径
        // cb(null,'uploads/');

        // 获取当前日期
        const date=new Date();
        const year=date.getFullYear();
        const month=(date.getMonth()+1).toString().padStart(2,'0');
        const day=date.getDate().toString().padStart(2,'0');
        const dateString=`${year}-${month}-${day}`;

        // 设置文件存储路径
        let destination;
        if(file.mimetype.startsWith('image/')) {
            destination=`uploads/img/${dateString}`;
        } else {
            destination=`uploads/file/${dateString}`;
        }
        // 判断目录是否存在，不存在则创建
        // 使用 fs.mkdirSync 的 { recursive: true } 选项，如果目录存在会自动忽略，不会报错
        // 这样就不需要 fs.access 预判了，代码更简洁且是同步执行的
        try {
            fs.mkdirSync(destination,{recursive: true});
        } catch(err) {
            console.error('创建目录失败:',err);
        }

        // ✅ 关键修改：只在这里调用一次 cb，传入最终计算好的 destination
        cb(null,destination);
    },
    filename: (req,file,cb) => {
        // 1. 获取原始文件的扩展名 (例如: .png)
        const ext=path.extname(file.originalname);

        // 2. 生成 UUID (例如: 1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed)
        const uniqueName=uuidv4();
        // 使用原始文件名后缀 + 时间戳防止重名
        // Date.now() +
        cb(null,uniqueName+ext);
    }
});

// 创建 Multer 实例 图像上传
const imageUpload=multer({
    storage: storage,
    limits: {
        fileSize: 10*1024*1024, // 10MB 限制
    },
});

// // 视频上传
// const videoUpload = multer({
//     storage: storage,
//     limits: {
//         fileSize: 100 * 1024 * 1024, // 100MB 限制
//     },
// });

// fileFilter 文件上传
const fileupload=multer({
    // storage: storage,
    storage: multer.memoryStorage(),
});


// 处理图片上传--普通上传image
router.post(`/${apiprefix}/upload/image`,imageUpload.single('file'),(req,res) => {
    console.log('文件传输开始!');
    console.log(req,'请求地');
    // 获取上传的文件信息
    const file=req.file;
    console.log(file,'file');
    // 如果没有文件
    if(!file) {
        return res.status(400).send('uploaded fail');
    } else {
        // 1. 提取基础信息
        const {destination,filename,originalname,size,mimetype}=req.file;
        // console.log(req.file,'====req.file====');
        // 2. 生成 fileUid (如果安装了 uuid 库，使用 uuidv4()，否则使用时间戳+随机数模拟)
        const fileUid=111122;
        // typeof uuidv4 === 'function' ? uuidv4() : `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
        console.log(fileUid,'filename');
        // 3. 构造路径
        const relativePath=`/${destination}/${filename}`; // 例如: /uploads/images/xxx.png
        const fullPath=`http://${apiip}:${apiport}${relativePath}`;
        res.send({
            code: 200,
            data: {
                fileName: req.file.filename, // 使用原始文件名
                fileType: mimetype,     // 使用 MIME 类型
                fileUid: fileUid,       // 唯一标识
                fullPath: fullPath,     // 完整的 HTTP 地址
                relativePath: relativePath, // 相对路径
                size: size              // 文件大小
            },
            msg: "图片上传成功",
        });
    }
});

/**
 * 通用插入方法 (Promise 版)
 * @param {String} sql 
 * @param {Object} data 
 */
const addFile=(sql,data) => {
    return new Promise((resolve,reject) => {
        connectionPool.query(sql,data,(error,results) => {
            if(error) {
                return reject(error);
            }
            resolve(results);
        });
    });
};




// 处理文件上传--普通上传 file
router.post(`/${apiprefix}/upload/file`,fileupload.single('file'),async (req,res) => {
    try {
        console.log('文件传输开始!',`/${apiprefix}/upload/file`);

        //  检查是否有文件
        if(!req.file) {
            return res.status(400).json({code: 400,message: 'No file uploaded.'});
        } else {
            console.log(req,'请求========');
            //  获取文件信息
            const file=req.file;
            console.log(file,'返回========');

            // 校验MD5
            const fileBuffer=req.file.buffer;
            // 计算 MD5 
            const hash=crypto.createHash('md5').update(fileBuffer).digest('hex');

            console.log(`文件 Hash: ${hash}`);
            // 45377fc47d282b689debb1354f3e8f8d

            // 查询数据库中是否存在该文件
            const [existingFiles] = await connectionPool.promise().query(
                'SELECT * FROM files_manage WHERE file_hash = ?',
                [hash]
            );
           
            // 检查查询结果
            if (existingFiles && existingFiles.length > 0) {
                console.log(existingFiles[0], 'existingFiles===');
                // 文件已存在
                return res.json({
                    code: 200,
                    data: existingFiles[0],
                    msg: '上传成功,文件已存在！',
                });

                //返回结果
                // res.json({
                //     code: 200,
                //     data: {
                //         //   url: `http://${apiip}:${apiport}/` + req.file.destination + '/' + req.file.filename,  
                //         // fileName: req.file.filename,
                //         // fileType: file.mimetype,
                //         // size: file.size,
                //         // file_path: req.file.path,
                //         url: `http://${apiip}:${apiport}/${file.destination}/${file.filename}`, // 拼接 URL
                //         dbData: postData // 调试时可以看下存入的数据
                //     },
                // });

            }else{
              
              // 文件不存在，保存文件到服务器
                const uploadDir = path.join(__dirname, '../uploads');
                if (!fs.existsSync(uploadDir)) {
                    fs.mkdirSync(uploadDir, { recursive: true });
                }
                // 生成唯一文件名
                const uniqueFilename = `${Date.now()}_${file.originalname}`;
                const filePath = path.join(uploadDir, uniqueFilename);

                // 写入文件
                fs.writeFileSync(filePath, fileBuffer);

                const file_uid=uuidv4();

                // 保存文件信息到数据库
                const postData={
                    file_name: uniqueFilename,
                    file_path: filePath,
                    file_size: file.size,
                    file_type: file.fieldname,
                    file_uid: file_uid,
                    file_hash: hash,
                    created_by: 53,
                    relative_path: file.destination,
                    // url: `http://${apiip}:${apiport}/${file.destination}/${uniqueFilename}`, // 拼接 URL
                    // dbData: postData // 调试时可以看下存入的数据
                    // created_at:'2026-04-28 16:56:45',
                    // updated_at:'2026-04-28 16:56:45',
                };
                console.log("fileBuffer",postData);

                // uniqueFilename, file.originalname, file.mimetype, file.size, hash, filePath

                // 保存文件信息到数据库
                // const [insertResult] = await connectionPool.promise().query(
                //     `INSERT INTO files_manage 
                //     (file_name, file_path, file_hash,file_size, file_type, file_uid,created_by,created_at) 
                //     VALUES (?, ?, ?, ?, ?, ?, NOW())`,
                //     [postData.file_name, postData.file_path,postData.file_hash,postData.file_size, postData.file_type, postData.file_uid, postData.created_by]
                // );

                const [insertResult] = await connectionPool.promise().query(
                    `INSERT INTO files_manage 
                    (file_name, file_path, file_hash, file_size, file_type, file_uid, created_by, created_at) 
                    VALUES (?, ?, ?, ?, ?, ?, ?, NOW())`,
                    [postData.file_name, postData.file_path, postData.file_hash, postData.file_size, 
                    postData.file_type, postData.file_uid, postData.created_by]
                );


                // 返回新上传的文件信息
                return res.json({
                    code: 200,
                    msg: 'File uploaded successfully',
                    redata:insertResult,
                    data: {
                        // id: result.insertId,
                        // filename: uniqueFilename,
                        // originalname: file.originalname,
                        // mimetype: file.mimetype,
                        // size: file.size,
                        // file_hash: hash,
                        // path: filePath
                    }
                });
            }

        }


        return



        const originalName=req.file.originalname;


       
        
        const file_uid=uuidv4();
        // 3. 准备数据库数据
        const postData={
            file_name: req.file.filename,
            file_path: req.file.path,
            file_size: req.file.size,
            file_type: req.file.fieldname,
            file_uid: file_uid,
            created_by: 53,
            file_hash: hash,
            // created_at:'2026-04-28 16:56:45',
            // updated_at:'2026-04-28 16:56:45',
        };
        console.log(postData,'postData=====')
        // 4. 执行数据库插入操作
        // 数据库表
        const tableName='files_manage';
        const insertSql=`INSERT INTO ${tableName} SET ?`;

        // 5. 执行数据库插入 (等待完成)
        await addFile(insertSql,postData);

        // 6. 返回结果
        res.json({
            code: 200,
            data: {
                //   url: `http://${apiip}:${apiport}/` + req.file.destination + '/' + req.file.filename,  
                // fileName: req.file.filename,
                // fileType: file.mimetype,
                // size: file.size,
                // file_path: req.file.path,
                url: `http://${apiip}:${apiport}/${file.destination}/${file.filename}`, // 拼接 URL
                dbData: postData // 调试时可以看下存入的数据
            },
            msg: '上传成功',
        });

    } catch(error) {
        console.error('文件上传出错:', error);
        return res.status(500).json({
            code: 500,
            msg: 'File upload failed',
            error: error.message
        });
    }
});


// 处理文件流上传--普通上传 file
// router.post(`/${apiprefix}/upload/file`, fileupload.single('file'), (req, res) => {
//     console.log('文件传输开始!',`/${apiprefix}/upload/file`);
//     // 获取上传的文件信息
//     const file = req.file;
//     if (!file) {
//         return res.status(400).send('No file uploaded.');
//     } else {
//         res.json({
//             code: 200,
//             data: file,
//             url: `http://localhost:${PORT}/` + req.file.destination + '/' + req.file.filename,
//         });
//     }
// });

// 设置图片转存为base64位的格式来转存

// 处理图片上传--base64位
// app.post('/api/upload/imagebase', imageUpload.single('image'), (req, res) => {
//     console.log('文件传输开始!');

//     console.log(req);
//     const base64Data = req.body.image; // 假设请求体中包含名为 "image" 的 Base64 图片数据
//     const imageBuffer = Buffer.from(base64Data, 'base64'); // 将 Base64 数据转换为 Buffer

//     // 生成唯一的文件名，例如使用时间戳
//     const filename = `image_${Date.now()}.png`;
//     const imagePath = path.join(__dirname, 'uploaded_images', filename); // 存储图片的路径

//     // 将 Buffer 中的数据写入到文件中
//     fs.writeFile(imagePath, imageBuffer, (err) => {
//         if (err) {
//             console.error('Error saving the image:', err);
//             res.status(500).send('Error saving the image');
//         } else {
//             console.log('Image saved successfully');
//             res.json({
//                 code: 200,
//                 data: file,
//                 // url:`http://localhost:${PORT}`+'/uploads/'+req.file.filename,
//                 url: `http://localhost:${PORT}/` + req.file.destination + '/' + req.file.filename,
//             });
//         }
//     });
// });}








// 视频上传路由
// app.post('/api/upload/video', videoUpload.single('video'), (req, res) => {
//     // 获取上传的文件信息
//     const file = req.file;
//     if (!file) {
//         return res.status(400).send('No file uploaded.');
//     } else {
//         res.json({
//             code: 200,
//             data: file,
//             url: `http://localhost:${PORT}/` + req.file.destination + '/' + req.file.filename,
//         });
//     }
// });



module.exports=router;