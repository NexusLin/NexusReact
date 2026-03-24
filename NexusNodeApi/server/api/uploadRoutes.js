// 文件上传模块
const express = require('express');
const path = require('path');
const multer = require("multer"); // 引入文件上传中间件，用于处理multipart/form-data类型的数据 // 文件上传
const fs = require('fs');


const router = express.Router();
const connectionPool = require('../../config/db'); // 引入数据库连接池模块
const { addCondition, addDateRangeCondition, addPagination } = require('../../hooks/methods.js'); // 引入封装方法


// 公共配置部分
const { apiip, apiport } = require("../../config");



// // 创建文件上传中间件
// const upload = multer({ storage: storage });



// 设置上传文件的存储路径和文件名
const storageps = multer.diskStorage({
    destination: (req, file, cb) => {
        // 设置上传文件存储的文件夹路径
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        // 设置文件名，避免重名覆盖
        cb(null, Date.now() + path.extname(file.originalname)); // 使用当前时间戳 + 文件扩展名
    }
});


// 设置存储引擎
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // cb(null, 'uploads/');
        // 获取当前日期
        const date = new Date();
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        const dateString = `${year}-${month}-${day}`;

        // 设置文件存储路径
        let destination;
        if (file.mimetype.startsWith('image/')) {
            destination = `uploads/${dateString}/img`;
        } else {
            destination = `uploads/${dateString}/file`;
        }
        // 判断目录是否存在，不存在则创建
        fs.access(destination, (error) => {
            console.log('文件存储判断');
            if (error) {
                fs.mkdirSync(destination, { recursive: true });
            }
            cb(null, destination);
        });

        // 创建文件夹
        // fs.mkdirSync(destination, { recursive: true });

        cb(null, destination);
    },
    filename: (req, file, cb) => {
        // 设置文件名为原始文件名
        // cb(null, file.originalname);
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});



// 创建 Multer 实例 图像上传
const imageUpload = multer({
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB 限制
    },
});

// 视频上传
const videoUpload = multer({
    storage: storage,
    limits: {
        fileSize: 100 * 1024 * 1024, // 100MB 限制
    },
});

// fileFilter 文件上传
const fileupload = multer({
    storage: storage,
});




// 设置静态文件路径，用于访问上传的文件
router.use('/uploads', express.static('uploads'));


// 处理图片上传--普通上传 image
router.post('/api/upload/image', imageUpload.single('file'), (req, res) => {
    console.log('文件传输开始!');
    console.log(req, '请求地');
    // 获取上传的文件信息
    const file = req.file;
    console.log(file, 'file');
    // 如果没有文件
    if (!file) {
        return res.status(400).send('uploaded fail');
    } else {
        res.send({
            code: 200,
            // data: file,
            // url:`http://localhost:${PORT}`+'/uploads/'+req.file.filename,
            imgpath: `http://${apiip}:${apiport}/` + req.file.destination + '/' + req.file.filename,
            imgurl: `/` + req.file.destination + '/' + req.file.filename,
            message: "上传成功",
            fileName: '图片'+req.file.filename,
        });
        //const avatarUrl = `${req.protocol}://${req.get('host')}/${file.filename}`;
        return
        // console.log('文件传输结束!');
    }
});


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
// });



// 处理文件上传
// app.post('/api/upload/file', upload.single('file'), (req, res) => {
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



module.exports = router;