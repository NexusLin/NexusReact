console.log('我是admin界面');
import React, { useState, useEffect } from 'react';
// import { getRandomImage,getLogin } from '@/api/common';


const admin = () => {
    const [randCodeData, setRandCodeData] = useState({
        randCodeImage: null,
        requestCodeSuccess: false,
        checkKey: '',
    });

    useEffect(() => {
        // 在组件挂载后执行的函数

    }, []);

    const handleLogin = () => {
        console.log('handleLogin');

    };

    const handleChangeCheckCode = () => {
        console.log('我是验证码');
        //TODO 兼容mock和接口，暂时这样处理
        // formData.inputCode = '';
        //  setRandCodeData({
        //   ...randCodeData,
        //   randCodeImage: '1',
        //   requestCodeSuccess: '222',
        //   checkKey: '1629428467008',
        // });

        // randCodeData.checkKey = 1629428467008; //new Date().getTime();
        // getRandomImage('1629428467008').then((res)=>{
        //   console.log(res);
        //   // randCodeData.randCodeImage = res.data.result;
        //   // randCodeData.requestCodeSuccess = true;
        //   setRandCodeData({
        //     ...randCodeData,
        //     requestCodeSuccess:true,
        //     randCodeImage: res.data.result,
        //   });

        //   console.log('更改以后的地址',randCodeData);
        // }); 
    };
    return (
        <div>
            <div className="adminlogin">
                <div className="adleft">
                    <div className="adleftli">1111</div>
                </div>
                <div className="adright">

                </div>
            </div>
        </div>
    );
};


export default admin;