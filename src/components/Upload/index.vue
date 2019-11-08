<template>
  <el-dialog
    title="批量导入数据"
    :close-on-click-modal="false"
    :visible.sync="dialog"
  >
    <div v-loading="downloadLoading" element-loading-text="加载中">
      <el-upload
        ref="upload"
        class="upload-demo"
        drag
        :limit="1"
        :show-file-list="false"
        accept=".xlsx,.xls"
        :action="uploadUrl"
        :before-upload="beforeUpload"
        :on-success="handleSuccess"
        :on-error="handleError"
        :headers="uploadHeaders"
      >
        <i class="el-icon-upload" />
        <div class="el-upload__text">
          <em>导入文件</em>
        </div>
        <div slot="tip" class="el-upload__tip excel-upload-input">只能上传xls/xlsx文件，且不文件大小超过10MB</div>
        <div slot="tip" class="el-upload__tip">
          <el-button type="text" size="medium" @click="download">点击下载导入模板</el-button>
          <el-button v-if="errorExcel" type="text" size="medium" @click="downloadErrorFile">点击下载上传Excel错误</el-button>
        </div>
      </el-upload>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="resetInfo">确 定</el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import { downloadFile, downloadErrorFile } from '@/api/data'
import exportUtils from '@/utils/exportUtils'
import { getToken } from '@/utils/auth'

export default {
  props: {
    fileName: {
      type: String,
      required: true
    },
    fileUrl: {
      type: String,
      required: true
    },
    onSuccess: Function// eslint-disable-line
  },
  data() {
    return {
      dialog: false,
      loading: false,
      errorExcel: false,
      errorPath: '',
      errorName: '',
      downloadLoading: false,
      uploadHeaders: { 'ZFSimple-Token': 'Bearer ' + getToken() },
      uploadUrl: ''
    }
  },
  methods: {
    // 上传文件校验
    beforeUpload(file) {
      let fileName = []
      fileName = file.name.split('.')
      const extension = fileName[fileName.length - 1] === 'xls'
      const extension2 = fileName[fileName.length - 1] === 'xlsx'
      if (!extension && !extension2) {
        this.$message({
          message: '上传模版只能是xls、xlsx格式！',
          type: 'warning'
        })
        return false
      }
      const isLt1M = file.size / 1024 / 1024 < 10
      if (!isLt1M) {
        this.$message({
          message: '上传模版大小不能超过10MB！',
          type: 'warning'
        })
        return false
      }
      const _this = this

      return new Promise((resolve, reject) => {
        this.$nextTick(() => {
          _this.uploadUrl = _this.$store.state.api.uploadApi + _this.fileUrl
          _this.downloadLoading = true
          resolve()
        })
      })
    },
    download() {
      // 下载导入模板
      const _this = this
      const filename = _this.fileName
      _this.downloadLoading = true
      const params = { fileName: _this.fileName }
      downloadFile(params).then(res => {
        exportUtils(res, filename)
        setTimeout(() => {
          _this.downloadLoading = false
        }, _this.time)
      }).catch(err => {
        this.downloadLoading = false
        this.$message({
          type: 'warning',
          message: '下载导入模板导出失败，请联系管理员！'
        })
        console.log(err)
      })
    },
    downloadErrorFile() {
      const _this = this
      const filename = _this.errorName
      _this.downloadLoading = true
      const params = { fileName: filename, path: _this.errorPath }
      downloadErrorFile(params).then(res => {
        exportUtils(res, filename)
        setTimeout(() => {
          _this.downloadLoading = false
        }, _this.time)
      }).catch(err => {
        this.downloadLoading = false
        this.$message({
          type: 'warning',
          message: '点击下载上传Excel错误导出失败，请联系管理员！'
        })
        console.log(err)
      })
    },
    resetInfo() {
      this.dialog = false
      this.loading = false
      this.errorExcel = false
      this.errorPath = ''
      this.errorName = ''
      this.downloadLoading = false

      this.onSuccess()
    },
    // 文件上传成功
    handleSuccess(response, file, fileList) {
      console.log(response)
      this.downloadLoading = false
      const _this = this
      if (response && response.code === 0) {
        this.$message({
          message: '导入数据成功',
          type: 'success',
          duration: 1500,
          onClose: () => {
            _this.dialog = false
            _this.onSuccess()
          }
        })
      } else {
        _this.$message.error(response.message)
        if (response.data) {
          _this.errorExcel = response.data.errorExcel
          _this.errorName = response.data.errorName
          _this.errorPath = response.data.errorPath
        }
      }
      _this.$refs.upload.clearFiles()
    },
    // 监听上传失败
    handleError(e, file, fileList) {
      this.downloadLoading = false
      console.log(e)
      this.$message({
        title: '导入文件失败',
        type: 'error',
        duration: 2500
      })
    }

  }
}
</script>

<style scoped>
.excel-upload-input{
  color: red;
}

</style>
