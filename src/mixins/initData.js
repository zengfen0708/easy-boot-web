import { initData } from '@/api/data'
import permission from '@/directive/permission/index.js' // 权限判断指令
import checkPermission from '@/utils/permission' // 权限判断函数
import { parseTime } from '@/utils/index'

export default {
  // 注册局部指令
  directives: { permission },
  data() {
    return {
      loading: true,
      data: [],
      page: 0,
      size: 10,
      total: 0,
      url: '',
      params: {},
      query: {},
      time: 180,
      isAdd: false
    }
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
    }
  }
}
