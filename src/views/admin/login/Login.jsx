console.log('我是登录界面');
import React,{ useState ,useEffect}  from 'react';
// import { useHistory } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';


import './Login.css'; // 导入自定义的样式文件

import { getRandomImage,getLogin } from '@/api/common';
const Login = () => {
  // const history = useHistory();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [checkKey, setCheckKey] = useState('');
  const [inputCode, setInputCode] = useState('');

  const [message, setMessage] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [captcha, setCaptcha] = useState('');
  

  const [randCodeData, setRandCodeData] = useState({
    randCodeImage: null,
    requestCodeSuccess: false,
    checkKey: '',
  });
 
  useEffect(() => {
    // 在组件挂载后执行的函数
    handleChangeCheckCode();//加载验证码
  }, []);

   const handleLogin = () => {
    console.log('我是登录信息');
    // 输出表单值
    console.log('Username:', username);
    console.log('Password:', password);
    console.log('captcha:', captcha);
    let data={
      username:username,
      password:password,
      captcha:captcha,
      checkKey:'1629428467008',
    };
    console.log('111',data);
    getLogin(data).then((res)=>{
      console.log('res',res.data);
      if(res.data.code==200){
        // 进行路由跳转
        navigate("/admin")
        // navigate.push('/admin');
        // window.alert(res.message);
        // var truthBeTold = window.confirm("单击“确定”继续。单击“取消”停止。");
        // if (truthBeTold) {
        //   window.alert("欢迎访问我们的 Web 页");
        // }else{
        //   window.alert("再见啦！")
        // }
      }else{
        // window.alert(res.message);
        /* empty */ 
      }
    });

    
    
    // showAlertWithTimeout("这是一条信息", 3000);
    // setTimeout(() => {
    //   window.close();
    // }, 2000);
    
   


    // console.log('randCodeData.randCodeImage:', randCodeData.randCodeImage);

    // 重置表单
    // setUsername('');
    // setPassword('');
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
    getRandomImage('1629428467008').then((res)=>{
      console.log(res);
      // randCodeData.randCodeImage = res.data.result;
      // randCodeData.requestCodeSuccess = true;
      setRandCodeData({
        ...randCodeData,
        requestCodeSuccess:true,
        randCodeImage: res.data.result,
      });
      
      console.log('更改以后的地址',randCodeData);
    });
    
   
    // getCodeInfo(randCodeData.checkKey).then((res) => {
    //   randCodeData.randCodeImage = res;
    //   randCodeData.requestCodeSuccess = true;
    // });
    // getqueryWebInfo().then((res)=>{})
   };


  const showAlertWithTimeout = (message, timeout) => {
    window.alert(message);
    setTimeout(() => {
      window.close();
    }, timeout);
  };
  
  


  return ( 
      <>
      <div className="pagelogin">
       <div className="pageloginbg">
          <div className="pageloginform">
            <form action="#" className="form" id="loginform">
              <h2 className="title">登录</h2>
              <div className="formli">
               <input type="text" placeholder="Username" className="input" 
               value={username} onChange={(e) => setUsername(e.target.value)}/>
              </div>
              <div className="formli">
              <input type="password" placeholder="Password" className="input" 
              value={password} onChange={(e) => setPassword(e.target.value)}/>
              </div>
              <div className="formli">
                <div className="leftcode">
                  <input type="text" placeholder="Code" className="input"
                  value={captcha} onChange={(e) => setCaptcha(e.target.value)} 
                  />
                </div>
                <div className="rightcode">
                <img src={randCodeData.randCodeImage} alt="code Image" className="codeImage" onClick={handleChangeCheckCode}/>
                </div>
              </div>
              <button className="loginbtn" onClick={handleLogin}>登录</button>
            </form>
          </div>
    </div>
  </div>
    </>);
};


export default Login;