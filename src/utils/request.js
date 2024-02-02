import axios from 'axios'
const service = axios.create({
    baseURL: '/edu-admin', //import.meta.env.VITE_BASE_URL
    headers: { 'Content-Type': 'application/json;charset=utf-8', },
    timeout: 5000,
})
export default service;