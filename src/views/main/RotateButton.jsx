import React, { useState } from 'react';
import './RotateButton.css'; // 引入样式文件
import {getqueryWebInfo} from '@/api/common.js'
const RotateButton = () => {
  const [rotate, setRotate] = useState(false); // 使用状态管理旋转

  const handleClick = () => {
    setRotate(!rotate); // 点击按钮时切换旋转状态
  };

  const handleApi = () => {

    getqueryWebInfo().then((res)=>{
      console.log(res,'res返回信息');
    })
  };

  return (
    <div>
      <button onClick={handleClick}>点击我旋转</button>

      <button onClick={handleApi}>点击我请求接口</button>
      <button>点击我旋转</button>
      <div className={`box ${rotate ? 'rotate' : ''}`}></div>
       {/* 根据旋转状态添加类名 */}
    </div>



  );
};

export default RotateButton;
