
// 文件下载
export default function fileDownload(data, fileName) {
  const blob = new Blob([data], {
    type: 'application/octet-stream'
  })
  const filename = fileName || 'filename.xls'
  if (typeof window.navigator.msSaveBlob !== 'undefined') {
    window.navigator.msSaveBlob(blob, filename)
  } else {
    var blobURL = window.URL.createObjectURL(blob)
    var tempLink = document.createElement('a')
    tempLink.style.display = 'none'
    tempLink.href = blobURL
    tempLink.setAttribute('download', filename)
    if (typeof tempLink.download === 'undefined') {
      tempLink.setAttribute('target', '_blank')
    }
    document.body.appendChild(tempLink)
    tempLink.click()
    document.body.removeChild(tempLink)
    window.URL.revokeObjectURL(blobURL)
  }
}

