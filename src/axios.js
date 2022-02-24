import axios from 'axios';

const baseURL = process.env.NODE_ENV === 'production' ? ip.build : ip.dev;  // eslint-disable-line
var instance = axios.create({ 
  baseURL 
})

instance.defaults.withCredentials = true; // axios跨域请求使用凭证
instance.defaults.timeout = 600000; // 超时设置
instance.all = axios.all;
instance.spread = axios.spread;

instance.interceptors.request.use( (config)=> {
  // 在发送请求之前做些什么
  if (config.method === 'get') {
    if (!config.params) {
      config.params = {};
    }
  } else if (config.method === 'post') {
    if (!config.data) {
      config.data = {};
    }
  }
  config.url = encodeURI(config.url);
  return config;
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error);
});

// 添加相应拦截器
instance.interceptors.response.use((response) => {
  return response;
}, (error) => {
  // 对请求错误做些什么
  return Promise.reject(error);
})

export default instance;