
import defaultSettings from '@/settings'

const api = {
  state: {
    // Sql 监控
    sqlApi: defaultSettings.base_api + '/druid',
    // swagger
    swaggerApi: defaultSettings.base_api + '/doc.html',
    // 文件上传
    uploadApi: defaultSettings.base_api + '/'
  }
}

export default api
