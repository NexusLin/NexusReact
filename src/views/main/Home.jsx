import React from 'react';
import { Link } from 'react-router-dom';
const Home = () => {
  return (
    <div>
      <h1>主页</h1>
      <Link to="/login">
      <button>点击登录</button>
    </Link>
    </div>
  );
};

export default Home;
