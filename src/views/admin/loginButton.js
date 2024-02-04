import React from 'react';
import { Link } from 'react-router-dom';
const Button = () => {
  return (
    <Link to="/login">
      <button>登录</button>
    </Link>
  );
};
export default loginButton;
