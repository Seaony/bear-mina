// const apiURL = 'http://bear-api.test/api'
const apiURL = 'https://bear.todev.ink/api'

class WxRequest {
  constructor(config) {
    let header = {
      Accept: 'application/vnd.egg.v1+json',
      Authorization: wx.getStorageSync('token')
    }
    this.defaultOptions = Object.assign({
      method: (config && config.params && config.params.method) || 'GET',
      data: {},
      header: header
    }, config.options, { url: apiURL + config.options.url })
    this.params = config.params
  }

  post() {
    this.defaultOptions = Object.assign(this.defaultOptions, { method: 'POST' })
    return this.request()
  }

  get() {
    this.defaultOptions = Object.assign(this.defaultOptions, { method: 'GET' })
    return this.request()
  }

  delete() {
    this.defaultOptions = Object.assign(this.defaultOptions, { method: 'DELETE' })
    return this.request()
  }

  put() {
    this.defaultOptions = Object.assign(this.defaultOptions, { method: 'PUT' })
    return this.request()
  }

  request() {
    const options = this.defaultOptions,
      that = this
    return new Promise((resolve, reject) => {
      wx.request(
        Object.assign({}, options, {
          success: function(res) {
            that
            .success(res)
            .then((data) => resolve(data))
            .catch((error) => reject(error))
          },
          complete: function(res) {}
        })
      )
    })
  }

  success(result) {
    return new Promise((resolve, reject) => {
      if (result.statusCode === 401) {
        wx.setStorageSync('token', null)
      }
      // wx.uploadFile返回的data只有string类型，不会根据content-type自动转object
      if (typeof result.data === 'string' && result.data !== "") {
        result.data = JSON.parse(result.data)
      }
      if (result.statusCode >= 200 && result.statusCode < 400) {
        resolve(result.data)
      } else {
        wx.showToast({ title: result.data.message, icon: 'none' })
        reject(result.data)
      }
    })
  }

  upload() {
    var that = this
    return new Promise((resolve, reject) => {
      wx.uploadFile(
        Object.assign({}, this.defaultOptions, {
          filePath: this.defaultOptions.data.file_path,
          name: this.defaultOptions.data.name ? this.defaultOptions.data.name : 'image',
          formData: this.defaultOptions.data,
          success: function(res) {
            that
              .success(res)
              .then((data) => resolve(data))
              .catch((error) => reject(error))
          },
          complete: function(res) {}
        })
      )
    })
  }
}

export default function request(url, data, params) {
  return new WxRequest({ options: { url: url, data: data }, params: params })
}
