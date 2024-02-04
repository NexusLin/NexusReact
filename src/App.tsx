import { useState } from 'react'
// import reactLogo from '@/assets/react.svg'
// import viteLogo from '/vite.svg'
import './App.css'


// import RotateButton from '@/views/main/RotateButton.jsx'; // 引入RotateButton组件

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from '@/views/admin/login/Login'; // 导入登录组件
import Home from '@/views/main/Home'; // 导入主页组件
import Admin from '@/views/admin/admin/index'; // 导入主页组件

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} /> {/* 主页路径 */}
        <Route path="/login" element={<Login />} /> {/* 登录页路径 */}
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </Router>
  );
}

export default App;

