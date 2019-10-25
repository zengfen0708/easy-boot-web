import axios from 'axios'
import { Message } from 'element-ui'
import store from '@/store'
import { getToken, removeToken } from '@/utils/auth'
import defaultConfig from '@/settings'
import router from '@/router'

// 创建axios实例
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, //  api的base_url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: defaultConfig.timeout //  请求超时时间
})

// request拦截器
service.interceptors.request.use(
  config => {
    // do something before request is sent
    if (store.getters.token) {
      // 让每个请求携带token--['ZFSimple-Token']为自定义key
      config.headers[defaultConfig.authorizationName] = 'Bearer ' + getToken()
    }

    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// respone拦截器
service.interceptors.response.use(
  response => {
    const res = response.data

    const headersConfig = response.headers

    if (headersConfig['content-type'] === 'application/octet-stream') {
      return res
    }

    if (res.code !== 0) {
      Message({
        message: res.message || 'Error',
        type: 'error',
        duration: defaultConfig.durationTimeout
      })

      if (res.code === 10002 || res.code === 10003) {
        // token 过期重新登录
        location.reload()
        removeToken()
        router.push({ path: '/login' })
      }

      return Promise.reject(new Error(res.msg || 'Error'))
    } else {
      return res
    }
  },
  error => {
    let code = 0
    try {
      code = error.response.status
    } catch (e) {
      if (error.toString().indexOf('Error: timeout') !== -1) {
        Message({
          message: '请求网络错误',
          type: 'error',
          duration: defaultConfig.durationTimeout
        })

        return Promise.reject(error)
      }

      if (error.toString().indexOf('Error: Network Error') !== -1) {
        Message({
          message: '请求网络错误',
          type: 'error',
          duration: defaultConfig.durationTimeout
        })
        return Promise.reject(error)
      }
    }

    console.log('err:' + error) // for debug
    let errorMsg = error.response.data.message

    switch (code) {
      case 500:
        errorMsg = '服务暂时不可用，请刷新重试'
        break
      case 401:
        errorMsg = '请求未授权'
        break
      case 403:
        errorMsg = '请求被拒绝或者请求方式不存在'
        break
      default:
        errorMsg = '服务暂时不可用，请刷新重试'
        break
    }
    Message({
      message: errorMsg,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(new Error(error))
  }
)

export default service
