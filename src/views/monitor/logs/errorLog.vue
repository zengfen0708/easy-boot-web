<template>
  <div class="app-container">
    <Search :query="query" />
    <!--表格渲染-->
    <el-table v-loading="loading" :data="data" size="small" style="width: 100%;">
      <el-table-column prop="username" label="用户名" />
      <el-table-column prop="requestIp" label="IP" />
      <el-table-column prop="description" label="描述" />
      <el-table-column :show-overflow-tooltip="true" prop="method" label="方法名称" />
      <el-table-column :show-overflow-tooltip="true" prop="params" label="参数" />
      <el-table-column prop="createTime" label="创建日期">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="异常详情" width="100px">
        <template slot-scope="scope">
          <el-button size="mini" type="text" @click="info(scope.row.id)">查看详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog :visible.sync="dialog" title="异常详情" append-to-body top="0" width="85%">
      <span>
        {{ errorInfo }}
      </span>
    </el-dialog>
    <!--分页组件-->
    <el-pagination
      :total="total"
      :current-page="page + 1"
      style="margin-top: 8px;"
      layout="total, prev, pager, next, sizes"
      @size-change="sizeChange"
      @current-change="pageChange"
    />
  </div>
</template>

<script>
import initData from '@/mixins/initData'
import { parseTime } from '@/utils/index'
import { getErrDetail } from '@/api/system/log'
import Search from './search'
export default {
  components: { Search },
  mixins: [initData],
  data() {
    return {
      errorInfo: '', dialog: false
    }
  },
  created() {
    this.$nextTick(() => {
      this.init()
    })
  },
  methods: {
    parseTime,
    beforeInit() {
      this.url = 'system/log/list'
      this.params = { page: this.page, size: this.size }
      this.query.logType = 1
      const query = this.query
      if (query) {
        // 对象合并
        Object.assign(this.params, query)
      }
      return true
    },
    info(id) {
      this.dialog = true
      const data = { id }
      getErrDetail(data).then(res => {
        this.errorInfo = res.data
      })
    }
  }
}
</script>

<style scoped>

</style>
