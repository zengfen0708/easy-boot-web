import { initData, exportData } from '@/api/data'
import permission from '@/directive/permission/index.js' // 权限判断指令
import checkPermission from '@/utils/permission' // 权限判断函数
import exportUtils from '@/utils/exportUtils'
import { parseTime } from '@/utils/index'

import UploadComponent from '@/components/Upload/index'

export default {
  // 注册局部指令
  directives: { permission },
  data() {
    return {
      downloadLoading: false,
      loading: true,
      data: [],
      page: 0,
      size: 10,
      total: 0,
      url: '',
      exportUrl: '',
      params: {},
      query: {},
      time: 180,
      isAdd: false,
      isUpload: false
    }
  },
  components: {
    UploadComponent
  },
  methods: {
    parseTime,
    checkPermission,
    async init() {
      if (!await this.beforeInit()) {
        return
      }
      const _this = this
      return new Promise((resolve, reject) => {
        _this.loading = true

        initData(this.url, this.params).then(res => {
          _this.total = res.data.totalCount
          _this.data = res.data.list
          setTimeout(() => {
            _this.loading = false
          }, _this.time)
          resolve(res)
        }).catch(err => {
          _this.loading = false
          reject(err)
        })
      })
    },
    beforeInit() {
      return true
    },
    pageChange(e) {
      this.page = e - 1
      this.init()
    },
    sizeChange(e) {
      this.page = 0
      this.size = e
      this.init()
    },
    // 预防删除第二页最后一条数据时，或者多选删除第二页的数据时，页码错误导致请求无数据
    dleChangePage(size) {
      if (size === undefined) {
        size = 1
      }
      if (this.data.length === size && this.page !== 0) {
        this.page = this.page - 1
      }
    },
    toQuery() {
      this.page = 0
      this.init()
    },
    // 导出文件信息
    downloadFile(fileName) {
      const _this = this
      _this.downloadLoading = true
      // 导出文件
      exportData(_this.exportUrl, _this.params).then(res => {
        exportUtils(res, fileName)
        setTimeout(() => {
          _this.downloadLoading = false
        }, _this.time)
      }).catch(err => {
        this.downloadLoading = false
        this.$message({
          type: 'warning',
          message: '导出失败，请联系管理员！'
        })
        console.log(err)
      })
    }
  }

}
