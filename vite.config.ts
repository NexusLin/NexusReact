import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path';
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
        host: true, //host设置为true才可以使用network的形式，以ip访问项目
        port: 3012, // 端口号
        // port: 8808, // 端口号
        https: false,
        open: false, //  true 自动打开浏览器自动打开浏览器
        cors: true, // 跨域设置允许
        // strictPort: true,  // 如果端口已占用直接退出
         //admin部分接口
        proxy: {
            '/edu-admin': {
                target: 'http://123.56.11.22:1481/', //线上版本
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/edu-admin/, '/edu-admin')
            },
        },
        // pc部分接口
        // proxy: {
        //     '/edu-pc': {
        //         target: 'http://123.56.11.22:1483/', //线上版本
        //         changeOrigin: true,
        //         rewrite: (path) => path.replace(/^\/edu-pc/, '/edu-pc')
        //     },
        // },

        // proxy: {
        //   "/dev-api": {
        //     target: `http://tj.wuzhengai.com/dev-api`, // 生产接口地址
        //     changeOrigin: true,
        //     rewrite: (path) => path.replace(/^\/dev-api/, ""),
        //   },
        // },
    }, 
  resolve: {
    alias: {
      '@components': '/src/components',
      '@': path.resolve(__dirname, './src')
    }
  }
})


