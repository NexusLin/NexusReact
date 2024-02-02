import { useState } from 'react'
import reactLogo from '@/assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'


import RotateButton from '@/views/main/RotateButton.jsx'; // 引入RotateButton组件

function App() {
  const [count, setCount] = useState(0)
  return (
    <>
    <RotateButton />
    </>
  )
}

export default App
