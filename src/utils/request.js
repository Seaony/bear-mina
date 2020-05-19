import wepy from '@wepy/core'

const apiURL = 'http://egg.test/api'

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
    wx.hideLoading()
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
          complete: function(res) {
            wx.hideLoading()
          }
        })
      )
    })
  }

  success(result) {
    return new Promise((resolve, reject) => {
      if (result.statusCode >= 200 && result.statusCode < 400) {
        resolve(result.data)
      } else {
        wx.showToast({ title: result.data.message, icon: 'none' })
        reject(result.data)
      }
    })
  }
}

export default function request(url, data, params) {
  return new WxRequest({ options: { url: url, data: data }, params: params })
}
