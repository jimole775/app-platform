export default new class Storage {
  constructor() {
    this.storage = window.localStorage
  }
  setItem(name, data) {
    var finalData = ''
    try {
      if (typeof data === 'object') { //如果是object类型，就转成json数据
        finalData = JSON.stringify(data)
      } else {
        finalData = data
      }
    } catch (e) {
      throw e.message
    }
    this.storage.setItem(name, finalData)
  }

  getItem(name) {
    var finalData = ''
    try {
      const originData = this.storage.getItem(name) || ''
      if (/[\{\[]/.test(originData)) { //判断是否是json数据
        finalData = JSON.parse(originData)
      } else if (originData && originData.length > 0 && typeof originData === 'string' && !isNaN(originData)) {
        finalData = parseFloat(originData)
      } else if (originData === 'null') {
        finalData = null
      } else if (originData === 'undefined') {
        finalData = undefined
      } else if (originData === 'true') {
        finalData = true
      } else if (originData === 'false') {
        finalData = false
      } else {
        finalData = originData
      }
    } catch (e) {
      throw e.message
    }
    return finalData
  }

  removeItem(name) {
    this.storage.removeItem(name)
  }
}
